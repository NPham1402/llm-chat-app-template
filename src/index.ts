/**
 * LLM Chat Application Template
 *
 * A simple chat application using Cloudflare Workers AI.
 * This template demonstrates how to implement an LLM-powered chat interface with
 * streaming responses using Server-Sent Events (SSE).
 *
 * @license MIT
 */
import { Env, ChatMessage } from "./types";

// Model ID for Workers AI model
// https://developers.cloudflare.com/workers-ai/models/
const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// Import product data
import productData from "../data/TempProduct.json";

// Default system prompt
const SYSTEM_PROMPT =
  "Bạn là chuyên viên tư vấn sản phẩm cây cảnh tại Nông Lâm Viên.\n\n" +
  
  "**QUY TẮC BẮT BUỘC:**\n" +
  "1. Khi liệt kê TỪ 2 SẢN PHẨM TRỞ LÊN, BẮT BUỘC dùng bảng Markdown:\n\n" +
  "```\n" +
  "| Tên sản phẩm | Giá (VND) | Tồn kho |\n" +
  "|--------------|-----------|----------|\n" +
  "| Succulent Mix Baby | 794,000 | 99 |\n" +
  "| Jade Plant Baby | 516,000 | 53 |\n" +
  "```\n\n" +
  "2. TUYỆT ĐỐI KHÔNG viết dạng paragraph khi liệt kê nhiều sản phẩm\n" +
  "3. Khi khách hỏi về 1 sản phẩm cụ thể (có ID hoặc tên chính xác), mới viết chi tiết dạng text\n" +
  "4. Chỉ cung cấp thông tin từ dữ liệu sản phẩm có sẵn\n\n" +
  
  "**Ví dụ đúng:**\n" +
  "User: 'Tìm cây Baby'\n" +
  "Assistant: 'Tôi tìm thấy các sản phẩm:\n\n" +
  "| Tên sản phẩm | Giá (VND) | Tồn kho |\n" +
  "|--------------|-----------|----------|\n" +
  "| Succulent Mix Baby | 794,000 | 99 |\n" +
  "| Jade Plant Baby | 516,000 | 53 |\n\n" +
  "Bạn muốn xem chi tiết sản phẩm nào?'\n\n" +
  
  "**Ví dụ sai (KHÔNG làm thế này):**\n" +
  "User: 'Tìm cây Baby'\n" +
  "Assistant: '**Succulent Mix Baby** (id: 44) - Giá: 794.000 VND...' ❌\n\n" +
  
  "Luôn trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.";

export default {
  /**
   * Main request handler for the Worker
   */
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    // Handle static assets (frontend)
    if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    // API Routes
    if (url.pathname === "/api/chat") {
      // Handle POST requests for chat
      if (request.method === "POST") {
        return handleChatRequest(request, env);
      }

      // Method not allowed for other request types
      return new Response("Method not allowed", { status: 405 });
    }

    // Handle 404 for unmatched routes
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

/**
 * Handles chat API requests
 */
async function handleChatRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    // Parse JSON request body
    const { messages = [] } = (await request.json()) as {
      messages: ChatMessage[];
    };

    // Configurable limits
    const MAX_CONVERSATION_MESSAGES = 30;
    const MAX_MESSAGE_CHARS = 2000;
    const MAX_MODEL_TOKENS = 2048;

    // Filter valid products
    const validProducts = productData.filter(
      (p: any) => p.id && p.title && p.pricevnd
    );

    const productContext = validProducts.map((p: any) => ({
      id: p.id,
      title: p.title,
      pricevnd: p.pricevnd,
      category: p.category,
      stock: p.stock,
      description: p.description,
      sku: p.sku,
    }));

    const systemMessageContent = 
      SYSTEM_PROMPT + 
      "\n\nDanh sách sản phẩm hiện có:\n" + 
      JSON.stringify(productContext, null, 2);

    let systemMessage = { role: "system", content: systemMessageContent } as ChatMessage;

    // Add few-shot example for table formatting
    const fewShotExample: ChatMessage[] = [
      {
        role: "user",
        content: "Tôi tìm cây Baby"
      },
      {
        role: "assistant",
        content: "Tôi tìm thấy các sản phẩm phù hợp:\n\n| Tên sản phẩm | Giá (VND) | Tồn kho |\n|--------------|-----------|----------|\n| Succulent Mix Baby | 794,000 | 99 |\n| Jade Plant Baby | 516,000 | 53 |\n\nBạn muốn xem chi tiết sản phẩm nào?"
      }
    ];

    // Filter out system messages from user input
    const convo = messages.filter((m) => m.role !== "system");

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

    const response = await env.AI.run(
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
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
