## The experiment

The Lorenz system is a compact model originally derived from simplified fluid convection. Its three variables evolve deterministically, yet nearby states can diverge sharply. The canvas projects $x$ horizontally and $z$ vertically; the third variable $y$ influences the motion but is not shown as depth.

Change $\rho$ first. At low values the state settles toward a stable point. Near the default, the trajectory traces the familiar two-lobed attractor. Pause to inspect a curve, then reset to repeat from the same initial state. Change one parameter at a time.

## Scientific model

The dimensionless equations are

$$
\begin{aligned}
\dot{x} &= \sigma(y-x), \\
\dot{y} &= x(\rho-z)-y, \\
\dot{z} &= xy-\beta z.
\end{aligned}
$$

The initial state is $(x,y,z)=(0.1,0,0)$. Default parameters are $\sigma=10$, $\rho=28$ and $\beta=8/3$. The sliders change these model parameters directly; they do not change the timestep.

## Numerical method and limits

The simulation uses fourth-order Runge–Kutta with a fixed timestep $\Delta t=0.005$ model time units. Eight integration steps are taken per animation frame. The plotted trajectory is an educational numerical approximation, not a climate forecast. Floating-point and integration errors make long-run paths diverge in chaotic regimes. Frame rate changes how fast model time advances on screen, but not the integration timestep.

## References

- E. N. Lorenz, “Deterministic Nonperiodic Flow,” *Journal of the Atmospheric Sciences* **20** (1963), 130–141. [Journal DOI](https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2).
