const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ld=(k,d)=>{try{const v=JSON.parse(localStorage.getItem('gw_'+k));return v??d}catch(e){return d}};
const show=id=>{$(id).classList.remove('hidden');$(id).classList.add('flex')};
const hide=id=>{$(id).classList.add('hidden');$(id).classList.remove('flex')};
const fmt=n=>'Rs. '+Number(n).toLocaleString();
const today=()=>new Date().toISOString().slice(0,10);

const DEF_PRODUCTS=[
 {id:'prod-1',brand:'GLUTAWOL',title:'Glutawol Organic Whitening Complete Kit',price:8000,images:['https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=600&q=80'],description:'Complete Organic Skincare Kit! Includes Glutawol Brightening Facewash, Radiance Serum, Organic Night Cream and Whitening Soap.',ingredients:'Glutathione, Alpha Arbutin, Tea Tree Oil, Neem Oil, Virgin Coconut Oil, Vitamin C & E, Niacinamide',usage:'Wash face twice daily with Glutawol Facewash, apply 3-4 drops of Serum, and apply night cream before sleep.',advantages:'Complete routine in one kit\nConvenient multi-step skincare\nClear ingredient and usage information\nAll routine products included',quality:'A complete routine-oriented bundle for customers who want several skincare steps together.',dermatologistRecommended:false},
 {id:'prod-2',brand:'GLUTAWOL',title:'Glutawol Brightening Organic Facewash',price:1500,images:['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'],description:'Deep cleansing organic facewash with Neem, Tea Tree Oil and Glutathione to clean pores and restore natural brightness.',ingredients:'Glutathione, Neem Extract, Organic Tea Tree Oil, Aloe Vera Extract, Glycolic Acid',usage:'Massage a small amount on wet face for 1-2 minutes and rinse thoroughly.',advantages:'Daily cleansing step\nEasy rinse-off application\nListed organic-focused ingredients\nFits a simple routine',quality:'A cleansing-focused product with neem, tea tree oil and aloe vera extract.',dermatologistRecommended:false},
 {id:'prod-3',brand:'GLUTAWOL',title:'Glutawol Radiance Glow Serum',price:2500,images:['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'],description:'Concentrated serum for a glowing look. Designed to help with the appearance of dark spots and uneven tone.',ingredients:'Glutathione, Hyaluronic Acid, 10% Niacinamide, Licorice Root Extract, Vitamin C',usage:'Apply 3-4 drops on clean face after washing. Tap gently until absorbed.',advantages:'Concentrated serum format\nEasy post-cleansing application\nDetailed ingredient listing\nFits multi-step routines',quality:'A concentrated serum presented with a detailed ingredient list and simple instructions.',dermatologistRecommended:false}];
const DEF_RATES={Multan:200,Lahore:250,Karachi:350,Islamabad:300,Rawalpindi:300,Faisalabad:280,Peshawar:320,'Rest of Pakistan':300};

const S={products:ld('products',DEF_PRODUCTS),rates:ld('rates',DEF_RATES),cart:ld('cart',[]),orders:ld('orders',[]),complaints:ld('complaints',[]),promos:ld('promos',[]),reviews:ld('reviews',[]),accounts:ld('accounts',[]),
 site:ld('site',{brand:'GLUTAWOL',tagline:'Premium Organic Care',ceo:'Sir Aftab',support:'Direct Owner Contact'})};
let pass=localStorage.getItem('gw_pass')||'123456789', user=ld('user',null), pct=0, galImgs=[];
S.products=S.products.map(p=>({...p,images:(p.images&&p.images.length?p.images:(p.image?[p.image]:[])).filter(Boolean)}));

function save(){try{for(const k in S)localStorage.setItem('gw_'+k,JSON.stringify(S[k]));const ss=$('save-state');if(ss)ss.textContent='✓ Saved '+new Date().toLocaleTimeString();return true}catch(e){alert('Browser storage full. Kuch purani images delete karein.');return false}}

/* ---------- navigation ---------- */
function scrollTo2(id){setTimeout(()=>$(id).scrollIntoView({behavior:'smooth'}),60)}
function showHome(t){$('about').classList.add('hidden');$('home').classList.remove('hidden');t?scrollTo2(t):scrollTo({top:0,behavior:'smooth'})}
function showAbout(){$('home').classList.add('hidden');$('about').classList.remove('hidden');renderAbout();scrollTo({top:0,behavior:'smooth'})}

