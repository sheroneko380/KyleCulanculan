const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
// theme (remembered)
const root=document.documentElement, tbtn=$('#theme-toggle');
try{if(localStorage.getItem('theme')==='light'){root.classList.add('light');tbtn.textContent='☀️'}}catch(e){}
tbtn.addEventListener('click',()=>{const l=root.classList.toggle('light');tbtn.textContent=l?'☀️':'🌙';try{localStorage.setItem('theme',l?'light':'dark')}catch(e){}});
// mobile menu
$('#menu-toggle').addEventListener('click',()=>$('nav').classList.toggle('open'));
$$('nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));
// typing roles
const roles=['Second-Year IT Student','Web Design & Development Enthusiast','Esports Player','Lifelong Learner'];
const typed=$('#typed');let ri=0,ci=0,del=false;
(function type(){const w=roles[ri];typed.textContent=w.slice(0,ci);
 if(!del&&ci===w.length){del=true;return setTimeout(type,1500)}
 if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
 ci+=del?-1:1;setTimeout(type,del?35:70)})();
// reveal, bars, counters
document.querySelectorAll('section h2, .card').forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%3)*80+'ms'});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('show');
 $$('.bar span',e.target).forEach(b=>b.style.width=b.dataset.w+'%');io.unobserve(e.target)}),{threshold:.15});
$$('.reveal').forEach(el=>io.observe(el));
$$('[data-count]').forEach(el=>{const n=+el.dataset.count;let v=0;const t=setInterval(()=>{el.textContent=++v;if(v>=n)clearInterval(t)},300)});
// scroll progress, back to top, active nav
const secs=$$('main section[id]'),links=$$('nav a');
addEventListener('scroll',()=>{const h=root.scrollHeight-innerHeight;$('#progress').style.width=(scrollY/h*100)+'%';
 $('#to-top').classList.toggle('show',scrollY>500);
 let cur='home';secs.forEach(s=>{if(scrollY>=s.offsetTop-120)cur=s.id});
 links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur))});
$('#to-top').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
// highlight today's column in the schedule
const d=new Date().getDay();
if(d>=1&&d<=5){$$('#sched tr').forEach(tr=>{const c=tr.children[d];if(c&&!tr.classList.contains('break'))c.classList.add('today')})}
// particle background
const cv=$('#bg'),cx=cv.getContext('2d');let P=[];
function size(){cv.width=innerWidth;cv.height=innerHeight;P=Array.from({length:Math.min(70,innerWidth/18)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))}
size();addEventListener('resize',size);
(function draw(){cx.clearRect(0,0,cv.width,cv.height);const col=getComputedStyle(root).getPropertyValue('--accent').trim();cx.fillStyle=col;cx.strokeStyle=col;
 P.forEach((p,i)=>{p.x=(p.x+p.vx+cv.width)%cv.width;p.y=(p.y+p.vy+cv.height)%cv.height;cx.globalAlpha=.6;cx.beginPath();cx.arc(p.x,p.y,2,0,7);cx.fill();
  for(let j=i+1;j<P.length;j++){const q=P[j],dd=Math.hypot(p.x-q.x,p.y-q.y);if(dd<120){cx.globalAlpha=.15*(1-dd/120);cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}});
 requestAnimationFrame(draw)})();

// ===== music player =====
(function(){
 const a=$('#audio'),disc=$('#disc'),pl=$('#player'),name=$('#track-name');
 const setPlaying=on=>{disc.classList.toggle('playing',on);pl.classList.toggle('on',on)};
 a.volume=.5;
 disc.addEventListener('click',()=>{
  if(a.paused){a.play().then(()=>setPlaying(true)).catch(()=>{name.textContent='Add music/song.mp3 or choose a song';pl.classList.add('open')})}
  else{a.pause();setPlaying(false)}
 });
 a.addEventListener('error',()=>{name.textContent='No song found. Choose a song ↓';pl.classList.add('open');setPlaying(false)});
 $('#panel-btn').addEventListener('click',e=>{const o=pl.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});
 $('#vol').addEventListener('input',e=>a.volume=e.target.value);
 $('#file').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  a.src=URL.createObjectURL(f);name.textContent='♪ '+f.name;
  a.play().then(()=>setPlaying(true)).catch(()=>{});
 });
})();

// ===== website preview (hover / tap on "Other Personal Creations") =====
(function(){
 const card=$('#creation-card'),box=$('#site-preview'),frame=$('#sp-frame'),screen=$('#sp-screen');
 if(!card||!box)return;
 let pinned=false,loaded=false;
 const fit=()=>{frame.style.transform='scale('+(screen.clientWidth/1280)+')'};
 const show=()=>{
  if(!loaded){frame.src=$('#creation-link').href;$('#sp-go').href=$('#creation-link').href;loaded=true}
  box.classList.add('show');box.setAttribute('aria-hidden','false');
  requestAnimationFrame(fit);setTimeout(fit,320);
 };
 const hide=()=>{pinned=false;box.classList.remove('show','pinned');box.setAttribute('aria-hidden','true')};
 let timer,suppress=false;
 const later=ms=>{clearTimeout(timer);timer=setTimeout(()=>{if(!pinned)hide()},ms)};
 const keep=()=>clearTimeout(timer);
 if(matchMedia('(hover:hover)').matches){
  card.addEventListener('mouseenter',()=>{keep();if(!suppress)show()});
  card.addEventListener('mouseleave',()=>{suppress=false;later(900)});          // time to move the mouse to the screen
  $('.sp-window',box).addEventListener('mouseenter',keep);
  $('.sp-window',box).addEventListener('mouseleave',()=>later(250));
 }
 card.addEventListener('focusin',()=>{keep();if(!pinned)show()});
 card.addEventListener('focusout',()=>{if(!pinned)later(300)});
 $('#sp-go').addEventListener('click',()=>{suppress=true;setTimeout(hide,150)});
 $('#preview-btn').addEventListener('click',()=>{pinned=true;box.classList.add('pinned');show()});
 $('#sp-close').addEventListener('click',hide);
 box.addEventListener('click',e=>{if(e.target===box&&pinned)hide()});
 addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
 addEventListener('resize',fit);
 frame.addEventListener('load',()=>{const l=$('.sp-loading');if(l)l.style.display='none'});
})();
