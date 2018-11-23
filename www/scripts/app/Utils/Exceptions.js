// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function (require, exports) {
    var JT2GoException = (function () {
        function JT2GoException(msg, innerException) {
            this._msg = msg;
            this._innerException = innerException;
        }
        Object.defineProperty(JT2GoException.prototype, "message", {
            get: function () {
                return this._msg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JT2GoException.prototype, "innerException", {
            get: function () {
                return this._innerException;
            },
            enumerable: true,
            configurable: true
        });
        return JT2GoException;
    })();
    exports.JT2GoException = JT2GoException;
    var ArgumentOutOfRangeException = (function (_super) {
        __extends(ArgumentOutOfRangeException, _super);
        function ArgumentOutOfRangeException(msg) {
            _super.call(this, msg);
        }
        return ArgumentOutOfRangeException;
    })(JT2GoException);
    exports.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
});
//# sourceMappingURL=Exceptions.js.map