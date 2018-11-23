// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
define(["require", "exports"], function (require, exports) {
    function IsRippleEnabled() {
        return window.location.search.indexOf("enableripple") >= 0;
    }
    exports.IsRippleEnabled = IsRippleEnabled;
    function GetTouchesFromEvent(evt) {
        var mytouch = evt.originalEvent.changedTouches[0];
        if (evt.offsetX) {
            mytouch.pageX = evt.offsetX;
            mytouch.pageY = evt.offsetY;
        }
        else if (evt.originalEvent.pageX != undefined && (evt.originalEvent.pageX != 0 || evt.originalEvent.pageY != 0)) {
            mytouch.pageX = evt.originalEvent.pageX;
            mytouch.pageY = evt.originalEvent.pageY;
        }
        return mytouch;
    }
    exports.GetTouchesFromEvent = GetTouchesFromEvent;
    function existJt2Go() {
        var nav;
        nav = navigator;
        if (nav.app) {
            if (device.platform) {
                var platformStr = device.platform;
                if (platformStr.indexOf("Android") > -1) {
                    var succeed = function () {
                        // do nothing,   alert("finish jt2bod succeeded ");
                    };
                    jt2bod.fini(succeed, null);
                }
            }
            nav.app.exitApp();
        }
    }
    exports.existJt2Go = existJt2Go;
    function getCordovaAssetPath() {
        var path = window.location.pathname;
        var sizefilename = path.length - (path.lastIndexOf("/") + 1);
        path = path.substr(0, path.length - sizefilename);
        return path;
    }
    exports.getCordovaAssetPath = getCordovaAssetPath;
});
//# sourceMappingURL=Helper.js.map