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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Messages/Messages"], function (require, exports, Kernel, Messages) {
    var ResizeNavigator = (function (_super) {
        __extends(ResizeNavigator, _super);
        function ResizeNavigator() {
            _super.call(this, ["resizeNavigator"]);
        }
        ResizeNavigator.prototype.link = function ($injector, scope, elm, attrs) {
            var _this = this;
            var el = $(elm[0]);
            this.navigator = scope.vm;
            this.updateNavHeight();
            if (navigator) {
                this.navigator.onMessage(Messages.NavigatorToggled, function (msg) {
                    _this.updateNavHeight();
                });
            }
            var that = this;
            $(window).on("resize", function (event) {
                that.updateNavHeight();
            });
        };
        ResizeNavigator.prototype.updateNavHeight = function () {
            if (navigator) {
                var h = document.documentElement.clientHeight;
                var breadcrumbs = this.navigator.breadcrumbSize * 35;
                var buffer = 70;
                var navContainer = document.getElementById('navScroller');
                var x = h - breadcrumbs - buffer;
                navContainer.style.height = x.toString() + 'px';
            }
        };
        return ResizeNavigator;
    })(Kernel.DirectiveBase);
    exports.ResizeNavigator = ResizeNavigator;
});
//# sourceMappingURL=ResizeNavigator.js.map