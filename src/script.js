var setupDom;
var testDom;
var scaleName;
var scaleSel;
var currentScale;
var currentKeyScale;
var currentIntervals;
var currentRoot;
var currentMode;
var customScale = [0,2,4,5,7,9,11];
var currentState; // 0 = setup / 1 = test
var modeSel;
var rootSel;
var nextBout;
var showRoot;
var showRelative;
var rootDiv;
var relativeDiv;
var relativeLab;
var majorModes = ["ionian - major", "dorian", "phrygian", "lydian", "mixolydian", "aeolian - minor", "locrian"];
var natMinorModes = ["aeolian - minor", "locrian", "ionian - major", "dorian", "phrygian", "lydian", "mixolydian"];
var harMinorModes = ["Harmonic minor","locrian 6","ionian #5","dorian #4","phrygian dominant","lydian #2","super locrian bb7"];


window.addEventListener("load", function(){
    loadFunction();
});

function loadFunction(){
  setupDom = document.getElementById("setupState");
  testDom = document.getElementById("testState");
  scaleSel = document.getElementById("scaleSel");
  modeSel = document.getElementById("modeSel");
  rootSel = document.getElementById("rootSel");
  relativeSel = document.getElementById("relativeSel");
  answerLab = document.getElementById("answer");
  nextBout = document.getElementById("next");
  rootCheck = document.getElementById("rootToggle");
  relativeCheck = document.getElementById("relativeToggle");
  rootDiv = document.getElementById("rootDiv");
  relativeDiv = document.getElementById("relativeDiv");
  relativeLab = document.getElementById("relativeLab");
  rootCheck.checked = true;
  relativeCheck.checked = true;
  scaleSel.selectedIndex = 0;
  scaleSel.onchange = function() {
    updateScale();
  }
  rootSel.onchange = function() {
    checkAnswer();
  }
  relativeSel.onchange = function() {
    checkAnswer();
  }
  modeSel.onchange = function() {
    checkAnswer();
  }
  startSetup();
}

function checkAnswer(){
  rootSelAnswer = rootSel.options[rootSel.selectedIndex].value;
  relativeSelAnswer = relativeSel.options[relativeSel.selectedIndex].value;
  modeSelAnswer = modeSel.options[modeSel.selectedIndex].value;
  if(isComplete()){
    if(isCorrect()){
      answerLab.innerHTML = "True";
      nextBout.disabled = false;
    }else{
      answerLab.innerHTML = "False";
    }
  }
}

function isComplete(){
  if(rootCheck.checked && relativeCheck.checked){
    return rootSelAnswer != -1 &&  modeSelAnswer != -1 && relativeSelAnswer != -1;
  }else if (rootCheck.checked) {
    return rootSelAnswer != -1 != -1 && modeSelAnswer != -1;
  }else if (relativeCheck.checked) {
    return modeSelAnswer != -1 && relativeSelAnswer != -1;
  }else {
    return modeSelAnswer != -1;
  }
}

function isCorrect(){
  if(rootCheck.checked && relativeCheck.checked){
    return rootSelAnswer == currentRoot && modeSelAnswer == currentMode && checkRelative(relativeSelAnswer);
  }else if (rootCheck.checked) {
    return rootSelAnswer == currentRoot && modeSelAnswer == currentMode;
  }else if (relativeCheck.checked) {
    return modeSelAnswer == currentMode && checkRelative(relativeSelAnswer);
  }else {
    return modeSelAnswer == currentMode;
  }
}

function checkRelative(answer){
  var relative = calculateScale(currentRoot,currentIntervals,currentMode)[currentIntervals.length - currentIntervals.length - currentMode];
  if(relative > 11){
    relative = relative - 12;
  }
  if(answer == relative){
    return true;
  }else{
    return false;
  }
}

function updateScale(){
  scaleName = scaleSel.options[scaleSel.selectedIndex].value;
  if (scaleName == "major"){
    currentScale = [0,2,4,5,7,9,11];
  }else if (scaleName == "natMinor") {
    currentScale = [0,2,3,5,7,8,10];
  }else if (scaleName == "harMinor") {
    currentScale = [0,2,3,5,7,8,11];
  }else if (scaleName == "custom"){
    currentScale = customScale;
  }
  customScale = currentScale;
  drawKeyboard();
  colorScale(currentScale);
  currentIntervals = calculateIntervals(currentScale.slice());
}



function calculateIntervals(scale){
  var intervals = [];
  scale.push(scale[0]+12);
  var prec = scale[0];
  for(var i = 1; i < scale.length; i++){
    intervals.push(scale[i]-prec)
    prec = scale[i];
  }
  return intervals;
}


function startSetup(){
  currentState = 0;
  setupDom.style.display = "block";
  testDom.style.display = "none";
  updateScale();
}


function startTest(){
  currentState = 1;
  setupDom.style.display = "none";
  testDom.style.display = "block";
  if(rootCheck.checked){
    rootDiv.style.display = "block";
  }else{
    rootDiv.style.display = "none";
  }
  if(relativeCheck.checked){
    relativeDiv.style.display = "block";
    if (scaleName != "custom"){
      relativeLab.innerHTML = "Relative " + scaleSel.options[scaleSel.selectedIndex].innerHTML.toLowerCase() + " ?";
    }else{
      relativeLab.innerHTML = "Relative mode 0 ?";
    }
  }else{
    relativeDiv.style.display = "none";
  }
  updateModeSel();
  newTest();
}

function updateModeSel(){
  modeSel.innerHTML = "";
  var option = document.createElement("option");
  option.appendChild(document.createTextNode("-"));
  option.value = -1;
  modeSel.appendChild(option);
  var currentModeSet;
  var currentMode = scaleSel.options[scaleSel.selectedIndex].value;
  if(currentMode == "major"){
    currentModeSet = majorModes;
  }else if(currentMode == "natMinor"){
    currentModeSet = natMinorModes;
  }else if(currentMode == "harMinor"){
    currentModeSet = harMinorModes;
  }else{
    currentModeSet = -1;
  }
  for(var i = 0; i < currentIntervals.length; i++){
    option = document.createElement("option");
    if(currentModeSet != -1){
      option.appendChild(document.createTextNode("mode "+(i+1)+" ("+currentModeSet[i]+")"));
    }else{
      option.appendChild(document.createTextNode("mode "+(i+1)));
    }
    option.value = i;
    modeSel.appendChild(option);
  }
}

function newTest(){
  currentRoot = Math.floor(Math.random() * 11);
  currentMode = Math.floor(Math.random() * (currentIntervals.length-1));
  currentKeyScale = calculateScale(currentRoot, currentIntervals.slice(), currentMode); //slice used to send a copy of the array not the array itself
  currentIntervals = calculateIntervals(currentScale.slice());
  rootSel.value = -1;
  modeSel.value = -1;
  relativeSel.value = -1;
  answerLab.innerHTML = "";
  nextBout.disabled = true;
  drawKeyboard();
  colorScale(currentKeyScale);
}

function calculateScale(root, intervals, mode){
  var scale = [root];
  intervals = concat(intervals.slice(mode),intervals.slice(0,mode));
  for(var i = 0; i < intervals.length-1; i++){
    scale.push(scale[i] + intervals[i]);
  }
  return scale;
}
