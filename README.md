# ![Mg](https://r128w.github.io/megag/assets/mg.png) MegaGravity (WIP)
#### A physics-based multiplayer sandbox

# Controls
W: Accelerate forwards + Shift: Boost forwards acceleration

S: Accelerate backwards

A, D: Accelerate rotation left, right - Keep in mind that angular velocity gained must be cancelled later

E: Interact - Grab and release platforms

1-9: Switch weapon type

Space: Shoot

Tab: Toggle navigation mode

# Gameplay

### How to Orbit

Players start on a green planet, and some may have trouble getting off it. It is of course completely possible. To reach orbit, you need to gain height (W to launch + shift for boost), then turn briefly sideways to gain lateral speed. When turning sideways, avoid holding down A or D, since that will make you spin uncontrollably, and remember to press the opposite direction around a second later to cancel out your angular velocity.

Getting to orbit is very important; some planets, like spawn, can only be escaped this way, and putting platforms in orbit is the only way to consistently keep them off the ground.

### Implemented Features

Fly around the system. Planets are stationary, static masses which pull objects towards them. To allow for some stable orbits (see [3-body problem](https://en.wikipedia.org/wiki/three_body_problem)), planets have a limit to their gravitational influence, proportional to their radius, beyond which they have no gravity.

Interact with platforms, which are objects that float around the world as the player does. Currently, there are five platforms: the dock, from which players can build other platforms; the three mines for Magnesium, Nitrate, and Selenium, the three in-game resources; and the basic turret, which shoots at other players and their buildings.

Mines collect resources from planets, which slowly regenerate resources. Planets can also be mined manually by the player by holding E. Resources from mines are collected when the player who owns them flies nearby.

The Ammo Factory allows the crafting of different ammo types through the same UI as the main Dock.L

Each player has a dock, which they can use to build mines and other platforms. To build from the dock, you need to be grabbed to it, and then build via the UI or hotkey. The dock only works when off the ground.

### Planned Features

- Make factions, wage interplanetary war, both in defense and offense.

- In-game chat

- More turret types

- More stable, reliable sync

- Specialized docks for building turrets, defense, ammo platforms

   - Dock: Mg Mine, NO3 Farm, Se Mine, Turret Dock, Defense Dock, Ammo Factory
 
   - Turret Dock: Basic Turret, Miniturret, Laser Turret, TBD, TBD, TBD
 
   - Defense Dock: Local Shield, Regional Shield, Planetary Shield, TBD, TBD, TBD
 
   - Ammo Factory: Minigun Ammo, Bombs, Tesla Charges, Laser Cells, TBD, TBD
 
- Dune-like laser-shield interaction? Could be funny
