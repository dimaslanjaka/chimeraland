<<<<<<< HEAD
const td = document.querySelectorAll('table#recipes td');
Array.from(td).forEach((el) => {
  let text = el.innerHTML;
  text = text.replace(/\sfullness/gim, ' <img src="Recipes/fullness.jpg" class="img-inline-text" title="fullness" />');
  text = text.replace(/\satk/gim, ' <img src="Recipes/attack.png" class="img-inline-text atk" title="attack" />');
  text = text.replace(/\sdef/gim, ' <img src="Recipes/defense.png" class="img-inline-text def" title="defense" />');
  el.innerHTML = text;
});
=======
const e=document.querySelectorAll("table#recipes td");Array.from(e).forEach((e=>{let s=e.innerHTML;s=s.replace(/\sfullness/gim,' <img src="Recipes/fullness.jpg" class="img-inline-text" title="fullness" />'),s=s.replace(/\satk/gim,' <img src="Recipes/attack.png" class="img-inline-text atk" title="attack" />'),s=s.replace(/\sdef/gim,' <img src="Recipes/defense.png" class="img-inline-text def" title="defense" />'),e.innerHTML=s}));
>>>>>>> f80d5e979bfda4712e2d2d91a27313bc3c366ac9
