// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel"], function (require, exports, Kernel) {
    var Scroll = (function (_super) {
        __extends(Scroll, _super);
        function Scroll() {
            _super.call(this, ["plScroll"], Kernel.RestrictType.Attribute);
        }
        Scroll.prototype.link = function ($injector, scope, elm, attrs) {
            scope.$watch(attrs[this.names[0]], function (newValue, oldValue, s) {
                if (newValue) {
                    elm[0].scrollIntoView();
                }
            });
        };
        return Scroll;
    })(Kernel.DirectiveBase);
    exports.Scroll = Scroll;
});
//# sourceMappingURL=Scroll.js.map