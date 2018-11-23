// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Modules/HomePage/HomeViewModel", "scripts/app/Constants"], function (require, exports, Kernel, ViewModel, Constants) {
    var mapViewModel = "mapViewModel";
    var mapViewController = "mapViewController";
    var Module = (function (_super) {
        __extends(Module, _super);
        function Module() {
            _super.call(this, "HomePage");
        }
        Module.prototype.startCore = function () {
            var filePickerTemplateUri = Constants.Strings.ModuleBaseUri + "HomePage/Jt2goFilePicker.html";
            var viewLocation = Constants.Strings.ModuleBaseUri + "HomePage/HomeView.html";
            var licenseViewUri = Constants.Strings.ModuleBaseUri + "HomePage/LicenseView.html";
            var licenseContentViewUri = Constants.Strings.ModuleBaseUri + "MainPage/LegalContentView.html";
            var mapViewUri = Constants.Strings.ModuleBaseUri + "HomePage/MapView.html";
            //this.controller(mapViewController, mapViewModel).service(mapViewModel, MapViewModel.MapViewModel);
            var homeViewController = "homeViewController";
            var views = {
                "": {
                    templateUrl: viewLocation,
                    controller: homeViewController
                },
                "Jt2GoFilePicker@HomeView": {
                    templateUrl: filePickerTemplateUri,
                    controller: homeViewController
                },
                "LicenseView@HomeView": {
                    templateUrl: licenseViewUri,
                    controller: homeViewController
                },
                "LicenseContentView@HomeView": {
                    templateUrl: licenseContentViewUri,
                    controller: homeViewController
                },
                "MapView@HomeView": {
                    templateUrl: mapViewUri,
                    controller: homeViewController
                }
            };
            var homeController = this.wireUp("HomeView", ViewModel.HomeViewModel, views);
            //var mapController = this.wireUp("MapView", MapViewModel.MapViewModel);
        };
        return Module;
    })(Kernel.ModuleBase);
    exports.Module = Module;
});
//# sourceMappingURL=Module.js.map