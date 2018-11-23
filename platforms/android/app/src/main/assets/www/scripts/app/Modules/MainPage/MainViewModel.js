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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Messages/Messages", "scripts/app/Constants"], function (require, exports, Kernel, Messages, Constants) {
    var MainViewModel = (function (_super) {
        __extends(MainViewModel, _super);
        function MainViewModel(viewerViewModel) {
            _super.call(this);
            this._settingPanelVisible = false;
            this._propertiesPanelVisible = false;
            this._pmiFiltersPanelVisible = false;
            this._isNavigatorExpanded = false;
            this._legalPanelVisible = false;
            this._toolbarVisible = true;
            this._viewerVM = viewerViewModel;
            this.isLoading = true;
        }
        Object.defineProperty(MainViewModel.prototype, "isLoading", {
            get: function () {
                return this._isLoading;
            },
            set: function (value) {
                if (this._isLoading != value) {
                    this._isLoading = value;
                    if (!value) {
                        this._progress = 0;
                    }
                    else {
                        this._progress = 100;
                    }
                }
                if (this._isLoading) {
                    if (this._load_timer == undefined) {
                        this._load_timer = setTimeout(function () {
                            this._viewerVM.viewerAlert(Constants.Strings.ParseJtErrorText);
                            this.failedLoading();
                        }.bind(this), 60000);
                    }
                }
                else {
                    // clear timer when loading finishes
                    clearTimeout(this._load_timer);
                    this._load_timer = undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        MainViewModel.prototype.failedLoading = function () {
            this.isLoading = false;
            this.goTo(Constants.StateNames.Home, null); // go to home-page
        };
        Object.defineProperty(MainViewModel.prototype, "progress", {
            get: function () {
                return this._progress;
            },
            set: function (value) {
                this._progress = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainViewModel.prototype, "isNavigatorExpanded", {
            get: function () {
                return this._isNavigatorExpanded;
            },
            set: function (value) {
                if (this._isNavigatorExpanded != value) {
                    this._isNavigatorExpanded = value;
                    this.sendMessage(new Messages.NavigatorToggled());
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainViewModel.prototype, "viewer", {
            get: function () {
                return this._viewerVM;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainViewModel.prototype, "legalPanelVisible", {
            get: function () {
                return this._legalPanelVisible && !this._isLoading;
            },
            enumerable: true,
            configurable: true
        });
        MainViewModel.prototype.toggleLegalPanel = function () {
            this._legalPanelVisible = !this._legalPanelVisible;
            this.sendMessage(new Messages.LegalToggled());
        };
        MainViewModel.prototype.openPrivacyPage = function () {
            window.open(encodeURI(Constants.Strings.PrivacyUrl), '_blank', 'location=yes');
        };
        MainViewModel.prototype.openHelpPage = function () {
            window.open(encodeURI(Constants.Strings.HelpLocation), '_system', 'location=no');
        };
        Object.defineProperty(MainViewModel.prototype, "settingPanelVisible", {
            //toggleSetting property, the control to show/hide the setting panel
            get: function () {
                return this._settingPanelVisible && !this._isLoading;
            },
            enumerable: true,
            configurable: true
        });
        MainViewModel.prototype.toggleSettingPanel = function () {
            this._settingPanelVisible = !this._settingPanelVisible;
            if (this._settingPanelVisible) {
                if (this.propertiesPanelVisible) {
                    this.togglePropertiesPanel();
                }
                if (this.pmiFiltersPanelVisible) {
                    this.togglePmiFiltersPanel();
                }
            }
        };
        Object.defineProperty(MainViewModel.prototype, "propertiesPanelVisible", {
            get: function () {
                return this._propertiesPanelVisible && !this._isLoading;
            },
            enumerable: true,
            configurable: true
        });
        MainViewModel.prototype.togglePropertiesPanel = function () {
            this._propertiesPanelVisible = !this._propertiesPanelVisible;
            if (this._propertiesPanelVisible) {
                if (this.settingPanelVisible) {
                    this.toggleSettingPanel();
                }
                if (this.pmiFiltersPanelVisible) {
                    this.togglePmiFiltersPanel();
                }
            }
            this.sendMessage(new Messages.PropertiesToggled());
        };
        Object.defineProperty(MainViewModel.prototype, "pmiFiltersPanelVisible", {
            get: function () {
                return this._pmiFiltersPanelVisible && !this._isLoading;
            },
            enumerable: true,
            configurable: true
        });
        MainViewModel.prototype.togglePmiFiltersPanel = function () {
            this._pmiFiltersPanelVisible = !this._pmiFiltersPanelVisible;
            if (this._pmiFiltersPanelVisible) {
                if (this.propertiesPanelVisible) {
                    this.togglePropertiesPanel();
                }
                if (this.settingPanelVisible) {
                    this.toggleSettingPanel();
                }
            }
        };
        Object.defineProperty(MainViewModel.prototype, "isSmallScreenWidth", {
            get: function () {
                return this._viewerVM.isSmallScreenWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainViewModel.prototype, "isSmallScreenHeight", {
            get: function () {
                return this._viewerVM.isSmallScreenHeight;
            },
            enumerable: true,
            configurable: true
        });
        MainViewModel.prototype.toggleToolbar = function () {
            this._toolbarVisible = !this._toolbarVisible;
        };
        Object.defineProperty(MainViewModel.prototype, "isToolbarVisible", {
            get: function () {
                return this._toolbarVisible;
            },
            enumerable: true,
            configurable: true
        });
        return MainViewModel;
    })(Kernel.ViewModelBase);
    exports.MainViewModel = MainViewModel;
});
//# sourceMappingURL=MainViewModel.js.map