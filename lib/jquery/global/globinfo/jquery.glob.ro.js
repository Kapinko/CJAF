(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["ro"] = $.extend(true, {}, en, {
        name: "ro",
        englishName: "Romanian",
        nativeName: "română",
        language: "ro",
        numberFormat: {
            ',': ".",
            '.': ",",
            percent: {
                pattern: ["-n%","n%"],
                ',': ".",
                '.': ","
            },
            currency: {
                pattern: ["-n $","n $"],
                ',': ".",
                '.': ",",
                symbol: "lei"
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': ".",
                firstDay: 1,
                days: {
                    names: ["duminică","luni","marţi","miercuri","joi","vineri","sâmbătă"],
                    namesAbbr: ["D","L","Ma","Mi","J","V","S"],
                    namesShort: ["D","L","Ma","Mi","J","V","S"]
                },
                months: {
                    names: ["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie",""],
                    namesAbbr: ["ian.","feb.","mar.","apr.","mai.","iun.","iul.","aug.","sep.","oct.","nov.","dec.",""]
                },
                AM: null,
                PM: null,
                patterns: {
                    d: "dd.MM.yyyy",
                    D: "d MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "d MMMM yyyy HH:mm",
                    F: "d MMMM yyyy HH:mm:ss",
                    M: "d MMMM",
                    Y: "MMMM yyyy"
                }
            })
        }
    }, cultures["ro"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);