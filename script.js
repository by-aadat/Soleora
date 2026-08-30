/* ==========================================================================
   SOLEORA — script.js
   Sections: Config · Data · Helpers · Render · Filters · Cart · Wishlist
             QuickView · Checkout · Sliders · Animations · Live · Init
   ========================================================================== */

/* ------------------------------------------------------------------ CONFIG */
const CONFIG = {
  /* Paste your Google Apps Script Web App URL here after deploying.
     Example: "https://script.google.com/macros/s/AKfy.../exec"
     Leave empty to run the store in demo mode (orders saved locally). */
  API_URL: "https://script.google.com/macros/s/AKfycby-ygU0zKnUExzCtEVkqgjDOgYeRyyPX9zKl7QN4AMe6W90GL61MTptwAS-zj0WraRi/exec",

  /* Set true only if you have added real photos inside images/products/.
     When false, SOLEORA draws its own premium shoe artwork (no 404s). */
  USE_IMAGE_FILES: true,

  FREE_SHIP_ABOVE: 999,
  SHIPPING_FEE: 99,
  STORE_NAME: "SOLEORA"
};

/* -------------------------------------------------------------------- DATA */
const COLOR_HEX = {
  White:"#f3f4f6", Black:"#1f2430", Navy:"#1e3a6e", Cream:"#f0e6d6", Coral:"#ff7043",
  Lavender:"#c9bcff", Mint:"#8fe3bd", Grey:"#9aa3b2", Brown:"#7b4b2a", Tan:"#c99b6b",
  Beige:"#e2d3bd", Olive:"#6b7a4a", Blue:"#3b82f6", Pink:"#f472b6", Red:"#ef4444",
  Green:"#22c55e", Gold:"#d9b45b", Ivory:"#f6f1e7", Yellow:"#f7c948"
};

const PRODUCTS = [
  {id:1,name:"AirFlex Runner X1",category:"Running",gender:"Men",ageGroup:"Adult",brand:"AirFlex",price:2499,oldPrice:3299,discount:24,rating:4.8,reviews:124,color:"White",sizes:[6,7,8,9,10,11],image:"images/products/shoe1.jpg",badge:"BEST SELLER",description:"Lightweight running shoes with a breathable knit upper and cushioned midsole for everyday miles."},
  {id:2,name:"UrbanStep Cloud Walk",category:"Walking",gender:"Women",ageGroup:"Adult",brand:"UrbanStep",price:1999,oldPrice:2799,discount:29,rating:4.6,reviews:210,color:"Lavender",sizes:[4,5,6,7,8],image:"images/products/shoe2.jpg",badge:"NEW",description:"Soft memory-foam walking shoes that stay comfortable through a full day on your feet."},
  {id:3,name:"StrideX Pro Court",category:"Sneakers",gender:"Men",ageGroup:"Adult",brand:"StrideX",price:3299,oldPrice:4499,discount:27,rating:4.7,reviews:318,color:"Navy",sizes:[6,7,8,9,10,11],image:"images/products/shoe3.jpg",badge:"BEST SELLER",description:"Court-inspired sneakers with a padded collar and grippy rubber outsole. Wears well with everything."},
  {id:4,name:"NovaWalk Breeze Slip-On",category:"Slip-Ons",gender:"Women",ageGroup:"Adult",brand:"NovaWalk",price:1499,oldPrice:2199,discount:32,rating:4.4,reviews:96,color:"Cream",sizes:[4,5,6,7,8],image:"images/products/shoe4.jpg",badge:"SALE",description:"Easy slip-on canvas shoes with stretch panels. On in seconds, comfortable all day."},
  {id:5,name:"StreetSoul High Top 90",category:"High-Top",gender:"Men",ageGroup:"Teenager",brand:"StreetSoul",price:2899,oldPrice:3999,discount:28,rating:4.5,reviews:142,color:"Black",sizes:[6,7,8,9,10],image:"images/products/shoe5.jpg",badge:"TRENDING",description:"Classic high-top silhouette with ankle support and a retro vulcanised sole."},
  {id:6,name:"PeakRun Velocity 3",category:"Running",gender:"Women",ageGroup:"Adult",brand:"PeakRun",price:3499,oldPrice:4799,discount:27,rating:4.9,reviews:402,color:"Coral",sizes:[4,5,6,7,8],image:"images/products/shoe6.jpg",badge:"BEST SELLER",description:"Responsive foam and a rocker sole that keeps you moving forward on long runs."},
  {id:7,name:"AirFlex Kiddo Bounce",category:"Sports",gender:"Boys",ageGroup:"Kids",brand:"AirFlex",price:1299,oldPrice:1899,discount:32,rating:4.6,reviews:88,color:"Blue",sizes:[1,2,3,4,5],image:"images/products/shoe7.jpg",badge:"NEW",description:"Bouncy play shoes built for running, jumping and everything in between."},
  {id:8,name:"NovaWalk Sparkle Star",category:"Casual",gender:"Girls",ageGroup:"Kids",brand:"NovaWalk",price:1199,oldPrice:1699,discount:29,rating:4.7,reviews:132,color:"Pink",sizes:[1,2,3,4,5],image:"images/products/shoe8.jpg",badge:"TRENDING",description:"Glitter-finish casual shoes with a soft lining and easy velcro strap."},
  {id:9,name:"UrbanStep Oxford Classic",category:"Formal",gender:"Men",ageGroup:"Adult",brand:"UrbanStep",price:2799,oldPrice:3899,discount:28,rating:4.5,reviews:176,color:"Brown",sizes:[6,7,8,9,10,11],image:"images/products/shoe9.jpg",badge:"",description:"Hand-finished leather oxfords with a cushioned insole for long formal days."},
  {id:10,name:"StrideX Office Derby",category:"Office",gender:"Men",ageGroup:"Adult",brand:"StrideX",price:3199,oldPrice:4299,discount:26,rating:4.4,reviews:91,color:"Black",sizes:[6,7,8,9,10,11],image:"images/products/shoe10.jpg",badge:"NEW",description:"Sleek derby shoes that pair with suits and chinos alike. Slip-resistant sole."},
  {id:11,name:"StreetSoul Party Shine",category:"Party",gender:"Women",ageGroup:"Adult",brand:"StreetSoul",price:2299,oldPrice:3299,discount:30,rating:4.3,reviews:64,color:"Gold",sizes:[4,5,6,7,8],image:"images/products/shoe11.jpg",badge:"SALE",description:"Metallic party shoes with a low block heel you can actually dance in."},
  {id:12,name:"NovaWalk Wedding Bloom",category:"Wedding",gender:"Women",ageGroup:"Adult",brand:"NovaWalk",price:3999,oldPrice:5499,discount:27,rating:4.8,reviews:58,color:"Ivory",sizes:[4,5,6,7,8],image:"images/products/shoe12.jpg",badge:"PREMIUM",description:"Embellished bridal footwear with a padded footbed for long ceremonies."},
  {id:13,name:"AirFlex School Grip",category:"School",gender:"Boys",ageGroup:"Kids",brand:"AirFlex",price:999,oldPrice:1399,discount:29,rating:4.5,reviews:220,color:"Black",sizes:[1,2,3,4,5],image:"images/products/shoe13.jpg",badge:"BEST SELLER",description:"Everyday school shoes with a scuff-resistant toe and washable lining."},
  {id:14,name:"UrbanStep School Mary",category:"School",gender:"Girls",ageGroup:"Kids",brand:"UrbanStep",price:1099,oldPrice:1499,discount:27,rating:4.4,reviews:154,color:"Black",sizes:[1,2,3,4,5],image:"images/products/shoe14.jpg",badge:"",description:"Mary-jane school shoes with an adjustable strap and flexible sole."},
  {id:15,name:"PeakRun Gym Force",category:"Gym",gender:"Men",ageGroup:"Adult",brand:"PeakRun",price:2699,oldPrice:3599,discount:25,rating:4.6,reviews:187,color:"Grey",sizes:[6,7,8,9,10,11],image:"images/products/shoe15.jpg",badge:"TRENDING",description:"Flat, stable trainers built for lifting, HIIT and cross-training sessions."},
  {id:16,name:"StrideX Trail Travel",category:"Travel",gender:"Men",ageGroup:"Adult",brand:"StrideX",price:3799,oldPrice:4999,discount:24,rating:4.7,reviews:143,color:"Olive",sizes:[6,7,8,9,10,11],image:"images/products/shoe16.jpg",badge:"NEW",description:"Water-repellent travel shoes with a rugged grip sole for city walks and trails."},
  {id:17,name:"StreetSoul Loafer Luxe",category:"Loafers",gender:"Men",ageGroup:"Adult",brand:"StreetSoul",price:2599,oldPrice:3499,discount:26,rating:4.5,reviews:77,color:"Tan",sizes:[6,7,8,9,10],image:"images/products/shoe17.jpg",badge:"",description:"Suede loafers with a soft moc-toe stitch. Smart enough for work, easy on weekends."},
  {id:18,name:"NovaWalk Comfort Sandal",category:"Sandals",gender:"Women",ageGroup:"Senior",brand:"NovaWalk",price:1399,oldPrice:1899,discount:26,rating:4.6,reviews:245,color:"Beige",sizes:[4,5,6,7,8],image:"images/products/shoe18.jpg",badge:"BEST SELLER",description:"Contoured footbed sandals with arch support and adjustable straps."},
  {id:19,name:"AirFlex Easy Sandal",category:"Sandals",gender:"Men",ageGroup:"Senior",brand:"AirFlex",price:1299,oldPrice:1799,discount:28,rating:4.3,reviews:130,color:"Brown",sizes:[6,7,8,9,10],image:"images/products/shoe19.jpg",badge:"",description:"Lightweight everyday sandals with a soft EVA sole and secure velcro fit."},
  {id:20,name:"PeakRun Teen Dash",category:"Sports",gender:"Boys",ageGroup:"Teenager",brand:"PeakRun",price:2199,oldPrice:2999,discount:27,rating:4.5,reviews:168,color:"Green",sizes:[4,5,6,7,8],image:"images/products/shoe20.jpg",badge:"NEW",description:"Fast, flexible sports shoes made for school games and after-school practice."},
  {id:21,name:"StreetSoul Girl Glow",category:"Fashion",gender:"Girls",ageGroup:"Teenager",brand:"StreetSoul",price:1899,oldPrice:2599,discount:27,rating:4.6,reviews:121,color:"Lavender",sizes:[3,4,5,6,7],image:"images/products/shoe21.jpg",badge:"TRENDING",description:"Chunky-sole fashion sneakers in a soft pastel finish. Made to be noticed."},
  {id:22,name:"UrbanStep Daily Canvas",category:"Casual",gender:"Women",ageGroup:"Adult",brand:"UrbanStep",price:1599,oldPrice:2299,discount:30,rating:4.4,reviews:199,color:"White",sizes:[4,5,6,7,8],image:"images/products/shoe22.jpg",badge:"SALE",description:"Clean canvas sneakers that go with jeans, kurtas and everything else."},
  {id:23,name:"StrideX Sprint Lite",category:"Running",gender:"Boys",ageGroup:"Kids",brand:"StrideX",price:1699,oldPrice:2299,discount:26,rating:4.7,reviews:110,color:"Red",sizes:[1,2,3,4,5],image:"images/products/shoe23.jpg",badge:"",description:"Junior running shoes with a light foam sole and reflective side stripe."},
  {id:24,name:"PeakRun Marathon Elite",category:"Running",gender:"Men",ageGroup:"Adult",brand:"PeakRun",price:4499,oldPrice:5999,discount:25,rating:4.9,reviews:356,color:"Black",sizes:[6,7,8,9,10,11],image:"images/products/shoe24.jpg",badge:"PREMIUM",description:"Race-day shoes with a carbon-tuned plate and energy-return foam."},
  {id:25,name:"AirFlex Glide Sneaker",category:"Sneakers",gender:"Women",ageGroup:"Teenager",brand:"AirFlex",price:2099,oldPrice:2899,discount:28,rating:4.5,reviews:205,color:"Mint",sizes:[4,5,6,7,8],image:"images/products/shoe25.jpg",badge:"NEW",description:"Low-profile sneakers with a soft pastel upper and cushioned collar."},
  {id:26,name:"UrbanStep Senior Soft",category:"Walking",gender:"Men",ageGroup:"Senior",brand:"UrbanStep",price:1799,oldPrice:2499,discount:28,rating:4.6,reviews:162,color:"Grey",sizes:[6,7,8,9,10],image:"images/products/shoe26.jpg",badge:"",description:"Wide-fit walking shoes with velcro closure and extra heel cushioning."},
  {id:27,name:"NovaWalk Kids Splash",category:"Casual",gender:"Kids",ageGroup:"Kids",brand:"NovaWalk",price:899,oldPrice:1299,discount:31,rating:4.3,reviews:143,color:"Yellow",sizes:[1,2,3,4,5],image:"images/products/shoe27.jpg",badge:"SALE",description:"Bright everyday shoes for kids, easy to wipe clean after playtime."},
  {id:28,name:"StreetSoul Retro 82",category:"Sneakers",gender:"Men",ageGroup:"Teenager",brand:"StreetSoul",price:2799,oldPrice:3699,discount:24,rating:4.6,reviews:231,color:"Cream",sizes:[6,7,8,9,10,11],image:"images/products/shoe28.jpg",badge:"TRENDING",description:"Retro runner silhouette with suede overlays and a gum-effect outsole."}
];

