// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="typings/requirejs/require.d.ts" />
"use strict";
(function (document) {
    function baseUrl(loc) {
        var index = loc.href.indexOf("index.html");
        return loc.href.substring(0, index);
    }
    require.config({
        baseUrl: baseUrl(document.location),
        paths: {
            "jquery": "scripts/libs/jquery/jquery-2.1.4.min"
        },
        shim: {
            "jquery": {
                exports: "$"
            }
        }
    });
    require(["scripts/app/App", "scripts/app/Constants", "jquery"], function (App, Constants, $) {
        "use strict";
        $(document).ready(function () {
            var app = new App.App();
            var appRoot = document.getElementById("appRoot");
            app.start(appRoot);
            document.location.hash = Constants.Strings.HomeHref;
        });
    });
})(document);
// Platform specific overrides will be placed in the merges folder versions of this file 
//# sourceMappingURL=appBundle.js.map