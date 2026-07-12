# Roblox Code Builder — Lesson-by-Lesson Answer Key (For Teachers)

> This document summarizes the reference solutions and explanations for all **12 lessons of Roblox Course 1 (Basic)**, which are currently implemented in code and playable by students.

---

## 0. How to Use This Document

- Each lesson includes a **reference solution** listing blocks in order. Most maps (especially flower maps) have **multiple valid solutions** — what's shown here is the "standard example for explanation," and students who clear the lesson a different way are still correct.
- Indentation represents child blocks nested inside a loop/conditional/function block.
  ```
  Repeat(5)
    If Obstacle Ahead
      Turn Right
    Move Forward
  ```
  This example means "If Obstacle Ahead" and "Move Forward" are, in that order, nested inside the "Repeat" block.
- **Coordinate system**: the agent always spawns facing -Z. Each `Turn Right` rotates 90° clockwise (-Z → +X → +Z → -X → -Z, repeating).
- In-game block labels are in Korean (this is a Korean-language product); English names below are translations for teacher reference, with the block's `Type` ID and Korean display name (in Korean UI) noted alongside.

---

## 1. Block Command Reference (7 blocks)

| English name | Korean display name | Command (Type) | Category | Behavior |
|---|---|---|---|---|
| Move Forward | 앞으로 이동 | `MoveForward` | Action | Moves **8 studs** in the current facing direction. If it doesn't arrive within 2 seconds (blocked by a wall), it returns to its starting spot. On success, it snaps exactly onto the grid |
| Turn Right | 오른쪽 회전 | `TurnRight` | Action | Instantly rotates **90°** clockwise in place, then pauses 0.3s |
| Place Flower | 꽃 심기 | `PlaceFlower` | Action | Spawns a flower model (stem + head) on the ground at the agent's current position. Unlike movement/turning, this happens **in place**, and running it repeatedly stacks more flowers at that spot |
| Repeat | 반복 | `RepeatN` (param `Count`, default 3) | Loop | Executes the nested child blocks **Count times**. Clamped to a range of 1–20 (values above 20 are automatically capped at 20) |
| If Obstacle Ahead | 장애물이 있으면 | `IfObstacle` | Conditional | Raycasts up to 9 studs ahead to check for an obstacle (e.g. a wall). Runs the nested child blocks **only if true**; skips them otherwise |
| Define Function | 함수 만들기 | `DefineFunc` (param `Name`) | FuncDef | Stores the nested block group under the given name **without executing it**. Regardless of where it sits on the canvas, it's registered before the program runs (hoisting) |
| Call Function | 함수 호출 | `CallFunc` (param `Name`) | FuncCall | Looks up the block group saved by `Define Function` by name and executes it on the spot |

**2 automatic progress-detection methods**
- **Goal tile touch**: when the agent touches the gold tile, the server automatically detects it and marks the lesson complete
- **Flower count reached**: every time a `Place Flower` block runs, the server counts flowers on that map; once the count reaches the target (`goalTarget`), the lesson is marked complete

---

## 2. Lesson-by-Lesson Walkthrough

### Lesson 1 — Getting Started with Code Builder (Map M-A · L-shape)
**Objective:** Move the character using block code | **Core concept:** Sequencing | **Completion condition:** touch the goal tile

**Map layout:** From spawn, go 2 tiles forward (-Z), turn right, then 2 more tiles to reach the goal. A 1-tile-wide corridor of walls forces the intended path.

**Reference solution**
```
Move Forward
Move Forward
Turn Right
Move Forward
Move Forward
```

**Explanation:** The most basic sequencing exercise. The goal is for students to feel that "2 moves + 1 turn + 2 moves" is literally the order of commands. If a student gets confused about which way "right" is, having them physically turn in place helps.

---

### Lesson 2 — Escaping the Maze (Map M-B · S-shape)
**Objective:** Arrange blocks in the correct order to escape a maze | **Core concept:** Sequencing, advanced | **Completion condition:** touch the goal tile

**Map layout:** 3 tiles forward (-Z) → turn right → 3 tiles (+X) → turn right → 3 tiles (back to +Z, opposite of the original direction) to reach the goal.

**Reference solution**
```
Move Forward
Move Forward
Move Forward
Turn Right
Move Forward
Move Forward
Move Forward
Turn Right
Move Forward
Move Forward
Move Forward
```

**Explanation:** A harder version of Lesson 1 with longer stretches and more turns. It's worth pointing out that after 2 turns, the agent ends up walking in the direction (+Z) opposite to where it started (-Z→+X→+Z).