const CATEGORIES = [
  {key:"Men",    title:"Men",     desc:"Sneakers, formals and everyday comfort", bg:"#1e3a6e", img:"images/categories/men.jpg",    color:"Navy"},
  {key:"Women",  title:"Women",   desc:"Style that keeps up with your day",      bg:"#7c5cbf", img:"images/categories/women.jpg",  color:"Lavender"},
  {key:"Girls",  title:"Girls",   desc:"Playful pairs they'll want to wear",     bg:"#c4497b", img:"images/categories/girls.jpg",  color:"Pink"},
  {key:"Boys",   title:"Boys",    desc:"Built for running, school and play",     bg:"#1f7a8c", img:"images/categories/boys.jpg",   color:"Blue"},
  {key:"Kids",   title:"Kids",    desc:"Little feet, big adventures",            bg:"#d98324", img:"images/categories/kids.jpg",   color:"Yellow"},
  {key:"Sports", title:"Sports",  desc:"Running, gym and match-day grip",        bg:"#2f6b4f", img:"images/categories/sports.jpg", color:"Green"},
  {key:"Casual", title:"Casual",  desc:"Easy shoes for ordinary days",           bg:"#8a6a4b", img:"images/categories/casual.jpg", color:"Tan"},
  {key:"Formal", title:"Formal",  desc:"Sharp finishes for office and events",   bg:"#2b2f3a", img:"images/categories/formal.jpg", color:"Black"}
];

const OCCASIONS = [
  {key:"Running", icon:"🏃", desc:"Light, springy and road-ready",  bg:"#ffe6dc"},
  {key:"Gym",     icon:"🏋", desc:"Stable soles for heavy days",     bg:"#e9e4ff"},
  {key:"Casual",  icon:"🌤", desc:"Comfort for ordinary mornings",   bg:"#ddf7ea"},
  {key:"Office",  icon:"💼", desc:"Sharp from 9 to 9",               bg:"#e2eeff"},
  {key:"Party",   icon:"✨", desc:"Shine without the sore feet",     bg:"#ffeef6"},
  {key:"Wedding", icon:"💍", desc:"Dress up, stay comfortable",      bg:"#fff3d9"},
  {key:"Travel",  icon:"🧳", desc:"Grip for every kind of street",   bg:"#e6f4ff"},
  {key:"School",  icon:"🎒", desc:"Tough enough for the whole year", bg:"#f0f0e2"}
];

const BRANDS = ["AirFlex","UrbanStep","StrideX","NovaWalk","StreetSoul","PeakRun"];

