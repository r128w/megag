# ![MegaGravity logo: Mg](https://r128w.github.io/megag/assets/mg.png) MegaGravity (WIP)
#### A physics-based (planned) sandbox for people who love orbits

# Controls
W: Accelerate forwards + Shift: Boost forwards acceleration

S: Accelerate backwards

A, D: Accelerate rotation left, right - Keep in mind that angular velocity gained must be cancelled later

E: Interact

Space: Shoot

Tab: Toggle large minimap

# Gameplay

### Implemented

Fly around the system. Planets are stationary, static masses which pull objects towards them. To allow for some stable orbits (see [3-body problem](https://en.wikipedia.org/wiki/three_body_problem)), planets have a limit to their gravitational influence, proportional to their radius, beyond which they have no gravity.

Interact with platforms, which are objects that float around the world as the player does. For now, there is one platform which spawns at the start of the game, but more can be added through console (`pobjects.push(new Platform(x, y))`). Platforms can be carried and released into orbits, or thrown via spinning.

### Planned

Create and destroy platforms using planet-based or space-based buildings. Play against others through PeerJS-enabled almost-serverless multiplayer. Gather resources, etc.
