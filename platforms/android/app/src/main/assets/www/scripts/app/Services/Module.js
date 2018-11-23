// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../../typings/angularjs/angular.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Services/SettingService", "scripts/app/Services/GlobalizationService", "scripts/app/I18N/I18N"], function (require, exports, Kernel, SettingService, GlobalizationService, I18N) {
    var Module = (function (_super) {
        __extends(Module, _super);
        function Module() {
            _super.call(this, "Services");
        }
        Module.prototype.startCore = function () {
            this.module.service("settingService", SettingService.SettingService);
            this.module.service("globalizationService", GlobalizationService.GlobalizationService)
                .config(["$translateProvider", function ($translateProvider) {
                    // Register a loader for the static files
                    // So, the module will search missing translation tables under the specified urls.
                    // Those urls are [prefix][langKey][suffix].
                    $translateProvider.useStaticFilesLoader({
                        prefix: 'i18n/strings/',
                        suffix: '.json'
                    });
                    // Tell the module what language to use by default
                    $translateProvider.preferredLanguage(I18N.I18N.getSystemPreferredLanguage());
                    // set the fallbackLanguage
                    $translateProvider.fallbackLanguage(I18N.I18N.defaultLanguageTag);
                }]);
        };
        return Module;
    })(Kernel.ModuleBase);
    exports.Module = Module;
});
//# sourceMappingURL=Module.js.map