const REVIEWS = [
  {name:"Ananya Sharma", city:"Delhi",     rating:5, text:"Ordered the Velocity 3 for my morning runs. Fit was perfect out of the box and delivery took two days."},
  {name:"Rohit Verma",   city:"Mumbai",    rating:5, text:"The Pro Court sneakers look far more expensive than they cost. Got compliments the first day I wore them."},
  {name:"Meera Nair",    city:"Kochi",     rating:4, text:"Bought school shoes for both my kids. Sturdy, and the size exchange was handled in three days."},
  {name:"Arjun Singh",   city:"Jaipur",    rating:5, text:"Office derbies that don't hurt after ten hours. That alone earns the five stars."},
  {name:"Fatima Khan",   city:"Hyderabad", rating:5, text:"The comfort sandals are the only pair my mother wears now. Ordering a second one."},
  {name:"Karan Mehta",   city:"Pune",      rating:4, text:"Retro 82 runs half a size small, so size up. Quality of the suede is genuinely good."},
  {name:"Priya Iyer",    city:"Bengaluru", rating:5, text:"Wedding Bloom held up through a full sangeet and reception. Worth every rupee."},
  {name:"Dev Patel",     city:"Ahmedabad", rating:5, text:"Gym Force is flat and stable exactly like the description said. No marketing nonsense."}
];

/* ----------------------------------------------------------------- HELPERS */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const inr = n => "₹" + Number(n).toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icon = n => `<svg class="ico"><use href="#s-${n}"/></svg>`;
const hex = c => COLOR_HEX[c] || "#cfd4dc";

