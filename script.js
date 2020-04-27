var setupDom;
var testDom;
var scaleName;
var scaleSel;
var currentScale;
var currentIntervals;
var currentRoot;


window.addEventListener("load", function(){
    loadFunction();

});

function loadFunction(){
  setupDom = document.getElementById("setupState");
  testDom = document.getElementById("testState");
  startSetup();
}

function updateScale(){
  scaleSel = document.getElementById("scaleSel");
  scaleName = scaleSel.options[scaleSel.selectedIndex].value;
  if (scaleName == "major"){
    currentScale = [0,2,4,5,7,9,11];
  }
  colorScale(currentScale);
  currentIntervals = calculateIntervals(currentScale);
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
  setupDom.style.display = "block";
  testDom.style.display = "none";
  drawKeyboard();
  updateScale();
}


function startTest(){
  setupDom.style.display = "none";
  testDom.style.display = "block";
  newTest();
}

function newTest(){
  currentRoot = Math.floor(Math.random() * 11);
  //console.log(currentIntervals);
  currentScale = calculateScale(currentRoot, currentIntervals);
  console.log(currentScale);
  drawKeyboard();
  colorScale(currentScale);
}

function calculateScale(root, intervals){
  var scale = [root];
  for(var i = 0; i < intervals.length-1; i++){
    scale.push(scale[i] + intervals[i]);
  }
  return scale;
}
