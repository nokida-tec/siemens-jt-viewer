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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Utils/Helper"], function (require, exports, Kernel, Helper) {
    var Taps = (function (_super) {
        __extends(Taps, _super);
        function Taps() {
            _super.call(this, ["plSingletap", "plDoubletap"], Kernel.RestrictType.Attribute);
        }
        Taps.prototype.link = function ($injector, scope, elm, attrs) {
            var $parse = $injector.get("$parse");
            var el = $(elm[0]);
            var singleTapHandler = $parse(attrs[this.names[0]]);
            var doubleTapHandler = $parse(attrs[this.names[1]]);
            var threshold = 10; //10 px movement threshold
            var tapPress, tapRelease;
            var tapCount = 0;
            if (Helper.IsRippleEnabled) {
                var startLocX, startLocY, endLocX1, endLocY1, endLocX2, endLocY2;
                var handler = el.data("handler");
                var onStart = function (evt) {
                    if (tapCount >= 2) {
                        tapCount = 0;
                    }
                    if (evt.originalEvent.changedTouches.length == 1) {
                        var touch = Helper.GetTouchesFromEvent(evt);
                        if (touch != undefined) {
                            startLocX = touch.pageX;
                            startLocY = touch.pageY;
                            tapPress = evt.timeStamp;
                        }
                    }
                };
                if (!handler) {
                    handler = function (evt) {
                        if (evt.originalEvent.changedTouches.length == 1) {
                            tapRelease = evt.timeStamp;
                            if (tapRelease - tapPress < 1000) {
                                tapCount++;
                                var event = evt;
                                if (tapCount == 1) {
                                    timer = setTimeout(function () {
                                        if (singleTapHandler && tapCount == 1) {
                                            scope.$apply(function () {
                                                var touch = Helper.GetTouchesFromEvent(evt);
                                                if (touch != undefined) {
                                                    endLocX1 = touch.pageX;
                                                    endLocY1 = touch.pageY;
                                                }
                                                if ((Math.abs(startLocX - endLocX1) < threshold) && (Math.abs(startLocY - endLocY1) < threshold)) {
                                                    singleTapHandler(scope, { $event: event });
                                                }
                                            });
                                        }
                                        tapCount = 0;
                                    }, delay);
                                }
                                else if (tapCount == 2 && doubleTapHandler) {
                                    var touch = Helper.GetTouchesFromEvent(evt);
                                    if (touch != undefined) {
                                        endLocX2 = touch.pageX;
                                        endLocY2 = touch.pageY;
                                    }
                                    if ((Math.abs(startLocX - endLocX2) < threshold) && (Math.abs(startLocY - endLocY2) < threshold)) {
                                        scope.$apply(function () {
                                            doubleTapHandler(scope, { $event: event });
                                        });
                                    }
                                    if (timer) {
                                        clearTimeout(timer);
                                    }
                                }
                            }
                        }
                    };
                    if (singleTapHandler || doubleTapHandler) {
                        var delay = 300, timer = null;
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
                            el.unbind("touchend", handler);
                        }
                        else {
                            el.unbind("mousedown", onStart);
                            el.unbind("mouseup", handler);
                        }
                        el.data("handler", null);
                    });
                    el.data("handler", handler);
                }
                return true;
            }
            var hammer = el.data("hammer");
            if (!hammer) {
                hammer = new Hammer.Manager(elm[0]);
                var singleTap = new Hammer.Tap({ event: "singletap" });
                var doubleTap = new Hammer.Tap({ event: "doubletap", taps: 2 });
                hammer.add([doubleTap, singleTap]);
                singleTap.requireFailure([doubleTap]);
                if (singleTapHandler) {
                    hammer.on("singletap", function (evt) {
                        scope.$apply(function () {
                            singleTapHandler(scope, { $event: evt });
                        });
                    });
                }
                if (doubleTapHandler) {
                    hammer.on("doubletap", function (evt) {
                        scope.$apply(function () {
                            doubleTapHandler(scope, { $event: evt });
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
        return Taps;
    })(Kernel.DirectiveBase);
    exports.Taps = Taps;
});
//# sourceMappingURL=Taps.js.map