function shade(h, amt){
  const n = parseInt(h.slice(1), 16);
  const cl = v => Math.max(0, Math.min(255, v));
  const r = cl((n >> 16) + amt), g = cl(((n >> 8) & 255) + amt), b = cl((n & 255) + amt);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* Draws the product artwork as an inline SVG so the store looks complete
   even before real photography is added to images/products/. */
function shoeArt(product){
  const c   = hex(product.color);
  const c2  = shade(c, -34);
  const acc = ["Formal","Office","Loafers","Wedding"].includes(product.category) ? shade(c, 30) : "#FF7043";
  const id  = "g" + product.id;
  let shape = "sneaker";
  if (["Formal","Office","Loafers","Party","Wedding"].includes(product.category)) shape = "formal";
  if (product.category === "Sandals") shape = "sandal";

  const body = {
    sneaker:`<path d="M18 104V88c0-8 5-14 13-17l35-13c10-4 18-10 27-19l11-11c7-7 17-9 25-5s12 13 11 22l-2 13c-1 9 4 17 13 20l45 15c13 4 20 13 20 25v2c0 4-3 7-7 7H27c-5 0-9-4-9-9z" fill="url(#${id})"/>
      <path d="M40 108c40-14 80-22 130-10" stroke="${acc}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".92"/>
      <g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".78">
        <path d="M96 52 116 44"/><path d="M104 64 124 56"/><path d="M112 76 132 68"/>
      </g>`,
    formal:`<path d="M22 110c0-14 8-22 22-26l52-16c12-4 22-10 32-18l14-11c10-8 24-7 32 1 12 12 22 26 28 42l6 16c4 10-2 20-12 20H32c-6 0-10-3-10-8z" fill="url(#${id})"/>
      <path d="M110 62c14 8 30 12 48 12" stroke="${acc}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M60 100c30-8 60-12 96-6" stroke="#ffffff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".55"/>`,
    sandal:`<path d="M30 96c0-12 14-20 40-22l110-6c22-2 34 8 34 20 0 14-14 22-36 24L68 118c-24 2-38-8-38-22z" fill="url(#${id})"/>
      <path d="M62 92c16-18 40-22 58-8" stroke="${acc}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M136 84c14-12 32-12 44 0" stroke="${acc}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/>`
  }[shape];

  const soleY = shape === "sandal" ? 116 : 126;
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 148" width="240" height="148">
<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
${body}
<rect x="14" y="${soleY}" width="212" height="14" rx="7" fill="#101828" opacity=".9"/>
<rect x="14" y="${soleY}" width="212" height="5" rx="2.5" fill="${acc}" opacity=".85"/>
</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function imgTag(p, cls = ""){
  const fallback = shoeArt(p);
  if (!CONFIG.USE_IMAGE_FILES) return `<img class="${cls}" src="${fallback}" alt="${esc(p.name)}" loading="lazy" />`;
  return `<img class="${cls}" src="${esc(p.image)}" data-fb="${fallback}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.fb" />`;
}

function badgeClass(b){
  if (b === "SALE") return "card__badge--sale";
  if (b === "NEW") return "card__badge--new";
  if (b === "PREMIUM") return "card__badge--premium";
  return "";
}
const needsSize = p => p.sizes && p.sizes.length > 0;

/* -------------------------------------------------------------------- STATE */
const KEY = { cart:"soleora_cart", wish:"soleora_wishlist", orders:"soleora_orders" };

const state = {
  cart: [],
  wishlist: [],
  chosenSize: {},        // productId -> size
  visible: 12,
  sort: "featured",
  search: "",
  filters: { gender:[], category:[], ageGroup:[], brand:[], color:[], size:[], rating:0, min:500, max:10000 }
};

function saveCart(){ localStorage.setItem(KEY.cart, JSON.stringify(state.cart)); }
function loadCart(){ try{ state.cart = JSON.parse(localStorage.getItem(KEY.cart)) || []; }catch{ state.cart = []; } }
function saveWishlist(){ localStorage.setItem(KEY.wish, JSON.stringify(state.wishlist)); }
function loadWishlist(){ try{ state.wishlist = JSON.parse(localStorage.getItem(KEY.wish)) || []; }catch{ state.wishlist = []; } }

/* ------------------------------------------------------------------- TOASTS */
let toastTimer = 0;
function showToast(msg, type = "ok"){
  const wrap = $("#toasts");
  const el = document.createElement("div");
  el.className = "toast" + (type === "warn" ? " toast--warn" : "");
  el.innerHTML = `${icon(type === "warn" ? "bolt" : "check")}<span>${esc(msg)}</span>`;
  wrap.appendChild(el);
  clearTimeout(toastTimer);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 2600);
}

/* -------------------------------------------------------------- PRODUCT CARD */
function productCard(p, i = 0){
  const wished = state.wishlist.includes(p.id);
  const sel = state.chosenSize[p.id];
  return `
  <article class="card" style="--i:${i};--card-bg:${shade(hex(p.color), 66)}" data-id="${p.id}">
    <div class="card__media">
      ${p.badge ? `<span class="card__badge ${badgeClass(p.badge)}">${esc(p.badge)}</span>` : ""}
      <button class="card__wish ${wished ? "is-on" : ""}" data-wish="${p.id}" aria-label="${wished ? "Remove from" : "Add to"} wishlist" aria-pressed="${wished}">${icon("heart")}</button>
      ${imgTag(p)}
      <button class="card__quick" data-quick="${p.id}">${icon("eye")} Quick view</button>
    </div>
    <div class="card__body">
      <span class="card__brand">${esc(p.brand)}</span>
      <h3 class="card__name">${esc(p.name)}</h3>
      <div class="card__meta">
        <span class="rating">${p.rating} ${icon("star")}</span>
        <span>${p.reviews} reviews</span>
      </div>
      <div class="card__price">
        <span class="price">${inr(p.price)}</span>
        <span class="price--old">${inr(p.oldPrice)}</span>
        <span class="price--off">${p.discount}% off</span>
      </div>
      <div class="card__sizes">
        ${p.sizes.map(s => `<button class="size ${sel === s ? "is-on" : ""}" data-size="${s}" data-for="${p.id}">${s}</button>`).join("")}
      </div>
      <button class="card__add" data-add="${p.id}">${icon("cart")} Add to cart</button>
    </div>
  </article>`;
}

/* ------------------------------------------------------------------- FILTERS */
function matchesFilters(p){
  const f = state.filters;
  const saleOnly = f.gender.includes("__SALE__");
  if (saleOnly && p.discount < 26) return false;
  const genders = f.gender.filter(g => g !== "__SALE__");
  if (genders.length && !genders.includes(p.gender)) return false;
  if (f.category.length && !f.category.includes(p.category)) return false;
  if (f.ageGroup.length && !f.ageGroup.includes(p.ageGroup)) return false;
  if (f.brand.length && !f.brand.includes(p.brand)) return false;
  if (f.color.length && !f.color.includes(p.color)) return false;
  if (f.size.length && !p.sizes.some(s => f.size.includes(String(s)))) return false;
  if (f.rating && p.rating < f.rating) return false;
  if (p.price < f.min || p.price > f.max) return false;
  return true;
}

function searchProducts(list){
  const q = state.search.trim().toLowerCase();
  if (!q) return list;
  const num = q.replace(/[^\d]/g, "");
  return list.filter(p => {
    const hay = [p.name, p.brand, p.category, p.gender, p.ageGroup, p.color, p.badge, p.description].join(" ").toLowerCase();
    if (hay.includes(q)) return true;
    if (num && String(p.price).includes(num)) return true;
    return false;
  });
}

function sortProducts(list){
  const l = list.slice();
  switch (state.sort){
    case "newest":     return l.sort((a,b) => b.id - a.id);
    case "price-asc":  return l.sort((a,b) => a.price - b.price);
    case "price-desc": return l.sort((a,b) => b.price - a.price);
    case "rating":     return l.sort((a,b) => b.rating - a.rating);
    case "popular":    return l.sort((a,b) => b.reviews - a.reviews);
    default:           return l.sort((a,b) => (b.rating * 20 + b.reviews / 10) - (a.rating * 20 + a.reviews / 10));
  }
}

function filterProducts(){
  return sortProducts(searchProducts(PRODUCTS.filter(matchesFilters)));
}

function renderProducts(){
  const list = filterProducts();
  const grid = $("#productGrid");
  const shown = list.slice(0, state.visible);

  grid.innerHTML = shown.map((p, i) => productCard(p, i)).join("");
  $("#resultCount").textContent = list.length;
  $("#filterResultCount").textContent = list.length;
  $("#emptyState").hidden = list.length > 0;
  grid.hidden = list.length === 0;
  $("#loadMore").parentElement.hidden = list.length <= state.visible;
  renderChips();
}

function renderChips(){
  const f = state.filters;
  const chips = [];
  const push = (group, val, label) => chips.push(`<button class="chip" data-chip="${group}" data-val="${esc(val)}">${esc(label)} ${icon("close")}</button>`);
  f.gender.forEach(v => push("gender", v, v === "__SALE__" ? "On sale" : v));
  f.category.forEach(v => push("category", v, v));
  f.ageGroup.forEach(v => push("ageGroup", v, v));
  f.brand.forEach(v => push("brand", v, v));
  f.color.forEach(v => push("color", v, v));
  f.size.forEach(v => push("size", v, "Size " + v));
  if (f.rating) push("rating", f.rating, f.rating + "★ & up");
  if (f.min > 500 || f.max < 10000) push("price", "range", `${inr(f.min)} – ${inr(f.max)}`);
  if (state.search) push("search", "q", `“${state.search}”`);
  if (chips.length > 1) chips.push(`<button class="chip chip--clear" data-chip="all">Clear all ${icon("close")}</button>`);
  $("#activeChips").innerHTML = chips.join("");
}

function buildFilters(){
  const uniq = k => [...new Set(PRODUCTS.map(p => p[k]))];
  const count = (k, v) => PRODUCTS.filter(p => p[k] === v).length;
  const group = (title, key, values, open = true) => `
    <div class="fgroup ${open ? "" : "is-closed"}" data-group>
      <button class="fgroup__title" data-toggle>${title} ${icon("down")}</button>
      <div class="fgroup__body">
        ${values.map(v => `<label class="check"><input type="checkbox" data-f="${key}" value="${esc(v)}"><span>${esc(v)}</span><small>${count(key, v)}</small></label>`).join("")}
      </div>
    </div>`;

  const sizes = [...new Set(PRODUCTS.flatMap(p => p.sizes))].sort((a,b) => a - b);
  const colors = uniq("color");

  $("#filtersBody").innerHTML = `
    ${group("Gender", "gender", uniq("gender"))}
    ${group("Category", "category", uniq("category").sort(), false)}
    ${group("Age group", "ageGroup", ["Kids","Teenager","Adult","Senior"])}
    ${group("Brand", "brand", BRANDS, false)}
    <div class="fgroup" data-group>
      <button class="fgroup__title" data-toggle>Colour ${icon("down")}</button>
      <div class="fgroup__body">
        <div class="swatches">
          ${colors.map(c => `<button class="swatch" data-color="${c}" style="background:${hex(c)}" title="${c}" aria-label="${c}"></button>`).join("")}
        </div>
      </div>
    </div>
    <div class="fgroup" data-group>
      <button class="fgroup__title" data-toggle>Size ${icon("down")}</button>
      <div class="fgroup__body">
        <div class="sizerow">${sizes.map(s => `<button class="sizebtn" data-fsize="${s}">${s}</button>`).join("")}</div>
      </div>
    </div>
    <div class="fgroup" data-group>
      <button class="fgroup__title" data-toggle>Price ${icon("down")}</button>
      <div class="fgroup__body">
        <div class="range">
          <div class="range__vals"><span id="pMinLabel">₹500</span><span id="pMaxLabel">₹10,000</span></div>
          <input type="range" id="pMin" min="500" max="10000" step="100" value="500" aria-label="Minimum price">
          <input type="range" id="pMax" min="500" max="10000" step="100" value="10000" aria-label="Maximum price">
        </div>
      </div>
    </div>
    <div class="fgroup" data-group>
      <button class="fgroup__title" data-toggle>Rating ${icon("down")}</button>
      <div class="fgroup__body">
        ${[4.5, 4.0, 3.5].map(r => `<label class="check"><input type="radio" name="rt" data-rating="${r}"><span>${r}★ &amp; up</span></label>`).join("")}
      </div>
    </div>`;
}

function syncFilterUI(){
  $$("#filtersBody input[type=checkbox]").forEach(cb => {
    cb.checked = state.filters[cb.dataset.f].includes(cb.value);
  });
  $$(".swatch").forEach(s => s.classList.toggle("is-on", state.filters.color.includes(s.dataset.color)));
  $$(".sizebtn").forEach(s => s.classList.toggle("is-on", state.filters.size.includes(s.dataset.fsize)));
  const pMin = $("#pMin"), pMax = $("#pMax");
  if (pMin){ pMin.value = state.filters.min; pMax.value = state.filters.max; }
  $("#pMinLabel").textContent = inr(state.filters.min);
  $("#pMaxLabel").textContent = inr(state.filters.max);
}

function resetFilters(){
  state.filters = { gender:[], category:[], ageGroup:[], brand:[], color:[], size:[], rating:0, min:500, max:10000 };
  state.search = "";
  $("#searchInput").value = "";
  $$("#filtersBody input[type=radio]").forEach(r => r.checked = false);
  state.visible = 12;
  syncFilterUI();
  renderProducts();
}

function applyNav(value){
  resetFilters();
  if (value === "all"){ /* nothing */ }
  else if (value === "Sale") state.filters.gender = ["__SALE__"];
  else if (value === "Sports") state.filters.category = ["Sports","Running","Gym"];
  else if (value === "Kids") state.filters.ageGroup = ["Kids"];
  else if (["Men","Women","Boys","Girls"].includes(value)) state.filters.gender = [value];
  else if (CATEGORIES.some(c => c.key === value)) state.filters.category = [value];
  syncFilterUI();
  renderProducts();
  $("#shop").scrollIntoView({ behavior:"smooth", block:"start" });
}

/* ---------------------------------------------------------------------- CART */
function cartKey(id, size){ return id + "::" + size; }

function addToCart(id, size){
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  if (needsSize(p) && !size){ showToast("Please select a shoe size", "warn"); return; }
  const k = cartKey(id, size);
  const line = state.cart.find(l => l.key === k);
  if (line) line.qty += 1;
  else state.cart.push({ key:k, id, size, qty:1 });
  saveCart(); updateCartCount(); renderCart();
  showToast(`${p.name} added to cart`);
  bump("#cartCount");
}

function removeFromCart(key){
  state.cart = state.cart.filter(l => l.key !== key);
  saveCart(); updateCartCount(); renderCart();
  showToast("Removed from cart");
}
function increaseQuantity(key){
  const l = state.cart.find(x => x.key === key); if (!l) return;
  l.qty += 1; saveCart(); updateCartCount(); renderCart();
}
function decreaseQuantity(key){
  const l = state.cart.find(x => x.key === key); if (!l) return;
  l.qty -= 1;
  if (l.qty <= 0) return removeFromCart(key);
  saveCart(); updateCartCount(); renderCart();
}

function cartTotals(){
  let subtotal = 0, discount = 0, items = 0;
  state.cart.forEach(l => {
    const p = PRODUCTS.find(x => x.id === l.id); if (!p) return;
    subtotal += p.oldPrice * l.qty;
    discount += (p.oldPrice - p.price) * l.qty;
    items += l.qty;
  });
  const payable = subtotal - discount;
  const shipping = items === 0 ? 0 : (payable >= CONFIG.FREE_SHIP_ABOVE ? 0 : CONFIG.SHIPPING_FEE);
  return { subtotal, discount, shipping, total: payable + shipping, items, payable };
}

function updateTotals(){
  const t = cartTotals();
  $("#tSubtotal").textContent = inr(t.subtotal);
  $("#tShipping").textContent = t.shipping ? inr(t.shipping) : "Free";
  $("#tDiscount").textContent = "−" + inr(t.discount);
  $("#tTotal").textContent = inr(t.total);
  const gap = CONFIG.FREE_SHIP_ABOVE - t.payable;
  $("#freeShipNote").innerHTML = gap > 0
    ? `Add <b>${inr(gap)}</b> more for free shipping`
    : `You've unlocked <b>free shipping</b> 🎉`;
}

function updateCartCount(){
  const n = state.cart.reduce((s,l) => s + l.qty, 0);
  $("#cartCount").textContent = n;
  $("#cartItemsLabel").textContent = n ? `(${n} item${n > 1 ? "s" : ""})` : "";
}

function renderCart(){
  const body = $("#cartBody"), foot = $("#cartFoot");
  if (!state.cart.length){
    body.innerHTML = `<div class="empty"><div class="empty__icon">🛒</div><h3>Your cart is empty</h3><p>Find a pair you'll love.</p><button class="btn btn--dark" data-shop="all">Shop shoes</button></div>`;
    foot.hidden = true; return;
  }
  foot.hidden = false;
  body.innerHTML = state.cart.map(l => {
    const p = PRODUCTS.find(x => x.id === l.id); if (!p) return "";
    return `<div class="citem">
      <div class="citem__img" style="background:${shade(hex(p.color), 70)}">${imgTag(p)}</div>
      <div>
        <h4>${esc(p.name)}</h4>
        <small>${esc(p.brand)}${l.size ? " · Size " + l.size : ""}</small>
        <p class="citem__price">${inr(p.price)}</p>
      </div>
      <div class="citem__side">
        <div class="qty">
          <button data-dec="${l.key}" aria-label="Decrease quantity">${icon("minus")}</button>
          <b>${l.qty}</b>
          <button data-inc="${l.key}" aria-label="Increase quantity">${icon("plus")}</button>
        </div>
        <button class="citem__del" data-del="${l.key}">${icon("trash")} Remove</button>
      </div>
    </div>`;
  }).join("");
  updateTotals();
}

/* ------------------------------------------------------------------ WISHLIST */
function addToWishlist(id){
  if (!state.wishlist.includes(id)) state.wishlist.push(id);
  saveWishlist(); updateWishlistCount(); renderWishlist();
  showToast("Added to wishlist ♥"); bump("#wishCount");
}
function removeFromWishlist(id){
  state.wishlist = state.wishlist.filter(x => x !== id);
  saveWishlist(); updateWishlistCount(); renderWishlist();
  showToast("Removed from wishlist");
}
function updateWishlistCount(){ $("#wishCount").textContent = state.wishlist.length; }

function renderWishlist(){
  const body = $("#wishBody");
  if (!state.wishlist.length){
    body.innerHTML = `<div class="empty"><div class="empty__icon">♡</div><h3>Your wishlist is empty</h3><p>Tap the heart on any pair to save it here.</p><button class="btn btn--dark" data-shop="all">Shop shoes</button></div>`;
    return;
  }
  body.innerHTML = state.wishlist.map(id => {
    const p = PRODUCTS.find(x => x.id === id); if (!p) return "";
    return `<div class="citem">
      <div class="citem__img" style="background:${shade(hex(p.color), 70)}">${imgTag(p)}</div>
      <div>
        <h4>${esc(p.name)}</h4><small>${esc(p.brand)} · ${esc(p.category)}</small>
        <p class="citem__price">${inr(p.price)}</p>
      </div>
      <div class="citem__side">
        <button class="btn btn--dark btn--sm" data-quick="${p.id}">View</button>
        <button class="citem__del" data-unwish="${p.id}">${icon("trash")} Remove</button>
      </div>
    </div>`;
  }).join("");
  $$(".card__wish").forEach(b => {
    const on = state.wishlist.includes(Number(b.dataset.wish));
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on);
  });
}

