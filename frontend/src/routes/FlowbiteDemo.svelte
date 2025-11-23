<script>
  import { Button, Card, Alert } from "flowbite-svelte";
</script>

<div class="p-8 space-y-4">
  <h1 class="text-3xl font-bold">Flowbite Svelte Demo</h1>

  <!-- Alert Example -->
  <Alert color="green">
    <span class="font-medium">Success!</span> Flowbite Svelte đã cài đặt thành công!
  </Alert>

  <!-- Button Examples -->
  <div class="flex gap-2">
    <Button>Default Button</Button>
    <Button color="alternative">Alternative</Button>
    <Button color="dark">Dark</Button>
    <Button color="light">Light</Button>
    <Button color="green">Green</Button>
    <Button color="red">Red</Button>
  </div>

  <!-- Card Example -->
  <Card>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Card Title
    </h5>
    <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
      Đây là một Card component từ Flowbite Svelte. Bạn có thể sử dụng rất nhiều component khác như:
      Navbar, Sidebar, Modal, Dropdown, Table, Form, và nhiều hơn nữa!
    </p>
    <Button class="mt-4">
      Xem thêm
      <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </Button>
  </Card>
</div>
