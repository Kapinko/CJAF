(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["gd-GB"] = $.extend(true, {}, en, {
        name: "gd-GB",
        englishName: "Scottish Gaelic (United Kingdom)",
        nativeName: "Gàidhlig (An Rìoghachd Aonaichte)",
        language: "gd",
        numberFormat: {
            currency: {
                pattern: ["-$n","$n"],
                symbol: "£"
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                firstDay: 1,
                days: {
                    names: ["Didòmhnaich","Diluain","Dimàirt","Diciadain","Diardaoin","Dihaoine","Disathairne"],
                    namesAbbr: ["Dòm","Lua","Mài","Cia","Ard","Hao","Sat"],
                    namesShort: ["D","L","M","C","A","H","S"]
                },
                months: {
                    names: ["Am Faoilleach","An Gearran","Am Màrt","An Giblean","An Cèitean","An t-Ògmhios","An t-Iuchar","An Lùnastal","An t-Sultain","An Dàmhair","An t-Samhain","An Dùbhlachd",""],
                    namesAbbr: ["Fao","Gea","Màr","Gib","Cèi","Ògm","Iuc","Lùn","Sul","Dàm","Sam","Dùb",""]
                },
                AM: ["m","m","M"],
                PM: ["f","f","F"],
                patterns: {
                    d: "dd/MM/yyyy",
                    D: "dd MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "dd MMMM yyyy HH:mm",
                    F: "dd MMMM yyyy HH:mm:ss",
                    M: "dd MMMM",
                    Y: "MMMM yyyy"
                }
            })
        }
    }, cultures["gd-GB"]);
    culture.calendar = culture.calendars.standard;
})(Globalization);