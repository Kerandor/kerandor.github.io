// Voronoi Bloom - the patch that ran inline on the original hydra page, kept as-is.
osc(100, 0.26, 1.8).modulate(noise(0.84).modulateScale(osc(10))).out(o0)

voronoi(25, 1.0).modulateRotate(noise(0.1)).modulate(src(o0).blend(src(o1))).colorama(0.77).out(o1)
render(o1)
speed = 0.5
