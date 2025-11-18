import { Hono } from "hono";
import { Env, ChatMessage } from "./types";
import { cors } from 'hono/cors';

const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// Convert JSON config to readable system prompt
function buildSystemPrompt(config: any, productContext: any[]): string {
  let prompt = `${config.prompt.content}\n\n**QUY TẮC BẮT BUỘC:**\n\n`;
  
  config.rules.forEach((rule: any, index: number) => {
    prompt += `${index + 1}. **${rule.rule_name}:** ${rule.action_required}\n`;
    if (rule.example_input && rule.example_output) {
      prompt += `   → Ví dụ:\n   User: "${rule.example_input}"\n   AI: "${rule.example_output}"\n`;
    }
    prompt += '\n';
  });

  if (config.context && config.context.length > 0) {
    prompt += `**CONTEXT TEMPLATES:**\n\n`;
    config.context.forEach((ctx: any) => {
      prompt += `${ctx.template_name}: ${ctx.template_content}\n\n`;
    });
  }

  prompt += `**DANH SÁCH SẢN PHẨM:**\n${JSON.stringify(productContext, null, 2)}`;
  
  return prompt;
}

const SYSTEM_PROMPT ={
    "prompt": {
        "id": 1,
        "content": "Bạn là chuyên viên tư vấn sản phẩm cây cảnh tại Nông Lâm Viên.",
        "version": "2.0",
        "is_active": 1,
        "created_at": "2025-11-13 03:30:04",
        "updated_at": "2025-11-13 03:30:04"
    },
    "rules": [
        {
            "id": 1,
            "rule_name": "Use Table for Multiple Products",
            "rule_type": "response_format",
            "condition_trigger": "User query returns 2+ products",
            "action_required": "MUST format response as Markdown table with columns: Tên sản phẩm | Giá (VND) | Tình trạng",
            "example_input": "Tìm cây Baby",
            "example_output": "| Tên sản phẩm | Giá (VND) | Tình trạng |\\n|--------------|-----------|------------|\\n| Succulent Mix Baby | 794,000 | Còn hàng |",
            "priority": 100,
            "is_active": 1,
            "created_at": "2025-11-13 03:24:10",
            "updated_at": "2025-11-13 03:24:10",
            "prompt_id": 1
        },
        {
            "id": 2,
            "rule_name": "No Stock Number Disclosure",
            "rule_type": "data_handling",
            "condition_trigger": "User asks about stock/inventory",
            "action_required": "Only respond \"Còn hàng\" if stock > 0, or \"Hết hàng\" if stock = 0. NEVER reveal exact stock numbers",
            "example_input": "Còn bao nhiêu cây Snake Plant?",
            "example_output": "Snake Plant Mini hiện đang còn hàng. Bạn có muốn đặt hàng không?",
            "priority": 95,
            "is_active": 1,
            "created_at": "2025-11-13 03:24:10",
            "updated_at": "2025-11-13 03:24:10",
            "prompt_id": 1
        },
        {
            "id": 3,
            "rule_name": "Block ID-based Queries",
            "rule_type": "security",
            "condition_trigger": "User input contains product ID or SKU (numeric or format PL-XXXXXX)",
            "action_required": "Return error: \"Xin lỗi, tôi không thể tra cứu sản phẩm bằng mã ID. Vui lòng nhập tên sản phẩm.\"",
            "example_input": "44",
            "example_output": "Xin lỗi, tôi không thể tra cứu sản phẩm bằng mã ID. Vui lòng nhập tên sản phẩm để tôi có thể hỗ trợ bạn tốt hơn.",
            "priority": 90,
            "is_active": 1,
            "created_at": "2025-11-13 03:24:11",
            "updated_at": "2025-11-13 03:24:11",
            "prompt_id": 1
        },
        {
            "id": 4,
            "rule_name": "Suggest API for Integration",
            "rule_type": "api_usage",
            "condition_trigger": "User asks about data integration, API, or system connection",
            "action_required": "Provide relevant API endpoints with examples. Direct to /api/docs for full documentation",
            "example_input": "Làm sao để lấy danh sách sản phẩm vào website?",
            "example_output": "Bạn có thể lấy danh sách sản phẩm qua API:\\n\\nGET /api/products\\n\\nVí dụ response:\\n```json\\n[{\"id\": 1, \"title\": \"ZZ Plant Mini\", \"price_vnd\": 910000}]\\n```\\n\\nXem tài liệu đầy đủ: /api/docs",
            "priority": 85,
            "is_active": 1,
            "created_at": "2025-11-13 03:24:12",
            "updated_at": "2025-11-13 03:24:12",
            "prompt_id": 1
        },
        {
            "id": 5,
            "rule_name": "Never Fabricate Data",
            "rule_type": "data_handling",
            "condition_trigger": "User asks about information not in provided data",
            "action_required": "Respond: \"Tôi không có dữ liệu về vấn đề này. Nếu bạn cần thông tin này, vui lòng liên hệ bộ phận hỗ trợ khách hàng.\"",
            "example_input": "Chính sách bảo hành của shop là gì?",
            "example_output": "Tôi không có dữ liệu về chính sách bảo hành. Nếu bạn cần thông tin này, vui lòng liên hệ với bộ phận hỗ trợ khách hàng. Xin cám ơn.",
            "priority": 100,
            "is_active": 1,
            "created_at": "2025-11-13 03:24:13",
            "updated_at": "2025-11-13 03:24:13",
            "prompt_id": 1
        },
        {
            "id": 6,
            "rule_name": "Maintain Professional Vietnamese",
            "rule_type": "response_format",
            "condition_trigger": "All responses",
            "action_required": "Always respond in Vietnamese. Use professional, friendly tone. Address customer as \"bạn\"",
            "example_input": "Hi",
            "example_output": "Xin chào! Tôi là trợ lý tư vấn của Nông Lâm Viên. Bạn cần tư vấn về sản phẩm nào ạ?",
            "priority": 80,
            "is_active": 1,
            "created_at": "2025-11-13 03:24:14",
            "updated_at": "2025-11-13 03:24:14",
            "prompt_id": 1
        }
    ],
    "context": [
        {
            "id": 1,
            "template_name": "Product List for AI",
            "context_type": "product_list",
            "template_content": "Danh sách sản phẩm hiện có:\\n{{products}}",
            "variables": "[\"{{products}}\"]",
            "use_case": "Inject vào system prompt để AI biết products có sẵn",
            "is_active": 1,
            "created_at": "2025-11-13 03:24:14",
            "updated_at": "2025-11-13 03:24:14",
            "prompt_id": 1
        },
        {
            "id": 2,
            "template_name": "API Endpoints Info",
            "context_type": "api_docs",
            "template_content": "**THÔNG TIN API ENDPOINTS:**\nKhi khách hàng cần tra cứu dữ liệu chi tiết, bạn có thể hướng dẫn họ sử dụng các API sau:\n{{api_list}}\n\n**Ví dụ sử dụng:**\n- Lấy tất cả sản phẩm: GET /api/products\n- Tìm kiếm sản phẩm: GET /api/products/search/:query\n- Xem tài liệu đầy đủ: /api/docs",
            "variables": "[\"{{api_list}}\"]",
            "use_case": "Thêm vào system prompt khi user hỏi về API/integration",
            "is_active": 1,
            "created_at": "2025-11-13 03:24:15",
            "updated_at": "2025-11-13 03:24:15",
            "prompt_id": 1
        },
        {
            "id": 3,
            "template_name": "Service List for AI",
            "context_type": "service_info",
            "template_content": "Danh sách dịch vụ:\\n{{services}}",
            "variables": "[\"{{services}}\"]",
            "use_case": "Inject khi user hỏi về services",
            "is_active": 1,
            "created_at": "2025-11-13 03:24:16",
            "updated_at": "2025-11-13 03:24:16",
            "prompt_id": 1
        },
        {
            "id": 4,
            "template_name": "Policy Info for AI",
            "context_type": "policy_info",
            "template_content": "Chính sách của shop:\\n{{policies}}",
            "variables": "[\"{{policies}}\"]",
            "use_case": "Inject khi user hỏi về policies",
            "is_active": 1,
            "created_at": "2025-11-13 03:24:17",
            "updated_at": "2025-11-13 03:24:17",
            "prompt_id": 1
        }
    ]
}
const app = new Hono<{ Bindings: Env }>();

