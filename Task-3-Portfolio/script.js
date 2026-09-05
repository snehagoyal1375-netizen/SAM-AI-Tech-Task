const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));

document.querySelectorAll('nav a').forEach(link=>{
  link.addEventListener('click',()=>nav.classList.remove('open'));
});

const topBtn=document.getElementById('topBtn');
window.addEventListener('scroll',()=>{
  topBtn.style.display=window.scrollY>400?'block':'none';
});
topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',e=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
  });
});
