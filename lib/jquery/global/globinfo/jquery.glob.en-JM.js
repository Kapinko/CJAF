(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["en-JM"] = $.extend(true, {}, en, {
        name: "en-JM",
        englishName: "English (Jamaica)",
        nativeName: "English (Jamaica)",
        numberFormat: {
            currency: {
                pattern: ["-$n","$n"],
                symbol: "J$"
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                patterns: {
                    d: "dd/MM/yyyy",
                    t: "hh:mm tt",
                    T: "hh:mm:ss tt",
                    f: "dddd, MMMM dd, yyyy hh:mm tt",
                    F: "dddd, MMMM dd, yyyy hh:mm:ss tt"
                }
            })
        }
    }, cultures["en-JM"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);