/*  This is part of the DCC++ EX Project for model railroading and more.
    For licence information, please see index.html.
    For more information, see us at dcc-ex.com.

    storageController.js

    Manages the setting storage capabilities
*/

$(document).ready(function(){
  // This is displays message about Local storage Support of the Local browser
  if (typeof Storage !== "undefined") {
    console.log("Your browser supports Local Storage");
  } else {
    console.log("Sorry! Your browser does not supporting Local Storage");
  }

  // Opens NEW MAP window with all fields empty
  $("#add-map").on("click", function () {
    $("#save-fn-map").attr("mode", "new");
    $(".fn-heading").html("New Mapping");
    showBtnConfig({ mname: "", fnData: fnMasterData });
  });

  // This will Load buttons on selecting a map from the select box
  $("#select-map").change(function () {
    selectedval = $(this).val();
    if (selectedval != "default") {
      data = getStoredMapData(selectedval);
      loadButtons(data);
    } else {
      loadButtons({ mname: "default", fnData: fnMasterData });
    }
  });

  // Opens MAP window with all fields filled from the selected map that allows editing Map
  $(document).on("click", "#edit-cur-map", function () {
    $("#save-fn-map").attr("mode", "edit");
    $(".fn-heading").html("Edit Mapping");
    selectedval = $("#cur-map-val").attr("cur-map");
    if (selectedval != "Default") {
      data = getStoredMapData(selectedval);
      showBtnConfig(data);
    } else {
      alert("Cannot edit Default mapping!");
    }
    //showBtnConfig();
  });

  // Closes MAP window on clicking X icon
  $("#close-model").on("click", function () {
    $("#fnModal").hide();
  });

  //This will check for Save mode (NEW MAP / EDIT MAP) and delegate the functionality
  $("#save-fn-map").on("click", function () {
    mode = $(this).attr("mode");
    // alert(mode); // debug line
    if (mode == "new") {
      addNewMap();
    } else {
      editMap();
    }
  });

  //Allows user to download the selected map in .JSON format
  $(document).on("click", "#export-cur-map", function () {
    map = $("#cur-map-val").attr("cur-map");
    if (map != "default") {
      downloadMapData(map);
    } else {
      alert("Please select Custom map");
    }
  });

  // This remove whole exthrottle app data but with confirmation
  $("#wipe-map").on("click", function () {
    var r = confirm("Are you sure on deletion?");
    if (r == true) {
      window.localStorage.removeItem("mapData");
      console.log("!!!!!!MAPS WIPED!!!!!!");
      loadmaps();
    }
  });

  // This allows user to download whole exthrottle app data
  $("#export-all-maps").on("click", function () {
    exportMapData();
  });

  // This allows user to upload previously downloaded Map (JSON format must adhere)
  $(document).on("click", "#import-map", function (e) {
    e.preventDefault();
    $("#map-upload").trigger("click");
  });
  // This part with above which is responsible for actual file upload for MAP
  $("#map-upload").on("change", function (e) {
    var file = e.target.files[0];
    var field = $(this);
    var freader = new FileReader();
    freader.onload = function (evt) {
      data = JSON.parse(evt.target.result);
      setMapData(data);
      field.val("");
    };
    freader.readAsText(file);
  });

  // This is responsible for Cab upload
  $("#cabs-upload").on("change", function (e) {
    var file = e.target.files[0];
    var field = $(this);
    var freader = new FileReader();
    freader.onload = function (evt) {
      data = JSON.parse(evt.target.result);
      importLocoData(data);
      field.val("");
    };
    freader.readAsText(file);
  });

  // This allows user to upload previously downloaded MAP DATA (JSON format must adhere)
  $(document).on("click", "#import-all-maps", function (e) {
    e.preventDefault();
    //$("#appdata-upload").attr("mode", "mapData");
    $("#maps-upload").trigger("click");
  });

  // This part of above which is responsible for actual file upload for MAP DATA
  $("#maps-upload").on("change", function (e) {
    var file = e.target.files[0];
    var field = $(this);
    var freader = new FileReader();
    freader.onload = function (evt) {
      data = JSON.parse(evt.target.result);
      importMapdata(data);
      field.val("");
    };
    freader.readAsText(file);
  });

  // Set height of throttle container according to functions panel
  $(".throttle-container").height($(".functionKeys").first().height());

  //Temparory function Shows APP DATA in console
  $("#loco-info").on("click", function () {
    console.log(getMapData());
  });

  //Functions for the storage page in settings

  $("#backup-app-settings").on("click", function () {
    exportAppData();
  });

  // This allows user to upload previously downloaded APP DATA (JSON format must adhere)
  $("#restore-app-settings").on("click", function (e) {
    e.preventDefault();
    $("#app-upload").trigger("click");
  });

  // This part of above which is responsible for actual file upload for APP DATA
  $("#app-upload").on("change", function (e) {
    var file = e.target.files[0];
    var field = $(this);
    var freader = new FileReader();
    freader.onload = function (evt) {
      data = JSON.parse(evt.target.result);
      importAppdata(data);
      field.val("");
    };
    freader.readAsText(file);
  });

  $("#wipe-app-settings").on("click", function () {
    var r = confirm("Are you sure on deletion?");
    if (r == true) {
      window.localStorage.removeItem("mapData");
      window.localStorage.removeItem("cabList");
      window.localStorage.removeItem("userpref");
      console.log("!!!!!DATA IS WIPED!!!!!!");
      loadmaps();
    }
  });

});

