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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Models/ColorInfo"], function (require, exports, Kernel, ColorInfo) {
    var CameraViewModel = (function (_super) {
        __extends(CameraViewModel, _super);
        function CameraViewModel(mainViewModel, viewerViewModel) {
            _super.call(this);
            this.mainViewModel = mainViewModel;
            this.viewerViewModel = viewerViewModel;
        }
        CameraViewModel.prototype.toggleBackgroundCamera = function () {
            if (this._cameraVisibility == null) {
                //add camera 
                cordova.plugins.camerapreview.startCamera({ x: 60, y: 0, width: window.innerWidth, height: window.innerHeight }, "back", false, false, true); //(frame, camera, tapEnabled, dragEnabled, toBack)
            }
            if (this._cameraVisibility == true) {
                //hide camera
                this.viewerViewModel.BackgroundColor = ColorInfo.ColorInfo.defaultBackgroundColor;
                //cordova.plugins.camerapreview.stopCamera();
                cordova.plugins.camerapreview.hide();
                this._cameraVisibility = false;
            }
            else {
                //show camera 
                this.viewerViewModel.BackgroundColor = new ColorInfo.ColorInfo("transparent", "rgba(0, 0, 0, 0)");
                cordova.plugins.camerapreview.show();
                this._cameraVisibility = true;
            }
        };
        return CameraViewModel;
    })(Kernel.ViewModelBase);
    exports.CameraViewModel = CameraViewModel;
});
//# sourceMappingURL=CameraViewModel.js.map