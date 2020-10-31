$(document).ready(function(){
    locoList = getLocoList();
    savedMaps = getPreparedMaps();
    $("#loco-form").on("submit", function (e) {
        e.preventDefault();
        data = $(this).serializeArray();
        saveLocomotive(data);
        //console.log("SAVED"+x);
        locoList = getLocoList();
        $("#loco-form")[0].reset();
        $("#loco-form-content").css("display", "none");
    });

    $("#add-loco").on("click", function () {
        if ($("#loco-form-content").is(":visible")) {
            $("#loco-form-content").css("display", "none");          
        } else {
            savedMaps = getPreparedMaps();
            $("#loco-form")[0].reset();
            $("#loco-form-content").css("display", "inline-block");         
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
          $(this).val(ui.item.cv + " | "+ui.item.name );
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
            item.name +"</p><small> <span class='pill'>CV:" +
            item.cv +"</span>|<span class='pill'>" +
            item.type +"</span>|<span class='pill wrap'>" +
            item.manufacturer +
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
});

function getPreparedMaps() {
    maps = getMapData();
    if (maps != null){
        maps.unshift({
            mname: "Default",
            fnData: {},
        });
    }
    return maps;
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