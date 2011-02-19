(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["zh-SG"] = $.extend(true, {}, en, {
        name: "zh-SG",
        englishName: "Chinese (Simplified, Singapore)",
        nativeName: "中文(新加坡)",
        language: "zh-CHS",
        numberFormat: {
            percent: {
                pattern: ["-n%","n%"]
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                days: {
                    names: ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
                    namesAbbr: ["周日","周一","周二","周三","周四","周五","周六"],
                    namesShort: ["日","一","二","三","四","五","六"]
                },
                months: {
                    names: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""],
                    namesAbbr: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""]
                },
                patterns: {
                    d: "d/M/yyyy",
                    D: "yyyy'年'M'月'd'日'",
                    t: "tt h:mm",
                    T: "tt h:mm:ss",
                    f: "yyyy'年'M'月'd'日' tt h:mm",
                    F: "yyyy'年'M'月'd'日' tt h:mm:ss",
                    M: "M'月'd'日'",
                    Y: "yyyy'年'M'月'"
                }
            })
        }
    }, cultures["zh-SG"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);