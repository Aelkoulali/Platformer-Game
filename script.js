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
    ctx.fillStyle = "#000000";
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
    }
}

// Create platforms and platform logic
class Platform {
    constructor(x, y){
        this.position = {
            x,
            y,
        }
        this.width = 200;
        this.height = proportionalSize(40);
    }
    draw(){
        ctx.fillStyle = "#9DE23D";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// Add the logic for the checkpoints
class CheckPoint {
    constructor(x, y, z){
        this.position = {x, y};
        this.width = proportionalSize(40);
        this.height = proportionalSize(70);
        this.claimed = false;
    }
    draw(){
        ctx.fillStyle = "#FF907D";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    claim(){
        this.width = 0;
        this.height = 0;
        this.position.y = Infinity;
        this.claimed = true;    
    }
}

// Create a new player
const player = new Player();

// Create a list of positions for the platforms
const platformPositions = [
    { x: 500, y: proportionalSize(450) },
    { x: 700, y: proportionalSize(400) },
    { x: 850, y: proportionalSize(350) },
    { x: 900, y: proportionalSize(350) },
    { x: 1050, y: proportionalSize(150) },
    { x: 2500, y: proportionalSize(450) },
    { x: 2900, y: proportionalSize(400) },
    { x: 3150, y: proportionalSize(350) },
    { x: 3900, y: proportionalSize(450) },
    { x: 4200, y: proportionalSize(400) },
    { x: 4400, y: proportionalSize(200) },
    { x: 4700, y: proportionalSize(150) },    
];

// Create a list of new platform instances 
const platforms = platformPositions.map((platform) => new Platform(platform.x, platform.y));

// Create a list of checkpoints positions
const checkpointPositions = [
    { x: 1170, y: proportionalSize(80), z: 1 },
    { x: 2900, y: proportionalSize(330), z: 2 },
    { x: 4800, y: proportionalSize(80), z: 3 }
];

const checkpoints = checkpointPositions.map((checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z));

// Declare animate function
const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    platforms.forEach(platform => platform.draw());
    checkpoints.forEach((checkpoint) => checkpoint.draw());
    player.update();
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)){
        player.velocity.x = 5;
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)){
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;
        if(keys.rightKey.pressed && isCheckpointCollisionDetectionActive){
            platforms.forEach((platform) => {platform.position.x -= 5});
            checkpoints.forEach((checkpoint) => {checkpoint.position.x -= 5});
        } else if (keys.leftKey.pressed){
            platforms.forEach((platform) => {platform.position.x += 5});
            checkpoints.forEach((checkpoint)=> {checkpoint.position.x += 5});
        }
    }
    // Add detection collision logic 
    platforms.forEach((platform) => {
        const collisionDetectionRules = [
            player.position.y + player.height <= platform.position.y,
            player.position.y + player.height + player.velocity.y >= platform.position.y,
            player.position.x >= platform.position.x - player.width / 2,
            player.position.x <= platform.position.x + platform.width - player.width / 3,
        ];
        if(collisionDetectionRules.every(element => element)){
            player.velocity.y = 0;
            return;
        };
        const platformDetectionRules = [
            player.position.x >= platform.position.x - player.width / 2,
            player.position.x <= platform.position.x + platform.width - player.width / 3,
            player.position.y + player.height >= platform.position.y,
            player.position.y <= platform.position.y + platform.height,
        ];
        if(platformDetectionRules.every(element => element)){
            player.position.y = platform.position.y + player.height;
            player.velocity.y = gravity;
        };    
    });
    // Update animate function to display the checkpoint screen when the player reaches a checkpoint
    checkpoints.forEach((checkpoint, index, checkpoints) => {
        const checkpointDetectionRules =[
            player.position.x >= checkpoint.position.x,
            player.position.y + player.height <= checkpoint.position.y + checkpoint.height,
            isCheckpointCollisionDetectionActive,
            player.position.x - player.width <= checkpoint.position.x - checkpoint.width  + player.width * 0.9,
            index === 0 || checkpoints[index - 1].claimed === true,    
        ];
        if (checkpointDetectionRules.every((rule) => rule)) {
            checkpoint.claim();
        if (index === checkpoints.length - 1){
            isCheckpointCollisionDetectionActive = false;
            showCheckpointScreen("You reached the final checkpoint!");
            movePlayer("ArrowRight", 0, false);
        } else if (player.position.x >= checkpoint.position.x && player.position.x <= checkpoint.position.x + 40){
            showCheckpointScreen("You reached a checkpoint!");
        }}
    });
};      
    

// Manage the player's movement in the game
const keys = {
    rightKey : {pressed: false},
    leftKey : {pressed: false},
};

// Functionality responsible for moving the player across the screen
const movePlayer = (key, xVelocity, isPressed) => {
    if(!isCheckpointCollisionDetectionActive){
        player.velocity.x = 0;
        player.velocity.y = 0;
        return;
    }

    switch(key){
        case "ArrowLeft":keys.leftKey.pressed = isPressed; 
        if(xVelocity === 0){player.velocity.x = xVelocity};
        player.velocity.x -= xVelocity;
        break;
        case "ArrowUp":
        case " ":
        case "Spacebar":
        player.velocity.y-= 8;
        break;
        case "ArrowRight":
        keys.rightKey.pressed = isPressed;
        if (xVelocity === 0){player.velocity.x = xVelocity};
        player.velocity.x += xVelocity;
    };
}

// Start the game
const startGame = () => {
    canvas.style.display = "block"; //display the canvas element and hide the startScreen container
    startScreen.style.display = "none";
    animate(); //visualize the player on the screen
};

// Add a function that will show the checkpoint message when the player reaches a checkpoint
const showCheckpointScreen = (msg) => {
    checkpointScreen.style.display = "block";
    checkpointMessage.textContent = msg;
    if(isCheckpointCollisionDetectionActive){
        setTimeout(() =>{checkpointScreen.style.display = "none"}, 2000);
    }
};

// Add addEventListener to startBtn
startBtn.addEventListener("click", startGame);

// Add addEventListener to the global window object
window.addEventListener("keydown", ({ key }) => {
    movePlayer(key, 8, true);
    }
);

// Add another addEventListener to the global window 
window.addEventListener("keyup", ({ key }) => {
    movePlayer(key, 0, false);
   }
);