function bump(sel){
  const el = $(sel); el.classList.add("pop");
  setTimeout(() => el.classList.remove("pop"), 300);
}

/* ----------------------------------------------------------------- QUICKVIEW */
let lastFocus = null;

function openQuickView(id){
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const sel = state.chosenSize[p.id];
  $("#qvCard").innerHTML = `
    <button class="icon-btn modal__x" data-close="quickView" aria-label="Close quick view">${icon("close")}</button>
    <div class="qv">
      <div class="qv__media" style="--card-bg:${shade(hex(p.color), 62)}">${imgTag(p)}</div>
      <div class="qv__body">
        <span class="card__brand">${esc(p.brand)} · ${esc(p.category)}</span>
        <h2 id="qvName">${esc(p.name)}</h2>
        <div class="card__meta"><span class="rating">${p.rating} ${icon("star")}</span><span>${p.reviews} reviews</span></div>
        <div class="card__price"><span class="price">${inr(p.price)}</span><span class="price--old">${inr(p.oldPrice)}</span><span class="price--off">${p.discount}% off</span></div>
        <p class="qv__desc">${esc(p.description)}</p>
        <p class="qv__label">Colour</p>
        <div class="swatches"><button class="swatch is-on" style="background:${hex(p.color)}" title="${p.color}" aria-label="${p.color}"></button></div>
        <p class="qv__label">Select size</p>
        <div class="sizerow">${p.sizes.map(s => `<button class="sizebtn ${sel === s ? "is-on" : ""}" data-size="${s}" data-for="${p.id}">${s}</button>`).join("")}</div>
        <div class="qv__actions">
          <button class="btn btn--outline" data-add="${p.id}">${icon("cart")} Add to cart</button>
          <button class="btn btn--dark" data-buy="${p.id}">Buy now</button>
        </div>
        <p class="form__note">Free delivery above ${inr(CONFIG.FREE_SHIP_ABOVE)} · 7-day returns</p>
      </div>
    </div>`;
  openModal("quickView");
}
function closeQuickView(){ closeModal("quickView"); }

/* ------------------------------------------------------- OVERLAY MANAGEMENT */
const OVERLAYS = ["mobileMenu","cartDrawer","wishDrawer"];

