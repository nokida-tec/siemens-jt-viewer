// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../../typings/angularjs/angular.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Messages/Messages", "scripts/app/Constants", "scripts/app/Utils/Helper"], function (require, exports, Kernel, Messages, Constants, Helper) {
    var Viewer = (function (_super) {
        __extends(Viewer, _super);
        function Viewer() {
            _super.call(this, ["viewer"], Kernel.RestrictType.Element);
            this.loadCount = 0;
            this._navigatorMinWidthExpanded = "275px"; //expanded minwidth
            this._navigatorWidthCollapsed = "5px"; //collapsed navigator width is 75px;
        }
        Viewer.prototype.link = function ($injector, scope, elm, attrs) {
            var _this = this;
            this.el = elm[0];
            if (this.control) {
                this.control.setInElement(this.el);
            }
            scope.vm.onMessage(Messages.ModelPathChanged, function (msg) {
                _this.tempBodDir = msg.modelPath;
                scope.vm.parent.isLoading = true;
                var viewerEle = _this.el;
                if (_this.el == undefined) {
                    viewerEle = document.getElementById('plmviswebviewer');
                }
                if (!_this.control) {
                    var params = {
                        host: viewerEle,
                        useGpuInstancing: false,
                        width: viewerEle.offsetWidth + 'px',
                        height: viewerEle.offsetHeight + 'px'
                    };
                    _this.control = new PLMVisWeb.Control(params);
                }
                if (!_this.viewer) {
                    _this.viewer = _this.control.getExtensionManager(PLMVisWeb.Viewer);
                }
                if (_this.viewer) {
                    // this removes triad rendering
                    _this.viewer.removeExtension(PLMVisWeb.WCS);
                    if (_this.selectionHandler) {
                        _this.viewer.unregisterSelectionEvent(_this.selectionHandler);
                    }
                    if (_this.progessHandler) {
                        _this.viewer.unregisterProgressEvent(_this.progessHandler);
                    }
                    /*cleanup vm objects */
                    scope.vm.pmiData = null;
                    scope.vm.hasPmi = false;
                    _this.viewer.stopRenderLoop();
                    _this.viewer.setPickingEnabled(false);
                    _this.progessHandler = null;
                    _this.selectionHandler = null;
                }
                _this.viewer.setPickingEnabled(true);
                _this.viewer.startRenderLoop();
                var psDone = function (success, rootPsId) {
                    scope.$evalAsync(function () {
                        scope.vm.OnPSLoaded(success, rootPsId, _this.viewer, _this.control);
                    });
                };
                if (!_this.progessHandler) {
                    _this.progessHandler = function (percentage) {
                        scope.$evalAsync(function () {
                            scope.vm.parent.progress = Math.floor(percentage * 100);
                        });
                    };
                }
                _this.viewer.registerProgressEvent(_this.progessHandler);
                if (!_this.selectionHandler) {
                    _this.selectionHandler = function (partIds) {
                        scope.$evalAsync(function () {
                            scope.vm.onPartSelected(partIds);
                        });
                    };
                }
                _this.control.setSize(window.innerWidth, window.innerHeight);
                scope.vm.setSize(window.innerWidth, window.innerHeight);
                _this.viewer.registerSelectionEvent(_this.selectionHandler);
                // turn on load part-by-part
                _this.viewer.setDrawWhileLoading(true);
                // timeout thread to allow UI to refresh
                setTimeout(function () {
                    var _this = this;
                    if (msg.jtFilePath) {
                        var fail = function (message) {
                            scope.vm.viewerAlert(Constants.Strings.ParseJtErrorText);
                            scope.vm.parent.failedLoading();
                        };
                        if (msg.loadAsBod.toString() == "true" && msg.modelPath) {
                            if (device.platform.indexOf("Android") > -1) {
                                // we have problem using the same directory for storing bod files on Android, so use separate for each session
                                this.tempBodDir = msg.modelPath + this.loadCount++;
                            }
                            jt2bod.convertToBods(msg.jtFilePath, this.tempBodDir, function () {
                                _this.viewer.open(_this.tempBodDir, psDone);
                            }, fail);
                        }
                        else {
                            jt2bod.convert(msg.jtFilePath, function (results) {
                                if (results && results.length >= 3) {
                                    try {
                                        var psObject = JSON.parse(results[0]); //  part structure data
                                    }
                                    catch (e) {
                                        scope.vm.viewerAlert(Constants.Strings.ParseJtErrorText);
                                        scope.vm.parent.failedLoading();
                                        return; // return on bad jt data
                                    }
                                    psObject.hasPmi = results[1].length > 0; // PMI data
                                    scope.vm.hasPmi = psObject.hasPmi;
                                    if (psObject.hasPmi) {
                                        try {
                                            psObject.pmiTree = JSON.parse(results[1]);
                                            scope.vm.pmiData = psObject.pmiTree;
                                        }
                                        catch (e) {
                                            scope.vm.viewerAlert(Constants.Strings.ParsePMIErrorText);
                                        }
                                    }
                                    psObject.properties = results[2]; // properties data
                                    try {
                                        var propertiesJsonObject = JSON.parse(psObject.properties);
                                        if (propertiesJsonObject) {
                                            scope.vm.propertyMap = propertiesJsonObject.propertyMap;
                                        }
                                    }
                                    catch (e) {
                                        scope.vm.viewerAlert(Constants.Strings.ParsePropertiesErrorText);
                                    }
                                    if (psObject) {
                                        _this.viewer.openWithObject(psObject, psDone);
                                    }
                                }
                            }, fail);
                        }
                    }
                    else {
                        //var assetsDir = cordova.file.applicationDirectory.substring(7) + "www/" ;
                        this.viewer.open(Helper.getCordovaAssetPath() + msg.modelPath, psDone);
                    }
                }.bind(_this), 50);
            });
        };
        return Viewer;
    })(Kernel.DirectiveBase);
    exports.Viewer = Viewer;
});
//# sourceMappingURL=Viewer.js.map