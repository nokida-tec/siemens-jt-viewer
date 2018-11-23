// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Modules/MainPage/ViewerViewModel"], function (require, exports, Kernel, ViewerViewModel) {
    var Hold = (function (_super) {
        __extends(Hold, _super);
        function Hold() {
            _super.call(this, ["hold"]);
            this.viewer = ViewerViewModel.ViewerViewModel;
        }
        Hold.prototype.link = function ($injector, scope, elm, attrs) {
            var $parse = $injector.get("$parse");
            var holdHandler = $parse(attrs[this.names[0]]);
            var el = $(elm[0]);
            var hammer = el.data("hammer");
            if (!hammer) {
                hammer = new Hammer.Manager(elm[0]);
                var hold = new Hammer.Press({ event: "hold", threshold: 20, time: 500 });
                hammer.add([hold]);
                if (holdHandler) {
                    hammer.on("hold", function (evt) {
                        scope.$apply(function () {
                            holdHandler(scope, { $event: evt });
                        });
                    });
                }
                scope.$on("$destroy", function () {
                    hammer.destroy();
                    el.data("hammer", null);
                });
                el.data("hammer", hammer);
            }
        };
        return Hold;
    })(Kernel.DirectiveBase);
    exports.Hold = Hold;
});
//# sourceMappingURL=Hold.js.map