(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["ha-Latn"] = $.extend(true, {}, en, {
        name: "ha-Latn",
        englishName: "Hausa (Latin)",
        nativeName: "Hausa",
        language: "ha-Latn",
        numberFormat: {
            currency: {
                pattern: ["$-n","$ n"],
                symbol: "N"
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                days: {
                    names: ["Lahadi","Litinin","Talata","Laraba","Alhamis","Juma'a","Asabar"],
                    namesAbbr: ["Lah","Lit","Tal","Lar","Alh","Jum","Asa"],
                    namesShort: ["L","L","T","L","A","J","A"]
                },
                months: {
                    names: ["Januwaru","Febreru","Maris","Afrilu","Mayu","Yuni","Yuli","Agusta","Satumba","Oktocba","Nuwamba","Disamba",""],
                    namesAbbr: ["Jan","Feb","Mar","Afr","May","Yun","Yul","Agu","Sat","Okt","Nuw","Dis",""]
                },
                AM: ["Safe","safe","SAFE"],
                PM: ["Yamma","yamma","YAMMA"],
                eras: [{"name":"AD","start":null,"offset":0}],
                patterns: {
                    d: "d/M/yyyy"
                }
            })
        }
    }, cultures["ha-Latn"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);