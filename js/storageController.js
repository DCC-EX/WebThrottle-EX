$(document).ready(function(){
              // This is displays message about Local storage Support of the Local browser
              if (typeof(Storage) !== "undefined") {
                console.log("Your browser is supporting Local Storage");
              } else {
                console.log("Sorry !! Your browser is not supporting Local Storage"); 
              }

              // Opens NEW MAP window with all fields empty
              $("#new-map").on('click', function(){
                $("#save-fn-map").attr("mode","new");
                $(".fn-heading").html("New Mapping");
                showBtnConfig({ mname: "" , fnData: fnMasterData});
              });

              // This will Load buttons on selecting a map from the select box
              $("#select-map").change(function () {
                  selectedval = $(this).val();    
                  if(selectedval != "default"){
                      data  = getStoredFuncData(selectedval);
                      loadButtons(data);
                  }else{
                      loadButtons({ mname: "default" , fnData: fnMasterData});
                  }
              });

              // Opens MAP window with all fields filled from the selected map that allows editing Map
              $("#edit-map").on('click', function(){
                  $("#save-fn-map").attr("mode","edit");
                  $(".fn-heading").html("Edit Mapping");
                  selectedval = $("#select-map").val();      
                  if(selectedval != "default"){
                      data  = getStoredFuncData(selectedval); 
                      showBtnConfig(data);
                  }else{
                      alert("Cannot edit Default mapping!");
                  }
              //showBtnConfig();
              });

              // Closes MAP window on clicking X icon
              $("#close-model").on('click', function(){
                $("#fnModal").hide();
              });

              //This will check for Save mode (NEW MAP / EDIT MAP) and delegate the functionality
              $("#save-fn-map").on('click', function(){
                mode = $(this).attr("mode");
                // alert(mode); // debug line
                if(mode=="new"){
                    addNewMap();  
                }else{
                    editMap();
                }  
              });

              //Allows user to download the selected map in .JSON format
              $("#download-map").on('click', function(){
                  map = $("#select-map").val();
                  if (map != 'default'){
                      downloadMapData(map);
                  }else{
                      alert("Please select Custom Map.");
                  }
              });

              // This remove who;e exthrottle app data but with confirmation
              $("#wipe-map").on('click', function(){
                var r = confirm("Are you sure on deletion?");
                if (r == true) {
                  window.localStorage.removeItem('locoData');
                  console.log("!!!!!!WIPED!!!!!!");
                  loadmaps();
                }
              });

              // This allows user to delete currently selected Map
              $("#delete-map").on('click', function(){
                selectedval = $("#select-map").val();      
                if(selectedval != "default"){
                  deleteFuncData(selectedval);
                  loadmaps();
                  $("#select-map").val("default").trigger("change");
                }
              });

              // This allows user to download whole exthrottle app data
              $("#backup-map").on('click', function(){
                getBackup();
              });

              // This allows user to upload previously downloaded Map (JSON format must adhere)
              $("#restore-map").on('click', function(e){
                e.preventDefault();
                $("#map-upload").trigger('click');
              });
              // This part of above which is responsible for actual file upload for MAP
              $("#map-upload").on('change',function(e){
                var file = e.target.files[0];
                var field = $(this);
                var freader = new FileReader();
                freader.onload =  function(evt){ 
                  data = JSON.parse(evt.target.result);
                  setLocoData(data);
                  field.val('');
                };
                freader.readAsText(file);
              });

              // This allows user to upload previously downloaded APP DATA (JSON format must adhere)
              $("#restore-app").on('click', function(e){
                e.preventDefault();
                $("#appdata-upload").trigger('click');
              });
              // This part of above which is responsible for actual file upload for APP DATA
              $("#appdata-upload").on('change',function(e){
                  var file = e.target.files[0];
                  var field = $(this);
                  var freader = new FileReader();
                  freader.onload =  function(evt){ 
                    data = JSON.parse(evt.target.result);
                    importAppData(data);
                    field.val('');
                  };
                  freader.readAsText(file);
              });

              // Set height of throttle container according to functions panel
              $(".throttle-container").height($(".functionKeys").first().height());

              //Temparory function Shows APP DATA in console
              $("#loco-info").on('click', function(){
                console.log(getWebData());
              });

});

// Load all maps to select box
function loadmaps(){
  $("#select-map").empty();
  $("#select-map").append($("<option />").val("default").text("Default"));
  $.each(getWebData(), function() {
    $("#select-map").append($("<option />").val(this.mname).text(this.mname));
  });
}

