// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../../typings/cordova/plugins/Globalization.d.ts" />
"use strict";
define(["require", "exports", "scripts/app/Models/NonJT"], function (require, exports, NonJT) {
    var I18N = (function () {
        function I18N() {
        }
        I18N.getSystemPreferredLanguage = function () {
            var tag;
            if (typeof navigator.globalization !== "undefined") {
                navigator.globalization.getLocaleName(function (locale) {
                    tag = I18N.normalizeLocale(locale.value);
                }, null);
            }
            return tag || I18N.defaultLanguageTag;
        };
        I18N.availableLanguages = function () {
            var languages = new Array();
            languages.push(new NonJT.LanguageItem("en-US", "English (United States)"));
            languages.push(new NonJT.LanguageItem("de-DE", "Deutsch (Deutschland)"));
            languages.push(new NonJT.LanguageItem("fr-FR", "français (France)"));
            languages.push(new NonJT.LanguageItem("it-IT", "italiano (Italia)"));
            languages.push(new NonJT.LanguageItem("es-ES", "Español (España)"));
            languages.push(new NonJT.LanguageItem("ru-RU", "русский"));
            languages.push(new NonJT.LanguageItem("ja-JP", "日本語"));
            languages.push(new NonJT.LanguageItem("ko-KR", "한국어"));
            languages.push(new NonJT.LanguageItem("zh-CN", "中文(中华人民共和国)"));
            languages.push(new NonJT.LanguageItem("zh-TW", "中文(台灣)"));
            return languages;
        };
        I18N.normalizeLocale = function (locale) {
            var result;
            if (locale) {
                var ay = (locale).split("-");
                if (ay.length == 1) {
                    result = ay[0];
                }
                else {
                    result = ay[0] + "-" + ay[1];
                }
                var matches = I18N.availabeLanguages.filter(function (value, index, array) {
                    if (value.languageTag.match(new RegExp(result, "i")))
                        return true;
                });
                if (matches && matches.length > 0) {
                    result = (matches.shift()).languageTag;
                }
            }
            return result;
        };
        I18N.availabeLanguages = I18N.availableLanguages();
        I18N.defaultLanguageTag = "en-US";
        return I18N;
    })();
    exports.I18N = I18N;
});
//# sourceMappingURL=I18N.js.map