function openDrawer(id){
  lastFocus = document.activeElement;
  $("#" + id).hidden = false;
  $("#scrim").hidden = false;
  document.body.style.overflow = "hidden";
  const f = $("#" + id).querySelector("button, a, input");
  if (f) f.focus();
  if (id === "mobileMenu") $("#burgerBtn").setAttribute("aria-expanded", "true");
}
function closeDrawer(id){
  const el = $("#" + id); if (!el || el.hidden) return;
  el.hidden = true;
  if (id === "mobileMenu") $("#burgerBtn").setAttribute("aria-expanded", "false");
  maybeHideScrim();
}
function openModal(id){
  lastFocus = document.activeElement;
  $("#" + id).hidden = false;
  document.body.style.overflow = "hidden";
  const f = $("#" + id).querySelector("button, input");
  if (f) f.focus();
}
function closeModal(id){
  const el = $("#" + id); if (!el || el.hidden) return;
  el.hidden = true;
  maybeHideScrim();
  if (lastFocus) lastFocus.focus();
}
function isSheetOpen(){ return window.matchMedia("(max-width:980px)").matches && $("#filters").classList.contains("is-open"); }
function maybeHideScrim(){
  const anyOpen = OVERLAYS.some(id => !$("#" + id).hidden) || !$("#quickView").hidden || !$("#checkoutModal").hidden || isSheetOpen();
  if (!anyOpen){ $("#scrim").hidden = true; document.body.style.overflow = ""; }
}
function closeAll(){
  OVERLAYS.forEach(closeDrawer);
  closeModal("quickView"); closeModal("checkoutModal");
  closeFilterSheet();
  maybeHideScrim();
}
function openCart(){ renderCart(); openDrawer("cartDrawer"); }
function closeCart(){ closeDrawer("cartDrawer"); }
function openMobileMenu(){ openDrawer("mobileMenu"); }
function closeMobileMenu(){ closeDrawer("mobileMenu"); }

function openFilterSheet(){
  if (window.matchMedia("(max-width:980px)").matches){
    $("#filters").classList.add("is-open");
    $("#filters").style.display = "block";
    $("#scrim").hidden = false;
    document.body.style.overflow = "hidden";
  }
}
function closeFilterSheet(){
  $("#filters").classList.remove("is-open");
  if (window.matchMedia("(max-width:980px)").matches) $("#filters").style.display = "none";
  maybeHideScrim();
}

/* ------------------------------------------------------------------ CHECKOUT */
function orderId(){
  return "SOL" + Date.now().toString().slice(-7) + Math.floor(Math.random() * 90 + 10);
}

function openCheckout(){
  if (!state.cart.length){ showToast("Your cart is empty", "warn"); return; }
  const t = cartTotals();
  $("#coSummary").innerHTML = `
    <div><span>${t.items} item${t.items > 1 ? "s" : ""}</span><span>${inr(t.subtotal)}</span></div>
    <div><span>Discount</span><span>−${inr(t.discount)}</span></div>
    <div><span>Shipping</span><span>${t.shipping ? inr(t.shipping) : "Free"}</span></div>
    <div class="big"><span>To pay</span><span>${inr(t.total)}</span></div>`;
  closeCart();
  openModal("checkoutModal");
}

async function submitOrder(e){
  e.preventDefault();
  const form = $("#orderForm");
  const data = Object.fromEntries(new FormData(form).entries());
  let bad = false;
  ["name","phone","address","city","pincode"].forEach(k => {
    const input = form.elements[k];
    const empty = !String(data[k] || "").trim();
    input.classList.toggle("is-bad", empty);
    if (empty) bad = true;
  });
  if (!/^[6-9]\d{9}$/.test(String(data.phone).replace(/\D/g, "").slice(-10))){
    form.elements.phone.classList.add("is-bad"); bad = true;
  }
  if (bad){ showToast("Check the highlighted fields", "warn"); return; }

  const t = cartTotals();
  const items = state.cart.map(l => {
    const p = PRODUCTS.find(x => x.id === l.id);
    return { id:p.id, name:p.name, brand:p.brand, size:l.size, qty:l.qty, price:p.price };
  });
  const order = {
    orderId: orderId(),
    createdAt: new Date().toISOString(),
    customer: data,
    items,
    itemsText: items.map(i => `${i.name} (size ${i.size}) x${i.qty}`).join(" | "),
    subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total,
    payment: data.payment, status: "New"
  };

  const btn = $("#placeOrderBtn");
  btn.disabled = true; btn.textContent = "Placing order…";

  let saved = false;
  if (CONFIG.API_URL){
    const body = JSON.stringify({ action: "createOrder", order });
    try{
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body
      });
      const json = await res.json();
      saved = !!json.ok;
    }catch(err){
      /* Apps Script redirects its response through another domain, which some
         browsers block. Resend without reading the reply - the row still lands
         in the sheet, we just cannot confirm it here. */
      try{
        await fetch(CONFIG.API_URL, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body
        });
        saved = true;
      }catch(err2){
        saved = false;
        console.warn("SOLEORA: order could not reach the backend.", err2);
      }
    }
  }

  const local = JSON.parse(localStorage.getItem(KEY.orders) || "[]");
  local.unshift({ ...order, synced: saved });
  localStorage.setItem(KEY.orders, JSON.stringify(local.slice(0, 50)));

  state.cart = []; saveCart(); updateCartCount(); renderCart();
  btn.disabled = false; btn.textContent = "Place order";

  $("#checkoutStep").innerHTML = `
    <div class="success">
      <div class="success__ico">${icon("check")}</div>
      <h2>Order placed</h2>
      <p>Thanks ${esc(data.name.split(" ")[0])} — we'll call you on ${esc(data.phone)} to confirm.</p>
      <p class="success__id">${order.orderId}</p>
      <p class="form__note">${saved ? "Saved to the store's order sheet." : "Saved on this device. Open setup.html to connect the Google Sheet."}</p>
      <button class="btn btn--dark btn--block" data-close="checkoutModal" style="margin-top:18px">Keep shopping</button>
    </div>`;
  showToast("Order placed 🎉");
}

/* ------------------------------------------------------------------- SECTIONS */
function renderCategories(){
  $("#catGrid").innerHTML = CATEGORIES.map(c => {
    const n = PRODUCTS.filter(p => p.gender === c.key || p.category === c.key || (c.key === "Kids" && p.ageGroup === "Kids") || (c.key === "Sports" && ["Sports","Running","Gym"].includes(p.category))).length;
    const art = shoeArt({ id:"c" + c.key, color:c.color, category:c.key === "Formal" ? "Formal" : "Sneakers" });
    return `<button class="cat reveal" style="--cat-bg:linear-gradient(160deg,${c.bg},${shade(c.bg, -30)})" data-shop="${c.key}">
      <span class="cat__img">${CONFIG.USE_IMAGE_FILES
        ? `<img src="${c.img}" alt="${c.title} footwear" loading="lazy" onerror="this.style.display='none'">`
        : `<img src="${art}" alt="${c.title} footwear" style="object-fit:contain;padding:26px;opacity:.92" loading="lazy">`}</span>
      <span class="cat__count">${n} styles</span>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <span class="cat__go">Shop now ${icon("arrow")}</span>
    </button>`;
  }).join("");
}

function renderOccasions(){
  $("#occGrid").innerHTML = OCCASIONS.map(o => `
    <button class="occ reveal" style="--occ-bg:${o.bg}" data-shop="${o.key}">
      <span class="occ__ico">${o.icon}</span>
      <h3>${o.key}</h3>
      <p>${o.desc}</p>
    </button>`).join("");
}

function renderRails(){
  const newest = PRODUCTS.filter(p => p.badge === "NEW" || p.badge === "TRENDING").slice(0, 8);
  const best = PRODUCTS.slice().sort((a,b) => (b.rating * 100 + b.reviews) - (a.rating * 100 + a.reviews)).slice(0, 8);
  $("#newRail").innerHTML = newest.map((p,i) => productCard(p,i)).join("");
  $("#bestRail").innerHTML = best.map((p,i) => productCard(p,i)).join("");
}

function renderBrands(){
  $("#brandRow").innerHTML = BRANDS.map(b =>
    `<button class="brandlogo" data-brand="${b}">${b.slice(0,-1)}<em>${b.slice(-1)}</em></button>`).join("");
}

function renderSaleVisual(){
  const picks = PRODUCTS.filter(p => p.discount >= 28).slice(0, 4);
  $("#saleVisual").innerHTML = picks.map(p => `
    <button class="saletile" data-quick="${p.id}">
      ${imgTag(p)}
      <b>${esc(p.name)}</b>
      <span>${p.discount}% off · ${inr(p.price)}</span>
    </button>`).join("");
}

