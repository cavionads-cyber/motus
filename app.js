'use strict';
const dialog=document.querySelector('#info-dialog');
function showInfo(title,copy='Ta sekcja nie jest jeszcze dostępna.') {dialog.querySelector('h2').textContent=title;dialog.querySelector('.dialog-copy').textContent=copy;if(!dialog.open)dialog.showModal();}
document.querySelectorAll('[data-links]').forEach(group=>{group.dataset.links.split('|').forEach(label=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.demo=label;group.append(b);});});
document.addEventListener('click',e=>{const item=e.target.closest('[data-demo],[data-category]');if(item){e.preventDefault();showInfo(item.dataset.demo||item.dataset.category);}if(e.target.closest('.close,.dialog-ok'))dialog.close();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();const input=e.currentTarget.querySelector('input'),term=input.value.trim();if(term.length<2){input.setAttribute('aria-invalid','true');showInfo('Wpisz co najmniej 2 znaki','Podaj nazwę modelu lub kategorię, np. Scooty albo Fitness.');return;}input.removeAttribute('aria-invalid');showInfo('Wyszukiwanie: '+term,'Wyszukiwanie jest obecnie niedostępne. Spróbuj ponownie później.');});
document.querySelectorAll('.newsletter').forEach(form=>{const email=form.querySelector('[type=email]'),consent=form.querySelector('[type=checkbox]'),status=form.querySelector('.form-status');form.addEventListener('submit',e=>{e.preventDefault();status.className='form-status';email.value=email.value.trim();email.removeAttribute('aria-invalid');consent.removeAttribute('aria-invalid');if(!email.value||!email.validity.valid){status.textContent='Podaj poprawny adres e-mail, np. anna@example.com.';status.classList.add('error');email.setAttribute('aria-invalid','true');email.focus();return;}if(!consent.checked){status.textContent='Zaznacz zgodę, aby przejść dalej.';status.classList.add('error');consent.setAttribute('aria-invalid','true');consent.focus();return;}status.classList.add('error');status.textContent='Zapis jest obecnie niedostępny. Spróbuj ponownie później.';});form.addEventListener('input',e=>e.target.removeAttribute('aria-invalid'));});
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{if(img.dataset.failed)return;img.dataset.failed='true';const fallback=document.createElement('span');fallback.className='image-error';fallback.textContent='Nie udało się wczytać grafiki. Sprawdź plik: '+img.getAttribute('src');fallback.style.cssText='display:grid;place-items:center;min-height:80px;width:100%;height:100%;padding:25px;background:#d9e9e9;color:#253c3c;font-size:14px';img.replaceWith(fallback);}));

// AI disclosure: tap toggles on mobile; any outside click closes it.
(()=>{
 const badges=[...document.querySelectorAll('.ai')];
 const mobile=matchMedia('(max-width:600px)');
 const hover=matchMedia('(hover:hover) and (pointer:fine)');
 function setOpen(badge,open){badge.classList.toggle('is-open',open);badge.setAttribute('aria-expanded',String(open));badge.closest('.tile').classList.toggle('ai-expanded',open);}
 function closeAll(except){badges.forEach(b=>{if(b!==except)setOpen(b,false);});}
 badges.forEach(badge=>{
  badge.addEventListener('mouseenter',()=>{if(!mobile.matches&&hover.matches){closeAll(badge);setOpen(badge,true);}});
  badge.addEventListener('mouseleave',()=>{if(!mobile.matches&&hover.matches&&!badge.matches(':focus-visible'))setOpen(badge,false);});
  badge.addEventListener('focus',()=>{if(!mobile.matches&&badge.matches(':focus-visible')){closeAll(badge);setOpen(badge,true);}});
  badge.addEventListener('blur',()=>setOpen(badge,false));
 });
 document.addEventListener('click',event=>{
  const badge=event.target.closest('.ai');
  if(!badge){closeAll();return;}
  const open=!badge.classList.contains('is-open');closeAll(badge);setOpen(badge,open);
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeAll();});
 mobile.addEventListener('change',()=>closeAll());
})();

// Information strip: automatic rotation, arrows, pause on hover/focus.
(()=>{
 const strip=document.querySelector('.top-strip'),message=strip.querySelector('.strip-message');
 const slides=[
  ['PREMIERA bieżni i walking padów MOTUS','<path d="M3 17h18M5 17V8l4 4h10l2 5M9 12V6"/>'],
  ['Zamów do 13:00, odbierz jutro','<path d="M2 5h12v12H2zM14 10h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>'],
  ['Darmowa dostawa od 250 zł','<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M7 4l10 6"/>'],
  ['Ponad 20 punktów serwisowych','<path d="M21 3a6 6 0 0 1-8 8L5 21l-3-3 10-8a6 6 0 0 1 8-8l-4 4 2 2 4-4"/>']
 ];
 let index=0,timer;
 function render(){message.querySelector('.strip-text').textContent=slides[index][0];message.querySelector('.strip-icon').innerHTML='<svg viewBox="0 0 24 24">'+slides[index][1]+'</svg>';message.classList.toggle('is-premiere',index===0);message.classList.remove('is-changing');void message.offsetWidth;message.classList.add('is-changing');}
 function stop(){clearInterval(timer);}
 function start(){stop();if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.hidden&&!strip.matches(':hover,:focus-within'))timer=setInterval(()=>{index=(index+1)%slides.length;render();},4500);}
 strip.querySelector('.strip-prev').addEventListener('click',()=>{index=(index+slides.length-1)%slides.length;render();start();});
 strip.querySelector('.strip-next').addEventListener('click',()=>{index=(index+1)%slides.length;render();start();});
 strip.addEventListener('mouseenter',stop);strip.addEventListener('mouseleave',start);strip.addEventListener('focusin',stop);strip.addEventListener('focusout',()=>requestAnimationFrame(start));document.addEventListener('visibilitychange',start);window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',start);
 render();start();
})();

