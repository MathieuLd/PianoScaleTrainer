var setupDom;
var testDom;
var scaleName;
var scaleSel;
var currentScale;
var currentIntervals;
var currentRoot;
var currentMode;
var customScale = [0,2,4,5,7,9,11];
var currentState; // 0 = setup / 1 = test
var modeSel;
var rootSel;


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
  scaleSel.onchange = function() {
    updateScale();
  }
  startSetup();
}

function updateScale(){
  drawKeyboard();
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
  updateModeSel();
  newTest();
}

function updateModeSel(){
  modeSel.innerHTML = "";
  var option = document.createElement("option");
  option.appendChild(document.createTextNode("-"));
  option.value = -1;
  modeSel.appendChild(option);
  for(var i = 0; i < currentIntervals.length; i++){
    option = document.createElement("option");
    option.appendChild(document.createTextNode("mode "+i));
    option.value = i;
    modeSel.appendChild(option);
  }
}

function newTest(){
  currentRoot = Math.floor(Math.random() * 11);
  currentMode = Math.floor(Math.random() * (currentIntervals.length-1));
  currentScale = calculateScale(currentRoot, currentIntervals.slice(), currentMode); //slice used to send a copy of the array not the array itself
  rootSel.value = -1;
  modeSel.value = -1;
  relativeSel.value = -1;
  drawKeyboard();
  colorScale(currentScale);
}

function calculateScale(root, intervals, mode){
  var scale = [root];
  intervals = concat(intervals.slice(mode),intervals.slice(0,mode));
  for(var i = 0; i < intervals.length-1; i++){
    scale.push(scale[i] + intervals[i]);
  }
  return scale;
}
