// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../../typings/cordova/plugins/FileSystem.d.ts"/>
/// <reference path="../../typings/cordova/cordova.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function (require, exports) {
    var LanguageItem = (function () {
        function LanguageItem(_languageTag, _displayName) {
            this._languageTag = _languageTag;
            this._displayName = _displayName;
        }
        Object.defineProperty(LanguageItem.prototype, "displayName", {
            get: function () {
                return this._displayName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LanguageItem.prototype, "languageTag", {
            get: function () {
                return this._languageTag;
            },
            enumerable: true,
            configurable: true
        });
        return LanguageItem;
    })();
    exports.LanguageItem = LanguageItem;
    (function (ViewType) {
        ViewType[ViewType["Orthographic"] = 0] = "Orthographic";
        ViewType[ViewType["Perspective"] = 1] = "Perspective";
    })(exports.ViewType || (exports.ViewType = {}));
    var ViewType = exports.ViewType;
    (function (GestureMode) {
        GestureMode[GestureMode["Pan"] = 0] = "Pan";
        GestureMode[GestureMode["Rotate"] = 1] = "Rotate";
    })(exports.GestureMode || (exports.GestureMode = {}));
    var GestureMode = exports.GestureMode;
    (function (FileSystemObjectType) {
        FileSystemObjectType[FileSystemObjectType["File"] = 0] = "File";
        FileSystemObjectType[FileSystemObjectType["Folder"] = 1] = "Folder";
    })(exports.FileSystemObjectType || (exports.FileSystemObjectType = {}));
    var FileSystemObjectType = exports.FileSystemObjectType;
    var FileItem = (function () {
        function FileItem(name, modelPath, jtFilePath) {
            this.name = name;
            this.modelPath = modelPath;
            this.jtFilePath = jtFilePath;
            if (jtFilePath === undefined) {
                this.thumbnail = modelPath + ".png";
            }
        }
        return FileItem;
    })();
    exports.FileItem = FileItem;
    var FileSystemObject = (function () {
        function FileSystemObject(name, fsType, mirrorEntry) {
            this._parent = null;
            this._parentEntry = null;
            this._mirrorEntry = null;
            this._name = name;
            this._type = fsType;
            this._mirrorEntry = mirrorEntry;
        }
        Object.defineProperty(FileSystemObject.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemObject.prototype, "fsType", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemObject.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (val) {
                if (val != this._parent) {
                    this._parent = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemObject.prototype, "entry", {
            get: function () {
                return this._mirrorEntry;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileSystemObject.prototype, "parentEntry", {
            get: function () {
                return this._parentEntry;
            },
            set: function (val) {
                if (val != this._parentEntry) {
                    this._parentEntry = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        return FileSystemObject;
    })();
    exports.FileSystemObject = FileSystemObject;
    var FilePickerDirectory = (function (_super) {
        __extends(FilePickerDirectory, _super);
        function FilePickerDirectory(name, mirrorEntry, subDirectories, files) {
            _super.call(this, name, FileSystemObjectType.Folder, mirrorEntry);
            this._subDirectories = [];
            this._files = [];
            this._hasBeenProcessed = false;
            this._subEntries = [];
            if (subDirectories) {
                this._subDirectories = subDirectories;
            }
            if (files) {
                this._files = files;
            }
        }
        Object.defineProperty(FilePickerDirectory.prototype, "hasBeenProcessed", {
            get: function () {
                return this._hasBeenProcessed;
            },
            set: function (val) {
                this._hasBeenProcessed = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerDirectory.prototype, "fullPath", {
            get: function () {
                return this._fullPath;
            },
            set: function (val) {
                this._fullPath = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerDirectory.prototype, "subEntries", {
            get: function () {
                return this._subEntries;
            },
            set: function (val) {
                this._subEntries = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerDirectory.prototype, "subDirectories", {
            get: function () {
                return this._subDirectories;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerDirectory.prototype, "files", {
            get: function () {
                return this._files;
            },
            enumerable: true,
            configurable: true
        });
        FilePickerDirectory.prototype.addFile = function (newFile, newEntry) {
            newFile.parent = this;
            if (newEntry) {
                newFile.parentEntry = this._mirrorEntry;
            }
            this._files.push(newFile);
        };
        FilePickerDirectory.prototype.addFolder = function (newFolder, newEntry) {
            newFolder.parent = this;
            if (newEntry) {
                newFolder.parentEntry = this._mirrorEntry;
                this.subEntries.push(newEntry);
            }
            this._subDirectories.push(newFolder);
        };
        /*
         * args - string - the name of the file
         * returns - FilePickerFile - the current file
        */
        FilePickerDirectory.prototype.getFileByName = function (name) {
            for (var idx = 0; idx < this._files.length; idx++) {
                var currentFile = this._files[idx];
                if (currentFile.name === name) {
                    return currentFile;
                }
            }
            return null;
        };
        return FilePickerDirectory;
    })(FileSystemObject);
    exports.FilePickerDirectory = FilePickerDirectory;
    var FilePickerFactory = (function () {
        function FilePickerFactory() {
        }
        FilePickerFactory.prototype.getInstance = function () {
            var returned;
            returned = new FilePickerWidgetImpl();
            return returned;
        };
        return FilePickerFactory;
    })();
    exports.FilePickerFactory = FilePickerFactory;
    var FilePickerWidgetImpl = (function () {
        function FilePickerWidgetImpl(current) {
            var _this = this;
            this._isLoading = false;
            this._pendingCallback = null;
            this._pendingLoadCallback = null;
            this._unprocessedFileCount = 0;
            this._unprocessedBodCount = 0;
            this._nativeurlPrefix = "";
            if (current) {
                this._currentDirectory = current;
            }
            this.onGotRootCallback = function (entry) {
                _this.onResolveEntry.apply(_this, [entry]);
            };
            this.onGotEntriesCallback = function (entries) {
                _this.onResolveEntries.apply(_this, [entries]);
            };
            this.onMetaDataExtracted = function (metadata) {
                _this.onResolveMetadata.apply(_this, [metadata]);
            };
            this.onMetaDataFailed = function (error) {
                _this.onResolveMetadata.apply(_this, [null]);
            };
            this.onBodLoadedCallback = function (bodData, propertiesCallback, pmiCallback) {
                _this.onBodLoaded.apply(_this, [bodData, propertiesCallback, pmiCallback]);
            };
            this.onJsonLoadedCallback = function (jsonData) {
                _this.onPSJsonLoaded.apply(_this, [jsonData]);
            };
            this.onPropertiesLoadedCallback = function (propertiesData, pmiCallback) {
                _this.onPropertiesLoaded.apply(_this, [propertiesData, pmiCallback]);
            };
            this.onPmiLoadedCallback = function (pmiData) {
                _this.onPmiLoaded.apply(_this, [pmiData]);
            };
            this.onPmiBodLoadedCallback = function (pmiBodData) {
                _this.onPmiBodLoaded.apply(_this, [pmiBodData]);
            };
        }
        FilePickerWidgetImpl.prototype.pickFileInternal = function (entry, jsonLoadedCallback) {
            if (entry.name != "plm_ps.json") {
                var cb = this._pendingLoadCallback;
                this._pendingLoadCallback = null;
                cb(null);
            }
            entry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    jsonLoadedCallback(this.result);
                };
                //json file should be read as text
                reader.readAsText(file);
            });
        };
        FilePickerWidgetImpl.prototype.pickFile = function (obj, callback) {
            //grab the fileEntry
            this._pendingLoadCallback = callback;
            var entry;
            entry = obj.entry;
            this.pickFileInternal(entry, this.onJsonLoadedCallback);
        };
        FilePickerWidgetImpl.prototype.setupFileRefCount = function (psObject) {
            if (psObject) {
                if (psObject.fileRef) {
                    this._unprocessedBodCount++;
                }
                if (psObject.children && (psObject.children.length > 0)) {
                    for (var idx = 0; idx < psObject.children.length; idx++) {
                        this.setupFileRefCount(psObject.children[idx]);
                    }
                }
            }
        };
        FilePickerWidgetImpl.prototype.parsePSTree = function (psObject, root) {
            // recursive function that finds every leaf and reads the contents of the file with the same name as the value of "fileRef" 
            if (psObject) {
                if (psObject.fileRef) {
                    // let's keep all file reading ops in filePickerWidget
                    // async, so ensure that callbacks are nested correctly:
                    this.loadBod(psObject, root, this.onBodLoadedCallback, this.onPropertiesLoadedCallback, this.onPmiLoadedCallback);
                }
                if (psObject.children && (psObject.children.length > 0)) {
                    for (var idx = 0; idx < psObject.children.length; idx++) {
                        this.parsePSTree(psObject.children[idx], root);
                    }
                }
            }
        };
        FilePickerWidgetImpl.prototype.onPSJsonLoaded = function (jsonContents) {
            var productStructureObject = JSON.parse(jsonContents);
            var root = productStructureObject;
            // parse PS tree
            this.setupFileRefCount(productStructureObject);
            this.parsePSTree(productStructureObject, root);
        };
        FilePickerWidgetImpl.prototype.onPropertiesLoaded = function (root, pmiLoadedCallback) {
            // attempt to start reading pmi
            var pmiFile = this._currentDirectory.getFileByName("plm_pmi.json");
            if (pmiFile !== null) {
                root.hasPmi = true;
                var entry;
                entry = pmiFile.entry;
                entry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        //process the string
                        root.pmiTree = JSON.parse(this.result);
                        //callback for scoping purposes
                        pmiLoadedCallback(root);
                    };
                    //bod file should be read as base64
                    reader.readAsText(file);
                });
            }
            else {
                root.hasPmi = false;
                var cb = this._pendingLoadCallback;
                this._pendingLoadCallback = null;
                cb(root);
            }
        };
        FilePickerWidgetImpl.prototype.onPmiLoaded = function (root) {
            if (root) {
                var psRoot = root;
                var pmiTreeRoot = psRoot.pmiTree;
                // parse pmi tree
                this.setupFileRefCount(pmiTreeRoot);
                this.parsePmiTree(pmiTreeRoot, psRoot);
            }
        };
        FilePickerWidgetImpl.prototype.parsePmiTree = function (pmiObject, psRoot) {
            // recursive function that finds every leaf and reads the contents of the file with the same name as the value of "fileRef" 
            if (pmiObject) {
                if (pmiObject.fileRef) {
                    // let's keep all file reading ops in filePickerWidget
                    // async, so ensure that callbacks are nested correctly:
                    this.loadPmiBod(pmiObject, psRoot, this.onPmiBodLoadedCallback);
                }
                if (pmiObject.children && (pmiObject.children.length > 0)) {
                    for (var idx = 0; idx < pmiObject.children.length; idx++) {
                        this.parsePmiTree(pmiObject.children[idx], psRoot);
                    }
                }
            }
        };
        FilePickerWidgetImpl.prototype.loadPmiBod = function (obj, root, pmiBodLoadedCallback) {
            var fileName = obj.fileRef;
            if (fileName) {
                var bodFile = this._currentDirectory.getFileByName(fileName);
                var entry;
                entry = bodFile.entry;
                entry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        //process the string
                        var rawb64data = this.result.split("base64,")[1];
                        //decode as string so JSON object can be passed through angular UI routing
                        obj.pmiData = rawb64data;
                        // remove fileref otherwise viewer._loadProductStructure won't work
                        delete obj.fileRef;
                        //check if we are finished processing using proper scope
                        pmiBodLoadedCallback(root);
                    };
                    //bod file should be read as base64
                    reader.readAsDataURL(file);
                });
            }
        };
        FilePickerWidgetImpl.prototype.onPmiBodLoaded = function (root) {
            this._unprocessedBodCount--;
            if (this._unprocessedBodCount <= 0) {
                var tempCallback = this._pendingLoadCallback;
                this._pendingLoadCallback = null;
                tempCallback(root);
            }
        };
        FilePickerWidgetImpl.prototype.onBodLoaded = function (root, propertiesLoadedCallback, pmiCallback) {
            this._unprocessedBodCount--;
            if (this._unprocessedBodCount <= 0) {
                // do this later - load properties
                var propertiesFile = this._currentDirectory.getFileByName("plm_properties.json");
                if (propertiesFile) {
                    var entry;
                    entry = propertiesFile.entry;
                    entry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (e) {
                            //process the string
                            root.properties = this.result;
                            //callback for scoping purposes
                            propertiesLoadedCallback(root, pmiCallback);
                        };
                        //bod file should be read as base64
                        reader.readAsText(file);
                    });
                }
                else {
                    var tempCallback = this._pendingLoadCallback;
                    this._pendingLoadCallback = null;
                    tempCallback(root);
                }
            }
        };
        FilePickerWidgetImpl.prototype.loadBod = function (obj, root, bodLoadedCallback, /*nested cb (level 3)*/ propertiesLoadedCallback, pmiLoadedCallback) {
            var fileName = obj.fileRef;
            if (fileName) {
                var bodFile = this._currentDirectory.getFileByName(fileName);
                var entry;
                entry = bodFile.entry;
                entry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        //process the string
                        var rawb64data = this.result.split("base64,")[1];
                        //decode as string so JSON object can be passed through angular UI routing
                        obj.b64data = rawb64data;
                        // remove fileref otherwise viewer._loadProductStructure won't work
                        delete obj.fileRef;
                        //check if we are finished processing using proper scope
                        bodLoadedCallback(root, propertiesLoadedCallback, pmiLoadedCallback);
                    };
                    //bod file should be read as base64
                    reader.readAsDataURL(file);
                });
            }
        };
        FilePickerWidgetImpl.prototype.navUp = function (callback) {
            if (this.currentDirectory.parent) {
                this.currentDirectory = this.currentDirectory.parent;
            }
            callback();
        };
        FilePickerWidgetImpl.prototype.navInto = function (target, callback) {
            this.isLoading = true;
            this.currentDirectory = target;
            // get the subdirectory entry.
            if (target.hasBeenProcessed) {
                this.isLoading = false;
                callback();
            }
            else {
                this._pendingCallback = callback;
                // get the entry associated with the target
                var targetEntry = target.entry;
                if (targetEntry) {
                    //process the entry.
                    var reader = targetEntry.createReader();
                    if (reader) {
                        reader.readEntries(this.onGotEntriesCallback);
                    }
                }
            }
        };
        Object.defineProperty(FilePickerWidgetImpl.prototype, "currentDirectory", {
            get: function () {
                return this._currentDirectory;
            },
            set: function (val) {
                if (val != this._currentDirectory) {
                    this._currentDirectory = val;
                }
                ;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerWidgetImpl.prototype, "isLoading", {
            get: function () {
                return this._isLoading;
            },
            set: function (val) {
                this._isLoading = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerWidgetImpl.prototype, "nativeurlPrefix", {
            get: function () {
                return this._nativeurlPrefix;
            },
            enumerable: true,
            configurable: true
        });
        FilePickerWidgetImpl.prototype.onResolveEntry = function (entry) {
            if (entry) {
                if (device.platform) {
                    var platformStr = device.platform;
                    if (platformStr.indexOf("Android") > -1) {
                        this._nativeurlPrefix = entry.toURL().substring(7); // remove "file://" from native url
                        var lastIndex = this._nativeurlPrefix.lastIndexOf("/");
                        this._nativeurlPrefix = this._nativeurlPrefix.substring(0, lastIndex);
                    }
                    this.currentDirectory = this.convertDirectoryEntryToNode(entry);
                    var reader = entry.createReader();
                    if (reader) {
                        reader.readEntries(this.onGotEntriesCallback, function () { console.log("failed to resolve file system directory entries."); });
                    }
                }
            }
        };
        FilePickerWidgetImpl.prototype.onResolveEntries = function (entries) {
            // get this in scope
            // extract subdirectories
            var subDirectories = entries.filter(this.isDirectory);
            // add subdirectories
            for (var idx1 = 0; idx1 < subDirectories.length; idx1++) {
                var subNode = this.convertDirectoryEntryToNode(subDirectories[idx1]);
                this.currentDirectory.addFolder(subNode, subDirectories[idx1]);
            }
            // extract subfiles
            var files = entries.filter(this.isFile);
            var fileNodes = files.map(this.convertFileEntryToUnprocessedNode);
            this._unprocessedFileCount = fileNodes.length;
            for (var idx3 = 0; idx3 < fileNodes.length; idx3++) {
                this.currentDirectory.addFile(fileNodes[idx3]);
            }
            // begin synchronous chain of processing files
            this.processFiles();
        };
        FilePickerWidgetImpl.prototype.processFiles = function () {
            if (this._unprocessedFileCount > 0) {
                this.currentDirectory.files[this._unprocessedFileCount - 1].entry.getMetadata(this.onMetaDataExtracted, this.onMetaDataFailed);
            }
            else {
                this.currentDirectory.hasBeenProcessed = true;
                this.isLoading = false;
                // if there is a pending callback, trigger it now
                if (this._pendingCallback) {
                    var toCall = this._pendingCallback;
                    this._pendingCallback = null;
                    toCall();
                }
            }
        };
        FilePickerWidgetImpl.prototype.constructFileSystem = function (callback) {
            this.isLoading = true;
            this._pendingCallback = callback;
            var directory;
            if (device.platform) {
                var platformStr = device.platform;
                if (platformStr.indexOf("iOS") > -1) {
                    // use documents directory
                    directory = cordova.file.documentsDirectory;
                }
                else {
                    directory = cordova.file.externalRootDirectory;
                }
            }
            if (directory) {
                window.resolveLocalFileSystemURL.apply(this, [directory, this.onGotRootCallback]);
            }
        };
        FilePickerWidgetImpl.prototype.isDirectory = function (value) {
            return value.isDirectory;
        };
        FilePickerWidgetImpl.prototype.isFile = function (value) {
            return value.isFile;
        };
        FilePickerWidgetImpl.prototype.convertFileEntryToUnprocessedNode = function (entry) {
            return new FilePickerFile(entry.name, 0, entry);
        };
        FilePickerWidgetImpl.prototype.onResolveMetadata = function (metadata) {
            if (this._unprocessedFileCount && this.currentDirectory.files[this._unprocessedFileCount - 1]) {
                var mysize = (metadata == null || metadata.size == null) ? 0 : metadata.size; // set size to zero if failed to read metadata
                this.currentDirectory.files[this._unprocessedFileCount - 1].size = mysize;
                this._unprocessedFileCount--;
                this.processFiles();
            }
        };
        FilePickerWidgetImpl.prototype.convertDirectoryEntryToNode = function (entry) {
            var returned = new FilePickerDirectory(entry.name, entry);
            returned.fullPath = entry.fullPath;
            return returned;
        };
        return FilePickerWidgetImpl;
    })();
    exports.FilePickerWidgetImpl = FilePickerWidgetImpl;
    var FilePickerFile = (function (_super) {
        __extends(FilePickerFile, _super);
        function FilePickerFile(name, size, mirrorEntry) {
            _super.call(this, name, FileSystemObjectType.File, mirrorEntry);
            this._size = size;
        }
        Object.defineProperty(FilePickerFile.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (val) {
                if (this._size != val) {
                    this._size = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerFile.prototype, "extension", {
            /*File name extension*/
            get: function () {
                var fileNameParts = this.name.split(".");
                if (fileNameParts.length > 1) {
                    return fileNameParts[fileNameParts.length - 1];
                }
                else {
                    return "";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerFile.prototype, "displaySize", {
            /*Size string for usage by the View*/
            get: function () {
                var convertedString;
                if (this.size > 1000 && this.size < 1000000) {
                    convertedString = (this.size / 1000).toPrecision(4).toString() + " KB";
                }
                else if (this.size >= 1000000) {
                    convertedString = (this.size / 1000000).toPrecision(4).toString() + " MB";
                }
                else {
                    convertedString = (this.size / 1000).toPrecision(3).toString() + " KB";
                }
                return convertedString;
            },
            enumerable: true,
            configurable: true
        });
        return FilePickerFile;
    })(FileSystemObject);
    exports.FilePickerFile = FilePickerFile;
    /* end section file system */
    var TabItem = (function () {
        function TabItem(name, modelPath) {
            this._name = name;
            this._modelPath = modelPath;
        }
        Object.defineProperty(TabItem.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabItem.prototype, "thumbnail", {
            get: function () {
                return this._modelPath + ".png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabItem.prototype, "modelPath", {
            get: function () {
                return this._modelPath;
            },
            enumerable: true,
            configurable: true
        });
        return TabItem;
    })();
    exports.TabItem = TabItem;
    var AppBarItem = (function () {
        function AppBarItem(name, iconString, tooltip, command, isEnabled, items) {
            if (isEnabled === void 0) { isEnabled = true; }
            this._name = name;
            this._command = command;
            this._items = items;
            this._isEnabled = isEnabled;
            this._png = iconString;
            this._tooltip = tooltip;
        }
        Object.defineProperty(AppBarItem.prototype, "isEnabled", {
            get: function () {
                return this._isEnabled;
            },
            set: function (val) {
                if (this._isEnabled != val) {
                    this._isEnabled = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppBarItem.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (val) {
                if (this._name != val) {
                    this._name = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppBarItem.prototype, "png", {
            get: function () {
                return this._png;
            },
            set: function (val) {
                if (this._png != val) {
                    this._png = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppBarItem.prototype, "tooltip", {
            get: function () {
                return this._tooltip;
            },
            set: function (val) {
                if (this._tooltip != val) {
                    this._tooltip = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppBarItem.prototype, "items", {
            get: function () {
                return this._items;
            },
            enumerable: true,
            configurable: true
        });
        AppBarItem.prototype.executeCommand = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (this._command && this._isEnabled) {
                return this._command(this, args);
            }
        };
        return AppBarItem;
    })();
    exports.AppBarItem = AppBarItem;
});
//# sourceMappingURL=NonJT.js.map