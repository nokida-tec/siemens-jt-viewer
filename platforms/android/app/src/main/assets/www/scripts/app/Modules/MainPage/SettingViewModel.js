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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Models/ColorInfo", "scripts/app/Models/NonJT", "scripts/app/Constants", "scripts/app/I18N/I18N"], function (require, exports, Kernel, ColorInfo, NonJT, Constants, I18N) {
    var SettingViewModel = (function (_super) {
        __extends(SettingViewModel, _super);
        function SettingViewModel(settingService, viewerViewModel, mainViewModel) {
            _super.call(this);
            this.settingService = settingService;
            this.viewerViewModel = viewerViewModel;
            this.mainViewModel = mainViewModel;
            this.initializePreference();
        }
        Object.defineProperty(SettingViewModel.prototype, "language", {
            get: function () {
                if (!this._language) {
                    var languageTag = this.settingService.getString(Constants.PreferenceKeys.Language) || I18N.I18N.getSystemPreferredLanguage();
                    this._language = this.convertLanguage(languageTag);
                }
                return this._language;
            },
            set: function (lang) {
                if (lang && lang.languageTag) {
                    this._language = lang;
                    var translate = this.injector.get("$translate");
                    if (translate) {
                        translate.use(lang.languageTag);
                    }
                    //save to preference 
                    this.settingService.setString(Constants.PreferenceKeys.Language, lang.languageTag);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "languages", {
            get: function () {
                if (!this._languages) {
                    this._languages = I18N.I18N.availabeLanguages;
                }
                return this._languages;
            },
            enumerable: true,
            configurable: true
        });
        SettingViewModel.prototype.convertLanguage = function (languageTag) {
            return this.languages.filter(function (value, index, array) {
                return value.languageTag == languageTag;
            }).shift();
        };
        SettingViewModel.prototype.toggleSettingPanel = function () {
            return this.mainViewModel.toggleSettingPanel();
        };
        SettingViewModel.prototype.initializePreference = function () {
            this.viewerViewModel.setPreference(this.backgroundColor, this.selectionColor, this.pmiColor, NonJT.ViewType[this.viewType]);
        };
        SettingViewModel.prototype.convertBackgroundColor = function (name) {
            return ColorInfo.ColorInfo.backgroundColors.filter(function (value, index, array) {
                return value.name == name;
            }).shift();
        };
        SettingViewModel.prototype.convertSelectionColor = function (name) {
            return ColorInfo.ColorInfo.selectionColors.filter(function (value, index, array) {
                return value.name == name;
            }).shift();
        };
        SettingViewModel.prototype.convertPMIColor = function (name) {
            return ColorInfo.ColorInfo.pmiColors.filter(function (value, index, array) {
                return value.name == name;
            }).shift();
        };
        Object.defineProperty(SettingViewModel.prototype, "backgroundColor", {
            get: function () {
                if (!this._backgroundColor) {
                    var n = this.settingService.getString(Constants.PreferenceKeys.BackgroundColor) || Constants.PreferenceKeys.Default;
                    this._backgroundColor = this.convertBackgroundColor(n);
                }
                return this._backgroundColor;
            },
            set: function (value) {
                if (value && value != this._backgroundColor) {
                    this._backgroundColor = value;
                    //set bg color
                    this.viewerViewModel.BackgroundColor = value;
                    //save to preference 
                    this.settingService.setString(Constants.PreferenceKeys.BackgroundColor, value.name);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "selectionColor", {
            get: function () {
                if (!this._selectionColor) {
                    var n = this.settingService.getString(Constants.PreferenceKeys.SelectionColor) || Constants.PreferenceKeys.Default;
                    this._selectionColor = this.convertSelectionColor(n);
                }
                return this._selectionColor;
            },
            set: function (value) {
                if (value && value != this._selectionColor) {
                    this._selectionColor = value;
                    //set _selectionColor
                    this.viewerViewModel.setSelectionColor(value);
                    this.settingService.setString(Constants.PreferenceKeys.SelectionColor, value.name);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "pmiColor", {
            get: function () {
                if (!this._pmiColor) {
                    var n = this.settingService.getString(Constants.PreferenceKeys.PmiColor) || Constants.PreferenceKeys.Default;
                    this._pmiColor = this.convertPMIColor(n);
                }
                return this._pmiColor;
            },
            set: function (value) {
                if (value && value != this._pmiColor) {
                    this._pmiColor = value;
                    //set _pmiColor
                    this.viewerViewModel.setPmiColor(value);
                    this.settingService.setString(Constants.PreferenceKeys.PmiColor, value.name);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "viewType", {
            get: function () {
                if (!this._viewType) {
                    this._viewType = this.settingService.getString(Constants.PreferenceKeys.ViewType) || NonJT.ViewType[NonJT.ViewType.Orthographic];
                }
                return this._viewType;
            },
            set: function (value) {
                if (value && value != NonJT.ViewType[this._viewType]) {
                    this._viewType = value;
                    this.viewerViewModel.setCameraMode(NonJT.ViewType[this._viewType]);
                    this.settingService.setString(Constants.PreferenceKeys.ViewType, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "backgroundColors", {
            get: function () {
                return ColorInfo.ColorInfo.backgroundColors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "selectionColors", {
            get: function () {
                return ColorInfo.ColorInfo.selectionColors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "pmiColors", {
            get: function () {
                return ColorInfo.ColorInfo.pmiColors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingViewModel.prototype, "viewTypes", {
            get: function () {
                return [NonJT.ViewType[NonJT.ViewType.Orthographic], NonJT.ViewType[NonJT.ViewType.Perspective]];
            },
            enumerable: true,
            configurable: true
        });
        SettingViewModel.prototype.toggleLegalPanel = function () {
            this.mainViewModel.toggleLegalPanel();
        };
        SettingViewModel.prototype.openHelpPage = function () {
            this.mainViewModel.openHelpPage();
        };
        SettingViewModel.prototype.openPrivacyPage = function () {
            this.mainViewModel.openPrivacyPage();
        };
        SettingViewModel.prototype.RestoreDefaults = function () {
            this.backgroundColor = ColorInfo.ColorInfo.defaultBackgroundColor;
            this.selectionColor = ColorInfo.ColorInfo.defaultSelectionColor;
            this.pmiColor = ColorInfo.ColorInfo.defaultPMIColor;
            this.viewType = NonJT.ViewType[NonJT.ViewType.Perspective];
            this.language = this.convertLanguage(I18N.I18N.getSystemPreferredLanguage());
        };
        return SettingViewModel;
    })(Kernel.ViewModelBase);
    exports.SettingViewModel = SettingViewModel;
});
//# sourceMappingURL=SettingViewModel.js.map