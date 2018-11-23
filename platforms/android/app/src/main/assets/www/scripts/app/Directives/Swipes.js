// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Utils/Helper"], function (require, exports, Kernel, Helper) {
    var Swipes = (function (_super) {
        __extends(Swipes, _super);
        function Swipes() {
            _super.call(this, ["plSwipedown"], Kernel.RestrictType.Attribute);
        }
        Swipes.prototype.link = function ($injector, scope, elm, attrs) {
            var $parse = $injector.get("$parse");
            var el = $(elm[0]);
            //swipe down:  very basic untimed swipe.  can enhance by making it timed.
            var swipeDownHandler = $parse(attrs[this.names[0]]);
            var threshold = 10; // the minimum movement to register as a swipe
            if (Helper.IsRippleEnabled) {
                var startLocY, endLocY;
                var dragging = false;
                var handler = el.data("handler");
                var onStart = function (evt) {
                    var touch = Helper.GetTouchesFromEvent(evt);
                    if (touch != undefined) {
                        startLocY = touch.pageY;
                    }
                    dragging = true;
                };
                if (!handler) {
                    handler = function (evt) {
                        if (dragging) {
                            scope.$apply(function () {
                                var touch = Helper.GetTouchesFromEvent(evt);
                                if (touch != undefined) {
                                    endLocY = touch.pageY;
                                }
                                if (Math.abs(endLocY - startLocY) > threshold) {
                                    swipeDownHandler(scope, { $event: evt });
                                    dragging = false;
                                }
                            });
                        }
                    };
                    if (swipeDownHandler) {
                        if (navigator.userAgent.match(/(iPhone|iPad|Android)/)) {
                            el.bind("touchstart", onStart);
                            el.bind("touchend", handler);
                        }
                        else {
                            //being tested on desktop
                            el.bind("mousedown", onStart);
                            el.bind("mouseup", handler);
                        }
                    }
                    scope.$on("$destroy", function () {
                        if (navigator.userAgent.match(/(iPhone|iPad|Android)/)) {
                            el.unbind("touchstart", onStart);
                            el.unbind("touchmove", handler);
                        }
                        else {
                            el.unbind("mousedown", onStart);
                            el.unbind("mousemove", handler);
                        }
                        el.data("handler", null);
                    });
                    el.data("handler", handler);
                }
                return true;
            }
        };
        return Swipes;
    })(Kernel.DirectiveBase);
    exports.Swipes = Swipes;
});
//# sourceMappingURL=Swipes.js.map