// usage: URL=<page> node shoot.mjs <light|dark> <width> <height> <out.png> [js-to-eval] [waitMs]
//   JS2=<second js> runs after a reload-friendly 3s pause. Headless Chrome over CDP, no extension needed.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
const [scheme, W, H, out, js = "0", wait = "2500"] = process.argv.slice(2);
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${port}`, "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  "--hide-scrollbars", `--window-size=${W},${H}`, `--user-data-dir=${process.env.TMPDIR || "/tmp"}/hf-shoot-${port}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === "Runtime.consoleAPICalled" || m.method === "Runtime.exceptionThrown") console.error("[page]", JSON.stringify(m.params).slice(0, 300)); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Runtime.enable");
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] });
await send("Emulation.setDeviceMetricsOverride", { width: +W, height: +H, deviceScaleFactor: 1, mobile: +W < 600 });
await send("Page.navigate", { url: process.env.URL || "http://localhost:3000" });
await sleep(4000);
const r = await send("Runtime.evaluate", { expression: js, awaitPromise: true, returnByValue: true });
console.log(JSON.stringify(r.result?.result?.value ?? r.result));
if (process.env.JS2) {
  await sleep(3000);
  const r2 = await send("Runtime.evaluate", { expression: process.env.JS2, awaitPromise: true, returnByValue: true });
  console.log(JSON.stringify(r2.result?.result?.value ?? r2.result));
}
await sleep(+wait);
const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
chrome.kill();
process.exit(0);
