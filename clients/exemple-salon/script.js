(function(){"use strict";
  var nav=document.getElementById("nav");
  var onScroll=function(){nav.classList.toggle("solid",window.scrollY>30)};
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  var els=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
    var co=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;co.unobserve(e.target);
      var el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||"",t0=null;
      var step=function(t){if(!t0)t0=t;var p=Math.min((t-t0)/1500,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+(p===1?suf:"");if(p<1)requestAnimationFrame(step)};
      requestAnimationFrame(step);
    })},{threshold:.6});
    document.querySelectorAll("[data-count]").forEach(function(c){co.observe(c)});
  }else{els.forEach(function(el){el.classList.add("in")})}
  var qs=document.querySelectorAll(".q"),ds=document.querySelectorAll("#dots button"),cur=0,timer;
  var show=function(n){qs[cur].classList.remove("on");ds[cur].classList.remove("on");cur=n;qs[cur].classList.add("on");ds[cur].classList.add("on")};
  var auto=function(){clearInterval(timer);timer=setInterval(function(){show((cur+1)%qs.length)},5500)};
  ds.forEach(function(d,i){d.addEventListener("click",function(){show(i);auto()})});auto();
  var f=document.getElementById("rdvForm"),note=document.getElementById("formNote");
  if(f){f.addEventListener("submit",function(e){e.preventDefault();note.hidden=false})}
})();
