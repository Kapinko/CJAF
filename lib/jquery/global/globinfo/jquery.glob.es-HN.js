(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["es-HN"] = $.extend(true, {}, en, {
        name: "es-HN",
        englishName: "Spanish (Honduras)",
        nativeName: "Español (Honduras)",
        language: "es",
        numberFormat: {
            currency: {
                pattern: ["$ -n","$ n"],
                groupSizes: [3,0],
                symbol: "L."
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                days: {
                    names: ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
                    namesAbbr: ["dom","lun","mar","mié","jue","vie","sáb"],
                    namesShort: ["do","lu","ma","mi","ju","vi","sá"]
                },
                months: {
                    names: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre",""],
                    namesAbbr: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic",""]
                },
                AM: ["a.m.","a.m.","A.M."],
                PM: ["p.m.","p.m.","P.M."],
                eras: [{"name":"d.C.","start":null,"offset":0}],
                patterns: {
                    d: "dd/MM/yyyy",
                    D: "dddd, dd' de 'MMMM' de 'yyyy",
                    t: "hh:mm tt",
                    T: "hh:mm:ss tt",
                    f: "dddd, dd' de 'MMMM' de 'yyyy hh:mm tt",
                    F: "dddd, dd' de 'MMMM' de 'yyyy hh:mm:ss tt",
                    M: "dd MMMM",
                    Y: "MMMM' de 'yyyy"
                }
            })
        }
    }, cultures["es-HN"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);