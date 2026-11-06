(function(){
const modes=['auto','wide','classic'];let mode='auto';
try{mode=localStorage.getItem('bendeguz-aspect')||'auto'}catch{}
if(!modes.includes(mode))mode='auto';
const button=document.createElement('button');button.id='aspect-choice';button.setAttribute('aria-label','Képarány módosítása');
document.querySelector('.masthead nav').insertBefore(button,document.querySelector('#fullscreen'));
function apply(){const classic=mode==='classic'||(mode==='auto'&&innerWidth/innerHeight<1.5);document.documentElement.dataset.projectionAspect=classic?'classic':'wide';button.textContent=mode==='auto'?'Auto · '+(classic?'4:3':'16:9'):classic?'4:3':'16:9';button.title='Képarány: kattintással váltás az automatikus, 16:9 és 4:3 mód között';window.dispatchEvent(new Event('bendeguz-aspect'));}
button.onclick=()=>{mode=modes[(modes.indexOf(mode)+1)%modes.length];try{localStorage.setItem('bendeguz-aspect',mode)}catch{}apply();};
window.addEventListener('resize',apply);document.addEventListener('fullscreenchange',apply);window.addEventListener('bendeguz-aspect',()=>requestAnimationFrame(()=>{if(typeof positionTongue==='function')positionTongue()}));apply();
})();
