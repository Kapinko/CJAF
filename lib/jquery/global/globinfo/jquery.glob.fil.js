(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["fil"] = $.extend(true, {}, en, {
        name: "fil",
        englishName: "Filipino",
        nativeName: "Filipino",
        language: "fil",
        numberFormat: {
            currency: {
                symbol: "PhP"
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                days: {
                    names: ["Linggo","Lunes","Martes","Mierkoles","Huebes","Biernes","Sabado"],
                    namesAbbr: ["Lin","Lun","Mar","Mier","Hueb","Bier","Saba"],
                    namesShort: ["L","L","M","M","H","B","S"]
                },
                months: {
                    names: ["Enero","Pebrero","Marso","Abril","Mayo","Hunyo","Hulyo","Agosto","Septyembre","Oktubre","Nobyembre","Disyembre",""],
                    namesAbbr: ["En","Peb","Mar","Abr","Mayo","Hun","Hul","Agos","Sept","Okt","Nob","Dis",""]
                },
                eras: [{"name":"Anno Domini","start":null,"offset":0}]
            })
        }
    }, cultures["fil"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);