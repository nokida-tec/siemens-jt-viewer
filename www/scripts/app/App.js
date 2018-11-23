// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../typings/cordova/plugins/Splashscreen.d.ts" />
/// <reference path="Kernel.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Modules/HomePage/Module", "scripts/app/Modules/MainPage/Module", "scripts/app/Directives/Module", "scripts/app/Services/Module", "scripts/app/Constants", "scripts/app/Utils/Helper"], function (require, exports, Kernel, Home, Main, Directives, Services, Constants, Helper) {
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            _super.call(this, "JT2Go");
            this.addModules(new Services.Module(), new Kernel.Module(), new Home.Module(), new Main.Module(), new Directives.Module());
        }
        App.prototype.startCore = function (rootElement) {
            _super.prototype.startCore.call(this, rootElement);
            document.addEventListener("deviceready", onDeviceReady, false);
            var element = angular.element(rootElement);
            var injector = angular.bootstrap(element, [this.name]);
            this.initApp(injector);
        };
        App.prototype.initApp = function (injector) {
            var globalizationService = injector.get("globalizationService");
            globalizationService.init();
        };
        return App;
    })(Kernel.CompositeModule);
    exports.App = App;
    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        document.addEventListener("backbutton", onBack, false);
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    }
    function onBack() {
        if (document.location.hash == Constants.Strings.HomeHref) {
            Helper.existJt2Go();
        }
        else {
            document.location.hash = Constants.Strings.HomeHref;
        }
    }
    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }
    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }
});
//# sourceMappingURL=App.js.map