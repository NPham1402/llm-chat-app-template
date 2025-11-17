<script>
  import { marked } from 'marked';

  export let role = 'user';
  export let content = '';

  $: isUser = role === 'user';
  $: renderedContent =
    role === 'assistant' ? marked.parse(content) : content.replace(/\n/g, '<br>');
</script>

<div class="flex {isUser ? 'justify-end' : 'justify-start'}">
  <div
    class="max-w-[80%] rounded-lg px-4 py-3 {isUser
      ? 'bg-orange-50 text-gray-800'
      : 'bg-gray-100 text-gray-800'}"
  >
    <div class="markdown-content">
      {@html renderedContent}
    </div>
  </div>
</div>