// Load all maps to select box
function loadmaps(){
  $("#select-map").empty();
  $("#select-map").append($("<option />").val("default").text("Default"));
  getMapData().forEach(map => {
    $("#select-map").append($("<option />").val(map.mname).text(map.mname));
  })
}

// Load button layout of selected Map
function loadButtons(data){
  $("#fn-wrapper").empty();
  $.each(data.fnData, function(key, value){
      isPressed = value[0] != 0 ? true : false;
      btnType = value[1] != 0 ? "press" : "toggle";
      if(value[3]==1){
          $("#fn-wrapper").append(
          "<div class='fn-button form-group field-button-fn'> <button class='btn-default btn fn-btn "+btnType+"' data-type='"+
          btnType+"' aria-pressed='"+isPressed+"' name='"+key+"'  id='"+key+"'>"+
          value[2]+"</button>"
          +"</div>");
      }
  });
}

// Show the Custom Map fields inside Custom map window while adding and editing a Map.
function showBtnConfig(data){
  
  $("#fnModal").show();
  $('#fnModal').css({"top":"7%", "left": "18%"});
  $('#fnModal').draggable();
  $("#fnModal .fn-modal-content").empty();
  $("#fnModal .fn-modal-content").append('<div class="row header-row"><div class="column-2 header-col func-title">Map Name</div> <div class="column-5 header-col"><input type="text" class="fn-input" id="map-name" value="'+data.mname+'"/></div> <div class="column-3 header-col"></div></div>');
  $("#fnModal .fn-modal-content").append('<div class="row header-row"><div class="column-1 header-col">Function</div> <div class="column-4 header-col">Label</div> <div class="column-3 header-col">Button Type</div><div class="column-2 header-col">Visibility</div></div>');
  $.each(data.fnData, function(key, value){
      isPressed = value[0] != 0 ? true : false;
      btnType = value[1] != 0 ? "press" : "toggle";
      btnpress = value[1] == 1 ? "checked" : "";
      btnToggle = value[1] == 0 ? "checked" : "";
      fvisible = value[3] == 1 ? "checked" : "";
      $("#fnModal .fn-modal-content").append('<div class="row edit-row" id="'+key+'">'+ 
      '<div class="column-1 func-title">'+key +'</div>'+
      '<div class="column-4"> <input class="fn-input" name="'+key+'" id="'+key+'" value="'+value[2]+'"/>'+
      '<span class="focus-border"><i></i></span>'+
      '</div>'+
      '<div class="fn-radio column-3" name="'+key+'Type" id="'+key+'Type">'+
          '<input type="radio" id="'+key+'press" name="btn'+key+'Type" value="press" '+btnpress+'/>'+
          '<label for="'+key+'press">Momentary</label>  &nbsp;'+
          '<input type="radio" id="'+key+'toggle" name="btn'+key+'Type" value="toggle" '+btnToggle+'/>'+
      '<label for="'+key+'toggle">Latching</label>'+ 
      '</div>'+
      '<div class="fn-chkbox column-2" name="'+key+'Visible" id="'+key+'Type">'+
          '<input type="checkbox" id="'+key+'Visible" name="'+key+'Visible" '+fvisible+'/>'+
          '<label for="'+key+'Visible">Show</label>  &nbsp;'+
      '</div>'+
      '</div>');
  });
}

