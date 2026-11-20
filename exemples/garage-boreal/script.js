(function(){"use strict";
  var nav=document.getElementById("nav");
  var onScroll=function(){nav.classList.toggle("solid",window.scrollY>40)};
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  // apparitions
  var els=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});
    els.forEach(function(el){io.observe(el)});
  }else{els.forEach(function(el){el.classList.add("in")})}
  // compteurs
  var fmt=function(n){return n.toLocaleString("fr-CA")};
  var counters=document.querySelectorAll("[data-count]");
  var co=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;co.unobserve(e.target);
    var el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||"",t0=null;
    var step=function(t){if(!t0)t0=t;var p=Math.min((t-t0)/1600,1),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=fmt(v)+(p===1?suf:"");if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  })},{threshold:.6});
  counters.forEach(function(c){co.observe(c)});
  // ligne des étapes
  var steps=document.getElementById("steps");
  if(steps){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){steps.style.setProperty("--fill","100%");o.disconnect()}},{threshold:.5}).observe(steps)}
  // lueur qui suit la souris sur les services
  document.querySelectorAll(".svc").forEach(function(c){
    c.addEventListener("mousemove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px")});
  });
  // formulaire de démonstration
  var f=document.getElementById("rdvForm"),note=document.getElementById("formNote");
  if(f){f.addEventListener("submit",function(e){e.preventDefault();note.hidden=false;note.scrollIntoView({behavior:"smooth",block:"nearest"})})}
})();
