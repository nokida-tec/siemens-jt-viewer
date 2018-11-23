// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
"use strict";
define(["require", "exports"], function (require, exports) {
    /**
     * Class containing the static/constant strings.
     *
     */
    var Strings = (function () {
        function Strings() {
        }
        /**
         * Gets the module base URI.
         */
        Strings.ModuleBaseUri = "./scripts/app/Modules/";
        Strings.JT2GoCustomFontFamilyName = "Jt2GoCustomFont";
        Strings.Structure = "Structure";
        Strings.GoBack = "GoBack";
        Strings.ModelView = "ModelView";
        Strings.MarkupView = "Markup";
        Strings.HomeHref = "#/HomeView";
        Strings.ResetTool = "Reset";
        Strings.PanTool = "Pan";
        Strings.RotateTool = "Spin";
        Strings.OrientTool = "OrientTo";
        Strings.OrientToolX = "X";
        Strings.OrientToolY = "Y";
        Strings.OrientToolZ = "Z";
        Strings.FitTool = "Fit";
        Strings.ViewMenu = "View";
        Strings.GeneralMenu = "General";
        Strings.SnapshotTool = "Snapshot";
        Strings.SettingTool = "Settings";
        Strings.LegalTool = "Legal";
        Strings.PrivacyTool = "PrivacyPolicy";
        Strings.BackgroundTool = "Background";
        Strings.BackgroundChooseImageTool = "Choose Image";
        Strings.BackgroundTakeImageTool = "Take Image";
        Strings.BackgroundLiveCameraTool = "Live Camera";
        Strings.BackgroundResetTool = "Reset";
        Strings.PartMenu = "Part";
        Strings.ShowAllPartTool = "ShowAllParts";
        Strings.HideTool = "Hide";
        Strings.ShowPMITool = "ShowPMI";
        Strings.HidePMITool = "HidePMI";
        Strings.PropertiesTool = "Properties";
        Strings.PmiMenu = "PMI";
        Strings.ShowAllPMITool = "ShowAllPMI";
        Strings.HideAllPMITool = "HideAllPMI";
        Strings.PmiFiltersTool = "PMIFilters";
        Strings.AlignToViewTool = "AlignToView";
        Strings.ShowTool = "Show";
        Strings.LicenseFlag = "LicenseFlag";
        Strings.PrivacyUrl = "http://www.plm.automation.siemens.com/en_us/legal.shtml";
        Strings.LicenseTermsAndroid = "License Terms for JT2Go for Android Application";
        Strings.LicenseTermsIOS = "License Terms for JT2Go for iOS Application";
        Strings.LicenseTermsWindows = "License Terms for JT2Go for Windows Application";
        Strings.DCIMName = "DCIM";
        Strings.imageAlbumName = "JT2GO_Album";
        Strings.snapshotPrefix = "jt2go_snapshot";
        Strings.HelpTool = "Help";
        Strings.HelpLocation = "http://docs.plm.automation.siemens.com/tdoc/jt2go_mobile/3.0/help/"; // use ' http://lmdbuild/tdoc/jt2go_mobile/3.0/help/ ' for internal testing
        Strings.ParseJtErrorText = "ParseJtErrorText";
        Strings.ParsePMIErrorText = "ParsePMIErrorText";
        Strings.ParsePropertiesErrorText = "ParsePropertiesErrorText";
        Strings.Home = "Home";
        Strings.NewToolbar = "NewToolbar";
        Strings.Screen = "Screen";
        Strings.Return = "Return";
        Strings.HomeTooltip = "HomeTooltip";
        Strings.StructureTooltip = "StructureTooltip";
        Strings.ModelViewTooltip = "ModelViewTooltip";
        Strings.PartTooltip = "PartTooltip";
        Strings.PMITooltip = "PMITooltip";
        Strings.SettingsTooltip = "SettingsTooltip";
        Strings.ShowAllPartsTooltip = "ShowAllPartsTooltip";
        Strings.HidePartTooltip = "HidePartTooltip";
        Strings.ShowPartTooltip = "ShowPartTooltip";
        Strings.ShowPartPMITooltip = "ShowPartPMITooltip";
        Strings.HidePartPMITooltip = "HidePartPMITooltip";
        Strings.PartPropertiesTooltip = "PartPropertiesTooltip";
        Strings.ReturnTooltip = "ReturnTooltip";
        Strings.ShowAllPMITooltip = "ShowAllPMITooltip";
        Strings.HideAllPMITooltip = "HideAllPMITooltip";
        Strings.HidePMITooltip = "HidePMITooltip";
        Strings.AlignToViewTooltip = "AlignToViewTooltip";
        Strings.PMIFIltersTooltip = "PMIFiltersTooltip";
        Strings.ViewTooltip = "View";
        Strings.RotateTooltip = "Spin";
        Strings.PanTooltip = "Pan";
        Strings.OrientXTooltip = "OrientXTooltip";
        Strings.OrientYTooltip = "OrientYTooltip";
        Strings.OrientZTooltip = "OrientZTooltip";
        Strings.FitTooltip = "FitTooltip";
        Strings.ResetTooltip = "Reset";
        Strings.ScreenTooltip = "Screen";
        Strings.SnapshotTooltip = "Snapshot";
        Strings.LiveCameraTooltip = "CameraOnOff";
        Strings.ThirdPartyLocationAndroid = "ThirdParty/Android/LicenseSummary_comb.htm";
        Strings.ThirdPartyLocationIOS = "ThirdParty/iOS/LicenseSummary_comb.htm";
        Strings.DownloadFailText = "DownloadFailText";
        Strings.TempBodsDirectory = "temp_bod_files";
        Strings.GeofenceName1 = "Blade";
        Strings.GeofenceName2 = "Block";
        Strings.GeofenceName3 = "Bracket";
        Strings.GeofenceName4 = "Cone";
        Strings.GeofenceName5 = "Cylinder";
        Strings.GeofenceName6 = "Lego Police";
        Strings.GeofenceName7 = "Nittany Lion";
        Strings.GeofenceName8 = "Piston";
        Strings.GeofenceName9 = "Rocket";
        Strings.GeofenceName10 = "Tractor";
        return Strings;
    })();
    exports.Strings = Strings;
    var StateNames = (function () {
        function StateNames() {
        }
        StateNames.Main = "MainView";
        StateNames.Home = "HomeView";
        StateNames.Context = "MainView.Context";
        return StateNames;
    })();
    exports.StateNames = StateNames;
    var PreferenceKeys = (function () {
        function PreferenceKeys() {
        }
        PreferenceKeys.RecentFiles = "RecentFiles";
        PreferenceKeys.ThumbnailLastViewer = "ThumbnailLastViewer";
        PreferenceKeys.ViewType = "ViewType";
        PreferenceKeys.BackgroundColor = "BackgroundColor";
        PreferenceKeys.SelectionColor = "SelectionColor";
        PreferenceKeys.PmiColor = "PmiColor";
        PreferenceKeys.Default = "Default";
        PreferenceKeys.Language = "Language";
        PreferenceKeys.LiveCameraOn = "LiveCameraOn";
        return PreferenceKeys;
    })();
    exports.PreferenceKeys = PreferenceKeys;
    var IconPaths = (function () {
        function IconPaths() {
        }
        IconPaths.pmiFilters = "./images/icons/Filters.svg";
        IconPaths.hide = "./images/icons/Hide.svg";
        IconPaths.orient = "./images/icons/Orient.svg";
        IconPaths.part = "./images/icons/Part.svg";
        IconPaths.assemblyMenu = "./images/icons/Assembly.svg";
        IconPaths.pmiMenu = "./images/icons/PMI.svg";
        IconPaths.align = "./images/icons/AlignToView.svg";
        IconPaths.properties = "./images/icons/Properties.svg";
        IconPaths.snapshot = "./images/icons/Snapshot.svg";
        IconPaths.showAll = "./images/icons/ShowAllParts.svg";
        IconPaths.showPmi = "./images/icons/ShowPMI.svg";
        IconPaths.pan = "./images/icons/Pan.svg";
        IconPaths.generalMenu = "./images/icons/General.svg";
        IconPaths.viewMenu = "./images/icons/ViewMenu.svg";
        IconPaths.reset = "./images/icons/Reset.svg";
        IconPaths.settings = "./images/icons/Settings.svg";
        IconPaths.rotate = "./images/icons/Spin.svg";
        IconPaths.screen = "./images/icons/Screen.svg";
        IconPaths.orientX = "./images/icons/OrientToX.svg";
        IconPaths.orientY = "./images/icons/OrientToY.svg";
        IconPaths.orientZ = "./images/icons/OrientToZ.svg";
        IconPaths.fit4 = "./images/icons/Fit4.svg";
        IconPaths.takePicture = "./images/icons/TakePicture.svg";
        IconPaths.cameraOn = "./images/icons/CameraOn.svg";
        IconPaths.home = "./images/icons/Home.svg";
        IconPaths.structure = "./images/icons/Structure.svg";
        IconPaths.modelView = "./images/icons/Modelview.svg";
        IconPaths.partToolbar = "./images/icons/PartToolbar.svg";
        IconPaths.show = "./images/icons/Show.svg";
        IconPaths.hidePMI = "./images/icons/HidePMI.svg";
        IconPaths.return = "./images/icons/Return.svg";
        IconPaths.showAllPMI = "./images/icons/ShowAllPMI.svg";
        IconPaths.hideAllPMI = "./images/icons/HideAllPMI.svg";
        IconPaths.assemblyTab = "./images/icons/Assembly";
        IconPaths.modelViewTab = "./images/icons/Modelview";
        return IconPaths;
    })();
    exports.IconPaths = IconPaths;
});
//# sourceMappingURL=Constants.js.map