/* ==========================================================================
   SOLEORA — admin.js  ·  Order desk
   Reads and updates orders stored in a Google Sheet through Apps Script.
   Without a backend URL it falls back to orders saved on this device.
   ========================================================================== */

const ADMIN = {
  /* Same Web App URL you paste into script.js */
  API_URL: "",
  KEY_STORE: "soleora_admin_key",
  LOCAL_ORDERS: "soleora_orders"
};

const STATUSES = ["New","Confirmed","Packed","Shipped","Delivered","Cancelled"];

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const inr = n => "₹" + Number(n || 0).toLocaleString("en-IN");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let ORDERS = [];
let DEMO = false;
let adminKey = "";

/* ------------------------------------------------------------ TOAST */
function toast(msg){
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  $("#toasts").appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 2400);
}

/* ------------------------------------------------------------ TRANSPORT
   GET uses JSONP so it works from any static host without CORS setup.
   POST uses a text/plain body so the browser skips the preflight request. */
function apiGet(params){
  return new Promise((resolve, reject) => {
    if (!ADMIN.API_URL) return reject(new Error("no-backend"));
    const cb = "soleoraCb" + Date.now() + Math.floor(Math.random() * 999);
    const q = new URLSearchParams({ ...params, key: adminKey, callback: cb });
    const s = document.createElement("script");
    const timer = setTimeout(() => { cleanup(); reject(new Error("timeout")); }, 12000);
    function cleanup(){ clearTimeout(timer); delete window[cb]; s.remove(); }
    window[cb] = data => { cleanup(); resolve(data); };
    s.onerror = () => { cleanup(); reject(new Error("network")); };
    s.src = ADMIN.API_URL + "?" + q.toString();
    document.body.appendChild(s);
  });
}

async function apiPost(payload){
  if (!ADMIN.API_URL) throw new Error("no-backend");
  const res = await fetch(ADMIN.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, key: adminKey })
  });
  return res.json();
}

/* ------------------------------------------------------------ LOGIN */
function initGate(){
  const saved = sessionStorage.getItem(ADMIN.KEY_STORE);
  if (saved){ adminKey = saved; openDash(); return; }
  $("#gateForm").addEventListener("submit", async e => {
    e.preventDefault();
    const val = $("#gateKey").value.trim();
    if (!val){ $("#gateKey").classList.add("is-bad"); return; }
    adminKey = val;
    if (ADMIN.API_URL){
      try{
        const r = await apiGet({ action: "ping" });
        if (!r.ok){ $("#gateKey").classList.add("is-bad"); toast("Passcode not accepted"); return; }
      }catch{
        toast("Backend unreachable — opening device orders");
      }
    }
    sessionStorage.setItem(ADMIN.KEY_STORE, adminKey);
    openDash();
  });
}

function openDash(){
  $("#gate").hidden = true;
  $("#adm").hidden = false;
  wire();
  loadOrders();
}

/* ------------------------------------------------------------ LOAD */
async function loadOrders(){
  const conn = $("#connState");
  conn.textContent = "Loading…"; conn.className = "conn";
  if (ADMIN.API_URL){
    try{
      const r = await apiGet({ action: "orders" });
      if (r && r.ok){
        ORDERS = r.orders || []; DEMO = false;
        conn.textContent = "Live · Google Sheet"; conn.className = "conn is-live";
        render(); return;
      }
    }catch(err){ /* falls through to device orders */ }
  }
  DEMO = true;
  ORDERS = JSON.parse(localStorage.getItem(ADMIN.LOCAL_ORDERS) || "[]");
  conn.textContent = ADMIN.API_URL ? "Offline · device orders" : "Demo · device orders";
  conn.className = "conn is-demo";
  render();
}

