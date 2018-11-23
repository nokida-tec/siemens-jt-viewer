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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Constants"], function (require, exports, Kernel, Constants) {
    var LegalViewModel = (function (_super) {
        __extends(LegalViewModel, _super);
        function LegalViewModel(mainViewModel, homeViewModel) {
            _super.call(this);
            this.mainViewModel = mainViewModel;
            this.homeViewModel = homeViewModel;
            this._licensePanelTitle = homeViewModel.licensePanelTitle;
        }
        LegalViewModel.prototype.toggleLegalPanel = function () {
            this.mainViewModel.toggleLegalPanel();
        };
        LegalViewModel.prototype.openLegalContentView = function () {
            //TODO:L10N
            var ref = window.open(encodeURI("http://www.plm.automation.siemens.com/en_us/products/eula"), "_blank", "location=yes");
        };
        Object.defineProperty(LegalViewModel.prototype, "licensePanelTitle", {
            get: function () {
                return this._licensePanelTitle;
            },
            enumerable: true,
            configurable: true
        });
        LegalViewModel.prototype.openThirdParty = function () {
            if (device.platform == "Android") {
                window.open(encodeURI(Constants.Strings.ThirdPartyLocationAndroid), '_blank', 'location=no');
            }
            else {
                window.open(encodeURI(Constants.Strings.ThirdPartyLocationIOS), '_blank', 'location=no');
            }
        };
        return LegalViewModel;
    })(Kernel.ViewModelBase);
    exports.LegalViewModel = LegalViewModel;
});
//# sourceMappingURL=LegalViewModel.js.map