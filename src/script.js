// initializing all required variables
var setupDom;
var testDom;
var scaleName;
var scaleSel;
var currentScale;
var currentKeyScale;
var currentIntervals;
var currentRoot;
var currentMode;
var customScale;
var currentState; // 0 (setup) / 1 (test)
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


// Executing the loadFunction at load
window.addEventListener("load", function(){
    loadFunction();
});


// Setting up everything needed, function executed only once at load
function loadFunction(){
  // getting dom elements needed for the script
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
  // Setting up the setup state's dom elemnts
  rootCheck.checked = true;
  relativeCheck.checked = true;
  scaleSel.selectedIndex = 0;
  // Setting up custom scale to match current scale
  customScale = [0,2,4,5,7,9,11];
  // Setting up dom elements's onChange functions
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
  // Entering setup state
  startSetup();
}


// Checking root/relative/mode answer
function checkAnswer(){
  // Getting current answer don element
  rootSelAnswer = rootSel.options[rootSel.selectedIndex].value;
  relativeSelAnswer = relativeSel.options[relativeSel.selectedIndex].value;
  modeSelAnswer = modeSel.options[modeSel.selectedIndex].value;
  // Checking answer and printing correction
  if(isComplete()){
    if(isCorrect()){
      answerLab.innerHTML = "GG";
      nextBout.disabled = false;
    }else{
      answerLab.innerHTML = "Nope !";
    }
  }
}


// Checking if all needed test dom elements were answered
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


// Checking if all needed answer are correct
function isCorrect(){
  if(rootCheck.checked && relativeCheck.checked){
    return rootSelAnswer == currentRoot && modeSelAnswer == currentMode && relativeSelAnswer == calculateRelative();
  }else if (rootCheck.checked) {
    return rootSelAnswer == currentRoot && modeSelAnswer == currentMode;
  }else if (relativeCheck.checked) {
    return modeSelAnswer == currentMode && relativeSelAnswer == calculateRelative();
  }else {
    return modeSelAnswer == currentMode;
  }
}


// Calculating the correct answer for the root of the relative scale
function calculateRelative(){
  // Calculating relative
  var relative = currentKeyScale[currentIntervals.length-currentMode];
  // Keeping the relative in the first octave to match the relative selected value
  if(relative > 11){
    relative = relative - 12;
  }
  return relative;
}


// Updating/Drawing current scale and current interval according to current selected scale
function updateScale(){
  // Getting current scale selector value
  scaleName = scaleSel.options[scaleSel.selectedIndex].value;
  // Setting up currentScale variable according to current selected scale
  if (scaleName == "major"){
    currentScale = [0,2,4,5,7,9,11];
  }else if (scaleName == "natMinor"){
    currentScale = [0,2,3,5,7,8,10];
  }else if (scaleName == "harMinor"){
    currentScale = [0,2,3,5,7,8,11];
  }else if (scaleName == "custom"){
    currentScale = [...customScale];
  }
  // Updating current custom scale
  customScale = [...currentScale];
  // Drawing current selected scale
  drawKeyboard();
  colorScale(currentScale);
  // Updating current interval according to current selected scale
  currentIntervals = calculateIntervals([...currentScale]);
}


// Calculating an interval array from a given scale array
function calculateIntervals(scale){
  var intervals = [];
  // Setting up scale array for the interval calculation process
  scale.push(scale[0]+12);
  // Calculating interval array
  var prec = scale[0];
  for(var i = 1; i < scale.length; i++){
    intervals.push(scale[i]-prec)
    prec = scale[i];
  }
  return [...intervals];
}


// Setting up setup state
function startSetup(){
  currentState = 0;
  // Displaying start setup dom element
  setupDom.style.display = "flex";
  testDom.style.display = "none";
  updateScale();
}


// Setting up test state, function exectuted from the startTest button every time the user enter the test state
function startTest(){
  currentState = 1;
  // Displaying needed dom elements
  setupDom.style.display = "none";
  testDom.style.display = "flex";
  if(rootCheck.checked){
    rootDiv.style.display = "block";
  }else{
    rootDiv.style.display = "none";
  }
  if(relativeCheck.checked){
    relativeDiv.style.display = "block";
    // Displaying the right question for the current relative root according to current slected scale
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


// Updating the options of the mode select accoding to the current selected scale
function updateModeSel(){
  modeSel.innerHTML = "";
  var option = document.createElement("option");
  option.appendChild(document.createTextNode("-"));
  option.value = -1;
  modeSel.appendChild(option);
  var currentModeSet;
  var currentMode = scaleSel.options[scaleSel.selectedIndex].value;
  if(scaleName == "major"){
    currentModeSet = majorModes;
  }else if(scaleName == "natMinor"){
    currentModeSet = natMinorModes;
  }else if(scaleName == "harMinor"){
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


// Starting a new test
function newTest(){
  // Selecting a new random root and mode
  currentRoot = Math.floor(Math.random() * 11);
  currentMode = Math.floor(Math.random() * (currentIntervals.length-1));
  // Calculating current displayed scale (currentKeyScale) and intervals from the root and mode
  currentKeyScale = calculateScale(currentRoot, [...currentIntervals], currentMode); //[...array] used to send a copy of the array not the array itself
  // Setting up test state dom elemnts for new test
  rootSel.value = -1;
  modeSel.value = -1;
  relativeSel.value = -1;
  answerLab.innerHTML = "";
  nextBout.disabled = true;
  // Displaying the test scale
  drawKeyboard();
  colorScale(currentKeyScale);
}


// Calculating a scale array from a root / mode / intervals array
function calculateScale(root, intervals, mode){
  var scale = [root];
  intervals = concat(intervals.slice(mode),intervals.slice(0,mode));
  for(var i = 0; i < intervals.length-1; i++){
    scale.push(scale[i] + intervals[i]);
  }
  return [...scale];
}
