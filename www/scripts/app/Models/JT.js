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
define(["require", "exports", "scripts/app/Utils/BitArray"], function (require, exports, BitArray) {
    var JTNames = (function () {
        function JTNames() {
        }
        JTNames.getPmiType = function (type) {
            if (JTNames.PMITypes.indexOf(type) >= 0) {
                return type;
            }
            return null;
        };
        JTNames.PMI = "PMI";
        JTNames.ModelViews = "Model Views";
        JTNames.ModelView = "Model View";
        JTNames.PMITypes = ["Diemsion", "Note"];
        return JTNames;
    })();
    exports.JTNames = JTNames;
    (function (CameraType) {
        CameraType[CameraType["Perspective"] = 0] = "Perspective";
        CameraType[CameraType["Orthographic"] = 1] = "Orthographic";
    })(exports.CameraType || (exports.CameraType = {}));
    var CameraType = exports.CameraType;
    (function (ModelType) {
        ModelType[ModelType["Part"] = 0] = "Part";
        ModelType[ModelType["Assembly"] = 1] = "Assembly";
        ModelType[ModelType["PMI"] = 2] = "PMI";
        ModelType[ModelType["ModelView"] = 3] = "ModelView";
        ModelType[ModelType["Feature"] = 4] = "Feature";
    })(exports.ModelType || (exports.ModelType = {}));
    var ModelType = exports.ModelType;
    var vector3d = (function () {
        function vector3d() {
        }
        return vector3d;
    })();
    exports.vector3d = vector3d;
    var Point3d = (function () {
        function Point3d() {
        }
        return Point3d;
    })();
    exports.Point3d = Point3d;
    var PmiObject = (function () {
        function PmiObject(type, pmiObject, pmiMgr, viewerVM, active) {
            this._pmiObject = pmiObject;
            this._pmiMgr = pmiMgr;
            this._viewerVM = viewerVM;
            this._type = type;
            this._isOn = false;
            this._filterActive = active || undefined;
        }
        Object.defineProperty(PmiObject.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "objectType", {
            get: function () {
                return ModelType.PMI;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "sceneId", {
            get: function () {
                return this._pmiMgr.psId2sceneId(this.id);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "id", {
            get: function () {
                return this._pmiObject.psId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "isLeaf", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "name", {
            get: function () {
                return this._pmiObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "isSelected", {
            get: function () {
                return this._isSelected;
            },
            set: function (value) {
                if (this._isSelected != value) {
                    this._isSelected = value;
                    this.setSelectedCore(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "isVisible", {
            get: function () {
                return this.testVisibility();
            },
            set: function (value) {
                if (this._isVisible != value) {
                    this._isVisible = value;
                    //  do not call viewer atomically here, we want to batch the PMI visibility operation (as part of auto-draw policy), Defect D-43466 
                    if (this._viewerVM) {
                        this._viewerVM.addPMIBatchList(this.id, value);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiObject.prototype, "filterActive", {
            get: function () {
                return this._filterActive;
            },
            set: function (value) {
                if (value != this._filterActive) {
                    this._filterActive = value;
                    this.isVisible = this.testVisibility();
                }
            },
            enumerable: true,
            configurable: true
        });
        PmiObject.prototype.testVisibility = function () {
            return (this._isOn && !this.filterActive);
        };
        Object.defineProperty(PmiObject.prototype, "isOn", {
            set: function (value) {
                if (this._isOn != value) {
                    this._isOn = value;
                    this.isVisible = this.testVisibility();
                }
            },
            enumerable: true,
            configurable: true
        });
        PmiObject.prototype.setSelectedCore = function (value) {
            // 8-4-2015 JT:  this method does not work properly - PLMVisWeb.PMI._pmiObject.getObjectByPsId(psId, true) returns undefined everytime
            // - email sent to Neha, marco and rob.
            // can be fixed with one line
            this._pmiMgr.setSelectionByPsId(this.id, value);
        };
        return PmiObject;
    })();
    exports.PmiObject = PmiObject;
    var Camera = (function () {
        function Camera(type, position, up, direction) {
            this.type = type;
            this.position = position;
            this.up = up;
            this.direction = direction;
        }
        return Camera;
    })();
    exports.Camera = Camera;
    var ModelView = (function (_super) {
        __extends(ModelView, _super);
        function ModelView(pmiObject, pmiMgr) {
            _super.call(this, JTNames.ModelView, pmiObject, pmiMgr);
        }
        Object.defineProperty(ModelView.prototype, "objectType", {
            get: function () {
                return ModelType.ModelView;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelView.prototype, "camera", {
            get: function () {
                return this._camera;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelView.prototype, "ids", {
            get: function () {
                return this._pmiObject.pmiIds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelView.prototype, "thumb", {
            get: function () {
                return this._thumbDataUrl;
            },
            set: function (value) {
                if (this._thumbDataUrl != value) {
                    this._thumbDataUrl = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return ModelView;
    })(PmiObject);
    exports.ModelView = ModelView;
    var Part = (function () {
        function Part(modelObject, viewer) {
            // this is necessary to keep track of which part's visibility is on or off in JT2Go 
            // (not maintained by viewer).
            this._visSwitchOn = true;
            this._modelObject = modelObject;
            this._viewer = viewer;
            if (modelObject.children) {
                var size = modelObject.children.length;
                if (size > 0) {
                    this._visBits = new BitArray.BitArray(size, true);
                }
            }
            else {
                this._visBits = new BitArray.BitArray(1, true);
            }
            this._children = [];
            this._pmis = [];
            this._modelViews = [];
            this._level = 0;
            this._pos = 0;
            this._propertiesGroups = [];
            this._properties = [];
        }
        Object.defineProperty(Part.prototype, "objectType", {
            get: function () {
                return this.isAssembly ? ModelType.Assembly : ModelType.Part;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "properties", {
            get: function () {
                return this._properties;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "modelViews", {
            get: function () {
                return this._modelViews;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "pmis", {
            get: function () {
                return this._pmis;
            },
            enumerable: true,
            configurable: true
        });
        Part.prototype.breadCrumbPreviewOn = function (contextPart, on) {
            var _this = this;
            // if this is not context part
            this._viewer.setAutoDraw(false); // turn off auto-draw
            if (on) {
                //root viewer invis
                this._viewer.setVisibilityByPsId(this.getRoot().id, false);
                //this visibile - traverse tree
                this._viewer.setVisibilityByPsId(this.id, true, (function () {
                    _this._viewer.setAutoDraw(true);
                    _this._viewer.draw();
                }).bind(this));
                //this transparent - traverse tree
                this.setTransparencyByPart(this, .1);
                //context part - normal opacity
                this._viewer.resetMaterialByPsId(contextPart.id);
            }
            else {
                // turn display part off.
                // opacity normal
                this._viewer.resetMaterialByPsId(this.id);
                // root viewer invis
                this._viewer.setVisibilityByPsId(this.getRoot().id, false);
                // context part visible
                this._viewer.setVisibilityByPsId(contextPart.id, true, (function () {
                    _this._viewer.setAutoDraw(true);
                    _this._viewer.draw();
                }).bind(this));
            }
        };
        Part.prototype.turnAllOn = function (context) {
            var _this = this;
            // only callable on root
            if (!this.parent) {
                if (!this.visSwitchOn) {
                    this.visSwitchOn = true;
                }
                else {
                    this.isVisible = true;
                }
                if (this != context) {
                    //manually call viewer to set vis to false
                    //then set all context part vis to true
                    //because we are drilled down.
                    this._viewer.setAutoDraw(false); // turn off auto-draw
                    this._viewer.setVisibilityByPsId(this.id, false);
                    context._viewer.setVisibilityByPsId(context.id, true, (function () {
                        _this._viewer.setAutoDraw(true);
                        _this._viewer.draw();
                    }).bind(this));
                }
            }
        };
        Object.defineProperty(Part.prototype, "visSwitchOn", {
            get: function () {
                return this._visSwitchOn;
            },
            set: function (value) {
                if (this._visSwitchOn != value) {
                    this._visSwitchOn = value;
                    this.isVisible = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "hasPmi", {
            get: function () {
                return (this._pmis.length > 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "id", {
            get: function () {
                return this._modelObject.psId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "isLeaf", {
            get: function () {
                return !this._modelObject.children || this._modelObject.children.length == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "name", {
            get: function () {
                return this._modelObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "isSelected", {
            get: function () {
                return this._isSelected;
            },
            set: function (value) {
                if (this._isSelected != value) {
                    // render everything else transparent
                    this._isSelected = value;
                    var root = this.getRoot();
                    if (this._isSelected === true) {
                        this.setTransparencyByPart(root, .1);
                        this._viewer.setSelectionByPsId(this.id, value);
                    }
                    else {
                        this._viewer.setSelectionByPsId(this.id, value);
                        // restore original opacity
                        this._viewer.resetMaterialByPsId(root.id);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Part.prototype.setTransparencyByPart = function (current, newOpacity) {
            // viewer now sets the material recursively, we no longer do it explicitly
            this._viewer.setMaterialByPsId(current.id, { opacity: newOpacity }, false);
        };
        Part.prototype.getRoot = function () {
            if (this.parent != null) {
                return this.parent.getRoot();
            }
            else {
                return this;
            }
        };
        Object.defineProperty(Part.prototype, "isPartiallyVisible", {
            get: function () {
                var returned = false;
                if (!this.isLeaf && !this._visBits.allOn && !this._visBits.allOff) {
                    return true;
                }
                for (var idx = 0; idx < this.children.length; idx++) {
                    if (this.children[idx].isPartiallyVisible) {
                        returned = true;
                        break;
                    }
                }
                return returned;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "isPmiVisible", {
            get: function () {
                return this._isPmiVisible;
            },
            set: function (value) {
                if (this._isPmiVisible != value) {
                    this._isPmiVisible = value;
                    var len = this._pmis.length;
                    for (var i = 0; i < len; ++i) {
                        this._pmis[i].isOn = value;
                    }
                    if (this.children && this.children.length > 0) {
                        for (var idx = 0; idx < this.children.length; idx++) {
                            this.children[idx].isPmiVisible = value;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "isVisible", {
            get: function () {
                return this.getVisibility();
            },
            set: function (value) {
                var _this = this;
                if (this.parent) {
                    // bubble up
                    var p = this.parent;
                    var c = this;
                    while (c && p) {
                        p._visBits.setBit(c._pos, value);
                        if (p._visBits.allOff) {
                            p.visSwitchOn = false;
                        }
                        else if (p._visBits.allOn) {
                            p.visSwitchOn = true;
                        }
                        var newValue = p.visSwitchOn;
                        if (newValue != value) {
                            break;
                        }
                        else {
                            c = p;
                            p = p.parent;
                        }
                    }
                }
                this.setVisibility(value);
                this._children.forEach(function (part) {
                    part.setVisibility(value);
                });
                this._viewer.setAutoDraw(false);
                this._viewer.setVisibilityByPsId(this.id, value, (function () {
                    _this._viewer.setAutoDraw(true);
                    _this._viewer.draw();
                }).bind(this));
            },
            enumerable: true,
            configurable: true
        });
        Part.prototype.addPmi = function (pmiObject) {
            this._pmis.push(pmiObject);
        };
        Part.prototype.addModelView = function (modelView) {
            this._modelViews.push(modelView);
        };
        Part.prototype.selectModelView = function (modelView) {
            modelView.isSelected = true;
        };
        Part.prototype.getVisibility = function () {
            if (this.isLeaf && this.parent) {
                return this.parent._visBits.getBit(this._pos);
            }
            else {
                return this._visBits.hasAny(true);
            }
        };
        Object.defineProperty(Part.prototype, "isAllVisible", {
            get: function () {
                if (this.isLeaf && this.parent) {
                    return this.parent._visBits.getBit(this._pos);
                }
                else {
                    return this._visBits.allOn;
                }
            },
            enumerable: true,
            configurable: true
        });
        Part.prototype.setVisibility = function (value) {
            if (this._visBits) {
                this._visBits.setAll(value);
            }
            // do not propagate setVisibilityByPsId call to viewer, viewer is already doing it recursively
            this._visSwitchOn = value;
        };
        Object.defineProperty(Part.prototype, "isAssembly", {
            get: function () {
                return this._children && this._children.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "propertiesGroups", {
            get: function () {
                return this._propertiesGroups;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "children", {
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Part.prototype, "level", {
            get: function () {
                return this._level;
            },
            enumerable: true,
            configurable: true
        });
        Part.prototype.addPart = function (part) {
            part._parent = this;
            part._level = this._level + 1;
            part._pos = this._children.push(part) - 1;
        };
        Part.setContext = function (oldValue, newValue) {
            if (newValue) {
                if (oldValue) {
                    // do it all in the recursive method
                    Part.setContextInternal(oldValue, newValue);
                }
            }
        };
        Part.setContextInternal = function (current_context, new_context) {
            // drilling down:  Hide if part is a level higher than context.
            // set vis back to how it should be if lower than context.
            var plmViewer = current_context._viewer;
            if (plmViewer) {
                plmViewer.setAutoDraw(false);
                plmViewer.setVisibilityByPsId(current_context.getRoot().id, false);
                plmViewer.setVisibilityByPsId(new_context.id, new_context.isVisible, (function () {
                    plmViewer.setAutoDraw(true);
                    plmViewer.draw();
                }).bind(this));
            }
        };
        return Part;
    })();
    exports.Part = Part;
    var Property = (function () {
        function Property(name, value) {
            this._name = name;
            this._value = value;
        }
        Object.defineProperty(Property.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        return Property;
    })();
    exports.Property = Property;
    var PropertyGroup = (function () {
        function PropertyGroup(groupName, properties) {
            this._groupName = groupName;
            this._properties = properties;
        }
        Object.defineProperty(PropertyGroup.prototype, "groupName", {
            get: function () {
                return this._groupName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyGroup.prototype, "properties", {
            get: function () {
                return this._properties;
            },
            enumerable: true,
            configurable: true
        });
        return PropertyGroup;
    })();
    exports.PropertyGroup = PropertyGroup;
    var PmiFilter = (function () {
        function PmiFilter(filterName, isOn) {
            this._filterName = filterName;
            this._isOn = isOn;
        }
        Object.defineProperty(PmiFilter.prototype, "filterName", {
            get: function () {
                return this._filterName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiFilter.prototype, "isOn", {
            get: function () {
                return this._isOn;
            },
            set: function (value) {
                if (this._isOn != value) {
                    this._isOn = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return PmiFilter;
    })();
    exports.PmiFilter = PmiFilter;
    var PmiVisibility = (function () {
        function PmiVisibility(psid, isOn) {
            this._psid = psid;
            this._isVisible = isOn;
        }
        Object.defineProperty(PmiVisibility.prototype, "psid", {
            get: function () {
                return this._psid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PmiVisibility.prototype, "isVisible", {
            get: function () {
                return this._isVisible;
            },
            enumerable: true,
            configurable: true
        });
        return PmiVisibility;
    })();
    exports.PmiVisibility = PmiVisibility;
});
//# sourceMappingURL=JT.js.map