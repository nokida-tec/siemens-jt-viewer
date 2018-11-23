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
define(["require", "exports", "scripts/app/Kernel"], function (require, exports, Kernel) {
    var MapViewModel = (function (_super) {
        __extends(MapViewModel, _super);
        function MapViewModel(mainViewModel, viewerViewModel) {
            _super.call(this);
            this.mainViewModel = mainViewModel;
            this.viewerViewModel = viewerViewModel;
            this.map = null;
            this.storage = window.localStorage;
            this.visited = [];
            this.geoFenceList = [];
            this.circles = [];
            this.currentId = 0;
            this.uniqueId = function () {
                return ++this.currentId;
            };
            document.addEventListener("deviceready", this.onDeviceReady);
        }
        MapViewModel.prototype.onDeviceReady = function () {
            /*window.geofence.initialize().then(function () {
                console.log("Successful initialization");
                window.geofence.addOrUpdate({
                    id: "EnableMapButton",
                    latitude: 40.813072,
                    longitude: -77.827531,
                    radius: 10000,
                    transitionType: TransitionType.BOTH,
                    notification: {
                        id: 1,
                        title: "Welcome to Redmond",
                        text: "You can now enable JTFile Hunt Mode.",
                        openAppOnClick: true
                    }
                }).then(function () {
                    console.log('Geofence successfully added');
                }, function (reason) {
                    console.log('Adding geofence failed', reason);
                });
            }, function (error) {
                console.log("Error", error);
            });
            
    
            window.geofence.onTransitionReceived = function (geofences) {
                geofences.forEach(function (geo) {
                    alert('Geofence transition detected ' + geo.id);
                    for (var i = 0; i < this.circles.length; i++) {
                        if (this.circles[i].key == geo.id) {
                            this.circles[i].circle.remove();
                            break;
                        }
                    }
                });
            };*/
        };
        MapViewModel.prototype.onMapInit = function (map) {
            //map.showDialog();
            var onMapWatchSuccess = function (position) {
                console.log("mapinit watchPosition success");
                var userLocation = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //map.clear();
                map.addMarker({
                    'position': userLocation,
                    'title': "Me"
                }, function (marker) {
                    marker.showInfoWindow();
                });
            };
            var onSuccess = function (position) {
                console.log("mapinit  getCurrentPosition success");
                var userLocation = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.animateCamera({
                    'target': userLocation,
                    'tilt': 60,
                    'zoom': 18,
                    'bearing': 140
                });
                map.addMarker({
                    'position': userLocation,
                    'title': "Me"
                }, function (marker) {
                    marker.showInfoWindow();
                });
                this.addGeoFenceMarkers();
            };
            function onError(error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }
            ;
            // onError Callback receives a PositionError object
            //
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
            navigator.geolocation.watchPosition(onMapWatchSuccess, onError, { enableHighAccuracy: true });
        };
        MapViewModel.prototype.onBtnClicked = function () {
            this.map.showDialog();
        };
        MapViewModel.prototype.newGeoFence = function (id, lat, lng) {
            var newGeo = {
                id: String(id),
                latitude: lat,
                longitude: lng,
                radius: 50,
                transitionType: TransitionType.ENTER,
                notification: {
                    id: id,
                    title: "entered geofence " + String(id),
                    text: "PLUS 5 POINTS",
                    openAppOnClick: true
                }
            };
            this.geoFenceList.push(newGeo);
            return newGeo;
        };
        MapViewModel.prototype.addGeoFenceMarkers = function () {
            this.geoFenceList.forEach(function (geoObj) {
                var geoLocation = new plugin.google.maps.LatLng(geoObj.latitude, geoObj.longitude);
                this.map.addMarker({
                    'position': geoLocation,
                    'title': geoObj.id
                }, function (marker) {
                    marker.showInfoWindow();
                });
                this.map.addCircle({
                    'center': geoLocation,
                    'radius': 50,
                    'strokeColor': '#16a085',
                    'strokeWidth': 5,
                    'fillColor': '#bcf6e9'
                }, function (circle) {
                    this.circles.push({
                        key: geoObj.id,
                        circle: circle
                    });
                });
            });
        };
        MapViewModel.prototype.toggleMapView = function () {
            /*
            var view = $("#outerMapView");
    
            if (this.isMapViewOpen == false) {
                this.isMapViewOpen = !this.isMapViewOpen;
                this.homePanelOpen = !this.homePanelOpen;
    
                view.fadeTo("slow", 1);
                $("#mapContainer").css('height', window.innerHeight - 50 + "px");
                $("#mapContainer").css('width', window.innerWidth + "px");
    
                if (this.map == null) {
                    var div = $("#mapContainer");
                    this.map = plugin.google.maps.Map.getMap();
                    this.map.addEventListener(plugin.google.maps.event.MAP_READY, this.onMapInit);
                    this.map.setDiv(div);
                    this.map.clear();
                }
    
            }
            else {
                this.isMapViewOpen = !this.isMapViewOpen;
                this.homePanelOpen = !this.homePanelOpen;
            }*/
        };
        return MapViewModel;
    })(Kernel.ViewModelBase);
    exports.MapViewModel = MapViewModel;
});
//# sourceMappingURL=MapViewModel.js.map