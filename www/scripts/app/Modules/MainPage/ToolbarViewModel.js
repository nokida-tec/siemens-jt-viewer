// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Messages/Messages", "scripts/app/Models/NonJT", "scripts/app/Constants"], function (require, exports, Kernel, Messages, NonJT, Constants) {
    // View model for the items/functionality on the toolbar in the viewer region.
    // Each view of the toolbar is its own set of appBarItems.  
    var ToolbarViewModel = (function (_super) {
        __extends(ToolbarViewModel, _super);
        function ToolbarViewModel(viewerViewModel, mainViewModel, navigatorViewModel) {
            var _this = this;
            _super.call(this);
            this.viewerViewModel = viewerViewModel;
            this.mainViewModel = mainViewModel;
            this.navigatorViewModel = navigatorViewModel;
            this._viewer = viewerViewModel;
            this._mainView = mainViewModel;
            this._navigator = navigatorViewModel;
            // Main Display
            this._mainTools = [
                new NonJT.AppBarItem(Constants.Strings.Structure, Constants.IconPaths.structure, Constants.Strings.StructureTooltip, function () {
                    _this._navigator.displayLeftPanel(Constants.Strings.Structure, "mode0");
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.ModelView, Constants.IconPaths.modelView, Constants.Strings.ModelViewTooltip, function () {
                    _this._navigator.displayLeftPanel(Constants.Strings.ModelView, "mode1");
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.PartMenu, Constants.IconPaths.partToolbar, Constants.Strings.PartTooltip, function () {
                    _this.setPartTools();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.PmiMenu, Constants.IconPaths.pmiMenu, Constants.Strings.PMITooltip, function () {
                    _this.setPmiTools();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.ViewMenu, Constants.IconPaths.viewMenu, Constants.Strings.ViewTooltip, function () {
                    _this.setViewTools();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.Screen, Constants.IconPaths.screen, Constants.Strings.ScreenTooltip, function () {
                    _this.setScreenTools();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.SettingTool, Constants.IconPaths.settings, Constants.Strings.SettingsTooltip, function () {
                    _this._mainView.toggleSettingPanel();
                }, true, null)
            ];
            //Part Display
            this._partTools = [
                new NonJT.AppBarItem(Constants.Strings.ShowAllPartTool, Constants.IconPaths.showAll, Constants.Strings.ShowAllPartsTooltip, function () {
                    _this.showAllParts();
                }, false, null),
                new NonJT.AppBarItem(Constants.Strings.HideTool, Constants.IconPaths.hide, Constants.Strings.HidePartTooltip, function () {
                    _this.hidePart();
                }, false, null),
                new NonJT.AppBarItem(Constants.Strings.ShowPMITool, Constants.IconPaths.showPmi, Constants.Strings.ShowPartPMITooltip, function () {
                    _this.togglePartPmi();
                }, false, null),
                new NonJT.AppBarItem(Constants.Strings.PropertiesTool, Constants.IconPaths.properties, Constants.Strings.PartPropertiesTooltip, function () {
                    _this._mainView.togglePropertiesPanel();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.Return, Constants.IconPaths.return, Constants.Strings.ReturnTooltip, function () {
                    _this.setMainTools();
                }, true, null)
            ];
            //PMI Display
            this._pmiTools = [
                new NonJT.AppBarItem(Constants.Strings.ShowAllPMITool, Constants.IconPaths.showAllPMI, Constants.Strings.ShowAllPMITooltip, function () {
                    _this._viewer.togglePmiVisibility();
                    _this.togglePMIButton();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.HidePMITool, Constants.IconPaths.hidePMI, Constants.Strings.HidePMITooltip, function () {
                    _this._viewer.hideSelectedPmi();
                }, false, null),
                new NonJT.AppBarItem(Constants.Strings.AlignToViewTool, Constants.IconPaths.align, Constants.Strings.AlignToViewTooltip, function () {
                    _this._viewer.alignPmiToView();
                }, false, null),
                new NonJT.AppBarItem(Constants.Strings.PmiFiltersTool, Constants.IconPaths.pmiFilters, Constants.Strings.PMIFIltersTooltip, function () {
                    _this._mainView.togglePmiFiltersPanel();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.Return, Constants.IconPaths.return, Constants.Strings.ReturnTooltip, function () {
                    _this.setMainTools();
                }, true, null)
            ];
            //View Display
            this._viewTools = [
                new NonJT.AppBarItem(Constants.Strings.PanTool, Constants.IconPaths.pan, Constants.Strings.PanTooltip, function () {
                    _this.togglePan();
                    var mode = _this.viewerViewModel.gestureMode;
                    if (mode == NonJT.GestureMode.Pan) {
                        mode = NonJT.GestureMode.Rotate;
                    }
                    else {
                        mode = NonJT.GestureMode.Pan;
                    }
                    _this._viewer.gestureMode = mode;
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.OrientToolX, Constants.IconPaths.orientX, Constants.Strings.OrientXTooltip, function () {
                    _this._viewer.lookUpX();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.OrientToolY, Constants.IconPaths.orientY, Constants.Strings.OrientYTooltip, function () {
                    _this._viewer.lookUpY();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.OrientToolZ, Constants.IconPaths.orientZ, Constants.Strings.OrientZTooltip, function () {
                    _this._viewer.lookUpZ();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.FitTool, Constants.IconPaths.fit4, Constants.Strings.FitTooltip, function () {
                    _this._viewer.fit();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.ResetTool, Constants.IconPaths.reset, Constants.Strings.ResetTooltip, function () {
                    _this._viewer.reset();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.Return, Constants.IconPaths.return, Constants.Strings.ReturnTooltip, function () {
                    _this.setMainTools();
                }, true, null)
            ];
            // Screen Display
            this._screenTools = [
                new NonJT.AppBarItem(Constants.Strings.SnapshotTool, Constants.IconPaths.takePicture, Constants.Strings.SnapshotTooltip, function () {
                    _this._viewer.saveScreen();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.BackgroundLiveCameraTool, Constants.IconPaths.cameraOn, Constants.Strings.LiveCameraTooltip, function () {
                    _this._viewer.toggleBackgroundCamera();
                }, true, null),
                new NonJT.AppBarItem(Constants.Strings.Return, Constants.IconPaths.return, Constants.Strings.ReturnTooltip, function () {
                    _this.setMainTools();
                }, true, null)
            ];
            this.setMainTools();
            this.updateOrientation(); // need to get beginning screen orientation;
        }
        Object.defineProperty(ToolbarViewModel.prototype, "viewerVM", {
            get: function () {
                return this._viewer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ToolbarViewModel.prototype, "tools", {
            get: function () {
                return this._tools;
            },
            enumerable: true,
            configurable: true
        });
        ToolbarViewModel.prototype.setMainTools = function () {
            this._tools = this._mainTools;
        };
        ToolbarViewModel.prototype.setPartTools = function () {
            this._tools = this._partTools;
        };
        ToolbarViewModel.prototype.setPmiTools = function () {
            this._tools = this._pmiTools;
        };
        ToolbarViewModel.prototype.setViewTools = function () {
            this._tools = this._viewTools;
        };
        ToolbarViewModel.prototype.setScreenTools = function () {
            this._tools = this._screenTools;
        };
        ToolbarViewModel.prototype.onActivated = function () {
            var _this = this;
            _super.prototype.onActivated.call(this);
            this.onMessage(Messages.NavigatorSelectionChanged, function (msg) {
                // update enabled state of part menu app bar items
                // hide part enabled if selected part is not null otherwise disable
                _this.onSelectedPartChanged(msg);
            });
            this.onMessage(Messages.LoadedPartVisibilityChanged, function (msg) {
                _this.onLoadedPartVisibilityChanged(msg);
            });
            this.onMessage(Messages.ContextPartChanged, function (msg) {
                _this.onContextPartChanged(msg);
            });
            this.onMessage(Messages.SelectedItemVisibilityChanged, function (msg) {
                _this.onSelectedItemVisibilityChanged(msg);
            });
            this.onMessage(Messages.LoadedPartChanged, function (msg) {
                _this.onReset();
            });
            this.onMessage(Messages.SelectedPmiChanged, function (msg) {
                _this.onSelectedPmiChanged(msg.partIds);
            });
            window.addEventListener("orientationchange", function (evt) {
                _this.updateOrientation();
                _this.forceDigest(null);
            });
        };
        ToolbarViewModel.prototype.updateOrientation = function () {
            if (window.orientation == "0" || window.orientation == "180") {
                this._screenVertical = true;
            }
            else {
                this._screenVertical = false;
            }
        };
        Object.defineProperty(ToolbarViewModel.prototype, "screenVertical", {
            get: function () {
                return this._screenVertical;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ToolbarViewModel.prototype, "isSmallScreenHeight", {
            get: function () {
                return this.mainViewModel.isSmallScreenHeight;
            },
            enumerable: true,
            configurable: true
        });
        ToolbarViewModel.prototype.onReset = function () {
            this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].name = Constants.Strings.ShowAllPMITool;
            this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].png = Constants.IconPaths.showAllPMI;
            this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].tooltip = Constants.Strings.ShowAllPMITooltip;
        };
        // code below was taken directly from appBarViewModel.ts to use in the new toolbar
        // Called whenever a selected item's visibility is changed from within the structure panel
        ToolbarViewModel.prototype.onSelectedItemVisibilityChanged = function (msg) {
            if (msg.selectedPart) {
                if (msg.selectedPart.isVisible) {
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].name = Constants.Strings.HideTool;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].png = Constants.IconPaths.hide;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].tooltip = Constants.Strings.HidePartTooltip;
                }
                else {
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].name = Constants.Strings.ShowTool;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].png = Constants.IconPaths.show;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].tooltip = Constants.Strings.ShowPartTooltip;
                }
            }
        };
        // Called whenever a new part is selected in the viewer or whenever a selected part is deselected
        ToolbarViewModel.prototype.onSelectedPartChanged = function (msg) {
            if (msg.selectedPart) {
                // meaning something got selected
                this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].isEnabled = true;
                if (msg.selectedPart.isVisible) {
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].name = Constants.Strings.HideTool;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].png = Constants.IconPaths.hide;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].tooltip = Constants.Strings.HidePartTooltip;
                }
                else {
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].name = Constants.Strings.ShowTool;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].png = Constants.IconPaths.show;
                    this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].tooltip = Constants.Strings.ShowPartTooltip;
                }
                if (msg.selectedPart.hasPmi) {
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].isEnabled = true;
                    if (msg.selectedPart.isPmiVisible) {
                        this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].name = Constants.Strings.HidePMITool;
                        this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].png = Constants.IconPaths.hidePMI;
                        this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].tooltip = Constants.Strings.HidePartPMITooltip;
                    }
                    else {
                        this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].name = Constants.Strings.ShowPMITool;
                        this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].png = Constants.IconPaths.showPmi;
                        this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].tooltip = Constants.Strings.ShowPartPMITooltip;
                    }
                }
                else {
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].isEnabled = false;
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].name = Constants.Strings.ShowPMITool;
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].png = Constants.IconPaths.showPmi;
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].tooltip = Constants.Strings.ShowPartPMITooltip;
                }
            }
            else {
                this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].isEnabled = false;
                this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].name = Constants.Strings.HideTool;
                this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].png = Constants.IconPaths.hide;
                this._partTools[ToolbarViewModel.SHOWHIDEPART_PART].tooltip = Constants.Strings.HidePartTooltip;
                this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].isEnabled = false;
                this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].name = Constants.Strings.ShowPMITool;
                this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].png = Constants.IconPaths.showPmi;
                this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].tooltip = Constants.Strings.ShowPartPMITooltip;
            }
        };
        // Called whenever a part is double tapped either in the structure panel or in the viewer area
        // This occurs along with an update to the parts listed in the structure panel
        ToolbarViewModel.prototype.onContextPartChanged = function (msg) {
            if (msg.part) {
                if (msg.part.isAllVisible) {
                    this._partTools[ToolbarViewModel.SHOWALLPARTS_PART].isEnabled = false;
                }
                else {
                    this._partTools[ToolbarViewModel.SHOWALLPARTS_PART].isEnabled = true;
                }
            }
        };
        // Called whenever the visibility of a part currently loaded in the viewer is changed 
        ToolbarViewModel.prototype.onLoadedPartVisibilityChanged = function (msg) {
            if (msg.isAllVisible) {
                this._partTools[ToolbarViewModel.SHOWALLPARTS_PART].isEnabled = false;
            }
            else {
                this._partTools[ToolbarViewModel.SHOWALLPARTS_PART].isEnabled = true;
            }
        };
        // Called whenever a new PMI becomes selected or whenever a selected PMI is deselected
        ToolbarViewModel.prototype.onSelectedPmiChanged = function (ids) {
            if (ids.length > 0) {
                // pmi is selected
                this._pmiTools[ToolbarViewModel.HIDEPMI_PMI].isEnabled = true;
                this._pmiTools[ToolbarViewModel.ALIGNTOVIEW_PMI].isEnabled = true;
            }
            else {
                // pmi is deslected
                this._pmiTools[ToolbarViewModel.HIDEPMI_PMI].isEnabled = false;
                this._pmiTools[ToolbarViewModel.ALIGNTOVIEW_PMI].isEnabled = false;
            }
        };
        ToolbarViewModel.prototype.togglePMIButton = function () {
            if (this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].name == Constants.Strings.ShowAllPMITool) {
                this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].name = Constants.Strings.HideAllPMITool;
                this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].png = Constants.IconPaths.hideAllPMI;
                this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].tooltip = Constants.Strings.HideAllPMITooltip;
            }
            else {
                this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].name = Constants.Strings.ShowAllPMITool;
                this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].png = Constants.IconPaths.showAllPMI;
                this._pmiTools[ToolbarViewModel.SHOWHIDEALLPMI_PMI].tooltip = Constants.Strings.ShowAllPMITooltip;
            }
        };
        ToolbarViewModel.prototype.togglePartPmi = function () {
            if (this._navigator.selectedPart) {
                this._viewer.clearPMIBatchList();
                this._navigator.selectedPart.isPmiVisible = !this._navigator.selectedPart.isPmiVisible;
                this._viewer.batchPMIVisibility();
                if (this._navigator.selectedPart.isPmiVisible) {
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].name = Constants.Strings.HidePMITool;
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].png = Constants.IconPaths.hidePMI;
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].tooltip = Constants.Strings.HidePartPMITooltip;
                }
                else {
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].name = Constants.Strings.ShowPMITool;
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].png = Constants.IconPaths.showPmi;
                    this._partTools[ToolbarViewModel.SHOWHIDEPMI_PART].tooltip = Constants.Strings.ShowPartPMITooltip;
                }
            }
        };
        ToolbarViewModel.prototype.showAllParts = function () {
            if (this._navigator.loadedPart) {
                this._navigator.loadedPart.turnAllOn(this._navigator.contextPart);
                //manually fix state since msg is triggered by NavVM, not Part model.
                this._partTools[ToolbarViewModel.SHOWALLPARTS_PART].isEnabled = false;
            }
        };
        ToolbarViewModel.prototype.hidePart = function () {
            if (this._navigator.selectedPart) {
                var partToHide = this._navigator.selectedPart;
                this._navigator.selectPart(null);
                this._navigator.setVisibility(partToHide);
            }
        };
        // switch icon/label when selected in the toolbar
        ToolbarViewModel.prototype.togglePan = function () {
            var panItem = this._viewTools[ToolbarViewModel.SPINPAN_VIEW];
            if (panItem.name == Constants.Strings.PanTool) {
                panItem.name = Constants.Strings.RotateTool;
                panItem.png = Constants.IconPaths.rotate;
                panItem.tooltip = Constants.Strings.RotateTooltip;
            }
            else {
                panItem.name = Constants.Strings.PanTool;
                panItem.png = Constants.IconPaths.pan;
                panItem.tooltip = Constants.Strings.PanTooltip;
            }
        };
        // Called when a press+hold event fires from a toolbar item
        ToolbarViewModel.prototype.handleTooltip = function (evt) {
            var id = evt.target.id;
            var tooltipID = id + "toolTip"; // create the ID for the item's tooltip element
            document.getElementById(tooltipID).style.display = "inherit";
            document.getElementById(id).ontouchend = function () {
                document.getElementById(tooltipID).style.display = "none"; // hide the tooltip whenever the user removes their finger
            };
        };
        Object.defineProperty(ToolbarViewModel.prototype, "isToolbarVisible", {
            get: function () {
                return this.mainViewModel.isToolbarVisible;
            },
            enumerable: true,
            configurable: true
        });
        // var names go by "function_menu"
        ToolbarViewModel.SHOWALLPARTS_PART = 0;
        ToolbarViewModel.SHOWHIDEPART_PART = 1;
        ToolbarViewModel.SHOWHIDEPMI_PART = 2;
        ToolbarViewModel.SHOWHIDEALLPMI_PMI = 0;
        ToolbarViewModel.HIDEPMI_PMI = 1;
        ToolbarViewModel.ALIGNTOVIEW_PMI = 2;
        ToolbarViewModel.SPINPAN_VIEW = 0;
        ToolbarViewModel.BACKGROUND_CAMERA = 2;
        return ToolbarViewModel;
    })(Kernel.ViewModelBase);
    exports.ToolbarViewModel = ToolbarViewModel;
});
//# sourceMappingURL=ToolbarViewModel.js.map