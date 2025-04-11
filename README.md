# ![Mg](https://r128w.github.io/megag/assets/mg.png) MegaGravity (WIP)
#### A physics-based multiplayer sandbox

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

Interact with platforms, which are objects that float around the world as the player does. Currently, there are five platforms: the dock, from which players can build other platforms; the three mines for Magnesium, Nitrate, and Selenium, the three in-game resources; and the basic turret, which shoots at other players and their buildings.

Mines collect resources from planets, which slowly regenerate resources. Planets can also be mined manually by the player by holding E. Resources from mines are collected when the player who owns them flies nearby.

Each player has a dock, which they can use to build mines and other platforms. To build from the dock, you need to be grabbed to it, and then build via the UI or hotkey. The dock only works when off the ground.

### Planned

- Make factions, wage interplanetary war, both in defense and offense.

- In-game chat

- More turret types

- More stable, reliable sync

- Specialized docks for building turrets, defense, ammo platforms

   - Dock builds: Mg Mine, NO3 Farm, Se Mine, Turret Dock, Defense Dock, Ammo Factory
 
   - Turret dock builds: Basic Turret, Miniturret, TBD, TBD, TBD, TBD
 
   - Defense dock builds: Local Shield, Planetary Shield, TBD, TBD, TBD, TBD
 
   - Ammo Factory makes: Minigun Ammo, Bombs, Tesla Charges, Laser Cells, TBD, TBD
