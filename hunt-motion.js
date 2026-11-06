window.BendeguzHunt={async play(stage){
const image=stage.querySelector('.mascot');await BendeguzPoses.ready(image);if(!stage.isConnected)return;
positionTongue();stage.classList.add('js-hunt');
const line=stage.querySelector('.tongue-line line'),tip=stage.querySelector('.tongue-tip'),prey=stage.querySelector('.hunt-prey');
const mouth=Number(line.getAttribute('x1')),target=Number(line.getAttribute('x2')),y=Number(line.getAttribute('y1'));
let start=null,last=null;const duration=4000;
function frame(now){if(!stage.isConnected)return;if(start===null)start=now;if(last!==null&&stage.classList.contains('paused'))start+=now-last;last=now;const elapsed=now-start;let extension=0;
if(elapsed<600)extension=0;else if(elapsed<1400)extension=(elapsed-600)/800;else if(elapsed<2400)extension=1;else extension=Math.max(0,1-(elapsed-2400)/1200);
const caught=elapsed>=2400,ended=elapsed>=3600,current=mouth+(target-mouth)*extension;
line.setAttribute('x2',current);line.style.strokeDashoffset='0';line.style.opacity=elapsed>=600&&!ended?'1':'0';
tip.setAttribute('cx',current);tip.setAttribute('cy',y);tip.style.opacity=elapsed>=600&&!ended?'1':'0';
prey.style.left=(caught?current:target)+'px';prey.style.top=y+'px';prey.style.transform='translate(-50%,-56%)';prey.style.opacity=ended?'0':'1';
if(elapsed<duration)requestAnimationFrame(frame);
}requestAnimationFrame(frame);
}};
