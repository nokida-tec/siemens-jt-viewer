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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Models/NonJT", "scripts/app/Constants", "scripts/app/Messages/Messages"], function (require, exports, Kernel, NonJT, Constants, Messages) {
    var NavigatorViewModel = (function (_super) {
        __extends(NavigatorViewModel, _super);
        function NavigatorViewModel(mainViewModel) {
            _super.call(this);
            this.mainViewModel = mainViewModel;
            this._modes = [new NonJT.TabItem(Constants.Strings.Structure, Constants.IconPaths.assemblyTab),
                new NonJT.TabItem(Constants.Strings.ModelView, Constants.IconPaths.modelViewTab)];
            this._currentMode = Constants.Strings.Structure;
            this._breadcrumbSize = 1;
            this._main = mainViewModel;
        }
        Object.defineProperty(NavigatorViewModel.prototype, "loadedPart", {
            get: function () {
                return this._loadedPart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "modes", {
            get: function () {
                return this._modes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "currentMode", {
            get: function () {
                return this._currentMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "contextPart", {
            get: function () {
                return this._contextPart;
            },
            set: function (value) {
                if (this._contextPart != value) {
                    this._contextPart = value;
                    this.updateBreadcrumbs();
                    this.sendMessage(new Messages.ContextPartChanged(value));
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "breadcrumbSize", {
            get: function () {
                return this._breadcrumbSize;
            },
            set: function (value) {
                if (this._breadcrumbSize != value) {
                    this._breadcrumbSize = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        NavigatorViewModel.prototype.toggleNavigator = function () {
            this._main.isNavigatorExpanded = !this._main.isNavigatorExpanded;
        };
        Object.defineProperty(NavigatorViewModel.prototype, "isNavigatorExpanded", {
            get: function () {
                return this._main.isNavigatorExpanded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "displayPart", {
            get: function () {
                return this._displayPart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "selectedPart", {
            get: function () {
                return this._selectedPart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "markupViews", {
            get: function () {
                return ["MarkupView1", "MarkupView2", "MarkupView3"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "modelViews", {
            get: function () {
                if (!this._contextPart) {
                    return null;
                }
                return this._contextPart.modelViews;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "breadCrumbs", {
            get: function () {
                return this._breadCrumbs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigatorViewModel.prototype, "selectedModelView", {
            get: function () {
                return this._selectedModelView;
            },
            enumerable: true,
            configurable: true
        });
        NavigatorViewModel.prototype.setVisibility = function (part) {
            var oldVis = this._loadedPart.visSwitchOn;
            var oldPVis = this._loadedPart.isPartiallyVisible;
            part.visSwitchOn = !part.visSwitchOn;
            var newVis = this._loadedPart.visSwitchOn;
            var newPVis = this._loadedPart.isPartiallyVisible;
            if (newVis != oldVis || oldPVis != newPVis) {
                // fire message
                var msg = new Messages.LoadedPartVisibilityChanged(!newPVis && newVis);
                this.sendMessage(msg);
            }
            if (this.selectedPart && (part === this.selectedPart)) {
                // fire message
                var msg2 = new Messages.SelectedItemVisibilityChanged(part);
                this.sendMessage(msg2);
            }
        };
        NavigatorViewModel.prototype.selectModelView = function (value) {
            var deselected = null;
            var selected = null;
            if (this._selectedModelView != value) {
                if (this._selectedModelView) {
                    this._selectedModelView.isSelected = false;
                }
                if (value) {
                    value.isSelected = true;
                    selected = value;
                }
                this._selectedModelView = value;
            }
            else {
                if (value) {
                    value.isSelected = false;
                    this._selectedModelView = null;
                    deselected = value;
                }
            }
            var msg = new Messages.SelectedModelViewChanged(deselected, selected);
            this.sendMessage(msg);
        };
        NavigatorViewModel.prototype.expandPart = function (part) {
            if (this._contextPart != part) {
                this.contextPart = part;
                this.selectPart(null);
            }
        };
        NavigatorViewModel.prototype.selectPart = function (part) {
            this.setDisplayPart(null);
            if (this._selectedPart != part) {
                if (this._selectedPart) {
                    this._selectedPart.isSelected = false;
                }
                this._selectedPart = part;
                if (part) {
                    part.isSelected = true;
                }
            }
            else {
                if (this._selectedPart) {
                    this._selectedPart.isSelected = false;
                }
                this._selectedPart = null;
            }
            var msg = new Messages.NavigatorSelectionChanged(this._selectedPart);
            this.sendMessage(msg);
        };
        NavigatorViewModel.prototype.setDisplayPart = function (part) {
            if (part && part != this.contextPart) {
                this._displayPart = part;
                if (this.contextPart) {
                    part.breadCrumbPreviewOn(this.contextPart, true);
                }
            }
            else {
                if (this._displayPart) {
                    if (this.contextPart) {
                        this._displayPart.breadCrumbPreviewOn(this.contextPart, false);
                    }
                    this._displayPart = null;
                }
            }
            var msg = new Messages.DisplayPartChanged(this._displayPart);
            this.sendMessage(msg);
        };
        NavigatorViewModel.prototype.onActivated = function () {
            var _this = this;
            _super.prototype.onActivated.call(this);
            this.onMessage(Messages.LoadedPartChanged, function (msg) {
                _this._loadedPart = msg.part;
                _this.contextPart = msg.part;
                _this.setDisplayPart(null);
                _this._partMap = msg.partMap;
            });
            var self = this;
            this.onMessage(Messages.ViewerDrillDownTriggered, function (msg) {
                _this.expandPart(msg.part);
            });
            this.onMessage(Messages.SelectedPartChanged, function (msg) {
                if (msg.partIds && msg.partIds.length > 0) {
                    var part = self._partMap[msg.partIds[0]];
                    if (part) {
                        var p = self.getSelectedPartInContext(part);
                        self.selectPart(p);
                    }
                }
                else {
                    self.selectPart(null);
                }
            });
        };
        NavigatorViewModel.prototype.getSelectedPartInContext = function (selectedPart) {
            var children = this._contextPart.children;
            if (children && children.length > 0) {
                var current = selectedPart;
                while (current) {
                    for (var i = 0; i < children.length; i++) {
                        var part = this._contextPart.children[i];
                        if (part == current) {
                            return part;
                        }
                    }
                    current = current.parent;
                }
            }
            return selectedPart;
        };
        NavigatorViewModel.prototype.onStateChanged = function (params) {
            _super.prototype.onStateChanged.call(this, params);
            if (!this.alreadyLoaded(params)) {
                if (params.contextPart) {
                    var part = this._partMap[params.contextPart];
                    this.contextPart = part;
                }
                if (params.mode === Constants.Strings.Structure && params.contextPart === undefined) {
                    if (params.pickerUsed && params.pickerUsed === "true") {
                        this._modelPath = params.modelPath;
                        this._jtFilePath = params.jtFilePath;
                        if (params.jtFilePath) {
                            this.cleanPS();
                            var msg = new Messages.ModelPathChanged(params.modelPath, params.jtFilePath, params.loadAsBod);
                            this.sendMessage(msg);
                        }
                    }
                    else {
                        this._modelPath = params.modelPath;
                        this._jtFilePath = undefined;
                        if (params.modelPath) {
                            this.cleanPS();
                            var msg = new Messages.ModelPathChanged(params.modelPath);
                            this.sendMessage(msg);
                        }
                    }
                    this._selectedModelView = null;
                    this._selectedPart = null;
                }
                if (params.mode && params.mode != "" && this.currentMode != params.mode) {
                    this._currentMode = params.mode;
                    if (this._currentMode === Constants.Strings.Structure) {
                        this.selectModelView(null);
                    }
                    else if (this._currentMode === Constants.Strings.ModelView) {
                        this._main.viewer.buildModelViewList();
                        if (!this._modelViewActivated) {
                            this._modelViewActivated = new Messages.ModelViewActivated();
                        }
                        this.sendMessage(this._modelViewActivated);
                        this.selectPart(null);
                    }
                    if (params.contextPart && !this._main.isNavigatorExpanded) {
                        this.toggleNavigator();
                    }
                }
            }
        };
        NavigatorViewModel.prototype.alreadyLoaded = function (params) {
            var isLoaded = false;
            if (params.mode === Constants.Strings.Structure && params.contextPart === undefined) {
                if (params.pickerUsed && params.pickerUsed === "true") {
                    isLoaded = this._jtFilePath == params.jtFilePath;
                }
                else {
                    isLoaded = this._modelPath == params.modelPath;
                }
            }
            return isLoaded;
        };
        NavigatorViewModel.prototype.updateBreadcrumbs = function () {
            var current = this._contextPart;
            this._breadCrumbs = [];
            this.breadcrumbSize = 0;
            while (current) {
                this._breadCrumbs.unshift(current);
                this.breadcrumbSize = this.breadcrumbSize + 1;
                current = current.parent;
            }
        };
        NavigatorViewModel.prototype.cleanPS = function () {
            //attempt cleanup
            this._loadedPart = null;
            this.contextPart = null;
            this._partMap = null;
            this.setDisplayPart(null);
        };
        NavigatorViewModel.prototype.displayLeftPanel = function (title, id) {
            if (title == this._currentMode) {
                this.toggleNavigator();
            }
            else {
                if (id == "mode0") {
                    document.getElementById(id).click(); // simulate click to switch modes
                }
                else if (id == "mode1") {
                    document.getElementById(id).click(); // simulate click to switch modes
                }
                else {
                }
            }
        };
        return NavigatorViewModel;
    })(Kernel.ViewModelBase);
    exports.NavigatorViewModel = NavigatorViewModel;
});
//# sourceMappingURL=NavigatorViewModel.js.map