/* ---------- products ---------- */
const img0=p=>p.images[0]||'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#062c2d"/><text x="50%" y="50%" fill="#7dd3fc" font-size="28" text-anchor="middle">GLUTAWOL</text></svg>');
function renderProducts(){
 $('pgrid').innerHTML=S.products.length?S.products.map(p=>`
 <div class="card !p-0 overflow-hidden flex flex-col hover:border-sky-400/60 transition">
  <div class="relative h-60 overflow-hidden"><img src="${esc(img0(p))}" alt="${esc(p.title)}" class="w-full h-full object-cover">
   <span class="absolute top-3 left-3 bdg !bg-sky-400 !text-[#031b25]">${esc(p.brand)}</span>
   <span class="absolute top-3 right-3 bdg !bg-[#031b25]/90">${fmt(p.price)}</span></div>
  <div class="p-5 flex-1 flex flex-col justify-between gap-4">
   <div><h3 class="font-serif font-bold text-lg">${esc(p.title)}</h3><p class="text-xs text-gray-300 mt-2">${esc(p.description)}</p></div>
   <div class="space-y-2"><button onclick="openProduct('${p.id}')" class="btn2 w-full">View Formula & Details</button>
    <div class="grid grid-cols-2 gap-2"><button onclick="addToCart('${p.id}')" class="btn2 !text-white font-bold">Add To Cart</button><button onclick="buyNow('${p.id}')" class="btn">Buy Now</button></div></div>
  </div></div>`).join(''):'<p class="text-center text-gray-400 col-span-full">Abhi koi product nahi hai.</p>';
}
const lines=t=>String(t||'').split('\n').map(x=>x.trim()).filter(Boolean);
const derm=p=>p.dermatologistRecommended?'<span class="bdg">🩺 Dermatologist Recommended (owner verified)</span>':'';
function renderAbout(){const np=$('n-prod');if(np)np.textContent=S.products.length;
 $('agrid').innerHTML=S.products.map(p=>`
 <article class="card !p-0 overflow-hidden"><img src="${esc(img0(p))}" class="w-full h-48 object-cover" alt="">
  <div class="p-5 space-y-3 text-xs text-gray-300"><span class="bdg">${esc(p.brand)}</span><h3 class="text-lg font-bold text-white">${esc(p.title)}</h3>
   <p class="text-sm text-sky-100/80">${esc(p.description)}</p>
   <div><b class="text-sky-200 uppercase">Quality</b><p>${esc(p.quality)}</p></div>
   <div><b class="text-sky-200 uppercase">Ingredients</b><p>${esc(p.ingredients)}</p></div>
   <div><b class="text-sky-200 uppercase">How to use</b><p>${esc(p.usage)}</p></div>
   <ul class="space-y-1">${lines(p.advantages).map(a=>`<li>✔ ${esc(a)}</li>`).join('')}</ul>${derm(p)}
   <button onclick="openProduct('${p.id}')" class="btn w-full">View Full Details</button></div></article>`).join('');
}
function openProduct(id){
 const p=S.products.find(x=>x.id===id);if(!p)return;galImgs=p.images;
 $('pbody').innerHTML=`<div class="grid md:grid-cols-2 gap-5">
  <div><img id="gal" src="${esc(img0(p))}" class="rounded-xl w-full h-72 object-cover border border-sky-400/30">
   <div class="grid grid-cols-5 gap-2 mt-2">${p.images.slice(0,10).map((s,i)=>`<button onclick="$('gal').src=galImgs[${i}]" class="rounded overflow-hidden border border-sky-400/30"><img src="${esc(s)}" class="w-full h-14 object-cover"></button>`).join('')}</div></div>
  <div class="space-y-3"><span class="bdg">${esc(p.brand)}</span><h2 class="text-2xl font-serif font-bold">${esc(p.title)}</h2>
   <b class="text-xl text-sky-200 block">${fmt(p.price)}</b><p class="text-sm text-gray-300">${esc(p.description)}</p>
   <div><b class="text-xs text-sky-200 uppercase">Ingredients</b><p class="text-xs text-gray-400">${esc(p.ingredients)}</p></div>
   <div><b class="text-xs text-sky-200 uppercase">How to use</b><p class="text-xs text-gray-400">${esc(p.usage)}</p></div></div></div>
  <div class="grid md:grid-cols-2 gap-3 mt-4 text-xs text-gray-300">
   <div class="bg-[#031b1b] rounded-xl p-3 border border-sky-400/20"><b class="text-sky-200 uppercase">Quality</b><p class="mt-1">${esc(p.quality)}</p></div>
   <div class="bg-[#031b1b] rounded-xl p-3 border border-sky-400/20"><b class="text-sky-200 uppercase">Advantages</b><ul class="mt-1 space-y-1">${lines(p.advantages).map(a=>`<li>✔ ${esc(a)}</li>`).join('')}</ul></div></div>
  <div class="mt-3">${derm(p)}</div>
  <div class="grid grid-cols-2 gap-2 mt-4"><button onclick="addToCart('${p.id}');hide('pmodal')" class="btn2 !text-white font-bold py-3">Add To Cart</button><button onclick="buyNow('${p.id}');hide('pmodal')" class="btn py-3">Buy Now</button></div>`;
 show('pmodal');
}

