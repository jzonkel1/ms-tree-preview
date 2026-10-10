/* M&S Tree Service - one file for every page. Each block null-guards. */

/* header solid on scroll */
(function(){var h=document.getElementById('hdr');if(!h)return;function s(){h.classList.toggle('solid',scrollY>30)}addEventListener('scroll',s,{passive:true});s()})();

/* mobile menu: one button toggles; the bars morph into an X (css) */
(function(){var b=document.body,m=document.getElementById('mnav'),o=document.getElementById('burger');if(!m||!o)return;
function set(open){b.classList.toggle('menu-open',open);m.setAttribute('aria-hidden',open?'false':'true');o.setAttribute('aria-expanded',open?'true':'false');o.setAttribute('aria-label',open?'Close menu':'Open menu')}
o.onclick=function(){set(!b.classList.contains('menu-open'))};
m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){set(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape'&&b.classList.contains('menu-open')){set(false);o.focus()}});
addEventListener('resize',function(){if(innerWidth>1040&&b.classList.contains('menu-open'))set(false)})})();

/* reveal */
(function(){var els=document.querySelectorAll('.rv-up');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
els.forEach(function(e,i){if(e.closest('.hero'))e.style.transitionDelay=(i*0.08)+'s';io.observe(e)})})();

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* reviews marquee: every Google review with text, verbatim */
(function(){var t=document.getElementById('track'),R=window.REVIEWS||[];if(!t||!R.length)return;var h='';
R.forEach(function(r){h+='<article class="rv"><span class="st">★★★★★</span><p>'+esc(r.t)+'</p><footer><i>'+esc(r.n.charAt(0))+'</i><span><b>'+esc(r.n)+'</b> &middot; '+esc(r.d)+'</span></footer></article>'});
t.innerHTML=h+h;t.querySelectorAll('.rv').forEach(function(a,i){if(i>=R.length)a.setAttribute('aria-hidden','true')})})();

/* gallery + lightbox */
(function(){var g=document.getElementById('gal'),P=window.GAL||[];if(!g||!P.length)return;
var lim=+g.dataset.limit||P.length,full=g.classList.contains('open');P=P.slice(0,Math.max(lim,full?P.length:lim));
var d=document.getElementById('dots'),h='',dh='';
function src(p){return '/ms-tree-preview/assets/img/w-'+p.stem+'.webp'}function th(p){return '/ms-tree-preview/assets/img/t-'+p.stem+'.webp'}
/* bento: the best, biggest photos get the big tiles; small sources never do */
/* home preview: a fixed rectangle, big tiles on two corners (the second big = the next big landscape that isn't the opening shot's twin) */
var big2=-1;if(!full){for(var k=2;k<P.length;k++){if(P[k].w>=1400&&P[k].w/P[k].h>1.2){big2=k;break}}}
function tile(p,i){if(!full)return i===0?'p-big1':(i===big2?'p-big2':'');var r=p.w/p.h;if(i<4&&p.w>=1400)return 'b-big';if(r>1.25&&p.w>=1200)return 'b-wide';if(r<.8)return 'b-tall';return ''}
P.forEach(function(p,i){h+='<button type="button" class="'+tile(p,i)+'" data-i="'+i+'" aria-label="'+esc(p.alt)+'"><img src="/ms-tree-preview/assets/img/m-'+p.stem+'.webp" alt="'+esc(p.alt)+'" loading="'+(i<6?'eager':'lazy')+'" decoding="async" width="'+p.mw+'" height="'+p.mh+'"></button>';if(i<12&&!full)dh+='<i'+(i?'':' class="on"')+'></i>'});
g.innerHTML=h;if(d)d.innerHTML=dh;
var dots=d?[].slice.call(d.children):[];
g.addEventListener('scroll',function(){if(full||!dots.length)return;var w=g.firstElementChild.getBoundingClientRect().width+10;var k=Math.round(g.scrollLeft/w);dots.forEach(function(x,j){x.classList.toggle('on',j===k)})},{passive:true});
var lb=document.getElementById('lb'),lt=document.getElementById('lbt'),lc=document.getElementById('lbc'),cur=0,sx=0,dx=0,down=false;if(!lb)return;
lt.innerHTML=P.map(function(p){return '<div class="lb-slide"><img loading="lazy" src="'+src(p)+'" alt="'+esc(p.alt)+'"></div>'}).join('');
function go(i,anim){cur=(i+P.length)%P.length;lt.style.transition=anim===false?'none':'';lt.style.transform='translateX('+(-cur*100)+'%)';lc.textContent=(cur+1)+' / '+P.length}
function open(i){lb.classList.add('on');document.body.style.overflow='hidden';go(i,false)}
function close(){lb.classList.remove('on');document.body.style.overflow=''}
g.addEventListener('click',function(e){var b=e.target.closest('button');if(b)open(+b.dataset.i)});
document.getElementById('lbx').onclick=close;document.getElementById('lbp').onclick=function(){go(cur-1)};document.getElementById('lbn').onclick=function(){go(cur+1)};
addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')go(cur-1);if(e.key==='ArrowRight')go(cur+1)});
lt.addEventListener('pointerdown',function(e){down=true;sx=e.clientX;dx=0;lt.style.transition='none'});
lt.addEventListener('pointermove',function(e){if(!down)return;dx=e.clientX-sx;lt.style.transform='translateX(calc('+(-cur*100)+'% + '+dx+'px))'});
function end(e){if(!down)return;down=false;if(dx<-60)go(cur+1);else if(dx>60)go(cur-1);else if(Math.abs(dx)<6&&!e.target.closest('img'))close();else go(cur)}
lt.addEventListener('pointerup',end);lt.addEventListener('pointercancel',end);
})();

/* reels: paged carousel with every slide mounted; play on-screen, pause off-screen */
(function(){document.querySelectorAll('.reels').forEach(function(root){
var track=root.querySelector('.reels-track'),slides=[].slice.call(track.children),prev=root.querySelector('.prev'),next=root.querySelector('.next'),
dotsEl=root.parentNode.querySelector('.reels-dots'),page=0,per=4,GAP=18;
function perView(){return matchMedia('(min-width:1024px)').matches?4:matchMedia('(min-width:640px)').matches?2:1}
function pages(){return Math.max(1,Math.ceil(slides.length/per))}
function draw(){per=perView();if(page>pages()-1)page=pages()-1;
track.style.transform='translateX(calc(-'+page+' * (100% + '+GAP+'px)))';
prev.disabled=page===0;next.disabled=page>=pages()-1;
var h='';for(var i=0;i<pages();i++)h+='<i'+(i===page?' class="on"':'')+' data-p="'+i+'"></i>';dotsEl.innerHTML=h}
prev.onclick=function(){page--;draw()};next.onclick=function(){page++;draw()};
dotsEl.addEventListener('click',function(e){var p=e.target.dataset.p;if(p!=null){page=+p;draw()}});
/* finger-follow swipe: the track moves with the thumb, then settles on a page */
var sx=null,sy=0,dx=0,horiz=null;
function base(){return 'translateX(calc(-'+page+' * (100% + '+GAP+'px)))'}
track.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;dx=0;horiz=null},{passive:true});
track.addEventListener('touchmove',function(e){if(sx==null)return;var x=e.touches[0].clientX-sx,y=e.touches[0].clientY-sy;
  if(horiz===null&&(Math.abs(x)>6||Math.abs(y)>6))horiz=Math.abs(x)>Math.abs(y);if(!horiz)return;
  dx=x;if((page===0&&dx>0)||(page>=pages()-1&&dx<0))dx=dx/3;track.style.transition='none';track.style.transform=base()+' translateX('+dx+'px)'},{passive:true});
function endSwipe(){if(sx==null)return;sx=null;track.style.transition='';if(horiz){if(dx<-40&&page<pages()-1)page++;else if(dx>40&&page>0)page--}draw()}
track.addEventListener('touchend',endSwipe);track.addEventListener('touchcancel',endSwipe);
addEventListener('resize',draw);draw();
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var io=new IntersectionObserver(function(en){en.forEach(function(e){var v=e.target;
if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;if(!reduce){var p=v.play();if(p)p.catch(function(){})}}else v.pause()})},{threshold:.25});
slides.forEach(function(s){io.observe(s.querySelector('video'))});
})})();

