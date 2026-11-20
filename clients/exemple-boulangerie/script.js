(function(){"use strict";
  var nav=document.getElementById("nav");
  var onScroll=function(){nav.classList.toggle("solid",window.scrollY>30)};
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  var els=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
  }else{els.forEach(function(el){el.classList.add("in")})}
  var tabs=document.querySelectorAll(".tabs button"),sets=document.querySelectorAll(".set");
  tabs.forEach(function(b){b.addEventListener("click",function(){
    tabs.forEach(function(t){t.setAttribute("aria-selected","false")});b.setAttribute("aria-selected","true");
    sets.forEach(function(s,i){s.classList.toggle("on",i===+b.dataset.t)});
  })});
  // ouvert maintenant ? (heure du Québec)
  var H={0:[7,15],1:null,2:[6.5,18],3:[6.5,18],4:[6.5,18],5:[6.5,19],6:[7,17]};
  var now=new Date(new Date().toLocaleString("en-US",{timeZone:"America/Toronto"}));
  var d=now.getDay(),h=now.getHours()+now.getMinutes()/60,r=H[d],open=!!(r&&h>=r[0]&&h<r[1]);
  var o=document.getElementById("openNow");
  if(o){o.classList.add(open?"yes":"no");o.lastElementChild.textContent=open?"Ouvert maintenant":"Fermé pour l'instant"}
  var row=document.querySelector('#hours tr[data-d="'+d+'"]');if(row)row.classList.add("today");
  var f=document.getElementById("rdvForm"),note=document.getElementById("formNote");
  if(f){f.addEventListener("submit",function(e){e.preventDefault();note.hidden=false})}
})();