/* ------------------------------------------------------------ RENDER */
function visibleOrders(){
  const q = $("#ordSearch").value.trim().toLowerCase();
  const st = $("#statusFilter").value;
  return ORDERS.filter(o => {
    if (st && (o.status || "New") !== st) return false;
    if (!q) return true;
    const c = o.customer || {};
    return [o.orderId, c.name, c.phone, c.city, c.email, o.itemsText].join(" ").toLowerCase().includes(q);
  });
}

function renderStats(){
  const today = new Date().toDateString();
  const todays = ORDERS.filter(o => new Date(o.createdAt).toDateString() === today);
  const revenue = ORDERS.filter(o => (o.status || "New") !== "Cancelled").reduce((s,o) => s + Number(o.total || 0), 0);
  const pending = ORDERS.filter(o => ["New","Confirmed","Packed"].includes(o.status || "New")).length;
  const delivered = ORDERS.filter(o => o.status === "Delivered").length;
  const cards = [
    { label:"Total orders",  value:ORDERS.length,      sub:`${todays.length} placed today`, tint:"#E9E4FF" },
    { label:"Revenue",       value:inr(revenue),       sub:"Excludes cancelled orders",     tint:"#DDF7EA" },
    { label:"Needs action",  value:pending,            sub:"New, confirmed or packed",      tint:"#ffe6dc" },
    { label:"Delivered",     value:delivered,          sub:"Completed orders",              tint:"#e2eeff" }
  ];
  $("#stats").innerHTML = cards.map((c,i) =>
    `<article class="stat" style="--i:${i};--tint:${c.tint}"><span>${c.label}</span><b>${c.value}</b><small>${c.sub}</small></article>`).join("");
}

