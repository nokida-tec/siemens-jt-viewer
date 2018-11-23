cordova.define("com.siemens.plugin.jt2bod.jt2bod", function(require, exports, module) {
// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@

/*global cordova, module*/

module.exports = {
    convert: function (filepath, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Jt2Bod", "convert", [filepath]);
    },

    convertToBods: function (inpath, outpath, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Jt2Bod", "convertToBods", [inpath, outpath]);
    },

    init: function ( successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Jt2Bod", "init", []);

    },

    fini: function ( successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "Jt2Bod", "fini", []);
    }
};



});
