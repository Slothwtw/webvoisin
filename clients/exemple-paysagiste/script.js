(function(){"use strict";
  var nav=document.getElementById("nav");
  var onScroll=function(){nav.classList.toggle("solid",window.scrollY>40)};
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  var els=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
    var co=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;co.unobserve(e.target);
      var el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||"",t0=null;
      var step=function(t){if(!t0)t0=t;var p=Math.min((t-t0)/1600,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+(p===1?suf:"");if(p<1)requestAnimationFrame(step)};
      requestAnimationFrame(step);
    })},{threshold:.5});
    document.querySelectorAll("[data-count]").forEach(function(c){co.observe(c)});
  }else{els.forEach(function(el){el.classList.add("in")})}
  var tabs=document.querySelectorAll(".tabs button"),panes=document.querySelectorAll(".pane");
  tabs.forEach(function(b){b.addEventListener("click",function(){
    tabs.forEach(function(t){t.setAttribute("aria-selected","false")});b.setAttribute("aria-selected","true");
    panes.forEach(function(p,i){p.classList.toggle("on",i===+b.dataset.s)});
  })});
  var m=new Date().getMonth(),s=m<2||m===11?3:m<5?0:m<8?1:2;if(tabs[s])tabs[s].click();
  var strip=document.getElementById("strip"),down=false,x0=0,s0=0;
  if(strip){
    strip.addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse")return;down=true;x0=e.clientX;s0=strip.scrollLeft;strip.classList.add("drag")});
    window.addEventListener("pointerup",function(){down=false;strip.classList.remove("drag")});
    strip.addEventListener("pointermove",function(e){if(down)strip.scrollLeft=s0-(e.clientX-x0)});
  }
  var f=document.getElementById("rdvForm"),note=document.getElementById("formNote");
  if(f){f.addEventListener("submit",function(e){e.preventDefault();note.hidden=false})}
})();
