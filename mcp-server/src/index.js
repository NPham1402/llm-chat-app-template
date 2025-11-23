#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Sample product data
const products = [
  { id: 1, name: "Phân bón hữu cơ", category: "fertilizer", price: 150000, stock: 100 },
  { id: 2, name: "Thuốc trừ sâu sinh học", category: "pesticide", price: 200000, stock: 50 },
  { id: 3, name: "Hạt giống rau sạch", category: "seeds", price: 50000, stock: 200 },
  { id: 4, name: "Dụng cụ làm vườn", category: "tools", price: 300000, stock: 30 },
];

// Sample FAQs
const faqs = [
  {
    question: "Làm thế nào để chăm sóc cây trồng hữu cơ?",
    answer: "Cây trồng hữu cơ cần được tưới nước đều đặn, bón phân hữu cơ và kiểm soát sâu bệnh bằng phương pháp tự nhiên.",
  },
  {
    question: "Sản phẩm nào phù hợp cho vườn rau nhỏ?",
    answer: "Phân bón hữu cơ và hạt giống rau sạch là lựa chọn tốt nhất cho vườn rau nhỏ.",
  },
];

// Create MCP Server instance
const server = new Server(
  {
    name: "chatbox-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_products",
        description: "Search for products by name or category",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query (product name or category)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_product_details",
        description: "Get detailed information about a specific product",
        inputSchema: {
          type: "object",
          properties: {
            product_id: {
              type: "number",
              description: "Product ID",
            },
          },
          required: ["product_id"],
        },
      },
      {
        name: "search_faqs",
        description: "Search frequently asked questions",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query for FAQs",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "calculate_total",
        description: "Calculate total price for multiple products",
        inputSchema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "number" },
                  quantity: { type: "number" },
                },
                required: ["product_id", "quantity"],
              },
              description: "Array of product IDs and quantities",
            },
          },
          required: ["items"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_products": {
        const query = args.query.toLowerCase();
        const results = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case "get_product_details": {
        const product = products.find((p) => p.id === args.product_id);
        if (!product) {
          return {
            content: [
              {
                type: "text",
                text: "Product not found",
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      }

      case "search_faqs": {
        const query = args.query.toLowerCase();
        const results = faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case "calculate_total": {
        let total = 0;
        const details = [];
        
        for (const item of args.items) {
          const product = products.find((p) => p.id === item.product_id);
          if (product) {
            const subtotal = product.price * item.quantity;
            total += subtotal;
            details.push({
              product: product.name,
              quantity: item.quantity,
              unit_price: product.price,
              subtotal,
            });
          }
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  items: details,
                  total,
                  formatted_total: `${total.toLocaleString("vi-VN")} VNĐ`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "chatbox://products/all",
        name: "All Products",
        description: "List of all available products",
        mimeType: "application/json",
      },
      {
        uri: "chatbox://faqs/all",
        name: "All FAQs",
        description: "List of all frequently asked questions",
        mimeType: "application/json",
      },
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "chatbox://products/all":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(products, null, 2),
          },
        ],
      };

    case "chatbox://faqs/all":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(faqs, null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ChatBox MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
