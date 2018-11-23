"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Constants", "scripts/app/Modules/MainPage/MainViewModel", "scripts/app/Modules/MainPage/NavigatorViewModel", "scripts/app/Modules/MainPage/ViewerViewModel", "scripts/app/Modules/MainPage/SettingViewModel", "scripts/app/Modules/MainPage/PropertiesViewModel", "scripts/app/Modules/MainPage/PmiFiltersViewModel", "scripts/app/Modules/MainPage/LegalViewModel", "scripts/app/Modules/MainPage/ToolbarViewModel"], function (require, exports, Kernel, Constants, MainViewModel, NavigatorViewModel, ViewerViewModel, SettingViewModel, PropertiesViewModel, PmiFiltersViewModel, LegalViewModel, ToolbarViewModel) {
    var mainViewModel = "mainViewModel";
    var navigatorViewModel = "navigatorViewModel";
    var viewerViewModel = "viewerViewModel";
    var settingViewModel = "settingViewModel";
    var propertiesViewModel = "propertiesViewModel";
    var pmiFiltersViewModel = "pmiFiltersViewModel";
    var legalViewModel = "legalViewModel";
    var toolbarViewModel = "toolbarViewModel";
    var mainViewController = "mainViewController";
    var navigatorViewController = "navigatorViewController";
    var viewerViewController = "viewerViewController";
    var settingViewController = "settingViewController";
    var propertiesViewController = "propertiesViewController";
    var pmiFiltersViewController = "pmiFiltersViewController";
    var legalViewController = "legalViewController";
    var toolbarViewController = "toolbarViewController";
    var Module = (function (_super) {
        __extends(Module, _super);
        function Module() {
            _super.call(this, "MainPage");
        }
        Module.prototype.startCore = function () {
            var mainViewUri = Constants.Strings.ModuleBaseUri + "MainPage/MainView.html";
            var navigatorViewUri = Constants.Strings.ModuleBaseUri + "MainPage/NavigatorView.html";
            var viewerViewUri = Constants.Strings.ModuleBaseUri + "MainPage/ViewerView.html";
            var settingViewUri = Constants.Strings.ModuleBaseUri + "MainPage/SettingView.html";
            var propertiesViewUri = Constants.Strings.ModuleBaseUri + "MainPage/PropertiesView.html";
            var pmiFiltersViewUri = Constants.Strings.ModuleBaseUri + "MainPage/PmiFiltersView.html";
            var legalViewUri = Constants.Strings.ModuleBaseUri + "MainPage/LegalView.html";
            var legalContentViewUri = Constants.Strings.ModuleBaseUri + "MainPage/LegalContentView.html";
            var toolbarViewUri = Constants.Strings.ModuleBaseUri + "MainPage/ToolbarView.html";
            var structureViewUri = Constants.Strings.ModuleBaseUri + "MainPage/StructureView.html";
            var modelViewViewUri = Constants.Strings.ModuleBaseUri + "MainPage/ModelViewView.html";
            var markupViewViewUri = Constants.Strings.ModuleBaseUri + "MainPage/MarkupViewView.html";
            this.controller(mainViewController, mainViewModel);
            this.controller(navigatorViewController, navigatorViewModel);
            this.controller(viewerViewController, viewerViewModel);
            this.controller(settingViewController, settingViewModel);
            this.controller(legalViewController, legalViewModel);
            this.controller(propertiesViewController, propertiesViewModel);
            this.controller(pmiFiltersViewController, pmiFiltersViewModel);
            this.controller(legalViewController, legalViewModel);
            this.controller(toolbarViewController, toolbarViewModel)
                .service(mainViewModel, MainViewModel.MainViewModel)
                .service(navigatorViewModel, NavigatorViewModel.NavigatorViewModel)
                .service(viewerViewModel, ViewerViewModel.ViewerViewModel)
                .service(settingViewModel, SettingViewModel.SettingViewModel)
                .service(propertiesViewModel, PropertiesViewModel.PropertiesViewModel)
                .service(pmiFiltersViewModel, PmiFiltersViewModel.PmiFiltersViewModel)
                .service(legalViewModel, LegalViewModel.LegalViewModel)
                .service(toolbarViewModel, ToolbarViewModel.ToolbarViewModel)
                .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
                    var views = {
                        "": {
                            templateUrl: mainViewUri,
                            controller: mainViewController,
                        },
                        "NavigatorView@MainView": {
                            templateUrl: navigatorViewUri,
                            controller: navigatorViewController
                        },
                        "SettingView@MainView": {
                            templateUrl: settingViewUri,
                            controller: settingViewController
                        },
                        "ViewerView@MainView": {
                            templateUrl: viewerViewUri,
                            controller: viewerViewController
                        },
                        "PmiFiltersView@MainView": {
                            templateUrl: pmiFiltersViewUri,
                            controller: pmiFiltersViewController
                        },
                        "PropertiesView@MainView": {
                            templateUrl: propertiesViewUri,
                            controller: propertiesViewController
                        },
                        "LegalView@MainView": {
                            templateUrl: legalViewUri,
                            controller: legalViewController
                        },
                        "LegalContentView@MainView": {
                            templateUrl: legalContentViewUri,
                            controller: legalViewController
                        },
                        "ToolbarView@MainView": {
                            templateUrl: toolbarViewUri,
                            controller: toolbarViewController
                        }
                    };
                    $stateProvider.state(Constants.StateNames.Main, {
                        url: "MainView",
                        abstract: true,
                        views: views
                    });
                    $stateProvider.state(Constants.StateNames.Context, {
                        url: "?modelPath&contextPart&mode&jtFilePath&pickerUsed&loadAsBod",
                        controller: navigatorViewController,
                        templateUrl: function ($stateParams) {
                            switch ($stateParams.mode) {
                                case Constants.Strings.Structure:
                                    return structureViewUri;
                                case Constants.Strings.ModelView:
                                    return modelViewViewUri;
                                case Constants.Strings.MarkupView:
                                    return markupViewViewUri;
                                default:
                                    return structureViewUri;
                            }
                        }
                    });
                }]);
        };
        return Module;
    })(Kernel.ModuleBase);
    exports.Module = Module;
});
//# sourceMappingURL=Module.js.map