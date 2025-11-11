/**
 * LLM Chat App Frontend (Vanilla JS + Tailwind)
 *
 * Handles the chat UI interactions and communication with the backend API.
 */

// DOM elements
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const typingIndicator = document.getElementById("typing-indicator");

// Chat state
let chatHistory = [
  {
    role: "assistant",
    content: "Xin chào! Tôi là AI được Nông Lâm Viên phát triển. Tôi có thể giúp gì cho bạn?",
  },
];
let isProcessing = false;
let abortController = null;

// Configure marked.js for better table support
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true, // GitHub Flavored Markdown (supports tables)
  });
}

// Auto-resize textarea as user types
userInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 200) + "px";
});

// Send message on Enter (without Shift)
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Send button click handler
sendButton.addEventListener("click", sendMessage);

/**
 * Renders Markdown content to HTML
 */
function renderMarkdown(content) {
  if (typeof marked !== 'undefined') {
    return marked.parse(content);
  }
  // Fallback if marked.js is not loaded
  return `<p>${content.replace(/\n/g, '<br>')}</p>`;
}

/**
 * Sends a message to the chat API and processes the response
 */
async function sendMessage() {
  const message = userInput.value.trim();

  // Don't send empty messages
  if (message === "" || isProcessing) return;

  // Disable input while processing
  isProcessing = true;
  userInput.disabled = true;
  sendButton.disabled = true;

  // Add user message to chat
  addMessageToChat("user", message);

  // Clear input
  userInput.value = "";
  userInput.style.height = "auto";

  // Show typing indicator
  typingIndicator.style.display = "block";

  // Add message to history
  chatHistory.push({ role: "user", content: message });

  // Abort previous request if exists
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  try {
    // Create new assistant response element
    const assistantMessageEl = document.createElement("div");
    assistantMessageEl.className = "flex justify-start";
    assistantMessageEl.innerHTML = `
      <div class="max-w-[80%] rounded-lg px-4 py-3 bg-gray-100 text-gray-800">
        <div class="markdown-content"></div>
      </div>
    `;
    const contentEl = assistantMessageEl.querySelector('.markdown-content');
    chatMessages.appendChild(assistantMessageEl);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Send request to API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: chatHistory,
      }),
      signal: abortController.signal,
    });

    // Handle errors
    if (!response.ok) {
      throw new Error("Failed to get response");
    }

    // Process streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let responseText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        reader.releaseLock();
        break;
      }

      // Decode chunk
      const chunk = decoder.decode(value, { stream: true });

      // Process SSE format
      const lines = chunk.split("\n");
      for (const line of lines) {
        try {
          const jsonData = JSON.parse(line);
          if (jsonData.response) {
            // Append new content to existing text
            responseText += jsonData.response;
            
            // Render Markdown to HTML
            contentEl.innerHTML = renderMarkdown(responseText);

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        } catch (e) {
          // Skip lines that aren't valid JSON
          continue;
        }
      }
    }

    // Add completed response to chat history
    chatHistory.push({ role: "assistant", content: responseText });
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error("Error:", error);
      addMessageToChat(
        "assistant",
        "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.",
      );
    }
  } finally {
    // Hide typing indicator
    typingIndicator.style.display = "none";

    // Re-enable input
    isProcessing = false;
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
    abortController = null;
  }
}

/**
 * Helper function to add message to chat
 */
function addMessageToChat(role, content) {
  const isUser = role === "user";
  const messageEl = document.createElement("div");
  messageEl.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
  
  const bgColor = isUser ? 'bg-orange-50' : 'bg-gray-100';
  const renderedContent = isUser 
    ? `<p>${content.replace(/\n/g, '<br>')}</p>`
    : renderMarkdown(content);
  
  messageEl.innerHTML = `
    <div class="max-w-[80%] rounded-lg px-4 py-3 ${bgColor} text-gray-800">
      <div class="markdown-content">${renderedContent}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageEl);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