// Saves New Map data to Local storage
function addNewMap(){
    customFnData = {};
    $(".edit-row").each(function (val) {
      key = $(this).find(".func-title").text();
      btnType = $(this).children().find("input[type='radio']:checked").val() == "press" ? 1  : 0;
      fnvisible = $(this).children().find("input[type='checkbox']").prop("checked") ? 1  : 0;
      arr = [0, btnType, $(this).children().find(".fn-input").val(), fnvisible];
      customFnData[key] = arr;
    });
    mapName = $.trim($("#map-name").val());
    if (!ifExists(mapName)) {
      if (mapName) {
        // Send data to store in Local storage
        setMapData({ mname: mapName, fnData: customFnData });
        $("#fnModal").hide();
        setFunctionMaps();
        alert("Map Saved Sucessfully");
      } else {
        alert("Name is missing!!");
      }
    } else {
      alert("Map with the Name already exists!! Please change the Map name..");
    }
}

// Saves Edited Map data to local storage
function editMap(){
  customFnData = {};
  $(".edit-row").each(function(val){
      key = $(this).find(".func-title").text();
      btnType = $(this).children().find("input[type='radio']:checked").val() == "press" ? 1 : 0;
      fnvisible = $(this).children().find("input[type='checkbox']").prop('checked') ? 1 : 0;
      arr = [ 0, btnType, $(this).children().find(".fn-input").val(), fnvisible ];
      customFnData[key] = arr;             
  });
  mapName = $.trim($("#map-name").val());
    if (mapName) {
      setMapData({ mname: mapName, fnData: customFnData });
      $("#fnModal").hide();
      setFunctionMaps();
      loadMapData(mapName);
      alert("Map Saved Sucessfully");
    } else {
      alert("Name is missing!!");
    }
}

//*** Saves given data into Local storage**/
// Create new data object if one does not exist
// Verify if the given Map data already exists and replace it
// Or Create new map data and inserts it into local storage object
// Finally Saves the Data into Local storage */
function setMapData(mapdata) {
  if (typeof Storage === "undefined") {
    return;
  }

  const smapdata = getMapData()

  if (ifExists(mapdata.mname)) {
    smapdata.find(function (item, i) {
      if (item.mname == mapdata.mname) {
        item.fnData = mapdata.fnData;
      }
    });
  } else {
    smapdata.push(mapdata);
  }
  window.localStorage.setItem('mapData', JSON.stringify(smapdata));

  loadmaps();
  setFunctionMaps();
  loadMapData(mapdata.mname);
  $("#select-map").val(mapdata.mname).trigger("change");

}

//Returns the Map data of given Map name
function getStoredMapData(name){
  const data = getMapData();
  if(data !=null){
    return data.find(function(item, i){
      if(item.mname == name){
        return item.fnData;
      }
    });
  }else{
    return null;
  }
}

