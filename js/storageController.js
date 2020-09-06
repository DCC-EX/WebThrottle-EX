

$(document).ready(function(){
    if (typeof(Storage) !== "undefined") {
      console.log("Your browser issupporting Local Storage");
    } else {
      console.log("Sorry !! Your browser is not supporting Local Storage");
    }

    $("#wipe-map").on('click', function(){
      window.localStorage.removeItem('locoData');
      console.log("!!!!!!WIPED!!!!!!");
      loadmaps();
    });

    $("#delete-map").on('click', function(){
      selectedval = $("#select-map").val();      
      if(selectedval != "default"){
        deleteFuncData(selectedval);
        loadmaps();
      }
    });

    $("#backup-map").on('click', function(){
      getBackup();
    });

});

function setLocoData(data){
  if (typeof(Storage) !== "undefined") {
    curlocodata = []; 
    slocodata = JSON.parse(window.localStorage.getItem('locoData'));
    console.log(slocodata);
    if(!slocodata){
        curlocodata.push(data);
        window.localStorage.setItem('locoData', JSON.stringify(curlocodata));
        loadmaps();
        $("#select-map").val(data.mname).trigger("change");
        //$('#select-map option[value="'+data.mname+'"]').prop('selected', true);
        console.log("NULL");
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
      loadmaps();
      $("#select-map").val(data.mname).trigger("change");
    }
  }

}

function getStoredFuncData(name){
  data = JSON.parse(window.localStorage.getItem('locoData'));
  return data.find(function(item, i){
    if(item.mname == name){
      return item.fnData;
    }
  });
}

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


function getWebData(){
  return JSON.parse(window.localStorage.getItem('locoData'));
}

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

function getBackup() {
  data = window.localStorage.getItem('locoData');
  const a = document.createElement("a");
  const file = new Blob([data], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = "EXthrottleBackup.json";
  a.click();
}



