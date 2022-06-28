$(document).ready(function(){
  locoList = getLocoList();
  savedMaps = getPreparedMaps();
  $("#loco-form").on("submit", function (e) {
    e.preventDefault();
    data = $(this).serializeArray();
    mode = $("#loco-submit").attr("loco-mode");
    if(mode != 'edit'){
      saveLocomotive(data);
    }else{
      id = $("#loco-submit").attr("loco-id")
      saveEditedLocomotive(data, id);
    }
    locoList = getLocoList();
    loadLocomotives();
    $("#loco-form")[0].reset();
    $("#loco-form-content").css("display", "none");
  });

  $("#add-loco").on("click", function () {
      savedMaps = getPreparedMaps();
      $("#loco-form")[0].reset();
      $("#loco-form-content").css("display", "inline-block");
      $(".add-loco-form .add-loco-head").html("Add Locomotive");
      $("#loco-submit").attr("loco-mode", "add");
  });

  $("#close-addloco-model").on("click", function () {
    if ($("#loco-form-content").is(":visible")) {
      $("#loco-form-content").css("display", "none");
    }
  });

  $("#ex-locoid").autocomplete({
      delay: 0,
      minLength: 0,
      source: function (request, response) {
        var matcher = new RegExp(
          $.ui.autocomplete.escapeRegex(request.term),
          "i"
        );
        response(
          $.grep(locoList, function (item) {
            if (item != undefined) {
              console.log(item);
              return (
                matcher.test(item.name) ||
                matcher.test(item.cv) ||
                matcher.test(item.type) ||
                matcher.test(item.manufacturer)
              );
            } else {
              return true;
            }
          })
        );
      },
      select: function (event, ui) {
        $(this).val(ui.item.cv + " | " + ui.item.name);
        $(this).attr("loco-cv", ui.item.cv);
        return false;
      },
    })
    .focus(function () {
      console.log("Focused");
      $(this).autocomplete("search", "");
    })
    .data("ui-autocomplete")._renderItem = function (ul, item) {
    $(ul).addClass("res-list");
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append(
        "<div><p class='ac-loco-name'>" +
          item.name +
          "</p><small> <span class='pill'>CV:" +
          item.cv +
          "</span>|<span class='pill'>" +
          item.type +
          "</span>|<span class='pill wrap'>" +
          item.brand +
          "</span></small></div>"
      )
      .appendTo(ul);
  };

  $("#function-maps").autocomplete({
      delay: 0,
      minLength: 0,
      source: function (request, response) {
        var matcher = new RegExp(
          $.ui.autocomplete.escapeRegex(request.term),
          "i"
        );
        response(
          $.grep(savedMaps, function (item) {
            return matcher.test(item.mname);
          })
        );
      },
      select: function (event, ui) {
        $(this).val(ui.item.mname);
        return false;
      },
    })
    .focus(function () {
      console.log("Focused");
      $(this).autocomplete("search", "");
    })
    .data("ui-autocomplete")._renderItem = function (ul, item) {
    $(ul).addClass("res-list-sm");
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<div><p class='item'>" + item.mname + "</p></div>")
      .appendTo(ul);
  };

  $("#export-locolist").on("click", function (e) {
    downloadCabData();
  });

  $("#import-locolist").on("click", function (e) {
     e.preventDefault();
     $("#cabs-upload").trigger("click");
     locoList = getLocoList();
  });

});

function getPreparedMaps() {
    const defaultMap = {
      mname: "Default",
      fnData: {},
    }
    return [defaultMap, ...getMapData()];
}

/** Reference Map Structure 
maps = [
    {
        mname: "mkmap",
        fnData: {
            f0: [0, 1, "Head Light", 1],
        },
    },
];

locos = [
    {
        name: "Mikado",
        cv: 3,
        type: "Diesel",
        manufacturer: "Kato",
    },
];

*/
