// @<COPYRIGHT>@
// ==================================================
// Copyright 2015.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui/angular-ui-router.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "scripts/app/Constants"], function (require, exports, Constants) {
    var StateParams = (function () {
        function StateParams() {
        }
        return StateParams;
    })();
    exports.StateParams = StateParams;
    (function (RestrictType) {
        RestrictType[RestrictType["Attribute"] = 0] = "Attribute";
        RestrictType[RestrictType["Element"] = 1] = "Element";
        RestrictType[RestrictType["Class"] = 2] = "Class";
        RestrictType[RestrictType["Comment"] = 3] = "Comment";
    })(exports.RestrictType || (exports.RestrictType = {}));
    var RestrictType = exports.RestrictType;
    var DirectiveBase = (function () {
        function DirectiveBase(names, restrict, transclude, replace, template, scope) {
            this._names = names;
            this._restrict = restrict;
            this._transclude = transclude;
            this._replace = replace;
            this._template = template;
            this._scope = scope;
        }
        Object.defineProperty(DirectiveBase.prototype, "names", {
            get: function () {
                return this._names;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveBase.prototype, "restrict", {
            get: function () {
                return this._restrict;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveBase.prototype, "transclude", {
            get: function () {
                return this._transclude;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveBase.prototype, "replace", {
            get: function () {
                return this._replace;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveBase.prototype, "template", {
            get: function () {
                return this._template;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveBase.prototype, "scope", {
            get: function () {
                return this._scope;
            },
            enumerable: true,
            configurable: true
        });
        DirectiveBase.prototype.link = function ($injector, scope, elm, attrs) {
        };
        return DirectiveBase;
    })();
    exports.DirectiveBase = DirectiveBase;
    /** Base class for view model. */
    var ViewModelBase = (function () {
        function ViewModelBase() {
        }
        Object.defineProperty(ViewModelBase.prototype, "injector", {
            get: function () {
                return this._injector;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Initialize the view model..
         *
         * @param $scope The angular scope.
         * @param $injector The angular dependency injector.
         */
        ViewModelBase.prototype.init = function ($scope, $state, $injector) {
            $scope.vm = this;
            var $parent;
            this._state = $state;
            this._rootScope = $scope.$root;
            this._messenger = $injector.get("messenger");
            this._injector = $injector;
            var p = $scope.$parent;
            while (p && p.vm == this) {
                p = p.$parent;
            }
            if (p) {
                this._parent = p.vm;
            }
        };
        Object.defineProperty(ViewModelBase.prototype, "parent", {
            /** Gets the parent view model. */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewModelBase.prototype, "isActive", {
            /** Gets a value indicating if the current view is active. */
            get: function () {
                return this._isActive;
            },
            enumerable: true,
            configurable: true
        });
        /** Activate the view model. */
        ViewModelBase.prototype.activate = function (params) {
            if (!this.isActive) {
                this._isActive = true;
                this.onActivated();
            }
            this.onStateChanged(params);
        };
        /** Deactivate the view model. */
        ViewModelBase.prototype.deactivate = function () {
            this._isActive = false;
            if (this._watchList) {
                for (var i = 0; i < this._watchList.length; i++) {
                    var item = this._watchList[i];
                    if (item) {
                    }
                }
                this._watchList = [];
            }
            if (this._handlerRegs) {
                for (var i = 0; i < this._handlerRegs.length; i++) {
                    var reg = this._handlerRegs[i];
                    if (reg) {
                        reg.unregister();
                    }
                }
                this._handlerRegs = [];
            }
            this.onDeactivated();
        };
        /** Sends the message. */
        ViewModelBase.prototype.sendMessage = function (msg) {
            this._messenger.send(msg);
        };
        /** Subscribes to property change event. */
        ViewModelBase.prototype.onPropertyChanged = function (property, handler) {
            var func = this._rootScope.$watch(property, handler);
            if (!this._watchList) {
                this._watchList = [];
            }
            this._watchList.push(func);
        };
        /** Sets a value using property setter function. */
        ViewModelBase.prototype.setProperty = function (propSetter) {
            if (this._rootScope) {
                this._rootScope.$apply(propSetter);
            }
        };
        ViewModelBase.prototype.apply = function (callback) {
            if (this._rootScope) {
                this._rootScope.$apply(callback);
            }
        };
        ViewModelBase.prototype.forceDigest = function (callback) {
            if (this._rootScope) {
                this._rootScope.$evalAsync(callback);
            }
        };
        /** Subscribe to a specified message. */
        ViewModelBase.prototype.onMessage = function (type, handler) {
            var token = this._messenger.subscribe(type, handler);
            if (!this._handlerRegs) {
                this._handlerRegs = [];
            }
            this._handlerRegs.push(token);
        };
        /**  Invoked when the current view model is activated. */
        ViewModelBase.prototype.onActivated = function () {
        };
        ViewModelBase.prototype.onStateChanged = function (params) {
        };
        ViewModelBase.prototype.goTo = function (stateName, params) {
            if (this._state) {
                this._state.go(stateName, params);
            }
        };
        /**  Invoked when the current view model is deactivated. */
        ViewModelBase.prototype.onDeactivated = function () {
        };
        return ViewModelBase;
    })();
    exports.ViewModelBase = ViewModelBase;
    /**
     * Base class for module.
     *
     */
    var ModuleBase = (function () {
        /**
         * Creates an instance of ModuleBase.
         *
         * @constructor
         * @param modName The module name.
         */
        function ModuleBase(modName) {
            this.ngModule = angular.module(modName, ["ui.router", "ui.bootstrap", "ngAnimate", "ngTouch", "hmTouchEvents", "pascalprecht.translate"]);
        }
        Object.defineProperty(ModuleBase.prototype, "name", {
            /**
             * Gets module name.
             *
             */
            get: function () {
                return this.ngModule.name;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the underlying angular module.
         *
         * @param rootElement the Root HTML element which will be annotated as ng-app.
         */
        ModuleBase.prototype.start = function (rootElement) {
            this.element = rootElement;
            this.startCore();
        };
        /**
         * Kernel module start up logic.
         * Modules could override this method to boostrap themselves.
         *
         */
        ModuleBase.prototype.startCore = function () {
        };
        Object.defineProperty(ModuleBase.prototype, "module", {
            /**
             * Gets the underlying angular module.
             *
             */
            get: function () {
                return this.ngModule;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Wire up the view and view model.
         *
         * @param viewName The name of the view.
         * @vm The constructor definition of the view model.
         */
        ModuleBase.prototype.wireUp = function (viewName, vm, subViews) {
            var vName = viewName[0].toLowerCase() + viewName.substr(1, viewName.length - 1);
            var controllerName = vName + "Controller";
            var viewModelName = vName + "Model";
            var viewLocation = Constants.Strings.ModuleBaseUri + this.ngModule.name + "/" + viewName + ".html";
            return this.controller(controllerName, viewModelName)
                .service(viewModelName, vm)
                .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
                    if (!subViews) {
                        $stateProvider.state(viewName, { url: "/" + viewName, templateUrl: viewLocation, controller: controllerName });
                    }
                    else {
                        $stateProvider.state(viewName, { url: "/" + viewName, templateUrl: viewLocation, controller: controllerName, views: subViews });
                    }
                }]);
        };
        /**
         * Creates controller to wire up view and view model.
         *
         */
        ModuleBase.prototype.controller = function (controllerName, viewModelName) {
            var _this = this;
            return this.ngModule.controller(controllerName, ["$scope", "$state", "$stateParams", viewModelName,
                function ($scope, $state, $stateParams, viewModel) {
                    var $injector = angular.element(_this.element).injector();
                    viewModel.init($scope, $state, $injector);
                    viewModel.activate($stateParams);
                    $scope.$on("$destroy", function (evt) {
                        var vm;
                        vm = evt.currentScope.vm;
                        if (vm) {
                            vm.deactivate();
                        }
                    });
                }]);
        };
        ModuleBase.prototype.directive = function (directive) {
            var _this = this;
            directive.names.forEach(function (item) {
                _this.module.directive(item, ["$injector", function ($injector) {
                        return {
                            restrict: _this.getRestrict(directive.restrict),
                            transclude: directive.transclude,
                            scope: directive.scope,
                            replace: directive.replace,
                            link: function (scope, elm, attrs) {
                                directive.link($injector, scope, elm, attrs);
                            }
                        };
                    }]);
            });
        };
        ModuleBase.prototype.getRestrict = function (type) {
            switch (type) {
                case RestrictType.Element:
                    return "E";
                case RestrictType.Class:
                    return "C";
                case RestrictType.Comment:
                    return "M";
                case RestrictType.Attribute:
                default:
                    return "A";
            }
        };
        return ModuleBase;
    })();
    exports.ModuleBase = ModuleBase;
    /**
     * Module container for children modules.
     *
     */
    var CompositeModule = (function () {
        /**
         * Creates an instance of ModuleBase.
         *
         * @constructor
         * @param modName The module name.
         */
        function CompositeModule(modName) {
            this.modName = modName;
            this.mods = [];
        }
        Object.defineProperty(CompositeModule.prototype, "name", {
            /**
             * Gets module name.
             *
             */
            get: function () {
                return this.modName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompositeModule.prototype, "module", {
            /**
             * Gets the underlying angular module.
             *
             */
            get: function () {
                return this.ngModule;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Add modules to the composite module parent.
         *
         * @param childMods The children modules.
         */
        CompositeModule.prototype.addModules = function () {
            var childMods = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                childMods[_i - 0] = arguments[_i];
            }
            if (childMods != null) {
                var length = childMods.length;
                for (var i = 0; i < length; i++) {
                    this.mods.push(childMods[i]);
                }
            }
        };
        /**
         * Gets the underlying angular module.
         *
         * @param rootElement the Root HTML element which will be annotated as ng-app.
         */
        CompositeModule.prototype.start = function (rootElement) {
            var length = this.mods.length;
            var modNames = [];
            for (var i = 0; i < length; i++) {
                modNames.push(this.mods[i].name);
                this.mods[i].start(rootElement);
            }
            this.ngModule = angular.module(this.modName, modNames);
            this.startCore(rootElement);
        };
        CompositeModule.prototype.startCore = function (rootElement) {
        };
        return CompositeModule;
    })();
    exports.CompositeModule = CompositeModule;
    /**
     * Kernel module definition.
     *
     */
    var Module = (function (_super) {
        __extends(Module, _super);
        function Module() {
            _super.call(this, "Kernel");
        }
        /**
         * Gets the underlying angular module.
         *
         * @param rootElement the Root HTML element which will be annotated as ng-app.
         */
        Module.prototype.start = function (rootElement) {
            _super.prototype.start.call(this, rootElement);
            this.module.service("messenger", Messenger);
        };
        return Module;
    })(ModuleBase);
    exports.Module = Module;
    //////////////////////////////////////////
    ///// Implementation classes ////////////
    /////////////////////////////////////////
    var Subscription = (function () {
        function Subscription() {
        }
        return Subscription;
    })();
    var SubscriptionToken = (function () {
        function SubscriptionToken(type, handler, removeHandler) {
            this._type = type;
            this._handler = handler;
            this._removeHandler = removeHandler;
        }
        Object.defineProperty(SubscriptionToken.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SubscriptionToken.prototype, "handler", {
            get: function () {
                return this._handler;
            },
            enumerable: true,
            configurable: true
        });
        SubscriptionToken.prototype.unregister = function () {
            var fn = this._removeHandler;
            if (fn) {
                fn.call(fn);
            }
        };
        return SubscriptionToken;
    })();
    var Messenger = (function () {
        function Messenger() {
            this.gIndex = 1;
            this.subs = [];
        }
        Messenger.prototype.send = function (msg) {
            var index = msg.constructor.__index;
            if (index) {
                var sub = this.subs[index];
                if (sub && sub.Type && sub.Tokens) {
                    for (var i = 0; i < sub.Tokens.length; i++) {
                        var token = sub.Tokens[i];
                        if (token) {
                            var handler = token.handler;
                            if (handler) {
                                handler.call(handler, msg);
                            }
                        }
                    }
                }
            }
        };
        Messenger.prototype.subscribe = function (type, handler) {
            if (!type.__index) {
                type.__index = this.gIndex++;
            }
            var sub;
            if (!this.subs[type.__index]) {
                sub = new Subscription();
                sub.Type = type;
                sub.Tokens = [];
                this.subs[type.__index] = sub;
            }
            else {
                sub = this.subs[type.__index];
            }
            var self = this;
            var token = new SubscriptionToken(type, handler, function () {
                self.unsubscribe(token);
            });
            sub.Tokens.push(token);
            return token;
        };
        Messenger.prototype.unsubscribe = function (token) {
            var type = token.type;
            if (type.__index) {
                var sub = this.subs[type.__index];
                if (sub) {
                    var index = sub.Tokens.indexOf(token);
                    if (index >= 0) {
                        delete sub.Tokens[index];
                    }
                }
            }
            if (!this.subs[type.__index]) {
                sub = new Subscription();
                sub.Type = type;
                sub.Tokens = [];
                this.subs[type.__index] = sub;
            }
        };
        return Messenger;
    })();
});
//# sourceMappingURL=Kernel.js.map