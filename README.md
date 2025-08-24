Game Description

•Treasure Hunter is a grid-based puzzle game built on an 8x8 board. You control a hunter who must collect treasures while avoiding obstacles.
•Movement: Use W, A, S, D keys to move the hunter across the grid. The hunter can’t move through obstacles.
•Treasures: There are 6 types of treasures (values 1–6), each appearing randomly on the grid.
•Obstacles: About 10 obstacles are placed at random, and more can appear as you collect treasures.

•Scoring Rules:
Collecting 3 of the same treasure = 300 + sum of values
Collecting 2 of the same treasure = 200 + sum of values
Collecting 3 consecutive treasures (a run) = 100 + sum of values
Otherwise = just the sum of values

•Bag Limit: The hunter can carry 3 treasures at a time. Once full, the score is calculated and the bag is emptied.

•Dynamic Gameplay: After collecting a treasure, either a new treasure of the same type or an obstacle is added randomly to the grid.

•End Conditions:
No treasures left on the grid

Hunter cannot move in any direction

Player presses End Game button

•Performance Index: At the end, the game calculates Performance Index = Total Score ÷ Rounds Played and shows it as part of the results.

•What I Learned & Implemented

-CSS Animations & Styling – Added gradient backgrounds, hover effects, and grid-based layouts for a better UI.

-JavaScript Game Logic – Implemented grid generation, random placement of treasures/obstacles, and dynamic game updates.

-Keyboard Controls – Used key events (W, A, S, D) for smooth player movement.

-Scoring System – Designed logic for matching treasures (same values, pairs, and runs) with bonus points.

-Game State Management – Built conditions for ending the game, restarting logic, and performance index tracking.

-Problem-Solving Skills – Learned to handle edge cases like blocked moves and no remaining treasures.

•How to Play
1.Open numbers.html in your browser

2.Use W, A, S, D keys to move the hunter

3.Collect treasures, avoid obstacles

4.Score points with treasure combinations

5.Press End Game to stop anytime
