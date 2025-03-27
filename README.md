# ![Mg](https://r128w.github.io/megag/assets/mg.png) MegaGravity (WIP)
#### A physics-based (planned) sandbox for people who love orbits

# Controls
W: Accelerate forwards + Shift: Boost forwards acceleration

S: Accelerate backwards

A, D: Accelerate rotation left, right - Keep in mind that angular velocity gained must be cancelled later

E: Interact - Grab and release platforms

Space: Shoot

Tab: Toggle large minimap

# Gameplay

### Implemented

Fly around the system. Planets are stationary, static masses which pull objects towards them. To allow for some stable orbits (see [3-body problem](https://en.wikipedia.org/wiki/three_body_problem)), planets have a limit to their gravitational influence, proportional to their radius, beyond which they have no gravity.

Interact with platforms, which are objects that float around the world as the player does. Currently, there are four platforms: the dock, from which players can build other platforms, and three mines for Magnesium, Nitrate, and Selenium, the three in-game resources.

Mines collect resources from planets, which slowly regenerate resources. Planets can also be mined manually by the player by holding E. Resources from mines are collected when the player who owns them flies nearby.

Each player has a dock, which they can use to build mines and other platforms. To build from the dock, you need to be grabbed to it, and then press a hotkey (UI pending, T -> Mg Mine, Y -> NO3 Farm, U -> Se Mine). The dock only works when not grounded.

### Planned

Create and destroy platforms using planet-based or space-based buildings. Play against others through PeerJS-enabled almost-serverless multiplayer.
