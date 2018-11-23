/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 */

var JT2GoCustom = {
    PRODUCT: 'Jt2Go',
    VERSION: '1.0.2015.11.9',
    COPYRIGHT: 'Copyright 2015 Siemens Product Lifecycle Management Software Inc., All Rights Reserved.'
};
JT2GoCustom.TrackballControls = function (object, domElement) {

    var _this = this;
    var STATE = { NONE: -1, ROTATE: 0, ZOOM: -1, PAN: 1, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

    this.object = object;
    this.domElement = (domElement !== undefined) ? domElement : document;

    // JT2Go API
    // set this to true to enable single finger pan mode.
    this.singleFingerPanModeEnabled = false;
    // set this to true to enable the illusion of rotating the object instead of the camera even after a pan.
    this.rotateObjectModeEnabled = false;
    _totalPanX = 0;
    _totalPanY = 0;
    const INIT_SPEED = 0.3;

    // API

    this.enabled = true;

    this.wasRotated = false;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = INIT_SPEED;
    this.zoomSpeed = 1.0;
    this.panSpeed = INIT_SPEED;
    this.zRotateSpeed = INIT_SPEED;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.noRoll = false;
    this.singlePan = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;
    this.zRotateDynamicDampingFactor = .1;

    this.minDistance = 0;
    this.maxDistance = Infinity;

    this.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

    // internals

    this.target = new THREE.Vector3();

    var EPS = 0.000001;

    var lastPosition = new THREE.Vector3();

    var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

    _rotateZStart = 0;
    _rotateZEnd = 0;

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };


    //JT2GoAPI
    this.updateOrthoCamera = function (oCam) {
        if (oCam && _this.object) {
            oCam.position.copy(_this.object.position);
            oCam.up.copy(_this.object.up);
            oCam.lookAt(_this.target);

            var radFOV = (Math.PI / 180.) * _this.object.fov;


            var temp = new THREE.Vector3();
            var temp2 = new THREE.Vector3();
            if (_this.object.position && _this.target) {
                temp.copy(_this.object.position);
                temp2.copy(_this.target);
                var distance = temp2.sub(temp).length();
            }

            var halfHeight;
            if (distance) {
                halfHeight = Math.tan(radFOV / 2) * distance;
            }
            else {
                halfHeight = Math.tan(radFOV / 2);
            }
            var planeHeight = 2 * halfHeight;
            var planeWidth = planeHeight * _this.object.aspect;
            var halfWidth = planeWidth / 2;
            oCam.left = -halfWidth;
            oCam.right = halfWidth;
            oCam.top = halfHeight;
            oCam.bottom = -halfHeight;
            oCam.zoom = _this.object.zoom;
            oCam.updateProjectionMatrix();
        }
    };

    // methods

    this.handleResize = function () {

        if (this.domElement === document) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            //var box = this.domElement.getBoundingClientRect();
            try {
                box = this.domElement.getBoundingClientRect();
            } catch (e) {
                box = { // simulating a full ClientRect object...
                    bottom: this.domElement.offsetTop + this.domElement.height,
                    height: this.domElement.height,
                    left: this.domElement.offsetLeft,
                    right: this.domElement.offsetLeft + this.domElement.width,
                    top: this.domElement.offsetTop,
                    width: this.domElement.width
                };
            };

            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            if (box.width > 0 && box.height > 0) {
                this.screen.width = box.width;
                this.screen.height = box.height;
            }
            else {
                this.screen.width = domElement.width;
                this.screen.height = domElement.height;
                }

        }

    };

    this.handleEvent = function (event) {

        if (typeof this[event.type] == 'function') {

            this[event.type](event);

        }

    };

    var getMouseOnScreen = (function () {

        var vector = new THREE.Vector2();

        return function (pageX, pageY) {

            vector.set(
				(pageX - _this.screen.left) / _this.screen.width,
				(pageY - _this.screen.top) / _this.screen.height
			);

            return vector;

        };

    }());

    var getMouseProjectionOnBall = (function () {

        var vector = new THREE.Vector3();
        var objectUp = new THREE.Vector3();
        var mouseOnBall = new THREE.Vector3();

        return function (pageX, pageY) {

            mouseOnBall.set(
				(pageX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * .5),
				(_this.screen.height * 0.5 + _this.screen.top - pageY) / (_this.screen.height * .5),
				0.0
			);

            var length = mouseOnBall.length();

            if (_this.noRoll) {

                if (length < Math.SQRT1_2) {

                    mouseOnBall.z = Math.sqrt(1.0 - length * length);

                } else {

                    mouseOnBall.z = .5 / length;

                }

            } else if (length > 1.0) {

                mouseOnBall.normalize();

            } else {

                mouseOnBall.z = Math.sqrt(1.0 - length * length);

            }

            _eye.copy(_this.object.position).sub(_this.target);

            vector.copy(_this.object.up).setLength(mouseOnBall.y)
            vector.add(objectUp.copy(_this.object.up).cross(_eye).setLength(mouseOnBall.x));
            vector.add(_eye.setLength(mouseOnBall.z));

            return vector;

        };

    }());
    this.rotateCamera = (function () {

        var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();


        return function () {


            var angle = Math.acos(_rotateStart.dot(_rotateEnd) / _rotateStart.length() / _rotateEnd.length());

            if (angle) {
                if (angle != 0) {
                    var pan = new THREE.Vector3();
                    var objectUp = new THREE.Vector3();
                    pan.copy(_eye).cross(_this.object.up).setLength(_totalPanX);
                    pan.add(objectUp.copy(_this.object.up).setLength(_totalPanY));
                    if (_this.rotateObjectModeEnabled) {
                        _this.object.position.sub(pan);
                        _this.target.sub(pan);
                        _this.wasRotated = true;
                    }
                }
                axis.crossVectors(_rotateStart, _rotateEnd).normalize();

                angle *= _this.rotateSpeed;

                quaternion.setFromAxisAngle(axis, -angle);

                _eye.applyQuaternion(quaternion);
                _this.object.up.applyQuaternion(quaternion);

                _rotateEnd.applyQuaternion(quaternion);

                if (_this.staticMoving) {

                    _rotateStart.copy(_rotateEnd);

                } else {

                    quaternion.setFromAxisAngle(axis, angle * (_this.dynamicDampingFactor - 1.0));
                    _rotateStart.applyQuaternion(quaternion);

                }
            }

        }

    }());

    this.zRotateCamera = (function () {

        var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();


        return function () {


            var angle = (_rotateZStart - _rotateZEnd);
 

            if (angle && Math.abs(angle) > 0.001) {

                axis.copy(_eye).normalize();;
                angle *= this.zRotateSpeed;
                quaternion.setFromAxisAngle(axis, -angle);
                _this.object.up.applyQuaternion(quaternion);
                //manual damping
                if (_rotateZStart > _rotateZEnd) {
                    _rotateZStart -= (Math.abs(angle) * this.zRotateDynamicDampingFactor);
                }
                else
                {
                    _rotateZStart += (Math.abs(angle) * this.zRotateDynamicDampingFactor);
                }
            }

        }

    }());




    this.zoomCamera = function () {

        if (_state === STATE.TOUCH_ZOOM_PAN) {

            var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
            _touchZoomDistanceStart = _touchZoomDistanceEnd;
            _this.object.zoom /= factor;
            _this.object.updateProjectionMatrix();

        } else {

            var factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

            if (factor !== 1.0 && factor > 0.0) {
                _this.object.zoom /= factor;
                _this.object.updateProjectionMatrix();

                if (_this.staticMoving) {

                    _zoomStart.copy(_zoomEnd);

                } else {

                    _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;

                }

            }
        }

        _this.zoomFactorUpdated(_this.object.zoom);
        _this.noZoom = true;
    };

    this.setZoom = (function (zoomFactor) {
        _this.object.zoom = zoomFactor;
        _this.zoomFactorUpdated(zoomFactor);

    });

    this.zoomFactorUpdated = function (zoomFactor) {
        if (zoomFactor > 1) {    // reduce pan/zoom/rotate speed when zoomed in, see Defect D-33898 
            _this.rotateSpeed = INIT_SPEED / (0.9 * zoomFactor);
            _this.panSpeed = INIT_SPEED / (2 * zoomFactor);
            _this.zoomSpeed = 1.0 / zoomFactor;
        }
        else {
            _this.rotateSpeed = INIT_SPEED;
            _this.panSpeed = INIT_SPEED;
            _this.zoomSpeed = 1.0;
        }
    };
    

    this.panCamera = (function () {

        var mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

        return function () {

            mouseChange.copy(_panEnd).sub(_panStart);

            if (mouseChange.lengthSq()) {

                mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

                pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
                pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));
                _totalPanX += mouseChange.x;
                _totalPanY += mouseChange.y;
                _this.object.position.add(pan);
                _this.target.add(pan);
                if (_this.staticMoving) {

                    _panStart.copy(_panEnd);

                } else {

                    _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));

                }

            }
        }

    }());

    this.checkDistances = function () {

        if (!_this.noZoom || !_this.noPan) {

            if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {

                _this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));

            }

            if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {

                _this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance));

            }

        }

    };


    this.update = function () {


        _this.wasRotated = false;
        _eye.subVectors(_this.object.position, _this.target);

        if (!_this.noRotate) {

            _this.rotateCamera();
            _this.zRotateCamera()
        }

        if (!_this.noZoom) {

            _this.zoomCamera();

        }

        if (!_this.noPan) {

            _this.panCamera();

        }

        _this.object.position.addVectors(_this.target, _eye);

        _this.checkDistances();

        _this.object.lookAt(_this.target);
        // logic regarding if rotate happened
        if (_this.wasRotated) {
            var pan = new THREE.Vector3();
            var objectUp = new THREE.Vector3();
            pan.copy(_eye).cross(_this.object.up).setLength(_totalPanX);
            pan.add(objectUp.copy(_this.object.up).setLength(_totalPanY));
            if (_this.rotateObjectModeEnabled) {
                _this.object.position.add(pan);
                _this.target.add(pan);
            }
        }
        if (lastPosition.distanceToSquared(_this.object.position) > EPS) {

            _this.dispatchEvent(changeEvent);

            lastPosition.copy(_this.object.position);


        }


    };

    this.checkdistance = function () {
    };

    this.resetPan = function () {
        _totalPanX = 0;
        _totalPanY = 0;
    };

    this.reset = function () {
        _state = STATE.NONE;
        _prevState = STATE.NONE;

        _this.target.copy(_this.target0);
        _this.object.position.copy(_this.position0);
        _this.object.up.copy(_this.up0);

        _eye.subVectors(_this.object.position, _this.target);

        _this.object.lookAt(_this.target);

        _this.dispatchEvent(changeEvent);

        lastPosition.copy(_this.object.position);

    };

    function toDegrees(radians) {
        return (radians.valueOf() * 57.2957795);
    }

    function toRadians(degrees) {
        return (degrees.valueOf() / 57.2957795);
    }

    // listeners

    function keydown(event) {

        if (_this.enabled === false) return;

        window.removeEventListener('keydown', keydown);

        _prevState = _state;

        if (_state !== STATE.NONE) {

            return;

        } else if (event.keyCode === _this.keys[STATE.ROTATE] && !_this.noRotate) {

            _state = STATE.ROTATE;

        } else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) {

            _state = STATE.ZOOM;

        } else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) {

            _state = STATE.PAN;

        }

    }

    function keyup(event) {

        if (_this.enabled === false) return;

        _state = _prevState;

        window.addEventListener('keydown', keydown, false);

    }

    function mousedown(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        this.noZoom = true;
        if (_state === STATE.NONE && (!_this.noPan && !_this.noRoll && !_this.noRotate && !_this.noZoom)) {

            _state = event.button;

        }
        else {
            if (_state === STATE.NONE && !_this.noRotate) {
                _state = STATE.ROTATE;
            }
            if (_state === STATE.NONE && !_this.noPan) {
                _state = STATE.PAN;
            }
            if (_state === STATE.NONE && !_this.noZoom) {
                _state = STATE.ZOOM;
            }
        }

        if (_state === STATE.ROTATE && !_this.noRotate) {

            _rotateStart.copy(getMouseProjectionOnBall(event.pageX, event.pageY));
            _rotateEnd.copy(_rotateStart);

        } else if (_state === STATE.ZOOM && !_this.noZoom) {

            _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
            _zoomEnd.copy(_zoomStart);

        } else if (_state === STATE.PAN && !_this.noPan) {

            _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
            _panEnd.copy(_panStart);

        }

        document.addEventListener('mousemove', mousemove, false);
        document.addEventListener('mouseup', mouseup, false);

        _this.dispatchEvent(startEvent);

    }

    function mousemove(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();
        this.noZoom = true;
        if (_state === STATE.ROTATE && !_this.noRotate) {

            _rotateEnd.copy(getMouseProjectionOnBall(event.pageX, event.pageY));

        } else if (_state === STATE.ZOOM && !_this.noZoom) {

            _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));

        } else if (_state === STATE.PAN && !_this.noPan) {

            _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));

        }
    }

    function mouseup(event) {

        if (_this.enabled === false) return;

        event.preventDefault();

        _state = STATE.NONE;

        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        _this.dispatchEvent(endEvent);

    }

    function mousewheel(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if (event.wheelDelta) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / -40;

        } else if (event.detail) { // Firefox

            delta = - event.detail / -3;

        }

        _zoomStart.y += delta * 0.01;
        _this.dispatchEvent(startEvent);
        _this.dispatchEvent(endEvent);
        _this.noZoom=false;
    }

    function touchstart(event) {
        if (_this.enabled === false) return;

        switch (event.touches.length) {

            case 1:
                this.noZoom = true;
                _this.noRotate = false;

                if (!_this.singleFingerPanModeEnabled || _this.noPan) {
                    _state = STATE.TOUCH_ROTATE;
                    _rotateStart.copy(getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY));
                    _rotateEnd.copy(_rotateStart);
                }
                else {
                    _state = STATE.TOUCH_ZOOM_PAN;
                    var x = event.touches[0].pageX;
                    var y = event.touches[0].pageY;
                    _panStart.copy(getMouseOnScreen(x, y));
                    _panEnd.copy(_panStart);
                }
                break;

            case 2:
       
                _this.noPan = false;
                _this.noZoom = false;
                _this.noRotate = true;
                _state = STATE.TOUCH_ZOOM_PAN;
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
                var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                _panStart.copy(getMouseOnScreen(x, y));
                _panEnd.copy(_panStart);
                // z-axis rotate logic
                _rotateZStart = Math.atan2(dy, dx);
                _rotateZEnd = _rotateZStart.valueOf();
                break;

            default:
                _state = STATE.NONE;

        }
        _this.dispatchEvent(startEvent);


    }

    function touchmove(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1:
                this.noZoom = true;
                if (!_this.singleFingerPanModeEnabled || _this.noPan) {
                    _rotateEnd.copy(getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY));
                }
                else {
                    var x = event.touches[0].pageX;
                    var y = event.touches[0].pageY;
                    _panEnd.copy(getMouseOnScreen(x, y));
                }
                break;

            case 2:
                _this.noZoom = false;
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

                var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                _panEnd.copy(getMouseOnScreen(x, y));

                //z-axis rotate logic
                _rotateZEnd = Math.atan2(dy, dx);
                break;

            default:
                _state = STATE.NONE;

        }

    }

    function touchend(event) {
        this.noZoom = true;
        if (_this.enabled === false) return;
        if (! _this.singlePan) {
                    _this.noPan = true;
                }
                else {
                    _this.noPan = false;
           }
           _rotateZEnd = _rotateZStart.valueOf();

           var currentTouches = (event.touches.length == 0 ? event.changedTouches : event.touches);
           switch (currentTouches.length) {
            case 1:
                if (!_this.singleFingerPanModeEnabled || _this.noPan) {
                    _rotateEnd.copy(getMouseProjectionOnBall(currentTouches[0].pageX, currentTouches[0].pageY));
                    _rotateStart.copy(_rotateEnd);
                }
                else {
                    var x = currentTouches[0].pageX;
                    var y = currentTouches[0].pageY;
                    _panEnd.copy(getMouseOnScreen(x, y));
                    _panStart.copy(_panEnd);
                }
                break;

            case 2:
                _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

                var x = (currentTouches[0].pageX + currentTouches[1].pageX) / 2;
                var y = (currentTouches[0].pageY + currentTouches[1].pageY) / 2;
                _panEnd.copy(getMouseOnScreen(x, y));
                _panStart.copy(_panEnd);
                break;

        }

        _state = STATE.NONE;
        _this.dispatchEvent(endEvent);

    }

    this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);

    this.domElement.addEventListener('mousedown', mousedown, false);

    this.domElement.addEventListener('mousewheel', mousewheel, false);
    this.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox

    this.domElement.addEventListener('touchstart', touchstart, false);
    this.domElement.addEventListener('touchend', touchend, false);
    this.domElement.addEventListener('touchmove', touchmove, false);

    window.addEventListener('keydown', keydown, false);
    window.addEventListener('keyup', keyup, false);

    this.handleResize();

    // force an update at start
    this.update();

};

JT2GoCustom.TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