/* ---------- cart ---------- */
function addToCart(id){const p=S.products.find(x=>x.id===id);if(!p)return;const c=S.cart.find(i=>i.id===id);c?c.qty++:S.cart.push({id,title:p.title,price:p.price,qty:1});save();renderCart();toggleCart(true)}
const buyNow=addToCart;
function toggleCart(o){const d=$('cart');o===true?d.classList.remove('translate-x-full'):o===false?d.classList.add('translate-x-full'):d.classList.toggle('translate-x-full');renderCart()}
function qty(id,d){const c=S.cart.find(i=>i.id===id);if(!c)return;c.qty+=d;if(c.qty<=0)S.cart=S.cart.filter(i=>i.id!==id);save();renderCart()}
function renderCart(){
 $('badge').textContent=S.cart.reduce((s,i)=>s+i.qty,0);
 $('citems').innerHTML=S.cart.length?S.cart.map(i=>`<div class="flex justify-between items-center bg-[#053a39]/50 p-3 rounded-lg border border-sky-400/20 text-xs"><div><b class="block">${esc(i.title)}</b><span class="text-sky-300">${fmt(i.price)} × ${i.qty}</span></div>
  <div class="flex items-center gap-2"><button onclick="qty('${i.id}',-1)" class="w-6 h-6 rounded border border-sky-400/40">-</button><span>${i.qty}</span><button onclick="qty('${i.id}',1)" class="w-6 h-6 rounded border border-sky-400/40">+</button><button onclick="rmItem('${i.id}')" class="dng ml-1">🗑</button></div></div>`).join(''):'<p class="text-center text-xs text-gray-400 py-8">Aapka cart khali hai.</p>';
 totals();
}
function shipping(city,addr){const base=S.rates[city]??S.rates['Rest of Pakistan']??300;const extra=/street|gali|mohalla|sector|block|outskirt|village|gali/i.test(addr||'')?100:0;return{base,extra,total:base+extra}}
function totals(){
 const sub=S.cart.reduce((s,i)=>s+i.price*i.qty,0),dis=Math.round(sub*pct/100),sh=shipping($('city').value,$('o-addr').value),fee=sub?sh.total:0;
 $('t-sub').textContent=fmt(sub);$('t-dis').textContent='- '+fmt(dis);$('t-ship').textContent=fmt(fee);$('t-total').textContent=fmt(sub-dis+fee);
 $('t-note').classList.toggle('hidden',!(sh.extra&&sub));
}
function fillCities(){$('city').innerHTML=Object.keys(S.rates).map(c=>`<option value="${esc(c)}">${esc(c)} (Rs. ${S.rates[c]})</option>`).join('')}
function applyPromo(){const c=$('promo').value.trim().toUpperCase(),p=S.promos.find(x=>x.code===c);if(p){pct=p.percent;alert('Promo applied: '+p.percent+'% discount');totals()}else{pct=0;alert('Invalid promo code');totals()}}
function placeOrder(){
 if(!S.cart.length)return alert('Cart khali hai.');
 const name=$('o-name').value.trim(),phone=$('o-phone').value.replace(/[\s-]/g,''),addr=$('o-addr').value.trim(),city=$('city').value;
 if(!name||!phone||!addr)return alert('Tamam zaroori details bharein.');
 if(!/^03\d{9}$/.test(phone))return alert('Phone number 03xxxxxxxxx format mein likhein.');
 const sub=S.cart.reduce((s,i)=>s+i.price*i.qty,0),dis=Math.round(sub*pct/100),sh=shipping(city,addr),total=sub-dis+sh.total;
 const id='#ORD-'+Date.now().toString().slice(-6);
 S.orders.push({id,customerName:name,phone,city,address:addr,items:S.cart.map(i=>({...i})),subtotal:sub,discount:dis,shippingFee:sh.total,grandTotal:total,status:'Pending',date:today()});
 S.cart=[];pct=0;save();renderCart();toggleCart(false);
 ['o-name','o-phone','o-addr','promo'].forEach(i=>$(i).value='');
 alert(`Shukriya! Aapka order ${id} receive ho gaya hai.\nTotal COD: ${fmt(total)} (delivery included)`);
}

/* ---------- complaints & reviews ---------- */
function fillProductSelect(){$('c-product').innerHTML='<option value="">Select Product</option>'+S.products.map(p=>`<option>${esc(p.title)}</option>`).join('')}
function sendComplaint(e){e.preventDefault();
 const c={id:'#COMP-'+Date.now().toString().slice(-6),name:$('c-name').value.trim(),phone:$('c-phone').value.trim(),orderId:$('c-order').value.trim()||'N/A',product:$('c-product').value,type:$('c-type').value,message:$('c-msg').value.trim(),date:today(),status:'New'};
 S.complaints.unshift(c);localStorage.setItem('gw_lastc',c.id);save();complaintStatus();e.target.reset();alert('Aapki shikayat owner tak pahunch gayi. ID: '+c.id)}
function complaintStatus(){const b=$('c-status'),c=S.complaints.find(x=>x.id===localStorage.getItem('gw_lastc'));
 if(!c){b.classList.add('hidden');return}b.classList.remove('hidden');
 b.innerHTML=`<div class="flex justify-between"><b class="text-sky-300">🎫 Your Latest Complaint</b><span class="bdg">${esc(c.status)}</span></div><p>ID: ${esc(c.id)}</p><p>Type: ${esc(c.type)}</p><p>${esc(c.message)}</p>${c.reply?`<p class="text-sky-300">Owner reply: ${esc(c.reply)}</p>`:''}`}
function sendReview(e){e.preventDefault();
 S.reviews.unshift({id:'rev-'+Date.now(),name:$('r-name').value.trim(),city:$('r-city').value.trim(),rating:+$('r-rating').value,comment:$('r-comment').value.trim(),date:today()});
 save();renderReviews();e.target.reset();alert('Review submit ho gaya!')}
function renderReviews(){$('rlist').innerHTML=S.reviews.length?S.reviews.map(r=>`<div class="card !p-4 space-y-1"><div class="flex justify-between text-xs"><div><b class="text-sky-300 block">${esc(r.name)} (${esc(r.city)})</b>${'⭐'.repeat(r.rating)}</div><span class="text-gray-400">${esc(r.date)}</span></div><p class="text-xs text-gray-200">${esc(r.comment)}</p></div>`).join(''):'<p class="text-sm text-gray-400">Abhi koi review nahi. Pehla review aap likhein!</p>'}

