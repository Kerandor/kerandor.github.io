e = () =>osc(7,0.05).modulate(noise(2), 0.53).diff(o0).modulateScrollY(osc(2).modulate(voronoi(5,0.2).rotate(), 0.42))

osc(1).modulateKaleid(e()).color(2,1.5,1).colorama(0.0004).scale(.5).out(o0)