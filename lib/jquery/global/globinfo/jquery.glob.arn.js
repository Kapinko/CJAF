(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["arn"] = $.extend(true, {}, en, {
        name: "arn",
        englishName: "Mapudungun",
        nativeName: "Mapudungun",
        language: "arn",
        numberFormat: {
            ',': ".",
            '.': ",",
            percent: {
                ',': ".",
                '.': ","
            },
            currency: {
                pattern: ["-$ n","$ n"],
                ',': ".",
                '.': ","
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': "-",
                days: {
                    names: ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
                    namesAbbr: ["dom","lun","mar","mié","jue","vie","sáb"],
                    namesShort: ["do","lu","ma","mi","ju","vi","sá"]
                },
                months: {
                    names: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre",""],
                    namesAbbr: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic",""]
                },
                AM: null,
                PM: null,
                eras: [{"name":"d.C.","start":null,"offset":0}],
                patterns: {
                    d: "dd-MM-yyyy",
                    D: "dddd, dd' de 'MMMM' de 'yyyy",
                    t: "H:mm",
                    T: "H:mm:ss",
                    f: "dddd, dd' de 'MMMM' de 'yyyy H:mm",
                    F: "dddd, dd' de 'MMMM' de 'yyyy H:mm:ss",
                    M: "dd MMMM",
                    Y: "MMMM' de 'yyyy"
                }
            })
        }
    }, cultures["arn"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);