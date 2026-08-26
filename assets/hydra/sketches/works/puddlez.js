// a.setScale(50)
osc(50, 0.01, 1.4)
  .rotate(0, 0.1)
  .mult(
    noise(10, 0.1, 99)
      .modulate(osc(6))
      .rotate(0, -0.1)
      .modulateScale(osc(133, 0.01, 9)),
    1,
  )
  .color(2.83, 0.91, 0.39)
  .modulateKaleid(noise(3, 0.05))
  .out(o0)
