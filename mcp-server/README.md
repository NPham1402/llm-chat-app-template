# ChatBox MCP Server

MCP Server cho hệ thống ChatBox AI - Quản lý context và tích hợp công cụ cho nông lâm viên.

## Tính năng

### Tools (Công cụ)
1. **search_products** - Tìm kiếm sản phẩm theo tên hoặc danh mục
2. **get_product_details** - Lấy thông tin chi tiết sản phẩm
3. **search_faqs** - Tìm kiếm câu hỏi thường gặp
4. **calculate_total** - Tính tổng giá trị đơn hàng

### Resources (Tài nguyên)
- `chatbox://products/all` - Danh sách tất cả sản phẩm
- `chatbox://faqs/all` - Danh sách câu hỏi thường gặp

## Cài đặt

```bash
cd mcp-server
npm install
```

## Chạy Development

```bash
npm run dev
```

## Build Production

```bash
npm run build
npm start
```

## Tích hợp với Claude Desktop

Thêm vào `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "chatbox": {
      "command": "node",
      "args": [
        "C:/Users/09382/OneDrive/Máy tính/Project/ChatBox_Clouflare_AI/mcp-server/src/index.js"
      ]
    }
  }
}
```

## Ví dụ sử dụng

### Tìm kiếm sản phẩm
```json
{
  "tool": "search_products",
  "arguments": {
    "query": "phân bón"
  }
}
```

### Tính tổng giá
```json
{
  "tool": "calculate_total",
  "arguments": {
    "items": [
      { "product_id": 1, "quantity": 2 },
      { "product_id": 3, "quantity": 5 }
    ]
  }
}
```

## Cấu trúc thư mục

```
mcp-server/
├── package.json          # Dependencies và scripts
├── src/
│   └── index.js         # MCP server implementation
├── dist/                # Build output (sau khi chạy npm run build)
└── README.md           # Tài liệu
```

## Mở rộng

Để thêm tool mới:
1. Thêm tool definition trong `ListToolsRequestSchema` handler
2. Thêm logic xử lý trong `CallToolRequestSchema` handler
3. Update README với ví dụ sử dụng

Để thêm resource mới:
1. Thêm resource definition trong `ListResourcesRequestSchema` handler
2. Thêm logic đọc trong `ReadResourceRequestSchema` handler

## License

MIT