/* --------------------------------------------------------------- HERO SHOWCASE */
const LOOKS = [
  { pid:3,  who:"Aarav",  role:"Men · Everyday sneakers",  av:"#1e3a6e", bg:"linear-gradient(150deg,#e6ecf7,#c9d6ec)" },
  { pid:6,  who:"Nisha",  role:"Women · Running",          av:"#c4497b", bg:"linear-gradient(150deg,#ffe6dc,#ffd0bd)" },
  { pid:5,  who:"Kabir",  role:"Teens · High-tops",        av:"#5b46c9", bg:"linear-gradient(150deg,#ece7ff,#d6cdff)" },
  { pid:8,  who:"Aanya",  role:"Kids · Casual",            av:"#0d6b48", bg:"linear-gradient(150deg,#ddf7ea,#bdeed6)" }
];
let showIdx = 0, showTimer = 0;

function renderShowcase(){
  $("#showcase").innerHTML = LOOKS.map((l, i) => {
    const p = PRODUCTS.find(x => x.id === l.pid);
    return `<div class="slide ${i === 0 ? "is-on" : ""}" data-slide="${i}">
      <div class="slide__art" style="--slide-bg:${l.bg}">
        ${imgTag(p)}
        <div class="slide__person">
          <span class="slide__avatar" style="background:${l.av}">${l.who[0]}</span>
          <span><b>${l.who}</b><span>${l.role}</span></span>
        </div>
      </div>
      <div class="slide__foot">
        <div><h3>${esc(p.name)}</h3><p>${esc(p.brand)} · ${esc(p.category)}</p></div>
        <span class="slide__price">${inr(p.price)}</span>
      </div>
    </div>`;
  }).join("");
  $("#showcaseDots").innerHTML = LOOKS.map((l, i) =>
    `<button class="${i === 0 ? "is-on" : ""}" data-godot="${i}" role="tab" aria-label="Look ${i + 1}: ${l.role}"></button>`).join("");
  $("#floatImg").src = shoeArt(PRODUCTS[0]);
}

function goShowcase(i){
  showIdx = (i + LOOKS.length) % LOOKS.length;
  $$("#showcase .slide").forEach((s, k) => s.classList.toggle("is-on", k === showIdx));
  $$("#showcaseDots button").forEach((d, k) => d.classList.toggle("is-on", k === showIdx));
}
function autoShowcase(){
  clearInterval(showTimer);
  showTimer = setInterval(() => goShowcase(showIdx + 1), 4200);
}

/* ------------------------------------------------------------- HEADLINE ROTATOR */
const WORDS = ["Perfect", "Comfy", "Everyday", "Standout"];
function initRotator(){
  let i = 0;
  const el = $("#rotator");
  setInterval(() => {
    i = (i + 1) % WORDS.length;
    el.innerHTML = `<span class="rotator__word">${WORDS[i]}</span>`;
  }, 2600);
}

/* ------------------------------------------------------------- REVIEW SLIDER */
let revIdx = 0, revTimer = 0, revPer = 3;

function initializeSlider(){
  const track = $("#revTrack");
  track.innerHTML = REVIEWS.map(r => `
    <div class="review">
      <article class="review__card">
        <div class="review__stars" aria-label="${r.rating} out of 5">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <p class="review__text">${esc(r.text)}</p>
        <div class="review__who">
          <span class="review__av" style="background:${["#1e3a6e","#c4497b","#0d6b48","#5b46c9","#d98324","#1f7a8c"][r.name.length % 6]}">${r.name[0]}</span>
          <span><b>${esc(r.name)}</b><span>${esc(r.city)} · Verified buyer</span></span>
        </div>
      </article>
    </div>`).join("");
  sizeSlider();
  autoSlider();
}

function sizeSlider(){
  const w = window.innerWidth;
  revPer = w <= 760 ? 1 : (w <= 1180 ? 2 : 3);
  $$(".review").forEach(el => el.style.flex = `0 0 ${100 / revPer}%`);
  const pages = Math.max(1, REVIEWS.length - revPer + 1);
  if (revIdx > pages - 1) revIdx = 0;
  $("#revDots").innerHTML = Array.from({ length: pages }, (_, i) =>
    `<button class="${i === revIdx ? "is-on" : ""}" data-rev="${i}" aria-label="Review page ${i + 1}"></button>`).join("");
  moveSlider();
}
function moveSlider(){
  $("#revTrack").style.transform = `translateX(-${revIdx * (100 / revPer)}%)`;
  $$("#revDots button").forEach((d, i) => d.classList.toggle("is-on", i === revIdx));
}
function goSlider(dir){
  const pages = Math.max(1, REVIEWS.length - revPer + 1);
  revIdx = (revIdx + dir + pages) % pages;
  moveSlider();
}
function autoSlider(){
  clearInterval(revTimer);
  revTimer = setInterval(() => goSlider(1), 5200);
}

/* ----------------------------------------------------------------- ANIMATIONS */
function initializeAnimations(){
  if (typeof IntersectionObserver === "undefined"){
    $$(".reveal").forEach(el => el.classList.add("in"));
    $$(".counter").forEach(countUp);
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$(".counter").forEach(el => cio.observe(el));
}

function countUp(el){
  const target = parseFloat(el.dataset.count);
  const dec = Number(el.dataset.decimal || 0);
  const start = performance.now(), dur = 1400;
  function tick(now){
    const t = Math.min(1, (now - start) / dur);
    const v = target * (1 - Math.pow(1 - t, 3));
    el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN");
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initScrollUI(){
  const header = $("#header"), prog = $("#scrollProgress");
  const onScroll = () => {
    header.classList.toggle("is-stuck", window.scrollY > 12);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------ LIVE ELEMENTS */
function initCountdown(){
  const tick = () => {
    const now = new Date();
    const end = new Date(now); end.setHours(23, 59, 59, 999);
    let s = Math.max(0, Math.floor((end - now) / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    $("#cdH").textContent = h; $("#cdM").textContent = m; $("#cdS").textContent = sec;
  };
  tick(); setInterval(tick, 1000);
}

function initLiveViewers(){
  const el = $("#liveViewers");
  setInterval(() => {
    const cur = Number(el.textContent);
    const next = Math.max(18, Math.min(96, cur + Math.floor(Math.random() * 9) - 4));
    el.textContent = next;
  }, 3400);
}

const CITY_NAMES = ["Riya from Delhi","Aman from Lucknow","Sneha from Pune","Vikram from Surat","Neha from Indore","Imran from Bhopal","Divya from Chennai","Rahul from Noida"];
function initTicker(){
  const el = $("#ticker");
  const show = () => {
    const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const who = CITY_NAMES[Math.floor(Math.random() * CITY_NAMES.length)];
    el.innerHTML = `<span class="ticker__av">👟</span><span><b>${esc(who)}</b> just ordered ${esc(p.name)}</span>`;
    el.hidden = false; el.classList.remove("out");
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.hidden = true, 380); }, 5200);
  };
  setTimeout(show, 7000);
  setInterval(show, 17000);
}

/* ---------------------------------------------------------------- NEWSLETTER */
function initNewsletter(){
  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = $("#newsEmail");
    const ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.value.trim());
    input.classList.toggle("is-bad", !ok);
    if (!ok){ showToast("Enter a valid email address", "warn"); return; }
    if (CONFIG.API_URL){
      const body = JSON.stringify({ action: "subscribe", email: input.value.trim() });
      fetch(CONFIG.API_URL, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body })
        .catch(() => fetch(CONFIG.API_URL, { method:"POST", mode:"no-cors", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body }))
        .catch(() => {});
    }
    input.value = "";
    showToast("Subscribed successfully 🎉");
  });
}

