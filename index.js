window.$on = function(target, type, cb){
  target.addEventListener(type, cb, false);
}
//IIFE - Immediately Invoked Function Expression;
var CORE = (function(){
"use strict";
  var modules = {};
  function addModule(module_id, module){
    modules[module_id] = module;
  }

  function registerEvents(evt, module_id){
    var theMod = modules[module_id];
    theMod.events = evt;
  }

  function triggerEvents(evt) {
    var mod;
    for(mod in modules){
      if(modules.hasOwnProperty(mod)){
      mod = modules[mod];

      if(mod.events && mod.events[evt.type]){
        mod.events[evt.type](evt.data)
      }   }  }
}
  return {    addModule: addModule,
    registerEvents: registerEvents,
    triggerEvents: triggerEvents
  }})();

var sb = (function(){
    function listen(evt, module_id){
      CORE.registerEvents(evt, module_id)
    }
    function notify(evt) {
      CORE.triggerEvents(evt)
    }
    return {    listen: listen,
    notify: notify
    }})();

var calculateTmp =( function(){
  var id, el, tmpunits, tmp, convert;
  id = "temperatures";
  function init(){
    el = document.getElementById("add-contact");
    tmpunits = document.getElementById("tmpunits");
    tmp = document.getElementById("tmpval");
    convert = document.getElementById("convert");
    $on(convert, "click", convertTmp);
   sb.listen({"displayForm":displayForm}, id);
  }

  function convertTmp(e){
    var fahrenheight, kelvin, kelvin;
    var convertedVals = {};
    e.preventDefault();
    tmpunit = tmpunits.value;
    tmpval = parseInt(tmp.value);
    convertedVals.tmpunit = tmpunit;
    convertedVals.supplied = tmpval;

    if(tmpunit ===  "C"){
      fahrenheight = ((tmpval * 1.8) + 32).toFixed(2);
      kelvin = ((tmpval + 273.15)).toFixed(2);
      convertedVals.fahrenheight = fahrenheight;
      convertedVals.kelvin = kelvin;
    }else if(tmpunit === "F"){
      celsius = ((tmpval - 32) * 0.5556).toFixed(2);
      kelvin = ((tmpval - 32) * 0.5556 + 273.15).toFixed(2);
      convertedVals.celsius = celsius;
      convertedVals.kelvin = kelvin;
    }else if(tmpunit === "K"){
      fahrenheight = ((tmpval - 273.15) * 1.8 + 32).toFixed(2);
       celsius = (tmpval - 273.15).toFixed(2);
       convertedVals.fahrenheight = fahrenheight;
       convertedVals.celsius = celsius;
    }
    //where to call data validate function
    sb.notify({type:"convertedValues", data:convertedVals})
    el.classList.toggle("module-active");

  }
  function displayForm(){
    tmp.value = "";
       el.classList.toggle("module-active");
  }

return {
  id:id,
  init:init,
  convertTmp:convertTmp
}
}());




var displayValues = (function (){
  var id, dspTmp;
  id = "displayTemperatures";
function init(){
  dspTmp = document.getElementsByClassName("add-contact")[0];
  sb.listen({"convertedValues":tempValues}, id);
   $on(dspTmp, "click", displayForm);
}

function tempValues (vals){
  var ul = document.getElementById("contact-list");
  var li = document.createElement("li");
  var p = document.createElement("p");
  var hr = document.createElement("hr");

  var h3 =document.createElement("h3");
  var heading = document.createTextNode("Conversion Result");
  h3.appendChild(heading);
  ul.appendChild(h3);
  ul.appendChild(hr);

  var div = document.createElement("div");
  var s = document.createTextNode("Supplied Value: "+vals.supplied);
  div.appendChild(s);
  ul.appendChild(div);

  var suppledunits = document.createTextNode("Supplied Unit: "+vals.tmpunit);
  var div2 = document.createElement("div");
  div2.appendChild(suppledunits);
  ul.appendChild(div2);

  var f = document.createTextNode("To Fahrenheight: "+vals.fahrenheight);
  var k = document.createTextNode("To Kelvin: "+vals.kelvin);
  var c = document.createTextNode("To Celsius: "+vals.celsius);

  var p = document.createElement("p");
  var pp = document.createElement("p");
  var ppp = document.createElement("p");

  if(vals.fahrenheight){
      p.appendChild(f);
      li.appendChild(p);

    }
  if (vals.kelvin) {
      pp.appendChild(k);
      li.appendChild(pp);

    }

  if (vals.celsius) {
      ppp.appendChild(c);
      li.appendChild(ppp);
         }

  ul.appendChild(li);
    contacts.classList.toggle("module-active");
}

function displayForm(e){
    sb.notify({type:"displayForm", data:null});
    contacts.classList.toggle("module-active");
    e.preventDefault();
  }

  return {
    id:id,
    init:init,
    tempValues:tempValues
  }

})()
CORE.addModule(calculateTmp.id, calculateTmp);
CORE.addModule(displayValues.id, displayValues);

calculateTmp.init();
displayValues.init();
