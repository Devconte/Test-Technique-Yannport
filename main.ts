import { createInterface } from "readline/promises";

interface GridInterface {
  x: number;
  y: number;
}

type ChangeDirection = "D" | "G";

enum Direction {
  North = "N",
  East = "E",
  West = "W",
  South = "S",
}
interface CleanerInterface {
  x: number;
  y: number;
  direction: Direction;
}

class VacuumCleaner {
  private grid: GridInterface;
  private cleaner: CleanerInterface;
  private readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  constructor(grid?: GridInterface, cleaner?: CleanerInterface) {
    this.grid = grid || { x: 10, y: 10 };
    this.cleaner = cleaner || { x: 5, y: 5, direction: Direction.North };
  }

  /**
   * this function moves the cleaner forward depending of the direction
   * @param instruction
   * @returns
   */
  private move(instruction: string) {
    if (!this.canMoveForward()) return;
    switch (this.cleaner.direction) {
      case Direction.North:
        this.cleaner.y++;
        break;
      case Direction.East:
        this.cleaner.x++;
        break;
      case Direction.West:
        this.cleaner.x--;
        break;
      case Direction.South:
        this.cleaner.y--;
        break;
    }
  }

  /**
   * this function checks if the cleaner can move forward depending of his position and direction on the grid
   * @returns true if the cleaner can move forward, false otherwise
   */

  private canMoveForward() {
    if (
      this.cleaner.direction === Direction.North &&
      this.cleaner.y === this.grid.y
    ) {
      return false;
    }
    if (
      this.cleaner.direction === Direction.East &&
      this.cleaner.x === this.grid.x
    ) {
      return false;
    }
    if (this.cleaner.direction === Direction.South && this.cleaner.y === 0) {
      return false;
    }
    if (this.cleaner.direction === Direction.West && this.cleaner.y === 0) {
      return false;
    }
    return true;
  }

  /**
   * this function changes the direction of the cleaner depending of the instruction
   * @param direction can be D (right) or G (left)
   */

  private Orientation(direction: ChangeDirection) {
    switch (direction) {
      case "D":
        switch (this.cleaner.direction) {
          case Direction.North:
            this.cleaner.direction = Direction.East;
            break;
          case Direction.East:
            this.cleaner.direction = Direction.South;
            break;
          case Direction.South:
            this.cleaner.direction = Direction.West;
            break;
          case Direction.West:
            this.cleaner.direction = Direction.North;
            break;
        }
        break;
      case "G":
        switch (this.cleaner.direction) {
          case Direction.North:
            this.cleaner.direction = Direction.West;
            break;
          case Direction.East:
            this.cleaner.direction = Direction.North;
            break;
          case Direction.South:
            this.cleaner.direction = Direction.East;
            break;
          case Direction.West:
            this.cleaner.direction = Direction.South;
            break;
        }
        break;
    }
  }

  /**
   * this function asks a question to the user and returns the answer
   * @param question
   * @returns a promise with the answer
   */
  private async question(question: string) {
    return new Promise<string>((resolve) => {
      this.readline.question(question).then((answer: string) => {
        resolve(answer);
      });
    });
  }

  /**
   * this function asks the user if he wants to start the vacuum cleaner
   * if the answer is Y, it asks the user to enter the grid size and the cleaner position
   * if the answer is N, it stops the program
   */
  private async play() {
    const response = await this.question(
      "Would you like to start the vacuum cleaner? (Y/N)"
    );
    if (response === "Y") {
      const grid = await this.question("Please enter the grid size (x,y): ");
      [this.grid.x, this.grid.y] = grid.split(",").map(Number);
      const cleaner = await this.question(
        "Please enter the cleaner position (x, y, direction). Direction can be N,S,E,W: "
      );
      //@ts-ignore
      [this.cleaner.x, this.cleaner.y, this.cleaner.direction] = cleaner
        .split(",")
        .map((value, index) => {
          if (index === 2) {
            return value;
          }
          return parseInt(value);
        });
      await this.run();
    } else {
      console.log("Bye!");
      this.readline.close();
    }
  }

  /**
   * this function initializes the program
   */
  public async init() {
    await this.play();
  }

  /**
   * this function runs the program
   * it display the current position of the cleaner and where it is facing
   * it asks the user to enter the instructions he wants to execute
   * it executes the instructions one by one
   * it displays the final position of the cleaner
   * then it asks the user if he wants to start the vacuum cleaner again
   */
  private async run() {
    console.log(`The vacuum cleaner is in position (${this.cleaner.x}, ${this.cleaner.y}) and is facing ${this.cleaner.direction}
    The grid size is (${this.grid.x}, ${this.grid.y})
    Allowed instructions are D (right), G (left) and A (forward)
    To exit the program, press CTRL + C or type exit`);
    this.question(`Please enter the instructions you wish to execute: `).then(
      (answer: string) => {
        const instructions = answer.split(""); // ["D", "G", "A"]
        for (const instruction of instructions) {
          switch (instruction) {
            case "D":
            case "G":
              this.Orientation(instruction);
              break;
            case "A":
              this.move(instruction);
              break;
          }
        }
        console.log(
          `The vacuum cleaner is in position (${this.cleaner.x}, ${this.cleaner.y}) and is facing ${this.cleaner.direction}`
        );
        this.play();
      }
    );
  }
}

const vacuumCleaner = new VacuumCleaner();
vacuumCleaner.init();
