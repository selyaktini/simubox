## Explore the system

Change **ρ** to vary the forcing term. At low values the trajectory settles; around the default value it often traces two lobes. Pause the trajectory to inspect its shape, then reset to compare a new run from the same initial state. Change one parameter at a time.

## Scientific model

The Lorenz equations describe an idealized, three-variable model originally derived from simplified fluid convection:

- dx/dt = σ(y − x)
- dy/dt = x(ρ − z) − y
- dz/dt = xy − βz

Here σ, ρ and β are dimensionless parameters. The default values are σ = 10, ρ = 28 and β = 8/3. The initial state is (0.1, 0, 0). The plot projects x horizontally and z vertically, so depth in y is not shown.

## Numerical method and limitations

The simulation uses fourth-order Runge–Kutta with a fixed timestep of 0.005 model time units. Each animation frame advances eight steps. This is an educational numerical approximation, not a climate prediction. Finite precision and integration error cause trajectories to diverge over time in chaotic regimes. Screen size and frame rate affect display but not the model timestep.

## References

- E. N. Lorenz, “Deterministic Nonperiodic Flow,” *Journal of the Atmospheric Sciences* **20** (1963), 130–141. DOI: [10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2](https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2).