/* quote wizard -> Netlify Forms (ms-quote). Confirmation only after a 2xx. */
(function(){document.querySelectorAll('form.qw').forEach(function(f){
var steps=[].slice.call(f.querySelectorAll('.qw-step')),N=steps.length,cur=1,
lbl=f.querySelector('.qw-step-lbl'),bar=f.querySelector('.qw-bar i'),back=f.querySelector('.qw-back'),
urgent=f.querySelector('.qw-urgent'),err=f.querySelector('.form-err'),btn=f.querySelector('.qw-submit'),bl=btn.querySelector('.lbl');
f.querySelector('[name=page]').value=location.pathname;
function show(n,focus){cur=n;steps.forEach(function(s){s.classList.toggle('on',+s.dataset.step===n)});
lbl.textContent='Step '+n+' of '+N;bar.style.width=(n/N*100)+'%';back.hidden=n===1;
if(n===N){urgent.hidden=!/emergency/i.test(f.elements.timing.value);if(focus){var i=f.querySelector('[name=name]');setTimeout(function(){i.focus({preventScroll:true})},60)}}}
function next(){var n=cur+1;while(n<N&&f.elements[['','service','timing','town'][n]]&&f.elements[['','service','timing','town'][n]].dataset.skip)n++;show(n,true)}
f.querySelectorAll('.qw-opt').forEach(function(o){o.addEventListener('click',function(){
  var fld=o.dataset.field;f.elements[fld].value=o.dataset.value;
  f.querySelectorAll('.qw-opt[data-field="'+fld+'"]').forEach(function(x){x.classList.toggle('sel',x===o)});
  setTimeout(next,230)})});
back.onclick=function(){var n=cur-1;while(n>1&&f.elements[['','service','timing','town'][n]].dataset.skip)n--;show(n)};
/* presets from service/town pages: answer and skip that question */
[['service',f.dataset.presetService],['town',f.dataset.presetTown]].forEach(function(p){if(!p[1])return;var o=f.querySelector('.qw-opt[data-field="'+p[0]+'"][data-value="'+p[1]+'"]');if(o){o.classList.add('sel');f.elements[p[0]].value=p[1];f.elements[p[0]].dataset.skip='1'}});
if(f.elements.service.dataset.skip)show(2);
var ph=f.elements.phone,em=f.elements.email;
ph.addEventListener('input',function(){var v=ph.value.replace(/\D/g,'');if(v.length===11&&v[0]==='1')v=v.slice(1);v=v.slice(0,10);
  ph.value=v.length>6?'('+v.slice(0,3)+') '+v.slice(3,6)+'-'+v.slice(6):v.length>3?'('+v.slice(0,3)+') '+v.slice(3):v;});
f.addEventListener('keydown',function(e){if(e.key==='Enter'&&cur<N&&e.target.tagName!=='TEXTAREA')e.preventDefault()});
f.addEventListener('submit',function(e){e.preventDefault();if(cur<N)return;var ok=true;
  var n=f.elements.name;f.querySelector('.f-name').classList.toggle('bad',!n.value.trim());if(!n.value.trim())ok=false;
  var d=ph.value.replace(/\D/g,'');var good=d.length===10&&/[2-9]/.test(d[0])&&/[2-9]/.test(d[3]);f.querySelector('.f-phone').classList.toggle('bad',!good);if(!good)ok=false;
  var ev=em.value.trim(),eok=!ev||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ev);f.querySelector('.f-email').classList.toggle('bad',!eok);if(!eok)ok=false;
  if(!ok){var b=f.querySelector('.fld.bad input');if(b)b.focus();return}
  btn.disabled=true;var old=bl.textContent;bl.textContent='Sending…';err.hidden=true;
  fetch('/ms-tree-preview/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()})
  .then(function(r){if(!r.ok)throw new Error(r.status);location.href='/ms-tree-preview/thank-you/'})
  .catch(function(){btn.disabled=false;bl.textContent=old;err.hidden=false});
});
show(cur);
})})();

/* how it works on phones: the rail fills and each circle lights up as it passes 62% of the screen (styles are phone-only) */
(function(){var st=[].slice.call(document.querySelectorAll('.step'));if(!st.length)return;
var bars=[].slice.call(document.querySelectorAll('.step .bar')),tick=false;
function upd(){tick=false;var m=innerHeight*0.62;
  st.forEach(function(s){s.classList.toggle('lit',s.getBoundingClientRect().top+37<m)});
  bars.forEach(function(b){var r=b.getBoundingClientRect(),f=r.height?(m-r.top)/r.height:0;b.style.setProperty('--f',Math.max(0,Math.min(1,f)).toFixed(3))})}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()})();
