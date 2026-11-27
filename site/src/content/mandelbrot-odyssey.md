## The mathematical object

The Mandelbrot set contains complex values $c$ for which the iteration below remains bounded:

$$
 z_0=0, \qquad z_{n+1}=z_n^2+c.
$$

The computed preview colors points by how quickly their orbit escapes beyond radius $2$, up to $80$ iterations. A finite run can identify escaping points, but it cannot prove that a point belongs to the set.

## Integration status

Mandelbrot Odyssey is an external project by Yahya. Its source is linked here; the application is not playable within SimuBox. The build contains WebGL2 rendering and module workers whose behavior requires a separately reviewed hosting configuration.

## Reference

- B. B. Mandelbrot, *The Fractal Geometry of Nature*, W. H. Freeman, 1982.
