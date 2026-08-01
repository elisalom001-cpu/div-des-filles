const intro=document.getElementById('intro'),site=document.getElementById('site'),env=document.getElementById('openInvitation');
function petals(){const wrap=document.getElementById('petals');for(let i=0;i<18;i++){const p=document.createElement('span');p.className='petal';p.textContent=i%3===0?'✿':'❀';p.style.left=Math.random()*100+'vw';p.style.animationDuration=(7+Math.random()*9)+'s';p.style.animationDelay=(-Math.random()*14)+'s';p.style.setProperty('--drift',(Math.random()*140-70)+'px');p.style.fontSize=(10+Math.random()*18)+'px';p.style.color=i%2?'#bd7f88':'#d4a768';wrap.appendChild(p)}}petals();
let audioCtx,playing=false,interval;function tone(freq,start,dur){const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(.035,start+.08);g.gain.exponentialRampToValueAtTime(.0001,start+dur);o.connect(g).connect(audioCtx.destination);o.start(start);o.stop(start+dur+.05)}function phrase(){if(!audioCtx)return;const t=audioCtx.currentTime+.05;[261.6,329.6,392,523.2,392,329.6].forEach((f,i)=>tone(f,t+i*.45,.9))}async function toggleMusic(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')await audioCtx.resume();playing=!playing;document.getElementById('music').textContent=playing?'♫':'♪';if(playing){phrase();interval=setInterval(phrase,4200)}else clearInterval(interval)}document.getElementById('music').onclick=toggleMusic;
env.onclick=()=>{env.classList.add('open');if(!playing)toggleMusic();setTimeout(()=>{intro.style.display='none';site.hidden=false;window.scrollTo(0,0)},1450)};
const eventDate=new Date('2026-09-13T18:00:00-04:00');function tick(){let d=Math.max(0,eventDate-new Date());const vals=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];['days','hours','minutes','seconds'].forEach((id,i)=>{const value=String(vals[i]).padStart(2,'0');document.getElementById(id).textContent=value;document.getElementById('dock-'+id).textContent=value})}tick();setInterval(tick,1000);
document.getElementById('calendar').onclick=()=>{const data=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','DTSTART:20260913T220000Z','DTEND:20260914T010000Z','SUMMARY:A Vintage Tea Affair','LOCATION:3325 Lowry Rd, Indianapolis, IN 46222','DESCRIPTION:Une soirée pour célébrer la grâce, l’amitié et la foi. Admission: 30 $.','END:VEVENT','END:VCALENDAR'].join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'text/calendar'}));a.download='a-vintage-tea-affair.ics';a.click();URL.revokeObjectURL(a.href)};
document.getElementById('contactBtn').onclick=()=>{document.getElementById('rsvpForm').scrollIntoView({behavior:'smooth'});document.getElementById('name').focus()};
function showConfirm(text){const c=document.getElementById('confirmation');c.hidden=false;c.innerHTML=text;document.getElementById('rsvpForm').hidden=true;c.scrollIntoView({behavior:'smooth',block:'center'})}
document.getElementById('rsvpForm').onsubmit=async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const submit=form.querySelector('button[type="submit"]');
  const name=document.getElementById('name').value.trim();
  submit.disabled=true;
  submit.textContent='Envoi en cours…';
  try{
    const response=await fetch('https://formsubmit.co/ajax/berlielector27@gmail.com',{
      method:'POST',
      headers:{'Accept':'application/json'},
      body:new FormData(form)
    });
    if(!response.ok)throw new Error('Envoi impossible');
    localStorage.setItem('teaRSVP',JSON.stringify({answer:'Oui',name,phone:phone.value,guests:guests.value,message:message.value,date:new Date().toISOString()}));
    showConfirm(`Merci, ${name || 'cher invité'} !<br><small>Votre demande a été envoyée à la Division des Filles. Elle vous contactera au sujet de vos billets.</small>`);
  }catch(error){
    submit.disabled=false;
    submit.textContent='Oui, j’y serai';
    alert('La demande n’a pas pu être envoyée. Vérifiez votre connexion et réessayez.');
  }
};
document.getElementById('decline').onclick=()=>{localStorage.setItem('teaRSVP',JSON.stringify({answer:'Non',date:new Date().toISOString()}));showConfirm('Merci de nous avoir répondu.<br><small>Vous nous manquerez lors de cette belle soirée.</small>')};
document.getElementById('share').onclick=async()=>{const data={title:'A Vintage Tea Affair',text:'Vous êtes invité(e) à A Vintage Tea Affair — dimanche 13 septembre 2026 à 18 h.',url:location.href};if(navigator.share){try{await navigator.share(data)}catch(e){}}else{await navigator.clipboard.writeText(location.href);alert('Le lien a été copié.')}};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