/* ---------- auth (optional) ---------- */
function authTab(t){const l=t==='login';$('f-login').classList.toggle('hidden',!l);$('f-signup').classList.toggle('hidden',l);
 $('t-login').className='flex-1 py-2 text-sm font-bold '+(l?'text-sky-300 border-b-2 border-sky-400':'text-gray-400');$('t-signup').className='flex-1 py-2 text-sm font-bold '+(!l?'text-sky-300 border-b-2 border-sky-400':'text-gray-400')}
function lock(on){$('shield').classList.toggle('hidden',!on);document.body.style.overflow=on?'hidden':''}
function openAuth(){authTab(user?'login':'signup');$('logout').classList.toggle('hidden',!user);$('auth-x').classList.toggle('hidden',!user);$('auth-note').classList.toggle('hidden',!!user);show('auth')}
function closeAuth(){if(user)hide('auth')}
function setUser(u){user=u;localStorage.setItem('gw_user',JSON.stringify(u));$('uname').textContent=u?u.name:'Login / Sign Up';lock(!u)}
function doLogin(e){e.preventDefault();const id=$('l-id').value.trim().toLowerCase(),a=S.accounts.find(x=>x.identifier.toLowerCase()===id&&x.password===$('l-pass').value);
 if(!a)return alert('Account nahi mila ya password ghalat hai.');setUser({name:a.name,identifier:a.identifier});hide('auth');e.target.reset()}
function doSignup(e){e.preventDefault();const id=$('s-id').value.trim();
 if(S.accounts.some(a=>a.identifier.toLowerCase()===id.toLowerCase())){alert('Yeh account pehle se maujood hai, login karein.');authTab('login');return}
 S.accounts.push({name:$('s-name').value.trim(),identifier:id,city:$('s-city').value.trim(),password:$('s-pass').value});save();
 setUser({name:$('s-name').value.trim(),identifier:id});hide('auth');e.target.reset();alert('Account ban gaya!')}
function doLogout(){setUser(null);openAuth()}

/* ---------- admin ---------- */
function openAdmin(){$('a-login').classList.remove('hidden');$('a-main').classList.add('hidden');$('a-pass').value='';show('admin');setTimeout(()=>$('a-pass').focus(),80)}
function adminLogin(){if($('a-pass').value!==pass){$('a-pass').value='';return alert('Password ghalat hai.')}
 $('a-login').classList.add('hidden');$('a-main').classList.remove('hidden');adminAll();
 $('w-brand').value=S.site.brand;$('w-tag').value=S.site.tagline;$('w-ceo').value=S.site.ceo;$('w-sup').value=S.site.support}
function adminAll(){adminStats();adminRates();adminOrders();adminComps();adminProds();adminRevs();adminPromos();adminContent();adminUsers();fillManual()}
function adminStats(){const r=$('a-range').value,now=new Date(),t=today();
 const o=S.orders.filter(x=>r==='today'?x.date===t:r==='week'?(now-new Date(x.date))/864e5<=7:r==='month'?x.date.slice(0,7)===t.slice(0,7):true);
 $('s-orders').textContent=o.length;$('s-rev').textContent=fmt(o.reduce((s,x)=>s+x.grandTotal,0));$('s-pend').textContent=o.filter(x=>x.status==='Pending').length;$('s-del').textContent=o.filter(x=>x.status==='Delivered').length}
function adminRates(){fillManual();$('rates').innerHTML=Object.keys(S.rates).map(c=>`<div class="bg-[#031b1b] p-2 rounded border border-sky-400/30 flex justify-between items-center text-xs"><div><b class="block">${esc(c)}</b><input type="number" min="0" value="${S.rates[c]}" onchange="setRate(${JSON.stringify(c).replace(/"/g,'&quot;')},this.value)" class="inp !py-0.5 !px-1 mt-1 text-xs"></div>${c!=='Rest of Pakistan'?`<button class="dng" onclick="delCity(${JSON.stringify(c).replace(/"/g,'&quot;')})">🗑</button>`:''}</div>`).join('')}
function addCity(){const n=$('n-city').value.trim(),r=parseInt($('n-rate').value);if(n&&!isNaN(r)&&r>=0){S.rates[n]=r;save();fillCities();adminRates();$('n-city').value=$('n-rate').value=''}}
function delCity(c){delete S.rates[c];save();fillCities();adminRates()}
function adminOrders(){$('a-orders').innerHTML=S.orders.length?S.orders.slice().reverse().map(o=>`<tr>
 <td class="p-3 font-bold text-sky-300">${esc(o.id)}<br><small class="text-gray-400">${esc(o.date)}</small></td>
 <td class="p-3">${esc(o.customerName)}<br><span class="text-gray-400">${esc(o.phone)}</span><br><span class="text-sky-300/80">${esc(o.city)} - ${esc(o.address)}</span></td>
 <td class="p-3">${o.items.map(i=>esc(i.title)+' (x'+i.qty+')').join(', ')}</td><td class="p-3 font-bold text-white">${fmt(o.grandTotal)}</td>
 <td class="p-3"><select onchange="setStatus('${o.id}',this.value)" class="bg-[#053a39] border border-sky-400/40 rounded text-xs px-1 py-0.5">${['Pending','Shipped','Delivered'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></td>
 <td class="p-3"><a target="_blank" rel="noopener" href="https://wa.me/92${o.phone.replace(/^0/,'')}?text=${encodeURIComponent('AoA '+o.customerName+', aapka Glutawol order '+o.id+' ('+fmt(o.grandTotal)+') confirm ho gaya hai.')}" class="bg-green-600 hover:bg-green-500 text-white text-[10px] px-2 py-1 rounded">WhatsApp</a><div class="flex gap-1 mt-1"><button class="btn2 !px-2 !py-1" onclick="editOrder('${o.id}')">✏</button><button class="dng" onclick="delOrder('${o.id}')">🗑</button></div></td></tr>`).join(''):'<tr><td colspan="6" class="p-4 text-center text-gray-400">Abhi koi order nahi.</td></tr>'}