/* --------------------------------------------------------------- EVENT WIRING */
function initEvents(){
  /* One delegated click handler for the whole page */
  document.addEventListener("click", e => {
    const t = e.target;

    const closeBtn = t.closest("[data-close]");
    if (closeBtn){
      const id = closeBtn.dataset.close;
      if (id === "filters") closeFilterSheet();
      else if (id === "quickView" || id === "checkoutModal") closeModal(id);
      else closeDrawer(id);
      return;
    }

    const shop = t.closest("[data-shop]");
    if (shop){ applyNav(shop.dataset.shop); closeAll(); return; }

    const nav = t.closest("[data-nav]");
    if (nav){
      if (nav.dataset.nav !== "all"){ e.preventDefault(); applyNav(nav.dataset.nav); }
      $$(".nav__link").forEach(l => l.classList.toggle("is-active", l === nav));
      closeMobileMenu(); return;
    }

    const brand = t.closest("[data-brand]");
    if (brand){ resetFilters(); state.filters.brand = [brand.dataset.brand]; syncFilterUI(); renderProducts(); $("#shop").scrollIntoView({ behavior:"smooth" }); return; }

    const size = t.closest("[data-size]");
    if (size){
      const pid = Number(size.dataset.for);
      state.chosenSize[pid] = Number(size.dataset.size);
      const scope = size.closest(".card, .qv__body");
      if (scope) scope.querySelectorAll("[data-size]").forEach(b => b.classList.toggle("is-on", b === size));
      $$(`[data-for="${pid}"]`).forEach(b => b.classList.toggle("is-on", Number(b.dataset.size) === state.chosenSize[pid]));
      return;
    }

    const add = t.closest("[data-add]");
    if (add){ const id = Number(add.dataset.add); addToCart(id, state.chosenSize[id]); return; }

    const buy = t.closest("[data-buy]");
    if (buy){
      const id = Number(buy.dataset.buy);
      const p = PRODUCTS.find(x => x.id === id);
      if (needsSize(p) && !state.chosenSize[id]){ showToast("Please select a shoe size", "warn"); return; }
      addToCart(id, state.chosenSize[id]);
      closeQuickView();
      openCheckout();
      return;
    }

    const quick = t.closest("[data-quick]");
    if (quick){ openQuickView(Number(quick.dataset.quick)); return; }

    const wish = t.closest("[data-wish]");
    if (wish){
      const id = Number(wish.dataset.wish);
      state.wishlist.includes(id) ? removeFromWishlist(id) : addToWishlist(id);
      wish.classList.toggle("is-on", state.wishlist.includes(id));
      return;
    }
    const unwish = t.closest("[data-unwish]");
    if (unwish){ removeFromWishlist(Number(unwish.dataset.unwish)); return; }

    const inc = t.closest("[data-inc]"); if (inc){ increaseQuantity(inc.dataset.inc); return; }
    const dec = t.closest("[data-dec]"); if (dec){ decreaseQuantity(dec.dataset.dec); return; }
    const del = t.closest("[data-del]"); if (del){ removeFromCart(del.dataset.del); return; }

    const chip = t.closest("[data-chip]");
    if (chip){
      const g = chip.dataset.chip, v = chip.dataset.val;
      if (g === "all") resetFilters();
      else if (g === "rating") state.filters.rating = 0;
      else if (g === "price"){ state.filters.min = 500; state.filters.max = 10000; }
      else if (g === "search"){ state.search = ""; $("#searchInput").value = ""; }
      else state.filters[g] = state.filters[g].filter(x => x !== v);
      syncFilterUI(); renderProducts(); return;
    }

    const dot = t.closest("[data-godot]"); if (dot){ goShowcase(Number(dot.dataset.godot)); autoShowcase(); return; }
    const rdot = t.closest("[data-rev]"); if (rdot){ revIdx = Number(rdot.dataset.rev); moveSlider(); autoSlider(); return; }

    const swatch = t.closest("[data-color]");
    if (swatch){
      const c = swatch.dataset.color;
      const arr = state.filters.color;
      arr.includes(c) ? state.filters.color = arr.filter(x => x !== c) : arr.push(c);
      state.visible = 12; syncFilterUI(); renderProducts(); return;
    }
    const fsize = t.closest("[data-fsize]");
    if (fsize){
      const s = fsize.dataset.fsize, arr = state.filters.size;
      arr.includes(s) ? state.filters.size = arr.filter(x => x !== s) : arr.push(s);
      state.visible = 12; syncFilterUI(); renderProducts(); return;
    }
    const toggle = t.closest("[data-toggle]");
    if (toggle){ toggle.closest("[data-group]").classList.toggle("is-closed"); return; }

    if (t.closest("#scrim")) closeAll();
    if (t.id === "quickView") closeQuickView();
    if (t.id === "checkoutModal") closeModal("checkoutModal");
  });

  document.addEventListener("change", e => {
    const cb = e.target.closest("input[data-f]");
    if (cb){
      const key = cb.dataset.f, arr = state.filters[key];
      cb.checked ? arr.push(cb.value) : state.filters[key] = arr.filter(v => v !== cb.value);
      state.visible = 12; renderProducts(); return;
    }
    const rt = e.target.closest("input[data-rating]");
    if (rt){ state.filters.rating = Number(rt.dataset.rating); state.visible = 12; renderProducts(); return; }
  });

  document.addEventListener("input", e => {
    if (e.target.id === "pMin" || e.target.id === "pMax"){
      let lo = Number($("#pMin").value), hi = Number($("#pMax").value);
      if (lo > hi){ if (e.target.id === "pMin") lo = hi; else hi = lo; $("#pMin").value = lo; $("#pMax").value = hi; }
      state.filters.min = lo; state.filters.max = hi;
      $("#pMinLabel").textContent = inr(lo); $("#pMaxLabel").textContent = inr(hi);
      state.visible = 12; renderProducts();
    }
  });

  /* header buttons */
  $("#burgerBtn").addEventListener("click", openMobileMenu);
  $("#cartBtn").addEventListener("click", openCart);
  $("#wishlistBtn").addEventListener("click", () => { renderWishlist(); openDrawer("wishDrawer"); });
  $("#mWishlist").addEventListener("click", () => { closeMobileMenu(); renderWishlist(); openDrawer("wishDrawer"); });
  $("#accountBtn").addEventListener("click", () => showToast("Accounts are coming soon", "warn"));
  $("#checkoutBtn").addEventListener("click", openCheckout);
  $("#orderForm").addEventListener("submit", submitOrder);
  $("#openFilters").addEventListener("click", openFilterSheet);
  $("#resetFilters").addEventListener("click", resetFilters);
  $("#emptyReset").addEventListener("click", resetFilters);
  $("#loadMore").addEventListener("click", () => { state.visible += 12; renderProducts(); });
  $("#sortSelect").addEventListener("change", e => { state.sort = e.target.value; renderProducts(); });
  $("#revPrev").addEventListener("click", () => { goSlider(-1); autoSlider(); });
  $("#revNext").addEventListener("click", () => { goSlider(1); autoSlider(); });

  /* search */
  const sBar = $("#searchBar"), sInput = $("#searchInput");
  $("#searchBtn").addEventListener("click", () => {
    sBar.hidden = !sBar.hidden;
    if (!sBar.hidden) sInput.focus();
  });
  $("#searchClose").addEventListener("click", () => { sBar.hidden = true; state.search = ""; sInput.value = ""; renderProducts(); });
  let sTimer = 0;
  sInput.addEventListener("input", () => {
    clearTimeout(sTimer);
    sTimer = setTimeout(() => {
      state.search = sInput.value; state.visible = 12; renderProducts();
      if (sInput.value) $("#shop").scrollIntoView({ behavior:"smooth", block:"start" });
    }, 220);
  });

  /* keyboard */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape"){ closeAll(); if (!sBar.hidden) sBar.hidden = true; }
  });

  window.addEventListener("resize", () => {
    sizeSlider();
    if (!window.matchMedia("(max-width:980px)").matches) $("#filters").style.display = "";
  });
}

/* ---------------------------------------------------------------------- INIT */
function init(){
  loadCart(); loadWishlist();
  buildFilters(); syncFilterUI();
  renderCategories(); renderOccasions(); renderShowcase(); renderRails();
  renderBrands(); renderSaleVisual();
  renderProducts(); renderCart(); renderWishlist();
  updateCartCount(); updateWishlistCount();
  initEvents(); initializeAnimations(); initializeSlider(); initScrollUI();
  initRotator(); autoShowcase(); initCountdown(); initLiveViewers(); initTicker(); initNewsletter();

  if (window.matchMedia("(max-width:980px)").matches) $("#filters").style.display = "none";
  requestAnimationFrame(() => $$(".hero .reveal").forEach(el => el.classList.add("in")));
}

document.addEventListener("DOMContentLoaded", init);
