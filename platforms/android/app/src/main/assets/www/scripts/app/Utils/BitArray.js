// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
define(["require", "exports"], function (require, exports) {
    //import Exceptions = require("scripts/app/Utils/Exceptions");
    var BitArray = (function () {
        function BitArray(length, defaultValue) {
            this._length = length;
            defaultValue = defaultValue || false;
            var value = defaultValue ? BitArray.DefaultValue : 0;
            this.bits = new Array(this.getArrayLength(length, 32));
            for (var i = 0; i < this.bits.length; i++) {
                this.bits[i] = value;
            }
        }
        Object.defineProperty(BitArray.prototype, "allOn", {
            get: function () {
                for (var i = 0; i < this._length; i++) {
                    if (!this.getBit(i)) {
                        return false;
                    }
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitArray.prototype, "allOff", {
            get: function () {
                for (var i = 0; i < this._length; i++) {
                    if (this.getBit(i)) {
                        return false;
                    }
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        BitArray.prototype.setAll = function (value) {
            var v = value ? BitArray.DefaultValue : 0;
            for (var i = 0; i < this.bits.length; i++) {
                this.bits[i] = v;
            }
        };
        BitArray.prototype.setBit = function (pos, value) {
            //if (pos < 0 || pos >= this._length) {
            //    throw new Exceptions.ArgumentOutOfRangeException("pos is out of range");
            //}
            var i = Math.floor(pos / 32);
            if (value) {
                this.bits[i] |= 1 << (pos % 32);
            }
            else {
                this.bits[i] &= ~(1 << (pos % 32));
            }
        };
        BitArray.prototype.getBit = function (pos) {
            //if (pos < 0 || pos >= this._length) {
            //    throw new Exceptions.ArgumentOutOfRangeException("pos is out of range");
            //}
            var i = Math.floor(pos / 32);
            return (this.bits[i] & 1 << (pos % 32)) != 0;
        };
        BitArray.prototype.hasAny = function (value) {
            for (var i = 0; i < this._length; i++) {
                if (this.getBit(i) == value) {
                    return true;
                }
            }
            return false;
        };
        BitArray.prototype.getArrayLength = function (size, div) {
            if (size <= 0) {
                return 0;
            }
            return Math.floor((size - 1) / div + 1);
        };
        BitArray.DefaultValue = 0xFFFFFFFF;
        return BitArray;
    })();
    exports.BitArray = BitArray;
});
//# sourceMappingURL=BitArray.js.map