function setStatus(id,s){const o=S.orders.find(x=>x.id===id);if(o){o.status=s;save();adminStats()}}
function adminComps(){$('a-comps').innerHTML=S.complaints.length?S.complaints.map((c,i)=>`<div class="bg-[#031b1b] p-4 rounded-lg border border-sky-400/30 text-xs space-y-2">
 <div class="flex flex-col sm:flex-row sm:justify-between gap-1"><b class="text-sky-300">${esc(c.name)}</b><span class="text-gray-400">${esc(c.date)} • ${esc(c.id)}</span></div>
 <div class="grid sm:grid-cols-3 gap-1 text-gray-300"><span>📞 ${esc(c.phone)}</span><span>Order: ${esc(c.orderId)}</span><span>${esc(c.type)}</span></div>
 <p class="bg-[#053a39]/60 p-3 rounded">${esc(c.message)}</p>
 <div class="flex flex-wrap gap-2 items-center"><select onchange="setCompStatus(${i},this.value)" class="inp !w-auto !py-1 text-xs">${['New','In Progress','Resolved'].map(x=>`<option ${c.status===x?'selected':''}>${x}</option>`).join('')}</select><button class="btn2" onclick="resolveComp(${i})">✔ Mark Resolved</button><button class="btn2" onclick="replyComp(${i})">💬 Reply</button><button class="btn2" onclick="editComp(${i})">✏ Edit Details</button><button class="dng" onclick="delComp(${i})">🗑 Delete</button></div></div>`).join(''):'<p class="text-xs text-gray-400">Koi complaint nahi.</p>'}
function resolveComp(i){S.complaints[i].status='Resolved';save();adminComps();complaintStatus()}
function delComp(i){if(!confirm('Yeh complaint delete karein?'))return;S.complaints.splice(i,1);save();adminComps();complaintStatus()}

const fileToUrl=f=>new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=()=>res(r.result);im.onload=()=>{const k=Math.min(1,800/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.8))};im.src=r.result};r.readAsDataURL(f)});
const refreshProds=()=>{save();renderProducts();renderAbout();fillProductSelect();adminProds()};
async function addProduct(){
 const title=$('np-title').value.trim(),price=parseInt($('np-price').value);
 const urls=$('np-img').value.split(/[\n,]/).map(x=>x.trim()).filter(Boolean),files=await Promise.all([...$('np-files').files].map(fileToUrl)),images=[...urls,...files];
 if(!title||isNaN(price)||price<=0)return alert('Product name aur sahi price darj karein.');
 if(!images.length)return alert('Kam az kam ek image add karein.');
 S.products.push({id:'prod-'+Date.now(),brand:$('np-brand').value.trim()||'GLUTAWOL',title,price,images,description:$('np-desc').value.trim(),ingredients:$('np-ing').value.trim(),usage:$('np-use').value.trim(),advantages:$('np-adv').value.trim(),quality:$('np-qual').value.trim()||$('np-desc').value.trim(),dermatologistRecommended:$('np-derm').checked});
 refreshProds();['np-title','np-price','np-brand','np-img','np-desc','np-ing','np-use','np-adv','np-qual'].forEach(i=>$(i).value='');$('np-files').value='';$('np-derm').checked=false;alert('Product add ho gaya.')}