---

### Lesson 3 — Planting One Flower (Map F-A · straight, 3 tiles)
**Objective:** Use the Place Flower block together with movement | **Core concept:** introducing `PlaceFlower` | **Completion condition:** plant 1 flower

**Map layout:** A straight, open 3-tile strip including the spawn tile (flower-type maps have no walls).

**Reference solution**
```
Move Forward
Place Flower
```

**Explanation:** Since the goal is just 1 flower, technically running `Place Flower` alone at spawn also clears it. However, to honor this lesson's objective of "planting while moving," present the example above (move once, then plant) as the standard explanation. (Note for teachers: a student who plants without moving is still correct — worth mentioning up front so it isn't treated as a mistake.)

---

### Lesson 4 — Making a Flower Path (Map F-B · 7×7 grid)
**Objective:** Plant flowers while moving to create a pattern | **Core concept:** sequencing + Place Flower combined | **Completion condition:** plant 3 flowers

**Map layout:** An open 7×7 grid with a fence border; spawn is at the inner southwest corner.

**Reference solution**
```
Move Forward
Place Flower
Move Forward
Place Flower
Move Forward
Place Flower
```

**Explanation:** Repeating "move → plant" three times creates a straight flower path. Since the grid is open, planting 3 flowers in any direction/arrangement also counts — freeform placement is still correct. Before moving on to loops next lesson, it's worth pointing out "you wrote the same action three times" to foreshadow why loops are useful.

---

### Lesson 5 — Escaping the Maze with a Loop (Map M-C · straight, 6 tiles)
**Objective:** Use a Repeat block to run the same action multiple times | **Core concept:** loops | **Required block:** `RepeatN` | **Completion condition:** touch the goal tile

**Map layout:** A straight corridor from spawn to goal, requiring 5 forward moves total.

**Reference solution**
```
Repeat(5)
  Move Forward
```

