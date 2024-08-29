// Declare variables
const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");

// 2D graphics, dimensions, gravity, proportions, checkpoints
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.5; 
let isCheckpointCollisionDetectionActive = true; // opportunity to cross different checkpoints
const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
  }

// Player characteristics
class Player {
    constructor(){
        this.position = {
            x : proportionalSize(10),
            y : proportionalSize(400),
        };
    }
}  