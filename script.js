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
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = proportionalSize(40);
        this.height = proportionalSize(40);
    };

// Player's width, height, position 
draw() {
    ctx.fillStyle = "#99c9ff";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Player shape
}
// Update player posiiton, velocity...
update() {
    this.draw();
    this.position.x += this.velocity.x; // when the playermove to the right     
    this.position.y += this.velocity.y; // when the player jumps up 
    if (this.position.y + this.height + this.velocity.y <= canvas.height){
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = gravity;
        }
          this.velocity.y += gravity;
        } else {
          this.velocity.y = 0;
        }
        if(this.position.x < this.width) {
          this.position.x = this.width;
        }
        if (this.position.x >= canvas.width - this.width * 2) {
            this.position.x = canvas.width - this.width * 2;
        }

    };
}

//Create a new player
const player = new Player();
 
const startGame = () => {
    canvas.style.display = "block"; //display the canvas element and hide the startScreen container
    startScreen.style.display = "none";
    player.draw(); //visualize the player on the screen
};
// Add eventlistener to startBtn
startBtn.addEventListener("click", startGame);

// Declare animate function
const animate = () => {
    requestAnimationFrame(animate);

}

