<script>
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;

  let inputValue = '';
  let textareaElement;

  const dispatch = createEventDispatcher();

  function handleSend() {
    const message = inputValue.trim();
    if (message && !disabled) {
      dispatch('send', { message });
      inputValue = '';
      if (textareaElement) {
        textareaElement.style.height = 'auto';
      }
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    if (textareaElement) {
      textareaElement.style.height = 'auto';
      textareaElement.style.height = textareaElement.scrollHeight + 'px';
    }
  }
</script>

<div class="border-t border-gray-200 bg-white p-3 flex gap-2">
  <textarea
    bind:this={textareaElement}
    bind:value={inputValue}
    on:keydown={handleKeydown}
    on:input={handleInput}
    placeholder="Nhập tin nhắn của bạn..."
    rows="1"
    {disabled}
    class="flex-1 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
    style="min-height: 44px; max-height: 200px;"
  ></textarea>
  <button
    on:click={handleSend}
    {disabled}
    class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
  >
    Gửi
  </button>
</div>
