# 🌿 ChatBox - AI Tư Vấn Sản Phẩm Cây Cảnh

Ứng dụng chatbot AI thông minh dành cho việc tư vấn và tra cứu sản phẩm cây cảnh, được xây dựng trên nền tảng Cloudflare Workers AI với model Llama 3.3.

## ✨ Tính Năng Nổi Bật

- 🤖 **AI Chatbot thông minh**: Sử dụng Llama 3.3 70B của Cloudflare Workers AI
- 💬 **Streaming Response**: Trả lời thời gian thực với Server-Sent Events
- 🌱 **Tư vấn sản phẩm**: Tra cứu và tư vấn sản phẩm cây cảnh từ database
- 📊 **Hiển thị bảng**: Tự động format kết quả nhiều sản phẩm dạng bảng Markdown
- 🔒 **Bảo mật**: Chặn truy vấn bằng ID/SKU, không tiết lộ số lượng tồn kho chính xác
- 📱 **Responsive**: Giao diện thân thiện trên mọi thiết bị
- 🎨 **Modern UI**: Xây dựng với Svelte và TailwindCSS
- ⚡ **Hiệu năng cao**: Deploy trên Cloudflare Edge Network

## 🏗️ Kiến Trúc Hệ Thống

### Backend
- **Framework**: Hono (Web framework nhẹ cho Cloudflare Workers)
- **AI Model**: Meta Llama 3.3 70B Instruct FP8 Fast
- **Database**: Cloudflare D1 (SQLite)
- **Hosting**: Cloudflare Workers
- **Language**: TypeScript

### Frontend
- **Framework**: Svelte 4
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3
- **Routing**: svelte-routing
- **Markdown**: marked (để render Markdown trong chat)
- **Hosting**: Cloudflare Pages

## 📋 Yêu Cầu Hệ Thống

