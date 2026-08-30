/* ==========================================================================
   SOLEORA — setup.js
   Checks that the logo files load and that the Apps Script backend responds.
   ========================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const ASSETS = [
  "assets/logo-mark.png",
  "assets/logo-light.png",
  "assets/logo.png",
  "assets/favicon.png",
  "style.css",
  "script.js"
];

function row(list, label, state, note){
  const li = document.createElement("li");
  li.className = "check-row is-" + state;
  li.innerHTML = `<span class="dot"></span><span class="check-row__label">${label}</span>
    <span class="check-row__note">${note || ""}</span>`;
  list.appendChild(li);
  return li;
}

function log(msg){
  const el = $("#log");
  el.hidden = false;
  el.textContent += msg + "\n";
}

/* ------------------------------------------------------------ 1 · FILES */
function loadOne(path){
  return new Promise(resolve => {
    if (/\.png$/i.test(path)){
      const img = new Image();
      img.onload = () => resolve({ ok:true, note:`${img.naturalWidth}×${img.naturalHeight}` });
      img.onerror = () => resolve({ ok:false, note:"not found" });
      img.src = path + "?v=" + Date.now();
    } else {
      fetch(path + "?v=" + Date.now())
        .then(r => resolve({ ok:r.ok, note: r.ok ? "loaded" : "HTTP " + r.status }))
        .catch(() => resolve({ ok:false, note:"not found" }));
    }
  });
}

async function checkFiles(){
  const list = $("#fileChecks");
  list.innerHTML = "";
  let missing = 0;
  for (const path of ASSETS){
    const li = row(list, path, "wait", "checking…");
    const res = await loadOne(path);
    li.className = "check-row is-" + (res.ok ? "ok" : "bad");
    li.querySelector(".check-row__note").textContent = res.note;
    if (!res.ok) missing++;
  }
  $("#fileHint").textContent = missing === 0
    ? "Sab files mil gayi. Logo dikhna chahiye — na dikhe to Ctrl+Shift+R se hard refresh karein."
    : `${missing} file${missing > 1 ? "s" : ""} nahi mili. Neeche section 3 dekhein.`;
  $("#fileHint").className = "hint " + (missing ? "hint--bad" : "hint--ok");
}

/* ---------------------------------------------------------- 2 · BACKEND */
function jsonp(url, params, timeout = 15000){
  return new Promise((resolve, reject) => {
    const cb = "soleoraSetupCb" + Date.now();
    const q = new URLSearchParams({ ...params, callback: cb });
    const s = document.createElement("script");
    const t = setTimeout(() => { clean(); reject(new Error("timed out")); }, timeout);
    function clean(){ clearTimeout(t); delete window[cb]; s.remove(); }
    window[cb] = d => { clean(); resolve(d); };
    s.onerror = () => { clean(); reject(new Error("could not reach the URL")); };
    s.src = url + (url.includes("?") ? "&" : "?") + q.toString();
    document.body.appendChild(s);
  });
}

function readUrl(){
  const url = $("#apiUrl").value.trim();
  const key = $("#apiKey").value.trim();
  localStorage.setItem("soleora_setup_url", url);
  localStorage.setItem("soleora_setup_key", key);
  return { url, key };
}

async function checkBackend(){
  const list = $("#apiChecks");
  list.innerHTML = "";
  $("#log").textContent = ""; $("#log").hidden = true;
  const { url, key } = readUrl();

  if (!url){
    row(list, "Web app URL", "bad", "khaali hai — Apps Script ka /exec link paste karein");
    return;
  }
  const shapeOk = /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(url);
  row(list, "URL format", shapeOk ? "ok" : "warn",
      shapeOk ? "sahi hai" : "/exec par khatam hona chahiye (dev link kaam nahi karega)");

  const li = row(list, "Backend reachable", "wait", "connecting…");
  let ping;
  try{
    ping = await jsonp(url, { action:"ping", key });
    li.className = "check-row is-ok";
    li.querySelector(".check-row__note").textContent = "responded";
    log("ping → " + JSON.stringify(ping));
  }catch(err){
    li.className = "check-row is-bad";
    li.querySelector(".check-row__note").textContent = err.message;
    log("ping failed: " + err.message);
    row(list, "Next step", "warn", "Deploy me 'Who has access: Anyone' set karein aur naya version deploy karein");
    return;
  }

  row(list, "Passcode accepted", ping.ok ? "ok" : "bad",
      ping.ok ? "matches ADMIN_KEY" : "Code.gs ke ADMIN_KEY se match nahi ho raha");

  if (!ping.ok) return;

  const li2 = row(list, "Orders sheet readable", "wait", "reading…");
  try{
    const r = await jsonp(url, { action:"orders", key });
    if (r.ok){
      li2.className = "check-row is-ok";
      li2.querySelector(".check-row__note").textContent = `${(r.orders || []).length} order(s) in the sheet`;
    } else {
      li2.className = "check-row is-bad";
      li2.querySelector(".check-row__note").textContent = r.error || "rejected";
    }
    log("orders → " + JSON.stringify(r).slice(0, 400));
  }catch(err){
    li2.className = "check-row is-bad";
    li2.querySelector(".check-row__note").textContent = err.message;
  }
}

async function sendTestOrder(){
  const list = $("#apiChecks");
  const { url, key } = readUrl();
  if (!url){ row(list, "Test order", "bad", "pehle URL daalein"); return; }

  const order = {
    orderId: "TEST" + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    customer: { name:"Setup Test", phone:"9999999999", email:"test@example.com",
                address:"Test address", city:"Delhi", pincode:"110007" },
    items: [{ id:1, name:"AirFlex Runner X1", brand:"AirFlex", size:9, qty:1, price:2499 }],
    itemsText: "AirFlex Runner X1 (size 9) x1",
    subtotal: 3299, discount: 800, shipping: 0, total: 2499,
    payment: "Cash on delivery", status: "New"
  };

  const li = row(list, "Test order write", "wait", "sending…");
  const body = JSON.stringify({ action:"createOrder", order });
  let posted = false;
  try{
    const res = await fetch(url, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body });
    const j = await res.json();
    posted = !!j.ok;
    log("createOrder → " + JSON.stringify(j));
  }catch(err){
    log("direct POST blocked (" + err.message + "), retrying without reading the reply");
    try{
      await fetch(url, { method:"POST", mode:"no-cors", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body });
      posted = true;
    }catch(e2){ log("retry failed: " + e2.message); }
  }

  li.className = "check-row is-" + (posted ? "ok" : "bad");
  li.querySelector(".check-row__note").textContent = posted
    ? `sent as ${order.orderId} — ab Google Sheet me Orders tab check karein`
    : "backend tak nahi pahuncha";

  if (posted){
    setTimeout(async () => {
      try{
        const r = await jsonp(url, { action:"orders", key });
        const found = (r.orders || []).some(o => o.orderId === order.orderId);
        row(list, "Row confirmed in sheet", found ? "ok" : "warn",
            found ? order.orderId + " mil gaya" : "abhi nahi dikha — sheet manually refresh karke dekhein");
      }catch{}
    }, 2500);
  }
}

/* ------------------------------------------------------------------ INIT */
document.addEventListener("DOMContentLoaded", () => {
  $("#apiUrl").value = localStorage.getItem("soleora_setup_url") || "";
  $("#apiKey").value = localStorage.getItem("soleora_setup_key") || "soleora2026";
  $("#reFiles").addEventListener("click", checkFiles);
  $("#runBackend").addEventListener("click", checkBackend);
  $("#runOrder").addEventListener("click", sendTestOrder);
  checkFiles();
});
