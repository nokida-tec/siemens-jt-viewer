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
    var ResizeProperties = (function (_super) {
        __extends(ResizeProperties, _super);
        function ResizeProperties() {
            _super.call(this, ["resizeProperties"]);
            this.HEADER_SIZE = 60;
        }
        ResizeProperties.prototype.link = function ($injector, scope, elm, attrs) {
            var _this = this;
            this._ele = $(elm[0]);
            this.prop = scope.vm;
            this.updatePropHeight();
            if (this.prop) {
                this.prop.onMessage(Messages.PropertiesToggled, function (msg) {
                    _this.updatePropHeight();
                });
            }
            var that = this;
            $(window).on("resize", function (event) {
                that.updatePropHeight();
            });
        };
        ResizeProperties.prototype.updatePropHeight = function () {
            if (this.prop) {
                var h = document.documentElement.clientHeight;
                //instead of ID, walk DOM tree for reusability
                var targetEle = this._ele[0];
                var buffer = 130; // buffer = 65 oringinally, added another appBarHeight 
                var x = h - this.HEADER_SIZE - buffer;
                targetEle.style.height = x.toString() + 'px';
            }
        };
        return ResizeProperties;
    })(Kernel.DirectiveBase);
    exports.ResizeProperties = ResizeProperties;
});
//# sourceMappingURL=ResizeProperties.js.map