function renderTable(){
  const list = visibleOrders();
  $("#ordEmpty").hidden = list.length > 0;
  $("#ordBody").innerHTML = list.map(o => {
    const c = o.customer || {};
    const st = o.status || "New";
    const d = o.createdAt ? new Date(o.createdAt) : null;
    return `<tr>
      <td><span class="tbl__id">${esc(o.orderId)}</span><span class="tbl__date">${d ? d.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}) : "—"}</span></td>
      <td><span class="tbl__name">${esc(c.name)}</span><span class="tbl__sub">${esc(c.phone)} · ${esc(c.city)}</span></td>
      <td class="tbl__items">${esc(o.itemsText || (o.items || []).map(i => `${i.name} x${i.qty}`).join(", "))}</td>
      <td class="tbl__total">${inr(o.total)}</td>
      <td><span class="pill">${esc(o.payment || "—")}</span></td>
      <td>
        <select class="st-select st-${esc(st)}" data-status="${esc(o.orderId)}">
          ${STATUSES.map(s => `<option ${s === st ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </td>
      <td><button class="btn btn--outline btn--sm" data-view="${esc(o.orderId)}">Details</button></td>
    </tr>`;
  }).join("");
}

function render(){ renderStats(); renderTable(); }

/* ------------------------------------------------------------ ACTIONS */
async function setStatus(orderId, status){
  const o = ORDERS.find(x => x.orderId === orderId);
  if (!o) return;
  const prev = o.status;
  o.status = status;
  render();
  if (DEMO){
    const local = JSON.parse(localStorage.getItem(ADMIN.LOCAL_ORDERS) || "[]");
    const item = local.find(x => x.orderId === orderId);
    if (item) item.status = status;
    localStorage.setItem(ADMIN.LOCAL_ORDERS, JSON.stringify(local));
    toast(`${orderId} marked ${status}`);
    return;
  }
  try{
    const r = await apiPost({ action: "updateStatus", orderId, status });
    if (!r.ok) throw new Error("rejected");
    toast(`${orderId} marked ${status}`);
  }catch{
    o.status = prev; render();
    toast("Could not save the status change");
  }
}

function openOrder(orderId){
  const o = ORDERS.find(x => x.orderId === orderId);
  if (!o) return;
  const c = o.customer || {};
  const items = o.items || [];
  $("#ordCard").innerHTML = `
    <button class="icon-btn modal__x" data-close aria-label="Close"><svg class="ico"><use href="#s-close"/></svg></button>
    <div class="ord">
      <div class="ord__head">
        <div><h2 class="modal__title">${esc(o.orderId)}</h2>
        <p class="modal__sub" style="margin:4px 0 0">${o.createdAt ? new Date(o.createdAt).toLocaleString("en-IN") : ""}</p></div>
        <span class="pill st-${esc(o.status || "New")}">${esc(o.status || "New")}</span>
      </div>
      <div class="ord__rows">
        <div><span>Customer</span><b>${esc(c.name)}</b></div>
        <div><span>Phone</span><b>${esc(c.phone)}</b></div>
        <div><span>Email</span><b>${esc(c.email) || "—"}</b></div>
        <div><span>Address</span><b>${esc(c.address)}, ${esc(c.city)} — ${esc(c.pincode)}</b></div>
        <div><span>Payment</span><b>${esc(o.payment)}</b></div>
      </div>
      <div class="ord__items">
        ${items.map(i => `<div><span>${esc(i.name)} · size ${esc(i.size)} × ${i.qty}</span><b>${inr(i.price * i.qty)}</b></div>`).join("") || "<div><span>No line items recorded</span></div>"}
      </div>
      <div class="ord__rows">
        <div><span>Subtotal</span><b>${inr(o.subtotal)}</b></div>
        <div><span>Discount</span><b>−${inr(o.discount)}</b></div>
        <div><span>Shipping</span><b>${o.shipping ? inr(o.shipping) : "Free"}</b></div>
        <div style="font-size:1.05rem"><span>Total</span><b>${inr(o.total)}</b></div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn btn--dark" href="tel:${esc(c.phone)}">Call customer</a>
        <a class="btn btn--outline" target="_blank" rel="noopener"
           href="https://wa.me/91${String(c.phone || "").replace(/\D/g,"").slice(-10)}?text=${encodeURIComponent(`Hi ${c.name || ""}, this is SOLEORA about order ${o.orderId}.`)}">WhatsApp</a>
      </div>
    </div>`;
  $("#ordModal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeOrder(){
  $("#ordModal").hidden = true;
  document.body.style.overflow = "";
}

function exportCSV(){
  const rows = [["Order ID","Date","Name","Phone","Email","Address","City","Pincode","Items","Subtotal","Discount","Shipping","Total","Payment","Status"]];
  visibleOrders().forEach(o => {
    const c = o.customer || {};
    rows.push([o.orderId, o.createdAt, c.name, c.phone, c.email, c.address, c.city, c.pincode,
      o.itemsText || (o.items || []).map(i => `${i.name} x${i.qty}`).join(" | "),
      o.subtotal, o.discount, o.shipping, o.total, o.payment, o.status || "New"]);
  });
  const csv = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type:"text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `soleora-orders-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  toast("CSV downloaded");
}

/* ------------------------------------------------------------ WIRING */
function wire(){
  $("#refreshBtn").addEventListener("click", loadOrders);
  $("#exportBtn").addEventListener("click", exportCSV);
  $("#ordSearch").addEventListener("input", renderTable);
  $("#statusFilter").addEventListener("change", renderTable);
  $("#logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN.KEY_STORE);
    location.reload();
  });
  document.addEventListener("click", e => {
    const v = e.target.closest("[data-view]");
    if (v) return openOrder(v.dataset.view);
    if (e.target.closest("[data-close]") || e.target.id === "ordModal") closeOrder();
  });
  document.addEventListener("change", e => {
    const s = e.target.closest("[data-status]");
    if (s) setStatus(s.dataset.status, s.value);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeOrder(); });
  setInterval(() => { if (!$("#adm").hidden && !DEMO) loadOrders(); }, 60000);
}

document.addEventListener("DOMContentLoaded", initGate);
