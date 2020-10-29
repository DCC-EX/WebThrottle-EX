$(document).ready(function(){

    $("#loco-form").on("submit", function (e) {
    e.preventDefault();
    data = $(this).serializeArray();
    console.log(data);
    $("#loco-form")[0].reset();
    $("#loco-form-content").css("display", "none");
    });

    $("#add-loco").on("click", function () {
    if ($("#loco-form-content").is(":visible")) {
        $("#loco-form-content").css("display", "none");
    } else {
        $("#loco-form-content").css("display", "inline-block");
    }
    });

    $("#ex-locoid")
      .autocomplete({
        delay: 0,
        minLength: 0,
        /*open: function(event, ui) {
            $(this).autocomplete("widget").css({
                "width": ($(this).width() + "px")
            });
        },*/
        source: function (request, response) {
          var matcher = new RegExp(
            $.ui.autocomplete.escapeRegex(request.term),
            "i"
          );
          response(
            $.grep(locos, function (item) {
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
          "<div>" +
            item.name +
            "<br> CV:" +
            item.cv +
            " Type:" +
            item.type +
            " Type:" +
            item.manufacturer +
            "</div>"
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
            $.grep(maps, function (item) {
            return matcher.test(item.mname);
            })
        );
        },
        create: function () {
        maps.unshift({
            mname: "default",
            fnData: {},
        });
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
        .append("<div>" + item.mname + "</div>")
        .appendTo(ul);
    };
});


maps = [
    {
        mname: "mkmap",
        fnData: {
        f0: [0, 1, "Head Light", 1],
        f1: [0, 1, "Bell", 1],
        f2: [0, 1, "Horn", 1],
        f3: [0, 1, "F3", 1],
        f4: [0, 0, "F4", 0],
        f5: [0, 0, "F5", 0],
        f6: [0, 0, "F6", 0],
        f7: [0, 0, "F7", 0],
        f8: [0, 0, "F8", 1],
        f9: [0, 0, "F9", 1],
        f10: [0, 0, "F10", 1],
        f11: [0, 0, "F11", 1],
        f12: [0, 0, "F12", 1],
        f13: [0, 0, "F13", 1],
        f14: [0, 0, "F14", 1],
        f15: [0, 0, "F15", 1],
        f16: [0, 0, "F16", 1],
        f17: [0, 0, "F17", 1],
        f18: [0, 0, "F18", 1],
        f19: [0, 0, "F19", 1],
        f20: [0, 0, "F20", 1],
        f21: [0, 0, "F21", 1],
        f22: [0, 0, "F22", 1],
        f23: [0, 0, "F23", 1],
        f24: [0, 0, "F24", 1],
        f25: [0, 0, "F25", 1],
        f26: [0, 0, "F26", 1],
        f27: [0, 0, "F27", 1],
        f28: [0, 0, "F28", 1],
        },
    },
    {
        mname: "Skmap",
        fnData: {
        f0: [0, 0, "Head Light", 1],
        f1: [0, 0, "Bell", 1],
        f2: [0, 0, "Horn", 1],
        f3: [0, 1, "F3", 1],
        f4: [0, 1, "F4", 1],
        f5: [0, 1, "F5", 1],
        f6: [0, 1, "F6", 1],
        f7: [0, 0, "F7", 0],
        f8: [0, 0, "F8", 0],
        f9: [0, 0, "F9", 0],
        f10: [0, 0, "F10", 0],
        f11: [0, 0, "F11", 1],
        f12: [0, 0, "F12", 1],
        f13: [0, 0, "F13", 1],
        f14: [0, 0, "F14", 1],
        f15: [0, 0, "F15", 1],
        f16: [0, 0, "F16", 1],
        f17: [0, 0, "F17", 1],
        f18: [0, 0, "F18", 1],
        f19: [0, 0, "F19", 1],
        f20: [0, 0, "F20", 1],
        f21: [0, 0, "F21", 1],
        f22: [0, 0, "F22", 1],
        f23: [0, 0, "F23", 1],
        f24: [0, 0, "F24", 1],
        f25: [0, 0, "F25", 1],
        f26: [0, 0, "F26", 1],
        f27: [0, 0, "F27", 1],
        f28: [0, 0, "F28", 1],
        },
    },
    {
        mname: "kkmap",
        fnData: {
        f0: [0, 1, "Head Light", 1],
        f1: [0, 1, "Bell", 1],
        f2: [0, 1, "Horn", 1],
        f3: [0, 1, "F3", 1],
        f4: [0, 0, "F4", 0],
        f5: [0, 0, "F5", 0],
        f6: [0, 0, "F6", 0],
        f7: [0, 0, "F7", 0],
        f8: [0, 0, "F8", 1],
        f9: [0, 0, "F9", 1],
        f10: [0, 0, "F10", 1],
        f11: [0, 0, "F11", 1],
        f12: [0, 0, "F12", 1],
        f13: [0, 0, "F13", 1],
        f14: [0, 0, "F14", 1],
        f15: [0, 0, "F15", 1],
        f16: [0, 0, "F16", 1],
        f17: [0, 0, "F17", 1],
        f18: [0, 0, "F18", 1],
        f19: [0, 0, "F19", 1],
        f20: [0, 0, "F20", 1],
        f21: [0, 0, "F21", 1],
        f22: [0, 0, "F22", 1],
        f23: [0, 0, "F23", 1],
        f24: [0, 0, "F24", 1],
        f25: [0, 0, "F25", 1],
        f26: [0, 0, "F26", 1],
        f27: [0, 0, "F27", 1],
        f28: [0, 0, "F28", 1],
        },
    },
    {
        mname: "jkmap",
        fnData: {
        f0: [0, 0, "Head Light", 1],
        f1: [0, 0, "Bell", 1],
        f2: [0, 0, "Horn", 1],
        f3: [0, 1, "F3", 1],
        f4: [0, 1, "F4", 1],
        f5: [0, 1, "F5", 1],
        f6: [0, 1, "F6", 1],
        f7: [0, 0, "F7", 0],
        f8: [0, 0, "F8", 0],
        f9: [0, 0, "F9", 0],
        f10: [0, 0, "F10", 0],
        f11: [0, 0, "F11", 1],
        f12: [0, 0, "F12", 1],
        f13: [0, 0, "F13", 1],
        f14: [0, 0, "F14", 1],
        f15: [0, 0, "F15", 1],
        f16: [0, 0, "F16", 1],
        f17: [0, 0, "F17", 1],
        f18: [0, 0, "F18", 1],
        f19: [0, 0, "F19", 1],
        f20: [0, 0, "F20", 1],
        f21: [0, 0, "F21", 1],
        f22: [0, 0, "F22", 1],
        f23: [0, 0, "F23", 1],
        f24: [0, 0, "F24", 1],
        f25: [0, 0, "F25", 1],
        f26: [0, 0, "F26", 1],
        f27: [0, 0, "F27", 1],
        f28: [0, 0, "F28", 1],
        },
    },
    {
        mname: "hkmap",
        fnData: {
        f0: [0, 1, "Head Light", 1],
        f1: [0, 1, "Bell", 1],
        f2: [0, 1, "Horn", 1],
        f3: [0, 1, "F3", 1],
        f4: [0, 0, "F4", 0],
        f5: [0, 0, "F5", 0],
        f6: [0, 0, "F6", 0],
        f7: [0, 0, "F7", 0],
        f8: [0, 0, "F8", 1],
        f9: [0, 0, "F9", 1],
        f10: [0, 0, "F10", 1],
        f11: [0, 0, "F11", 1],
        f12: [0, 0, "F12", 1],
        f13: [0, 0, "F13", 1],
        f14: [0, 0, "F14", 1],
        f15: [0, 0, "F15", 1],
        f16: [0, 0, "F16", 1],
        f17: [0, 0, "F17", 1],
        f18: [0, 0, "F18", 1],
        f19: [0, 0, "F19", 1],
        f20: [0, 0, "F20", 1],
        f21: [0, 0, "F21", 1],
        f22: [0, 0, "F22", 1],
        f23: [0, 0, "F23", 1],
        f24: [0, 0, "F24", 1],
        f25: [0, 0, "F25", 1],
        f26: [0, 0, "F26", 1],
        f27: [0, 0, "F27", 1],
        f28: [0, 0, "F28", 1],
        },
    },
    {
        mname: "lkmap",
        fnData: {
        f0: [0, 0, "Head Light", 1],
        f1: [0, 0, "Bell", 1],
        f2: [0, 0, "Horn", 1],
        f3: [0, 1, "F3", 1],
        f4: [0, 1, "F4", 1],
        f5: [0, 1, "F5", 1],
        f6: [0, 1, "F6", 1],
        f7: [0, 0, "F7", 0],
        f8: [0, 0, "F8", 0],
        f9: [0, 0, "F9", 0],
        f10: [0, 0, "F10", 0],
        f11: [0, 0, "F11", 1],
        f12: [0, 0, "F12", 1],
        f13: [0, 0, "F13", 1],
        f14: [0, 0, "F14", 1],
        f15: [0, 0, "F15", 1],
        f16: [0, 0, "F16", 1],
        f17: [0, 0, "F17", 1],
        f18: [0, 0, "F18", 1],
        f19: [0, 0, "F19", 1],
        f20: [0, 0, "F20", 1],
        f21: [0, 0, "F21", 1],
        f22: [0, 0, "F22", 1],
        f23: [0, 0, "F23", 1],
        f24: [0, 0, "F24", 1],
        f25: [0, 0, "F25", 1],
        f26: [0, 0, "F26", 1],
        f27: [0, 0, "F27", 1],
        f28: [0, 0, "F28", 1],
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
    {
        name: "CSX",
        cv: 4,
        type: "Diesel",
        manufacturer: "Kato",
    },
    {
        name: "Santafe",
        cv: 5,
        type: "Diesel",
        manufacturer: "Kato",
    },
    {
        name: "EMD F40",
        cv: 5,
        type: "Diesel",
        manufacturer: "BLI",
    },
    {
        name: "EMD SD50",
        cv: 56789,
        type: "Diesel",
        manufacturer: "BLI",
    },
];

            