// Responsive navigation: keyboard support, backdrop and desktop reset.
(()=>{
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav'),backdrop=document.querySelector('.menu-backdrop'),mobile=matchMedia('(max-width:1024px)');
 function setOpen(open,restoreFocus=false){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu');nav.classList.toggle('is-open',open);backdrop.hidden=!open;document.body.classList.toggle('menu-open',open);if(restoreFocus)toggle.focus();}
 toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
 backdrop.addEventListener('click',()=>setOpen(false,true));
 nav.addEventListener('click',event=>{if(event.target.closest('button'))setOpen(false);});
 document.addEventListener('keydown',event=>{if(toggle.getAttribute('aria-expanded')!=='true')return;if(event.key==='Escape'){setOpen(false,true);return;}if(event.key==='Tab'){const elements=[toggle,...document.querySelectorAll('header a,header input,header button:not(.menu-toggle)')].filter(el=>el.getClientRects().length);const first=elements[0],last=elements[elements.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
 mobile.addEventListener('change',()=>setOpen(false));
})();

// Clear obsolete feedback as the visitor corrects a form.
document.querySelectorAll('.newsletter').forEach(form=>{
 const status=form.querySelector('.form-status');
 form.addEventListener('input',()=>{status.textContent='';status.className='form-status';});
 form.querySelectorAll('[type=email],[type=checkbox]').forEach(field=>{const current=field.getAttribute('aria-describedby')||'';if(status.id&&!current.split(' ').includes(status.id))field.setAttribute('aria-describedby',(current+' '+status.id).trim());});
});

// Sticky header: hysteresis prevents flicker near the top of the page.
(()=>{
 const header=document.querySelector('header');let scheduled=false,compact=false;
 function update(){const y=window.scrollY;const next=compact?y>30:y>100;if(next!==compact){compact=next;header.classList.toggle('is-scrolled',compact);}scheduled=false;}
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
 window.addEventListener('pageshow',update);update();
})();

// Mobile-only Longevity slideshow. Source files are supplied separately.
(()=>{
 const tile=document.querySelector('.longevity-carousel');if(!tile)return;
 const media=matchMedia('(max-width:600px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const paths=['assets/fitness-mobile_1.jpg','assets/fitness-mobile_2.jpg','assets/fitness-mobile_3.jpg'];
 let slides,controls,images=[],dots=[],active=-1,timer=null,paused=false,visible=true,initialized=false;
 function stop(){clearInterval(timer);timer=null;}
 function ready(){return images.map((img,i)=>img.dataset.ready==='true'?i:-1).filter(i=>i>=0);}
 function start(){stop();if(media.matches&&!reduced.matches&&!paused&&visible&&!document.hidden&&ready().length>1)timer=setInterval(next,4500);}
 function select(index){if(images[index]?.dataset.ready!=='true')return;active=index;images.forEach((img,i)=>img.classList.toggle('is-current',i===index));dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));}
 function next(){const available=ready();if(available.length<2)return;select(available[(available.indexOf(active)+1)%available.length]);}
 function init(){if(initialized)return;initialized=true;
  slides=document.createElement('div');slides.className='longevity-slides';slides.setAttribute('aria-hidden','true');tile.append(slides);
  controls=document.createElement('div');controls.className='longevity-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Zdjęcia Longevity');tile.append(controls);
  paths.forEach((path,index)=>{
   const img=new Image();img.alt='';img.width=1080;img.height=1350;images.push(img);slides.append(img);
   const dot=document.createElement('button');dot.type='button';dot.className='longevity-dot';dot.setAttribute('aria-label','Pokaż zdjęcie '+(index+1));dot.setAttribute('aria-pressed','false');dot.disabled=true;dots.push(dot);controls.append(dot);
   dot.addEventListener('click',()=>{select(index);start();});
   img.onload=()=>{img.dataset.ready='true';dot.disabled=false;if(active<0||index===0)select(index);start();};
   img.onerror=()=>{dot.hidden=true;dot.disabled=true;img.dataset.ready='false';if(active===index){const available=ready();if(available.length)select(available[0]);}start();};img.src=path;
  });
  const pause=document.createElement('button');pause.type='button';pause.className='longevity-pause';pause.textContent='Ⅱ';pause.setAttribute('aria-label','Wstrzymaj rotację zdjęć');controls.append(pause);
  pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Wznów rotację zdjęć':'Wstrzymaj rotację zdjęć');start();});
  controls.addEventListener('focusin',stop);controls.addEventListener('focusout',()=>requestAnimationFrame(start));
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start();},{threshold:.15}).observe(tile);
 }
 function sync(){if(media.matches)init();start();}
 media.addEventListener('change',sync);reduced.addEventListener('change',start);document.addEventListener('visibilitychange',start);sync();
})();
