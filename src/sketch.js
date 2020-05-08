// initializing all required variables
var scaleOffsetX = 21;
var scaleOffsetY = 10;
var whiteKeyWidth = 50;
var whiteKeyHeight = 300;
var blackKeyWidth = 25;
var blackKeyHeight = 180;
var whiteKeyNumber = [0,2,4,5,7,9,11,12,14,16,17,19,21,23];
var blackKeyNumber = [1,3,6,8,10,13,15,18,20,22];
var blackKeyPattern = [0,1,3,4,5,7,8,10,11,12];
var whiteKeyShape = [1,2,3,1,2,2,3,1,2,3,1,2,2,3];
var x;
var y;
var keyHover;
var blackKeyHover;
var whiteKeyHover;
var colorPreset1;
var colorPreset2;
var colorPreset3;
var colorPreset4;


// Setting up p5.js elemnts, function executed once when the p5 canvas is loaded
function setup() {
  createCanvas(745, 330);
  background(180);
  drawKeyboard();
  colorPreset1 = color(218, 162, 224);
  colorPreset2 = color(169, 88, 196);
  colorPreset3 = color(182, 162, 224);
  colorPreset4 = color(118, 88, 182);
}


// Updating the display of the scale to show the hovered key
function draw() {
  // Checking if the user is in the setup state
  if(currentState == 0){
    drawKeyboard();
    colorScale(currentScale);
    drawHiLight();
  }
}


// Displaying the current hovered key
function  drawHiLight() {
  keyHover = getKeyHover(12);
  if(keyHover != -1){
    drawKey(keyHover, 50);
  }
}


// Updating the customScale scale when mouse is clicked
function mouseClicked() {
  // Checking if the user is in the setup state
  if(currentState == 0){
    // Getting and checking current hovered key in the first octave
    keyHover = getKeyHover(12);
    if(keyHover != -1){
      scaleSel.value  = "custom";
      if (currentScale.indexOf(keyHover) != -1){
        customScale.splice(customScale.indexOf(keyHover),1)
      }else{
        customScale.push(keyHover);
        customScale.sort();
      }
      updateScale();
    }
  }
}


// Getting current hovered key number in a range (else -1)
function getKeyHover(detectLimit) {
  x = mouseX;
  y = mouseY;
  blackKeyHover = blackKeyHoverFinder(x,y);
  whiteKeyHover = whiteKeyHoverFinder(x,y);
  var key = -1;
  if (blackKeyHover != -1){
    key = blackKeyNumber[blackKeyHover];
  }else if (whiteKeyHover != -1) {
    key = whiteKeyNumber[whiteKeyHover];
  }
  if(key < detectLimit){
    return key;
  }else {
    return -1;
  }
}


// Getting current hovered black key number (else -1)
function blackKeyHoverFinder(x,y) {
  for (var i = 0; i < blackKeyPattern.length; i++){
    var iPos = blackKeyPattern[i]+1;
    if(x > scaleOffsetX+iPos*whiteKeyWidth-blackKeyWidth/2 && x < scaleOffsetX+iPos*whiteKeyWidth+blackKeyWidth/2 && y > scaleOffsetY && y < scaleOffsetY+blackKeyHeight){
      return i;
    }
  }
  return -1;
}


// Getting current hovered white key number (else -1)
function whiteKeyHoverFinder(x,y) {
  if (x > scaleOffsetX && x < scaleOffsetX+whiteKeyWidth*whiteKeyNumber.length && y > scaleOffsetY && y < scaleOffsetY+whiteKeyHeight){
    return Math.floor((x-scaleOffsetX)/whiteKeyWidth);
  }else{
    return -1;
  }
}


// Drawing the default 2 octave keybord (in black and white)
function drawKeyboard() {
  fill(255);
  for(var i = 0;i<24;i++){
    drawKey(i);
  }
}


// Drawing the key of a scale array passed in argument according to color presets
function colorScale(scale){
  for(var i = 0; i < scale.length; i++){
    if (i == 0){
      drawKey(scale[i], colorPreset1);
    }else{
      drawKey(scale[i], colorPreset3);
    }
  }
}


// Drawing any key in a color passed in argument
function drawKey(keyNum, color = -1) {
  if (whiteKeyNumber.indexOf(keyNum) != -1) {
    drawWhiteKey(whiteKeyNumber.indexOf(keyNum), color);
  }
  if (blackKeyNumber.indexOf(keyNum) != -1){
    drawBlackKey(blackKeyNumber.indexOf(keyNum), color);
  }
}


// Drawing a white key in a color passed in argument
function drawWhiteKey(whiteKeyNum, color){
  if(color == -1){color = 255}
  fill(color);
  if(whiteKeyShape[whiteKeyNum] == 1) {
    drawWhiteKeyShape1(whiteKeyNum);
  }else if (whiteKeyShape[whiteKeyNum] == 2) {
    drawWhiteKeyShape2(whiteKeyNum);
  }else if (whiteKeyShape[whiteKeyNum] == 3) {
    drawWhiteKeyShape3(whiteKeyNum);
  }
}


// Drawing the first white key shape (C,F)
function drawWhiteKeyShape1(whiteKeyNum) {
  beginShape();
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth, scaleOffsetY);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth, scaleOffsetY + whiteKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth, scaleOffsetY + whiteKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2, scaleOffsetY);
  endShape(CLOSE);
}

// Drawing the second white key shape (D,G,A)
function drawWhiteKeyShape2(whiteKeyNum) {
  beginShape();
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + blackKeyWidth/2, scaleOffsetY);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + blackKeyWidth/2, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth, scaleOffsetY + whiteKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth, scaleOffsetY + whiteKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2, scaleOffsetY);
  endShape(CLOSE);
}

// Drawing the third white key shape (E,B)
function drawWhiteKeyShape3(whiteKeyNum) {
  beginShape();
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + blackKeyWidth/2, scaleOffsetY);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + blackKeyWidth/2, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth, scaleOffsetY + blackKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth, scaleOffsetY + whiteKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth, scaleOffsetY + whiteKeyHeight);
  vertex(scaleOffsetX + whiteKeyNum * whiteKeyWidth + whiteKeyWidth, scaleOffsetY);
  endShape(CLOSE);
}

// Drawing a black key in a color passed in argument
function drawBlackKey(blackKeyNum, color){
  if(color == -1){color = 0}
  if(color == colorPreset1){color = colorPreset2}
  if(color == colorPreset3){color = colorPreset4}
  fill(color);
  blackKeyNum = blackKeyPattern[blackKeyNum];
  rect(scaleOffsetX+whiteKeyWidth-(blackKeyWidth/2)+(blackKeyNum*whiteKeyWidth),scaleOffsetY,blackKeyWidth,blackKeyHeight);
}