// Load button layout of selected Map
function loadButtons(data){
  $("#fn-wrapper").empty();
  $.each(data.fnData, function(key, value){
      isPressed = value[0] != 0 ? true : false;
      btnType = value[1] != 0 ? "press" : "toggle";
      if(value[3]==1){
          $("#fn-wrapper").append(
          "<div class='formbuilder-button form-group field-button-fn'> <button class='btn-default btn fn-btn "+btnType+"' data-type='"+
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
          '<label for="'+key+'press">Press</label>  &nbsp;'+
          '<input type="radio" id="'+key+'toggle" name="btn'+key+'Type" value="toggle" '+btnToggle+'/>'+
          '<label for="'+key+'toggle">Toggle</label>'+ 
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
  $(".edit-row").each(function(val){
      key = $(this).find(".func-title").text();
      btnType = $(this).children().find("input[type='radio']:checked").val() == "press" ? 1 : 0;
      fnvisible = $(this).children().find("input[type='checkbox']").prop('checked') ? 1 : 0;
      arr = [ 0, btnType, $(this).children().find(".fn-input").val(), fnvisible ];
      customFnData[key] = arr;             
  });
  mapName = $("#map-name").val();
  console.log(mapName);
  if(mapName){
      // Send data to store in Local storage
      setLocoData({ mname: mapName , fnData: customFnData});
      $("#fnModal").hide();
      alert('Map Saved Sucessfully');
  }else{
      alert("Name is missing!!");
  }
}

// Saves Edited Map data to local storage
function editMap(){
  if(!ifExists()){
      customFnData = {};
      $(".edit-row").each(function(val){
          key = $(this).find(".func-title").text();
          btnType = $(this).children().find("input[type='radio']:checked").val() == "press" ? 1 : 0;
          fnvisible = $(this).children().find("input[type='checkbox']").prop('checked') ? 1 : 0;
          arr = [ 0, btnType, $(this).children().find(".fn-input").val(), fnvisible ];
          customFnData[key] = arr;             
      });
      mapName = $("#map-name").val();
      console.log(mapName);
      if(mapName){
          setLocoData({ mname: mapName , fnData: customFnData});
          $("#fnModal").hide();
          alert('Map Saved Sucessfully');
      }else{
          alert("Name is missing!!");
      }
  }else{
      alert("Map with the Name already exists!! Please change the Map name.."); 
  }
}

//*** Saves given data into Local storage**/
// Create new data object if one does not exist
// Verify if the given Map data already exists and replace it
// Or Create new map data and inserts it into local storage object
// Finally Saves the Data into Local storage */
function setLocoData(data){
  if (typeof(Storage) !== "undefined") {
    curlocodata = []; 
    slocodata = JSON.parse(window.localStorage.getItem('locoData'));
    if(!slocodata){
        curlocodata.push(data);
        window.localStorage.setItem('locoData', JSON.stringify(curlocodata));
    }else{
     if(ifExists(data.mname)){
        slocodata.find(function(item, i){
          if(item.mname == data.mname){
            item.fnData=data.fnData;
          }
        });  
      }else{
        slocodata.push(data);
      }
      window.localStorage.setItem('locoData', JSON.stringify(slocodata));
    }
    loadmaps();
    $("#select-map").val(data.mname).trigger("change");
  }

}

//Returns the Map data of given Map name
function getStoredFuncData(name){
  data = JSON.parse(window.localStorage.getItem('locoData'));
  return data.find(function(item, i){
    if(item.mname == name){
      return item.fnData;
    }
  });
}

//Download the Map data of given Map name
function downloadMapData(mapName){
  getStoredFuncData(mapName);
  data = JSON.stringify(getStoredFuncData(mapName));
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
      curlocodata = []; 
      data = JSON.parse(window.localStorage.getItem('locoData'));
      if(!data){
        alert("No Data stored");
      }else{
          data.find(function(item, i){
            if(item.mname != name){
              curlocodata.push(item);
            }
          });    
          window.localStorage.setItem('locoData', JSON.stringify(curlocodata));    
          console.log("Not NULL");
      }
    } 
  }
}

// Returns the AppData of ExWebThrottle
function getWebData(){
  return JSON.parse(window.localStorage.getItem('locoData'));
}

// Returns boolen if the given Map exists in local storage
function ifExists(name){
  data = JSON.parse(window.localStorage.getItem('locoData'));
  found = false;
  data.find(function(item, i){
    if(item.mname == name){
      found = true;
    }
  });
  return found;
}

//Download the whole APP data of EXthrottle
function getBackup() {
  data = window.localStorage.getItem('locoData');
  const a = document.createElement("a");
  const file = new Blob([data], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = "EXthrottleBackup.json";
  a.click();
}

// Function that is responsible to store imported APP data into local storage
function importAppData(data){
  if(data){
    window.localStorage.setItem('locoData', JSON.stringify(data));
    loadmaps();
    $("#select-map").val('default').trigger("change");
  }
}

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
  switch (pref){
    case "vThrottle": 
      curpref["vThrottle"] = val;
      break;
    case "dbugConsole":
      curpref["dbugConsole"] = val;
      break;
  }
  setUserPreferences(curpref);
}

//// Store user preferences in local storage
function setUserPreferences(pref){
  if (typeof(Storage) !== "undefined") {  
    window.localStorage.setItem("userpref", JSON.stringify(pref));  
  }
}

/*
  {
    "vThrottle": false,
    "dbugConsole": true
  }
*/