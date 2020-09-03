

$(document).ready(function(){
    if (typeof(Storage) !== "undefined") {
      console.log("Your browser issupporting Local Storage");
      console.log(ifExists(52));
    } else {
      console.log("Sorry !! Your browser is not supporting Local Storage");
    }

    $.each(showWebData(), function() {
      $("#select-map").append($("<option />").val(this.id).text(this.id));
    });

    $("#wipe-map").on('click', function(){
      window.localStorage.removeItem('locoData');
      console.log("!!!!!!WIPED!!!!!!");
    });



    $("#delete-map").on('click', function(){
      console.log(showWebData());  
      deleteFuncData(7);
      console.log(showWebData());  
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
        console.log("NULL");
    }else{
      if(ifExists(data.id)){
        slocodata.find(function(item, i){
          if(item.id == data.id){
            item.fnData=data.fnData;
          }
        });  
      }else{
        slocodata.push(data);
      }
      window.localStorage.setItem('locoData', JSON.stringify(slocodata));    
    }
    loadmaps();
    console.log(showWebData());   
  }

}

function getFuncData(id){
  data = JSON.parse(window.localStorage.getItem('locoData'));
  return data.find(function(item, i){
    if(item.id == id){
      return item.fnData;
    }
  }).fnData;
}

function deleteFuncData(id){
  var r = confirm("Are you sure on deletion?");
  if (r == true) {
    if (typeof(Storage) !== "undefined") {
      curlocodata = []; 
      data = JSON.parse(window.localStorage.getItem('locoData'));
      if(!data){
        alert("No Data stored");
      }else{
          data.find(function(item, i){
            if(item.id != id){
              curlocodata.push(item);
            }
          });    
          window.localStorage.setItem('locoData', JSON.stringify(curlocodata));    
          console.log("Not NULL");
      }
    } 
  }
}


function showWebData(){
  return JSON.parse(window.localStorage.getItem('locoData'));
}

function ifExists(id){
  data = JSON.parse(window.localStorage.getItem('locoData'));
  found = false;
  data.find(function(item, i){
    if(item.id == id){
      found = true;
    }
  });
  return found;
}

function loadmaps(){
  $("#select-map").empty();
  $("#select-map").append($("<option />").val("-1").text("Map"));
  $.each(showWebData(), function() {
    $("#select-map").append($("<option />").val(this.id).text(this.id));
  });
}