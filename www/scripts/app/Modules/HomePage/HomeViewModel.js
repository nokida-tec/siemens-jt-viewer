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
define(["require", "exports", "scripts/app/Kernel", "scripts/app/Models/NonJT", "scripts/app/Models/GeofenceManager", "scripts/app/Constants", "scripts/app/Utils/Helper"], function (require, exports, Kernel, NonJT, GeofenceManager, Constants, Helper) {
    //var onedriveLink = "https://1drv.ms/t/s%21ArepnCpPRIFHg5wJGpjv0b_DYdFXSw"   // one drive file was used by Gokool
    var geofencesConfigLink = "https://docs.google.com/document/d/1ObvUESBa54q-NujgD6AqvpKrEWA1grRBHnPmNstSzH4/export?format=txt";
    var uri;
    var HomeViewModel = (function (_super) {
        __extends(HomeViewModel, _super);
        function HomeViewModel(settingService) {
            var _this = this;
            _super.call(this);
            this.settingService = settingService;
            this._filePickerFactory = new NonJT.FilePickerFactory();
            // visibility of FilePickerOpen panel
            this._isFilePickerOpen = false;
            // visibility of home view panel
            this._homePanelOpen = true;
            // visibility of license panel
            this._licensePanelOpen = false;
            this.fsInit = false;
            this._filePickerLoading = false;
            this._lastAttempedFile = null;
            this._downloadFailText = Constants.Strings.DownloadFailText;
            this._localBodsDirectory = null;
            /********************** MAP STUFF **********************************/
            this.map = null;
            this._geofenceMgr = null;
            this.totalNumOfFences = 0; //should be init as this._geofenceInitFiles.length
            this.storage = localStorage;
            // visibility of scavenger hunt button, only visible near Redmond
            this._mapButtonVisible = false;
            // visibility of map view
            this._isMapViewOpen = false;
            this.circles = [];
            this.visitedElementSize = "200px";
            this._unfoundFileDict = {
                'Blade': ['1', '1'],
                'Block': ['1', '1'],
                'Bracket': ['1', '1'],
                'Cone': ['1', '1'],
                'Cylinder': ['1', '1'],
                'Lego Police': ['1', '1'],
                'Nittany Lion': ['1', '1'],
                'Piston': ['1', '1'],
                'Rocket': ['1', '1'],
                'Tractor': ['1', '1']
            };
            this.onNavDownCallback = function () {
                _this.onNavDone.apply(_this, []);
            };
            this.onNavUpCallback = function () {
                _this.onNavDone.apply(_this, []);
            };
            this.onFileSystemInitialized = function () {
                _this.onFSCreated.apply(_this, []);
            };
            this.onPickFileCallback = function (val) {
                _this.onFileContentsLoaded.apply(_this, [val]);
            };
            this._fileOpened = false;
            this._sampleFiles = [];
            this._recentFiles = settingService.getObject(Constants.PreferenceKeys.RecentFiles) || [];
            this._sampleFiles.push(new NonJT.FileItem("CD Player", "samples/CDPlayer"));
            this._sampleFiles.push(new NonJT.FileItem("Control Cabinet", "samples/ControlCabinet"));
            this._sampleFiles.push(new NonJT.FileItem("Electric Razor", "samples/ElectricRazor"));
            this._sampleFiles.push(new NonJT.FileItem("Floor Jack", "samples/FloorJack"));
            this._sampleFiles.push(new NonJT.FileItem("Radial Engine", "samples/RadialEngine"));
            //setup visited and unvisited items
            //if initial build, fill unvisited files
            var started = this.storage.getItem("started");
            this._geofenceInitFiles = [];
            this._unvisitedFiles = [];
            this._visitedFiles = [];
            var unvisited = JSON.parse(this.storage.getItem("unvisited"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName1, "samples/Blade"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName2, "samples/Block"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName3, "samples/Bracket"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName4, "samples/Cone"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName5, "samples/Cylinder"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName6, "samples/Lego"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName7, "samples/Lion"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName8, "samples/Piston"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName9, "samples/Rocket"));
            this._geofenceInitFiles.push(new NonJT.FileItem(Constants.Strings.GeofenceName10, "samples/Tractor"));
            this.totalNumOfFences = this._geofenceInitFiles.length;
            if (started == null || started == "false" || unvisited == null) {
                this.storage.setItem("started", "true");
                for (var y = 0; y < this._geofenceInitFiles.length; y++) {
                    this._unvisitedFiles[y] = new NonJT.FileItem(this._geofenceInitFiles[y].name, this._geofenceInitFiles[y].modelPath);
                }
                this.storage.setItem("unvisited", JSON.stringify(this._unvisitedFiles));
            }
            else {
                for (var x = 0; x < unvisited.length; x++) {
                    this._unvisitedFiles.push(new NonJT.FileItem(unvisited[x].name, unvisited[x].modelPath));
                }
            }
            this._visitedFiles = this.settingService.getObject("geovisited") || [];
            if (!this.fsInit) {
                this._filePickerWidget = this._filePickerFactory.getInstance();
                this._filePickerLoading = true;
                this._filePickerWidget.constructFileSystem(this.onFileSystemInitialized);
            }
            // was license agreement accepted?
            if (settingService.getObject(Constants.Strings.LicenseFlag) != null) {
                this._licensePanelOpen = !settingService.getObject(Constants.Strings.LicenseFlag);
            }
            else {
                // first time launch, show license panel
                this._licensePanelOpen = true;
            }
            this._homePanelOpen = !this._licensePanelOpen;
            if (device.platform) {
                var platformStr = device.platform;
                if (platformStr.indexOf("iOS") > -1) {
                    this._licensePanelTitle = Constants.Strings.LicenseTermsIOS;
                }
                else if (platformStr.indexOf("Android") > -1) {
                    this._licensePanelTitle = Constants.Strings.LicenseTermsAndroid;
                    document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
                    // initiate jt2bod native libs, only Android is supported at this point
                    var succeeded = function () {
                        // do nothing,   alert(" init jt2bod succeeded ");
                    };
                    jt2bod.init(succeeded, null);
                }
                else if (platformStr.indexOf("windows") > -1) {
                    this._licensePanelTitle = Constants.Strings.LicenseTermsWindows;
                }
            }
            this.setupLocalBodsDirectory();
            this.map = plugin.google.maps.Map.getMap();
            this.map.addEventListener(plugin.google.maps.event.MAP_READY, function (map) {
                console.log("google map is ready!");
            });
            if (this.geofenceEnabled) {
                this.setUpGeofenceMgr();
            }
        }
        HomeViewModel.prototype.searchStarted = function () {
            $("#outerMapView").css('opacity', 0);
            $("#outerMapView").fadeTo('fast', 1);
        };
        HomeViewModel.prototype.setUpGeofenceMgr = function () {
            if (this._geofenceMgr == null) {
                var self = this;
                var storedGeofenceList = cordova.file.dataDirectory + "JtLocations.json";
                var fileTransfer = new FileTransfer();
                // download coordinates from google drive
                fileTransfer.download(encodeURI(geofencesConfigLink), encodeURI(storedGeofenceList), function (entry) {
                    console.log("download complete: " + entry.toURL());
                    jQuery.getJSON(storedGeofenceList, function (data) {
                        //sets location of files
                        for (var y = 0; y < data.length; y++) {
                            if (data[y]) {
                                self._unfoundFileDict[data[y].name][0] = data[y].lat;
                                self._unfoundFileDict[data[y].name][1] = data[y].lng;
                            }
                        }
                        self._geofenceMgr = new GeofenceManager.GeofenceMgr(self._unvisitedFiles, self._unfoundFileDict);
                    });
                }, function (error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code" + error.code);
                }, false, {
                    headers: {
                        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                    }
                });
                this.determineVisitedElementSize();
            }
        };
        Object.defineProperty(HomeViewModel.prototype, "geofenceEnabled", {
            //returns whether user has previously entered file search mode
            get: function () {
                var status = this.storage.getItem("geofenceEnabled");
                return status == null || status == "false" ? false : true;
            },
            enumerable: true,
            configurable: true
        });
        //opens map dialog when 'open map' button is pressed in file search mode
        HomeViewModel.prototype.openMap = function () {
            this.map.showDialog();
            this.addGeofenceMarkers();
        };
        Object.defineProperty(HomeViewModel.prototype, "visitedFiles", {
            get: function () {
                return this._visitedFiles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "unvisitedFiles", {
            get: function () {
                return this._unvisitedFiles;
            },
            enumerable: true,
            configurable: true
        });
        //adds geofence markers of currenty unvisited files to the map
        HomeViewModel.prototype.addGeofenceMarkers = function () {
            this.map.clear();
            var self = this;
            for (var y = 0; y < this.unvisitedFiles.length; y++) {
                var item = this._unvisitedFiles[y];
                var coord = this._unfoundFileDict[item.name];
                var geoLocation = new plugin.google.maps.LatLng(coord[0], coord[1]);
                this.map.addMarker({
                    'position': geoLocation,
                    'title': item.name
                }, function (marker) {
                    marker.showInfoWindow();
                });
                self.map.addCircle({
                    'center': geoLocation,
                    'radius': 20,
                    'strokeColor': '#16a085',
                    'strokeWidth': 5,
                    'fillColor': '#bcf6e9'
                }, function (circle) {
                    self.circles.push({
                        key: item.name,
                        circle: circle
                    });
                });
            }
            var onMapWatchSuccess = function (position) {
                console.log("watchPosition success");
                if (self._geofenceMgr) {
                    var foundfile = self._geofenceMgr.checkIfPositionInFence(position.coords.latitude, position.coords.longitude);
                    if (foundfile != undefined) {
                        var gogoSound = new Media(Helper.getCordovaAssetPath() + "media/yowoo.m4a", 
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
                        navigator.vibrate(500); //user feedback when snapshot is created
                        gogoSound.play();
                        // if (confirm("You've got JT-- " + foundfile.name + "\nClick OK to view it.")) {
                        self.selectGeofencedFile(foundfile);
                    }
                    var userLocation = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    if (self._currentPoMarker) {
                        self._currentPoMarker.setPosition(userLocation);
                    }
                }
            };
            var onSuccess = function (position) {
                var userLocation = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                self.map.animateCamera({
                    'target': userLocation,
                    'tilt': 60,
                    'zoom': 18,
                    'bearing': 140
                });
                self.map.addMarker({
                    'position': userLocation,
                    'title': "Me"
                }, function (marker) {
                    self._currentPoMarker = marker;
                    marker.showInfoWindow();
                });
            };
            function onError(error) {
                alert('Error on getting location, code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }
            ;
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
            navigator.geolocation.watchPosition(onMapWatchSuccess, onError, { enableHighAccuracy: true });
        };
        //after visiting an element adds element to visited files and removes it from unvisited, updates local storage & removes marker from map
        HomeViewModel.prototype.updateData = function (newItem) {
            //var newJTItem = new NonJT.FileItem(newItem.id, "samples/" + newItem.id.split(' ').join(''));
            //updating visited items
            this._visitedFiles.push(newItem);
            this.settingService.setObject("geovisited", this._visitedFiles);
            this._geofenceMgr.removeFenceItem(newItem);
            //updating unvisited items
            for (var y = 0; y < this._unvisitedFiles.length; y++) {
                if (this._unvisitedFiles[y].name == newItem.name) {
                    this._unvisitedFiles.splice(y, 1);
                }
            }
            //this._unvisitedFiles.splice(this._unvisitedFiles.indexOf(newJTItem), 1);
            this.storage.setItem("unvisited", JSON.stringify(this._unvisitedFiles));
            //updates html score data
            //var element = angular.element($('#tempID')).scope.apply;
            $("#scoreIndicatorText").html(this.visitedFiles.length + "/" + this.totalNumOfFences + " files visited");
            $("#scoreProgress").val(String(this.visitedFiles.length));
        };
        //toggles between map view and home page view
        HomeViewModel.prototype.toggleMapView = function () {
            //window.localStorage.clear();
            var mapView = $("#outerMapView");
            var homeView = $("#homePanel");
            //animates to geofence accept page or map view page 
            if (!this.geofenceEnabled) {
                $("#geofenceAcceptionPage").fadeTo('fast', 1);
                this.setUpGeofenceMgr();
                this.storage.setItem("geofenceEnabled", "true");
            }
            else {
                mapView.css('opacity', '0');
                mapView.fadeTo("fast", 1);
                this.storage.setItem("geofenceEnabled", "false");
            }
            /*
            else {
                var self = this;
                mapView.fadeTo('fast', 0);
                if (!this.geofenceEnabled) {
                    $("#geofenceAcceptionPage").fadeTo('fast', 0);
                }
                homeView.fadeTo('fast', 1);
                self.isMapViewOpen = false;
                self._homePanelOpen = true;
            }   */
        };
        //user selected a previously visited file
        HomeViewModel.prototype.selectGeofencedFile = function (fileItem) {
            alert("Congratulations! You've captured " + fileItem.name);
            this.updateData(fileItem);
            this.selectSample(fileItem);
            this.map.closeDialog();
        };
        //calculates what size visited item elements should be based on width of screen
        HomeViewModel.prototype.determineVisitedElementSize = function () {
            var width = window.innerWidth;
            var height = window.innerHeight;
            if (width < height) {
                if (width < 400) {
                    this.visitedElementSize = (window.innerWidth * .38) + "px";
                }
                else {
                    this.visitedElementSize = (window.innerWidth * .24) + "px";
                }
            }
            else {
                if (height < 400) {
                    this.visitedElementSize = (window.innerHeight * .38) + "px";
                }
                else {
                    this.visitedElementSize = (window.innerHeight * .24) + "px";
                }
            }
        };
        HomeViewModel.prototype.resetGeofenceList = function () {
            alert("warning! You are now resetting geofence list.");
            this._visitedFiles = null;
            this._unvisitedFiles = null;
            this._visitedFiles = [];
            this._unvisitedFiles = [];
            for (var y = 0; y < this._geofenceInitFiles.length; y++) {
                this._unvisitedFiles[y] = new NonJT.FileItem(this._geofenceInitFiles[y].name, this._geofenceInitFiles[y].modelPath);
            }
            this.settingService.setObject("geovisited", this._visitedFiles);
            this.storage.setItem("unvisited", JSON.stringify(this._unvisitedFiles));
            this._geofenceMgr = null;
            this._geofenceMgr = new GeofenceManager.GeofenceMgr(this._unvisitedFiles, this._unfoundFileDict);
        };
        /*********************END MAP STUFF*******************************************/
        HomeViewModel.prototype.onDeviceReady = function () {
            var windowIntent = cordova.require("com.napolitano.cordova.plugin.intent.IntentPlugin");
            //Resuming the app
            windowIntent.setNewIntentHandler(function (Intent) {
                if (Intent.hasOwnProperty("data")) {
                    // Launching the app by selecting a file
                    this.loadFromIntent(Intent, 0);
                }
                // Resuming the app by the launcher icon/recent apps list
            }.bind(this));
            //Launching the app
            windowIntent.getCordovaIntent(function (Intent) {
                if (Intent.hasOwnProperty('data')) {
                    // Launching the app by selecting a file
                    this.loadFromIntent(Intent, 2000);
                }
                else {
                }
                ;
            }.bind(this), function () {
                //unable to get intent 
            });
        };
        HomeViewModel.prototype.onActivated = function () {
            var _this = this;
            _super.prototype.onActivated.call(this);
            if (!this._licensePanelOpen) {
                this.finishFilePicker();
                var thumbnailurl = this.settingService.getObject(Constants.PreferenceKeys.ThumbnailLastViewer);
                if (thumbnailurl && this._fileOpened && this._lastAttempedFile) {
                    if (this._visitedFiles.length > 0) {
                        this._visitedFiles.forEach(function (geomodel) {
                            if (geomodel.name == _this._lastAttempedFile.name) {
                                geomodel.thumbnail = thumbnailurl;
                            }
                        });
                        this.settingService.setObject("geovisited", this._visitedFiles);
                    }
                    this._lastAttempedFile.thumbnail = thumbnailurl;
                    var index = this._recentFiles.indexOf(this._lastAttempedFile);
                    if (index >= 0) {
                        this._recentFiles.splice(index, 1); // file is in recent list
                    }
                    else if (this._recentFiles.length == 5) {
                        this._recentFiles.splice(4, 1);
                    }
                    this.forceDigest(function () {
                        _this._recentFiles.unshift(_this._lastAttempedFile);
                        _this.settingService.setObject(Constants.PreferenceKeys.RecentFiles, _this._recentFiles);
                    });
                }
            }
        };
        HomeViewModel.prototype.onFSCreated = function () {
            var _this = this;
            this.forceDigest(function () {
                _this.fsInit = true;
                _this._currentDirectory = _this._filePickerWidget.currentDirectory;
                _this._filePickerLoading = false;
            });
        };
        Object.defineProperty(HomeViewModel.prototype, "samples", {
            get: function () {
                return this._sampleFiles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "recentFiles", {
            get: function () {
                return this._recentFiles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "recentFile", {
            get: function () {
                if (this._recentFiles.length > 0) {
                    return this._recentFiles[0];
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        HomeViewModel.prototype.openLegalContentView = function () {
            //TODO:L10N
            var ref = window.open(encodeURI("http://www.plm.automation.siemens.com/en_us/products/eula"), "_blank", "location=yes");
        };
        HomeViewModel.prototype.showBusyIndicator = function () {
            var _this = this;
            this.forceDigest(function () {
                _this._filePickerLoading = true;
                _this._isFilePickerOpen = true;
                _this._homePanelOpen = false;
            });
        };
        HomeViewModel.prototype.startOpenFileDialog = function () {
            this._isFilePickerOpen = true;
            this._homePanelOpen = false;
        };
        HomeViewModel.prototype.finishFilePicker = function () {
            this._filePickerLoading = false;
            this._isFilePickerOpen = false;
            this._homePanelOpen = true;
        };
        Object.defineProperty(HomeViewModel.prototype, "isRecentFileVisible", {
            get: function () {
                return this.recentFile != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "homePanelOpen", {
            get: function () {
                return this._homePanelOpen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "isFilePickerOpen", {
            get: function () {
                return this._isFilePickerOpen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "mapButtonVisible", {
            get: function () {
                return this._mapButtonVisible;
            },
            set: function (value) {
                if (value !== null && value != this._mapButtonVisible) {
                    this._mapButtonVisible = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "isMapViewOpen", {
            get: function () {
                return this._isMapViewOpen;
            },
            set: function (value) {
                if (value !== null && value != this._isMapViewOpen) {
                    this._isMapViewOpen = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "licensePanelOpen", {
            get: function () {
                return this._licensePanelOpen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "licensePanelTitle", {
            get: function () {
                return this._licensePanelTitle;
            },
            enumerable: true,
            configurable: true
        });
        HomeViewModel.prototype.setLicenseAccepted = function () {
            // set license flag  when license agreement is accepted
            this.settingService.setObject(Constants.Strings.LicenseFlag, true);
            this._licensePanelOpen = false;
            this._homePanelOpen = true;
        };
        HomeViewModel.prototype.setLicenseDeclined = function () {
            // exit app when license agreement is declined
            this.settingService.setObject(Constants.Strings.LicenseFlag, false);
            Helper.existJt2Go();
        };
        HomeViewModel.prototype.selectLastOpened = function () {
            if (this._recentFiles && this._recentFiles.length > 0) {
                this.goToMainPage(this._recentFiles[0]);
            }
        };
        HomeViewModel.prototype.selectRecent = function (fileItem) {
            if (!fileItem || !fileItem.modelPath) {
                return;
            }
            this._lastAttempedFile = fileItem;
            var index = this._recentFiles.indexOf(fileItem);
            if (index == 0) {
                this.selectLastOpened();
            }
            else {
                this.goToMainPage(fileItem);
            }
        };
        HomeViewModel.prototype.selectSample = function (fileItem) {
            if (!fileItem || !fileItem.modelPath) {
                return;
            }
            var items = this._recentFiles.filter(function (value, index, array) {
                if (fileItem.jtFilePath != undefined) {
                    return value.jtFilePath == fileItem.jtFilePath;
                }
                else {
                    return value.modelPath == fileItem.modelPath;
                }
            });
            if (items && items.length > 0) {
                //  there only should be one found from recent list 
                this.selectRecent(items[0]);
            }
            else {
                // make a copy of the selected file, so that the original file won't be polluted by the thumbnail change, Defect D-35539 
                this._lastAttempedFile = new NonJT.FileItem(fileItem.name, fileItem.modelPath, fileItem.jtFilePath);
                this.goToMainPage(this._lastAttempedFile);
            }
        };
        HomeViewModel.prototype.goToMainPage = function (fileItem) {
            var state = new Kernel.StateParams();
            state.modelPath = fileItem.modelPath;
            state.mode = Constants.Strings.Structure;
            state.pickerUsed = "false";
            if (fileItem.jtFilePath) {
                state.pickerUsed = "true";
                state.modelPath = this._localBodsDirectory;
                state.jtFilePath = fileItem.jtFilePath;
                state.loadAsBod = true;
                this.showBusyIndicator();
                // timeout thread to allow UI to refresh
                setTimeout(function () {
                    this.goTo(Constants.StateNames.Context, state);
                }.bind(this), 50);
            }
            else {
                this.goTo(Constants.StateNames.Context, state);
            }
            this._fileOpened = true;
            // clear last opened thumbnail since we are loading a new one
            this.settingService.setObject(Constants.PreferenceKeys.ThumbnailLastViewer, null);
        };
        HomeViewModel.prototype.setupLocalBodsDirectory = function () {
            var locaCacheDir;
            if (device.platform.indexOf("iOS") > -1) {
                locaCacheDir = cordova.file.documentsDirectory;
            }
            else if (device.platform.indexOf("Android") > -1) {
                locaCacheDir = cordova.file.externalCacheDirectory;
            }
            var thiz = this;
            window.resolveLocalFileSystemURL(locaCacheDir, function (cacheEntry) {
                cacheEntry.getDirectory(Constants.Strings.TempBodsDirectory, { create: true, exclusive: false }, function (dirEntry) {
                    thiz._localBodsDirectory = dirEntry.toURL().substring(7); // remove "file://" from native url
                    if (device.platform.indexOf("iOS") > -1) {
                        // register for ios notification center, to handle jt file association
                        var thiscopy = thiz;
                        var ios_succeeded = function (filepath) {
                            var trimmedPath = filepath.substring(filepath.lastIndexOf("/Inbox/"));
                            var fileName = trimmedPath.substring(7);
                            var jtFileItem = new NonJT.FileItem(fileName, fileName, trimmedPath);
                            thiscopy.selectSample(jtFileItem);
                        };
                        jt2bod.init(ios_succeeded, null);
                    }
                }, function (error) {
                    console.log("failed creating bods directory. ");
                });
            }, function (error) {
                console.log("failed resolving local cache directory. ");
            });
        };
        Object.defineProperty(HomeViewModel.prototype, "filePickerWidget", {
            get: function () {
                return this._filePickerWidget;
            },
            enumerable: true,
            configurable: true
        });
        //TODO, will need some clean up for the legacy loading local bod files logic.
        HomeViewModel.prototype.onFileContentsLoaded = function (loadedContents) {
            if (loadedContents == null) {
                alert("Please choose a plm_ps.json file.");
            }
            else {
            }
            this._filePickerLoading = false;
            this.finishFilePicker();
        };
        HomeViewModel.prototype.onFilePickerItemTapped = function (tappedItem) {
            this._filePickerLoading = true;
            if (tappedItem.fsType === NonJT.FileSystemObjectType.File) {
                // go to main-page with the picked jt file
                var inputFile = this.filePickerWidget.nativeurlPrefix + tappedItem.parent.fullPath + tappedItem.name;
                var jtFileItem = new NonJT.FileItem(tappedItem.name, tappedItem.name, inputFile);
                this.selectSample(jtFileItem);
            }
            else {
                var dir = tappedItem;
                if (dir) {
                    this.filePickerWidget.navInto(dir, this.onNavDownCallback);
                }
            }
        };
        HomeViewModel.prototype.onNavDone = function () {
            var _this = this;
            this.forceDigest(function () {
                _this._filePickerLoading = false;
                _this._currentDirectory = _this.filePickerWidget.currentDirectory;
            });
        };
        Object.defineProperty(HomeViewModel.prototype, "filePickerLoading", {
            get: function () {
                return this._filePickerLoading;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HomeViewModel.prototype, "currentDirectory", {
            get: function () {
                return this._currentDirectory;
            },
            enumerable: true,
            configurable: true
        });
        HomeViewModel.prototype.navUp = function () {
            this._filePickerLoading = true;
            this.filePickerWidget.navUp(this.onNavUpCallback);
        };
        HomeViewModel.prototype.loadFromIntent = function (Intent, timeout) {
            var model;
            if (Intent.data.substring(0, 4) == "file") {
                // selected a file local to the device
                var jtPath = Intent.data.substring(7);
                var jtName = Intent.data.substring(Intent.data.lastIndexOf("/") + 1);
                model = new NonJT.FileItem(jtName, jtName, jtPath);
                setTimeout(function () {
                    this.selectSample(model);
                }.bind(this), timeout);
            }
            else if (Intent.data.substring(0, 4) == "http") {
                // selected a file to download from the internet
                var fileTransfer = new FileTransfer;
                var downloadURL = encodeURI(Intent.data);
                var downloadName = Intent.data.substring(Intent.data.lastIndexOf("/") + 1);
                var fileURL = cordova.file.externalDataDirectory + downloadName;
                fileTransfer.download(downloadURL, fileURL, function (entry) {
                    //on download success
                    model = new NonJT.FileItem(downloadName, downloadName, fileURL.substring(7));
                    setTimeout(function () {
                        this.selectSample(model);
                    }.bind(this), timeout);
                }.bind(this), function (error) {
                    // on download failure
                    this.displayAlert("downloadFailText");
                }.bind(this));
            }
        };
        Object.defineProperty(HomeViewModel.prototype, "downloadFailText", {
            get: function () {
                return this._downloadFailText;
            },
            enumerable: true,
            configurable: true
        });
        //This method allows you to display a localized string in the native Alert window
        HomeViewModel.prototype.displayAlert = function (elementID) {
            alert(document.getElementById(elementID).innerText);
        };
        return HomeViewModel;
    })(Kernel.ViewModelBase);
    exports.HomeViewModel = HomeViewModel;
});
//# sourceMappingURL=HomeViewModel.js.map