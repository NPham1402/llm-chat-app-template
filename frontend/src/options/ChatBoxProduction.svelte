<script>
  import { onMount, onDestroy } from "svelte";
  import { marked } from "marked";
  import ChatInput from "../components/ChatInput.svelte";
  import MessageList from "../components/MessageList.svelte";

  // Configure marked
  marked.setOptions({ breaks: true, gfm: true });

  let messages = [
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là AI được Nông Lâm Viên phát triển. Tôi có thể giúp gì cho bạn?",
    },
  ];

  let isProcessing = false;
  let controller;
  let reader;
  let checkChooseOption = true;
  async function handleSendMessage(event) {
    const userMessage = event.detail.message;
    if (!userMessage.trim() || isProcessing) return;

    isProcessing = true;

    // Add user message
    messages = [...messages, { role: "user", content: userMessage }];

    // Placeholder for assistant response
    const assistantIndex = messages.length;
    messages = [...messages, { role: "assistant", content: "" }];

    // Abort previous request if any
    if (controller) controller.abort();
    controller = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.slice(0, -1) }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Failed to get response");

      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          try {
            const jsonData = JSON.parse(line);
            if (jsonData.response) {
              responseText += jsonData.response;
              messages = messages.map((m, i) =>
                i === assistantIndex ? { ...m, content: responseText } : m
              );
            }
          } catch {}
        }
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Error:", error);
        messages = messages.map((m, i) =>
          i === assistantIndex
            ? {
                ...m,
                content: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.",
              }
            : m
        );
      }
    } finally {
      try {
        await reader?.cancel();
      } catch {}
      reader = null;
      isProcessing = false;
    }
  }

  onDestroy(() => {
    if (controller) controller.abort();
    try {
      reader?.cancel();
    } catch {}
  });
</script>

<div
  class="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
  style="height: calc(100vh - 200px); min-height: 400px;"
>
  <MessageList {messages} {isProcessing} />
  <ChatInput on:send={handleSendMessage} disabled={isProcessing} />
</div>
