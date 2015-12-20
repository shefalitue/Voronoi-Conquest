# Introduction

In this document we will plot the main aspects of the game being developed as the Geometric Algorithms project. The game will have at its core the algorithm of *Voronoi Diagram*. Furthermore, the game is a strategy game that can be played by two players.

The purpose of the game is to, given the map of a land, maximize the area conquered by the player. The game starts with an empty map. In turns, each player will set a point corresponding to their army somewhere in the map. The next step is to calculate the *Vornoi Diagram* defined by the points. Each point has an area of influence in the plane. After a given number of turns, the player with the greater area will be the winner. In the next sections, more details about the game are going to be given. 

# Game Features
The starting-point of the game will be based on the total area conquered by each player. This functionality is quite simple. To make it more interesting, the game will be enhanced by adding more features to the gameplay.

To begin with, the game will have more levels. Each level will have a different play-space, which is described by the polygon in which the players can position their points. Besides levels, each player will also have a limited number of turns to conquer the locations, i.e.  a turn is needed to place a point on the map.

Additionally, the factor that will determine which player wins will not only be based on the total area conquered, but also in the *importance of such areas*. The importance will be defined by how many people live on those areas, thus areas might have different weights. For instance, in some maps there will be villages and such places will have a greater importance than a uninhabited area. In this case, the village has a weight of 3, while the uninhabited area has a weight of 1. The minimum value of an area will be 1 even if there is no one living there. The final score is going to be calculated by the sum of the areas they own multiplied by the weight of that area.

Finally, the players won't be able only to set points on each turn, but also move their current points. This will improve the gameplay experience. Nevertheless, in order to avoid the advantage of seeing how the area modified and keep the strategic play, the player will not be able to see in real-time how the areas change while he is moving his point. The area will only be updated once the player settles on a new location for the point.

# Geometric Algorithms Applied
The whole mechanic of the game orbits around the *Voronoi Diagram* algorithm. In order to make it work we will have to use optimal data structures that improve the performance of the whole application. We will also have to work with overlapping of polygons, since we have polygons representing the area of influence of a point and also polygons representing the important places (villages) in the plane.

# Pitfalls
The most challenging part is going to be translating the abstract instructions of the algorithm into actual implementation. In the *HandleSiteEvent* method, one of the instructions says that the algorithm should check that the triple of consecutive arcs to see if their breakpoints converge. This instruction should be translated to checks inside the code, which seems like a rather difficult task at this point.
There is also the floating point imprecision, which has been described in the Course Slides. This can happen and thus the algorithm report a diagram that is not a Voronoi diagram.

# Notes by the professor
Store in the data structure just the delanay triagulation, and then for showing we compute the voronoi diagram from that delanay triangulation. This can be done by taking the edges, and then we pick a perpendicular line in the iddle of that segment. Then, the intersection of all the bisectos will be the polygon in the voronoi diagram.

Instead of polygons representing cities, we use points, and at the end of the game we can see the area of which player contains that point
