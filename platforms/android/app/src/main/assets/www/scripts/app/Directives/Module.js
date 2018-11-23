// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../../typings/angularjs/angular.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Directives/Viewer", "scripts/app/Directives/Scroll", "scripts/app/Directives/Taps", "scripts/app/Directives/Swipes", "scripts/app/Directives/RightClick", "scripts/app/Directives/ResizeNavigator", "scripts/app/Directives/ResizeProperties", "scripts/app/Directives/ResizeLegal", "scripts/app/Directives/Hold"], function (require, exports, Kernel, Viewer, Scroll, Taps, Swipes, RightClick, ResizeNavigator, ResizeProperties, ResizeLegal, Hold) {
    var Module = (function (_super) {
        __extends(Module, _super);
        function Module() {
            _super.call(this, "Directives");
        }
        Module.prototype.startCore = function () {
            this.directive(new Viewer.Viewer());
            this.directive(new Scroll.Scroll());
            this.directive(new Taps.Taps());
            this.directive(new Swipes.Swipes());
            this.directive(new RightClick.RightClick());
            this.directive(new ResizeNavigator.ResizeNavigator());
            this.directive(new ResizeProperties.ResizeProperties());
            this.directive(new ResizeLegal.ResizeLegal());
            this.directive(new Hold.Hold());
        };
        return Module;
    })(Kernel.ModuleBase);
    exports.Module = Module;
});
//# sourceMappingURL=Module.js.map