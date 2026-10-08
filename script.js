document.documentElement.classList.add('js');
const root=document.documentElement;
const themeBtn=document.getElementById('themeToggle');
const saved=localStorage.getItem('portfolio-theme');
if(saved) root.dataset.theme=saved;
themeBtn.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;localStorage.setItem('portfolio-theme',next);});
document.getElementById('year').textContent=new Date().getFullYear();

// Reveal on scroll
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%5,4)*70}ms`;io.observe(el)});

// Mouse glow
const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

// Light 3D tilt
if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1100px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-2px)`});
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

// Vanilla canvas 3D point orb (no external dependency)
const canvas=document.getElementById('orbCanvas');
const ctx=canvas.getContext('2d');
let W=0,H=0,dpr=Math.min(devicePixelRatio||1,2),mouseX=0,mouseY=0,pts=[];
function makePts(){pts=[];const count=window.innerWidth<720?150:260;for(let i=0;i<count;i++){const u=Math.random()*2-1,a=Math.random()*Math.PI*2,r=.63+Math.random()*.37;const s=Math.sqrt(1-u*u);pts.push({x:r*s*Math.cos(a),y:r*u,z:r*s*Math.sin(a),o:.28+Math.random()*.72,size:.7+Math.random()*1.8})}}
function resize(){const r=canvas.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);makePts()}new ResizeObserver(resize).observe(canvas);
window.addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5)});
let t=0;function draw(){t+=.0035;ctx.clearRect(0,0,W,H);const theme=root.dataset.theme;const ink=theme==='dark'?'244,241,234':'17,18,25';const cx=W*.52,cy=H*.5,scale=Math.min(W,H)*.36;
  const ay=t+mouseX*.35,ax=-.25+mouseY*.22,ca=Math.cos(ay),sa=Math.sin(ay),cxr=Math.cos(ax),sxr=Math.sin(ax);
  const proj=[];for(const p of pts){let x=p.x*ca-p.z*sa,z=p.x*sa+p.z*ca,y=p.y;let y2=y*cxr-z*sxr,z2=y*sxr+z*cxr;const depth=2.8+z2;const k=2.45/depth;proj.push({x:cx+x*scale*k,y:cy+y2*scale*k,z:z2,o:p.o,size:p.size*k});}
  proj.sort((a,b)=>a.z-b.z);for(const p of proj){const alpha=(.2+(p.z+1)*.18)*p.o;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.6,p.size),0,Math.PI*2);ctx.fillStyle=`rgba(${ink},${Math.max(.08,alpha)})`;ctx.fill();}
  ctx.beginPath();ctx.arc(cx,cy,scale*.98,0,Math.PI*2);const g=ctx.createRadialGradient(cx-scale*.25,cy-scale*.3,scale*.05,cx,cy,scale);g.addColorStop(0,'rgba(118,232,255,.19)');g.addColorStop(.48,'rgba(46,91,255,.10)');g.addColorStop(1,'rgba(46,91,255,0)');ctx.fillStyle=g;ctx.fill();requestAnimationFrame(draw)}resize();draw();
