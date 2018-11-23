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
define(["require", "exports"], function (require, exports) {
    // the base class for message
    var MessageBase = (function () {
        function MessageBase() {
        }
        return MessageBase;
    })();
    exports.MessageBase = MessageBase;
    // base class for PartChangedMessage
    var PartChangedMessage = (function (_super) {
        __extends(PartChangedMessage, _super);
        function PartChangedMessage(part) {
            _super.call(this);
            this._part = part;
        }
        Object.defineProperty(PartChangedMessage.prototype, "part", {
            get: function () {
                return this._part;
            },
            enumerable: true,
            configurable: true
        });
        return PartChangedMessage;
    })(MessageBase);
    exports.PartChangedMessage = PartChangedMessage;
    var SelectedModelViewChanged = (function (_super) {
        __extends(SelectedModelViewChanged, _super);
        function SelectedModelViewChanged(deselectedModelView, selectedModelView) {
            _super.call(this);
            this._deselectedMV = deselectedModelView;
            this._selectedMV = selectedModelView;
        }
        Object.defineProperty(SelectedModelViewChanged.prototype, "deselectedMV", {
            get: function () {
                return this._deselectedMV;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectedModelViewChanged.prototype, "selectedMV", {
            get: function () {
                return this._selectedMV;
            },
            enumerable: true,
            configurable: true
        });
        return SelectedModelViewChanged;
    })(MessageBase);
    exports.SelectedModelViewChanged = SelectedModelViewChanged;
    /* base class for checking if isallvisible changed*/
    var IsAllVisibleChangedMessage = (function (_super) {
        __extends(IsAllVisibleChangedMessage, _super);
        function IsAllVisibleChangedMessage(isAllVisible) {
            _super.call(this);
            this._isAllVisible = isAllVisible;
        }
        Object.defineProperty(IsAllVisibleChangedMessage.prototype, "isAllVisible", {
            get: function () {
                return this._isAllVisible;
            },
            enumerable: true,
            configurable: true
        });
        return IsAllVisibleChangedMessage;
    })(MessageBase);
    exports.IsAllVisibleChangedMessage = IsAllVisibleChangedMessage;
    /* base class for selectedObject getting changed*/
    var SelectedObjectChanged = (function (_super) {
        __extends(SelectedObjectChanged, _super);
        function SelectedObjectChanged(partId) {
            _super.call(this);
            this._partIds = partId;
        }
        Object.defineProperty(SelectedObjectChanged.prototype, "partIds", {
            get: function () {
                return this._partIds;
            },
            enumerable: true,
            configurable: true
        });
        return SelectedObjectChanged;
    })(MessageBase);
    exports.SelectedObjectChanged = SelectedObjectChanged;
    var SelectedPartChanged = (function (_super) {
        __extends(SelectedPartChanged, _super);
        function SelectedPartChanged(partId) {
            _super.call(this, partId);
        }
        return SelectedPartChanged;
    })(SelectedObjectChanged);
    exports.SelectedPartChanged = SelectedPartChanged;
    var SelectedPmiChanged = (function (_super) {
        __extends(SelectedPmiChanged, _super);
        function SelectedPmiChanged(partId) {
            _super.call(this, partId);
        }
        return SelectedPmiChanged;
    })(SelectedObjectChanged);
    exports.SelectedPmiChanged = SelectedPmiChanged;
    var PmiFiltersChanged = (function (_super) {
        __extends(PmiFiltersChanged, _super);
        function PmiFiltersChanged(changedFilters) {
            _super.call(this);
            this._pmiFilters = changedFilters;
        }
        Object.defineProperty(PmiFiltersChanged.prototype, "pmiFilters", {
            get: function () {
                return this._pmiFilters;
            },
            enumerable: true,
            configurable: true
        });
        return PmiFiltersChanged;
    })(MessageBase);
    exports.PmiFiltersChanged = PmiFiltersChanged;
    var NavigatorSelectionChanged = (function (_super) {
        __extends(NavigatorSelectionChanged, _super);
        function NavigatorSelectionChanged(selectedPart) {
            _super.call(this);
            this._selectedPart = selectedPart;
        }
        Object.defineProperty(NavigatorSelectionChanged.prototype, "selectedPart", {
            get: function () {
                return this._selectedPart;
            },
            enumerable: true,
            configurable: true
        });
        return NavigatorSelectionChanged;
    })(MessageBase);
    exports.NavigatorSelectionChanged = NavigatorSelectionChanged;
    var SelectedItemVisibilityChanged = (function (_super) {
        __extends(SelectedItemVisibilityChanged, _super);
        function SelectedItemVisibilityChanged(selectedPart) {
            _super.call(this);
            this._selectedPart = selectedPart;
        }
        Object.defineProperty(SelectedItemVisibilityChanged.prototype, "selectedPart", {
            get: function () {
                return this._selectedPart;
            },
            enumerable: true,
            configurable: true
        });
        return SelectedItemVisibilityChanged;
    })(MessageBase);
    exports.SelectedItemVisibilityChanged = SelectedItemVisibilityChanged;
    var ModelPathChanged = (function (_super) {
        __extends(ModelPathChanged, _super);
        function ModelPathChanged(modelPath, jtFilePath, loadAsBod) {
            _super.call(this);
            this._modelPath = modelPath;
            if (jtFilePath) {
                this._jtFilePath = jtFilePath;
            }
            if (loadAsBod) {
                this._loadAsBod = loadAsBod;
            }
        }
        Object.defineProperty(ModelPathChanged.prototype, "modelPath", {
            get: function () {
                return this._modelPath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelPathChanged.prototype, "jtFilePath", {
            get: function () {
                return this._jtFilePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelPathChanged.prototype, "loadAsBod", {
            get: function () {
                return this._loadAsBod;
            },
            enumerable: true,
            configurable: true
        });
        return ModelPathChanged;
    })(MessageBase);
    exports.ModelPathChanged = ModelPathChanged;
    var ModelViewActivated = (function (_super) {
        __extends(ModelViewActivated, _super);
        function ModelViewActivated() {
            _super.apply(this, arguments);
        }
        return ModelViewActivated;
    })(MessageBase);
    exports.ModelViewActivated = ModelViewActivated;
    var NavigatorToggled = (function (_super) {
        __extends(NavigatorToggled, _super);
        function NavigatorToggled() {
            _super.apply(this, arguments);
        }
        return NavigatorToggled;
    })(MessageBase);
    exports.NavigatorToggled = NavigatorToggled;
    var LegalToggled = (function (_super) {
        __extends(LegalToggled, _super);
        function LegalToggled() {
            _super.apply(this, arguments);
        }
        return LegalToggled;
    })(MessageBase);
    exports.LegalToggled = LegalToggled;
    var PropertiesToggled = (function (_super) {
        __extends(PropertiesToggled, _super);
        function PropertiesToggled() {
            _super.apply(this, arguments);
        }
        return PropertiesToggled;
    })(MessageBase);
    exports.PropertiesToggled = PropertiesToggled;
    var OrientationChanged = (function (_super) {
        __extends(OrientationChanged, _super);
        function OrientationChanged() {
            _super.apply(this, arguments);
        }
        return OrientationChanged;
    })(MessageBase);
    exports.OrientationChanged = OrientationChanged;
    var LoadedPartChanged = (function (_super) {
        __extends(LoadedPartChanged, _super);
        function LoadedPartChanged(part, partMap) {
            _super.call(this);
            this._part = part;
            this._partMap = partMap;
        }
        Object.defineProperty(LoadedPartChanged.prototype, "part", {
            get: function () {
                return this._part;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoadedPartChanged.prototype, "partMap", {
            get: function () {
                return this._partMap;
            },
            enumerable: true,
            configurable: true
        });
        return LoadedPartChanged;
    })(MessageBase);
    exports.LoadedPartChanged = LoadedPartChanged;
    /* needed for app bar state changes*/
    var ContextPartVisibilityChanged = (function (_super) {
        __extends(ContextPartVisibilityChanged, _super);
        function ContextPartVisibilityChanged(isAllVisible) {
            _super.call(this, isAllVisible);
        }
        return ContextPartVisibilityChanged;
    })(IsAllVisibleChangedMessage);
    exports.ContextPartVisibilityChanged = ContextPartVisibilityChanged;
    /* needed for app bar state changes*/
    var LoadedPartVisibilityChanged = (function (_super) {
        __extends(LoadedPartVisibilityChanged, _super);
        function LoadedPartVisibilityChanged(isAllVisible) {
            _super.call(this, isAllVisible);
        }
        return LoadedPartVisibilityChanged;
    })(IsAllVisibleChangedMessage);
    exports.LoadedPartVisibilityChanged = LoadedPartVisibilityChanged;
    var ContextPartChanged = (function (_super) {
        __extends(ContextPartChanged, _super);
        function ContextPartChanged(part) {
            _super.call(this, part);
        }
        return ContextPartChanged;
    })(PartChangedMessage);
    exports.ContextPartChanged = ContextPartChanged;
    var ViewerDrillDownTriggered = (function (_super) {
        __extends(ViewerDrillDownTriggered, _super);
        function ViewerDrillDownTriggered(part) {
            _super.call(this, part);
        }
        return ViewerDrillDownTriggered;
    })(PartChangedMessage);
    exports.ViewerDrillDownTriggered = ViewerDrillDownTriggered;
    var DisplayPartChanged = (function (_super) {
        __extends(DisplayPartChanged, _super);
        function DisplayPartChanged(part) {
            _super.call(this, part);
        }
        return DisplayPartChanged;
    })(PartChangedMessage);
    exports.DisplayPartChanged = DisplayPartChanged;
});
//# sourceMappingURL=Messages.js.map