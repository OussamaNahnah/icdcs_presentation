# RoASt: Robot Algorithm Synthesizer - Technical Overview

## 1. Core Idea
**RoASt** (Robot Algorithm Synthesizer) is a framework designed to automate the discovery and verification of distributed algorithms for autonomous robot swarms. It focuses on synthesizing state-based rules that guide robots to achieve complex global goals (like exploring a grid with obstacles) while operating under local, limited-visibility constraints.

### The "Trust by Transparency" Design
A key pillar of the project is the integration of synthesis results with interactive verification. Every synthesized algorithm is deep-linked to:
- **Simulation Viewers**: Real-time execution traces of the robots.
- **Technical Documentation**: Detailed breakdowns of rule generation and classification.

---

## 2. Technical Model Specifications
The experiments focus on two primary algorithmic setups, differing mainly in visibility range and complexity.

### Common Model Parameters:
- **Agents**: 2 Robots (Leader-Follower dynamics).
- **States**: 3 Colors (used for coordination and state memory).
- **Arena**: Discrete 2D Grid.
- **Obstacles**:
    - **Pole**: A standard obstacle that blocks both movement and visibility.
    - **Hole**: A "see-through" obstacle that blocks movement but allows visibility (tested in Exec 5 and Exec 10).

### Algorithm Variants:
- **Algo 1**: Visibility radius of **1** (Highly constrained local sensing).
- **Algo 2**: Visibility radius of **2** (Extended sensing, significantly larger state/candidate space).

---

## 3. Experimental Results & Executions
All executions have been verified against raw synthesis logs from the `luminousrobots.github.io` repository.

### Algo 1 Results Summary (Visibility 1)
| Exec | Condition | Candidates | Time | Tested Levels | Valid |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Standard Pole | 5 | 2.03 s | 4 / 4 | 5 |
| **2** | Goal 8 relaxed | 15 | 3.60 s | 7 / 7 | 15 |
| **10** | Obstacle is a Hole | 5 | 2.00 s | 4 / 4 | 5 |
| **9** | Goal 6 strict (Failed) | 5 | 0.78 s | 4 / 4 | 0 |

### Algo 2 Results Summary (Visibility 2)
| Exec | Condition | Candidates | Time | Tested Levels | Valid |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **3** | Standard Pole | 373,248 | 1h 5m 21s | 4 / 12 | 115 |
| **4** | Different order | 373,248 | 1h 10m 03s | 4 / 12 | 115 |
| **5** | Obstacle is a Hole | 373,248 | 1h 10m 18s | 4 / 12 | 115 |
| **6** | Goal 11 modified | 373,248 | 23m 01s | 4 / 13 | 85 |
| **7** | Goal 9 relaxed | 117,407,808 | 3h 7m 49s | 4 / 32 | 475 |
| **8** | Combined mods | 117,407,808 | 2h 36m 15s | 4 / 34 | 181 |

---

## 4. Theoretical Foundation: Lead-To-Center Property
Beyond synthesis, the project formalizes the **Lead-To-Center** property, which mathematically proves centroid convergence in arbitrary grid sizes $S$.

### Key Definitions:
- **Step**: The execution of a single goal within the synthesizer.
- **Cycle**: A repeating sequence of goals that forms a periodic movement pattern.
- **Shift**: The global spatial translation ("shifting") of the entire cycle away from arena corners.
- **Convergence**: The proof that these repeating cycles result in the swarm moving toward the arena center, regardless of the grid dimensions.

---

## 5. Synthesis Methodology
The synthesis process utilizes **Progressive Validation** across **Activation Levels**:
1. **Candidate Generation**: Based on goal requirements, a set of possible rule-based algorithms is generated.
2. **Activation Levels**: Algorithms are grouped into levels based on their complexity or the number of activated rules.
3. **Validation**: Each level is processed sequentially. For complex cases (Algo 2), only the "Top 4" or first few levels are typically tested due to computational intensity, as documented in the `timestamp.log` files.
