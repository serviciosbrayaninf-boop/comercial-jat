// ===== HERO CARRUSEL =====
(function(){
  var slides=document.querySelectorAll('.hero-slide');
  var dotsContainer=document.getElementById('hero-dots');
  var current=0,timer=null,total=slides.length;
  for(var i=0;i<total;i++){
    var dot=document.createElement('button');
    dot.className='hero-dot'+(i===0?' active':'');
    dot.setAttribute('aria-label','Slide '+(i+1));
    (function(idx){dot.addEventListener('click',function(){goTo(idx);resetTimer();});})(i);
    dotsContainer.appendChild(dot);
  }
  var dots=dotsContainer.querySelectorAll('.hero-dot');
  function goTo(idx){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current=(idx+total)%total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    var hc=slides[current].querySelector('.hero-content');
    if(hc){hc.classList.remove('text-in');void hc.offsetWidth;hc.classList.add('text-in');}
  }
  function next(){goTo(current+1);}
  // Carrusel principal más lento: antes 5500ms, ahora 4000ms
  function startTimer(){timer=setInterval(next,4000);}
  function resetTimer(){clearInterval(timer);startTimer();}
  document.getElementById('hero-next').addEventListener('click',function(){next();resetTimer();});
  document.getElementById('hero-prev').addEventListener('click',function(){goTo(current-1);resetTimer();});
  var heroEl=document.querySelector('.hero');
  heroEl.addEventListener('mouseenter',function(){clearInterval(timer);});
  heroEl.addEventListener('mouseleave',function(){startTimer();});
  var firstHc=slides[0].querySelector('.hero-content');
  if(firstHc)firstHc.classList.add('text-in');
  startTimer();
})();
// ===== GALERÍA NUESTRO TALLER (con arrastre / drag) =====
(function(){
  var track=document.getElementById('gallery-track');
  if(!track) return;
  var gDotsContainer=document.getElementById('gallery-dots');
  var slidesCount=track.children.length;
  var gCurrent=0;
  var autoTimer=null;

  function getPerView(){return window.innerWidth>900?3:(window.innerWidth>560?2:1);}
  function getMaxIdx(){return Math.max(0,slidesCount-getPerView());}
  function getSlideW(){return track.children[0].offsetWidth+24;}

  function updateGallery(){
    var slideW=getSlideW();
    track.style.transform='translateX(-'+(gCurrent*slideW)+'px)';
    var gd=gDotsContainer.querySelectorAll('.g-dot');
    for(var i=0;i<gd.length;i++)gd[i].classList.toggle('active',i===gCurrent);
  }
  function buildDots(){
    gDotsContainer.innerHTML='';
    var maxIdx=getMaxIdx();
    for(var i=0;i<=maxIdx;i++){
      var gd=document.createElement('button');
      gd.className='g-dot'+(i===0?' active':'');
      (function(idx){gd.addEventListener('click',function(){gCurrent=idx;updateGallery();});})(i);
      gDotsContainer.appendChild(gd);
    }
  }
  buildDots();

  // Auto-avance (se pausa al arrastrar)
  function startAuto(){autoTimer=setInterval(function(){gCurrent=(gCurrent+1)%(getMaxIdx()+1);updateGallery();},5000);}
  function stopAuto(){clearInterval(autoTimer);}
  startAuto();
  // Flechas prev/next de la galeria
  var gPrev=document.getElementById("gallery-prev");
  var gNext=document.getElementById("gallery-next");
  function gTotal(){return getMaxIdx()+1;}
  if(gPrev)gPrev.addEventListener("click",function(){gCurrent=(gCurrent-1+gTotal())%gTotal();updateGallery();stopAuto();startAuto();});
  if(gNext)gNext.addEventListener("click",function(){gCurrent=(gCurrent+1)%gTotal();updateGallery();stopAuto();startAuto();});

  // ===== Arrastre con mouse y touch =====
  var isDown=false, startX=0, startTranslate=0, currentTranslate=0, dragged=false;

  function getTranslateX(){
    var m=track.style.transform.match(/translateX\((-?[\d.]+)px\)/);
    return m?parseFloat(m[1]):0;
  }
  function onStart(clientX){
    isDown=true;
    dragged=false;
    startX=clientX;
    startTranslate=getTranslateX();
    currentTranslate=startTranslate;
    track.style.transition='none';
    track.classList.add('dragging');
    stopAuto();
  }
  function onMove(clientX){
    if(!isDown) return;
    var dx=clientX-startX;
    if(Math.abs(dx)>5) dragged=true;
    currentTranslate=startTranslate+dx;
    // Pequeña resistencia en los bordes
    var maxShift=gCurrent*getSlideW();
    var minShift=-(getMaxIdx()-gCurrent)*getSlideW();
    if(currentTranslate>maxShift) currentTranslate=maxShift+(currentTranslate-maxShift)*0.35;
    if(currentTranslate< -getMaxIdx()*getSlideW()){
      var edge=-getMaxIdx()*getSlideW();
      currentTranslate=edge+(currentTranslate-edge)*0.35;
    }
    track.style.transform='translateX('+currentTranslate+'px)';
  }
  function onEnd(){
    if(!isDown) return;
    isDown=false;
    track.classList.remove('dragging');
    track.style.transition='';
    var slideW=getSlideW();
    var idx=Math.round(-currentTranslate/slideW);
    idx=Math.max(0,Math.min(idx,getMaxIdx()));
    gCurrent=idx;
    updateGallery();
    startAuto();
  }

  // Mouse
  track.addEventListener('mousedown',function(e){e.preventDefault();onStart(e.clientX);});
  window.addEventListener('mousemove',function(e){onMove(e.clientX);});
  window.addEventListener('mouseup',onEnd);
  window.addEventListener('mouseleave',function(){if(isDown)onEnd();});
  // Evitar arrastre fantasma de imágenes
  track.addEventListener('dragstart',function(e){e.preventDefault();});
  // Touch (móvil)
  track.addEventListener('touchstart',function(e){onStart(e.touches[0].clientX);},{passive:true});
  track.addEventListener('touchmove',function(e){onMove(e.touches[0].clientX);},{passive:true});
  track.addEventListener('touchend',onEnd);

  window.addEventListener('resize',function(){
    var maxIdx=getMaxIdx();
    if(gCurrent>maxIdx)gCurrent=0;
    buildDots();updateGallery();
  });
})();
// ===== MENÚ MÓVIL =====
(function(){
  var ham=document.getElementById('hamburger-btn');
  var mnav=document.getElementById('mobile-nav');
  if(!ham||!mnav) return;
  ham.addEventListener('click',function(){mnav.classList.toggle('open');});
  var mlinks=mnav.querySelectorAll('.nav-link');
  for(var i=0;i<mlinks.length;i++)mlinks[i].addEventListener('click',function(){mnav.classList.remove('open');});
})();
// ===== HEADER SCROLL =====
(function(){
  var header=document.getElementById('header');
  if(!header) return;
  window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>20);});
})();
// ===== NAV ACTIVE HIGHLIGHT =====
(function(){
  var sections=document.querySelectorAll('section[id], footer[id]');
  var navLinks=document.querySelectorAll('.nav-link');
  window.addEventListener('scroll',function(){
    var pos=window.scrollY+120,id='';
    for(var i=0;i<sections.length;i++)if(sections[i].offsetTop<=pos)id=sections[i].id;
    for(var j=0;j<navLinks.length;j++)navLinks[j].classList.toggle('active',navLinks[j].getAttribute('href')==='#'+id);
  });
})();
// ===== FADE-UP ANIMATIONS =====
(function(){
  var fadeEls=document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++){
        if(entries[i].isIntersecting){entries[i].target.classList.add('active');obs.unobserve(entries[i].target);}
      }
    },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
    for(var i=0;i<fadeEls.length;i++)obs.observe(fadeEls[i]);
  }else{
    for(var i=0;i<fadeEls.length;i++)fadeEls[i].classList.add('active');
  }
})();
// ===== CTA BOTONES: Efecto táctil =====
document.addEventListener('DOMContentLoaded', function(){
  var btns = document.querySelectorAll('.btn-cta');
  for(var i = 0; i < btns.length; i++){
    (function(b){
      b.addEventListener('touchstart', function(){
        b.classList.add('touch');
      }, { passive: true });
      b.addEventListener('touchend', function(){
        setTimeout(function(){
          b.classList.remove('touch');
        }, 800); /* Tiempo igual que la animación */
      });
    })(btns[i]);
  }
});
// ============================================================
// ===== CONTADORES ANIMADOS (Sobre Nosotros: 100%, +10) ======
// ============================================================
(function(){
  function initCounters(){
    var nums = document.querySelectorAll('.stat-num');
    if(!nums.length) return;
    function animateNum(el){
      var raw = el.textContent.trim();
      var match = raw.match(/^(\D*)(\d+)(\D*)$/);
      if(!match){ el.dataset.done = '1'; return; } // texto sin número (ej: "Maule")
      var prefix = match[1], target = parseInt(match[2], 10), suffix = match[3];
      var dur = 1890, start = null;
      function step(ts){
        if(!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = prefix + Math.round(eased * target) + suffix;
        if(p < 1) requestAnimationFrame(step);
      }
      el.textContent = prefix + '0' + suffix;
      requestAnimationFrame(step);
    }
    if(!('IntersectionObserver' in window)){
      for(var i = 0; i < nums.length; i++) animateNum(nums[i]);
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      for(var e = 0; e < entries.length; e++){
        if(entries[e].isIntersecting && !entries[e].target.dataset.done){
          entries[e].target.dataset.done = '1';
          animateNum(entries[e].target);
          obs.unobserve(entries[e].target);
        }
      }
    }, { threshold: 0.5 });
    for(var n = 0; n < nums.length; n++) obs.observe(nums[n]);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();

// ====================================== */
// ===== EFECTO TÁCTIL BOTONES CTA ===== */
// ====================================== */
document.addEventListener('DOMContentLoaded', function(){
  var btns = document.querySelectorAll('.btn-cta');
  
  for(var i = 0; i < btns.length; i++){
    (function(b){
      // Al tocar el botón en celular
      b.addEventListener('touchstart', function(){
        b.classList.add('touch');
      }, { passive: true });
      
      // Al soltar el dedo
      b.addEventListener('touchend', function(){
        setTimeout(function(){
          b.classList.remove('touch');
        }, 800);
      });
    })(btns[i]);
  }
});
