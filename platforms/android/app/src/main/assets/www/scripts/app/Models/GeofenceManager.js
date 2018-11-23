// @<COPYRIGHT>@
// ==================================================
// Copyright 2017.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
"use strict";
define(["require", "exports"], function (require, exports) {
    var GoGofence = (function () {
        function GoGofence(_latitude, _longitude, _jtFile) {
            this._latitude = _latitude;
            this._longitude = _longitude;
            this._jtFile = _jtFile;
        }
        Object.defineProperty(GoGofence.prototype, "latitude", {
            get: function () {
                return this._latitude;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoGofence.prototype, "longitude", {
            get: function () {
                return this._longitude;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoGofence.prototype, "jtFile", {
            get: function () {
                return this._jtFile;
            },
            enumerable: true,
            configurable: true
        });
        return GoGofence;
    })();
    exports.GoGofence = GoGofence;
    var GeofenceMgr = (function () {
        function GeofenceMgr(_jtFileList, _fenceCoords) {
            this._jtFileList = _jtFileList;
            this._fenceCoords = _fenceCoords;
            this._geofenceDict = [];
            if (this._jtFileList) {
                for (var j = 0; j < this._jtFileList.length; j++) {
                    var fenceKey = this._jtFileList[j].name;
                    if (_fenceCoords && _fenceCoords[fenceKey]) {
                        var fenceValue = new GoGofence(_fenceCoords[fenceKey][0], _fenceCoords[fenceKey][1], _jtFileList[j]);
                        this._geofenceDict[fenceKey] = fenceValue;
                    }
                }
            }
        }
        GeofenceMgr.prototype.removeFenceItem = function (nameId) {
            for (var y = 0; y < this._jtFileList.length; y++) {
                if (this._jtFileList[y].name == nameId) {
                    this._jtFileList.splice(y, 1);
                }
            }
        };
        GeofenceMgr.prototype.degreesToRadians = function (degrees) {
            return degrees * Math.PI / 180;
        };
        GeofenceMgr.prototype.distanceInKmBetweenEarthCoordinates = function (lat1, lon1, lat2, lon2) {
            var earthRadiusKm = 6371;
            var dLat = this.degreesToRadians(lat2 - lat1);
            var dLon = this.degreesToRadians(lon2 - lon1);
            lat1 = this.degreesToRadians(lat1);
            lat2 = this.degreesToRadians(lat2);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return earthRadiusKm * c;
        };
        GeofenceMgr.prototype.checkIfPositionInFence = function (lati, longi) {
            var foundFile = undefined;
            if (this._jtFileList) {
                for (var j = 0; j < this._jtFileList.length; j++) {
                    var fenceKey = this._jtFileList[j].name;
                    var fenceValue = this._geofenceDict[fenceKey];
                    if (fenceValue != undefined) {
                        var lat2 = fenceValue.latitude;
                        var lon2 = fenceValue.longitude;
                        if (this.distanceInKmBetweenEarthCoordinates(lati, longi, lat2, lon2) < 0.02) {
                            foundFile = fenceValue.jtFile;
                            break;
                        }
                    }
                }
            }
            return foundFile;
        };
        return GeofenceMgr;
    })();
    exports.GeofenceMgr = GeofenceMgr;
});
//# sourceMappingURL=GeofenceManager.js.map