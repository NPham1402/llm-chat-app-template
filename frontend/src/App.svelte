<script>
  import { Router, Route, Link } from "svelte-routing";
  import Chat from "./routes/Chat.svelte";
  export let url = "";
</script>

<Router {url}>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white border-b border-gray-200 py-2 px-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" class="flex items-center gap-2">
          <h1 class="text-xl font-bold text-green-600">
            Nông Lâm Viên ChatBox
          </h1>
        </Link>
      </div>
    </header>

    <main class="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
      <Route path="/chat" component={Chat} />
      <!-- <Route path="/admin" component={Contact} /> -->
    </main>

    <footer class="text-center py-4 text-sm text-gray-500">
      <p>Nông lâm viên chatbox &copy; 2025</p>
    </footer>
  </div>
</Router>
