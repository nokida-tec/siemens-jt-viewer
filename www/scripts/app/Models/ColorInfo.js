// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
"use strict";
define(["require", "exports", "scripts/app/Constants"], function (require, exports, Constants) {
    var ColorInfo = (function () {
        function ColorInfo(name, value) {
            this._name = name;
            this._value = value;
        }
        Object.defineProperty(ColorInfo.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo, "backgroundColors", {
            get: function () {
                if (!ColorInfo._backgroundColors) {
                    ColorInfo._backgroundColors = new Array();
                    ColorInfo._backgroundColors.push(ColorInfo.defaultBackgroundColor);
                    for (var i = 0; i < ColorInfo._namedColors.length; i++) {
                        ColorInfo._backgroundColors.push(ColorInfo._namedColors[i]);
                    }
                }
                return ColorInfo._backgroundColors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo, "selectionColors", {
            get: function () {
                if (!ColorInfo._selectionColors) {
                    ColorInfo._selectionColors = new Array();
                    ColorInfo._selectionColors.push(ColorInfo.defaultSelectionColor);
                    for (var i = 0; i < ColorInfo._namedColors.length; i++) {
                        ColorInfo._selectionColors.push(ColorInfo._namedColors[i]);
                    }
                }
                return ColorInfo._selectionColors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo, "pmiColors", {
            get: function () {
                if (!ColorInfo._pmiColors) {
                    ColorInfo._pmiColors = new Array();
                    ColorInfo._pmiColors.push(ColorInfo.defaultPMIColor);
                    for (var i = 0; i < ColorInfo._namedColors.length; i++) {
                        ColorInfo._pmiColors.push(ColorInfo._namedColors[i]);
                    }
                }
                return ColorInfo._pmiColors;
            },
            enumerable: true,
            configurable: true
        });
        ColorInfo.convert2Hex = function (c) {
            var result = null;
            if (c && c.value) {
                var t = /^rgba\(([\d]{1,3}),\s*([\d]{1,3}),\s*([\d]{1,3}),\s*([\d]{1,3})\)$/i.exec(c.value);
                if (t && t[1] && t[2] && t[3]) {
                    var r = parseInt(t[1], 10);
                    var g = parseInt(t[2], 10);
                    var b = parseInt(t[3], 10);
                    result = "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                }
            }
            return result;
        };
        ColorInfo.defaultBackgroundColor = new ColorInfo(Constants.PreferenceKeys.Default, "rgba(181, 182, 184, 255)");
        ColorInfo.defaultSelectionColor = new ColorInfo(Constants.PreferenceKeys.Default, "rgba(255, 102, 0, 255)");
        ColorInfo.defaultPMIColor = new ColorInfo(Constants.PreferenceKeys.Default, "rgba(0, 0, 0, 255)");
        ColorInfo._namedColors = [
            new ColorInfo("AliceBlue", "rgba(240, 248, 255, 255)"),
            new ColorInfo("AntiqueWhite", "rgba(250, 235, 215, 255)"),
            new ColorInfo("Aqua", "rgba(0, 255, 255, 255)"),
            new ColorInfo("Aquamarine", "rgba(127, 255, 212, 255)"),
            new ColorInfo("Azure", "rgba(240, 255, 255, 255)"),
            new ColorInfo("Beige", "rgba(245, 245, 220, 255)"),
            new ColorInfo("Bisque", "rgba(255, 228, 196, 255)"),
            new ColorInfo("Black", "rgba(0, 0, 0, 255)"),
            new ColorInfo("BlanchedAlmond", "rgba(255, 235, 205, 255)"),
            new ColorInfo("Blue", "rgba(0, 0, 255, 255)"),
            new ColorInfo("BlueViolet", "rgba(138, 43, 226, 255)"),
            new ColorInfo("Brown", "rgba(165, 42, 42, 255)"),
            new ColorInfo("BurlyWood", "rgba(222, 184, 135, 255)"),
            new ColorInfo("CadetBlue", "rgba(95, 158, 160, 255)"),
            new ColorInfo("Chartreuse", "rgba(127, 255, 0, 255)"),
            new ColorInfo("Chocolate", "rgba(210, 105, 30, 255)"),
            new ColorInfo("Coral", "rgba(255, 127, 80, 255)"),
            new ColorInfo("CornflowerBlue", "rgba(100, 149, 237, 255)"),
            new ColorInfo("Cornsilk", "rgba(255, 248, 220, 255)"),
            new ColorInfo("Crimson", "rgba(220, 20, 60, 255)"),
            new ColorInfo("Cyan", "rgba(0, 255, 255, 255)"),
            new ColorInfo("DarkBlue", "rgba(0, 0, 139, 255)"),
            new ColorInfo("DarkCyan", "rgba(0, 139, 139, 255)"),
            new ColorInfo("DarkGoldenrod", "rgba(184, 134, 11, 255)"),
            new ColorInfo("DarkGray", "rgba(169, 169, 169, 255)"),
            new ColorInfo("DarkGreen", "rgba(0, 100, 0, 255)"),
            new ColorInfo("DarkKhaki", "rgba(189, 183, 107, 255)"),
            new ColorInfo("DarkMagenta", "rgba(139, 0, 139, 255)"),
            new ColorInfo("DarkOliveGreen", "rgba(85, 107, 47, 255)"),
            new ColorInfo("DarkOrange", "rgba(255, 140, 0, 255)"),
            new ColorInfo("DarkOrchid", "rgba(153, 50, 204, 255)"),
            new ColorInfo("DarkRed", "rgba(139, 0, 0, 255)"),
            new ColorInfo("DarkSalmon", "rgba(233, 150, 122, 255)"),
            new ColorInfo("DarkSeaGreen", "rgba(143, 188, 143, 255)"),
            new ColorInfo("DarkSlateBlue", "rgba(72, 61, 139, 255)"),
            new ColorInfo("DarkSlateGray", "rgba(47, 79, 79, 255)"),
            new ColorInfo("DarkTurquoise", "rgba(0, 206, 209, 255)"),
            new ColorInfo("DarkViolet", "rgba(148, 0, 211, 255)"),
            new ColorInfo("DeepPink", "rgba(255, 20, 147, 255)"),
            new ColorInfo("DeepSkyBlue", "rgba(0, 191, 255, 255)"),
            new ColorInfo("DimGray", "rgba(105, 105, 105, 255)"),
            new ColorInfo("DodgerBlue", "rgba(30, 144, 255, 255)"),
            new ColorInfo("Firebrick", "rgba(178, 34, 34, 255)"),
            new ColorInfo("FloralWhite", "rgba(255, 250, 240, 255)"),
            new ColorInfo("ForestGreen", "rgba(34, 139, 34, 255)"),
            new ColorInfo("Fuchsia", "rgba(255, 0, 255, 255)"),
            new ColorInfo("Gainsboro", "rgba(220, 220, 220, 255)"),
            new ColorInfo("GhostWhite", "rgba(248, 248, 255, 255)"),
            new ColorInfo("Gold", "rgba(255, 215, 0, 255)"),
            new ColorInfo("Goldenrod", "rgba(218, 165, 32, 255)"),
            new ColorInfo("Gray", "rgba(128, 128, 128, 255)"),
            new ColorInfo("Green", "rgba(0, 128, 0, 255)"),
            new ColorInfo("GreenYellow", "rgba(173, 255, 47, 255)"),
            new ColorInfo("Honeydew", "rgba(240, 255, 240, 255)"),
            new ColorInfo("HotPink", "rgba(255, 105, 180, 255)"),
            new ColorInfo("IndianRed", "rgba(205, 92, 92, 255)"),
            new ColorInfo("Indigo", "rgba(75, 0, 130, 255)"),
            new ColorInfo("Ivory", "rgba(255, 255, 240, 255)"),
            new ColorInfo("Khaki", "rgba(240, 230, 140, 255)"),
            new ColorInfo("Lavender", "rgba(230, 230, 250, 255)"),
            new ColorInfo("LavenderBlush", "rgba(255, 240, 245, 255)"),
            new ColorInfo("LawnGreen", "rgba(124, 252, 0, 255)"),
            new ColorInfo("LemonChiffon", "rgba(255, 250, 205, 255)"),
            new ColorInfo("LightBlue", "rgba(173, 216, 230, 255)"),
            new ColorInfo("LightCoral", "rgba(240, 128, 128, 255)"),
            new ColorInfo("LightCyan", "rgba(224, 255, 255, 255)"),
            new ColorInfo("LightGoldenrodYellow", "rgba(250, 250, 210, 255)"),
            new ColorInfo("LightGray", "rgba(211, 211, 211, 255)"),
            new ColorInfo("LightGreen", "rgba(144, 238, 144, 255)"),
            new ColorInfo("LightPink", "rgba(255, 182, 193, 255)"),
            new ColorInfo("LightSalmon", "rgba(255, 160, 122, 255)"),
            new ColorInfo("LightSeaGreen", "rgba(32, 178, 170, 255)"),
            new ColorInfo("LightSkyBlue", "rgba(135, 206, 250, 255)"),
            new ColorInfo("LightSlateGray", "rgba(119, 136, 153, 255)"),
            new ColorInfo("LightSteelBlue", "rgba(176, 196, 222, 255)"),
            new ColorInfo("LightYellow", "rgba(255, 255, 224, 255)"),
            new ColorInfo("Lime", "rgba(0, 255, 0, 255)"),
            new ColorInfo("LimeGreen", "rgba(50, 205, 50, 255)"),
            new ColorInfo("Linen", "rgba(250, 240, 230, 255)"),
            new ColorInfo("Magenta", "rgba(255, 0, 255, 255)"),
            new ColorInfo("Maroon", "rgba(128, 0, 0, 255)"),
            new ColorInfo("MediumAquamarine", "rgba(102, 205, 170, 255)"),
            new ColorInfo("MediumBlue", "rgba(0, 0, 205, 255)"),
            new ColorInfo("MediumOrchid", "rgba(186, 85, 211, 255)"),
            new ColorInfo("MediumPurple", "rgba(147, 112, 219, 255)"),
            new ColorInfo("MediumSeaGreen", "rgba(60, 179, 113, 255)"),
            new ColorInfo("MediumSlateBlue", "rgba(123, 104, 238, 255)"),
            new ColorInfo("MediumSpringGreen", "rgba(0, 250, 154, 255)"),
            new ColorInfo("MediumTurquoise", "rgba(72, 209, 204, 255)"),
            new ColorInfo("MediumVioletRed", "rgba(199, 21, 133, 255)"),
            new ColorInfo("MidnightBlue", "rgba(25, 25, 112, 255)"),
            new ColorInfo("MintCream", "rgba(245, 255, 250, 255)"),
            new ColorInfo("MistyRose", "rgba(255, 228, 225, 255)"),
            new ColorInfo("Moccasin", "rgba(255, 228, 181, 255)"),
            new ColorInfo("NavajoWhite", "rgba(255, 222, 173, 255)"),
            new ColorInfo("Navy", "rgba(0, 0, 128, 255)"),
            new ColorInfo("OldLace", "rgba(253, 245, 230, 255)"),
            new ColorInfo("Olive", "rgba(128, 128, 0, 255)"),
            new ColorInfo("OliveDrab", "rgba(107, 142, 35, 255)"),
            new ColorInfo("Orange", "rgba(255, 165, 0, 255)"),
            new ColorInfo("OrangeRed", "rgba(255, 69, 0, 255)"),
            new ColorInfo("Orchid", "rgba(218, 112, 214, 255)"),
            new ColorInfo("PaleGoldenrod", "rgba(238, 232, 170, 255)"),
            new ColorInfo("PaleGreen", "rgba(152, 251, 152, 255)"),
            new ColorInfo("PaleTurquoise", "rgba(175, 238, 238, 255)"),
            new ColorInfo("PaleVioletRed", "rgba(219, 112, 147, 255)"),
            new ColorInfo("PapayaWhip", "rgba(255, 239, 213, 255)"),
            new ColorInfo("PeachPuff", "rgba(255, 218, 185, 255)"),
            new ColorInfo("Peru", "rgba(205, 133, 63, 255)"),
            new ColorInfo("Pink", "rgba(255, 192, 203, 255)"),
            new ColorInfo("Plum", "rgba(221, 160, 221, 255)"),
            new ColorInfo("PowderBlue", "rgba(176, 224, 230, 255)"),
            new ColorInfo("Purple", "rgba(128, 0, 128, 255)"),
            new ColorInfo("Red", "rgba(255, 0, 0, 255)"),
            new ColorInfo("RosyBrown", "rgba(188, 143, 143, 255)"),
            new ColorInfo("RoyalBlue", "rgba(65, 105, 225, 255)"),
            new ColorInfo("SaddleBrown", "rgba(139, 69, 19, 255)"),
            new ColorInfo("Salmon", "rgba(250, 128, 114, 255)"),
            new ColorInfo("SandyBrown", "rgba(244, 164, 96, 255)"),
            new ColorInfo("SeaGreen", "rgba(46, 139, 87, 255)"),
            new ColorInfo("SeaShell", "rgba(255, 245, 238, 255)"),
            new ColorInfo("Sienna", "rgba(160, 82, 45, 255)"),
            new ColorInfo("Silver", "rgba(192, 192, 192, 255)"),
            new ColorInfo("SkyBlue", "rgba(135, 206, 235, 255)"),
            new ColorInfo("SlateBlue", "rgba(106, 90, 205, 255)"),
            new ColorInfo("SlateGray", "rgba(112, 128, 144, 255)"),
            new ColorInfo("Snow", "rgba(255, 250, 250, 255)"),
            new ColorInfo("SpringGreen", "rgba(0, 255, 127, 255)"),
            new ColorInfo("SteelBlue", "rgba(70, 130, 180, 255)"),
            new ColorInfo("Tan", "rgba(210, 180, 140, 255)"),
            new ColorInfo("Teal", "rgba(0, 128, 128, 255)"),
            new ColorInfo("Thistle", "rgba(216, 191, 216, 255)"),
            new ColorInfo("Tomato", "rgba(255, 99, 71, 255)"),
            new ColorInfo("Transparent", "rgba(255, 255, 255, 0)"),
            new ColorInfo("Turquoise", "rgba(64, 224, 208, 255)"),
            new ColorInfo("Violet", "rgba(238, 130, 238, 255)"),
            new ColorInfo("Wheat", "rgba(245, 222, 179, 255)"),
            new ColorInfo("White", "rgba(255, 255, 255, 255)"),
            new ColorInfo("WhiteSmoke", "rgba(245, 245, 245, 255)"),
            new ColorInfo("Yellow", "rgba(255, 255, 0, 255)"),
            new ColorInfo("YellowGreen", "rgba(154, 205, 50, 255)")
        ];
        return ColorInfo;
    })();
    exports.ColorInfo = ColorInfo;
});
//# sourceMappingURL=ColorInfo.js.map