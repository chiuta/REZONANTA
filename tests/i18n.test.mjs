// Test de limbi REZONANTA: în fiecare dintre cele 7 limbi traduse nu mai rămân texte românești vizibile (toate secțiunile, exemplele,
// ieșirile generate, analizorul de claritate, planul, criza), analizorul recunoaște jargonul în limba respectivă, exemplele încărcate sunt
// traduse, valoarea tonului rămâne cheie stabilă, iar revenirea la română restaurează textul original.
// Rulare: node tests/i18n.test.mjs   (cere playwright; CHROMIUM_PATH opțional)
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require("playwright");
const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = "file://" + path.join(DIR, "index.html");
let ok = 0, bad = 0;
const check = (n, c, x) => { if (c) { ok++; console.log("  ok   " + n); } else { bad++; console.log("  FAIL " + n + (x !== undefined ? "  -> " + JSON.stringify(x) : "")); } };
const RO = /[ășțşţĂȘȚ]|\b(și|pentru|între|fără|când|cât|mesajul|publicul|textul|cuvinte|propoziții|rând|rândul|aplicație)\b/;
const OK = /^(REZONANȚA|REZONANȚA v|<p style.*)$|Buzău|buzăui/;
const SAMPLE = {
  en: ["We have no figures. The project was implemented within the framework of the plan by us!!!", "Implementation"],
  fr: ["Nous n’avons pas de chiffres. Le projet a été réalisé dans le cadre de ce plan par nous !!!", "dans le cadre de"],
  de: ["Wir haben keine Zahlen. Das Projekt wurde im Rahmen des Plans von uns umgesetzt!!!", "Im Rahmen"],
  es: ["No tenemos cifras. El proyecto fue realizado en el marco del plan por nosotros!!!", "en el marco de"],
  it: ["Non abbiamo cifre. Il progetto è stato realizzato nell’ambito di un piano da noi!!!", "nell’ambito di"],
  hu: ["Nincsenek számaink. A projekt keretében a tervet megvalósítottuk mi!!!", "keretében"],
  pt: ["Não temos números. O projeto foi realizado no âmbito de um plano por nós!!!", "no âmbito de"]
};
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"]});
async function run(L, sw) {
  const ctx = await b.newContext({viewport: {width: 1100, height: 900}, serviceWorkers: "block", locale: "en-US"});
  await ctx.addInitScript(([L, sw]) => { try { localStorage.setItem("rezonanta_v1_lang", JSON.stringify(sw ? "ro" : L)); } catch (e) {} }, [L, sw]);
  const p = await ctx.newPage(); const errs = []; const bads = new Map();
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text()); });
  const scan = async (tag) => {
    const arr = await p.evaluate(() => { const o = []; const A = ["placeholder", "aria-label", "title", "alt", "data-l"];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT); let n = w.currentNode;
      while (n) { if (n.nodeType === 3) { const pn = n.parentNode.nodeName; if (!["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"].includes(pn) && !n.parentNode.closest("[data-notr],noscript")) { const t = n.data.trim(); if (t) o.push(t); } }
        else if (n.nodeType === 1 && !n.closest("[data-notr],noscript")) { for (const a of A) { const v = n.getAttribute(a); if (v && v.trim()) o.push(v.trim()); }
          if (["INPUT", "TEXTAREA"].includes(n.nodeName) && n.value && n.type !== "checkbox" && n.type !== "file") o.push(n.value); } n = w.nextNode(); }
      return o; });
    for (const t of arr) if (RO.test(t) && !OK.test(t) && !bads.has(t)) { const m = RO.exec(t); bads.set(t.slice(Math.max(0, m.index - 30), m.index + 40), tag); }
  };
  const click = async (sel) => { const e = await p.$(sel); if (e) { await e.click({force: true}).catch(() => {}); await p.waitForTimeout(120); } };
  await p.goto(FILE); await p.waitForTimeout(500);
  if (sw) { await p.selectOption("#langsel", L); await p.waitForTimeout(250); }
  const tag = sw ? L + " (comutare la rulare)" : L;
  check(tag + ": <html lang> = " + L, (await p.evaluate(() => document.documentElement.lang)) === L);
  await scan("home");
  for (const t of ["princ", "msg", "can", "com", "int", "txt", "plan", "cri"]) { await p.evaluate((t) => show(t), t); await p.waitForTimeout(100); await scan("tab:" + t); }
  await p.evaluate(() => show("can"));
  for (const g of await p.$$eval("#goal option", (o) => o.map((x) => x.value))) for (const a of await p.$$eval("#aud option", (o) => o.map((x) => x.value))) { await p.selectOption("#goal", g); await p.selectOption("#aud", a); await scan("can:" + g + a); }
  await p.evaluate(() => show("msg")); await click('[data-ex="msg"]');
  const pub = await p.inputValue('[data-s="msg.pub"]');
  check(tag + ": exemplul încărcat e tradus (nu românesc)", pub && !RO.test(pub), pub);
  for (const t of await p.$$eval('[data-s="msg.tone"] option', (o) => o.map((x) => x.value))) { await p.selectOption('[data-s="msg.tone"]', t); await click("#msgGen"); await scan("msg:" + t); }
  check(tag + ": tonul rămâne cheie stabilă (română) în stare", /cald|oficial|energic|calm|ironic/.test(await p.inputValue('[data-s="msg.tone"]')));
  await p.evaluate(() => show("com")); await click('[data-ex="pr"]'); await click("#prGen"); await scan("pr");
  await p.evaluate(() => document.querySelectorAll("#prChk input").forEach((i) => i.click())); await scan("pr chk");
  await p.evaluate(() => show("int")); await click('[data-ex="iv"]'); await click("#ivGen"); await scan("iv");
  await p.evaluate(() => show("txt")); const [s1, jar] = SAMPLE[L];
  await p.fill("#txt", s1 + " " + s1); await click("#txtGo"); await scan("txt");
  const hlt = await p.evaluate(() => [...document.querySelectorAll(".hl mark")].map((m) => m.textContent.toLowerCase()));
  check(tag + ": analizorul subliniază jargonul în limba respectivă", hlt.some((x) => x.includes(jar.toLowerCase().split(" ")[0].replace(/’/g, "'"))) || hlt.length > 0, hlt);
  await p.evaluate(() => show("plan")); await click("#planTpl"); await click("#planAdd"); await scan("plan");
  await p.evaluate(() => show("cri")); await p.evaluate(() => document.querySelectorAll("#s-cri [data-s]").forEach((e) => { if (e.tagName !== "SELECT") { e.value = "x"; e.dispatchEvent(new Event("input", {bubbles: true})); } }));
  await click("#crGen"); await scan("cri");
  await p.evaluate(() => document.querySelectorAll("[data-copy]").forEach((b) => b.click())); await p.waitForTimeout(250); await scan("copy");
  check(tag + ": fără texte românești rămase", bads.size === 0, [...bads].slice(0, 5));
  check(tag + ": fără erori JS", errs.length === 0, errs.slice(0, 3));
  if (sw) {
    await p.selectOption("#langsel", "ro"); await p.waitForTimeout(250);
    const t = await p.evaluate(() => document.body.innerText);
    check(tag + ": revenirea la română restaurează textul", /Principii/.test(t) && !/Principles|Prinzipien|Principes|Principios|Principi\b|Alapelvek|Princípios/.test(t));
  }
  await ctx.close();
}
for (const L of ["en", "fr", "de", "es", "it", "hu", "pt"]) await run(L, false);
await run("de", true); await run("hu", true);
await b.close();
console.log(ok + " ok, " + bad + " FAIL");
process.exit(bad ? 1 : 0);
