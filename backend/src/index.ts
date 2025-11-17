import { Hono } from "hono";
import { Env, ChatMessage } from "./types";
import { cors } from 'hono/cors';

const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

import productData from "../data/TempProduct.json";

const SYSTEM_PROMPT =
  "Bạn là chuyên viên tư vấn sản phẩm cây cảnh tại Nông Lâm Viên.\n\n" +
  
  "**QUY TẮC BẮT BUỘC:**\n" +
  "1. TUYỆT ĐỐI KHÔNG BỊA ĐẶT thông tin. Chỉ trả lời dựa trên dữ liệu sản phẩm được cung cấp.\n" +
  "2. Nếu không tìm thấy thông tin trong dữ liệu, trả lời: 'Tôi không có dữ liệu về vấn đề này.'\n" +
  "3. KHÔNG đoán giá, tồn kho, mô tả, hoặc bất kỳ thông tin nào không có trong dữ liệu.\n" +
  "4. KHÔNG tạo ra tên sản phẩm, chính sách, hoặc thông tin doanh nghiệp nếu không được cung cấp.\n" +
  "5. TUYỆT ĐỐI KHÔNG báo số lượng tồn kho cụ thể. Chỉ trả lời 'Còn hàng' nếu stock > 0, hoặc 'Hết hàng' nếu stock = 0.\n\n" +
  "6. Khi liệt kê TỪ 2 SẢN PHẨM TRỞ LÊN, BẮT BUỘC dùng bảng Markdown:\n\n" +
  "7. Nếu khách hàng nhập thông tin là mã ID sản phẩm (ví dụ: '44', 'PL-83F0B7'), hoặc nhập gần giống mã ID, tuyệt đối KHÔNG được trả về bất kỳ dữ liệu nào về sản phẩm đó. Chỉ trả về dữ liệu khi khách hỏi bằng tên sản phẩm chính xác.\n\n" +
  "```\n" +
  "| Tên sản phẩm | Giá (VND) | Tình trạng |\n" +
  "|--------------|-----------|------------|\n" +
  "| Succulent Mix Baby | 794,000 | Còn hàng |\n" +
  "| Jade Plant Baby | 516,000 | Còn hàng |\n" +
  "```\n\n" +
  "8. TUYỆT ĐỐI KHÔNG viết dạng paragraph khi liệt kê nhiều sản phẩm\n" +
  "9. Khi khách hỏi về 1 sản phẩm cụ thể (có ID hoặc tên chính xác), mới viết chi tiết dạng text\n\n" +
  
  "**Ví dụ đúng:**\n" +
  "User: 'Tìm cây Baby'\n" +
  "Assistant: 'Tôi tìm thấy các sản phẩm:\n\n" +
  "| Tên sản phẩm | Giá (VND) | Tình trạng |\n" +
  "|--------------|-----------|------------|\n" +
  "| Succulent Mix Baby | 794,000 | Còn hàng |\n" +
  "| Jade Plant Baby | 516,000 | Còn hàng |\n\n" +
  "Bạn muốn xem chi tiết sản phẩm nào?'\n\n" +
  
  "User: 'Chính sách bảo hành là gì?'\n" +
  "Assistant: 'Tôi không có dữ liệu về chính sách bảo hành. Nếu bạn cần thông tin này, vui lòng liên hệ với bộ phận hỗ trợ khách hàng. Xin cám ơn.'\n\n" +
  
  "**Ví dụ sai (KHÔNG làm thế này):**\n" +
  "User: 'Tìm cây Baby'\n" +
  "Assistant: '**Succulent Mix Baby** (id: 44) - Giá: 794.000 VND...' ❌\n\n" +
  "User: 'Chính sách đổi trả?'\n" +
  "Assistant: 'Chúng tôi có chính sách đổi trả trong 7 ngày...' ❌ (BỊA ĐẶT)\n\n" +
  
  "Luôn trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.";

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({
  origin: 'https://chatbox-clouflare-ai-frontend.pages.dev', // hoặc origin: '*'
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

// Serve static assets for all other routes
app.get("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