**Explanation:** Shows that instead of writing `Move Forward` 5 times, putting just one inside `Repeat(5)` does the same thing. Be sure to point out that the `Count` parameter must be changed to 5 (the default is 3, and leaving it unchanged won't clear the lesson).

---

### Lesson 6 — Making a Flower Bed with a Loop (Map F-C · straight flower strip, 5 tiles)
**Objective:** Use a Repeat block to create a regular flower bed | **Core concept:** loop + Place Flower combined | **Required block:** `RepeatN` | **Completion condition:** plant 5 flowers

**Reference solution**
```
Repeat(5)
  Place Flower
  Move Forward
```

**Explanation:** Repeating "plant → move" plants 5 evenly spaced flowers. Reversing the order (`Move Forward` → `Place Flower`) also plants 5 flowers total and still counts as correct, but the spawn tile itself ends up without a flower — comparing the two outcomes makes a good extension question.

---

### Lesson 7 — Detecting Obstacles (Map M-D · T-shape)
**Objective:** Use a conditional block to detect an obstacle and change behavior | **Core concept:** conditionals | **Required block:** `IfObstacle` | **Completion condition:** touch the goal tile

**Map layout:** One tile forward from spawn is a dead-end T-junction. Straight ahead is blocked by a wall; turning right leads straight to the goal.

**Reference solution**
```
Move Forward
If Obstacle Ahead
  Turn Right
Move Forward
```

**Explanation:** At the junction, check whether there's a wall ahead with `If Obstacle Ahead`; turn only if true, then move forward again into the goal. A common mistake is nesting `Move Forward` inside `If Obstacle Ahead` as well, which makes the turn and the move happen together and produces the wrong result — point out that the second `Move Forward` needs to sit outside the conditional block.

---

### Lesson 8 — Conditionals Inside a Loop (Map M-E · L-shape, same shape as Lesson 1 reused elsewhere)
**Objective:** Nest a conditional inside a loop to build more complex behavior | **Core concept:** nested loop + conditional | **Required blocks:** `RepeatN`, `IfObstacle` | **Completion condition:** touch the goal tile

**Map layout:** The same L-shape as Lesson 1 (M-A) — 2 tiles forward → turn right → 2 more tiles — but this time students are guided toward a general "turn automatically when you hit a wall" algorithm.

**Reference solution**
```
Repeat(4)
  If Obstacle Ahead
    Turn Right
  Move Forward
```

**Explanation:** Each iteration does "if there's a wall ahead, turn right first, then move forward unconditionally," repeated 4 times. On iterations 1–2 there's no obstacle, so it just moves forward; on iteration 3 it hits the dead end, turns, then moves forward; on iteration 4 it takes the final step into the goal. Lesson 1's literal "2 forward, turn, 2 forward" solution also clears this map, but since this lesson's point is building a **general-purpose rule that works for any corridor shape**, present the solution above as the standard.

---

### Lesson 9 — Making Your Own Function (Map F-D · 7×7 grid)
**Objective:** Define and call a function to reuse code | **Core concept:** function definition/calling | **Required blocks:** `DefineFunc`, `CallFunc` | **Completion condition:** plant 3 flowers

**Reference solution**
```
Define Function("PlantAndMove")
  Move Forward
  Place Flower
Call Function("PlantAndMove")
Call Function("PlantAndMove")
Call Function("PlantAndMove")
```

**Explanation:** The key point is that the `Define Function` block itself doesn't execute — it only registers a name (it can even sit anywhere on the canvas). Calling `Call Function` 3 times below repeats "move + plant" 3 times, filling in 3 flowers. The result is the same as Lesson 6's `Repeat(3) { Move Forward, Place Flower }`, but it's worth contrasting the two to highlight the concept of a named, reusable function.

---

### Lesson 10 — Making a Flower Path with a Function (Map F-E · straight flower strip, 5 tiles)
**Objective:** Combine functions and loops to automatically build a flower path | **Core concept:** function + loop combined | **Required block:** `CallFunc` | **Completion condition:** plant 5 flowers

**Reference solution**
```
Define Function("PlantAndMove")
  Move Forward
  Place Flower
Repeat(5)
  Call Function("PlantAndMove")
```

**Explanation:** Combines Lesson 9 (functions) with Lessons 5/6 (loops). Emphasize that the action inside a function can be called multiple times from within a loop — i.e., a function call can be nested inside a loop just like any other block.

---

### Lesson 11 — Combining Multiple Functions (Map F-D2 · 7×7 grid)
**Objective:** Create and combine multiple functions to build complex behavior | **Core concept:** functions, advanced | **Required block:** `CallFunc` | **Completion condition:** plant 6 flowers

**Reference solution**
```
Define Function("StraightPlant")
  Move Forward
  Place Flower
Define Function("TurnPlant")
  Turn Right
  Move Forward
  Place Flower
Call Function("StraightPlant")
Call Function("StraightPlant")
Call Function("TurnPlant")
Call Function("StraightPlant")
Call Function("StraightPlant")
Call Function("TurnPlant")
```

**Explanation:** The reference solution defines two functions with different behaviors (`StraightPlant`, `TurnPlant`) and calls them in a chosen order. Using just one function called 6 times (the Lesson 9/10 approach) still reaches the target of 6 flowers and isn't wrong, but to demonstrate this lesson's objective (**combining multiple functions**), present the mixed-function version above as the standard.

---

### Lesson 12 — Building Your Own Garden (Map OW · 9×9 open world)
**Objective:** Use everything learned so far to create your own garden | **Core concept:** open-ended project | **Completion condition:** plant 10 flowers

**Reference solution (a capstone using all 7 blocks)**
```
Define Function("MoveAndPlant")
  Move Forward
  Place Flower
Repeat(10)
  If Obstacle Ahead
    Turn Right
  Call Function("MoveAndPlant")
```

**Explanation:** There is no single correct answer for this open-ended lesson. The example above is a general-purpose algorithm that "automatically changes direction when it hits the fence while filling in 10 flowers," using all 7 blocks taught so far (move, turn, plant, loop, conditional, define function, call function) once each as a capstone. Don't push students toward this specific example — emphasize that any approach that plants 10 flowers is correct.

---

## 3. Notes

- **Lesson 1 trial class (50 minutes, ages 6–9)**: there's no separate map code for this — it reuses **Lesson 1's map (M-A, mission)** and **Lesson 4's map (F-B, flower path)** as-is, run as a mission-experience-then-free-creation flow. See the Lesson 1 and Lesson 4 sections above for the walkthrough.
- **Roblox Course 2 (Advanced, 12 lessons)**: 4 new blocks are planned — Turn Left, Set Variable, Get Variable, Repeat While No Obstacle — but none of them are implemented in code yet, so this answer key doesn't cover them. A separate answer key will be added once they're implemented.
- Map/block specs in this document are based on the current code: `src/shared/LessonConfig.luau`, `src/server/MapBuilder.luau`, `src/blockdefs/*.luau`. If maps or target values change later, this document should be updated to match.
