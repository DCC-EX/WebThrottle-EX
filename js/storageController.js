$(document).ready(function(){

    if (typeof(Storage) !== "undefined") {
        console.log("Your browser is supporting Local Storage");
      } else {
        console.log("Sorry !! Your browser is not supporting Local Storage");
      }

});