// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
define(["require", "exports"], function (require, exports) {
    var SettingService = (function () {
        function SettingService($log) {
            this.$log = $log;
        }
        SettingService.prototype.getString = function (name) {
            if (window.localStorage) {
                return window.localStorage.getItem(name);
            }
        };
        SettingService.prototype.setString = function (name, value) {
            if (window.localStorage) {
                window.localStorage.setItem(name, value);
            }
        };
        SettingService.prototype.getObject = function (name) {
            var value = this.getString(name);
            try {
                return JSON.parse(value);
            }
            catch (e) {
                if (this.$log) {
                    this.$log.debug(e);
                }
            }
            return null;
        };
        SettingService.prototype.setObject = function (name, value) {
            var v = JSON.stringify(value);
            this.setString(name, v);
        };
        SettingService.prototype.clear = function () {
            if (window.localStorage) {
                window.localStorage.clear();
            }
        };
        return SettingService;
    })();
    exports.SettingService = SettingService;
});
//# sourceMappingURL=SettingService.js.map