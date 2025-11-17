<script>
  import ChatBoxProduction from "../options/ChatBoxProduction.svelte";
  import OptionSumary from "../options/OptionSumary.svelte";
  let OptionStep = 0;
  function handleChangeOptionChatBox(event) {
    console.error("OptionStep changed to:", event.detail);
    OptionStep = event.detail;
  }
</script>

{#if OptionStep === 0}
  <OptionSumary on:changeOptionChatBox={handleChangeOptionChatBox} />
{/if}
{#if OptionStep === 2 || OptionStep === 1}
  <ChatBoxProduction />
{/if}
