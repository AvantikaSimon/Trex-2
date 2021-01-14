var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOver, restart;

var cameraPosition;

var specialCloudsGroup;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(displayWidth/10, displayHeight - 400, 30, 50);
  console.log(trex.x, trex.y);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.7;
  
  //ground = createSprite(200,180,400,20);
  ground = createSprite(displayWidth/2, trex.y + 5, displayWidth, displayHeight);

  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //gameOver = createSprite(300, 100);
  gameOver = createSprite(displayWidth/2 - 20, displayHeight/4 - 30);
  gameOver.addImage(gameOverImg);
  
  //restart = createSprite(300, 140);
  restart = createSprite(displayWidth/2, displayHeight/4 + 40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.7;
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
  
  //invisibleGround = createSprite(200,190,400,10);
  invisibleGround = createSprite(displayWidth/2, trex.y + 20, displayWidth, 20);

  invisibleGround.visible = false;
  console.log(invisibleGround.x, invisibleGround.y, invisibleGround.width, invisibleGround.height);
  //invisibleGround.shapeColor = red;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  specialCloudsGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, displayWidth/2, displayHeight/3);

  cameraPosition = camera.position.x;
  console.log(cameraPosition); 
  
  if (gameState === PLAY){
   // score = score + Math.round(getFrameRate()/60);
    score = score + Math.round(cameraPosition/1000);
    ground.velocityX = -(6 + 3*score/100);
    camera.velocityX = -(6 + 3*score/100);
  
  
    if(keyDown("space") && trex.y >= displayHeight - 450) {
      trex.velocityY = -13;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
   // if (ground.x < 0){
     // ground.x = ground.width/2;
   // }

    if (ground.x < 200){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);

    spawnClouds();
    spawnObstacles();
    spawnSpecialClouds(); 

    if(trex.isTouching(specialCloudsGroup)){
      score = score + 200;
      specialCloudsGroup.destroyEach();
    }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
      
    //set velcity of each game object to 0 
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    specialCloudsGroup.setVelocityEach(0);
    camera.velocity = 0;
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    specialCloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    //var cloud = createSprite(600,120,40,10);
    var cloud = createSprite(displayWidth, displayHeight - 400, 30, 20);
    cloud.y = Math.round(random(displayHeight - 600, displayHeight - 700));
    cloud.addImage(cloudImage);
    cloud.scale = 0.8;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    //var obstacle = createSprite(600,165,10,40);
    var obstacle = createSprite(displayWidth, displayHeight - 420, 20, 50);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 600;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnSpecialClouds(){
if(frameCount % 240 === 0){
var specialCloud = createSprite(displayWidth, displayHeight - 580, 20, 20);
specialCloud.velocityX = -(6 + 3*score /100);
specialCloud.lifetime = 600;
specialCloudsGroup.add(specialCloud);
}
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  specialCloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }

  console.log(localStorage["HighestScore"]);
  
   score = 0;
}