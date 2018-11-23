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
    var RightClick = (function (_super) {
        __extends(RightClick, _super);
        function RightClick() {
            _super.call(this, ["rightClick"], Kernel.RestrictType.Attribute);
        }
        RightClick.prototype.link = function ($injector, scope, elm, attrs) {
            var el = $(elm[0]);
            var $parse = $injector.get("$parse");
            var fn = $parse(attrs[this.names[0]]);
            el.bind('contextmenu', function (event) {
                event.preventDefault();
                scope.$apply(function () {
                    fn(scope, { $event: event });
                });
            });
        };
        return RightClick;
    })(Kernel.DirectiveBase);
    exports.RightClick = RightClick;
});
//# sourceMappingURL=RightClick.js.map