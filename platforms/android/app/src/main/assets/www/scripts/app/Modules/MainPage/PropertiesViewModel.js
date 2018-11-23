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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Models/JT"], function (require, exports, Kernel, JT) {
    ;
    var PropertiesViewModel = (function (_super) {
        __extends(PropertiesViewModel, _super);
        function PropertiesViewModel(viewerViewModel, mainViewModel) {
            _super.call(this);
            this.viewerViewModel = viewerViewModel;
            this.mainViewModel = mainViewModel;
            this.initViewModel();
        }
        PropertiesViewModel.prototype.initViewModel = function () {
            this._propertyGroups = new Array();
            var propertyGroup1 = new Array();
            var propertyGroup2 = new Array();
            propertyGroup1.push(new JT.Property("Application Name", "Solid Edge"));
            propertyGroup1.push(new JT.Property("Author", "dayton"));
            propertyGroup1.push(new JT.Property("Template", "Normal.asm"));
            propertyGroup1.push(new JT.Property("Last Author", "vinsend"));
            propertyGroup2.push(new JT.Property("Unit", "METERS"));
            propertyGroup2.push(new JT.Property("Parts", "224"));
            propertyGroup2.push(new JT.Property("Width", ".39"));
            var groupA = new JT.PropertyGroup("Attribute", propertyGroup1);
            var groupB = new JT.PropertyGroup("Geometry", propertyGroup2);
            this._propertyGroups.push(groupA);
            this._propertyGroups.push(groupB);
        };
        PropertiesViewModel.prototype.togglePropertiesPanel = function () {
            return this.mainViewModel.togglePropertiesPanel();
        };
        Object.defineProperty(PropertiesViewModel.prototype, "propertyList", {
            get: function () {
                return this._propertyGroups;
            },
            set: function (propertyGroups) {
                if (propertyGroups && this._propertyGroups != propertyGroups) {
                    this._propertyGroups = propertyGroups;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertiesViewModel.prototype, "currentPart", {
            get: function () {
                return this.viewerViewModel.currentPart;
            },
            enumerable: true,
            configurable: true
        });
        return PropertiesViewModel;
    })(Kernel.ViewModelBase);
    exports.PropertiesViewModel = PropertiesViewModel;
});
//# sourceMappingURL=PropertiesViewModel.js.map