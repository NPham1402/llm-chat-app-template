import "./app.css";
import App from "./App.svelte";
import { mount } from "svelte";

// Svelte 5 mounting API
const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;
