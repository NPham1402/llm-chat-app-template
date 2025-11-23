<script>
  import { Card, Heading, P, A } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  
  let stats = {
    products: 0,
    prompts: 0,
    rules: 0,
    users: 0
  };

  onMount(async () => {
    // TODO: Fetch stats from API
    stats = {
      products: 24,
      prompts: 12,
      rules: 8,
      users: 156
    };
  });
</script>

<div class="space-y-6">
  <Heading tag="h1" class="text-2xl font-bold">Dashboard</Heading>
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <div class="flex items-center justify-between">
        <div>
          <P class="text-sm text-gray-500 dark:text-gray-400">Total Products</P>
          <Heading tag="h3" class="text-3xl font-bold">{stats.products}</Heading>
        </div>
        <svg class="w-12 h-12 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
        </svg>
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between">
        <div>
          <P class="text-sm text-gray-500 dark:text-gray-400">Total Prompts</P>
          <Heading tag="h3" class="text-3xl font-bold">{stats.prompts}</Heading>
        </div>
        <svg class="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
        </svg>
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between">
        <div>
          <P class="text-sm text-gray-500 dark:text-gray-400">Total Rules</P>
          <Heading tag="h3" class="text-3xl font-bold">{stats.rules}</Heading>
        </div>
        <svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
        </svg>
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between">
        <div>
          <P class="text-sm text-gray-500 dark:text-gray-400">Total Users</P>
          <Heading tag="h3" class="text-3xl font-bold">{stats.users}</Heading>
        </div>
        <svg class="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
        </svg>
      </div>
    </Card>
  </div>

  <!-- Quick Actions -->
  <Card>
    <Heading tag="h2" class="text-xl font-bold mb-4">Quick Actions</Heading>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <A href="/admin/products" class="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
          </svg>
          <div>
            <div class="font-semibold">Manage Products</div>
            <div class="text-sm text-gray-600">Add, edit or delete products</div>
          </div>
        </div>
      </A>

      <A href="/admin/prompts" class="block p-4 bg-green-50 hover:bg-green-100 rounded-lg">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <div class="font-semibold">Manage Prompts</div>
            <div class="text-sm text-gray-600">Configure AI prompts</div>
          </div>
        </div>
      </A>

      <A href="/admin/rules" class="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <div class="font-semibold">Manage Rules</div>
            <div class="text-sm text-gray-600">Set up business rules</div>
          </div>
        </div>
      </A>
    </div>
  </Card>
</div>