- [Node.js](https://nodejs.org/) v18 trở lên
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (Cloudflare CLI tool)
- Tài khoản Cloudflare với quyền truy cập:
  - Workers AI
  - D1 Database
  - Cloudflare Pages

## 🚀 Cài Đặt và Chạy Dự Án

### 1. Clone Repository

```bash
git clone https://github.com/NPham1402/ChatBox_Clouflare_AI.git
cd ChatBox_Clouflare_AI
```

### 2. Cài Đặt Dependencies

Cài đặt dependencies cho cả backend và frontend:

```bash
npm run install
```

Hoặc cài đặt riêng lẻ:

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 3. Cấu Hình Database (D1)

Tạo D1 database trên Cloudflare:

```bash
cd backend
wrangler d1 create chat-box-ai
```

Cập nhật `database_id` trong `backend/wrangler.jsonc` với ID nhận được.

Tạo schema cho database (nếu cần):

```sql
-- Tạo bảng products
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  price_vnd INTEGER,
  category TEXT,
  stock INTEGER,
  description TEXT,
  sku TEXT
);

-- Tạo bảng system_prompts (nếu cần)
CREATE TABLE system_prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  version TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Các bảng khác theo nhu cầu...
```

### 4. Chạy Development Server

Khởi động cả backend và frontend đồng thời:

```bash
npm run dev
```

Hoặc chạy riêng lẻ:

```bash
# Backend (port 8787)
npm run dev:backend

# Frontend (port 5173)
npm run dev:frontend
```

- Backend API: http://localhost:8787
- Frontend UI: http://localhost:5173

**Lưu ý**: Khi chạy local, Workers AI vẫn sử dụng tài khoản Cloudflare của bạn và sẽ tính phí sử dụng.

## 📦 Build và Deploy

### Build Production

```bash
# Build tất cả
npm run build

# Build riêng lẻ
npm run build:backend    # Type check backend
npm run build:frontend   # Build frontend
```

### Deploy lên Cloudflare

```bash
# Deploy tất cả
npm run deploy

# Deploy riêng lẻ
npm run deploy:backend   # Deploy Workers
npm run deploy:frontend  # Deploy Pages
```

## 📁 Cấu Trúc Dự Án

```
ChatBox_Clouflare_AI/
├── backend/                      # Backend API (Cloudflare Workers)
│   ├── src/
│   │   ├── index.ts             # Entry point, định nghĩa API routes
│   │   └── types.ts             # TypeScript type definitions
│   ├── data/
│   │   └── TempProduct.json     # Dữ liệu mẫu (nếu có)
│   ├── wrangler.jsonc           # Cấu hình Cloudflare Workers
│   ├── tsconfig.json            # TypeScript config
│   └── package.json
│
├── frontend/                     # Frontend UI (Svelte)
│   ├── src/
│   │   ├── App.svelte           # Root component
│   │   ├── main.js              # Entry point
│   │   ├── components/          # Reusable components
│   │   │   ├── ChatInput.svelte
│   │   │   ├── ChatMessage.svelte
│   │   │   ├── MessageList.svelte
│   │   │   └── ChooseOption.svelte
│   │   ├── routes/              # Route components
│   │   │   ├── Chat.svelte
│   │   │   └── Admin/
│   │   │       └── AdminDetails.svelte
│   │   └── options/             # Additional options components
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # TailwindCSS config
│   ├── svelte.config.js         # Svelte config
│   └── package.json
│
├── package.json                  # Root package.json (scripts chung)
└── README.md                     # Tài liệu này
```

## 🔌 API Endpoints

### Chat API

**POST** `/api/chat`

Gửi tin nhắn và nhận phản hồi từ AI.

```json
// Request
{
  "messages": [
    {
      "role": "user",
      "content": "Tôi muốn tìm cây Snake Plant"
    }
  ]
}

// Response (streaming)
{
  "response": "Markdown formatted response..."
}
```

### Products API

**GET** `/api/products`

Lấy danh sách tất cả sản phẩm.

```json
// Response
[
  {
    "id": 1,
    "title": "Snake Plant Mini",
    "price_vnd": 910000,
    "category": "Cây Để Bàn",
    "stock": 5,
    "description": "Cây lưỡi hổ mini...",
    "sku": "PL-001"
  }
]
```

**POST** `/api/products`

Thêm sản phẩm mới (cần authentication - tùy implementation).

```json
// Request
{
  "title": "ZZ Plant",
  "price_vnd": 850000,
  "category": "Cây Để Bàn",
  "stock": 10,
  "description": "Cây kim tiền...",
  "sku": "PL-002"
}
```

### Prompts API

**GET** `/api/prompts/:id`

Lấy system prompt và rules của AI.

```json
// Response
{
  "prompt": {
    "content": "Bạn là chuyên viên tư vấn..."
  },
  "rules": [...],
  "context": [...]
}
```

## ⚙️ Cấu Hình

### Backend Configuration

Chỉnh sửa `backend/wrangler.jsonc`:

```jsonc
{
  "name": "llm-chat-app-backend",
  "main": "src/index.ts",
  "compatibility_date": "2025-10-08",
  "ai": {
    "binding": "AI"  // Workers AI binding
  },
  "d1_databases": [
    {
      "binding": "DB_chatbox",
      "database_name": "chat-box-ai",
      "database_id": "YOUR_DATABASE_ID"
    }
  ]
}
```

### AI Model Configuration

Thay đổi model trong `backend/src/index.ts`:

```typescript
const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
```

Các model khác có sẵn: [Cloudflare Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)

### System Prompt

Tùy chỉnh behavior của AI bằng cách sửa `SYSTEM_PROMPT` object trong `backend/src/index.ts`. Prompt system bao gồm:
- **prompt.content**: Vai trò của AI
- **rules**: Các quy tắc hành vi (format response, bảo mật, etc.)
- **context**: Templates và thông tin bổ sung

## 🛠️ Development Tips

### Debugging

Xem logs của Worker:

```bash
cd backend
wrangler tail
```

### Type Generation

Generate TypeScript types từ Wrangler:

```bash
cd backend
npm run cf-typegen
```

### Clean Install

Xóa và cài lại dependencies:

```bash
npm run clean
npm run install
```

## 🔐 Tính Năng Bảo Mật

1. **Chặn truy vấn ID**: Không cho phép tra cứu sản phẩm bằng ID hoặc SKU số
2. **Giới hạn thông tin**: Không tiết lộ số lượng tồn kho chính xác
3. **Rate limiting**: Có thể cấu hình qua AI Gateway
4. **CORS**: Đã cấu hình CORS cho phép frontend gọi API

## 📚 Tài Nguyên

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare D1 Database](https://developers.cloudflare.com/d1/)
- [Hono Framework](https://hono.dev/)
- [Svelte Documentation](https://svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)

## 📝 License

[Add your license here]

## 👤 Tác Giả

NPham1402

## 🤝 Đóng Góp

Contributions, issues và feature requests luôn được chào đón!

---

**Happy Coding! 🚀**
