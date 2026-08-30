# SOLEORA — Step Into Your Style

Premium footwear e-commerce store. Pure **HTML + CSS + Vanilla JavaScript** — koi framework, koi build step nahi.
Backend ke liye **Google Sheets + Apps Script**, aur orders manage karne ke liye ek **/admin** dashboard.

---

## Folder structure

```text
soleora/
│
├── index.html          # storefront
├── style.css           # storefront + shared design tokens
├── script.js           # products, cart, wishlist, filters, checkout
│
├── admin.html          # order desk (passcode protected)
├── admin.css
├── admin.js
│
├── apps-script/
│   └── Code.gs         # Google Apps Script backend (paste into Apps Script editor)
│
├── images/
│   ├── hero/
│   ├── categories/
│   └── products/
│
├── assets/             # optional animated-shoe.gif / .webp
├── .nojekyll           # GitHub Pages ko folders as-is serve karne deta hai
└── README.md
```

---

## 1. Locally chalane ke liye

Sabse simple: `index.html` par double-click. Bas.

Behtar (localStorage + fetch bilkul browser jaisa behave karta hai):

```bash
cd soleora
python3 -m http.server 8000
# ab kholein: http://localhost:8000
```

Admin panel: `http://localhost:8000/admin.html` — default passcode `soleora2026`.

---

## 2. GitHub par upload + live karna

```bash
cd soleora
git init
git add .
git commit -m "SOLEORA storefront"
git branch -M main
git remote add origin https://github.com/<username>/soleora.git
git push -u origin main
```

Phir GitHub par: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
1–2 minute me site live: `https://<username>.github.io/soleora/`
Admin: `https://<username>.github.io/soleora/admin.html`

---

## 3. Google Sheet backend (orders control)

1. Nayi Google Sheet banayein. URL se ID copy karein:
   `docs.google.com/spreadsheets/d/`**`YAHAN_WALA_HISSA_ID_HAI`**`/edit`
2. Sheet me **Extensions → Apps Script** kholein. Sample code delete karke `apps-script/Code.gs` ka pura content paste karein.
3. File ke top par bharein:
   ```js
   const SHEET_ID  = "aapki_sheet_id";
   const ADMIN_KEY = "koi_strong_passcode";   // ise zaroor badlein
   ```
4. Editor me `setup` function select karke **Run** dabayein, permission approve karein. Ye `Orders` aur `Subscribers` tabs bana dega.
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy karke `/exec` URL copy karein.
6. Wahi URL do jagah paste karein:
   - `script.js` → `CONFIG.API_URL`
   - `admin.js` → `ADMIN.API_URL`

Bas. Ab har order Sheet me row banke aayega, aur admin panel usko live padhega.

> Backend URL blank chhodenge to site **demo mode** me chalegi — orders device ke localStorage me save honge aur admin panel wahi dikhayega. Sab kuch test karne ke liye kaafi hai.

**Owner ko email alert chahiye?** `Code.gs` ke `notifyStore()` me `const to = ""` ki jagah apna email daal dein.

---

## 4. Admin dashboard kya karta hai

- Passcode gate (session ke liye yaad rehta hai)
- Live stats: total orders, revenue, pending, delivered
- Order table — search by order ID / naam / phone / city, status se filter
- Status dropdown: New → Confirmed → Packed → Shipped → Delivered / Cancelled (seedha Sheet me save)
- Details modal + "Call customer" aur "WhatsApp" buttons
- CSV export (jo abhi filter me dikh raha hai, wahi export hota hai)
- Har 60 second me auto-refresh

---

## 5. Apni shoe photos lagana

Default me site apni **khud ki SVG shoe artwork** banati hai, isliye bina kisi image ke bhi sab kuch bharra-poora dikhta hai — koi broken image nahi.

Real photos lagane ke liye:

1. Images yahan rakhein:
   - `images/products/shoe1.jpg` … `shoe28.jpg` (naam `script.js` ke `PRODUCTS` array se match hona chahiye)
   - `images/categories/men.jpg`, `women.jpg`, `girls.jpg`, `boys.jpg`, `kids.jpg`, `sports.jpg`, `casual.jpg`, `formal.jpg`
   - `images/hero/` — optional
2. `script.js` me switch on karein:
   ```js
   USE_IMAGE_FILES: true
   ```

Koi image missing ho to wo apne aap SVG artwork par gir jaati hai. Best result: square (1:1), transparent PNG ya white background, ~800×800px.

Animated shoe chahiye to `assets/animated-shoe.gif` ya `.webp` rakh sakte hain — baaki animations pure CSS hain, isliye site light rehti hai.

---

## 6. Products / prices change karna

Sab kuch `script.js` ke top par hai:

| Cheez | Kahan |
|---|---|
| Products (28) | `PRODUCTS` array |
| Categories | `CATEGORIES` |
| Occasions | `OCCASIONS` |
| Brands | `BRANDS` |
| Reviews | `REVIEWS` |
| Free shipping limit, shipping fee | `CONFIG` |
| Colours → swatch hex | `COLOR_HEX` |

Naya product add karte waqt `color` wahi rakhein jo `COLOR_HEX` me maujood ho — artwork aur card ka background wahin se banta hai.

---

## Features

**Storefront** — sticky blur header + scroll progress, rotating hero headline, auto-rotating model showcase, floating product card, live viewer count, marquee strips, 8 category cards, 8 occasion cards, filter sidebar (gender / category / age / brand / colour / size / price / rating) with mobile bottom sheet, live search, 6-way sort, quick view modal, size validation, cart drawer with quantity controls and totals, wishlist drawer, sale banner with live countdown, new arrivals + best sellers rails, testimonial slider, newsletter with email validation, toasts, empty states, scroll reveals, `prefers-reduced-motion` respected, keyboard + Escape support, localStorage persistence.

**Admin** — passcode gate, stats, searchable order table, status updates, order details, CSV export, WhatsApp/call shortcuts.

---

© 2026 SOLEORA
