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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Models/JT", "scripts/app/Messages/Messages"], function (require, exports, Kernel, JT, Messages) {
    ;
    var PmiFiltersViewModel = (function (_super) {
        __extends(PmiFiltersViewModel, _super);
        function PmiFiltersViewModel(mainViewModel) {
            _super.call(this);
            this.mainViewModel = mainViewModel;
            this.initViewModel();
        }
        PmiFiltersViewModel.prototype.initViewModel = function () {
            this._pmiFilters = new Array();
            this._pmiFilters.push(new JT.PmiFilter("Dimension", true));
            this._pmiFilters.push(new JT.PmiFilter("Datum Feature Symbols", true));
            this._pmiFilters.push(new JT.PmiFilter("Feature Control Frames", true));
            this._pmiFilters.push(new JT.PmiFilter("Measurement Points", true));
            this._pmiFilters.push(new JT.PmiFilter("Geometry", true));
            this._pmiFilters.push(new JT.PmiFilter("Surface", true));
            this._pmiFilters.push(new JT.PmiFilter("Line Welds", true));
            this._pmiFilters.push(new JT.PmiFilter("Spot Welds", true));
            this._pmiFilters.push(new JT.PmiFilter("Datum Targets", true));
            this._pmiFilters.push(new JT.PmiFilter("Note", true));
            this._pmiFilters.push(new JT.PmiFilter("Locators", true));
            this._pmiFilters.push(new JT.PmiFilter("Coordinate Systems", true));
            this._pmiFilters.push(new JT.PmiFilter("Other", true));
        };
        PmiFiltersViewModel.prototype.togglePmiFiltersPanel = function () {
            return this.mainViewModel.togglePmiFiltersPanel();
        };
        Object.defineProperty(PmiFiltersViewModel.prototype, "pmiList", {
            get: function () {
                return this._pmiFilters;
            },
            set: function (pmiFilters) {
                if (pmiFilters && this._pmiFilters != pmiFilters) {
                    this._pmiFilters = pmiFilters;
                }
            },
            enumerable: true,
            configurable: true
        });
        PmiFiltersViewModel.prototype.filterClicked = function (clickedFilter) {
            clickedFilter.isOn = !clickedFilter.isOn;
            // fire message
            var changedfilters = [clickedFilter];
            var msg = new Messages.PmiFiltersChanged(changedfilters);
            this.sendMessage(msg);
        };
        Object.defineProperty(PmiFiltersViewModel.prototype, "selectState", {
            get: function () {
                var checkedItems = 0;
                for (var i = 0; i < this._pmiFilters.length; i++) {
                    if (this._pmiFilters[i].isOn == true) {
                        checkedItems++;
                    }
                }
                if (checkedItems == 0) {
                    return "none";
                }
                else if (checkedItems == this._pmiFilters.length) {
                    return "all";
                }
                else {
                    return "partial";
                }
            },
            set: function (newState) {
                switch (newState) {
                    case "all": {
                        for (var i = 0; i < this._pmiFilters.length; i++) {
                            this._pmiFilters[i].isOn = true;
                        }
                        var msg = new Messages.PmiFiltersChanged(this._pmiFilters);
                        this.sendMessage(msg);
                        break;
                    }
                    default: {
                        for (var i = 0; i < this._pmiFilters.length; i++) {
                            this._pmiFilters[i].isOn = false;
                        }
                        var msg = new Messages.PmiFiltersChanged(this._pmiFilters);
                        this.sendMessage(msg);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        PmiFiltersViewModel.prototype.selectAll = function () {
            if (this.selectState == "all") {
                this.selectState = "none";
            }
            else {
                this.selectState = "all";
            }
        };
        return PmiFiltersViewModel;
    })(Kernel.ViewModelBase);
    exports.PmiFiltersViewModel = PmiFiltersViewModel;
});
//# sourceMappingURL=PmiFiltersViewModel.js.map