function adminProds(){fillManual();$('pcount').textContent=S.products.length;
 $('a-prods').innerHTML=S.products.length?S.products.map((p,i)=>`<div class="bg-[#031b1b] p-4 rounded-xl border border-sky-400/25 space-y-3 text-xs">
  <div class="flex justify-between items-center gap-2"><b class="text-sky-200">${esc(p.title)}</b><button class="dng" onclick="delProduct(${i})">🗑 Delete Product</button></div>
  <label class="lbl">Title<input class="inp mt-1" value="${esc(p.title)}" onchange="upd(${i},'title',this.value)"></label>
  <label class="lbl">Price (Rs.)<input type="number" min="1" class="inp mt-1" value="${p.price}" onchange="upd(${i},'price',parseInt(this.value)||0)"></label>
  <label class="lbl">Brand<input class="inp mt-1" value="${esc(p.brand)}" onchange="upd(${i},'brand',this.value)"></label>
  <label class="lbl">Description<textarea rows="2" class="inp mt-1" onchange="upd(${i},'description',this.value)">${esc(p.description)}</textarea></label>
  <label class="lbl">Ingredients<textarea rows="2" class="inp mt-1" onchange="upd(${i},'ingredients',this.value)">${esc(p.ingredients)}</textarea></label>
  <label class="lbl">How to use<textarea rows="2" class="inp mt-1" onchange="upd(${i},'usage',this.value)">${esc(p.usage)}</textarea></label>
  <label class="lbl">Quality<textarea rows="2" class="inp mt-1" onchange="upd(${i},'quality',this.value)">${esc(p.quality)}</textarea></label>
  <label class="lbl">Advantages (one per line)<textarea rows="3" class="inp mt-1" onchange="upd(${i},'advantages',this.value)">${esc(p.advantages)}</textarea></label>
  <div><b class="text-sky-200">Images</b><div class="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">${p.images.map((s,j)=>`<div class="relative rounded overflow-hidden border border-sky-400/20"><img src="${esc(s)}" class="w-full h-20 object-cover"><button onclick="delImg(${i},${j})" class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6" title="Delete image">🗑</button>${j===0?'<span class="absolute bottom-1 left-1 bg-cyan-700/90 px-1 rounded text-[9px]">Main</span>':`<button onclick="mainImg(${i},${j})" class="absolute bottom-1 left-1 bg-cyan-700/90 px-1 rounded text-[9px]">★ Main</button>`}</div>`).join('')}</div>
   <div class="flex flex-wrap gap-2 mt-2"><input id="iu-${i}" placeholder="Image URL" class="inp !w-auto flex-1"><button class="btn2" onclick="addImgUrl(${i})">Add URL</button>
   <label class="btn2 cursor-pointer">⬆ Upload<input type="file" accept="image/*" multiple class="hidden" onchange="upImgs(${i},this)"></label></div></div>
  <label class="flex items-center gap-2 text-sky-200 font-bold"><input type="checkbox" ${p.dermatologistRecommended?'checked':''} onchange="upd(${i},'dermatologistRecommended',this.checked)"> Dermatologist Recommended <span class="text-gray-500 font-normal">(sirf verified)</span></label>
 </div>`).join(''):'<p class="text-xs text-gray-400">Abhi koi product nahi.</p>'}
function upd(i,f,v){S.products[i][f]=v;refreshProds()}
function delImg(i,j){S.products[i].images.splice(j,1);refreshProds()}
function addImgUrl(i){const u=$('iu-'+i).value.trim();if(!u)return;S.products[i].images.push(u);refreshProds()}
async function upImgs(i,inp){const fs=[...inp.files].filter(f=>f.type.startsWith('image/'));if(!fs.length)return;
 const old=S.products[i].images.slice();S.products[i].images.push(...await Promise.all(fs.map(fileToUrl)));
 if(!save()){S.products[i].images=old;return}refreshProds()}
function delProduct(i){if(!confirm('Yeh product delete karein?'))return;const id=S.products[i].id;S.products.splice(i,1);S.cart=S.cart.filter(c=>c.id!==id);refreshProds();renderCart()}
function adminRevs(){$('a-revs').innerHTML=S.reviews.length?S.reviews.map((r,i)=>`<div class="bg-[#031b1b] p-3 rounded-lg border border-sky-400/30 flex justify-between gap-3 text-xs"><div><b class="text-sky-300">${esc(r.name)} (${esc(r.city)})</b> ${'⭐'.repeat(r.rating)}<p class="text-gray-300 mt-1">${esc(r.comment)}</p></div><div class="flex flex-col gap-1 shrink-0 h-fit"><button class="btn2" onclick="editReview(${i})">✏ Edit</button><button class="dng" onclick="delReview(${i})">🗑 Delete</button></div></div>`).join(''):'<p class="text-xs text-gray-400">Koi review nahi.</p>'}
function delReview(i){S.reviews.splice(i,1);save();renderReviews();adminRevs()}
function adminPromos(){$('a-promos').innerHTML=S.promos.map(p=>`<span class="bdg !text-xs">${esc(p.code)} (${p.percent}%) <button onclick="editPromo('${esc(p.code)}')" class="text-sky-300 ml-1">✏</button><button onclick="delPromo('${esc(p.code)}')" class="text-red-400 ml-1">×</button></span>`).join('')}
function addPromo(){const c=$('n-code').value.trim().toUpperCase(),p=parseInt($('n-pct').value);if(!c||isNaN(p)||p<1||p>90)return alert('Code aur 1-90% discount darj karein.');
 S.promos=S.promos.filter(x=>x.code!==c);S.promos.push({code:c,percent:p});save();adminPromos();$('n-code').value=$('n-pct').value=''}
function delPromo(c){S.promos=S.promos.filter(p=>p.code!==c);save();adminPromos()}
function changePass(){const c=$('p-cur').value,n=$('p-new').value,k=$('p-con').value;
 if(c!==pass)return alert('Current password ghalat hai.');if(n.length<6)return alert('Naya password kam az kam 6 characters ka ho.');if(n!==k)return alert('Passwords match nahi karte.');
 pass=n;localStorage.setItem('gw_pass',n);['p-cur','p-new','p-con'].forEach(i=>$(i).value='');alert('Password change ho gaya.')}
function saveSite(){S.site={brand:$('w-brand').value.trim()||'GLUTAWOL',tagline:$('w-tag').value.trim()||'Premium Organic Care',ceo:$('w-ceo').value.trim()||'Sir Aftab',support:$('w-sup').value.trim()||'Direct Owner Contact'};save();applySite();alert('Settings save ho gayi.')}
function applySite(){document.title=S.site.brand+' | Official Skincare Store';$('brand').textContent=$('brand2').textContent=S.site.brand;$('tagline').textContent=S.site.tagline;$('support').textContent=S.site.support;document.querySelectorAll('[data-ceo]').forEach(e=>e.textContent=S.site.ceo)}

/* ---------- save / backup / extra CRUD ---------- */
const BK=['products','rates','orders','complaints','promos','reviews','site','content'];
function saveAll(){if(save())alert('Saari changes save ho gayi hain. Computer band karne ke baad bhi isi browser mein mehfooz rahengi.\nExtra hifazat ke liye "Download Backup" bhi kar lein.')}
function downloadBackup(){const d={};BK.forEach(k=>d[k]=S[k]);
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,1)],{type:'application/json'}));a.download='glutawol-backup-'+today()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function restoreBackup(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();
 r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.products)||typeof d.rates!=='object')throw 0;
  if(!confirm('Maujooda data backup se replace ho jayega. Jari rakhein?'))return;
  BK.forEach(k=>{if(d[k]!==undefined)S[k]=d[k]});S.products=S.products.map(p=>({...p,images:p.images||[]}));
  if(save()){refreshProds();renderReviews();fillCities();fillProductSelect();applySite();renderCart();complaintStatus();adminAll();alert('Backup restore ho gaya.')}
 }catch(e){alert('Yeh sahi backup file nahi hai.')}inp.value=''};r.readAsText(f)}
function addReviewAdmin(){const name=$('ar-name').value.trim(),city=$('ar-city').value.trim(),c=$('ar-comment').value.trim();
 if(!name||!city||!c)return alert('Name, city aur review text darj karein.');
 S.reviews.unshift({id:'rev-'+Date.now(),name,city,rating:+$('ar-rating').value,comment:c,date:today()});save();renderReviews();adminRevs();['ar-name','ar-city','ar-comment'].forEach(i=>$(i).value='')}
function editReview(i){const r=S.reviews[i];if(!r)return;const c=prompt('Review text edit karein:',r.comment);if(c===null)return;
 const n=prompt('Rating (1-5):',r.rating);if(n===null)return;const k=parseInt(n);if(!(k>=1&&k<=5))return alert('Rating 1 se 5 ke beech ho.');
 r.comment=c.trim()||r.comment;r.rating=k;save();renderReviews();adminRevs()}
function editOrder(id){const o=S.orders.find(x=>x.id===id);if(!o)return;
 const n=prompt('Customer name:',o.customerName);if(n===null)return;
 const ph=prompt('Phone (03xxxxxxxxx):',o.phone);if(ph===null)return;if(!/^03\d{9}$/.test(ph.replace(/[\s-]/g,'')))return alert('Phone 03xxxxxxxxx format mein ho.');
 const a=prompt('Address:',o.address);if(a===null)return;
 o.customerName=n.trim()||o.customerName;o.phone=ph.replace(/[\s-]/g,'');o.address=a.trim()||o.address;save();adminOrders()}
function delOrder(id){if(!confirm('Yeh order delete karein?'))return;S.orders=S.orders.filter(x=>x.id!==id);save();adminOrders();adminStats()}
function replyComp(i){const c=S.complaints[i];if(!c)return;const r=prompt('Customer ke liye reply likhein:',c.reply||'');if(r===null)return;c.reply=r.trim();save();adminComps();complaintStatus()}
function setRate(c,v){const r=parseInt(v);if(isNaN(r)||r<0)return alert('Sahi rate darj karein.');S.rates[c]=r;save();fillCities();adminRates()}
function editPromo(c){const p=S.promos.find(x=>x.code===c);if(!p)return;const v=parseInt(prompt('Naya discount % (1-90):',p.percent));if(!(v>=1&&v<=90))return;p.percent=v;save();adminPromos()}

/* ---------- content editor, customers, manual orders ---------- */
S.content=ld('content',{});
const LABELS={heroBadge:'Home: top badge',heroT1:'Home: heading line 1',heroT2:'Home: heading line 2',heroText:'Home: paragraph',brandText:'About: brand paragraph',aboutP1:'About: story paragraph 1',aboutP2:'About: story paragraph 2',mission:'About: Mission',vision:'About: Vision',ceoBio:'About: CEO profile text',footerText:'Footer text'};
const DEF_C={};
function captureDefaults(){document.querySelectorAll('[data-c]').forEach(e=>{DEF_C[e.getAttribute('data-c')]=e.textContent.trim()})}
function applyContent(){document.querySelectorAll('[data-c]').forEach(e=>{const k=e.getAttribute('data-c');if(S.content[k]!==undefined)e.textContent=S.content[k]})}
function adminContent(){$('a-content').innerHTML=Object.keys(LABELS).map(k=>`<div><label class="lbl">${LABELS[k]}</label><textarea rows="${(DEF_C[k]||'').length>90?4:2}" class="inp" onchange="setContent('${k}',this.value)">${esc(S.content[k]!==undefined?S.content[k]:DEF_C[k])}</textarea><button class="btn2 mt-1" onclick="resetContent('${k}')">↺ Default</button></div>`).join('')}
function setContent(k,v){v=v.trim();if(!v)return resetContent(k);S.content[k]=v;save();applyContent()}
function resetContent(k){delete S.content[k];save();const e=document.querySelector('[data-c="'+k+'"]');if(e&&DEF_C[k]!==undefined)e.textContent=DEF_C[k];adminContent()}
function adminUsers(){$('ucount').textContent=S.accounts.length;$('a-users').innerHTML=S.accounts.length?S.accounts.map((a,i)=>`<div class="bg-[#031b1b] p-3 rounded-lg border border-sky-400/30 flex flex-wrap justify-between gap-2 text-xs"><div><b class="text-sky-300">${esc(a.name)}</b> · ${esc(a.identifier)} · ${esc(a.city)}</div><div class="flex gap-1"><button class="btn2" onclick="editUser(${i})">✏ Edit</button><button class="btn2" onclick="resetUserPass(${i})">🔑 Reset Password</button><button class="dng" onclick="delUser(${i})">🗑</button></div></div>`).join(''):'<p class="text-xs text-gray-400">Abhi koi registered customer nahi.</p>'}
function addUser(){const n=$('u-name').value.trim(),id=$('u-id').value.trim(),c=$('u-city').value.trim(),p=$('u-pass').value;
 if(!n||!id||!c||p.length<6)return alert('Sab fields bharein; password kam az kam 6 characters.');
 if(S.accounts.some(a=>a.identifier.toLowerCase()===id.toLowerCase()))return alert('Yeh account pehle se maujood hai.');
 S.accounts.push({name:n,identifier:id,city:c,password:p});save();adminUsers();['u-name','u-id','u-city','u-pass'].forEach(i=>$(i).value='')}
function editUser(i){const a=S.accounts[i];if(!a)return;const n=prompt('Name:',a.name);if(n===null)return;const c=prompt('City:',a.city);if(c===null)return;
 a.name=n.trim()||a.name;a.city=c.trim()||a.city;if(user&&user.identifier===a.identifier)setUser({...user,name:a.name});save();adminUsers()}
function resetUserPass(i){const p=prompt('Naya password (6+ characters):');if(p===null)return;if(p.length<6)return alert('Password kam az kam 6 characters ka ho.');S.accounts[i].password=p;save();alert('Password badal diya gaya.')}
function delUser(i){if(!confirm('Yeh customer account delete karein?'))return;const a=S.accounts.splice(i,1)[0];save();adminUsers();if(user&&user.identifier===a.identifier){hide('admin');setUser(null);openAuth()}}
function fillManual(){const c=$('mo-city'),p=$('mo-prod');if(!c||!p)return;c.innerHTML=Object.keys(S.rates).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');p.innerHTML=S.products.map(x=>`<option value="${x.id}">${esc(x.title)} (${fmt(x.price)})</option>`).join('')}
function addManualOrder(){const name=$('mo-name').value.trim(),ph=$('mo-phone').value.replace(/[\s-]/g,''),addr=$('mo-addr').value.trim(),city=$('mo-city').value,pr=S.products.find(x=>x.id===$('mo-prod').value),q=Math.max(1,parseInt($('mo-qty').value)||1);
 if(!name||!addr||!pr)return alert('Naam, address aur product zaroori hain.');if(!/^03\d{9}$/.test(ph))return alert('Phone 03xxxxxxxxx format mein ho.');
 const sub=pr.price*q,sh=shipping(city,addr);
 S.orders.push({id:'#ORD-'+Date.now().toString().slice(-6),customerName:name,phone:ph,city,address:addr,items:[{id:pr.id,title:pr.title,price:pr.price,qty:q}],subtotal:sub,discount:0,shippingFee:sh.total,grandTotal:sub+sh.total,status:'Pending',date:today()});
 save();adminOrders();adminStats();['mo-name','mo-phone','mo-addr'].forEach(i=>$(i).value='');$('mo-qty').value=1}
function setCompStatus(i,v){S.complaints[i].status=v;save();adminComps();complaintStatus()}
function editComp(i){const c=S.complaints[i];if(!c)return;const n=prompt('Customer name:',c.name);if(n===null)return;const ph=prompt('Phone:',c.phone);if(ph===null)return;const m=prompt('Message:',c.message);if(m===null)return;
 c.name=n.trim()||c.name;c.phone=ph.trim()||c.phone;c.message=m.trim()||c.message;save();adminComps();complaintStatus()}
function mainImg(i,j){const im=S.products[i].images;im.unshift(im.splice(j,1)[0]);refreshProds()}
function rmItem(id){S.cart=S.cart.filter(i=>i.id!==id);save();renderCart()}

/* ---------- init (no forced login) ---------- */
['auth','pmodal','admin'].forEach(id=>$(id).addEventListener('click',e=>{if(e.target.id===id)id==='auth'?closeAuth():hide(id)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){['pmodal','admin'].forEach(hide);closeAuth();toggleCart(false)}});
captureDefaults();applyContent();applySite();fillCities();fillProductSelect();renderProducts();renderReviews();renderCart();complaintStatus();
if(user){$('uname').textContent=user.name}else{lock(true);openAuth()}
