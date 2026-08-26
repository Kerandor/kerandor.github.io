function rnd_btw(min, max) {return fxrand() * (max - min) + min;}
function rnd_btwexp(min, max) {return fxrand()**2 * (max - min) + min;}
function rnd_int(min, max) {min = Math.ceil(min);max = Math.floor(max);return Math.floor(fxrand() * (max - min + 1)) + min;}


v1 = rnd_int(1,20);
k1 = rnd_btwexp(1,30);
n1 = rnd_int(2,5);


src(o0)
  .modulate(osc(9,0,2.5).modulate(noise(10)
                                  .diff(shape(3)),3).brightness(-1.5),0.003)
  .layer(osc(Math.PI*8,0.1,2)
         .mask(voronoi(v1,0.1,0.02))).modulateRotate(noise(n1,.06)).kaleid(k1).colorama(0.00001).hue(0.003).out()