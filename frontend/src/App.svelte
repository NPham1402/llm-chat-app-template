<script>
  import { Router, Route, Link } from "svelte-routing";
  import Chat from "./routes/Chat.svelte";
  import DashboardLayout from "./layouts/DashboardLayout.svelte";
  import Dashboard from "./routes/admin/Dashboard.svelte";
  import Products from "./routes/admin/Products.svelte";
  import Prompts from "./routes/admin/Prompts.svelte";
  import Rules from "./routes/admin/Rules.svelte";
  export let url = "";
</script>

<Router {url}>
  <!-- Admin routes with dashboard layout -->
  <Route path="/admin/dashboard">
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  </Route>
  
  <Route path="/admin/products">
    <DashboardLayout>
      <Products />
    </DashboardLayout>
  </Route>
  
  <Route path="/admin/prompts">
    <DashboardLayout>
      <Prompts />
    </DashboardLayout>
  </Route>
  
  <Route path="/admin/rules">
    <DashboardLayout>
      <Rules />
    </DashboardLayout>
  </Route>

  <!-- Public chat route -->
  <Route path="/chat">
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <header class="bg-white border-b border-gray-200 py-2 px-4">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/chat" class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-green-600">
              Nông Lâm Viên ChatBox
            </h1>
          </Link>
          <Link to="/admin/dashboard" class="text-sm text-gray-600 hover:text-green-600">
            Admin
          </Link>
        </div>
      </header>

      <main class="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <Chat />
      </main>

      <footer class="text-center py-4 text-sm text-gray-500">
        <p>Nông lâm viên chatbox &copy; 2025</p>
      </footer>
    </div>
  </Route>

  <!-- Default redirect -->
  <Route path="/">
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-green-600 mb-4">Nông Lâm Viên</h1>
        <div class="space-x-4">
          <Link to="/chat" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Chat
          </Link>
          <Link to="/admin/dashboard" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Admin
          </Link>
        </div>
      </div>
    </div>
  </Route>
</Router>