//Download the Map data of given Map name
function downloadMapData(mapName){
  data = JSON.stringify(getStoredMapData(mapName));
  const a = document.createElement("a");
  const file = new Blob([data], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = mapName+".json";
  a.click();
}

//Delete the Map data of given Map name
function deleteFuncData(name){
  var r = confirm("Are you sure on deletion?");
  if (r == true) {
    if (typeof(Storage) !== "undefined") {
      curmapdata = []; 
      const data = getMapData()
      if(!data){
        alert("No Data stored");
      }else{
          data.find(function(item, i){
            if(item.mname != name){
              curmapdata.push(item);
            }
          });    
          window.localStorage.setItem('mapData', JSON.stringify(curmapdata));
      }
    } 
  }
}

/**
 * Returns the Map data of ExWebThrottle
 * @return {[]}
 */
function getMapData(){
  if (typeof Storage === "undefined") {
    return [];
  }

  const localMapData = JSON.parse(window.localStorage.getItem("mapData"));

  return localMapData || []
}

// Returns boolen if the given Map exists in local storage
function ifExists(name) {
  const data = getMapData()
  const existingItem = data.find((item) => item.mname === name);
  return !!existingItem;
}

//Download all Maps of EXthrottle
function exportMapData() {
  const data = getMapData()
  const a = document.createElement("a");
  const file = new Blob([data], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = "ListofMaps.json";
  a.click();
}

function importMapdata(data){
  if(data){
      window.localStorage.setItem('mapData', JSON.stringify(data));
      loadmaps();
      $("#select-map").val('default').trigger("change");
      setFunctionMaps();
    }
}
//Import the Locomotives List data
function importLocoData(data) {
  if (data) {
    window.localStorage.setItem("cabList", JSON.stringify(data));
    loadLocomotives();
    locoList = getLocoList();
  }
}

/*************************************************/
/********** Locomotives Data functions ***********/
/*************************************************/

function saveLocomotive(data){
  locodata = $(data).arrayToJSON();
  if (typeof Storage !== "undefined") {
    curCabList = [];
    cabData = JSON.parse(window.localStorage.getItem("cabList"));
    if (!cabData) {
      curCabList.push(locodata);
      window.localStorage.setItem("cabList", JSON.stringify(curCabList));
      return true;
    } else {
      cabData.push(locodata);
      window.localStorage.setItem("cabList", JSON.stringify(cabData));
      return true;
    }
  }
  return false;
}

function saveEditedLocomotive(data, id){
  locodata = $(data).arrayToJSON();
  if (typeof Storage !== "undefined") {
    cabData = JSON.parse(window.localStorage.getItem("cabList"));
    cabData.find(function (item, i) {
      if (i == id) {
        cabData[i] = locodata;
      }
    });
    window.localStorage.setItem("cabList", JSON.stringify(cabData));
  }
}

function ifLocoExists(name) {
  data = JSON.parse(window.localStorage.getItem("cabList"));
  found = false;
  if (data != null) {
    data.find(function (item, i) {
      if (item.name == name) {
        found = true;
      }
    });
    return found;
  }
  return found;
}

 // Returns the AppData of ExWebThrottle
function getLocoList(){
    if (typeof Storage !== "undefined") {
      return JSON.parse(window.localStorage.getItem("cabList"));
    }else{
      return [];
    }
}

//Download the Locomotives List data
function downloadCabData(){
  data = JSON.stringify(getLocoList());
  const a = document.createElement("a");
  const file = new Blob([data], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = "CabList.json";
  a.click();
}

// Returns the LocoData of ExWebThrottle
function getStoredLocoData(name) {
  console.log(name);
  data = JSON.parse(window.localStorage.getItem("cabList"));
  if (data != null) {
    return data.find(function (item, i) {
      if (item.name == name) {
        return item;
      }
    });
  } else {
    return null;
  }
}

/********************************************/
/**************  Preferences  ***************/
/********************************************/

// Get a given user preference
function getPreference(pref){
  if (window.localStorage.getItem("userpref") != null) {
    curpref = JSON.parse(window.localStorage.getItem("userpref"));
    return curpref[pref];
  } else {
    return null;
  }
}

// Set a given user preference
function setPreference(pref, val){
  if (window.localStorage.getItem("userpref") != null){
    curpref = JSON.parse(window.localStorage.getItem("userpref"));
  }else{
    curpref = {};
  }
  curpref[pref] = val;
  setUserPreferences(curpref);
}

// Store user preferences in local storage
function setUserPreferences(pref){
  if (typeof(Storage) !== "undefined") {  
    window.localStorage.setItem("userpref", JSON.stringify(pref));  
  }
}

function getUserPreferences() {
  if (typeof Storage !== "undefined") {
      return JSON.parse(window.localStorage.getItem("userpref"));
  }else{
    return [];
  }
}

function importPrefData(data) {
  if (data) {
    window.localStorage.setItem("userpref", JSON.stringify(data));
  }
}

function exportAppData(){
  const jsonObj = [
    {maps: getMapData()},
    {locos: getLocoList()},
    {preferences: getUserPreferences()}
  ]
  const data = JSON.stringify(jsonObj);
  const a = document.createElement("a");
  const file = new Blob([data], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = "AppData.json";
  a.click();
  
}

function  importAppdata(data){
  importMapdata(data[0]["maps"]);
  importLocoData(data[1]["locos"]);
  importPrefData(data[2]["preferences"]);
  setThrottleScreenUI(); 
}


(function ($) {
    $.fn.arrayToJSON = function () {
      var o = {};
      $.each($(this), function () {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || "");
        } else {
          o[this.name] = this.value || "";
        }
      });
      return o;
    };
  }
)(jQuery);
