  <script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    function selectOption(value) {
      console.error("Selected option:", value);
      dispatch("changeOptionChatBox", value);
    }
  </script>

  <div
    class="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    style="height: calc(100vh - 130px); min-height: 300px;">
    <div
      class="w-full h-[50px] flex flex-row border-b border-gray-200 items-center">
      <div class="flex-1 text-center text-[14px] font-bold">
        Hãy chọn chủ đề bạn quan tâm?
      </div>
    </div>
    <ul class="space-y-4">
      <div class="flex-1 overflow-y-auto p-4">
        <li
          class="flex flex-row border-b border-gray-300 py-2 hover:bg-gray-50 cursor-pointer">
          <div
            class="flex flex-row w-full"
            role="button"
            on:click={() => selectOption(1)}
            on:keydown={(e) =>
              (e.key === "Enter" || e.key === " ") && selectOption(1)}
            tabindex="0">
            <div
              class="w-[28px] h-[28px] bg-[green] text-white flex justify-center items-center rounded-[4px]">
              T
            </div>
            <h2 class="text-[12.25px] ml-2 flex items-center font-semibold">
              Tư vấn cây trồng
            </h2>
          </div>
        </li>
        <li
          class="flex flex-row border-b border-gray-300 py-2 hover:bg-gray-50 cursor-pointer">
          <div
            class="flex flex-row w-full"
            role="button"
            on:click={() => selectOption(2)}
            on:keydown={(e) =>
              (e.key === "Enter" || e.key === " ") && selectOption(1)}
            tabindex="0">
            <div
              class="w-[28px] h-[28px] bg-[green] text-white flex justify-center items-center rounded-[4px]">
              T
            </div>
            <h2 class="text-[12.25px] ml-2 flex items-center font-semibold">
              Tư vấn dịch vụ
            </h2>
          </div>
        </li>
        <li
          class="flex flex-row border-b border-gray-300 py-2 hover:bg-gray-50 cursor-pointer">
          <div
            class="flex flex-row w-full"
            role="button"
            on:click={() => selectOption(2)}
            on:keydown={(e) =>
              (e.key === "Enter" || e.key === " ") && selectOption(1)}
            tabindex="0">
            <div
              class="w-[28px] h-[28px] bg-[green] text-white flex justify-center items-center rounded-[4px]">
              L
            </div>
            <h2 class="text-[12.25px] ml-2 flex items-center font-semibold">
              Liên Hệ
            </h2>
          </div>
        </li>
      </div>
    </ul>
  </div>
