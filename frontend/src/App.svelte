<script>
  import { Router, Route, Link } from "svelte-routing";
  import Chat from "./routes/Chat.svelte";
  import FlowbiteDemo from "./routes/FlowbiteDemo.svelte";
  import AdminDashboard from "./routes/AdminDashboard.svelte";
  export let url = "";
</script>

<Router {url}>
  <!-- Admin Dashboard route -->
  <Route path="/admin">
    <AdminDashboard />
  </Route>

  <!-- Flowbite Demo route -->
  <Route path="/demo">
    <FlowbiteDemo />
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Link to="/chat" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Chat
          </Link>
          <Link to="/demo" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Flowbite Demo
          </Link>
          <Link to="/admin" class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  </Route>
</Router>
