import { createInterface } from "readline/promises";
const grid = {
    x: 10,
    y: 10,
};
var Direction;
(function (Direction) {
    Direction["North"] = "N";
    Direction["East"] = "E";
    Direction["West"] = "W";
    Direction["South"] = "S";
})(Direction || (Direction = {}));
const cleaner = {
    x: 5,
    y: 5,
    direction: Direction.North,
};
class VacuumCleaner {
    grid;
    cleaner;
    readline = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    constructor(grid, cleaner) {
        this.grid = grid || { x: 10, y: 10 };
        this.cleaner = cleaner || { x: 5, y: 5, direction: Direction.North };
    }
    move(instruction) {
        if (!this.canMoveForward())
            return;
        switch (cleaner.direction) {
            case Direction.North:
                cleaner.y++;
                break;
            case Direction.East:
                cleaner.x++;
                break;
            case Direction.West:
                cleaner.x--;
                break;
            case Direction.South:
                cleaner.y--;
                break;
        }
    }
    canMoveForward() {
        if (cleaner.direction === Direction.North && cleaner.y === grid.y) {
            return false;
        }
        if (cleaner.direction === Direction.East && cleaner.x === grid.x) {
            return false;
        }
        if (cleaner.direction === Direction.South && cleaner.y === 0) {
            return false;
        }
        if (cleaner.direction === Direction.West && cleaner.y === 0) {
            return false;
        }
        return true;
    }
    Orientation(direction) {
        switch (direction) {
            case "D":
                switch (cleaner.direction) {
                    case Direction.North:
                        cleaner.direction = Direction.East;
                        break;
                    case Direction.East:
                        cleaner.direction = Direction.South;
                        break;
                    case Direction.South:
                        cleaner.direction = Direction.West;
                        break;
                    case Direction.West:
                        cleaner.direction = Direction.North;
                        break;
                }
                break;
            case "G":
                switch (cleaner.direction) {
                    case Direction.North:
                        cleaner.direction = Direction.West;
                        break;
                    case Direction.East:
                        cleaner.direction = Direction.North;
                        break;
                    case Direction.South:
                        cleaner.direction = Direction.East;
                        break;
                    case Direction.West:
                        cleaner.direction = Direction.South;
                        break;
                }
                break;
        }
    }
    async question(question) {
        return new Promise((resolve) => {
            this.readline.question(question).then((answer) => {
                resolve(answer);
            });
        });
    }
    async play() {
        const response = await this.question("Would you like to start the vacuum cleaner? (Y/N)");
        if (response === "Y") {
            const grid = await this.question("Please enter the grid size (x y): ");
            [this.grid.x, this.grid.y] = grid.split(",").map(Number);
            const cleaner = await this.question("Please enter the cleaner position (x, y, direction). Direction can be N,S,E,W: ");
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
        }
        else {
            console.log("Bye!");
            this.readline.close();
        }
    }
    async init() {
        await this.play();
    }
    async run() {
        console.log(`
    The vacuum cleaner is in position (${this.cleaner.x}, ${this.cleaner.y}) and is facing ${this.cleaner.direction}
    The grid size is (${this.grid.x}, ${this.grid.y})
    Allowed instructions are D (right), G (left) and A (forward)
    To exit the program, press CTRL + C or type exit`);
        this.question(`Please enter the instructions you wish to execute: `).then((answer) => {
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
            console.log(`The vacuum cleaner is in position (${this.cleaner.x}, ${this.cleaner.y}) and is facing ${this.cleaner.direction}`);
            this.play();
        });
    }
}
const vacuumCleaner = new VacuumCleaner(grid, cleaner);
vacuumCleaner.init();
