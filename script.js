/* ===== EDIT ME ===== */
const WA="919724307705",UPI_ID="bhargavrasadiya7@okaxis",UPI_NAME="ZivaGo";
const PRODUCTS=[{id:"single",name:"ZivaGo Sea Buckthorn Juice (500 ml)",price:399,mrp:null,img:"product_front.jpg",desc:"One 500 ml glass bottle. Ready to drink, ideal to start your daily routine."},
{id:"combo",name:"ZivaGo Combo Pack (2 × 500 ml)",price:589,mrp:798,img:"lifestyle.jpg",tag:"Best value",desc:"Our combo pack for ₹589. Save ₹209 compared with two single bottles."}];
/* ==================== */
const $=s=>document.querySelector(s),inr=n=>"₹"+n.toLocaleString("en-IN");
if("IntersectionObserver"in window)new IntersectionObserver(([entry])=>$(".wa").classList.toggle("is-hidden",entry.isIntersecting),{threshold:.15}).observe($("#contact"));
let cart={};try{cart=JSON.parse(localStorage.getItem("zivago")||"{}")}catch(e){}
let order=null,qrLoad=null;
const total=()=>Object.keys(cart).reduce((s,id)=>{const p=PRODUCTS.find(x=>x.id===id);return s+(p?p.price*cart[id]:0)},0);
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600)}
function save(){try{localStorage.setItem("zivago",JSON.stringify(cart))}catch(e){}draw()}
function draw(){let c=0,h="";for(const id in cart){const p=PRODUCTS.find(x=>x.id===id);if(!p)continue;c+=cart[id];h+=`<div class="row"><img src="${p.img}" alt=""><span>${p.name}<br>${inr(p.price)}</span><button class="q" data-d="${id}" aria-label="Remove one">−</button>${cart[id]}<button class="q" data-a="${id}" aria-label="Add one">+</button></div>`}
$("#cnt").textContent=c;$("#items").innerHTML=h||"<p>Your cart is empty. Pick something fresh!</p>";const s=total();
$("#tots").innerHTML=`<div class="tot"><span>Subtotal</span><span>${inr(s)}</span></div><div class="tot"><span>Delivery</span><span>${s?"Free":"—"}</span></div><div class="tot b"><span>Total</span><span>${inr(s)}</span></div>`}
$("#items").onclick=e=>{const a=e.target.dataset.a,d=e.target.dataset.d;if(a)cart[a]++;if(d&&--cart[d]<1)delete cart[d];save()};
$("#grid").innerHTML=PRODUCTS.map(p=>`<article class="card">${p.tag?`<span class="tag">${p.tag}</span>`:""}<img src="${p.img}" alt="${p.name}"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${inr(p.price)}${p.mrp?`<s>${inr(p.mrp)}</s>`:""}</div><p><button class="btn" data-add="${p.id}">Add to cart</button></p></article>`).join("");
$("#grid").onclick=e=>{const i=e.target.dataset.add;if(i){cart[i]=(cart[i]||0)+1;save();toast("Added to cart ✓")}};
$("#cartBtn").onclick=()=>$("#drawer").classList.add("open");$("#x").onclick=()=>$("#drawer").classList.remove("open");
["ph","pin"].forEach(id=>$("#"+id).addEventListener("input",e=>{e.target.value=e.target.value.replace(/\D/g,"")}));
function details(){if(!Object.keys(cart).length){toast("Cart is empty");return null}
for(const id of["nm","ph","pin","ad"])if(!$("#"+id).reportValidity())return null;
const lines=Object.keys(cart).map(id=>{const p=PRODUCTS.find(x=>x.id===id);return p?`• ${p.name} x${cart[id]} = ${inr(p.price*cart[id])}`:""}).filter(Boolean).join("\n");
return{lines,total:total(),n:$("#nm").value.trim(),phone:$("#ph").value.trim(),pin:$("#pin").value.trim(),address:$("#ad").value.trim()}}
const addr=o=>[`Name: ${o.n}`,`Mobile: ${o.phone}`,`PIN code: ${o.pin}`,`Address: ${o.address}`];
const wa=t=>open(`https://wa.me/${WA}?text=${encodeURIComponent(t)}`,"_blank");
$("#later").onclick=e=>{e.preventDefault();const o=details();if(!o)return;wa(["Hi ZivaGo! I would like to place this order:",o.lines,"",`Total: ${inr(o.total)} (free delivery)`,...addr(o),"","Please share payment details."].join("\n"))};
function loadQr(){if(window.QRCode)return Promise.resolve();if(!qrLoad)qrLoad=new Promise((ok,no)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";s.onload=()=>window.QRCode?ok():no();s.onerror=no;document.head.append(s)});return qrLoad}
$("#buy").onclick=()=>{const o=details();if(!o)return;order=o;
const url=`upi://pay?${new URLSearchParams({pa:UPI_ID,pn:UPI_NAME,am:o.total.toFixed(2),cu:"INR",tn:"ZivaGo order"})}`;
$("#pamt").textContent=o.total.toLocaleString("en-IN");$("#uid").textContent=UPI_ID;$("#plink").href=url;$("#pst").textContent="";
$("#pins").textContent="Scan this amount-specific QR with your UPI app, or tap the button to open a UPI app. After paying, return to WhatsApp and attach your screenshot.";
$("#qr").style.display="flex";$("#qr").innerHTML="";
$("#pay").classList.add("open");$("#pay").setAttribute("aria-hidden","false");
loadQr().then(()=>{$("#qr").innerHTML="";new QRCode($("#qr"),{text:url,width:180,height:180})}).catch(()=>{qrLoad=null;$("#qr").textContent="QR unavailable. Use the UPI app button or UPI ID."})};
const closePay=()=>{$("#pay").classList.remove("open");$("#pay").setAttribute("aria-hidden","true")};
$("#px").onclick=closePay;$("#pay").onclick=e=>{if(e.target.id==="pay")closePay()};document.addEventListener("keydown",e=>{if(e.key==="Escape")closePay()});
$("#plink").onclick=()=>{$("#pst").textContent="Finish paying in your UPI app, then return and continue to WhatsApp."};
$("#copyUpi").onclick=async()=>{try{await navigator.clipboard.writeText(UPI_ID);$("#pst").textContent="UPI ID copied."}catch(e){$("#pst").textContent="Copy isn’t available. Enter the UPI ID shown above."}};
$("#pdone").onclick=()=>{if(!order)return;wa(["Hi ZivaGo! I have sent payment via UPI (customer-reported; please verify in your account).","",order.lines,"",`Total paid: ${inr(order.total)}`,...addr(order),"","I will attach my payment screenshot in this chat."].join("\n"));closePay()};
draw();
