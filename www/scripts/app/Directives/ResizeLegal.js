"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Messages/Messages"], function (require, exports, Kernel, Messages) {
    var ResizeLegal = (function (_super) {
        __extends(ResizeLegal, _super);
        function ResizeLegal() {
            _super.call(this, ["resizeLegal"]);
        }
        ResizeLegal.prototype.link = function ($injector, scope, elm, attrs) {
            var _this = this;
            this._ele = $(elm[0]);
            this.legal = scope.vm;
            this.updateLegalHeight();
            if (this.legal) {
                this.legal.onMessage(Messages.LegalToggled, function (msg) {
                    _this.updateLegalHeight();
                });
            }
            var that = this;
            $(window).on("resize", function (event) {
                that.updateLegalHeight();
            });
        };
        ResizeLegal.prototype.updateLegalHeight = function () {
            if (this.legal) {
                var h = document.documentElement.clientHeight;
                //instead of ID, walk DOM tree for reusability
                var targetEle = this._ele[0];
                var buffer = 65;
                var x = h - buffer;
                targetEle.style.height = x.toString() + 'px';
            }
        };
        return ResizeLegal;
    })(Kernel.DirectiveBase);
    exports.ResizeLegal = ResizeLegal;
});
//# sourceMappingURL=ResizeLegal.js.map