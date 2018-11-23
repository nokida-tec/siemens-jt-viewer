// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../../../typings/cordova/plugins/Camera.d.ts"/>
/// <reference path="../../../typings/cordova/cordova.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Models/JT", "scripts/app/Models/NonJT", "scripts/app/Messages/Messages", "scripts/app/Models/ColorInfo", "scripts/app/Constants", "scripts/app/Utils/Helper"], function (require, exports, Kernel, JT, NonJT, Messages, ColorInfo, Constants, Helper) {
    var ViewerViewModel = (function (_super) {
        __extends(ViewerViewModel, _super);
        function ViewerViewModel(settingService, globalizationService) {
            var _this = this;
            _super.call(this);
            this.settingService = settingService;
            this.globalizationService = globalizationService;
            this._selectedPmi = null;
            this._gestureMode = NonJT.GestureMode.Rotate;
            this._backgroundColorLastUsed = ColorInfo.ColorInfo.defaultBackgroundColor;
            this._isLoadingThumbs = false;
            this._FIT_ALL_ZOOM_FACTOR = 1;
            this._THUMB_ASPECT_RATIO = 1.25;
            this._imageOn = false;
            this._liveCameraOn = false;
            this._liveCameraSizeChanged = false;
            this._turnOnPMIList = [];
            //api
            this.hasPmi = false;
            this.pmiData = null;
            this.initFilters();
            this.onSelectedModelViewActivated = function () {
                _this.onMVApplied.apply(_this, []);
            };
            this.photoSuccess = function (result) {
                _this.onPhotoSuccess.apply(_this, [result]);
            };
            this.onSetVisibilityForFirstTime = function () {
                _this.onVisibilityApplied.apply(_this, []);
            };
            //screen orientation changed
            window.onresize = function () {
                if (_this._plmvisControl) {
                    _this._plmvisControl.setSize(window.innerWidth, window.innerHeight);
                }
                _this.setSize(window.innerWidth, window.innerHeight);
            };
        }
        Object.defineProperty(ViewerViewModel.prototype, "contextPart", {
            get: function () {
                return this._contextPart;
            },
            enumerable: true,
            configurable: true
        });
        ViewerViewModel.prototype.initFilters = function () {
            this._activeFilters = {
                "Dimension": false,
                "Datum Feature Symbols": false,
                "Feature Control Frames": false,
                "Measurement Points": false,
                "Geometry": false,
                "Surface": false,
                "Line Welds": false,
                "Spot Welds": false,
                "Datum Targets": false,
                "Note": false,
                "Locators": false,
                "Coordinate Systems": false,
                "Other": false
            };
            this._pmiTypeMap = {
                "Dimension": [],
                "Datum Feature Symbols": [],
                "Feature Control Frames": [],
                "Measurement Points": [],
                "Geometry": [],
                "Surface": [],
                "Line Welds": [],
                "Spot Welds": [],
                "Datum Targets": [],
                "Note": [],
                "Locators": [],
                "Coordinate Systems": [],
                "Other": []
            };
        };
        ViewerViewModel.prototype.onVisibilityApplied = function () {
            var _this = this;
            var isGeoOn = localStorage.getItem("geofenceEnabled");
            if (isGeoOn != undefined && isGeoOn == "true") {
                cordova.plugins.camerapreview.show();
                this.setBackgroundCameraFlag(true);
            }
            if (this._viewer) {
                // build prod structure
                var psRoot = this._viewer.getProductStructureInfo();
                psRoot = psRoot.children[0];
                this._isPmiLoaded = false;
                this._isPmiVisible = false;
                if (psRoot) {
                    var rootPart = new JT.Part(psRoot, this._viewer);
                    this._partMap = [];
                    this._pmiMap = [];
                    this.buildPS(this._viewer, psRoot, rootPart, this._partMap);
                    this._loadedPart = rootPart;
                    if (this._selectedPart) {
                        this._selectedPart.isSelected = false;
                        this._selectedPart = null;
                    }
                    this.setContextPart(rootPart);
                    this.sendMessage(new Messages.LoadedPartChanged(rootPart, this._partMap));
                }
                // setup camera
                this._viewer.overrideMouseNavigationControls(JT2GoCustom.TrackballControls, []);
                this._activeCameraControls = this._viewer.getActiveCameraControl();
                this.gestureMode = NonJT.GestureMode.Rotate;
                this.setCameraMode(this._cameraMode);
                // set camera controls to support one finger pan
                this._activeCameraControls.singleFingerPanModeEnabled = true;
                this._activeCameraControls.rotateObjectModeEnabled = true;
                this._viewer.setPickingEnabled(false);
                this._viewer.setSelectionMode(PLMVisWeb.SelectionMode.FREE);
                this.hasPmi = this._viewer.modelHasPmi(this._loadedPart.id);
                // init property manager
                this._propertyMgr = this._viewer.addExtension(PLMVisWeb.Properties);
                var self = this;
                // load root node properties
                var doneLoadProperties = function () {
                    var propertiesOnNode = self._propertyMgr.getProperties(self._loadedPart.id, false);
                    self.setPropertiesForNode(propertiesOnNode);
                };
                this._propertyMgr.loadAllProperties(doneLoadProperties);
            }
            // we really should load the pmi info when we load the model....
            if (this.hasPmi) {
                if (!this._isPmiLoaded) {
                    this._pmiMgr = this._viewer.addExtension(PLMVisWeb.PMI);
                    var done = function (success) {
                        _this.buildPMI(_this._pmiMgr, _this._partMap);
                        _this._isPmiLoaded = true;
                        _this.setPmiColor(_this._pmiColor);
                    };
                    if (this.pmiData) {
                        this._pmiMgr.loadPmiDataWithObject(this._loadedPart.id, this.pmiData, done); // load from jt2bod converter
                    }
                    else {
                        this._pmiMgr.loadPmiData(this._loadedPart.id, done); // load from local samples
                    }
                }
            }
            this.setSelectionColor(this._selectionColor); // do this here because it also sets the PMI selection color (which needs _pmiMgr)
            this._loadedPart.isVisible = true;
            this.setContextPart(this._loadedPart);
            this.reset();
            // grab thumbnail of current viewer for home-page display cells
            var saveUrl = this.grabScreen(400, 400);
            this.fit();
            this.settingService.setObject(Constants.PreferenceKeys.ThumbnailLastViewer, saveUrl);
        };
        ViewerViewModel.prototype.OnPSLoaded = function (success, rootPsId, viewer, plmviscontrol) {
            var parentVM = this.parent;
            if (success) {
                this._viewer = viewer;
                this._plmvisControl = plmviscontrol;
                // load parts progressively
                viewer.fitAll(true);
                this._viewer.setDrawPerParts(20);
                viewer.setVisibilityByPsId(rootPsId, true, this.onSetVisibilityForFirstTime);
                // hide spinner to show loading part-by-part
                if (parentVM) {
                    parentVM.isLoading = false;
                }
            }
            else {
                this.viewerAlert(Constants.Strings.ParseJtErrorText);
                if (parentVM) {
                    parentVM.failedLoading();
                }
            }
        };
        ViewerViewModel.prototype.setPreference = function (backgroundColor, selectionColor, pmiColor, cameraMode) {
            this._backgroundColor = new ColorInfo.ColorInfo("transparent", "rgba(0, 0, 0, 0)");
            ;
            //initialize camera 
            cordova.plugins.camerapreview.startCamera({ x: 60, y: 0, width: window.innerWidth, height: window.innerHeight }, "back", false, false, true); //(frame, camera, tapEnabled, dragEnabled, toBack)
            cordova.plugins.camerapreview.hide();
            this._selectionColor = selectionColor;
            this._pmiColor = pmiColor;
            this._cameraMode = cameraMode;
        };
        ViewerViewModel.prototype.togglePmiVisibility = function () {
            this.clearPMIBatchList();
            this._isPmiVisible = !this._isPmiVisible;
            this._loadedPart.isPmiVisible = this._isPmiVisible;
            this.batchPMIVisibility();
        };
        Object.defineProperty(ViewerViewModel.prototype, "currentPart", {
            get: function () {
                var currPart;
                if (this.displayPart != null) {
                    currPart = this._displayPart;
                }
                else if (this._selectedPart != null) {
                    currPart = this._selectedPart;
                }
                else {
                    currPart = this._contextPart;
                }
                // load properties if property list is empty
                if (this._propertyMgr && currPart && this._partMap[currPart.id].properties.length == 0) {
                    var propertiesOnNode = this._propertyMgr.getProperties(currPart.id, false);
                    this.setPropertiesForNode(propertiesOnNode);
                }
                return currPart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewerViewModel.prototype, "isSmallScreenWidth", {
            get: function () {
                return this._currentWidth <= 400;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewerViewModel.prototype, "isSmallScreenHeight", {
            get: function () {
                return this._currentHeight <= 400;
            },
            enumerable: true,
            configurable: true
        });
        ViewerViewModel.prototype.fit = function () {
            if (this._viewer) {
                this.setCameraMode(this._cameraMode);
                this._activeCameraControls.setZoom(this._FIT_ALL_ZOOM_FACTOR);
                this._viewer.fitAll();
                // make the zoom consistent after fit
                this._activeCameraControls.resetPan();
            }
        };
        Object.defineProperty(ViewerViewModel.prototype, "gestureMode", {
            get: function () {
                return this._gestureMode;
            },
            set: function (value) {
                this._gestureMode = value;
                if (this._viewer) {
                    switch (value) {
                        case NonJT.GestureMode.Pan:
                            this._viewer.setMouseNavigationMode(PLMVisWeb.MouseMode.PAN);
                            this._activeCameraControls.singlePan = true;
                            this._activeCameraControls.noRotate = true;
                            this._activeCameraControls.noZoom = true;
                            this._activeCameraControls.noPan = false;
                            this._activeCameraControls.noRoll = true;
                            break;
                        // default to rotate mode
                        default:
                            this._viewer.setMouseNavigationMode(PLMVisWeb.MouseMode.ROTATE);
                            this._activeCameraControls.singlePan = false;
                            this._activeCameraControls.noRotate = false;
                            this._activeCameraControls.noZoom = true;
                            this._activeCameraControls.noPan = true;
                            this._activeCameraControls.noRoll = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewerViewModel.prototype, "propertyMap", {
            get: function () {
                return this._propertyMap;
            },
            set: function (value) {
                if (this._propertyMap != value) {
                    this._propertyMap = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        ViewerViewModel.prototype.setPropertiesForNode = function (propertiesObj) {
            // set properties based on part id
            if (propertiesObj && this._partMap) {
                var tPsId = propertiesObj.psId;
                if (propertiesObj.properties && this._partMap[tPsId]) {
                    for (var i_key in propertiesObj.properties) {
                        // remove the extra colon, Defect D-35131 
                        var prop_key = i_key.replace(/::/g, ":");
                        this._partMap[tPsId].properties.push(new JT.Property(prop_key, propertiesObj.properties[i_key]));
                    }
                }
            }
        };
        ViewerViewModel.prototype.onPartSelected = function (partIds) {
            if (partIds.length > 0) {
                //if there was a pmi selected, deselect it.
                if (this._selectedPmi) {
                    this._selectedPmi.isSelected = false;
                    this._selectedPmi = null;
                    var pmiChangedMessage = new Messages.SelectedPmiChanged([]);
                    this.sendMessage(pmiChangedMessage);
                }
                this._selectedPart = this._partMap[partIds[0]];
            }
            else {
                this._selectedPart = null;
            }
            var msg = new Messages.SelectedPartChanged(partIds);
            this.sendMessage(msg);
        };
        ViewerViewModel.prototype.onPmiSelected = function (pmiId) {
            //input is a number
            if (pmiId && this._pmiMap[pmiId]) {
                //deselect the selected part
                if (this._selectedPart) {
                    this.onPartSelected([]);
                }
                // set the selected PMi here
                if (this._selectedPmi) {
                    //deselect the previously selected PMI
                    this._selectedPmi.isSelected = false;
                }
                this._selectedPmi = this._pmiMap[pmiId];
                // update model
                this._selectedPmi.isSelected = true;
            }
            else {
                //input is null, deselect the pmi.
                //don't worry about selected part that is handled in onpartselected
                this._selectedPmi.isSelected = false;
                this._selectedPmi = null;
            }
            var msgArgs;
            msgArgs = (pmiId == null) ? [] : [pmiId];
            var pmiChangedMessage = new Messages.SelectedPmiChanged(msgArgs);
            this.sendMessage(pmiChangedMessage);
        };
        ViewerViewModel.prototype.hideSelectedPmi = function () {
            if (this._pmiMgr) {
                if (this._selectedPmi && this._selectedPmi.id) {
                    var idToHide = this._selectedPmi.id;
                    // deselect
                    this.onPmiSelected(null);
                    // hide
                    this._pmiMgr.setVisibilityByPsId(idToHide, false);
                }
            }
        };
        ViewerViewModel.prototype.alignPmiToView = function (id) {
            if (id) {
                if (this._pmiMgr) {
                    // viewer api
                    this._pmiMgr.alignCameraToPmi(id);
                }
            }
            else {
                // operate on selected pmi
                if (this._pmiMgr && this._selectedPmi && this._selectedPmi.id) {
                    this._pmiMgr.alignCameraToPmi(this._selectedPmi.id);
                }
            }
        };
        ViewerViewModel.prototype.onStateChanged = function (params) {
            _super.prototype.onStateChanged.call(this, params);
        };
        ViewerViewModel.prototype.onActivated = function () {
            var _this = this;
            _super.prototype.onActivated.call(this);
            this.onMessage(Messages.NavigatorSelectionChanged, function (msg) {
                _this._selectedPart = msg.selectedPart;
            });
            this.onMessage(Messages.ContextPartChanged, function (msg) {
                _this.setContextPart(msg.part);
                if (_this._selectedPart) {
                    _this._selectedPart.isSelected = false;
                    _this._selectedPart = null;
                }
            });
            this.onMessage(Messages.PmiFiltersChanged, function (msg) {
                _this.onPmiFiltersChanged(msg.pmiFilters);
            });
            this.onMessage(Messages.DisplayPartChanged, function (msg) {
                _this.displayPart = msg.part;
            });
            this.onMessage(Messages.SelectedModelViewChanged, function (msg) {
                _this.onSelectedModelViewChanged(msg.deselectedMV, msg.selectedMV);
            });
            if (this._liveCameraOn != null && this._liveCameraOn) {
                cordova.plugins.camerapreview.show();
            }
        };
        ViewerViewModel.prototype.onDeactivated = function () {
            _super.prototype.onDeactivated.call(this);
            cordova.plugins.camerapreview.hide();
        };
        ViewerViewModel.prototype.onSelectedModelViewChanged = function (deselected, selected) {
            if (this._pmiMgr) {
                if (deselected != null) {
                    this._viewer.setAutoDraw(false);
                    this._pmiMgr.setModelViewActive(deselected.id, false, this.onSelectedModelViewActivated);
                }
                if (selected != null) {
                    this._viewer.setAutoDraw(false);
                    this._pmiMgr.setModelViewActive(selected.id, true, this.onSelectedModelViewActivated);
                }
            }
        };
        ViewerViewModel.prototype.onMVApplied = function () {
            this._viewer.draw();
            this._viewer.setAutoDraw(true);
            this.fit();
        };
        Object.defineProperty(ViewerViewModel.prototype, "displayPart", {
            get: function () {
                return this._displayPart;
            },
            set: function (value) {
                if (value != this._displayPart) {
                    this._displayPart = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        ViewerViewModel.prototype.onPmiFiltersChanged = function (filters) {
            if (filters && filters.length > 0) {
                this.clearPMIBatchList();
                for (var j = 0; j < filters.length; j++) {
                    var filter = filters[j];
                    // must update active filters.
                    this.activeFilters[filter.filterName] = !filter.isOn;
                    if (this._pmiTypeMap[filter.filterName]) {
                        for (var idx = 0; idx < this._pmiTypeMap[filter.filterName].length; idx++) {
                            var pmiList = this._pmiTypeMap[filter.filterName];
                            pmiList[idx].filterActive = !filter.isOn; // filter.isOn means checked, means filter is not active;
                        }
                    }
                }
                this.batchPMIVisibility();
            }
        };
        ViewerViewModel.prototype.setContextPart = function (value) {
            if (this._contextPart != value) {
                var currentPart = this._contextPart || this._loadedPart;
                JT.Part.setContext(currentPart, value);
                this._contextPart = value;
            }
        };
        ViewerViewModel.prototype.buildPS = function (viewer, parentObj, parentPart, partMap) {
            partMap[parentPart.id] = parentPart;
            if (parentObj.children && parentObj.children.length > 0) {
                for (var i = 0; i < parentObj.children.length; i++) {
                    var childObj = parentObj.children[i];
                    var childPart = new JT.Part(childObj, viewer);
                    parentPart.addPart(childPart);
                    this.buildPS(viewer, childObj, childPart, partMap);
                }
            }
        };
        ViewerViewModel.prototype.buildPMI = function (pmiMgr, partMap) {
            var _this = this;
            this.forceDigest(function () {
                var pmiRoot = pmiMgr.getPmiStructureInfo();
                _this.processPMI(pmiMgr, pmiRoot);
                _this._flatList = undefined; //clear model view list from previous session
                _this.reset();
            });
        };
        ViewerViewModel.prototype.buildModelViewList = function () {
            if (this._pmiMgr && this._flatList == undefined) {
                var mvRoot = this._pmiMgr.getModelViewsStructureInfo();
                if (mvRoot) {
                    this.isLoadingThumbs = true;
                    // timeout thread to allow UI to refresh
                    setTimeout(function () {
                        this._flatList = this._pmiMgr.getFlatModelViewsList(this._flatList);
                        this.processModelView(this._pmiMgr, mvRoot, this._partMap);
                    }.bind(this), 50);
                }
            }
        };
        ViewerViewModel.prototype.processPMI = function (pmiMgr, pmiNode) {
            // structure of pmiRoot:
            // root { psId:-3, children[] }
            //                   -> [0] part { psId:partId, children[]}
            //                                                   -> 0 or more Subpart {psId: partId, children []   
            //                                                   -> [0] pmiType { name: TypeName, children[] }
            // uses recursion      
            // pmiNode now needs to be split and handled accordingly
            if (pmiNode.psId === -3) {
                // this is the root...
                for (var idx = 0; idx < pmiNode.children.length; idx++) {
                    var childNode = pmiNode.children[idx];
                    if (childNode.psId) {
                        this.processPMI(pmiMgr, pmiNode.children[idx]);
                    }
                }
            }
            else {
                var currentPart = this._partMap[pmiNode.psId];
                var childrenNodes = pmiNode.children;
                if (childrenNodes.length > 0) {
                    // child could be another part or could be a pmi type grouping
                    for (var idx2 = 0; idx2 < childrenNodes.length; idx2++) {
                        var currentType = "";
                        var childNode2 = childrenNodes[idx2];
                        if (childNode2.psId) {
                            // child is a node
                            this.processPMI(pmiMgr, childNode2);
                        }
                        else {
                            // child is a pmi type grouping
                            currentType = childNode2.name;
                            var pmiTypeGroupingMembers = childNode2.children;
                            for (var idx3 = 0; idx3 < pmiTypeGroupingMembers.length; idx3++) {
                                var currentPmi;
                                if (this.activeFilters[currentType] === undefined) {
                                    currentPmi = new JT.PmiObject(currentType, pmiTypeGroupingMembers[idx3], pmiMgr, this, this.activeFilters["Other"]);
                                }
                                else {
                                    currentPmi = new JT.PmiObject(currentType, pmiTypeGroupingMembers[idx3], pmiMgr, this, this.activeFilters[currentType]);
                                }
                                if (currentPmi && currentPart) {
                                    currentPart.addPmi(currentPmi);
                                    this._pmiMap[currentPmi.id] = currentPmi;
                                    if (this._pmiTypeMap[currentType] === undefined) {
                                        this._pmiTypeMap["Other"].push(currentPmi);
                                    }
                                    else {
                                        this._pmiTypeMap[currentType].push(currentPmi);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        Object.defineProperty(ViewerViewModel.prototype, "isLoadingThumbs", {
            get: function () {
                return this._isLoadingThumbs;
            },
            set: function (val) {
                if (this._isLoadingThumbs != val) {
                    this._isLoadingThumbs = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewerViewModel.prototype, "currentSnapshot", {
            get: function () {
                return this._currentSnapshot;
            },
            set: function (val) {
                if (this._currentSnapshot != val) {
                    this._currentSnapshot = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        ViewerViewModel.prototype.processModelView = function (pmiMgr, current, partMap) {
            var _this = this;
            var onModelViewActive = function (callback) {
                if (_this._flatList.length > 0) {
                    var owningPart = partMap[_this._flatList[0].refPsId];
                    if (owningPart) {
                        var modelView = new JT.ModelView(_this._flatList[0], pmiMgr);
                        owningPart.addModelView(modelView);
                        modelView.thumb = _this.grabScreen(_this._currentHeight * _this._THUMB_ASPECT_RATIO, _this._currentHeight);
                        _this._flatList.shift();
                        _this.processModelView(pmiMgr, current, partMap);
                    }
                }
            };
            this._viewer.setAutoDraw(false); // turn off auto-draw
            if (this._flatList[0]) {
                pmiMgr.setModelViewActive(this._flatList[0].psId, true, onModelViewActive);
            }
            else {
                //finished processing
                // reset all
                // hidden psids must be made visible again.
                this._viewer.setVisibilityByPsId(this._loadedPart.id, true, (function () {
                    _this._viewer.setAutoDraw(true);
                    _this._viewer.draw();
                }).bind(this));
                this.isLoadingThumbs = false;
            }
        };
        Object.defineProperty(ViewerViewModel.prototype, "BackgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (color) {
                if (color && color.value) {
                    if (this._liveCameraOn != null && this._liveCameraOn) {
                        cordova.plugins.camerapreview.hide();
                        this.setBackgroundCameraFlag(false);
                    }
                    this._backgroundColor = color;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewerViewModel.prototype, "activeFilters", {
            get: function () {
                return this._activeFilters;
            },
            set: function (filters) {
                this._activeFilters = filters;
            },
            enumerable: true,
            configurable: true
        });
        ViewerViewModel.prototype.setPmiColor = function (color) {
            if (color && color.value) {
                if (this._pmiMgr) {
                    this._pmiColor = color;
                    var hex = ColorInfo.ColorInfo.convert2Hex(color);
                    this._pmiMgr.setPmiMaterial(hex, 1);
                }
            }
        };
        ViewerViewModel.prototype.setSize = function (width, height) {
            var _this = this;
            this.forceDigest(function () {
                _this._currentWidth = width;
                _this._currentHeight = height;
                if (_this._liveCameraOn) {
                    // resize camera background when viewer resizes
                    _this.resizeLiveCameraView();
                }
                else {
                    _this._liveCameraSizeChanged = true;
                }
            });
        };
        ViewerViewModel.prototype.resizeLiveCameraView = function () {
            if (this.isActive) {
                cordova.plugins.camerapreview.stopCamera();
                cordova.plugins.camerapreview.startCamera({ x: 60, y: 0, width: this._currentWidth, height: this._currentHeight }, "back", false, false, true);
            }
        };
        ViewerViewModel.prototype.setSelectionColor = function (color) {
            if (color && color.value) {
                if (this._viewer) {
                    this._selectionColor = color;
                    var hex = ColorInfo.ColorInfo.convert2Hex(color);
                    this._viewer.setSelectionMaterial(hex, 0, 0, hex, 0.1, 1);
                    if (this._pmiMgr) {
                        this._pmiMgr.setPmiSelectionMaterial(hex, 1);
                    }
                }
            }
        };
        ViewerViewModel.prototype.onTap = function (event) {
            if (event) {
                var tPsId;
                var coordinate;
                if (event.offsetX != undefined) {
                    coordinate = { x: event.offsetX, y: event.offsetY };
                }
                else if (event.originalEvent.pageX != undefined && (event.originalEvent.pageX != 0 || event.originalEvent.pageY != 0)) {
                    coordinate = { x: event.originalEvent.pageX, y: event.originalEvent.pageY };
                }
                else {
                    // touch event handler  for nexus device
                    var touch = event.originalEvent.changedTouches[0];
                    coordinate = { x: touch.pageX, y: touch.pageY };
                }
                tPsId = this._viewer.getPsIdAtViewCoordinate(coordinate);
                if (tPsId) {
                    if (tPsId.psId) {
                        if (this._partMap[tPsId.psId]) {
                            this.onPartSelected([tPsId.psId]);
                        }
                        else {
                            //a pmi was selected
                            this.onPmiSelected(tPsId.psId);
                        }
                    }
                }
                else {
                    // selected part
                    if (this._selectedPart) {
                        this.onPartSelected([]);
                    }
                    else if (this._selectedPmi) {
                        //deselect the pmi
                        this.onPmiSelected(null);
                    }
                    else {
                    }
                }
            }
        };
        ViewerViewModel.prototype.onDoubleTap = function (event) {
            if (event) {
                var tPsId;
                var coordinate;
                if (event.offsetX != undefined) {
                    coordinate = { x: event.offsetX, y: event.offsetY };
                }
                else if ((event.originalEvent.pageX != 0 || event.originalEvent.pageY != 0) && event.originalEvent.pageX != undefined) {
                    coordinate = { x: event.originalEvent.pageX, y: event.originalEvent.pageY };
                }
                else {
                    var touch = event.originalEvent.changedTouches[0];
                    coordinate = { x: touch.pageX, y: touch.pageY };
                }
                tPsId = this._viewer.getPsIdAtViewCoordinate(coordinate);
                if (tPsId) {
                    // part
                    if (this._partMap[tPsId.psId]) {
                        this.sendMessage(new Messages.ViewerDrillDownTriggered(this._partMap[tPsId.psId]));
                    }
                    else {
                        this.alignPmiToView(tPsId.psId);
                    }
                }
                else {
                    this.fit();
                }
            }
        };
        ViewerViewModel.prototype.setCameraMode = function (mode) {
            if (mode !== null && this._viewer) {
                switch (mode) {
                    case NonJT.ViewType.Perspective:
                        this._viewer.setCameraMode(PLMVisWeb.CameraMode.PERSPECTIVE);
                        this._activeCameraControls.cameraMode = "Perspective";
                        break;
                    case NonJT.ViewType.Orthographic:
                        this._viewer.setCameraMode(PLMVisWeb.CameraMode.ORTHOGRAPHIC);
                        this._activeCameraControls.cameraMode = "Orthographic";
                        break;
                    default:
                        break;
                }
            }
        };
        ViewerViewModel.prototype.lookUpX = function () {
            this._viewer.setCameraOrientation([-1, 0, 0, 0, 1, 0, (Math.PI), 0, 0, 0]);
            this.fit();
        };
        ViewerViewModel.prototype.lookUpY = function () {
            this._viewer.setCameraOrientation([0, -1, 0, 0, -1, 0, 0, 0, 0, 0]);
            this.fit();
        };
        ViewerViewModel.prototype.lookUpZ = function () {
            this._viewer.setCameraOrientation([0, 0, -1, 0, 0, 1, 0, 0, 0, 0]);
            this.fit();
        };
        ViewerViewModel.prototype.reset = function () {
            this._viewer.setCameraOrientation([-.5, .425, .75, -1, -1, 0, -(Math.PI / 4), 0, 0, 0]);
            this.fit();
            //reset pmi visibility
            if (this._loadedPart) {
                this._loadedPart.isPmiVisible = false;
            }
            if (this._isPmiLoaded) {
                this._pmiMgr.setAllPmiVisibility(false);
            }
        };
        ViewerViewModel.prototype.grabScreen = function (width, height) {
            this._viewer.setSize(width, height);
            this._viewer.fitAll();
            this._activeCameraControls.updateOrthoCamera(this._viewer._oCamera);
            this._viewer.draw();
            var url = this._activeCameraControls.domElement.toDataURL();
            this._viewer.setSize(this._currentWidth, this._currentHeight);
            return url;
        };
        ViewerViewModel.prototype.saveScreen = function () {
            this._viewer.draw();
            var url = this._activeCameraControls.domElement.toDataURL("image/png");
            if (url != null) {
                var shutter_media = new Media(Helper.getCordovaAssetPath() + "media/shutter.mp3", 
                // success callback
                // success callback
                function () {
                    console.log("playAudio():Audio Success");
                }, 
                // error callback
                // error callback
                function (err) {
                    console.log("playAudio():Audio Error: " + err);
                });
                if (device.platform.indexOf("iOS") > -1) {
                    CameraRoll.saveToCameraRoll(url, function () {
                        navigator.vibrate(1000); //user feedback when snapshot is created
                        shutter_media.play();
                    }, function () { window.console.log("saveToCameraRoll failed. "); });
                }
                else if (device.platform.indexOf("Android") > -1) {
                    var data = atob(url.substring(" data:image/png;base64".length)), asArray = new Uint8Array(data.length);
                    if (data != null && data.length > 0) {
                        for (var i = 0, len = data.length; i < len; ++i) {
                            asArray[i] = data.charCodeAt(i);
                        }
                        var pendingblob = new Blob([asArray.buffer], { type: "image/png" });
                        window.resolveLocalFileSystemURI(cordova.file.externalRootDirectory, function (fileSystem) {
                            if (fileSystem.isDirectory) {
                                fileSystem.getDirectory(Constants.Strings.DCIMName, { create: false }, function (dcimDir) {
                                    dcimDir.getDirectory(Constants.Strings.imageAlbumName, { create: true }, function (subDir) {
                                        var directoryReader = subDir.createReader();
                                        directoryReader.readEntries(function (entries) {
                                            var image_counter = 0;
                                            if (entries != null) {
                                                image_counter = entries.length + 1;
                                            }
                                            var imageFileName = Constants.Strings.snapshotPrefix + image_counter + ".png";
                                            subDir.getFile(imageFileName, { create: true }, function (file) {
                                                file.createWriter(function (fileWriter) {
                                                    fileWriter.seek(fileWriter.length);
                                                    fileWriter.write(pendingblob);
                                                    navigator.vibrate(1000); //user feedback when snapshot is created
                                                    shutter_media.play();
                                                });
                                            }, null);
                                        });
                                    }, null);
                                }, function () {
                                    window.console.log("failed getting dcim directory. ");
                                });
                            }
                        });
                    }
                }
            }
        };
        ViewerViewModel.prototype.toggleBackgroundCamera = function () {
            if (!this._liveCameraOn) {
                if (this._liveCameraSizeChanged) {
                    this.resizeLiveCameraView();
                    this._liveCameraSizeChanged = false;
                }
                // save current background color and made it transparent
                this._backgroundColorLastUsed = this._backgroundColor;
                this.BackgroundColor = new ColorInfo.ColorInfo("transparent", "rgba(0, 0, 0, 0)");
                //show camera 
                cordova.plugins.camerapreview.show();
                this.setBackgroundCameraFlag(true);
            }
            else {
                //hide camera
                cordova.plugins.camerapreview.hide();
                this.setBackgroundCameraFlag(false);
                // restore background color
                this._backgroundColor = this._backgroundColorLastUsed;
            }
        };
        ViewerViewModel.prototype.setBackgroundCameraFlag = function (isOn) {
            this._liveCameraOn = isOn;
            this.settingService.setString(Constants.PreferenceKeys.LiveCameraOn, this._liveCameraOn.toString());
        };
        ViewerViewModel.prototype.chooseImageAsBackground = function () {
            navigator.camera.getPicture(this.photoSuccess, null /* TODO:  fail callback */, { quality: 50, sourceType: Camera.PictureSourceType.PHOTOLIBRARY, destinationType: Camera.DestinationType.DATA_URL });
        };
        ViewerViewModel.prototype.setImgAsBackground = function () {
            // cordova plugin:  camera
            navigator.camera.getPicture(this.photoSuccess, null /* TODO:  fail callback */, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
        };
        ViewerViewModel.prototype.resetBackground = function () {
            this._imageOn = false;
            this._backgroundImage = "";
        };
        ViewerViewModel.prototype.onPhotoSuccess = function (imageData) {
            var _this = this;
            this.forceDigest(function () {
                if (imageData) {
                    _this._imageOn = true;
                    _this._backgroundImage = "data:image/png;base64," + imageData;
                }
            });
        };
        Object.defineProperty(ViewerViewModel.prototype, "BackgroundImage", {
            get: function () {
                return this._backgroundImage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewerViewModel.prototype, "ImageOn", {
            get: function () {
                return this._imageOn;
            },
            enumerable: true,
            configurable: true
        });
        ViewerViewModel.prototype.viewerAlert = function (msg) {
            this.globalizationService.getTranslation(msg, function (i18nMsg) {
                alert(i18nMsg);
            });
        };
        ViewerViewModel.prototype.clearPMIBatchList = function () {
            this._turnOnPMIList = [];
        };
        ViewerViewModel.prototype.addPMIBatchList = function (pmiId, isVisible) {
            this._turnOnPMIList.push(new JT.PmiVisibility(pmiId, isVisible));
        };
        ViewerViewModel.prototype.batchPMIVisibility = function () {
            var _this = this;
            if (this._turnOnPMIList.length > 0) {
                this._viewer.setAutoDraw(false); // turn off auto-draw
                while (this._turnOnPMIList.length > 0) {
                    var pmi_i = this._turnOnPMIList.pop();
                    if (this._turnOnPMIList.length > 0) {
                        var countN = this._turnOnPMIList.length % 50;
                        if (countN > 0) {
                            this._pmiMgr.setVisibilityByPsId(pmi_i.psid, pmi_i.isVisible);
                        }
                        else {
                            this._pmiMgr.setVisibilityByPsId(pmi_i.psid, pmi_i.isVisible, (function () {
                                _this._viewer.draw();
                            }).bind(this));
                        }
                    }
                    else {
                        this._pmiMgr.setVisibilityByPsId(pmi_i.psid, pmi_i.isVisible, (function () {
                            _this._viewer.setAutoDraw(true); // turn on auto-draw
                            _this._viewer.draw();
                        }).bind(this));
                    }
                }
            }
        };
        return ViewerViewModel;
    })(Kernel.ViewModelBase);
    exports.ViewerViewModel = ViewerViewModel;
});
//# sourceMappingURL=ViewerViewModel.js.map