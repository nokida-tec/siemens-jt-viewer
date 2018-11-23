// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
"use strict";
define(["require", "exports", "scripts/app/Constants", "scripts/app/I18N/I18N"], function (require, exports, Constants, I18N) {
    var GlobalizationService = (function () {
        function GlobalizationService(settingService, $injector) {
            this.settingService = settingService;
            this.$injector = $injector;
            this.translate = this.$injector.get("$translate");
        }
        GlobalizationService.prototype.getTranslation = function (key, callback) {
            this.translate(key).then(callback);
        };
        GlobalizationService.prototype.init = function () {
            var languageTag = this.settingService.getString(Constants.PreferenceKeys.Language) || I18N.I18N.getSystemPreferredLanguage();
            if (this.translate && languageTag) {
                this.translate.use(languageTag);
            }
        };
        GlobalizationService.prototype.use = function (languageTag) {
            if (this.translate && languageTag) {
                this.translate.use(languageTag);
            }
        };
        return GlobalizationService;
    })();
    exports.GlobalizationService = GlobalizationService;
});
//# sourceMappingURL=GlobalizationService.js.map