// Cache product data globally
let productData: any[] | null = null;

app.use("*", async (c, next) => {
  if (!productData) {
    // Fetch directly from database instead of calling own API
    const db = c.env.DB_chatbox;
    const { results } = await db.prepare('SELECT * FROM products').all();
    productData = results;
  }
  await next();
});

app.use("*", cors({
  origin: '*', // hoặc origin: '*'
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.post("/api/chat", async (c) => {
  try {
    const { messages = [] } = await c.req.json<{
      messages: ChatMessage[];
    }>();

    // Configurable limits
    const MAX_CONVERSATION_MESSAGES = 30;
    const MAX_MESSAGE_CHARS = 2000;
    const MAX_MODEL_TOKENS = 2048;

    // Filter valid products
        const validProducts = (productData || []).filter(
      (p: any) => p.id && p.title && p.pricevnd
    );

    const productContext = validProducts.map((p: any) => ({
      title: p.title,
      pricevnd: p.pricevnd,
      category: p.category,
      stock: p.stock,
      description: p.description,
      sku: p.sku,
    }));

    const systemMessageContent = buildSystemPrompt(SYSTEM_PROMPT, productContext);

    let systemMessage = { role: "system", content: systemMessageContent } as ChatMessage;

    // Add few-shot example for table formatting
    const fewShotExample: ChatMessage[] = [
      {
        role: "user",
        content: "Tôi tìm cây Baby"
      },
      {
        role: "assistant",
        content: "Tôi tìm thấy các sản phẩm phù hợp:\n\n| Tên sản phẩm | Giá (VND) | Tình trạng |\n|--------------|-----------|------------|\n| Succulent Mix Baby | 794,000 | Còn hàng |\n| Jade Plant Baby | 516,000 | Còn hàng |\n\nBạn muốn xem chi tiết sản phẩm nào?"
      }
    ];

    // Filter out system messages from user input
    const convo = messages.filter((m) => m.role !== "system");

    // Check if last user message contains product ID or SKU
    if (convo.length > 0) {
      const lastUserMessage = convo[convo.length - 1];
      if (lastUserMessage.role === "user" && typeof lastUserMessage.content === "string") {
        const userInput = lastUserMessage.content.trim();
        
        // Check if input matches any product ID or SKU
        const containsProductId = validProducts.some((p: any) => {
          const idStr = String(p.id);
          const skuStr = String(p.sku || "");
          
          // Check exact match or if input is purely numeric and matches ID
          return userInput === idStr || 
                 userInput === skuStr ||
                 (userInput.match(/^\d+$/) && userInput === idStr);
        });
        
        if (containsProductId) {
          // Return error message without calling AI
          return new Response(
            JSON.stringify({
              response: "Xin lỗi, tôi không thể tra cứu sản phẩm bằng mã ID. Vui lòng nhập tên sản phẩm để tôi có thể hỗ trợ bạn tốt hơn."
            }),
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }
      }
    }

    // Trim messages
    const trimmedConvo = convo.map((m) => {
      if (typeof m.content === "string" && m.content.length > MAX_MESSAGE_CHARS) {
        return { ...m, content: m.content.slice(0, MAX_MESSAGE_CHARS) };
      }
      return m;
    });

    // Keep last N messages
    const keptConvo = trimmedConvo.slice(
      Math.max(0, trimmedConvo.length - MAX_CONVERSATION_MESSAGES),
    );

    // Reconstruct: system + few-shot + conversation
    const finalMessages: ChatMessage[] = [
      systemMessage,
      ...fewShotExample,
      ...keptConvo
    ];

    const response = await c.env.AI.run(
      MODEL_ID,
      {
        messages: finalMessages,
        max_tokens: MAX_MODEL_TOKENS,
      },
      {
        returnRawResponse: true,
      },
    );

    return response;
  } catch (error) {
    console.error("Error processing chat request:", error);
    return c.json(
      { error: "Failed to process request" },
      500
    );
  }
});
app.get('/api/products', async (c) => {
  const db = c.env.DB_chatbox; 
  const { results } = await db.prepare('select * from products').all();
  return c.json(results);
});

app.post('/api/products', async (c) => {
  const db = c.env.DB_chatbox; 
  const body = await c.req.json();

  try {
     let result;
    result = await db.prepare(
    'INSERT INTO products (title, price_vnd, category, stock, description, sku) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      body.title,
      body.price,
      body.category,
      body.stock,
      body.description,
      body.sku
    ).run();   
    return c.json({ success: result.success });
      } catch (error) {
        return c.json({ success:false,error: (error as Error).message });
      }
});

app.get('/api/products', async (c) => {
  const db = c.env.DB_chatbox; 
  const { results } = await db.prepare('select * from products').all();
  return c.json(results);
});


app.get('/api/prompts/:id', async (c) => {
  const promptId = c.req.param('id');
  const db = c.env.DB_chatbox;

  // Lấy prompt
  const { results: prompts } = await db
    .prepare('SELECT content FROM system_prompts WHERE id = ?')
    .bind(promptId)
    .all();
  
  if (!prompts || prompts.length === 0) {
    return c.json({ error: 'Prompt not found' }, 404);
  }

  // Lấy rules của prompt này
  const { results: rules } = await db
    .prepare('SELECT rule_name,rule_type , condition_trigger, action_required, example_input, example_output, priority FROM ai_behavior_rules WHERE prompt_id = ? order BY priority DESC')
    .bind(promptId)
    .all();

  // Lấy context templates của prompt này
  const { results: contexts } = await db
    .prepare('SELECT template_name,context_type ,template_content , variables, use_case FROM ai_context_templates WHERE prompt_id = ?')
    .bind(promptId)
    .all();

  // Tổ hợp thành JSON
  const result = {
    prompt: prompts[0],
    rules: rules || [],
    context: contexts || []
  };

  return c.json(result);
});


export default app;
