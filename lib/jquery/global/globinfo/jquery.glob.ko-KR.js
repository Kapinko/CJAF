(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["ko-KR"] = $.extend(true, {}, en, {
        name: "ko-KR",
        englishName: "Korean (Korea)",
        nativeName: "한국어 (대한민국)",
        language: "ko",
        numberFormat: {
            currency: {
                pattern: ["-$n","$n"],
                decimals: 0,
                symbol: "₩"
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': "-",
                days: {
                    names: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
                    namesAbbr: ["일","월","화","수","목","금","토"],
                    namesShort: ["일","월","화","수","목","금","토"]
                },
                months: {
                    names: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월",""],
                    namesAbbr: ["1","2","3","4","5","6","7","8","9","10","11","12",""]
                },
                AM: ["오전","오전","오전"],
                PM: ["오후","오후","오후"],
                eras: [{"name":"서기","start":null,"offset":0}],
                patterns: {
                    d: "yyyy-MM-dd",
                    D: "yyyy'년' M'월' d'일' dddd",
                    t: "tt h:mm",
                    T: "tt h:mm:ss",
                    f: "yyyy'년' M'월' d'일' dddd tt h:mm",
                    F: "yyyy'년' M'월' d'일' dddd tt h:mm:ss",
                    M: "M'월' d'일'",
                    Y: "yyyy'년' M'월'"
                }
            }),
            Korean: $.extend(true, {}, standard, {
                name: "Korean",
                '/': "-",
                days: {
                    names: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
                    namesAbbr: ["일","월","화","수","목","금","토"],
                    namesShort: ["일","월","화","수","목","금","토"]
                },
                months: {
                    names: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월",""],
                    namesAbbr: ["1","2","3","4","5","6","7","8","9","10","11","12",""]
                },
                AM: ["오전","오전","오전"],
                PM: ["오후","오후","오후"],
                eras: [{"name":"단기","start":null,"offset":-2333}],
                twoDigitYearMax: 4362,
                patterns: {
                    d: "gg yyyy-MM-dd",
                    D: "gg yyyy'년' M'월' d'일' dddd",
                    t: "tt h:mm",
                    T: "tt h:mm:ss",
                    f: "gg yyyy'년' M'월' d'일' dddd tt h:mm",
                    F: "gg yyyy'년' M'월' d'일' dddd tt h:mm:ss",
                    M: "M'월' d'일'",
                    Y: "gg yyyy'년' M'월'"
                }
            })
        }
    }, cultures["ko-KR"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);