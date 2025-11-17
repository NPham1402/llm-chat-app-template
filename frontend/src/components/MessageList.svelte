<script>
  import { afterUpdate } from 'svelte';
  import ChatMessage from './ChatMessage.svelte';

  export let messages = [];
  export let isProcessing = false;

  let container;

  function scrollToBottom() {
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }

  afterUpdate(scrollToBottom);
</script>

<div
  bind:this={container}
  class="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-gray-50"
>
  {#each messages as message, idx (idx)}
    <ChatMessage role={message.role} content={message.content} />
  {/each}

  {#if isProcessing && messages[messages.length - 1]?.content === ''}
    <div class="text-sm italic text-gray-500">AI đang suy nghĩ...</div>
  {/if}
</div>
