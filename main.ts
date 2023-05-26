interface GridInterface {
  x: number;
  y: number;
}

const grid: GridInterface = {
  x: 10,
  y: 10,
};

type ChangeDirection = "D" | "G";

enum Direction {
  North = "N",
  East= "E",
  West = "W",
  South = "S",
};

const cleaner = {
  x: 5,
  y: 5,
  direction: Direction.North,
};

function move(instruction: string) {
  if (isOnTheEdges()) return;
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

function isOnTheEdges(){
  if(cleaner.direction === Direction.North && cleaner.y === grid.y ) {
    return false;
  }
  if(cleaner.direction === Direction.East && cleaner.x === grid.x ) {
    return false;
  }
  if(cleaner.direction === Direction.South && cleaner.y === 0 ) {
    return false; 
  }
  if(cleaner.direction === Direction.West && cleaner.y === 0 ) {
    return false;
  }
  return true;
}

function Orientation(direction: ChangeDirection) {
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
