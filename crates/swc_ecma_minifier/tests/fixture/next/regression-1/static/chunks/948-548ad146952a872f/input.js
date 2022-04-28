(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[948],{

/***/ 3041:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* binding */ MeshWobbleMaterial; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7896);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2784);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6995);
/* harmony import */ var _react_three_fiber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9060);





class WobbleMaterialImpl extends three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial {
  constructor(parameters = {}) {
    super(parameters);
    this.setValues(parameters);
    this._time = {
      value: 0
    };
    this._factor = {
      value: 1
    };
  }

  onBeforeCompile(shader) {
    shader.uniforms.time = this._time;
    shader.uniforms.factor = this._factor;
    shader.vertexShader = `
      uniform float time;
      uniform float factor;
      ${shader.vertexShader}
    `;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `float theta = sin( time + position.y ) / 2.0 * factor;
        float c = cos( theta );
        float s = sin( theta );
        mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );
        vec3 transformed = vec3( position ) * m;
        vNormal = vNormal * m;`);
  }

  get time() {
    return this._time.value;
  }

  set time(v) {
    this._time.value = v;
  }

  get factor() {
    return this._factor.value;
  }

  set factor(v) {
    this._factor.value = v;
  }

}

const MeshWobbleMaterial = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  speed = 1,
  ...props
}, ref) => {
  const [material] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new WobbleMaterialImpl());
  (0,_react_three_fiber__WEBPACK_IMPORTED_MODULE_2__.z)(state => material && (material.time = state.clock.getElapsedTime() * speed));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("primitive", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)({
    object: material,
    ref: ref,
    attach: "material"
  }, props));
});




/***/ }),

/***/ 5683:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "z": function() { return /* binding */ OrbitControls_OrbitControls; }
});

// EXTERNAL MODULE: ../../node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(7896);
// EXTERNAL MODULE: ../../node_modules/@react-three/fiber/dist/index-91152509.esm.js + 2 modules
var index_91152509_esm = __webpack_require__(9060);
// EXTERNAL MODULE: ../../node_modules/react/index.js
var react = __webpack_require__(2784);
// EXTERNAL MODULE: ../../node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(6666);
// EXTERNAL MODULE: ../../node_modules/three/build/three.module.js
var three_module = __webpack_require__(6995);
;// CONCATENATED MODULE: ../../node_modules/three-stdlib/controls/OrbitControls.js



// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

const moduloWrapAround = (offset, capacity) => (offset % capacity + capacity) % capacity;

class OrbitControls extends three_module.EventDispatcher {
  // Set to false to disable this control
  // "target" sets the location of focus, where the object orbits around
  // How far you can dolly in and out ( PerspectiveCamera only )
  // How far you can zoom in and out ( OrthographicCamera only )
  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  // radians
  // radians
  // How far you can orbit horizontally, upper and lower limits.
  // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
  // radians
  // radians
  // Set to true to enable damping (inertia)
  // If damping is enabled, you must call controls.update() in your animation loop
  // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
  // Set to false to disable zooming
  // Set to false to disable rotating
  // Set to false to disable panning
  // if false, pan orthogonal to world-space direction camera.up
  // pixels moved per arrow key push
  // Set to true to automatically rotate around the target
  // If auto-rotate is enabled, you must call controls.update() in your animation loop
  // 30 seconds per orbit when fps is 60
  // true if you want to reverse the orbit to mouse drag from left to right = orbits left
  // The four arrow keys
  // Mouse buttons
  // Touch fingers
  // the target DOM element for key events
  constructor(object, domElement) {
    super();

    (0,defineProperty/* default */.Z)(this, "object", void 0);

    (0,defineProperty/* default */.Z)(this, "domElement", void 0);

    (0,defineProperty/* default */.Z)(this, "enabled", true);

    (0,defineProperty/* default */.Z)(this, "target", new three_module.Vector3());

    (0,defineProperty/* default */.Z)(this, "minDistance", 0);

    (0,defineProperty/* default */.Z)(this, "maxDistance", Infinity);

    (0,defineProperty/* default */.Z)(this, "minZoom", 0);

    (0,defineProperty/* default */.Z)(this, "maxZoom", Infinity);

    (0,defineProperty/* default */.Z)(this, "minPolarAngle", 0);

    (0,defineProperty/* default */.Z)(this, "maxPolarAngle", Math.PI);

    (0,defineProperty/* default */.Z)(this, "minAzimuthAngle", -Infinity);

    (0,defineProperty/* default */.Z)(this, "maxAzimuthAngle", Infinity);

    (0,defineProperty/* default */.Z)(this, "enableDamping", false);

    (0,defineProperty/* default */.Z)(this, "dampingFactor", 0.05);

    (0,defineProperty/* default */.Z)(this, "enableZoom", true);

    (0,defineProperty/* default */.Z)(this, "zoomSpeed", 1.0);

    (0,defineProperty/* default */.Z)(this, "enableRotate", true);

    (0,defineProperty/* default */.Z)(this, "rotateSpeed", 1.0);

    (0,defineProperty/* default */.Z)(this, "enablePan", true);

    (0,defineProperty/* default */.Z)(this, "panSpeed", 1.0);

    (0,defineProperty/* default */.Z)(this, "screenSpacePanning", true);

    (0,defineProperty/* default */.Z)(this, "keyPanSpeed", 7.0);

    (0,defineProperty/* default */.Z)(this, "autoRotate", false);

    (0,defineProperty/* default */.Z)(this, "autoRotateSpeed", 2.0);

    (0,defineProperty/* default */.Z)(this, "reverseOrbit", false);

    (0,defineProperty/* default */.Z)(this, "keys", {
      LEFT: 'ArrowLeft',
      UP: 'ArrowUp',
      RIGHT: 'ArrowRight',
      BOTTOM: 'ArrowDown'
    });

    (0,defineProperty/* default */.Z)(this, "mouseButtons", {
      LEFT: three_module.MOUSE.ROTATE,
      MIDDLE: three_module.MOUSE.DOLLY,
      RIGHT: three_module.MOUSE.PAN
    });

    (0,defineProperty/* default */.Z)(this, "touches", {
      ONE: three_module.TOUCH.ROTATE,
      TWO: three_module.TOUCH.DOLLY_PAN
    });

    (0,defineProperty/* default */.Z)(this, "target0", void 0);

    (0,defineProperty/* default */.Z)(this, "position0", void 0);

    (0,defineProperty/* default */.Z)(this, "zoom0", void 0);

    (0,defineProperty/* default */.Z)(this, "_domElementKeyEvents", null);

    (0,defineProperty/* default */.Z)(this, "getPolarAngle", void 0);

    (0,defineProperty/* default */.Z)(this, "getAzimuthalAngle", void 0);

    (0,defineProperty/* default */.Z)(this, "setPolarAngle", void 0);

    (0,defineProperty/* default */.Z)(this, "setAzimuthalAngle", void 0);

    (0,defineProperty/* default */.Z)(this, "getDistance", void 0);

    (0,defineProperty/* default */.Z)(this, "listenToKeyEvents", void 0);

    (0,defineProperty/* default */.Z)(this, "saveState", void 0);

    (0,defineProperty/* default */.Z)(this, "reset", void 0);

    (0,defineProperty/* default */.Z)(this, "update", void 0);

    (0,defineProperty/* default */.Z)(this, "connect", void 0);

    (0,defineProperty/* default */.Z)(this, "dispose", void 0);

    this.object = object;
    this.domElement = domElement; // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object instanceof three_module.PerspectiveCamera ? this.object.zoom : 1; //
    // public methods
    //

    this.getPolarAngle = () => spherical.phi;

    this.getAzimuthalAngle = () => spherical.theta;

    this.setPolarAngle = value => {
      // use modulo wrapping to safeguard value
      let phi = moduloWrapAround(value, 2 * Math.PI);
      let currentPhi = spherical.phi; // convert to the equivalent shortest angle

      if (currentPhi < 0) currentPhi += 2 * Math.PI;
      if (phi < 0) phi += 2 * Math.PI;
      let phiDist = Math.abs(phi - currentPhi);

      if (2 * Math.PI - phiDist < phiDist) {
        if (phi < currentPhi) {
          phi += 2 * Math.PI;
        } else {
          currentPhi += 2 * Math.PI;
        }
      }

      sphericalDelta.phi = phi - currentPhi;
      scope.update();
    };

    this.setAzimuthalAngle = value => {
      // use modulo wrapping to safeguard value
      let theta = moduloWrapAround(value, 2 * Math.PI);
      let currentTheta = spherical.theta; // convert to the equivalent shortest angle

      if (currentTheta < 0) currentTheta += 2 * Math.PI;
      if (theta < 0) theta += 2 * Math.PI;
      let thetaDist = Math.abs(theta - currentTheta);

      if (2 * Math.PI - thetaDist < thetaDist) {
        if (theta < currentTheta) {
          theta += 2 * Math.PI;
        } else {
          currentTheta += 2 * Math.PI;
        }
      }

      sphericalDelta.theta = theta - currentTheta;
      scope.update();
    };

    this.getDistance = () => scope.object.position.distanceTo(scope.target);

    this.listenToKeyEvents = domElement => {
      domElement.addEventListener('keydown', onKeyDown);
      this._domElementKeyEvents = domElement;
    };

    this.saveState = () => {
      scope.target0.copy(scope.target);
      scope.position0.copy(scope.object.position);
      scope.zoom0 = scope.object instanceof three_module.PerspectiveCamera ? scope.object.zoom : 1;
    };

    this.reset = () => {
      scope.target.copy(scope.target0);
      scope.object.position.copy(scope.position0);

      if (scope.object instanceof three_module.PerspectiveCamera) {
        scope.object.zoom = scope.zoom0;
        scope.object.updateProjectionMatrix();
      }

      scope.dispatchEvent(changeEvent);
      scope.update();
      state = STATE.NONE;
    }; // this method is exposed, but perhaps it would be better if we can make it private...


    this.update = (() => {
      const offset = new three_module.Vector3(); // so camera.up is the orbit axis

      const quat = new three_module.Quaternion().setFromUnitVectors(object.up, new three_module.Vector3(0, 1, 0));
      const quatInverse = quat.clone().invert();
      const lastPosition = new three_module.Vector3();
      const lastQuaternion = new three_module.Quaternion();
      const twoPI = 2 * Math.PI;
      return function update() {
        const position = scope.object.position;
        offset.copy(position).sub(scope.target); // rotate offset to "y-axis-is-up" space

        offset.applyQuaternion(quat); // angle from z-axis around y-axis

        spherical.setFromVector3(offset);

        if (scope.autoRotate && state === STATE.NONE) {
          rotateLeft(getAutoRotationAngle());
        }

        if (scope.enableDamping) {
          spherical.theta += sphericalDelta.theta * scope.dampingFactor;
          spherical.phi += sphericalDelta.phi * scope.dampingFactor;
        } else {
          spherical.theta += sphericalDelta.theta;
          spherical.phi += sphericalDelta.phi;
        } // restrict theta to be between desired limits


        let min = scope.minAzimuthAngle;
        let max = scope.maxAzimuthAngle;

        if (isFinite(min) && isFinite(max)) {
          if (min < -Math.PI) min += twoPI;else if (min > Math.PI) min -= twoPI;
          if (max < -Math.PI) max += twoPI;else if (max > Math.PI) max -= twoPI;

          if (min <= max) {
            spherical.theta = Math.max(min, Math.min(max, spherical.theta));
          } else {
            spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
          }
        } // restrict phi to be between desired limits


        spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
        spherical.makeSafe();
        spherical.radius *= scale; // restrict radius to be between desired limits

        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius)); // move target to panned location

        if (scope.enableDamping === true) {
          scope.target.addScaledVector(panOffset, scope.dampingFactor);
        } else {
          scope.target.add(panOffset);
        }

        offset.setFromSpherical(spherical); // rotate offset back to "camera-up-vector-is-up" space

        offset.applyQuaternion(quatInverse);
        position.copy(scope.target).add(offset);
        scope.object.lookAt(scope.target);

        if (scope.enableDamping === true) {
          sphericalDelta.theta *= 1 - scope.dampingFactor;
          sphericalDelta.phi *= 1 - scope.dampingFactor;
          panOffset.multiplyScalar(1 - scope.dampingFactor);
        } else {
          sphericalDelta.set(0, 0, 0);
          panOffset.set(0, 0, 0);
        }

        scale = 1; // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          scope.dispatchEvent(changeEvent);
          lastPosition.copy(scope.object.position);
          lastQuaternion.copy(scope.object.quaternion);
          zoomChanged = false;
          return true;
        }

        return false;
      };
    })(); // https://github.com/mrdoob/three.js/issues/20575


    this.connect = domElement => {
      if (domElement === document) {
        console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');
      }

      scope.domElement = domElement; // disables touch scroll
      // touch-action needs to be defined for pointer events to work on mobile
      // https://stackoverflow.com/a/48254578

      scope.domElement.style.touchAction = 'none';
      scope.domElement.addEventListener('contextmenu', onContextMenu);
      scope.domElement.addEventListener('pointerdown', onPointerDown);
      scope.domElement.addEventListener('pointercancel', onPointerCancel);
      scope.domElement.addEventListener('wheel', onMouseWheel);
    };

    this.dispose = () => {
      var _scope$domElement, _scope$domElement2, _scope$domElement3, _scope$domElement4, _scope$domElement5, _scope$domElement6;

      (_scope$domElement = scope.domElement) === null || _scope$domElement === void 0 ? void 0 : _scope$domElement.removeEventListener('contextmenu', onContextMenu);
      (_scope$domElement2 = scope.domElement) === null || _scope$domElement2 === void 0 ? void 0 : _scope$domElement2.removeEventListener('pointerdown', onPointerDown);
      (_scope$domElement3 = scope.domElement) === null || _scope$domElement3 === void 0 ? void 0 : _scope$domElement3.removeEventListener('pointercancel', onPointerCancel);
      (_scope$domElement4 = scope.domElement) === null || _scope$domElement4 === void 0 ? void 0 : _scope$domElement4.removeEventListener('wheel', onMouseWheel);
      (_scope$domElement5 = scope.domElement) === null || _scope$domElement5 === void 0 ? void 0 : _scope$domElement5.ownerDocument.removeEventListener('pointermove', onPointerMove);
      (_scope$domElement6 = scope.domElement) === null || _scope$domElement6 === void 0 ? void 0 : _scope$domElement6.ownerDocument.removeEventListener('pointerup', onPointerUp);

      if (scope._domElementKeyEvents !== null) {
        scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
      } //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

    }; //
    // internals
    //


    const scope = this;
    const changeEvent = {
      type: 'change'
    };
    const startEvent = {
      type: 'start'
    };
    const endEvent = {
      type: 'end'
    };
    const STATE = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let state = STATE.NONE;
    const EPS = 0.000001; // current position in spherical coordinates

    const spherical = new three_module.Spherical();
    const sphericalDelta = new three_module.Spherical();
    let scale = 1;
    const panOffset = new three_module.Vector3();
    let zoomChanged = false;
    const rotateStart = new three_module.Vector2();
    const rotateEnd = new three_module.Vector2();
    const rotateDelta = new three_module.Vector2();
    const panStart = new three_module.Vector2();
    const panEnd = new three_module.Vector2();
    const panDelta = new three_module.Vector2();
    const dollyStart = new three_module.Vector2();
    const dollyEnd = new three_module.Vector2();
    const dollyDelta = new three_module.Vector2();
    const pointers = [];
    const pointerPositions = {};

    function getAutoRotationAngle() {
      return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }

    function getZoomScale() {
      return Math.pow(0.95, scope.zoomSpeed);
    }

    function rotateLeft(angle) {
      if (scope.reverseOrbit) {
        sphericalDelta.theta += angle;
      } else {
        sphericalDelta.theta -= angle;
      }
    }

    function rotateUp(angle) {
      if (scope.reverseOrbit) {
        sphericalDelta.phi += angle;
      } else {
        sphericalDelta.phi -= angle;
      }
    }

    const panLeft = (() => {
      const v = new three_module.Vector3();
      return function panLeft(distance, objectMatrix) {
        v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix

        v.multiplyScalar(-distance);
        panOffset.add(v);
      };
    })();

    const panUp = (() => {
      const v = new three_module.Vector3();
      return function panUp(distance, objectMatrix) {
        if (scope.screenSpacePanning === true) {
          v.setFromMatrixColumn(objectMatrix, 1);
        } else {
          v.setFromMatrixColumn(objectMatrix, 0);
          v.crossVectors(scope.object.up, v);
        }

        v.multiplyScalar(distance);
        panOffset.add(v);
      };
    })(); // deltaX and deltaY are in pixels; right and down are positive


    const pan = (() => {
      const offset = new three_module.Vector3();
      return function pan(deltaX, deltaY) {
        const element = scope.domElement;

        if (element && scope.object instanceof three_module.PerspectiveCamera && scope.object.isPerspectiveCamera) {
          // perspective
          const position = scope.object.position;
          offset.copy(position).sub(scope.target);
          let targetDistance = offset.length(); // half of the fov is center to top of screen

          targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0); // we use only clientHeight here so aspect ratio does not distort speed

          panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
          panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
        } else if (element && scope.object instanceof three_module.OrthographicCamera && scope.object.isOrthographicCamera) {
          // orthographic
          panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
          panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
        } else {
          // camera neither orthographic nor perspective
          console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
          scope.enablePan = false;
        }
      };
    })();

    function dollyOut(dollyScale) {
      if (scope.object instanceof three_module.PerspectiveCamera && scope.object.isPerspectiveCamera) {
        scale /= dollyScale;
      } else if (scope.object instanceof three_module.OrthographicCamera && scope.object.isOrthographicCamera) {
        scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
        scope.object.updateProjectionMatrix();
        zoomChanged = true;
      } else {
        console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
        scope.enableZoom = false;
      }
    }

    function dollyIn(dollyScale) {
      if (scope.object instanceof three_module.PerspectiveCamera && scope.object.isPerspectiveCamera) {
        scale *= dollyScale;
      } else if (scope.object instanceof three_module.OrthographicCamera && scope.object.isOrthographicCamera) {
        scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
        scope.object.updateProjectionMatrix();
        zoomChanged = true;
      } else {
        console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
        scope.enableZoom = false;
      }
    } //
    // event callbacks - update the object state
    //


    function handleMouseDownRotate(event) {
      rotateStart.set(event.clientX, event.clientY);
    }

    function handleMouseDownDolly(event) {
      dollyStart.set(event.clientX, event.clientY);
    }

    function handleMouseDownPan(event) {
      panStart.set(event.clientX, event.clientY);
    }

    function handleMouseMoveRotate(event) {
      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
      const element = scope.domElement;

      if (element) {
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
      }

      rotateStart.copy(rotateEnd);
      scope.update();
    }

    function handleMouseMoveDolly(event) {
      dollyEnd.set(event.clientX, event.clientY);
      dollyDelta.subVectors(dollyEnd, dollyStart);

      if (dollyDelta.y > 0) {
        dollyOut(getZoomScale());
      } else if (dollyDelta.y < 0) {
        dollyIn(getZoomScale());
      }

      dollyStart.copy(dollyEnd);
      scope.update();
    }

    function handleMouseMovePan(event) {
      panEnd.set(event.clientX, event.clientY);
      panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
      pan(panDelta.x, panDelta.y);
      panStart.copy(panEnd);
      scope.update();
    }

    function handleMouseWheel(event) {
      if (event.deltaY < 0) {
        dollyIn(getZoomScale());
      } else if (event.deltaY > 0) {
        dollyOut(getZoomScale());
      }

      scope.update();
    }

    function handleKeyDown(event) {
      let needsUpdate = false;

      switch (event.code) {
        case scope.keys.UP:
          pan(0, scope.keyPanSpeed);
          needsUpdate = true;
          break;

        case scope.keys.BOTTOM:
          pan(0, -scope.keyPanSpeed);
          needsUpdate = true;
          break;

        case scope.keys.LEFT:
          pan(scope.keyPanSpeed, 0);
          needsUpdate = true;
          break;

        case scope.keys.RIGHT:
          pan(-scope.keyPanSpeed, 0);
          needsUpdate = true;
          break;
      }

      if (needsUpdate) {
        // prevent the browser from scrolling on cursor keys
        event.preventDefault();
        scope.update();
      }
    }

    function handleTouchStartRotate() {
      if (pointers.length == 1) {
        rotateStart.set(pointers[0].pageX, pointers[0].pageY);
      } else {
        const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
        const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
        rotateStart.set(x, y);
      }
    }

    function handleTouchStartPan() {
      if (pointers.length == 1) {
        panStart.set(pointers[0].pageX, pointers[0].pageY);
      } else {
        const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
        const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
        panStart.set(x, y);
      }
    }

    function handleTouchStartDolly() {
      const dx = pointers[0].pageX - pointers[1].pageX;
      const dy = pointers[0].pageY - pointers[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      dollyStart.set(0, distance);
    }

    function handleTouchStartDollyPan() {
      if (scope.enableZoom) handleTouchStartDolly();
      if (scope.enablePan) handleTouchStartPan();
    }

    function handleTouchStartDollyRotate() {
      if (scope.enableZoom) handleTouchStartDolly();
      if (scope.enableRotate) handleTouchStartRotate();
    }

    function handleTouchMoveRotate(event) {
      if (pointers.length == 1) {
        rotateEnd.set(event.pageX, event.pageY);
      } else {
        const position = getSecondPointerPosition(event);
        const x = 0.5 * (event.pageX + position.x);
        const y = 0.5 * (event.pageY + position.y);
        rotateEnd.set(x, y);
      }

      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
      const element = scope.domElement;

      if (element) {
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
      }

      rotateStart.copy(rotateEnd);
    }

    function handleTouchMovePan(event) {
      if (pointers.length == 1) {
        panEnd.set(event.pageX, event.pageY);
      } else {
        const position = getSecondPointerPosition(event);
        const x = 0.5 * (event.pageX + position.x);
        const y = 0.5 * (event.pageY + position.y);
        panEnd.set(x, y);
      }

      panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
      pan(panDelta.x, panDelta.y);
      panStart.copy(panEnd);
    }

    function handleTouchMoveDolly(event) {
      const position = getSecondPointerPosition(event);
      const dx = event.pageX - position.x;
      const dy = event.pageY - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      dollyEnd.set(0, distance);
      dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
      dollyOut(dollyDelta.y);
      dollyStart.copy(dollyEnd);
    }

    function handleTouchMoveDollyPan(event) {
      if (scope.enableZoom) handleTouchMoveDolly(event);
      if (scope.enablePan) handleTouchMovePan(event);
    }

    function handleTouchMoveDollyRotate(event) {
      if (scope.enableZoom) handleTouchMoveDolly(event);
      if (scope.enableRotate) handleTouchMoveRotate(event);
    } //
    // event handlers - FSM: listen for events and reset state
    //


    function onPointerDown(event) {
      if (scope.enabled === false) return;

      if (pointers.length === 0) {
        var _scope$domElement7, _scope$domElement8;

        (_scope$domElement7 = scope.domElement) === null || _scope$domElement7 === void 0 ? void 0 : _scope$domElement7.ownerDocument.addEventListener('pointermove', onPointerMove);
        (_scope$domElement8 = scope.domElement) === null || _scope$domElement8 === void 0 ? void 0 : _scope$domElement8.ownerDocument.addEventListener('pointerup', onPointerUp);
      }

      addPointer(event);

      if (event.pointerType === 'touch') {
        onTouchStart(event);
      } else {
        onMouseDown(event);
      }
    }

    function onPointerMove(event) {
      if (scope.enabled === false) return;

      if (event.pointerType === 'touch') {
        onTouchMove(event);
      } else {
        onMouseMove(event);
      }
    }

    function onPointerUp(event) {
      removePointer(event);

      if (pointers.length === 0) {
        var _scope$domElement9, _scope$domElement10, _scope$domElement11;

        (_scope$domElement9 = scope.domElement) === null || _scope$domElement9 === void 0 ? void 0 : _scope$domElement9.releasePointerCapture(event.pointerId);
        (_scope$domElement10 = scope.domElement) === null || _scope$domElement10 === void 0 ? void 0 : _scope$domElement10.ownerDocument.removeEventListener('pointermove', onPointerMove);
        (_scope$domElement11 = scope.domElement) === null || _scope$domElement11 === void 0 ? void 0 : _scope$domElement11.ownerDocument.removeEventListener('pointerup', onPointerUp);
      }

      scope.dispatchEvent(endEvent);
      state = STATE.NONE;
    }

    function onPointerCancel(event) {
      removePointer(event);
    }

    function onMouseDown(event) {
      let mouseAction;

      switch (event.button) {
        case 0:
          mouseAction = scope.mouseButtons.LEFT;
          break;

        case 1:
          mouseAction = scope.mouseButtons.MIDDLE;
          break;

        case 2:
          mouseAction = scope.mouseButtons.RIGHT;
          break;

        default:
          mouseAction = -1;
      }

      switch (mouseAction) {
        case three_module.MOUSE.DOLLY:
          if (scope.enableZoom === false) return;
          handleMouseDownDolly(event);
          state = STATE.DOLLY;
          break;

        case three_module.MOUSE.ROTATE:
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (scope.enablePan === false) return;
            handleMouseDownPan(event);
            state = STATE.PAN;
          } else {
            if (scope.enableRotate === false) return;
            handleMouseDownRotate(event);
            state = STATE.ROTATE;
          }

          break;

        case three_module.MOUSE.PAN:
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (scope.enableRotate === false) return;
            handleMouseDownRotate(event);
            state = STATE.ROTATE;
          } else {
            if (scope.enablePan === false) return;
            handleMouseDownPan(event);
            state = STATE.PAN;
          }

          break;

        default:
          state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.dispatchEvent(startEvent);
      }
    }

    function onMouseMove(event) {
      if (scope.enabled === false) return;

      switch (state) {
        case STATE.ROTATE:
          if (scope.enableRotate === false) return;
          handleMouseMoveRotate(event);
          break;

        case STATE.DOLLY:
          if (scope.enableZoom === false) return;
          handleMouseMoveDolly(event);
          break;

        case STATE.PAN:
          if (scope.enablePan === false) return;
          handleMouseMovePan(event);
          break;
      }
    }

    function onMouseWheel(event) {
      if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE && state !== STATE.ROTATE) {
        return;
      }

      event.preventDefault();
      scope.dispatchEvent(startEvent);
      handleMouseWheel(event);
      scope.dispatchEvent(endEvent);
    }

    function onKeyDown(event) {
      if (scope.enabled === false || scope.enablePan === false) return;
      handleKeyDown(event);
    }

    function onTouchStart(event) {
      trackPointer(event);

      switch (pointers.length) {
        case 1:
          switch (scope.touches.ONE) {
            case three_module.TOUCH.ROTATE:
              if (scope.enableRotate === false) return;
              handleTouchStartRotate();
              state = STATE.TOUCH_ROTATE;
              break;

            case three_module.TOUCH.PAN:
              if (scope.enablePan === false) return;
              handleTouchStartPan();
              state = STATE.TOUCH_PAN;
              break;

            default:
              state = STATE.NONE;
          }

          break;

        case 2:
          switch (scope.touches.TWO) {
            case three_module.TOUCH.DOLLY_PAN:
              if (scope.enableZoom === false && scope.enablePan === false) return;
              handleTouchStartDollyPan();
              state = STATE.TOUCH_DOLLY_PAN;
              break;

            case three_module.TOUCH.DOLLY_ROTATE:
              if (scope.enableZoom === false && scope.enableRotate === false) return;
              handleTouchStartDollyRotate();
              state = STATE.TOUCH_DOLLY_ROTATE;
              break;

            default:
              state = STATE.NONE;
          }

          break;

        default:
          state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.dispatchEvent(startEvent);
      }
    }

    function onTouchMove(event) {
      trackPointer(event);

      switch (state) {
        case STATE.TOUCH_ROTATE:
          if (scope.enableRotate === false) return;
          handleTouchMoveRotate(event);
          scope.update();
          break;

        case STATE.TOUCH_PAN:
          if (scope.enablePan === false) return;
          handleTouchMovePan(event);
          scope.update();
          break;

        case STATE.TOUCH_DOLLY_PAN:
          if (scope.enableZoom === false && scope.enablePan === false) return;
          handleTouchMoveDollyPan(event);
          scope.update();
          break;

        case STATE.TOUCH_DOLLY_ROTATE:
          if (scope.enableZoom === false && scope.enableRotate === false) return;
          handleTouchMoveDollyRotate(event);
          scope.update();
          break;

        default:
          state = STATE.NONE;
      }
    }

    function onContextMenu(event) {
      if (scope.enabled === false) return;
      event.preventDefault();
    }

    function addPointer(event) {
      pointers.push(event);
    }

    function removePointer(event) {
      delete pointerPositions[event.pointerId];

      for (let i = 0; i < pointers.length; i++) {
        if (pointers[i].pointerId == event.pointerId) {
          pointers.splice(i, 1);
          return;
        }
      }
    }

    function trackPointer(event) {
      let position = pointerPositions[event.pointerId];

      if (position === undefined) {
        position = new three_module.Vector2();
        pointerPositions[event.pointerId] = position;
      }

      position.set(event.pageX, event.pageY);
    }

    function getSecondPointerPosition(event) {
      const pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
      return pointerPositions[pointer.pointerId];
    } // connect events


    if (domElement !== undefined) this.connect(domElement); // force an update at start

    this.update();
  }

} // This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls, another set of touch behavior
//
//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse, or arrow keys / touch: one-finger move


class MapControls extends (/* unused pure expression or super */ null && (OrbitControls)) {
  constructor(object, domElement) {
    super(object, domElement);
    this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up

    this.mouseButtons.LEFT = MOUSE.PAN;
    this.mouseButtons.RIGHT = MOUSE.ROTATE;
    this.touches.ONE = TOUCH.PAN;
    this.touches.TWO = TOUCH.DOLLY_ROTATE;
  }

}



;// CONCATENATED MODULE: ../../node_modules/@react-three/drei/core/OrbitControls.js





const OrbitControls_OrbitControls = /*#__PURE__*/react.forwardRef(({
  makeDefault,
  camera,
  regress,
  domElement,
  enableDamping = true,
  onChange,
  onStart,
  onEnd,
  ...restProps
}, ref) => {
  const invalidate = (0,index_91152509_esm.y)(state => state.invalidate);
  const defaultCamera = (0,index_91152509_esm.y)(state => state.camera);
  const gl = (0,index_91152509_esm.y)(state => state.gl);
  const events = (0,index_91152509_esm.y)(state => state.events);
  const set = (0,index_91152509_esm.y)(state => state.set);
  const get = (0,index_91152509_esm.y)(state => state.get);
  const performance = (0,index_91152509_esm.y)(state => state.performance);
  const explCamera = camera || defaultCamera;
  const explDomElement = domElement || events.connected || gl.domElement;
  const controls = react.useMemo(() => new OrbitControls(explCamera), [explCamera]);
  (0,index_91152509_esm.z)(() => {
    if (controls.enabled) controls.update();
  }, -1);
  react.useEffect(() => {
    controls.connect(explDomElement);
    return () => void controls.dispose();
  }, [explDomElement, regress, controls, invalidate]);
  react.useEffect(() => {
    const callback = e => {
      invalidate();
      if (regress) performance.regress();
      if (onChange) onChange(e);
    };

    controls.addEventListener('change', callback);
    if (onStart) controls.addEventListener('start', onStart);
    if (onEnd) controls.addEventListener('end', onEnd);
    return () => {
      if (onStart) controls.removeEventListener('start', onStart);
      if (onEnd) controls.removeEventListener('end', onEnd);
      controls.removeEventListener('change', callback);
    };
  }, [onChange, onStart, onEnd]);
  react.useEffect(() => {
    if (makeDefault) {
      const old = get().controls;
      set({
        controls
      });
      return () => set({
        controls: old
      });
    }
  }, [makeDefault, controls]);
  return /*#__PURE__*/react.createElement("primitive", (0,esm_extends/* default */.Z)({
    ref: ref,
    object: controls,
    enableDamping: enableDamping
  }, restProps));
});




/***/ }),

/***/ 9060:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "B": function() { return /* binding */ Block; },
  "E": function() { return /* binding */ ErrorBoundary; },
  "a": function() { return /* binding */ createRoot; },
  "b": function() { return /* binding */ index_91152509_esm_useIsomorphicLayoutEffect; },
  "c": function() { return /* binding */ createEvents; },
  "d": function() { return /* binding */ unmountComponentAtNode; },
  "e": function() { return /* binding */ extend; },
  "o": function() { return /* binding */ omit; },
  "p": function() { return /* binding */ pick; },
  "u": function() { return /* binding */ useMutableCallback; },
  "y": function() { return /* binding */ useThree; },
  "z": function() { return /* binding */ useFrame; }
});

// UNUSED EXPORTS: A, C, f, g, h, i, j, k, l, m, n, q, r, s, t, v, w, x

// EXTERNAL MODULE: ../../node_modules/three/build/three.module.js
var three_module = __webpack_require__(6995);
// EXTERNAL MODULE: ../../node_modules/react/index.js
var react = __webpack_require__(2784);
// EXTERNAL MODULE: ../../node_modules/react-reconciler/constants.js
var constants = __webpack_require__(1801);
;// CONCATENATED MODULE: ../../node_modules/zustand/esm/index.js


function createStore(createState) {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (nextState !== state) {
      const previousState = state;
      state = replace ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const subscribeWithSelector = (listener, selector = getState, equalityFn = Object.is) => {
    console.warn("[DEPRECATED] Please use `subscribeWithSelector` middleware");
    let currentSlice = selector(state);
    function listenerToAdd() {
      const nextSlice = selector(state);
      if (!equalityFn(currentSlice, nextSlice)) {
        const previousSlice = currentSlice;
        listener(currentSlice = nextSlice, previousSlice);
      }
    }
    listeners.add(listenerToAdd);
    return () => listeners.delete(listenerToAdd);
  };
  const subscribe = (listener, selector, equalityFn) => {
    if (selector || equalityFn) {
      return subscribeWithSelector(listener, selector, equalityFn);
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => listeners.clear();
  const api = { setState, getState, subscribe, destroy };
  state = createState(setState, getState, api);
  return api;
}

const isSSR = typeof window === "undefined" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
const useIsomorphicLayoutEffect = isSSR ? react.useEffect : react.useLayoutEffect;
function esm_create(createState) {
  const api = typeof createState === "function" ? createStore(createState) : createState;
  const useStore = (selector = api.getState, equalityFn = Object.is) => {
    const [, forceUpdate] = (0,react.useReducer)((c) => c + 1, 0);
    const state = api.getState();
    const stateRef = (0,react.useRef)(state);
    const selectorRef = (0,react.useRef)(selector);
    const equalityFnRef = (0,react.useRef)(equalityFn);
    const erroredRef = (0,react.useRef)(false);
    const currentSliceRef = (0,react.useRef)();
    if (currentSliceRef.current === void 0) {
      currentSliceRef.current = selector(state);
    }
    let newStateSlice;
    let hasNewStateSlice = false;
    if (stateRef.current !== state || selectorRef.current !== selector || equalityFnRef.current !== equalityFn || erroredRef.current) {
      newStateSlice = selector(state);
      hasNewStateSlice = !equalityFn(currentSliceRef.current, newStateSlice);
    }
    useIsomorphicLayoutEffect(() => {
      if (hasNewStateSlice) {
        currentSliceRef.current = newStateSlice;
      }
      stateRef.current = state;
      selectorRef.current = selector;
      equalityFnRef.current = equalityFn;
      erroredRef.current = false;
    });
    const stateBeforeSubscriptionRef = (0,react.useRef)(state);
    useIsomorphicLayoutEffect(() => {
      const listener = () => {
        try {
          const nextState = api.getState();
          const nextStateSlice = selectorRef.current(nextState);
          if (!equalityFnRef.current(currentSliceRef.current, nextStateSlice)) {
            stateRef.current = nextState;
            currentSliceRef.current = nextStateSlice;
            forceUpdate();
          }
        } catch (error) {
          erroredRef.current = true;
          forceUpdate();
        }
      };
      const unsubscribe = api.subscribe(listener);
      if (api.getState() !== stateBeforeSubscriptionRef.current) {
        listener();
      }
      return unsubscribe;
    }, []);
    const sliceToReturn = hasNewStateSlice ? newStateSlice : currentSliceRef.current;
    (0,react.useDebugValue)(sliceToReturn);
    return sliceToReturn;
  };
  Object.assign(useStore, api);
  useStore[Symbol.iterator] = function() {
    console.warn("[useStore, api] = create() is deprecated and will be removed in v4");
    const items = [useStore, api];
    return {
      next() {
        const done = items.length <= 0;
        return { value: items.shift(), done };
      }
    };
  };
  return useStore;
}



// EXTERNAL MODULE: ../../node_modules/react-reconciler/index.js
var react_reconciler = __webpack_require__(7962);
var react_reconciler_default = /*#__PURE__*/__webpack_require__.n(react_reconciler);
// EXTERNAL MODULE: ../../node_modules/scheduler/index.js
var scheduler = __webpack_require__(4616);
;// CONCATENATED MODULE: ../../node_modules/suspend-react/dist/index.js
function shallowEqualArrays(arrA, arrB, equal = (a, b) => a === b) {
  if (arrA === arrB) return true;
  if (!arrA || !arrB) return false;
  const len = arrA.length;
  if (arrB.length !== len) return false;

  for (let i = 0; i < len; i++) if (!equal(arrA[i], arrB[i])) return false;

  return true;
}

const globalCache = [];

function query(fn, keys, preload = false, config = {}) {
  for (const entry of globalCache) {
    // Find a match
    if (shallowEqualArrays(keys, entry.keys, entry.equal)) {
      // If we're pre-loading and the element is present, just return
      if (preload) return undefined; // If an error occurred, throw

      if (Object.prototype.hasOwnProperty.call(entry, 'error')) throw entry.error; // If a response was successful, return

      if (Object.prototype.hasOwnProperty.call(entry, 'response')) return entry.response; // If the promise is still unresolved, throw

      if (!preload) throw entry.promise;
    }
  } // The request is new or has changed.


  const entry = {
    keys,
    equal: config.equal,
    promise: // Execute the promise
    fn(...keys) // When it resolves, store its value
    .then(response => entry.response = response) // Remove the entry if a lifespan was given
    .then(() => {
      if (config.lifespan && config.lifespan > 0) {
        setTimeout(() => {
          const index = globalCache.indexOf(entry);
          if (index !== -1) globalCache.splice(index, 1);
        }, config.lifespan);
      }
    }) // Store caught errors, they will be thrown in the render-phase to bubble into an error-bound
    .catch(error => entry.error = error)
  }; // Register the entry

  globalCache.push(entry); // And throw the promise, this yields control back to React

  if (!preload) throw entry.promise;
  return undefined;
}

const suspend = (fn, keys, config) => query(fn, keys, false, config);

const preload = (fn, keys, config) => void query(fn, keys, true, config);

const peek = keys => {
  var _globalCache$find;

  return (_globalCache$find = globalCache.find(entry => shallowEqualArrays(keys, entry.keys, entry.equal))) == null ? void 0 : _globalCache$find.response;
};

const clear = keys => {
  if (keys === undefined || keys.length === 0) globalCache.splice(0, globalCache.length);else {
    const entry = globalCache.find(entry => shallowEqualArrays(keys, entry.keys, entry.equal));

    if (entry) {
      const index = globalCache.indexOf(entry);
      if (index !== -1) globalCache.splice(index, 1);
    }
  }
};



;// CONCATENATED MODULE: ../../node_modules/@react-three/fiber/dist/index-91152509.esm.js








var threeTypes = /*#__PURE__*/Object.freeze({
  __proto__: null
});

const isOrthographicCamera = def => def && def.isOrthographicCamera; // React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect on the client.

const index_91152509_esm_isSSR = typeof window === 'undefined' || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
const index_91152509_esm_useIsomorphicLayoutEffect = index_91152509_esm_isSSR ? react.useEffect : react.useLayoutEffect;
function useMutableCallback(fn) {
  const ref = react.useRef(fn);
  index_91152509_esm_useIsomorphicLayoutEffect(() => void (ref.current = fn), [fn]);
  return ref;
}
function Block({
  set
}) {
  index_91152509_esm_useIsomorphicLayoutEffect(() => {
    set(new Promise(() => null));
    return () => set(false);
  }, [set]);
  return null;
}
class ErrorBoundary extends react.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      error: false
    };
  }

  componentDidCatch(error) {
    this.props.set(error);
  }

  render() {
    return this.state.error ? null : this.props.children;
  }

}

ErrorBoundary.getDerivedStateFromError = () => ({
  error: true
});

const DEFAULT = '__default';
const isDiffSet = def => def && !!def.memoized && !!def.changes;
function calculateDpr(dpr) {
  return Array.isArray(dpr) ? Math.min(Math.max(dpr[0], window.devicePixelRatio), dpr[1]) : dpr;
}
/**
 * Returns instance root state
 */

const getRootState = obj => {
  var _r3f;

  return (_r3f = obj.__r3f) == null ? void 0 : _r3f.root.getState();
};
/**
 * Picks or omits keys from an object
 * `omit` will filter out keys, and otherwise cherry-pick them.
 */

function filterKeys(obj, omit, ...keys) {
  const keysToSelect = new Set(keys);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const shouldInclude = !omit;
    if (keysToSelect.has(key) === shouldInclude) acc[key] = value;
    return acc;
  }, {});
}
/**
 * Clones an object and cherry-picks keys.
 */

const pick = (obj, keys) => filterKeys(obj, false, ...keys);
/**
 * Clones an object and prunes or omits keys.
 */

const omit = (obj, keys) => filterKeys(obj, true, ...keys);
// A collection of compare functions
const is = {
  obj: a => a === Object(a) && !is.arr(a) && typeof a !== 'function',
  fun: a => typeof a === 'function',
  str: a => typeof a === 'string',
  num: a => typeof a === 'number',
  boo: a => typeof a === 'boolean',
  und: a => a === void 0,
  arr: a => Array.isArray(a),

  equ(a, b, {
    arrays = 'shallow',
    objects = 'reference',
    strict = true
  } = {}) {
    // Wrong type or one of the two undefined, doesn't match
    if (typeof a !== typeof b || !!a !== !!b) return false; // Atomic, just compare a against b

    if (is.str(a) || is.num(a)) return a === b;
    const isObj = is.obj(a);
    if (isObj && objects === 'reference') return a === b;
    const isArr = is.arr(a);
    if (isArr && arrays === 'reference') return a === b; // Array or Object, shallow compare first to see if it's a match

    if ((isArr || isObj) && a === b) return true; // Last resort, go through keys

    let i;

    for (i in a) if (!(i in b)) return false;

    for (i in strict ? b : a) if (a[i] !== b[i]) return false;

    if (is.und(i)) {
      if (isArr && a.length === 0 && b.length === 0) return true;
      if (isObj && Object.keys(a).length === 0 && Object.keys(b).length === 0) return true;
      if (a !== b) return false;
    }

    return true;
  }

}; // Collects nodes and materials from a THREE.Object3D

function buildGraph(object) {
  const data = {
    nodes: {},
    materials: {}
  };

  if (object) {
    object.traverse(obj => {
      if (obj.name) data.nodes[obj.name] = obj;
      if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material;
    });
  }

  return data;
} // Disposes an object and all its properties

function dispose(obj) {
  if (obj.dispose && obj.type !== 'Scene') obj.dispose();

  for (const p in obj) {
    p.dispose == null ? void 0 : p.dispose();
    delete obj[p];
  }
} // Each object in the scene carries a small LocalState descriptor

function prepare(object, state) {
  const instance = object;

  if (state != null && state.primitive || !instance.__r3f) {
    instance.__r3f = {
      type: '',
      root: null,
      previousAttach: null,
      memoizedProps: {},
      eventCount: 0,
      handlers: {},
      objects: [],
      parent: null,
      ...state
    };
  }

  return object;
}

function resolve(instance, key) {
  let target = instance;

  if (key.includes('-')) {
    const entries = key.split('-');
    const last = entries.pop();
    target = entries.reduce((acc, key) => acc[key], instance);
    return {
      target,
      key: last
    };
  } else return {
    target,
    key
  };
} // Checks if a dash-cased string ends with an integer


const INDEX_REGEX = /-\d+$/;
function attach(parent, child, type) {
  if (is.str(type)) {
    // If attaching into an array (foo-0), create one
    if (INDEX_REGEX.test(type)) {
      const root = type.replace(INDEX_REGEX, '');
      const {
        target,
        key
      } = resolve(parent, root);
      if (!Array.isArray(target[key])) target[key] = [];
    }

    const {
      target,
      key
    } = resolve(parent, type);
    child.__r3f.previousAttach = target[key];
    target[key] = child;
  } else child.__r3f.previousAttach = type(parent, child);
}
function detach(parent, child, type) {
  var _child$__r3f, _child$__r3f2;

  if (is.str(type)) {
    const {
      target,
      key
    } = resolve(parent, type);
    target[key] = child.__r3f.previousAttach;
  } else (_child$__r3f = child.__r3f) == null ? void 0 : _child$__r3f.previousAttach == null ? void 0 : _child$__r3f.previousAttach(parent, child);

  (_child$__r3f2 = child.__r3f) == null ? true : delete _child$__r3f2.previousAttach;
} // This function prepares a set of changes to be applied to the instance

function diffProps(instance, {
  children: cN,
  key: kN,
  ref: rN,
  ...props
}, {
  children: cP,
  key: kP,
  ref: rP,
  ...previous
} = {}, remove = false) {
  var _instance$__r3f;

  const localState = (_instance$__r3f = instance == null ? void 0 : instance.__r3f) != null ? _instance$__r3f : {};
  const entries = Object.entries(props);
  const changes = []; // Catch removed props, prepend them so they can be reset or removed

  if (remove) {
    const previousKeys = Object.keys(previous);

    for (let i = 0; i < previousKeys.length; i++) {
      if (!props.hasOwnProperty(previousKeys[i])) entries.unshift([previousKeys[i], DEFAULT + 'remove']);
    }
  }

  entries.forEach(([key, value]) => {
    var _instance$__r3f2;

    // Bail out on primitive object
    if ((_instance$__r3f2 = instance.__r3f) != null && _instance$__r3f2.primitive && key === 'object') return; // When props match bail out

    if (is.equ(value, previous[key])) return; // Collect handlers and bail out

    if (/^on(Pointer|Click|DoubleClick|ContextMenu|Wheel)/.test(key)) return changes.push([key, value, true, []]); // Split dashed props

    let entries = [];
    if (key.includes('-')) entries = key.split('-');
    changes.push([key, value, false, entries]);
  });
  const memoized = { ...props
  };
  if (localState.memoizedProps && localState.memoizedProps.args) memoized.args = localState.memoizedProps.args;
  if (localState.memoizedProps && localState.memoizedProps.attach) memoized.attach = localState.memoizedProps.attach;
  return {
    memoized,
    changes
  };
} // This function applies a set of changes to the instance

function applyProps$1(instance, data) {
  var _instance$__r3f3, _root$getState;

  // Filter equals, events and reserved props
  const localState = (_instance$__r3f3 = instance == null ? void 0 : instance.__r3f) != null ? _instance$__r3f3 : {};
  const root = localState.root;
  const rootState = (_root$getState = root == null ? void 0 : root.getState == null ? void 0 : root.getState()) != null ? _root$getState : {};
  const {
    memoized,
    changes
  } = isDiffSet(data) ? data : diffProps(instance, data);
  const prevHandlers = localState.eventCount; // Prepare memoized props

  if (instance.__r3f) instance.__r3f.memoizedProps = memoized;
  changes.forEach(([key, value, isEvent, keys]) => {
    let currentInstance = instance;
    let targetProp = currentInstance[key]; // Revolve dashed props

    if (keys.length) {
      targetProp = keys.reduce((acc, key) => acc[key], instance); // If the target is atomic, it forces us to switch the root

      if (!(targetProp && targetProp.set)) {
        const [name, ...reverseEntries] = keys.reverse();
        currentInstance = reverseEntries.reverse().reduce((acc, key) => acc[key], instance);
        key = name;
      }
    } // https://github.com/mrdoob/three.js/issues/21209
    // HMR/fast-refresh relies on the ability to cancel out props, but threejs
    // has no means to do this. Hence we curate a small collection of value-classes
    // with their respective constructor/set arguments
    // For removed props, try to set default values, if possible


    if (value === DEFAULT + 'remove') {
      if (targetProp && targetProp.constructor) {
        // use the prop constructor to find the default it should be
        value = new targetProp.constructor(...memoized.args);
      } else if (currentInstance.constructor) {
        // create a blank slate of the instance and copy the particular parameter.
        // @ts-ignore
        const defaultClassCall = new currentInstance.constructor(...currentInstance.__r3f.memoizedProps.args);
        value = defaultClassCall[targetProp]; // destory the instance

        if (defaultClassCall.dispose) defaultClassCall.dispose(); // instance does not have constructor, just set it to 0
      } else {
        value = 0;
      }
    } // Deal with pointer events ...


    if (isEvent) {
      if (value) localState.handlers[key] = value;else delete localState.handlers[key];
      localState.eventCount = Object.keys(localState.handlers).length;
    } // Special treatment for objects with support for set/copy, and layers
    else if (targetProp && targetProp.set && (targetProp.copy || targetProp instanceof three_module.Layers)) {
        // If value is an array
        if (Array.isArray(value)) {
          if (targetProp.fromArray) targetProp.fromArray(value);else targetProp.set(...value);
        } // Test again target.copy(class) next ...
        else if (targetProp.copy && value && value.constructor && targetProp.constructor.name === value.constructor.name) {
            targetProp.copy(value);
          } // If nothing else fits, just set the single value, ignore undefined
          // https://github.com/pmndrs/react-three-fiber/issues/274
          else if (value !== undefined) {
              const isColor = targetProp instanceof three_module.Color; // Allow setting array scalars

              if (!isColor && targetProp.setScalar) targetProp.setScalar(value); // Layers have no copy function, we must therefore copy the mask property
              else if (targetProp instanceof three_module.Layers && value instanceof three_module.Layers) targetProp.mask = value.mask; // Otherwise just set ...
                else targetProp.set(value); // For versions of three which don't support THREE.ColorManagement,
              // Auto-convert sRGB colors
              // https://github.com/pmndrs/react-three-fiber/issues/344

              const supportsColorManagement = three_module.ColorManagement;
              if (!supportsColorManagement && !rootState.linear && isColor) targetProp.convertSRGBToLinear();
            } // Else, just overwrite the value

      } else {
        currentInstance[key] = value; // Auto-convert sRGB textures, for now ...
        // https://github.com/pmndrs/react-three-fiber/issues/344

        if (!rootState.linear && currentInstance[key] instanceof three_module.Texture) {
          currentInstance[key].encoding = three_module.sRGBEncoding;
        }
      }

    invalidateInstance(instance);
  });

  if (localState.parent && rootState.internal && instance.raycast && prevHandlers !== localState.eventCount) {
    // Pre-emptively remove the instance from the interaction manager
    const index = rootState.internal.interaction.indexOf(instance);
    if (index > -1) rootState.internal.interaction.splice(index, 1); // Add the instance to the interaction manager only when it has handlers

    if (localState.eventCount) rootState.internal.interaction.push(instance);
  } // Call the update lifecycle when it is being updated, but only when it is part of the scene


  if (changes.length && instance.parent) updateInstance(instance);
  return instance;
}
function invalidateInstance(instance) {
  var _instance$__r3f4, _instance$__r3f4$root;

  const state = (_instance$__r3f4 = instance.__r3f) == null ? void 0 : (_instance$__r3f4$root = _instance$__r3f4.root) == null ? void 0 : _instance$__r3f4$root.getState == null ? void 0 : _instance$__r3f4$root.getState();
  if (state && state.internal.frames === 0) state.invalidate();
}
function updateInstance(instance) {
  instance.onUpdate == null ? void 0 : instance.onUpdate(instance);
}
function updateCamera(camera, size) {
  // https://github.com/pmndrs/react-three-fiber/issues/92
  // Do not mess with the camera if it belongs to the user
  if (!camera.manual) {
    if (isOrthographicCamera(camera)) {
      camera.left = size.width / -2;
      camera.right = size.width / 2;
      camera.top = size.height / 2;
      camera.bottom = size.height / -2;
    } else {
      camera.aspect = size.width / size.height;
    }

    camera.updateProjectionMatrix(); // https://github.com/pmndrs/react-three-fiber/issues/178
    // Update matrix world since the renderer is a frame late

    camera.updateMatrixWorld();
  }
}

function makeId(event) {
  return (event.eventObject || event.object).uuid + '/' + event.index + event.instanceId;
} // https://github.com/facebook/react/tree/main/packages/react-reconciler#getcurrenteventpriority
// Gives React a clue as to how import the current interaction is


function getEventPriority() {
  var _window, _window$event;

  let name = (_window = window) == null ? void 0 : (_window$event = _window.event) == null ? void 0 : _window$event.type;

  switch (name) {
    case 'click':
    case 'contextmenu':
    case 'dblclick':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
      return constants.DiscreteEventPriority;

    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'pointerenter':
    case 'pointerleave':
    case 'wheel':
      return constants.ContinuousEventPriority;

    default:
      return constants.DefaultEventPriority;
  }
}
/**
 * Release pointer captures.
 * This is called by releasePointerCapture in the API, and when an object is removed.
 */

function releaseInternalPointerCapture(capturedMap, obj, captures, pointerId) {
  const captureData = captures.get(obj);

  if (captureData) {
    captures.delete(obj); // If this was the last capturing object for this pointer

    if (captures.size === 0) {
      capturedMap.delete(pointerId);
      captureData.target.releasePointerCapture(pointerId);
    }
  }
}

function removeInteractivity(store, object) {
  const {
    events,
    internal
  } = store.getState(); // Removes every trace of an object from the data store

  internal.interaction = internal.interaction.filter(o => o !== object);
  internal.initialHits = internal.initialHits.filter(o => o !== object);
  internal.hovered.forEach((value, key) => {
    if (value.eventObject === object || value.object === object) {
      // Clear out intersects, they are outdated by now
      internal.hovered.delete(key);
    }
  });
  internal.capturedMap.forEach((captures, pointerId) => {
    releaseInternalPointerCapture(internal.capturedMap, object, captures, pointerId);
  });
}
function createEvents(store) {
  const temp = new three_module.Vector3();
  /** Calculates delta */

  function calculateDistance(event) {
    const {
      internal
    } = store.getState();
    const dx = event.offsetX - internal.initialClick[0];
    const dy = event.offsetY - internal.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }
  /** Returns true if an instance has a valid pointer-event registered, this excludes scroll, clicks etc */


  function filterPointerEvents(objects) {
    return objects.filter(obj => ['Move', 'Over', 'Enter', 'Out', 'Leave'].some(name => {
      var _r3f;

      return (_r3f = obj.__r3f) == null ? void 0 : _r3f.handlers['onPointer' + name];
    }));
  }

  function intersect(event, filter) {
    const state = store.getState();
    const duplicates = new Set();
    const intersections = []; // Allow callers to eliminate event objects

    const eventsObjects = filter ? filter(state.internal.interaction) : state.internal.interaction; // Reset all raycaster cameras to undefined

    eventsObjects.forEach(obj => {
      const state = getRootState(obj);

      if (state) {
        state.raycaster.camera = undefined;
      }
    });

    if (!state.previousRoot) {
      // Make sure root-level pointer and ray are set up
      state.events.compute == null ? void 0 : state.events.compute(event, state);
    } // Collect events


    let hits = eventsObjects // Intersect objects
    .flatMap(obj => {
      const state = getRootState(obj); // Skip event handling when noEvents is set, or when the raycasters camera is null

      if (!state || !state.events.enabled || state.raycaster.camera === null) return []; // When the camera is undefined we have to call the event layers update function

      if (state.raycaster.camera === undefined) {
        var _state$previousRoot;

        state.events.compute == null ? void 0 : state.events.compute(event, state, (_state$previousRoot = state.previousRoot) == null ? void 0 : _state$previousRoot.getState()); // If the camera is still undefined we have to skip this layer entirely

        if (state.raycaster.camera === undefined) state.raycaster.camera = null;
      } // Intersect object by object


      return state.raycaster.camera ? state.raycaster.intersectObject(obj, true) : [];
    }) // Sort by event priority and distance
    .sort((a, b) => {
      const aState = getRootState(a.object);
      const bState = getRootState(b.object);
      if (!aState || !bState) return 0;
      return bState.events.priority - aState.events.priority || a.distance - b.distance;
    }) // Filter out duplicates
    .filter(item => {
      const id = makeId(item);
      if (duplicates.has(id)) return false;
      duplicates.add(id);
      return true;
    }); // https://github.com/mrdoob/three.js/issues/16031
    // Allow custom userland intersect sort order, this likely only makes sense on the root filter

    if (state.events.filter) hits = state.events.filter(hits, state); // Bubble up the events, find the event source (eventObject)

    for (const hit of hits) {
      let eventObject = hit.object; // Bubble event up

      while (eventObject) {
        var _r3f2;

        if ((_r3f2 = eventObject.__r3f) != null && _r3f2.eventCount) intersections.push({ ...hit,
          eventObject
        });
        eventObject = eventObject.parent;
      }
    } // If the interaction is captured, make all capturing targets part of the intersect.


    if ('pointerId' in event && state.internal.capturedMap.has(event.pointerId)) {
      for (let captureData of state.internal.capturedMap.get(event.pointerId).values()) {
        intersections.push(captureData.intersection);
      }
    }

    return intersections;
  }
  /**  Handles intersections by forwarding them to handlers */


  function handleIntersects(intersections, event, delta, callback) {
    const {
      raycaster,
      pointer,
      camera,
      internal
    } = store.getState(); // If anything has been found, forward it to the event listeners

    if (intersections.length) {
      const unprojectedPoint = temp.set(pointer.x, pointer.y, 0).unproject(camera);
      const localState = {
        stopped: false
      };

      for (const hit of intersections) {
        const hasPointerCapture = id => {
          var _internal$capturedMap, _internal$capturedMap2;

          return (_internal$capturedMap = (_internal$capturedMap2 = internal.capturedMap.get(id)) == null ? void 0 : _internal$capturedMap2.has(hit.eventObject)) != null ? _internal$capturedMap : false;
        };

        const setPointerCapture = id => {
          const captureData = {
            intersection: hit,
            target: event.target
          };

          if (internal.capturedMap.has(id)) {
            // if the pointerId was previously captured, we add the hit to the
            // event capturedMap.
            internal.capturedMap.get(id).set(hit.eventObject, captureData);
          } else {
            // if the pointerId was not previously captured, we create a map
            // containing the hitObject, and the hit. hitObject is used for
            // faster access.
            internal.capturedMap.set(id, new Map([[hit.eventObject, captureData]]));
          } // Call the original event now
          event.target.setPointerCapture(id);
        };

        const releasePointerCapture = id => {
          const captures = internal.capturedMap.get(id);

          if (captures) {
            releaseInternalPointerCapture(internal.capturedMap, hit.eventObject, captures, id);
          }
        }; // Add native event props


        let extractEventProps = {}; // This iterates over the event's properties including the inherited ones. Native PointerEvents have most of their props as getters which are inherited, but polyfilled PointerEvents have them all as their own properties (i.e. not inherited). We can't use Object.keys() or Object.entries() as they only return "own" properties; nor Object.getPrototypeOf(event) as that *doesn't* return "own" properties, only inherited ones.

        for (let prop in event) {
          let property = event[prop]; // Only copy over atomics, leave functions alone as these should be
          // called as event.nativeEvent.fn()

          if (typeof property !== 'function') extractEventProps[prop] = property;
        }

        let raycastEvent = { ...hit,
          ...extractEventProps,
          pointer,
          intersections,
          stopped: localState.stopped,
          delta,
          unprojectedPoint,
          ray: raycaster.ray,
          camera: camera,
          // Hijack stopPropagation, which just sets a flag
          stopPropagation: () => {
            // https://github.com/pmndrs/react-three-fiber/issues/596
            // Events are not allowed to stop propagation if the pointer has been captured
            const capturesForPointer = 'pointerId' in event && internal.capturedMap.get(event.pointerId); // We only authorize stopPropagation...

            if ( // ...if this pointer hasn't been captured
            !capturesForPointer || // ... or if the hit object is capturing the pointer
            capturesForPointer.has(hit.eventObject)) {
              raycastEvent.stopped = localState.stopped = true; // Propagation is stopped, remove all other hover records
              // An event handler is only allowed to flush other handlers if it is hovered itself

              if (internal.hovered.size && Array.from(internal.hovered.values()).find(i => i.eventObject === hit.eventObject)) {
                // Objects cannot flush out higher up objects that have already caught the event
                const higher = intersections.slice(0, intersections.indexOf(hit));
                cancelPointer([...higher, hit]);
              }
            }
          },
          // there should be a distinction between target and currentTarget
          target: {
            hasPointerCapture,
            setPointerCapture,
            releasePointerCapture
          },
          currentTarget: {
            hasPointerCapture,
            setPointerCapture,
            releasePointerCapture
          },
          nativeEvent: event
        }; // Call subscribers

        callback(raycastEvent); // Event bubbling may be interrupted by stopPropagation

        if (localState.stopped === true) break;
      }
    }

    return intersections;
  }

  function cancelPointer(hits) {
    const {
      internal
    } = store.getState();
    Array.from(internal.hovered.values()).forEach(hoveredObj => {
      // When no objects were hit or the the hovered object wasn't found underneath the cursor
      // we call onPointerOut and delete the object from the hovered-elements map
      if (!hits.length || !hits.find(hit => hit.object === hoveredObj.object && hit.index === hoveredObj.index && hit.instanceId === hoveredObj.instanceId)) {
        const eventObject = hoveredObj.eventObject;
        const instance = eventObject.__r3f;
        const handlers = instance == null ? void 0 : instance.handlers;
        internal.hovered.delete(makeId(hoveredObj));

        if (instance != null && instance.eventCount) {
          // Clear out intersects, they are outdated by now
          const data = { ...hoveredObj,
            intersections: hits || []
          };
          handlers.onPointerOut == null ? void 0 : handlers.onPointerOut(data);
          handlers.onPointerLeave == null ? void 0 : handlers.onPointerLeave(data);
        }
      }
    });
  }

  const handlePointer = name => {
    // Deal with cancelation
    switch (name) {
      case 'onPointerLeave':
      case 'onPointerCancel':
        return () => cancelPointer([]);

      case 'onLostPointerCapture':
        return event => {
          const {
            internal
          } = store.getState();

          if ('pointerId' in event && !internal.capturedMap.has(event.pointerId)) {
            // If the object event interface had onLostPointerCapture, we'd call it here on every
            // object that's getting removed.
            internal.capturedMap.delete(event.pointerId);
            cancelPointer([]);
          }
        };
    } // Any other pointer goes here ...


    return event => {
      const {
        onPointerMissed,
        internal
      } = store.getState(); //prepareRay(event)

      internal.lastEvent.current = event; // Get fresh intersects

      const isPointerMove = name === 'onPointerMove';
      const isClickEvent = name === 'onClick' || name === 'onContextMenu' || name === 'onDoubleClick';
      const filter = isPointerMove ? filterPointerEvents : undefined; //const hits = patchIntersects(intersect(filter), event)

      const hits = intersect(event, filter);
      const delta = isClickEvent ? calculateDistance(event) : 0; // Save initial coordinates on pointer-down

      if (name === 'onPointerDown') {
        internal.initialClick = [event.offsetX, event.offsetY];
        internal.initialHits = hits.map(hit => hit.eventObject);
      } // If a click yields no results, pass it back to the user as a miss
      // Missed events have to come first in order to establish user-land side-effect clean up


      if (isClickEvent && !hits.length) {
        if (delta <= 2) {
          pointerMissed(event, internal.interaction);
          if (onPointerMissed) onPointerMissed(event);
        }
      } // Take care of unhover


      if (isPointerMove) cancelPointer(hits);
      handleIntersects(hits, event, delta, data => {
        const eventObject = data.eventObject;
        const instance = eventObject.__r3f;
        const handlers = instance == null ? void 0 : instance.handlers; // Check presence of handlers

        if (!(instance != null && instance.eventCount)) return;

        if (isPointerMove) {
          // Move event ...
          if (handlers.onPointerOver || handlers.onPointerEnter || handlers.onPointerOut || handlers.onPointerLeave) {
            // When enter or out is present take care of hover-state
            const id = makeId(data);
            const hoveredItem = internal.hovered.get(id);

            if (!hoveredItem) {
              // If the object wasn't previously hovered, book it and call its handler
              internal.hovered.set(id, data);
              handlers.onPointerOver == null ? void 0 : handlers.onPointerOver(data);
              handlers.onPointerEnter == null ? void 0 : handlers.onPointerEnter(data);
            } else if (hoveredItem.stopped) {
              // If the object was previously hovered and stopped, we shouldn't allow other items to proceed
              data.stopPropagation();
            }
          } // Call mouse move


          handlers.onPointerMove == null ? void 0 : handlers.onPointerMove(data);
        } else {
          // All other events ...
          const handler = handlers[name];

          if (handler) {
            // Forward all events back to their respective handlers with the exception of click events,
            // which must use the initial target
            if (!isClickEvent || internal.initialHits.includes(eventObject)) {
              // Missed events have to come first
              pointerMissed(event, internal.interaction.filter(object => !internal.initialHits.includes(object))); // Now call the handler

              handler(data);
            }
          } else {
            // Trigger onPointerMissed on all elements that have pointer over/out handlers, but not click and weren't hit
            if (isClickEvent && internal.initialHits.includes(eventObject)) {
              pointerMissed(event, internal.interaction.filter(object => !internal.initialHits.includes(object)));
            }
          }
        }
      });
    };
  };

  function pointerMissed(event, objects) {
    objects.forEach(object => {
      var _r3f3;

      return (_r3f3 = object.__r3f) == null ? void 0 : _r3f3.handlers.onPointerMissed == null ? void 0 : _r3f3.handlers.onPointerMissed(event);
    });
  }

  return {
    handlePointer
  };
}

let catalogue = {};

let extend = objects => void (catalogue = { ...catalogue,
  ...objects
});

function createRenderer(roots, getEventPriority) {
  function createInstance(type, {
    args = [],
    attach,
    ...props
  }, root) {
    let name = `${type[0].toUpperCase()}${type.slice(1)}`;
    let instance; // Auto-attach geometries and materials

    if (attach === undefined) {
      if (name.endsWith('Geometry')) attach = 'geometry';else if (name.endsWith('Material')) attach = 'material';
    }

    if (type === 'primitive') {
      if (props.object === undefined) throw `Primitives without 'object' are invalid!`;
      const object = props.object;
      instance = prepare(object, {
        type,
        root,
        attach,
        primitive: true
      });
    } else {
      const target = catalogue[name];

      if (!target) {
        throw `${name} is not part of the THREE namespace! Did you forget to extend? See: https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#using-3rd-party-objects-declaratively`;
      } // Throw if an object or literal was passed for args


      if (!Array.isArray(args)) throw 'The args prop must be an array!'; // Instanciate new object, link it to the root
      // Append memoized props with args so it's not forgotten

      instance = prepare(new target(...args), {
        type,
        root,
        attach,
        // TODO: Figure out what this is for
        memoizedProps: {
          args
        }
      });
    } // It should NOT call onUpdate on object instanciation, because it hasn't been added to the
    // view yet. If the callback relies on references for instance, they won't be ready yet, this is
    // why it passes "true" here
    // There is no reason to apply props to injects


    if (name !== 'inject') applyProps$1(instance, props);
    return instance;
  }

  function appendChild(parentInstance, child) {
    let added = false;

    if (child) {
      var _child$__r3f, _parentInstance$__r3f;

      // The attach attribute implies that the object attaches itself on the parent
      if ((_child$__r3f = child.__r3f) != null && _child$__r3f.attach) {
        attach(parentInstance, child, child.__r3f.attach);
      } else if (child.isObject3D && parentInstance.isObject3D) {
        // add in the usual parent-child way
        parentInstance.add(child);
        added = true;
      } // This is for anything that used attach, and for non-Object3Ds that don't get attached to props;
      // that is, anything that's a child in React but not a child in the scenegraph.


      if (!added) (_parentInstance$__r3f = parentInstance.__r3f) == null ? void 0 : _parentInstance$__r3f.objects.push(child);
      if (!child.__r3f) prepare(child, {});
      child.__r3f.parent = parentInstance;
      updateInstance(child);
      invalidateInstance(child);
    }
  }

  function insertBefore(parentInstance, child, beforeChild) {
    let added = false;

    if (child) {
      var _child$__r3f2, _parentInstance$__r3f2;

      if ((_child$__r3f2 = child.__r3f) != null && _child$__r3f2.attach) {
        attach(parentInstance, child, child.__r3f.attach);
      } else if (child.isObject3D && parentInstance.isObject3D) {
        child.parent = parentInstance;
        child.dispatchEvent({
          type: 'added'
        });
        const restSiblings = parentInstance.children.filter(sibling => sibling !== child);
        const index = restSiblings.indexOf(beforeChild);
        parentInstance.children = [...restSiblings.slice(0, index), child, ...restSiblings.slice(index)];
        added = true;
      }

      if (!added) (_parentInstance$__r3f2 = parentInstance.__r3f) == null ? void 0 : _parentInstance$__r3f2.objects.push(child);
      if (!child.__r3f) prepare(child, {});
      child.__r3f.parent = parentInstance;
      updateInstance(child);
      invalidateInstance(child);
    }
  }

  function removeRecursive(array, parent, dispose = false) {
    if (array) [...array].forEach(child => removeChild(parent, child, dispose));
  }

  function removeChild(parentInstance, child, dispose) {
    if (child) {
      var _parentInstance$__r3f3, _child$__r3f3, _child$__r3f5;

      // Clear the parent reference
      if (child.__r3f) child.__r3f.parent = null; // Remove child from the parents objects

      if ((_parentInstance$__r3f3 = parentInstance.__r3f) != null && _parentInstance$__r3f3.objects) parentInstance.__r3f.objects = parentInstance.__r3f.objects.filter(x => x !== child); // Remove attachment

      if ((_child$__r3f3 = child.__r3f) != null && _child$__r3f3.attach) {
        detach(parentInstance, child, child.__r3f.attach);
      } else if (child.isObject3D && parentInstance.isObject3D) {
        var _child$__r3f4;

        parentInstance.remove(child); // Remove interactivity

        if ((_child$__r3f4 = child.__r3f) != null && _child$__r3f4.root) {
          removeInteractivity(child.__r3f.root, child);
        }
      } // Allow objects to bail out of recursive dispose alltogether by passing dispose={null}
      // Never dispose of primitives because their state may be kept outside of React!
      // In order for an object to be able to dispose it has to have
      //   - a dispose method,
      //   - it cannot be a <primitive object={...} />
      //   - it cannot be a THREE.Scene, because three has broken it's own api
      //
      // Since disposal is recursive, we can check the optional dispose arg, which will be undefined
      // when the reconciler calls it, but then carry our own check recursively


      const isPrimitive = (_child$__r3f5 = child.__r3f) == null ? void 0 : _child$__r3f5.primitive;
      const shouldDispose = dispose === undefined ? child.dispose !== null && !isPrimitive : dispose; // Remove nested child objects. Primitives should not have objects and children that are
      // attached to them declaratively ...

      if (!isPrimitive) {
        var _child$__r3f6;

        removeRecursive((_child$__r3f6 = child.__r3f) == null ? void 0 : _child$__r3f6.objects, child, shouldDispose);
        removeRecursive(child.children, child, shouldDispose);
      } // Remove references


      if (child.__r3f) {
        delete child.__r3f.root;
        delete child.__r3f.objects;
        delete child.__r3f.handlers;
        delete child.__r3f.memoizedProps;
        if (!isPrimitive) delete child.__r3f;
      } // Dispose item whenever the reconciler feels like it


      if (shouldDispose && child.dispose && child.type !== 'Scene') {
        (0,scheduler.unstable_scheduleCallback)(scheduler.unstable_IdlePriority, () => {
          try {
            child.dispose();
          } catch (e) {
            /* ... */
          }
        });
      }

      invalidateInstance(parentInstance);
    }
  }

  function switchInstance(instance, type, newProps, fiber) {
    var _instance$__r3f, _instance$__r3f2;

    const parent = (_instance$__r3f = instance.__r3f) == null ? void 0 : _instance$__r3f.parent;
    if (!parent) return;
    const newInstance = createInstance(type, newProps, (_instance$__r3f2 = instance.__r3f) == null ? void 0 : _instance$__r3f2.root); // https://github.com/pmndrs/react-three-fiber/issues/1348
    // When args change the instance has to be re-constructed, which then
    // forces r3f to re-parent the children and non-scene objects
    // This can not include primitives, which should not have declarative children

    if (type !== 'primitive' && instance.children) {
      instance.children.forEach(child => appendChild(newInstance, child));
      instance.children = [];
    }

    instance.__r3f.objects.forEach(child => appendChild(newInstance, child));

    instance.__r3f.objects = [];
    removeChild(parent, instance);
    appendChild(parent, newInstance); // Re-bind event handlers

    if (newInstance.raycast && newInstance.__r3f.eventCount) {
      const rootState = newInstance.__r3f.root.getState();

      rootState.internal.interaction.push(newInstance);
    } // This evil hack switches the react-internal fiber node
    [fiber, fiber.alternate].forEach(fiber => {
      if (fiber !== null) {
        fiber.stateNode = newInstance;

        if (fiber.ref) {
          if (typeof fiber.ref === 'function') fiber.ref(newInstance);else fiber.ref.current = newInstance;
        }
      }
    });
  }

  const reconciler = react_reconciler_default()({
    createInstance,
    removeChild,
    appendChild,
    appendInitialChild: appendChild,
    insertBefore,
    supportsMicrotask: true,
    warnsIfNotActing: true,
    supportsMutation: true,
    isPrimaryRenderer: false,
    noTimeout: -1,
    appendChildToContainer: (container, child) => {
      const scene = container.getState().scene; // Link current root to the default scene

      scene.__r3f.root = container;
      appendChild(scene, child);
    },
    removeChildFromContainer: (container, child) => removeChild(container.getState().scene, child),
    insertInContainerBefore: (container, child, beforeChild) => insertBefore(container.getState().scene, child, beforeChild),
    getRootHostContext: () => null,
    getChildHostContext: parentHostContext => parentHostContext,

    finalizeInitialChildren(instance) {
      var _instance$__r3f3;

      const localState = (_instance$__r3f3 = instance == null ? void 0 : instance.__r3f) != null ? _instance$__r3f3 : {}; // https://github.com/facebook/react/issues/20271
      // Returning true will trigger commitMount

      return !!localState.handlers;
    },

    prepareUpdate(instance, type, oldProps, newProps) {
      // Create diff-sets
      if (instance.__r3f.primitive && newProps.object && newProps.object !== instance) {
        return [true];
      } else {
        // This is a data object, let's extract critical information about it
        const {
          args: argsNew = [],
          children: cN,
          ...restNew
        } = newProps;
        const {
          args: argsOld = [],
          children: cO,
          ...restOld
        } = oldProps; // Throw if an object or literal was passed for args

        if (!Array.isArray(argsNew)) throw 'The args prop must be an array!'; // If it has new props or arguments, then it needs to be re-instanciated

        if (argsNew.some((value, index) => value !== argsOld[index])) return [true]; // Create a diff-set, flag if there are any changes

        const diff = diffProps(instance, restNew, restOld, true);
        if (diff.changes.length) return [false, diff]; // Otherwise do not touch the instance

        return null;
      }
    },

    commitUpdate(instance, [reconstruct, diff], type, oldProps, newProps, fiber) {
      // Reconstruct when args or <primitive object={...} have changes
      if (reconstruct) switchInstance(instance, type, newProps, fiber); // Otherwise just overwrite props
      else applyProps$1(instance, diff);
    },

    commitMount(instance, type, props, int) {
      var _instance$__r3f4;

      // https://github.com/facebook/react/issues/20271
      // This will make sure events are only added once to the central container
      const localState = (_instance$__r3f4 = instance == null ? void 0 : instance.__r3f) != null ? _instance$__r3f4 : {};

      if (instance.raycast && localState.handlers && localState.eventCount) {
        instance.__r3f.root.getState().internal.interaction.push(instance);
      }
    },

    getPublicInstance: instance => instance,
    shouldDeprioritizeSubtree: () => false,
    prepareForCommit: () => null,
    preparePortalMount: container => prepare(container.getState().scene),
    resetAfterCommit: () => {},
    shouldSetTextContent: () => false,
    clearContainer: () => false,
    detachDeletedInstance: () => {},
    createTextInstance: () => {},

    hideInstance(instance) {
      var _instance$__r3f5;

      // Deatch while the instance is hidden
      const {
        attach: type,
        parent
      } = (_instance$__r3f5 = instance == null ? void 0 : instance.__r3f) != null ? _instance$__r3f5 : {};
      if (type && parent) detach(parent, instance, type);
      if (instance.isObject3D) instance.visible = false;
      invalidateInstance(instance);
    },

    unhideInstance(instance, props) {
      var _instance$__r3f6;

      // Re-attach when the instance is unhidden
      const {
        attach: type,
        parent
      } = (_instance$__r3f6 = instance == null ? void 0 : instance.__r3f) != null ? _instance$__r3f6 : {};
      if (type && parent) attach(parent, instance, type);
      if (instance.isObject3D && props.visible == null || props.visible) instance.visible = true;
      invalidateInstance(instance);
    },

    hideTextInstance: () => {
      throw new Error('Text is not allowed in the R3F tree.');
    },
    // prettier-ignore
    getCurrentEventPriority: () => getEventPriority ? getEventPriority() : constants.DefaultEventPriority,
    // @ts-ignore
    now: typeof performance !== 'undefined' && is.fun(performance.now) ? performance.now : is.fun(Date.now) ? Date.now : undefined,
    // @ts-ignore
    scheduleTimeout: is.fun(setTimeout) ? setTimeout : undefined,
    // @ts-ignore
    cancelTimeout: is.fun(clearTimeout) ? clearTimeout : undefined,
    setTimeout: is.fun(setTimeout) ? setTimeout : undefined,
    clearTimeout: is.fun(clearTimeout) ? clearTimeout : undefined
  });
  return {
    reconciler,
    applyProps: applyProps$1
  };
}

const isRenderer = def => !!(def != null && def.render);
const context = /*#__PURE__*/react.createContext(null);

const index_91152509_esm_createStore = (invalidate, advance) => {
  const rootState = esm_create((set, get) => {
    const position = new three_module.Vector3();
    const defaultTarget = new three_module.Vector3();
    const tempTarget = new three_module.Vector3();

    function getCurrentViewport(camera = get().camera, target = defaultTarget, size = get().size) {
      const {
        width,
        height
      } = size;
      const aspect = width / height;
      if (target instanceof three_module.Vector3) tempTarget.copy(target);else tempTarget.set(...target);
      const distance = camera.getWorldPosition(position).distanceTo(tempTarget);

      if (isOrthographicCamera(camera)) {
        return {
          width: width / camera.zoom,
          height: height / camera.zoom,
          factor: 1,
          distance,
          aspect
        };
      } else {
        const fov = camera.fov * Math.PI / 180; // convert vertical fov to radians

        const h = 2 * Math.tan(fov / 2) * distance; // visible height

        const w = h * (width / height);
        return {
          width: w,
          height: h,
          factor: width / w,
          distance,
          aspect
        };
      }
    }

    let performanceTimeout = undefined;

    const setPerformanceCurrent = current => set(state => ({
      performance: { ...state.performance,
        current
      }
    }));

    const pointer = new three_module.Vector2();
    return {
      set,
      get,
      // Mock objects that have to be configured
      gl: null,
      camera: null,
      raycaster: null,
      events: {
        priority: 1,
        enabled: true,
        connected: false
      },
      xr: null,
      invalidate: () => invalidate(get()),
      advance: (timestamp, runGlobalEffects) => advance(timestamp, runGlobalEffects, get()),
      legacy: false,
      linear: false,
      flat: false,
      scene: prepare(new three_module.Scene()),
      controls: null,
      clock: new three_module.Clock(),
      pointer,
      mouse: pointer,
      frameloop: 'always',
      onPointerMissed: undefined,
      performance: {
        current: 1,
        min: 0.5,
        max: 1,
        debounce: 200,
        regress: () => {
          const state = get(); // Clear timeout

          if (performanceTimeout) clearTimeout(performanceTimeout); // Set lower bound performance

          if (state.performance.current !== state.performance.min) setPerformanceCurrent(state.performance.min); // Go back to upper bound performance after a while unless something regresses meanwhile

          performanceTimeout = setTimeout(() => setPerformanceCurrent(get().performance.max), state.performance.debounce);
        }
      },
      size: {
        width: 0,
        height: 0
      },
      viewport: {
        initialDpr: 0,
        dpr: 0,
        width: 0,
        height: 0,
        aspect: 0,
        distance: 0,
        factor: 0,
        getCurrentViewport
      },
      setEvents: events => set(state => ({ ...state,
        events: { ...state.events,
          ...events
        }
      })),
      setSize: (width, height) => {
        const camera = get().camera;
        const size = {
          width,
          height
        };
        set(state => ({
          size,
          viewport: { ...state.viewport,
            ...getCurrentViewport(camera, defaultTarget, size)
          }
        }));
      },
      setDpr: dpr => set(state => {
        const resolved = calculateDpr(dpr);
        return {
          viewport: { ...state.viewport,
            dpr: resolved,
            initialDpr: state.viewport.initialDpr || resolved
          }
        };
      }),
      setFrameloop: (frameloop = 'always') => {
        const clock = get().clock; // if frameloop === "never" clock.elapsedTime is updated using advance(timestamp)

        clock.stop();
        clock.elapsedTime = 0;

        if (frameloop !== 'never') {
          clock.start();
          clock.elapsedTime = 0;
        }

        set(() => ({
          frameloop
        }));
      },
      previousRoot: undefined,
      internal: {
        active: false,
        priority: 0,
        frames: 0,
        lastEvent: /*#__PURE__*/react.createRef(),
        interaction: [],
        hovered: new Map(),
        subscribers: [],
        initialClick: [0, 0],
        initialHits: [],
        capturedMap: new Map(),
        subscribe: (ref, priority, store) => {
          set(({
            internal
          }) => ({
            internal: { ...internal,
              // If this subscription was given a priority, it takes rendering into its own hands
              // For that reason we switch off automatic rendering and increase the manual flag
              // As long as this flag is positive there can be no internal rendering at all
              // because there could be multiple render subscriptions
              priority: internal.priority + (priority > 0 ? 1 : 0),
              // Register subscriber and sort layers from lowest to highest, meaning,
              // highest priority renders last (on top of the other frames)
              subscribers: [...internal.subscribers, {
                ref,
                priority,
                store
              }].sort((a, b) => a.priority - b.priority)
            }
          }));
          return () => {
            set(({
              internal
            }) => ({
              internal: { ...internal,
                // Decrease manual flag if this subscription had a priority
                priority: internal.priority - (priority > 0 ? 1 : 0),
                // Remove subscriber from list
                subscribers: internal.subscribers.filter(s => s.ref !== ref)
              }
            }));
          };
        }
      }
    };
  });
  const state = rootState.getState(); // Resize camera and renderer on changes to size and pixelratio

  let oldSize = state.size;
  let oldDpr = state.viewport.dpr;
  rootState.subscribe(() => {
    const {
      camera,
      size,
      viewport,
      gl
    } = rootState.getState();

    if (size !== oldSize || viewport.dpr !== oldDpr) {
      updateCamera(camera, size); // Update renderer

      gl.setPixelRatio(viewport.dpr);
      gl.setSize(size.width, size.height);
      oldSize = size;
      oldDpr = viewport.dpr;
    }
  }); // Invalidate on any change

  rootState.subscribe(state => invalidate(state)); // Return root state

  return rootState;
};

function createSubs(callback, subs) {
  const index = subs.length;
  subs.push(callback);
  return () => void subs.splice(index, 1);
}

let i;
let globalEffects = [];
let globalAfterEffects = [];
let globalTailEffects = [];
/**
 * Adds a global render callback which is called each frame.
 * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#addEffect
 */

const addEffect = callback => createSubs(callback, globalEffects);
/**
 * Adds a global after-render callback which is called each frame.
 * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#addAfterEffect
 */

const addAfterEffect = callback => createSubs(callback, globalAfterEffects);
/**
 * Adds a global callback which is called when rendering stops.
 * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#addTail
 */

const addTail = callback => createSubs(callback, globalTailEffects);

function run(effects, timestamp) {
  for (i = 0; i < effects.length; i++) effects[i](timestamp);
}

let subscribers;
let subscription;

function render$1(timestamp, state, frame) {
  // Run local effects
  let delta = state.clock.getDelta(); // In frameloop='never' mode, clock times are updated using the provided timestamp

  if (state.frameloop === 'never' && typeof timestamp === 'number') {
    delta = timestamp - state.clock.elapsedTime;
    state.clock.oldTime = state.clock.elapsedTime;
    state.clock.elapsedTime = timestamp;
  } // Call subscribers (useFrame)


  subscribers = state.internal.subscribers;

  for (i = 0; i < subscribers.length; i++) {
    subscription = subscribers[i];
    subscription.ref.current(subscription.store.getState(), delta, frame);
  } // Render content


  if (!state.internal.priority && state.gl.render) state.gl.render(state.scene, state.camera); // Decrease frame count

  state.internal.frames = Math.max(0, state.internal.frames - 1);
  return state.frameloop === 'always' ? 1 : state.internal.frames;
}

function createLoop(roots) {
  let running = false;
  let repeat;
  let frame;
  let state;

  function loop(timestamp) {
    frame = requestAnimationFrame(loop);
    running = true;
    repeat = 0; // Run effects

    if (globalEffects.length) run(globalEffects, timestamp); // Render all roots

    roots.forEach(root => {
      var _state$gl$xr;

      state = root.store.getState(); // If the frameloop is invalidated, do not run another frame

      if (state.internal.active && (state.frameloop === 'always' || state.internal.frames > 0) && !((_state$gl$xr = state.gl.xr) != null && _state$gl$xr.isPresenting)) {
        repeat += render$1(timestamp, state);
      }
    }); // Run after-effects

    if (globalAfterEffects.length) run(globalAfterEffects, timestamp); // Stop the loop if nothing invalidates it

    if (repeat === 0) {
      // Tail call effects, they are called when rendering stops
      if (globalTailEffects.length) run(globalTailEffects, timestamp); // Flag end of operation

      running = false;
      return cancelAnimationFrame(frame);
    }
  }

  function invalidate(state) {
    var _state$gl$xr2;

    if (!state) return roots.forEach(root => invalidate(root.store.getState()));
    if ((_state$gl$xr2 = state.gl.xr) != null && _state$gl$xr2.isPresenting || !state.internal.active || state.frameloop === 'never') return; // Increase frames, do not go higher than 60

    state.internal.frames = Math.min(60, state.internal.frames + 1); // If the render-loop isn't active, start it

    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  function advance(timestamp, runGlobalEffects = true, state, frame) {
    if (runGlobalEffects) run(globalEffects, timestamp);
    if (!state) roots.forEach(root => render$1(timestamp, root.store.getState()));else render$1(timestamp, state, frame);
    if (runGlobalEffects) run(globalAfterEffects, timestamp);
  }

  return {
    loop,

    /**
     * Invalidates the view, requesting a frame to be rendered. Will globally invalidate unless passed a root's state.
     * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#invalidate
     */
    invalidate,

    /**
     * Advances the frameloop and runs render effects, useful for when manually rendering via `frameloop="never"`.
     * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#advance
     */
    advance
  };
}

function useStore() {
  const store = react.useContext(context);
  if (!store) throw `R3F hooks can only be used within the Canvas component!`;
  return store;
}
/**
 * Accesses R3F's internal state, containing renderer, canvas, scene, etc.
 * @see https://docs.pmnd.rs/react-three-fiber/api/hooks#usethree
 */

function useThree(selector = state => state, equalityFn) {
  return useStore()(selector, equalityFn);
}
/**
 * Executes a callback before render in a shared frame loop.
 * Can order effects with render priority or manually render with a positive priority.
 * @see https://docs.pmnd.rs/react-three-fiber/api/hooks#useframe
 */

function useFrame(callback, renderPriority = 0) {
  const store = useStore();
  const subscribe = store.getState().internal.subscribe; // Memoize ref

  const ref = useMutableCallback(callback); // Subscribe on mount, unsubscribe on unmount

  index_91152509_esm_useIsomorphicLayoutEffect(() => subscribe(ref, renderPriority, store), [renderPriority, subscribe, store]);
  return null;
}
/**
 * Returns a node graph of an object with named nodes & materials.
 * @see https://docs.pmnd.rs/react-three-fiber/api/hooks#usegraph
 */

function useGraph(object) {
  return React.useMemo(() => buildGraph(object), [object]);
}

function loadingFn(extensions, onProgress) {
  return function (Proto, ...input) {
    // Construct new loader and run extensions
    const loader = new Proto();
    if (extensions) extensions(loader); // Go through the urls and load them

    return Promise.all(input.map(input => new Promise((res, reject) => loader.load(input, data => {
      if (data.scene) Object.assign(data, buildGraph(data.scene));
      res(data);
    }, onProgress, error => reject(`Could not load ${input}: ${error.message}`)))));
  };
}
/**
 * Synchronously loads and caches assets with a three loader.
 *
 * Note: this hook's caller must be wrapped with `React.Suspense`
 * @see https://docs.pmnd.rs/react-three-fiber/api/hooks#useloader
 */


function useLoader(Proto, input, extensions, onProgress) {
  // Use suspense to load async assets
  const keys = Array.isArray(input) ? input : [input];
  const results = suspend(loadingFn(extensions, onProgress), [Proto, ...keys], {
    equal: is.equ
  }); // Return the object/s

  return Array.isArray(input) ? results : results[0];
}
/**
 * Preloads an asset into cache as a side-effect.
 */

useLoader.preload = function (Proto, input, extensions) {
  const keys = Array.isArray(input) ? input : [input];
  return preload(loadingFn(extensions), [Proto, ...keys]);
};
/**
 * Removes a loaded asset from cache.
 */


useLoader.clear = function (Proto, input) {
  const keys = Array.isArray(input) ? input : [input];
  return clear([Proto, ...keys]);
};

const roots = new Map();
const {
  invalidate,
  advance
} = createLoop(roots);
const {
  reconciler,
  applyProps
} = createRenderer(roots, getEventPriority);
const shallowLoose = {
  objects: 'shallow',
  strict: false
};

const createRendererInstance = (gl, canvas) => {
  const customRenderer = typeof gl === 'function' ? gl(canvas) : gl;
  if (isRenderer(customRenderer)) return customRenderer;else return new three_module.WebGLRenderer({
    powerPreference: 'high-performance',
    canvas: canvas,
    antialias: true,
    alpha: true,
    ...gl
  });
};

function createRoot(canvas) {
  // Check against mistaken use of createRoot
  let prevRoot = roots.get(canvas);
  let prevFiber = prevRoot == null ? void 0 : prevRoot.fiber;
  let prevStore = prevRoot == null ? void 0 : prevRoot.store;
  if (prevRoot) console.warn('R3F.createRoot should only be called once!'); // Create store

  const store = prevStore || index_91152509_esm_createStore(invalidate, advance); // Create renderer

  const fiber = prevFiber || reconciler.createContainer(store, constants.ConcurrentRoot, false, null); // Map it

  if (!prevRoot) roots.set(canvas, {
    fiber,
    store
  }); // Locals

  let onCreated;
  let configured = false;
  return {
    configure(props = {}) {
      var _canvas$parentElement, _canvas$parentElement2, _canvas$parentElement3, _canvas$parentElement4;

      let {
        gl: glConfig,
        size,
        events,
        onCreated: onCreatedCallback,
        shadows = false,
        linear = false,
        flat = false,
        legacy = false,
        orthographic = false,
        frameloop = 'always',
        dpr = [1, 2],
        performance,
        raycaster: raycastOptions,
        camera: cameraOptions,
        onPointerMissed
      } = props;
      let state = store.getState(); // Set up renderer (one time only!)

      let gl = state.gl;
      if (!state.gl) state.set({
        gl: gl = createRendererInstance(glConfig, canvas)
      }); // Set up raycaster (one time only!)

      let raycaster = state.raycaster;
      if (!raycaster) state.set({
        raycaster: raycaster = new three_module.Raycaster()
      }); // Set raycaster options

      const {
        params,
        ...options
      } = raycastOptions || {};
      if (!is.equ(options, raycaster, shallowLoose)) applyProps(raycaster, { ...options
      });
      if (!is.equ(params, raycaster.params, shallowLoose)) applyProps(raycaster, {
        params: { ...raycaster.params,
          ...params
        }
      }); // Create default camera (one time only!)

      if (!state.camera) {
        const isCamera = cameraOptions instanceof three_module.Camera;
        const camera = isCamera ? cameraOptions : orthographic ? new three_module.OrthographicCamera(0, 0, 0, 0, 0.1, 1000) : new three_module.PerspectiveCamera(75, 0, 0.1, 1000);

        if (!isCamera) {
          camera.position.z = 5;
          if (cameraOptions) applyProps(camera, cameraOptions); // Always look at center by default

          if (!(cameraOptions != null && cameraOptions.rotation)) camera.lookAt(0, 0, 0);
        }

        state.set({
          camera
        });
      } // Set up XR (one time only!)


      if (!state.xr) {
        // Handle frame behavior in WebXR
        const handleXRFrame = (timestamp, frame) => {
          const state = store.getState();
          if (state.frameloop === 'never') return;
          advance(timestamp, true, state, frame);
        }; // Toggle render switching on session


        const handleSessionChange = () => {
          const gl = store.getState().gl;
          gl.xr.enabled = gl.xr.isPresenting; // @ts-ignore
          // WebXRManager's signature is incorrect.
          // See: https://github.com/pmndrs/react-three-fiber/pull/2017#discussion_r790134505

          gl.xr.setAnimationLoop(gl.xr.isPresenting ? handleXRFrame : null);
        }; // WebXR session manager


        const xr = {
          connect() {
            const gl = store.getState().gl;
            gl.xr.addEventListener('sessionstart', handleSessionChange);
            gl.xr.addEventListener('sessionend', handleSessionChange);
          },

          disconnect() {
            const gl = store.getState().gl;
            gl.xr.removeEventListener('sessionstart', handleSessionChange);
            gl.xr.removeEventListener('sessionend', handleSessionChange);
          }

        }; // Subscribe to WebXR session events

        if (gl.xr) xr.connect();
        state.set({
          xr
        });
      } // Set shadowmap


      if (gl.shadowMap) {
        const isBoolean = is.boo(shadows);

        if (isBoolean && gl.shadowMap.enabled !== shadows || !is.equ(shadows, gl.shadowMap, shallowLoose)) {
          const old = gl.shadowMap.enabled;
          gl.shadowMap.enabled = !!shadows;
          if (!isBoolean) Object.assign(gl.shadowMap, shadows);else gl.shadowMap.type = three_module.PCFSoftShadowMap;
          if (old !== gl.shadowMap.enabled) gl.shadowMap.needsUpdate = true;
        }
      } // Set color management


      if (three_module.ColorManagement) {
        three_module.ColorManagement.legacyMode = legacy;
      }

      const outputEncoding = linear ? three_module.LinearEncoding : three_module.sRGBEncoding;
      const toneMapping = flat ? three_module.NoToneMapping : three_module.ACESFilmicToneMapping;
      if (gl.outputEncoding !== outputEncoding) gl.outputEncoding = outputEncoding;
      if (gl.toneMapping !== toneMapping) gl.toneMapping = toneMapping; // Update color management state

      if (state.legacy !== legacy) state.set(() => ({
        legacy
      }));
      if (state.linear !== linear) state.set(() => ({
        linear
      }));
      if (state.flat !== flat) state.set(() => ({
        flat
      })); // Set gl props

      if (glConfig && !is.fun(glConfig) && !isRenderer(glConfig) && !is.equ(glConfig, gl, shallowLoose)) applyProps(gl, glConfig); // Store events internally

      if (events && !state.events.handlers) state.set({
        events: events(store)
      }); // Check pixelratio

      if (dpr && state.viewport.dpr !== calculateDpr(dpr)) state.setDpr(dpr); // Check size, allow it to take on container bounds initially

      size = size || {
        width: (_canvas$parentElement = (_canvas$parentElement2 = canvas.parentElement) == null ? void 0 : _canvas$parentElement2.clientWidth) != null ? _canvas$parentElement : 0,
        height: (_canvas$parentElement3 = (_canvas$parentElement4 = canvas.parentElement) == null ? void 0 : _canvas$parentElement4.clientHeight) != null ? _canvas$parentElement3 : 0
      };
      if (!is.equ(size, state.size, shallowLoose)) state.setSize(size.width, size.height); // Check frameloop

      if (state.frameloop !== frameloop) state.setFrameloop(frameloop); // Check pointer missed

      if (!state.onPointerMissed) state.set({
        onPointerMissed
      }); // Check performance

      if (performance && !is.equ(performance, state.performance, shallowLoose)) state.set(state => ({
        performance: { ...state.performance,
          ...performance
        }
      })); // Set locals

      onCreated = onCreatedCallback;
      configured = true;
      return this;
    },

    render(children) {
      // The root has to be configured before it can be rendered
      if (!configured) this.configure();
      reconciler.updateContainer( /*#__PURE__*/react.createElement(Provider, {
        store: store,
        children: children,
        onCreated: onCreated,
        rootElement: canvas
      }), fiber, null, () => undefined);
      return store;
    },

    unmount() {
      unmountComponentAtNode(canvas);
    }

  };
}

function render(children, canvas, config) {
  console.warn('R3F.render is no longer supported in React 18. Use createRoot instead!');
  const root = createRoot(canvas);
  root.configure(config);
  return root.render(children);
}

function Provider({
  store,
  children,
  onCreated,
  rootElement
}) {
  index_91152509_esm_useIsomorphicLayoutEffect(() => {
    const state = store.getState(); // Flag the canvas active, rendering will now begin

    state.set(state => ({
      internal: { ...state.internal,
        active: true
      }
    })); // Notifiy that init is completed, the scene graph exists, but nothing has yet rendered

    if (onCreated) onCreated(state); // Connect events to the targets parent, this is done to ensure events are registered on
    // a shared target, and not on the canvas itself

    if (!store.getState().events.connected) state.events.connect == null ? void 0 : state.events.connect(rootElement); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/react.createElement(context.Provider, {
    value: store
  }, children);
}

function unmountComponentAtNode(canvas, callback) {
  const root = roots.get(canvas);
  const fiber = root == null ? void 0 : root.fiber;

  if (fiber) {
    const state = root == null ? void 0 : root.store.getState();
    if (state) state.internal.active = false;
    reconciler.updateContainer(null, fiber, null, () => {
      if (state) {
        setTimeout(() => {
          try {
            var _state$gl, _state$gl$renderLists, _state$gl2, _state$gl3;

            state.events.disconnect == null ? void 0 : state.events.disconnect();
            (_state$gl = state.gl) == null ? void 0 : (_state$gl$renderLists = _state$gl.renderLists) == null ? void 0 : _state$gl$renderLists.dispose == null ? void 0 : _state$gl$renderLists.dispose();
            (_state$gl2 = state.gl) == null ? void 0 : _state$gl2.forceContextLoss == null ? void 0 : _state$gl2.forceContextLoss();
            if ((_state$gl3 = state.gl) != null && _state$gl3.xr) state.xr.disconnect();
            dispose(state);
            roots.delete(canvas);
            if (callback) callback(canvas);
          } catch (e) {
            /* ... */
          }
        }, 500);
      }
    });
  }
}

function createPortal(children, container, state) {
  return /*#__PURE__*/React.createElement(Portal, {
    key: container.uuid,
    children: children,
    container: container,
    state: state
  });
}

function Portal({
  state = {},
  children,
  container
}) {
  /** This has to be a component because it would not be able to call useThree/useStore otherwise since
   *  if this is our environment, then we are not in r3f's renderer but in react-dom, it would trigger
   *  the "R3F hooks can only be used within the Canvas component!" warning:
   *  <Canvas>
   *    {createPortal(...)} */
  const {
    events,
    size,
    ...rest
  } = state;
  const previousRoot = useStore();
  const [raycaster] = React.useState(() => new THREE.Raycaster());
  const [pointer] = React.useState(() => new THREE.Vector2());
  const inject = React.useCallback((state, injectState) => {
    const intersect = { ...state
    };

    if (injectState) {
      // Only the fields of "state" that do not differ from injectState
      // Some props should be off-limits
      // Otherwise filter out the props that are different and let the inject layer take precedence
      Object.keys(state).forEach(key => {
        if (state[key] !== injectState[key] && !['internal', 'performance'].includes(key)) {
          delete intersect[key];
        }
      });
    }

    let viewport = undefined;

    if (injectState && size) {
      const camera = injectState.camera; // Calculate the override viewport, if present

      viewport = state.viewport.getCurrentViewport(camera, new THREE.Vector3(), size); // Update the portal camera, if it differs from the previous layer

      if (camera !== state.camera) updateCamera(camera, size);
    }

    return { // The intersect consists of the previous root state
      ...intersect,
      // Portals have their own scene, which forms the root, a raycaster and a pointer
      scene: container,
      raycaster,
      pointer,
      mouse: pointer,
      // Their previous root is the layer before it
      previousRoot,
      // Events, size and viewport can be overridden by the inject layer
      events: { ...state.events,
        ...(injectState == null ? void 0 : injectState.events),
        ...events
      },
      size: { ...state.size,
        ...size
      },
      viewport: { ...state.viewport,
        ...viewport
      },
      ...rest
    };
  }, [state]);
  const [usePortalStore] = React.useState(() => {
    // Create a mirrored store, based on the previous root with a few overrides ...
    new THREE.Vector3();
    const previousState = previousRoot.getState();
    const store = create((set, get) => ({ ...inject(previousState),
      // Set and get refer to this root-state
      set,
      get,
      // Layers are allowed to override events
      setEvents: events => set(state => ({ ...state,
        events: { ...state.events,
          ...events
        }
      }))
    }));
    return store;
  });
  React.useEffect(() => {
    // Subscribe to previous root-state and copy changes over to the mirrored portal-state
    const unsub = previousRoot.subscribe(prev => usePortalStore.setState(state => inject(prev, state)));
    return () => {
      unsub();
      usePortalStore.destroy();
    };
  }, []);
  React.useEffect(() => {
    usePortalStore.setState(injectState => inject(previousRoot.getState(), injectState));
  }, [inject]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, reconciler.createPortal( /*#__PURE__*/React.createElement(context.Provider, {
    value: usePortalStore
  }, children), usePortalStore, null));
}

reconciler.injectIntoDevTools({
  bundleType:  true ? 0 : 0,
  rendererPackageName: '@react-three/fiber',
  version: '18.0.0'
});
const act = react.unstable_act;




/***/ }),

/***/ 5107:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Xz": function() { return /* binding */ Canvas; }
});

// UNUSED EXPORTS: ReactThreeFiber, _roots, act, addAfterEffect, addEffect, addTail, advance, applyProps, context, createPortal, createRoot, dispose, events, extend, getRootState, invalidate, reconciler, render, unmountComponentAtNode, useFrame, useGraph, useLoader, useStore, useThree

// EXTERNAL MODULE: ../../node_modules/@react-three/fiber/dist/index-91152509.esm.js + 2 modules
var index_91152509_esm = __webpack_require__(9060);
// EXTERNAL MODULE: ../../node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(7896);
// EXTERNAL MODULE: ../../node_modules/react/index.js
var react = __webpack_require__(2784);
// EXTERNAL MODULE: ../../node_modules/three/build/three.module.js
var three_module = __webpack_require__(6995);
;// CONCATENATED MODULE: ../../node_modules/react-merge-refs/dist/react-merge-refs.esm.js
function mergeRefs(refs) {
  return function (value) {
    refs.forEach(function (ref) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

/* harmony default export */ var react_merge_refs_esm = (mergeRefs);
//# sourceMappingURL=react-merge-refs.esm.js.map

// EXTERNAL MODULE: ../../node_modules/debounce/index.js
var node_modules_debounce = __webpack_require__(6386);
var debounce_default = /*#__PURE__*/__webpack_require__.n(node_modules_debounce);
;// CONCATENATED MODULE: ../../node_modules/react-use-measure/dist/web.js



function useMeasure(_temp) {
  let {
    debounce,
    scroll,
    polyfill,
    offsetSize
  } = _temp === void 0 ? {
    debounce: 0,
    scroll: false,
    offsetSize: false
  } : _temp;
  const ResizeObserver = polyfill || (typeof window === 'undefined' ? class ResizeObserver {} : window.ResizeObserver);

  if (!ResizeObserver) {
    throw new Error('This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills');
  }

  const [bounds, set] = (0,react.useState)({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0
  }); // keep all state in a ref

  const state = (0,react.useRef)({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: bounds
  }); // set actual debounce values early, so effects know if they should react accordingly

  const scrollDebounce = debounce ? typeof debounce === 'number' ? debounce : debounce.scroll : null;
  const resizeDebounce = debounce ? typeof debounce === 'number' ? debounce : debounce.resize : null; // make sure to update state only as long as the component is truly mounted

  const mounted = (0,react.useRef)(false);
  (0,react.useEffect)(() => {
    mounted.current = true;
    return () => void (mounted.current = false);
  }); // memoize handlers, so event-listeners know when they should update

  const [forceRefresh, resizeChange, scrollChange] = (0,react.useMemo)(() => {
    const callback = () => {
      if (!state.current.element) return;
      const {
        left,
        top,
        width,
        height,
        bottom,
        right,
        x,
        y
      } = state.current.element.getBoundingClientRect();
      const size = {
        left,
        top,
        width,
        height,
        bottom,
        right,
        x,
        y
      };

      if (state.current.element instanceof HTMLElement && offsetSize) {
        size.height = state.current.element.offsetHeight;
        size.width = state.current.element.offsetWidth;
      }

      Object.freeze(size);
      if (mounted.current && !areBoundsEqual(state.current.lastBounds, size)) set(state.current.lastBounds = size);
    };

    return [callback, resizeDebounce ? debounce_default()(callback, resizeDebounce) : callback, scrollDebounce ? debounce_default()(callback, scrollDebounce) : callback];
  }, [set, offsetSize, scrollDebounce, resizeDebounce]); // cleanup current scroll-listeners / observers

  function removeListeners() {
    if (state.current.scrollContainers) {
      state.current.scrollContainers.forEach(element => element.removeEventListener('scroll', scrollChange, true));
      state.current.scrollContainers = null;
    }

    if (state.current.resizeObserver) {
      state.current.resizeObserver.disconnect();
      state.current.resizeObserver = null;
    }
  } // add scroll-listeners / observers


  function addListeners() {
    if (!state.current.element) return;
    state.current.resizeObserver = new ResizeObserver(scrollChange);
    state.current.resizeObserver.observe(state.current.element);

    if (scroll && state.current.scrollContainers) {
      state.current.scrollContainers.forEach(scrollContainer => scrollContainer.addEventListener('scroll', scrollChange, {
        capture: true,
        passive: true
      }));
    }
  } // the ref we expose to the user


  const ref = node => {
    if (!node || node === state.current.element) return;
    removeListeners();
    state.current.element = node;
    state.current.scrollContainers = findScrollContainers(node);
    addListeners();
  }; // add general event listeners


  useOnWindowScroll(scrollChange, Boolean(scroll));
  useOnWindowResize(resizeChange); // respond to changes that are relevant for the listeners

  (0,react.useEffect)(() => {
    removeListeners();
    addListeners();
  }, [scroll, scrollChange, resizeChange]); // remove all listeners when the components unmounts

  (0,react.useEffect)(() => removeListeners, []);
  return [ref, bounds, forceRefresh];
} // Adds native resize listener to window


function useOnWindowResize(onWindowResize) {
  (0,react.useEffect)(() => {
    const cb = onWindowResize;
    window.addEventListener('resize', cb);
    return () => void window.removeEventListener('resize', cb);
  }, [onWindowResize]);
}

function useOnWindowScroll(onScroll, enabled) {
  (0,react.useEffect)(() => {
    if (enabled) {
      const cb = onScroll;
      window.addEventListener('scroll', cb, {
        capture: true,
        passive: true
      });
      return () => void window.removeEventListener('scroll', cb, true);
    }
  }, [onScroll, enabled]);
} // Returns a list of scroll offsets


function findScrollContainers(element) {
  const result = [];
  if (!element || element === document.body) return result;
  const {
    overflow,
    overflowX,
    overflowY
  } = window.getComputedStyle(element);
  if ([overflow, overflowX, overflowY].some(prop => prop === 'auto' || prop === 'scroll')) result.push(element);
  return [...result, ...findScrollContainers(element.parentElement)];
} // Checks if element boundaries are equal


const keys = ['x', 'y', 'top', 'bottom', 'left', 'right', 'width', 'height'];

const areBoundsEqual = (a, b) => keys.every(key => a[key] === b[key]);



// EXTERNAL MODULE: ../../node_modules/react-reconciler/constants.js
var constants = __webpack_require__(1801);
// EXTERNAL MODULE: ../../node_modules/react-reconciler/index.js
var react_reconciler = __webpack_require__(7962);
// EXTERNAL MODULE: ../../node_modules/scheduler/index.js
var scheduler = __webpack_require__(4616);
;// CONCATENATED MODULE: ../../node_modules/@react-three/fiber/dist/react-three-fiber.esm.js













const DOM_EVENTS = {
  onClick: ['click', false],
  onContextMenu: ['contextmenu', false],
  onDoubleClick: ['dblclick', false],
  onWheel: ['wheel', true],
  onPointerDown: ['pointerdown', true],
  onPointerUp: ['pointerup', true],
  onPointerLeave: ['pointerleave', true],
  onPointerMove: ['pointermove', true],
  onPointerCancel: ['pointercancel', true],
  onLostPointerCapture: ['lostpointercapture', true]
};
/** Default R3F event manager for web */

function createPointerEvents(store) {
  const {
    handlePointer
  } = (0,index_91152509_esm.c)(store);
  return {
    priority: 1,
    enabled: true,

    compute(event, state, previous) {
      // https://github.com/pmndrs/react-three-fiber/pull/782
      // Events trigger outside of canvas when moved, use offsetX/Y by default and allow overrides
      state.pointer.set(event.offsetX / state.size.width * 2 - 1, -(event.offsetY / state.size.height) * 2 + 1);
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },

    connected: undefined,
    handlers: Object.keys(DOM_EVENTS).reduce((acc, key) => ({ ...acc,
      [key]: handlePointer(key)
    }), {}),
    connect: target => {
      var _events$handlers;

      const {
        set,
        events
      } = store.getState();
      events.disconnect == null ? void 0 : events.disconnect();
      set(state => ({
        events: { ...state.events,
          connected: target
        }
      }));
      Object.entries((_events$handlers = events == null ? void 0 : events.handlers) != null ? _events$handlers : []).forEach(([name, event]) => {
        const [eventName, passive] = DOM_EVENTS[name];
        target.addEventListener(eventName, event, {
          passive
        });
      });
    },
    disconnect: () => {
      const {
        set,
        events
      } = store.getState();

      if (events.connected) {
        var _events$handlers2;

        Object.entries((_events$handlers2 = events.handlers) != null ? _events$handlers2 : []).forEach(([name, event]) => {
          if (events && events.connected instanceof HTMLElement) {
            const [eventName] = DOM_EVENTS[name];
            events.connected.removeEventListener(eventName, event);
          }
        });
        set(state => ({
          events: { ...state.events,
            connected: undefined
          }
        }));
      }
    }
  };
}

const CANVAS_PROPS = ['gl', 'events', 'shadows', 'linear', 'flat', 'legacy', 'orthographic', 'frameloop', 'dpr', 'performance', 'raycaster', 'camera', 'onPointerMissed', 'onCreated'];
/**
 * A DOM canvas which accepts threejs elements as children.
 * @see https://docs.pmnd.rs/react-three-fiber/api/canvas
 */

const Canvas = /*#__PURE__*/react.forwardRef(function Canvas({
  children,
  fallback,
  resize,
  style,
  onPointerMissed,
  events = createPointerEvents,
  ...props
}, forwardedRef) {
  // Create a known catalogue of Threejs-native elements
  // This will include the entire THREE namespace by default, users can extend
  // their own elements by using the createRoot API instead
  react.useMemo(() => (0,index_91152509_esm.e)(three_module), []);
  const [containerRef, {
    width,
    height
  }] = useMeasure({
    scroll: true,
    debounce: {
      scroll: 50,
      resize: 0
    },
    ...resize
  });
  const canvasRef = react.useRef(null);
  const meshRef = react.useRef(null);
  const [canvas, setCanvas] = react.useState(null);
  const handlePointerMissed = (0,index_91152509_esm.u)(onPointerMissed);
  const canvasProps = (0,index_91152509_esm.p)(props, CANVAS_PROPS);
  const divProps = (0,index_91152509_esm.o)(props, CANVAS_PROPS);
  const [block, setBlock] = react.useState(false);
  const [error, setError] = react.useState(false); // Suspend this component if block is a promise (2nd run)

  if (block) throw block; // Throw exception outwards if anything within canvas throws

  if (error) throw error;
  const root = react.useRef(null);

  if (width > 0 && height > 0 && canvas) {
    if (!root.current) root.current = (0,index_91152509_esm.a)(canvas);
    root.current.configure({ ...canvasProps,
      // Pass mutable reference to onPointerMissed so it's free to update
      onPointerMissed: (...args) => handlePointerMissed.current == null ? void 0 : handlePointerMissed.current(...args),
      onCreated: state => {
        state.events.connect == null ? void 0 : state.events.connect(meshRef.current);
        canvasProps.onCreated == null ? void 0 : canvasProps.onCreated(state);
      },
      size: {
        width,
        height
      },
      events
    });
    root.current.render( /*#__PURE__*/react.createElement(index_91152509_esm.E, {
      set: setError
    }, /*#__PURE__*/react.createElement(react.Suspense, {
      fallback: /*#__PURE__*/react.createElement(index_91152509_esm.B, {
        set: setBlock
      })
    }, children)));
  }

  (0,index_91152509_esm.b)(() => {
    setCanvas(canvasRef.current);
  }, []);
  react.useEffect(() => {
    if (canvas) return () => (0,index_91152509_esm.d)(canvas);
  }, [canvas]);
  return /*#__PURE__*/react.createElement("div", (0,esm_extends/* default */.Z)({
    ref: react_merge_refs_esm([meshRef, containerRef]),
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      ...style
    }
  }, divProps), /*#__PURE__*/react.createElement("canvas", {
    ref: react_merge_refs_esm([canvasRef, forwardedRef]),
    style: {
      display: 'block'
    }
  }, fallback));
});




/***/ }),

/***/ 6386:
/***/ (function(module) {

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */
function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

// Adds compatibility for ES modules
debounce.debounce = debounce;

module.exports = debounce;


/***/ }),

/***/ 3122:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;
/**
 * @license React
 * react-reconciler-constants.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
exports.ConcurrentRoot=1;exports.ContinuousEventPriority=4;exports.DefaultEventPriority=16;exports.DiscreteEventPriority=1;__webpack_unused_export__=536870912;__webpack_unused_export__=0;


/***/ }),

/***/ 9166:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * @license React
 * react-reconciler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = function $$$reconciler($$$hostConfig) {
    var exports = {};
'use strict';var aa=__webpack_require__(2784),ba=__webpack_require__(4616),ca=Object.assign;function n(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var ea=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,fa=Symbol.for("react.element"),ha=Symbol.for("react.portal"),ia=Symbol.for("react.fragment"),ja=Symbol.for("react.strict_mode"),ka=Symbol.for("react.profiler"),la=Symbol.for("react.provider"),ma=Symbol.for("react.context"),na=Symbol.for("react.forward_ref"),oa=Symbol.for("react.suspense"),pa=Symbol.for("react.suspense_list"),qa=Symbol.for("react.memo"),ra=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");
var sa=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var ta=Symbol.iterator;function ua(a){if(null===a||"object"!==typeof a)return null;a=ta&&a[ta]||a["@@iterator"];return"function"===typeof a?a:null}
function va(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ia:return"Fragment";case ha:return"Portal";case ka:return"Profiler";case ja:return"StrictMode";case oa:return"Suspense";case pa:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case ma:return(a.displayName||"Context")+".Consumer";case la:return(a._context.displayName||"Context")+".Provider";case na:var b=a.render;a=a.displayName;a||(a=b.displayName||
b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case qa:return b=a.displayName||null,null!==b?b:va(a.type)||"Memo";case ra:b=a._payload;a=a._init;try{return va(a(b))}catch(c){}}return null}
function xa(a){var b=a.type;switch(a.tag){case 24:return"Cache";case 9:return(b.displayName||"Context")+".Consumer";case 10:return(b._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return"Fragment";case 5:return b;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return va(b);case 8:return b===ja?"StrictMode":"Mode";case 22:return"Offscreen";
case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function ya(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function za(a){if(ya(a)!==a)throw Error(n(188));}
function Aa(a){var b=a.alternate;if(!b){b=ya(a);if(null===b)throw Error(n(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return za(e),a;if(f===d)return za(e),b;f=f.sibling}throw Error(n(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(n(189));}}if(c.alternate!==d)throw Error(n(190));}if(3!==c.tag)throw Error(n(188));return c.stateNode.current===c?a:b}function Ba(a){a=Aa(a);return null!==a?Ca(a):null}function Ca(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=Ca(a);if(null!==b)return b;a=a.sibling}return null}
function Da(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){if(4!==a.tag){var b=Da(a);if(null!==b)return b}a=a.sibling}return null}
var Ea=Array.isArray,Fa=$$$hostConfig.getPublicInstance,Ga=$$$hostConfig.getRootHostContext,Ha=$$$hostConfig.getChildHostContext,Ia=$$$hostConfig.prepareForCommit,Ja=$$$hostConfig.resetAfterCommit,Ka=$$$hostConfig.createInstance,La=$$$hostConfig.appendInitialChild,Ma=$$$hostConfig.finalizeInitialChildren,Na=$$$hostConfig.prepareUpdate,Oa=$$$hostConfig.shouldSetTextContent,Pa=$$$hostConfig.createTextInstance,Qa=$$$hostConfig.scheduleTimeout,Ra=$$$hostConfig.cancelTimeout,Sa=$$$hostConfig.noTimeout,
Ta=$$$hostConfig.isPrimaryRenderer,Ua=$$$hostConfig.supportsMutation,Va=$$$hostConfig.supportsPersistence,p=$$$hostConfig.supportsHydration,Wa=$$$hostConfig.getInstanceFromNode,Xa=$$$hostConfig.preparePortalMount,Ya=$$$hostConfig.getCurrentEventPriority,Za=$$$hostConfig.detachDeletedInstance,$a=$$$hostConfig.supportsMicrotasks,ab=$$$hostConfig.scheduleMicrotask,bb=$$$hostConfig.supportsTestSelectors,cb=$$$hostConfig.findFiberRoot,db=$$$hostConfig.getBoundingRect,eb=$$$hostConfig.getTextContent,fb=
$$$hostConfig.isHiddenSubtree,gb=$$$hostConfig.matchAccessibilityRole,hb=$$$hostConfig.setFocusIfFocusable,ib=$$$hostConfig.setupIntersectionObserver,jb=$$$hostConfig.appendChild,kb=$$$hostConfig.appendChildToContainer,lb=$$$hostConfig.commitTextUpdate,mb=$$$hostConfig.commitMount,nb=$$$hostConfig.commitUpdate,ob=$$$hostConfig.insertBefore,pb=$$$hostConfig.insertInContainerBefore,qb=$$$hostConfig.removeChild,rb=$$$hostConfig.removeChildFromContainer,sb=$$$hostConfig.resetTextContent,tb=$$$hostConfig.hideInstance,
ub=$$$hostConfig.hideTextInstance,vb=$$$hostConfig.unhideInstance,wb=$$$hostConfig.unhideTextInstance,xb=$$$hostConfig.clearContainer,yb=$$$hostConfig.cloneInstance,zb=$$$hostConfig.createContainerChildSet,Ab=$$$hostConfig.appendChildToContainerChildSet,Bb=$$$hostConfig.finalizeContainerChildren,Cb=$$$hostConfig.replaceContainerChildren,Db=$$$hostConfig.cloneHiddenInstance,Eb=$$$hostConfig.cloneHiddenTextInstance,Fb=$$$hostConfig.canHydrateInstance,Gb=$$$hostConfig.canHydrateTextInstance,Hb=$$$hostConfig.canHydrateSuspenseInstance,
Ib=$$$hostConfig.isSuspenseInstancePending,Jb=$$$hostConfig.isSuspenseInstanceFallback,Kb=$$$hostConfig.registerSuspenseInstanceRetry,Lb=$$$hostConfig.getNextHydratableSibling,Mb=$$$hostConfig.getFirstHydratableChild,Nb=$$$hostConfig.getFirstHydratableChildWithinContainer,Ob=$$$hostConfig.getFirstHydratableChildWithinSuspenseInstance,Pb=$$$hostConfig.hydrateInstance,Qb=$$$hostConfig.hydrateTextInstance,Rb=$$$hostConfig.hydrateSuspenseInstance,Sb=$$$hostConfig.getNextHydratableInstanceAfterSuspenseInstance,
Tb=$$$hostConfig.commitHydratedContainer,Ub=$$$hostConfig.commitHydratedSuspenseInstance,Vb=$$$hostConfig.clearSuspenseBoundary,Wb=$$$hostConfig.clearSuspenseBoundaryFromContainer,Xb=$$$hostConfig.shouldDeleteUnhydratedTailInstances,Yb=$$$hostConfig.didNotMatchHydratedContainerTextInstance,Zb=$$$hostConfig.didNotMatchHydratedTextInstance,$b;function ac(a){if(void 0===$b)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);$b=b&&b[1]||""}return"\n"+$b+a}var bc=!1;
function cc(a,b){if(!a||bc)return"";bc=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(l){var d=l}Reflect.construct(a,[],b)}else{try{b.call()}catch(l){d=l}a.call(b.prototype)}else{try{throw Error();}catch(l){d=l}a()}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{bc=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?ac(a):""}var dc=Object.prototype.hasOwnProperty,ec=[],fc=-1;function gc(a){return{current:a}}
function x(a){0>fc||(a.current=ec[fc],ec[fc]=null,fc--)}function y(a,b){fc++;ec[fc]=a.current;a.current=b}var hc={},A=gc(hc),B=gc(!1),ic=hc;function jc(a,b){var c=a.type.contextTypes;if(!c)return hc;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function C(a){a=a.childContextTypes;return null!==a&&void 0!==a}function kc(){x(B);x(A)}function lc(a,b,c){if(A.current!==hc)throw Error(n(168));y(A,b);y(B,c)}function mc(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(n(108,xa(a)||"Unknown",e));return ca({},c,d)}
function nc(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||hc;ic=A.current;y(A,a);y(B,B.current);return!0}function oc(a,b,c){var d=a.stateNode;if(!d)throw Error(n(169));c?(a=mc(a,b,ic),d.__reactInternalMemoizedMergedChildContext=a,x(B),x(A),y(A,a)):x(B);y(B,c)}var qc=Math.clz32?Math.clz32:pc,rc=Math.log,sc=Math.LN2;function pc(a){a>>>=0;return 0===a?32:31-(rc(a)/sc|0)|0}var tc=64,uc=4194304;
function vc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function wc(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=vc(h):(f&=g,0!==f&&(d=vc(f)))}else g=c&~e,0!==g?d=vc(g):0!==f&&(d=vc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-qc(b),e=1<<c,d|=a[c],b&=~e;return d}
function xc(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}
function yc(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-qc(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=xc(h,b)}else k<=b&&(a.expiredLanes|=h);f&=~h}}function zc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function Ac(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}function Bc(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-qc(b);a[b]=c}
function Cc(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-qc(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f}}function Dc(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-qc(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e}}var D=0;function Ec(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}
var Fc=ba.unstable_scheduleCallback,Gc=ba.unstable_cancelCallback,Hc=ba.unstable_shouldYield,Ic=ba.unstable_requestPaint,E=ba.unstable_now,Jc=ba.unstable_ImmediatePriority,Kc=ba.unstable_UserBlockingPriority,Lc=ba.unstable_NormalPriority,Mc=ba.unstable_IdlePriority,Nc=null,Oc=null;function Pc(a){if(Oc&&"function"===typeof Oc.onCommitFiberRoot)try{Oc.onCommitFiberRoot(Nc,a,void 0,128===(a.current.flags&128))}catch(b){}}function Qc(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}
var Rc="function"===typeof Object.is?Object.is:Qc,Sc=null,Tc=!1,Uc=!1;function Vc(a){null===Sc?Sc=[a]:Sc.push(a)}function Wc(a){Tc=!0;Vc(a)}function Xc(){if(!Uc&&null!==Sc){Uc=!0;var a=0,b=D;try{var c=Sc;for(D=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}Sc=null;Tc=!1}catch(e){throw null!==Sc&&(Sc=Sc.slice(a+1)),Fc(Jc,Xc),e;}finally{D=b,Uc=!1}}return null}var Yc=ea.ReactCurrentBatchConfig;
function Zc(a,b){if(Rc(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++){var e=c[d];if(!dc.call(b,e)||!Rc(a[e],b[e]))return!1}return!0}
function $c(a){switch(a.tag){case 5:return ac(a.type);case 16:return ac("Lazy");case 13:return ac("Suspense");case 19:return ac("SuspenseList");case 0:case 2:case 15:return a=cc(a.type,!1),a;case 11:return a=cc(a.type.render,!1),a;case 1:return a=cc(a.type,!0),a;default:return""}}function ad(a,b){if(a&&a.defaultProps){b=ca({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var bd=gc(null),cd=null,dd=null,ed=null;function fd(){ed=dd=cd=null}
function gd(a,b,c){Ta?(y(bd,b._currentValue),b._currentValue=c):(y(bd,b._currentValue2),b._currentValue2=c)}function hd(a){var b=bd.current;x(bd);Ta?a._currentValue=b:a._currentValue2=b}function id(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return}}
function jd(a,b){cd=a;ed=dd=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(kd=!0),a.firstContext=null)}function ld(a){var b=Ta?a._currentValue:a._currentValue2;if(ed!==a)if(a={context:a,memoizedValue:b,next:null},null===dd){if(null===cd)throw Error(n(308));dd=a;cd.dependencies={lanes:0,firstContext:a}}else dd=dd.next=a;return b}var md=null,nd=!1;
function od(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function pd(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function qd(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function rd(a,b){var c=a.updateQueue;null!==c&&(c=c.shared,null!==F&&0!==(a.mode&1)&&0===(G&2)?(a=c.interleaved,null===a?(b.next=b,null===md?md=[c]:md.push(c)):(b.next=a.next,a.next=b),c.interleaved=b):(a=c.pending,null===a?b.next=b:(b.next=a.next,a.next=b),c.pending=b))}function sd(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Dc(a,c)}}
function td(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function ud(a,b,c,d){var e=a.updateQueue;nd=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k))}if(null!==f){var v=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,z=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:z,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var q=a,N=h;r=b;z=c;switch(N.tag){case 1:q=N.payload;if("function"===typeof q){v=q.call(z,v,r);break a}v=q;break a;case 3:q.flags=q.flags&-65537|128;case 0:q=N.payload;r="function"===typeof q?q.call(z,v,r):q;if(null===r||void 0===r)break a;v=ca({},v,r);break a;case 2:nd=!0}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h))}else z={eventTime:z,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=z,k=v):m=m.next=z,g|=
r;h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null}while(1);null===m&&(k=v);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);vd|=g;a.lanes=g;a.memoizedState=v}}
function wd(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(n(191,e));e.call(d)}}}var xd=(new aa.Component).refs;function yd(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:ca({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var Bd={isMounted:function(a){return(a=a._reactInternals)?ya(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=H(),e=zd(a),f=qd(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);rd(a,f);b=Ad(a,e,d);null!==b&&sd(b,a,e)},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=H(),e=zd(a),f=qd(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);rd(a,f);b=Ad(a,e,d);null!==b&&sd(b,a,e)},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=H(),d=zd(a),e=qd(c,
d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);rd(a,e);b=Ad(a,d,c);null!==b&&sd(b,a,d)}};function Cd(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Zc(c,d)||!Zc(e,f):!0}
function Dd(a,b,c){var d=!1,e=hc;var f=b.contextType;"object"===typeof f&&null!==f?f=ld(f):(e=C(b)?ic:A.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?jc(a,e):hc);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Bd;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Ed(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Bd.enqueueReplaceState(b,b.state,null)}
function Fd(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=xd;od(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=ld(f):(f=C(b)?ic:A.current,e.context=jc(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(yd(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Bd.enqueueReplaceState(e,e.state,null),ud(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308)}var Gd=[],Hd=0,Id=null,Jd=0,Kd=[],Ld=0,Md=null,Nd=1,Od="";function Pd(a,b){Gd[Hd++]=Jd;Gd[Hd++]=Id;Id=a;Jd=b}
function Qd(a,b,c){Kd[Ld++]=Nd;Kd[Ld++]=Od;Kd[Ld++]=Md;Md=a;var d=Nd;a=Od;var e=32-qc(d)-1;d&=~(1<<e);c+=1;var f=32-qc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;Nd=1<<32-qc(b)+e|c<<e|d;Od=f+a}else Nd=1<<f|c<<e|d,Od=a}function Rd(a){null!==a.return&&(Pd(a,1),Qd(a,1,0))}function Sd(a){for(;a===Id;)Id=Gd[--Hd],Gd[Hd]=null,Jd=Gd[--Hd],Gd[Hd]=null;for(;a===Md;)Md=Kd[--Ld],Kd[Ld]=null,Od=Kd[--Ld],Kd[Ld]=null,Nd=Kd[--Ld],Kd[Ld]=null}var Td=null,Ud=null,I=!1,Vd=!1,Wd=null;
function Xd(a,b){var c=Yd(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c)}
function Zd(a,b){switch(a.tag){case 5:return b=Fb(b,a.type,a.pendingProps),null!==b?(a.stateNode=b,Td=a,Ud=Mb(b),!0):!1;case 6:return b=Gb(b,a.pendingProps),null!==b?(a.stateNode=b,Td=a,Ud=null,!0):!1;case 13:b=Hb(b);if(null!==b){var c=null!==Md?{id:Nd,overflow:Od}:null;a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824};c=Yd(18,null,null,0);c.stateNode=b;c.return=a;a.child=c;Td=a;Ud=null;return!0}return!1;default:return!1}}function $d(a){return 0!==(a.mode&1)&&0===(a.flags&128)}
function ae(a){if(I){var b=Ud;if(b){var c=b;if(!Zd(a,b)){if($d(a))throw Error(n(418));b=Lb(c);var d=Td;b&&Zd(a,b)?Xd(d,c):(a.flags=a.flags&-4097|2,I=!1,Td=a)}}else{if($d(a))throw Error(n(418));a.flags=a.flags&-4097|2;I=!1;Td=a}}}function be(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;Td=a}
function ce(a){if(!p||a!==Td)return!1;if(!I)return be(a),I=!0,!1;if(3!==a.tag&&(5!==a.tag||Xb(a.type)&&!Oa(a.type,a.memoizedProps))){var b=Ud;if(b){if($d(a)){for(a=Ud;a;)a=Lb(a);throw Error(n(418));}for(;b;)Xd(a,b),b=Lb(b)}}be(a);if(13===a.tag){if(!p)throw Error(n(316));a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(n(317));Ud=Sb(a)}else Ud=Td?Lb(a.stateNode):null;return!0}function de(){p&&(Ud=Td=null,Vd=I=!1)}function ee(a){null===Wd?Wd=[a]:Wd.push(a)}
function fe(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(n(309));var d=c.stateNode}if(!d)throw Error(n(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;b===xd&&(b=e.refs={});null===a?delete b[f]:b[f]=a};b._stringRef=f;return b}if("string"!==typeof a)throw Error(n(284));if(!c._owner)throw Error(n(290,a));}return a}
function ge(a,b){a=Object.prototype.toString.call(b);throw Error(n(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function he(a){var b=a._init;return b(a._payload)}
function ie(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c)}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=je(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=ke(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ia)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===ra&&he(f)===b.type))return d=e(b,c.props),d.ref=fe(a,b,c),d.return=a,d;d=le(c.type,c.key,c.props,null,a.mode,d);d.ref=fe(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=me(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=ne(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function v(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=ke(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case fa:return c=le(b.type,b.key,b.props,null,a.mode,c),
c.ref=fe(a,null,b),c.return=a,c;case ha:return b=me(b,a.mode,c),b.return=a,b;case ra:var d=b._init;return v(a,d(b._payload),c)}if(Ea(b)||ua(b))return b=ne(b,a.mode,c,null),b.return=a,b;ge(a,b)}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case fa:return c.key===e?k(a,b,c,d):null;case ha:return c.key===e?l(a,b,c,d):null;case ra:return e=c._init,r(a,
b,e(c._payload),d)}if(Ea(c)||ua(c))return null!==e?null:m(a,b,c,d,null);ge(a,c)}return null}function z(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case fa:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case ha:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case ra:var f=d._init;return z(a,b,c,f(d._payload),e)}if(Ea(d)||ua(d))return a=a.get(c)||null,m(b,a,d,e,null);ge(b,d)}return null}
function q(e,g,h,k){for(var l=null,m=null,w=g,u=g=0,t=null;null!==w&&u<h.length;u++){w.index>u?(t=w,w=null):t=w.sibling;var q=r(e,w,h[u],k);if(null===q){null===w&&(w=t);break}a&&w&&null===q.alternate&&b(e,w);g=f(q,g,u);null===m?l=q:m.sibling=q;m=q;w=t}if(u===h.length)return c(e,w),I&&Pd(e,u),l;if(null===w){for(;u<h.length;u++)w=v(e,h[u],k),null!==w&&(g=f(w,g,u),null===m?l=w:m.sibling=w,m=w);I&&Pd(e,u);return l}for(w=d(e,w);u<h.length;u++)t=z(w,e,u,h[u],k),null!==t&&(a&&null!==t.alternate&&w.delete(null===
t.key?u:t.key),g=f(t,g,u),null===m?l=t:m.sibling=t,m=t);a&&w.forEach(function(a){return b(e,a)});I&&Pd(e,u);return l}function N(e,g,h,k){var l=ua(h);if("function"!==typeof l)throw Error(n(150));h=l.call(h);if(null==h)throw Error(n(151));for(var w=l=null,m=g,u=g=0,q=null,t=h.next();null!==m&&!t.done;u++,t=h.next()){m.index>u?(q=m,m=null):q=m.sibling;var V=r(e,m,t.value,k);if(null===V){null===m&&(m=q);break}a&&m&&null===V.alternate&&b(e,m);g=f(V,g,u);null===w?l=V:w.sibling=V;w=V;m=q}if(t.done)return c(e,
m),I&&Pd(e,u),l;if(null===m){for(;!t.done;u++,t=h.next())t=v(e,t.value,k),null!==t&&(g=f(t,g,u),null===w?l=t:w.sibling=t,w=t);I&&Pd(e,u);return l}for(m=d(e,m);!t.done;u++,t=h.next())t=z(m,e,u,t.value,k),null!==t&&(a&&null!==t.alternate&&m.delete(null===t.key?u:t.key),g=f(t,g,u),null===w?l=t:w.sibling=t,w=t);a&&m.forEach(function(a){return b(e,a)});I&&Pd(e,u);return l}function da(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ia&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==
f){switch(f.$$typeof){case fa:a:{for(var k=f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ia){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===ra&&he(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=fe(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling}f.type===ia?(d=ne(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=le(f.type,f.key,f.props,null,a.mode,h),h.ref=fe(a,d,f),h.return=
a,a=h)}return g(a);case ha:a:{for(l=f.key;null!==d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=me(f,a.mode,h);d.return=a;a=d}return g(a);case ra:return l=f._init,da(a,d,l(f._payload),h)}if(Ea(f))return q(a,d,f,h);if(ua(f))return N(a,d,f,h);ge(a,f)}return"string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&
6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=ke(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return da}var oe=ie(!0),pe=ie(!1),qe={},re=gc(qe),se=gc(qe),te=gc(qe);function ue(a){if(a===qe)throw Error(n(174));return a}function ve(a,b){y(te,b);y(se,a);y(re,qe);a=Ga(b);x(re);y(re,a)}function we(){x(re);x(se);x(te)}function xe(a){var b=ue(te.current),c=ue(re.current);b=Ha(c,a.type,b);c!==b&&(y(se,a),y(re,b))}function ye(a){se.current===a&&(x(re),x(se))}var J=gc(0);
function ze(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||Ib(c)||Jb(c)))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var Ae=[];
function Be(){for(var a=0;a<Ae.length;a++){var b=Ae[a];Ta?b._workInProgressVersionPrimary=null:b._workInProgressVersionSecondary=null}Ae.length=0}var Ce=ea.ReactCurrentDispatcher,De=ea.ReactCurrentBatchConfig,Ee=0,K=null,L=null,M=null,Fe=!1,Ge=!1,He=0,Ie=0;function O(){throw Error(n(321));}function Je(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!Rc(a[c],b[c]))return!1;return!0}
function Ke(a,b,c,d,e,f){Ee=f;K=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Ce.current=null===a||null===a.memoizedState?Le:Me;a=c(d,e);if(Ge){f=0;do{Ge=!1;He=0;if(25<=f)throw Error(n(301));f+=1;M=L=null;b.updateQueue=null;Ce.current=Ne;a=c(d,e)}while(Ge)}Ce.current=Oe;b=null!==L&&null!==L.next;Ee=0;M=L=K=null;Fe=!1;if(b)throw Error(n(300));return a}function Pe(){var a=0!==He;He=0;return a}
function Qe(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===M?K.memoizedState=M=a:M=M.next=a;return M}function Re(){if(null===L){var a=K.alternate;a=null!==a?a.memoizedState:null}else a=L.next;var b=null===M?K.memoizedState:M.next;if(null!==b)M=b,L=a;else{if(null===a)throw Error(n(310));L=a;a={memoizedState:L.memoizedState,baseState:L.baseState,baseQueue:L.baseQueue,queue:L.queue,next:null};null===M?K.memoizedState=M=a:M=M.next=a}return M}
function Se(a,b){return"function"===typeof b?b(a):b}
function Te(a){var b=Re(),c=b.queue;if(null===c)throw Error(n(311));c.lastRenderedReducer=a;var d=L,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Ee&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else{var v={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=v,g=d):k=k.next=v;K.lanes|=m;vd|=m}l=l.next}while(null!==l&&l!==f);null===k?g=d:k.next=h;Rc(d,b.memoizedState)||(kd=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d}a=c.interleaved;if(null!==a){e=a;do f=e.lane,K.lanes|=f,vd|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return[b.memoizedState,c.dispatch]}
function Ue(a){var b=Re(),c=b.queue;if(null===c)throw Error(n(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);Rc(f,b.memoizedState)||(kd=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}function Ve(){}
function We(a,b){var c=K,d=Re(),e=b(),f=!Rc(d.memoizedState,e);f&&(d.memoizedState=e,kd=!0);d=d.queue;Xe(Ye.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==M&&M.memoizedState.tag&1){c.flags|=2048;Ze(9,$e.bind(null,c,d,e,b),void 0,null);if(null===F)throw Error(n(349));0!==(Ee&30)||af(c,b,e)}return e}function af(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=K.updateQueue;null===b?(b={lastEffect:null,stores:null},K.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a))}
function $e(a,b,c,d){b.value=c;b.getSnapshot=d;bf(b)&&Ad(a,1,-1)}function Ye(a,b,c){return c(function(){bf(b)&&Ad(a,1,-1)})}function bf(a){var b=a.getSnapshot;a=a.value;try{var c=b();return!Rc(a,c)}catch(d){return!0}}function cf(a){var b=Qe();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Se,lastRenderedState:a};b.queue=a;a=a.dispatch=df.bind(null,K,a);return[b.memoizedState,a]}
function Ze(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=K.updateQueue;null===b?(b={lastEffect:null,stores:null},K.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ef(){return Re().memoizedState}function ff(a,b,c,d){var e=Qe();K.flags|=a;e.memoizedState=Ze(1|b,c,void 0,void 0===d?null:d)}
function gf(a,b,c,d){var e=Re();d=void 0===d?null:d;var f=void 0;if(null!==L){var g=L.memoizedState;f=g.destroy;if(null!==d&&Je(d,g.deps)){e.memoizedState=Ze(b,c,f,d);return}}K.flags|=a;e.memoizedState=Ze(1|b,c,f,d)}function hf(a,b){return ff(8390656,8,a,b)}function Xe(a,b){return gf(2048,8,a,b)}function jf(a,b){return gf(4,2,a,b)}function kf(a,b){return gf(4,4,a,b)}
function lf(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}function mf(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return gf(4,4,lf.bind(null,b,a),c)}function nf(){}function of(a,b){var c=Re();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Je(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function pf(a,b){var c=Re();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Je(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function qf(a,b){var c=D;D=0!==c&&4>c?c:4;a(!0);var d=De.transition;De.transition={};try{a(!1),b()}finally{D=c,De.transition=d}}function rf(){return Re().memoizedState}function sf(a,b,c){var d=zd(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};tf(a)?uf(b,c):(vf(a,b,c),c=H(),a=Ad(a,d,c),null!==a&&wf(a,b,d))}
function df(a,b,c){var d=zd(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(tf(a))uf(b,e);else{vf(a,b,e);var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(Rc(h,g))return}catch(k){}finally{}c=H();a=Ad(a,d,c);null!==a&&wf(a,b,d)}}function tf(a){var b=a.alternate;return a===K||null!==b&&b===K}
function uf(a,b){Ge=Fe=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}function vf(a,b,c){null!==F&&0!==(a.mode&1)&&0===(G&2)?(a=b.interleaved,null===a?(c.next=c,null===md?md=[b]:md.push(b)):(c.next=a.next,a.next=c),b.interleaved=c):(a=b.pending,null===a?c.next=c:(c.next=a.next,a.next=c),b.pending=c)}function wf(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Dc(a,c)}}
var Oe={readContext:ld,useCallback:O,useContext:O,useEffect:O,useImperativeHandle:O,useInsertionEffect:O,useLayoutEffect:O,useMemo:O,useReducer:O,useRef:O,useState:O,useDebugValue:O,useDeferredValue:O,useTransition:O,useMutableSource:O,useSyncExternalStore:O,useId:O,unstable_isNewReconciler:!1},Le={readContext:ld,useCallback:function(a,b){Qe().memoizedState=[a,void 0===b?null:b];return a},useContext:ld,useEffect:hf,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ff(4194308,
4,lf.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ff(4194308,4,a,b)},useInsertionEffect:function(a,b){return ff(4,2,a,b)},useMemo:function(a,b){var c=Qe();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Qe();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=sf.bind(null,K,a);return[d.memoizedState,a]},useRef:function(a){var b=
Qe();a={current:a};return b.memoizedState=a},useState:cf,useDebugValue:nf,useDeferredValue:function(a){var b=cf(a),c=b[0],d=b[1];hf(function(){var b=De.transition;De.transition={};try{d(a)}finally{De.transition=b}},[a]);return c},useTransition:function(){var a=cf(!1),b=a[0];a=qf.bind(null,a[1]);Qe().memoizedState=a;return[b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=K,e=Qe();if(I){if(void 0===c)throw Error(n(407));c=c()}else{c=b();if(null===F)throw Error(n(349));
0!==(Ee&30)||af(d,b,c)}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;hf(Ye.bind(null,d,f,a),[a]);d.flags|=2048;Ze(9,$e.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Qe(),b=F.identifierPrefix;if(I){var c=Od;var d=Nd;c=(d&~(1<<32-qc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=He++;0<c&&(b+="H"+c.toString(32));b+=":"}else c=Ie++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Me={readContext:ld,useCallback:of,useContext:ld,useEffect:Xe,useImperativeHandle:mf,
useInsertionEffect:jf,useLayoutEffect:kf,useMemo:pf,useReducer:Te,useRef:ef,useState:function(){return Te(Se)},useDebugValue:nf,useDeferredValue:function(a){var b=Te(Se),c=b[0],d=b[1];Xe(function(){var b=De.transition;De.transition={};try{d(a)}finally{De.transition=b}},[a]);return c},useTransition:function(){var a=Te(Se)[0],b=Re().memoizedState;return[a,b]},useMutableSource:Ve,useSyncExternalStore:We,useId:rf,unstable_isNewReconciler:!1},Ne={readContext:ld,useCallback:of,useContext:ld,useEffect:Xe,
useImperativeHandle:mf,useInsertionEffect:jf,useLayoutEffect:kf,useMemo:pf,useReducer:Ue,useRef:ef,useState:function(){return Ue(Se)},useDebugValue:nf,useDeferredValue:function(a){var b=Ue(Se),c=b[0],d=b[1];Xe(function(){var b=De.transition;De.transition={};try{d(a)}finally{De.transition=b}},[a]);return c},useTransition:function(){var a=Ue(Se)[0],b=Re().memoizedState;return[a,b]},useMutableSource:Ve,useSyncExternalStore:We,useId:rf,unstable_isNewReconciler:!1};
function xf(a,b){try{var c="",d=b;do c+=$c(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e}}function yf(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var zf="function"===typeof WeakMap?WeakMap:Map;function Af(a,b,c){c=qd(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Bf||(Bf=!0,Cf=d);yf(a,b)};return c}
function Df(a,b,c){c=qd(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){yf(a,b)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){yf(a,b);"function"!==typeof d&&(null===Ef?Ef=new Set([this]):Ef.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}
function Ff(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new zf;var e=new Set;d.set(b,e)}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Gf.bind(null,a,b,c),b.then(a,a))}function Hf(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return}while(null!==a);return null}
function If(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=qd(-1,1),b.tag=2,rd(c,b))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}function Jf(a){a.flags|=4}function Kf(a,b){if(null!==a&&a.child===b.child)return!0;if(0!==(b.flags&16))return!1;for(a=b.child;null!==a;){if(0!==(a.flags&12854)||0!==(a.subtreeFlags&12854))return!1;a=a.sibling}return!0}var Lf,Mf,Nf,Of;
if(Ua)Lf=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)La(a,c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}},Mf=function(){},Nf=function(a,b,c,d,e){a=a.memoizedProps;if(a!==d){var f=b.stateNode,g=ue(re.current);c=Na(f,c,a,d,e,g);(b.updateQueue=c)&&Jf(b)}},Of=function(a,b,c,d){c!==d&&Jf(b)};else if(Va){Lf=function(a,
b,c,d){for(var e=b.child;null!==e;){if(5===e.tag){var f=e.stateNode;c&&d&&(f=Db(f,e.type,e.memoizedProps,e));La(a,f)}else if(6===e.tag)f=e.stateNode,c&&d&&(f=Eb(f,e.memoizedProps,e)),La(a,f);else if(4!==e.tag)if(22===e.tag&&null!==e.memoizedState)f=e.child,null!==f&&(f.return=e),Lf(a,e,!0,!0);else if(null!==e.child){e.child.return=e;e=e.child;continue}if(e===b)break;for(;null===e.sibling;){if(null===e.return||e.return===b)return;e=e.return}e.sibling.return=e.return;e=e.sibling}};var Pf=function(a,
b,c,d){for(var e=b.child;null!==e;){if(5===e.tag){var f=e.stateNode;c&&d&&(f=Db(f,e.type,e.memoizedProps,e));Ab(a,f)}else if(6===e.tag)f=e.stateNode,c&&d&&(f=Eb(f,e.memoizedProps,e)),Ab(a,f);else if(4!==e.tag)if(22===e.tag&&null!==e.memoizedState)f=e.child,null!==f&&(f.return=e),Pf(a,e,!0,!0);else if(null!==e.child){e.child.return=e;e=e.child;continue}if(e===b)break;for(;null===e.sibling;){if(null===e.return||e.return===b)return;e=e.return}e.sibling.return=e.return;e=e.sibling}};Mf=function(a,b){var c=
b.stateNode;if(!Kf(a,b)){a=c.containerInfo;var d=zb(a);Pf(d,b,!1,!1);c.pendingChildren=d;Jf(b);Bb(a,d)}};Nf=function(a,b,c,d,e){var f=a.stateNode,g=a.memoizedProps;if((a=Kf(a,b))&&g===d)b.stateNode=f;else{var h=b.stateNode,k=ue(re.current),l=null;g!==d&&(l=Na(h,c,g,d,e,k));a&&null===l?b.stateNode=f:(f=yb(f,l,c,g,d,b,a,h),Ma(f,c,d,e,k)&&Jf(b),b.stateNode=f,a?Jf(b):Lf(f,b,!1,!1))}};Of=function(a,b,c,d){c!==d?(a=ue(te.current),c=ue(re.current),b.stateNode=Pa(d,a,c,b),Jf(b)):b.stateNode=a.stateNode}}else Mf=
function(){},Nf=function(){},Of=function(){};function Qf(a,b){if(!I)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function P(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Rf(a,b,c){var d=b.pendingProps;Sd(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return P(b),null;case 1:return C(b.type)&&kc(),P(b),null;case 3:d=b.stateNode;we();x(B);x(A);Be();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)ce(b)?Jf(b):null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==Wd&&(Sf(Wd),Wd=null));Mf(a,b);P(b);return null;case 5:ye(b);c=ue(te.current);var e=
b.type;if(null!==a&&null!=b.stateNode)Nf(a,b,e,d,c),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else{if(!d){if(null===b.stateNode)throw Error(n(166));P(b);return null}a=ue(re.current);if(ce(b)){if(!p)throw Error(n(175));a=Pb(b.stateNode,b.type,b.memoizedProps,c,a,b,!Vd);b.updateQueue=a;null!==a&&Jf(b)}else{var f=Ka(e,d,c,a,b);Lf(f,b,!1,!1);b.stateNode=f;Ma(f,e,d,c,a)&&Jf(b)}null!==b.ref&&(b.flags|=512,b.flags|=2097152)}P(b);return null;case 6:if(a&&null!=b.stateNode)Of(a,b,a.memoizedProps,d);else{if("string"!==
typeof d&&null===b.stateNode)throw Error(n(166));a=ue(te.current);c=ue(re.current);if(ce(b)){if(!p)throw Error(n(176));a=b.stateNode;d=b.memoizedProps;if(c=Qb(a,d,b,!Vd))if(e=Td,null!==e)switch(f=0!==(e.mode&1),e.tag){case 3:Yb(e.stateNode.containerInfo,a,d,f);break;case 5:Zb(e.type,e.memoizedProps,e.stateNode,a,d,f)}c&&Jf(b)}else b.stateNode=Pa(d,a,c,b)}P(b);return null;case 13:x(J);d=b.memoizedState;if(I&&null!==Ud&&0!==(b.mode&1)&&0===(b.flags&128)){for(a=Ud;a;)a=Lb(a);de();b.flags|=98560;return b}if(null!==
d&&null!==d.dehydrated){d=ce(b);if(null===a){if(!d)throw Error(n(318));if(!p)throw Error(n(344));a=b.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(n(317));Rb(a,b)}else de(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;P(b);return null}null!==Wd&&(Sf(Wd),Wd=null);if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;c=!1;null===a?ce(b):c=null!==a.memoizedState;d&&!c&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(J.current&1)?0===Q&&(Q=3):Tf()));null!==b.updateQueue&&(b.flags|=
4);P(b);return null;case 4:return we(),Mf(a,b),null===a&&Xa(b.stateNode.containerInfo),P(b),null;case 10:return hd(b.type._context),P(b),null;case 17:return C(b.type)&&kc(),P(b),null;case 19:x(J);e=b.memoizedState;if(null===e)return P(b),null;d=0!==(b.flags&128);f=e.rendering;if(null===f)if(d)Qf(e,!1);else{if(0!==Q||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){f=ze(a);if(null!==f){b.flags|=128;Qf(e,!1);a=f.updateQueue;null!==a&&(b.updateQueue=a,b.flags|=4);b.subtreeFlags=0;a=c;for(d=b.child;null!==
d;)c=d,e=a,c.flags&=14680066,f=c.alternate,null===f?(c.childLanes=0,c.lanes=e,c.child=null,c.subtreeFlags=0,c.memoizedProps=null,c.memoizedState=null,c.updateQueue=null,c.dependencies=null,c.stateNode=null):(c.childLanes=f.childLanes,c.lanes=f.lanes,c.child=f.child,c.subtreeFlags=0,c.deletions=null,c.memoizedProps=f.memoizedProps,c.memoizedState=f.memoizedState,c.updateQueue=f.updateQueue,c.type=f.type,e=f.dependencies,c.dependencies=null===e?null:{lanes:e.lanes,firstContext:e.firstContext}),d=d.sibling;
y(J,J.current&1|2);return b.child}a=a.sibling}null!==e.tail&&E()>Uf&&(b.flags|=128,d=!0,Qf(e,!1),b.lanes=4194304)}else{if(!d)if(a=ze(f),null!==a){if(b.flags|=128,d=!0,a=a.updateQueue,null!==a&&(b.updateQueue=a,b.flags|=4),Qf(e,!0),null===e.tail&&"hidden"===e.tailMode&&!f.alternate&&!I)return P(b),null}else 2*E()-e.renderingStartTime>Uf&&1073741824!==c&&(b.flags|=128,d=!0,Qf(e,!1),b.lanes=4194304);e.isBackwards?(f.sibling=b.child,b.child=f):(a=e.last,null!==a?a.sibling=f:b.child=f,e.last=f)}if(null!==
e.tail)return b=e.tail,e.rendering=b,e.tail=b.sibling,e.renderingStartTime=E(),b.sibling=null,a=J.current,y(J,d?a&1|2:a&1),b;P(b);return null;case 22:case 23:return Vf(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(Wf&1073741824)&&(P(b),Ua&&b.subtreeFlags&6&&(b.flags|=8192)):P(b),null;case 24:return null;case 25:return null}throw Error(n(156,b.tag));}var Xf=ea.ReactCurrentOwner,kd=!1;
function R(a,b,c,d){b.child=null===a?pe(b,null,c,d):oe(b,a.child,c,d)}function Yf(a,b,c,d,e){c=c.render;var f=b.ref;jd(b,e);d=Ke(a,b,c,d,f,e);c=Pe();if(null!==a&&!kd)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zf(a,b,e);I&&c&&Rd(b);b.flags|=1;R(a,b,d,e);return b.child}
function $f(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!ag(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bg(a,b,f,d,e);a=le(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Zc;if(c(g,d)&&a.ref===b.ref)return Zf(a,b,e)}b.flags|=1;a=je(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function bg(a,b,c,d,e){if(null!==a&&Zc(a.memoizedProps,d)&&a.ref===b.ref)if(kd=!1,0!==(a.lanes&e))0!==(a.flags&131072)&&(kd=!0);else return b.lanes=a.lanes,Zf(a,b,e);return cg(a,b,c,d,e)}
function dg(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null},y(eg,Wf),Wf|=c;else if(0!==(c&1073741824))b.memoizedState={baseLanes:0,cachePool:null},d=null!==f?f.baseLanes:c,y(eg,Wf),Wf|=d;else return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null},b.updateQueue=null,y(eg,Wf),Wf|=a,null;else null!==f?(d=f.baseLanes|c,b.memoizedState=null):
d=c,y(eg,Wf),Wf|=d;R(a,b,e,c);return b.child}function fg(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152}function cg(a,b,c,d,e){var f=C(c)?ic:A.current;f=jc(b,f);jd(b,e);c=Ke(a,b,c,d,f,e);d=Pe();if(null!==a&&!kd)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zf(a,b,e);I&&d&&Rd(b);b.flags|=1;R(a,b,c,e);return b.child}
function gg(a,b,c,d,e){if(C(c)){var f=!0;nc(b)}else f=!1;jd(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),Dd(b,c,d),Fd(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=ld(l):(l=C(c)?ic:A.current,l=jc(b,l));var m=c.getDerivedStateFromProps,v="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;v||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==
typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Ed(b,g,d,l);nd=!1;var r=b.memoizedState;g.state=r;ud(b,d,g,e);k=b.memoizedState;h!==d||r!==k||B.current||nd?("function"===typeof m&&(yd(b,c,m,d),k=b.memoizedState),(h=nd||Cd(b,c,h,d,r,k,l))?(v||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&
(b.flags|=4194308)):("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1)}else{g=b.stateNode;pd(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:ad(b.type,h);g.props=l;v=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=ld(k):(k=C(c)?ic:A.current,k=jc(b,k));var z=c.getDerivedStateFromProps;(m="function"===typeof z||"function"===
typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==v||r!==k)&&Ed(b,g,d,k);nd=!1;r=b.memoizedState;g.state=r;ud(b,d,g,e);var q=b.memoizedState;h!==v||r!==q||B.current||nd?("function"===typeof z&&(yd(b,c,z,d),q=b.memoizedState),(l=nd||Cd(b,c,l,d,r,q,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,
q,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,q,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=q),g.props=d,g.state=q,g.context=k,d=l):("function"!==
typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1)}return hg(a,b,c,d,f,e)}
function hg(a,b,c,d,e,f){fg(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&oc(b,c,!1),Zf(a,b,f);d=b.stateNode;Xf.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=oe(b,a.child,null,f),b.child=oe(b,null,h,f)):R(a,b,h,f);b.memoizedState=d.state;e&&oc(b,c,!0);return b.child}function ig(a){var b=a.stateNode;b.pendingContext?lc(a,b.pendingContext,b.pendingContext!==b.context):b.context&&lc(a,b.context,!1);ve(a,b.containerInfo)}
function jg(a,b,c,d,e){de();ee(e);b.flags|=256;R(a,b,c,d);return b.child}var kg={dehydrated:null,treeContext:null,retryLane:0};function lg(a){return{baseLanes:a,cachePool:null}}
function mg(a,b,c){var d=b.pendingProps,e=J.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;y(J,e&1);if(null===a){ae(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:Jb(a)?b.lanes=8:b.lanes=1073741824,null;e=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,e={mode:"hidden",children:e},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=e):
f=ng(e,d,0,null),a=ne(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=lg(c),b.memoizedState=kg,a):og(b,e)}e=a.memoizedState;if(null!==e){h=e.dehydrated;if(null!==h){if(g){if(b.flags&256)return b.flags&=-257,pg(a,b,c,Error(n(422)));if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=ng({mode:"visible",children:d.children},e,0,null);f=ne(f,e,c,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&oe(b,a.child,
null,c);b.child.memoizedState=lg(c);b.memoizedState=kg;return f}if(0===(b.mode&1))b=pg(a,b,c,null);else if(Jb(h))b=pg(a,b,c,Error(n(419)));else if(d=0!==(c&a.childLanes),kd||d){d=F;if(null!==d){switch(c&-c){case 4:f=2;break;case 16:f=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:f=32;break;case 536870912:f=
268435456;break;default:f=0}d=0!==(f&(d.suspendedLanes|c))?0:f;0!==d&&d!==e.retryLane&&(e.retryLane=d,Ad(a,d,-1))}Tf();b=pg(a,b,c,Error(n(421)))}else Ib(h)?(b.flags|=128,b.child=a.child,b=qg.bind(null,a),Kb(h,b),b=null):(c=e.treeContext,p&&(Ud=Ob(h),Td=b,I=!0,Wd=null,Vd=!1,null!==c&&(Kd[Ld++]=Nd,Kd[Ld++]=Od,Kd[Ld++]=Md,Nd=c.id,Od=c.overflow,Md=b)),b=og(b,b.pendingProps.children),b.flags|=4096);return b}if(f)return d=rg(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=
null===e?lg(c):{baseLanes:e.baseLanes|c,cachePool:null},f.childLanes=a.childLanes&~c,b.memoizedState=kg,d;c=sg(a,b,d.children,c);b.memoizedState=null;return c}if(f)return d=rg(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?lg(c):{baseLanes:e.baseLanes|c,cachePool:null},f.childLanes=a.childLanes&~c,b.memoizedState=kg,d;c=sg(a,b,d.children,c);b.memoizedState=null;return c}
function og(a,b){b=ng({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sg(a,b,c,d){var e=a.child;a=e.sibling;c=je(e,{mode:"visible",children:c});0===(b.mode&1)&&(c.lanes=d);c.return=b;c.sibling=null;null!==a&&(d=b.deletions,null===d?(b.deletions=[a],b.flags|=16):d.push(a));return b.child=c}
function rg(a,b,c,d,e){var f=b.mode;a=a.child;var g=a.sibling,h={mode:"hidden",children:c};0===(f&1)&&b.child!==a?(c=b.child,c.childLanes=0,c.pendingProps=h,b.deletions=null):(c=je(a,h),c.subtreeFlags=a.subtreeFlags&14680064);null!==g?d=je(g,d):(d=ne(d,f,e,null),d.flags|=2);d.return=b;c.return=b;c.sibling=d;b.child=c;return d}function pg(a,b,c,d){null!==d&&ee(d);oe(b,a.child,null,c);a=og(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function tg(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);id(a.return,b,c)}function ug(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e)}
function vg(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;R(a,b,d.children,c);d=J.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else{if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&tg(a,c,b);else if(19===a.tag)tg(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}y(J,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===ze(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);ug(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===ze(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}ug(b,!0,c,null,f);break;case "together":ug(b,!1,null,null,void 0);break;default:b.memoizedState=null}return b.child}
function Zf(a,b,c){null!==a&&(b.dependencies=a.dependencies);vd|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(n(153));if(null!==b.child){a=b.child;c=je(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=je(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}
function wg(a,b,c){switch(b.tag){case 3:ig(b);de();break;case 5:xe(b);break;case 1:C(b.type)&&nc(b);break;case 4:ve(b,b.stateNode.containerInfo);break;case 10:gd(b,b.type._context,b.memoizedProps.value);break;case 13:var d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return y(J,J.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return mg(a,b,c);y(J,J.current&1);a=Zf(a,b,c);return null!==a?a.sibling:null}y(J,J.current&1);break;case 19:d=0!==(c&b.childLanes);if(0!==(a.flags&128)){if(d)return vg(a,
b,c);b.flags|=128}var e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);y(J,J.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dg(a,b,c)}return Zf(a,b,c)}
function xg(a,b){Sd(b);switch(b.tag){case 1:return C(b.type)&&kc(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return we(),x(B),x(A),Be(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return ye(b),null;case 13:x(J);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(n(340));de()}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return x(J),null;case 4:return we(),null;case 10:return hd(b.type._context),null;case 22:case 23:return Vf(),
null;case 24:return null;default:return null}}var yg=!1,zg=!1,Ag="function"===typeof WeakSet?WeakSet:Set,S=null;function Bg(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null)}catch(d){T(a,b,d)}else c.current=null}function Cg(a,b,c){try{c()}catch(d){T(a,b,d)}}var Dg=!1;
function Eg(a,b){Ia(a.containerInfo);for(S=b;null!==S;)if(a=S,b=a.child,0!==(a.subtreeFlags&1028)&&null!==b)b.return=a,S=b;else for(;null!==S;){a=S;try{var c=a.alternate;if(0!==(a.flags&1024))switch(a.tag){case 0:case 11:case 15:break;case 1:if(null!==c){var d=c.memoizedProps,e=c.memoizedState,f=a.stateNode,g=f.getSnapshotBeforeUpdate(a.elementType===a.type?d:ad(a.type,d),e);f.__reactInternalSnapshotBeforeUpdate=g}break;case 3:Ua&&xb(a.stateNode.containerInfo);break;case 5:case 6:case 4:case 17:break;
default:throw Error(n(163));}}catch(h){T(a,a.return,h)}b=a.sibling;if(null!==b){b.return=a.return;S=b;break}S=a.return}c=Dg;Dg=!1;return c}function Fg(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Cg(b,c,f)}e=e.next}while(e!==d)}}function Gg(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d()}c=c.next}while(c!==b)}}
function Hg(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=Fa(c);break;default:a=c}"function"===typeof b?b(a):b.current=a}}
function Ig(a,b,c){if(Oc&&"function"===typeof Oc.onCommitFiberUnmount)try{Oc.onCommitFiberUnmount(Nc,b)}catch(g){}switch(b.tag){case 0:case 11:case 14:case 15:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var d=a=a.next;do{var e=d,f=e.destroy;e=e.tag;void 0!==f&&(0!==(e&2)?Cg(b,c,f):0!==(e&4)&&Cg(b,c,f));d=d.next}while(d!==a)}break;case 1:Bg(b,c);a=b.stateNode;if("function"===typeof a.componentWillUnmount)try{a.props=b.memoizedProps,a.state=b.memoizedState,a.componentWillUnmount()}catch(g){T(b,
c,g)}break;case 5:Bg(b,c);break;case 4:Ua?Jg(a,b,c):Va&&Va&&(b=b.stateNode.containerInfo,c=zb(b),Cb(b,c))}}function Kg(a,b,c){for(var d=b;;)if(Ig(a,d,c),null===d.child||Ua&&4===d.tag){if(d===b)break;for(;null===d.sibling;){if(null===d.return||d.return===b)return;d=d.return}d.sibling.return=d.return;d=d.sibling}else d.child.return=d,d=d.child}
function Lg(a){var b=a.alternate;null!==b&&(a.alternate=null,Lg(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&Za(b));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null}function Mg(a){return 5===a.tag||3===a.tag||4===a.tag}
function Ng(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Mg(a.return))return null;a=a.return}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child}if(!(a.flags&2))return a.stateNode}}
function Og(a){if(Ua){a:{for(var b=a.return;null!==b;){if(Mg(b))break a;b=b.return}throw Error(n(160));}var c=b;switch(c.tag){case 5:b=c.stateNode;c.flags&32&&(sb(b),c.flags&=-33);c=Ng(a);Pg(a,c,b);break;case 3:case 4:b=c.stateNode.containerInfo;c=Ng(a);Qg(a,c,b);break;default:throw Error(n(161));}}}function Qg(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?pb(c,a,b):kb(c,a);else if(4!==d&&(a=a.child,null!==a))for(Qg(a,b,c),a=a.sibling;null!==a;)Qg(a,b,c),a=a.sibling}
function Pg(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?ob(c,a,b):jb(c,a);else if(4!==d&&(a=a.child,null!==a))for(Pg(a,b,c),a=a.sibling;null!==a;)Pg(a,b,c),a=a.sibling}
function Jg(a,b,c){for(var d=b,e=!1,f,g;;){if(!e){e=d.return;a:for(;;){if(null===e)throw Error(n(160));f=e.stateNode;switch(e.tag){case 5:g=!1;break a;case 3:f=f.containerInfo;g=!0;break a;case 4:f=f.containerInfo;g=!0;break a}e=e.return}e=!0}if(5===d.tag||6===d.tag)Kg(a,d,c),g?rb(f,d.stateNode):qb(f,d.stateNode);else if(18===d.tag)g?Wb(f,d.stateNode):Vb(f,d.stateNode);else if(4===d.tag){if(null!==d.child){f=d.stateNode.containerInfo;g=!0;d.child.return=d;d=d.child;continue}}else if(Ig(a,d,c),null!==
d.child){d.child.return=d;d=d.child;continue}if(d===b)break;for(;null===d.sibling;){if(null===d.return||d.return===b)return;d=d.return;4===d.tag&&(e=!1)}d.sibling.return=d.return;d=d.sibling}}
function Rg(a,b){if(Ua){switch(b.tag){case 0:case 11:case 14:case 15:Fg(3,b,b.return);Gg(3,b);Fg(5,b,b.return);return;case 1:return;case 5:var c=b.stateNode;if(null!=c){var d=b.memoizedProps;a=null!==a?a.memoizedProps:d;var e=b.type,f=b.updateQueue;b.updateQueue=null;null!==f&&nb(c,f,e,a,d,b)}return;case 6:if(null===b.stateNode)throw Error(n(162));c=b.memoizedProps;lb(b.stateNode,null!==a?a.memoizedProps:c,c);return;case 3:p&&null!==a&&a.memoizedState.isDehydrated&&Tb(b.stateNode.containerInfo);return;
case 12:return;case 13:Sg(b);return;case 19:Sg(b);return;case 17:return}throw Error(n(163));}switch(b.tag){case 0:case 11:case 14:case 15:Fg(3,b,b.return);Gg(3,b);Fg(5,b,b.return);return;case 12:return;case 13:Sg(b);return;case 19:Sg(b);return;case 3:p&&null!==a&&a.memoizedState.isDehydrated&&Tb(b.stateNode.containerInfo);break;case 22:case 23:return}a:if(Va){switch(b.tag){case 1:case 5:case 6:break a;case 3:case 4:b=b.stateNode;Cb(b.containerInfo,b.pendingChildren);break a}throw Error(n(163));}}
function Sg(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ag);b.forEach(function(b){var d=Tg.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function Ug(a,b){for(S=b;null!==S;){b=S;var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a;Ua?Jg(f,e,b):Kg(f,e,b);var g=e.alternate;null!==g&&(g.return=null);e.return=null}catch(wa){T(e,b,wa)}}c=b.child;if(0!==(b.subtreeFlags&12854)&&null!==c)c.return=b,S=c;else for(;null!==S;){b=S;try{var h=b.flags;h&32&&Ua&&sb(b.stateNode);if(h&512){var k=b.alternate;if(null!==k){var l=k.ref;null!==l&&("function"===typeof l?l(null):l.current=null)}}if(h&8192)switch(b.tag){case 13:if(null!==
b.memoizedState){var m=b.alternate;if(null===m||null===m.memoizedState)Vg=E()}break;case 22:var v=null!==b.memoizedState,r=b.alternate,z=null!==r&&null!==r.memoizedState;c=b;if(Ua)a:if(d=c,e=v,f=null,Ua)for(var q=d;;){if(5===q.tag){if(null===f){f=q;var N=q.stateNode;e?tb(N):vb(q.stateNode,q.memoizedProps)}}else if(6===q.tag){if(null===f){var da=q.stateNode;e?ub(da):wb(da,q.memoizedProps)}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===d)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===
d)break;for(;null===q.sibling;){if(null===q.return||q.return===d)break a;f===q&&(f=null);q=q.return}f===q&&(f=null);q.sibling.return=q.return;q=q.sibling}if(v&&!z&&0!==(c.mode&1)){S=c;for(var t=c.child;null!==t;){for(c=S=t;null!==S;){d=S;var w=d.child;switch(d.tag){case 0:case 11:case 14:case 15:Fg(4,d,d.return);break;case 1:Bg(d,d.return);var u=d.stateNode;if("function"===typeof u.componentWillUnmount){var V=d.return;try{u.props=d.memoizedProps,u.state=d.memoizedState,u.componentWillUnmount()}catch(wa){T(d,
V,wa)}}break;case 5:Bg(d,d.return);break;case 22:if(null!==d.memoizedState){Wg(c);continue}}null!==w?(w.return=d,S=w):Wg(c)}t=t.sibling}}}switch(h&4102){case 2:Og(b);b.flags&=-3;break;case 6:Og(b);b.flags&=-3;Rg(b.alternate,b);break;case 4096:b.flags&=-4097;break;case 4100:b.flags&=-4097;Rg(b.alternate,b);break;case 4:Rg(b.alternate,b)}}catch(wa){T(b,b.return,wa)}c=b.sibling;if(null!==c){c.return=b.return;S=c;break}S=b.return}}}function Xg(a,b,c){S=a;Yg(a,b,c)}
function Yg(a,b,c){for(var d=0!==(a.mode&1);null!==S;){var e=S,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||yg;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||zg;h=yg;var l=zg;yg=g;if((zg=k)&&!l)for(S=e;null!==S;)g=S,k=g.child,22===g.tag&&null!==g.memoizedState?Zg(e):null!==k?(k.return=g,S=k):Zg(e);for(;null!==f;)S=f,Yg(f,b,c),f=f.sibling;S=e;yg=h;zg=l}$g(a,b,c)}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,S=f):$g(a,b,c)}}
function $g(a){for(;null!==S;){var b=S;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:zg||Gg(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!zg)if(null===c)d.componentDidMount();else{var e=b.elementType===b.type?c.memoizedProps:ad(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate)}var f=b.updateQueue;null!==f&&wd(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
Fa(b.child.stateNode);break;case 1:c=b.child.stateNode}wd(b,g,c)}break;case 5:var h=b.stateNode;null===c&&b.flags&4&&mb(h,b.type,b.memoizedProps,b);break;case 6:break;case 4:break;case 12:break;case 13:if(p&&null===b.memoizedState){var k=b.alternate;if(null!==k){var l=k.memoizedState;if(null!==l){var m=l.dehydrated;null!==m&&Ub(m)}}}break;case 19:case 17:case 21:case 22:case 23:break;default:throw Error(n(163));}zg||b.flags&512&&Hg(b)}catch(v){T(b,b.return,v)}}if(b===a){S=null;break}c=b.sibling;if(null!==
c){c.return=b.return;S=c;break}S=b.return}}function Wg(a){for(;null!==S;){var b=S;if(b===a){S=null;break}var c=b.sibling;if(null!==c){c.return=b.return;S=c;break}S=b.return}}
function Zg(a){for(;null!==S;){var b=S;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Gg(4,b)}catch(k){T(b,c,k)}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount()}catch(k){T(b,e,k)}}var f=b.return;try{Hg(b)}catch(k){T(b,f,k)}break;case 5:var g=b.return;try{Hg(b)}catch(k){T(b,g,k)}}}catch(k){T(b,b.return,k)}if(b===a){S=null;break}var h=b.sibling;if(null!==h){h.return=b.return;S=h;break}S=b.return}}
var ah=0,bh=1,ch=2,dh=3,eh=4;if("function"===typeof Symbol&&Symbol.for){var fh=Symbol.for;ah=fh("selector.component");bh=fh("selector.has_pseudo_class");ch=fh("selector.role");dh=fh("selector.test_id");eh=fh("selector.text")}function gh(a){var b=Wa(a);if(null!=b){if("string"!==typeof b.memoizedProps["data-testname"])throw Error(n(364));return b}a=cb(a);if(null===a)throw Error(n(362));return a.stateNode.current}
function hh(a,b){switch(b.$$typeof){case ah:if(a.type===b.value)return!0;break;case bh:a:{b=b.value;a=[a,0];for(var c=0;c<a.length;){var d=a[c++],e=a[c++],f=b[e];if(5!==d.tag||!fb(d)){for(;null!=f&&hh(d,f);)e++,f=b[e];if(e===b.length){b=!0;break a}else for(d=d.child;null!==d;)a.push(d,e),d=d.sibling}}b=!1}return b;case ch:if(5===a.tag&&gb(a.stateNode,b.value))return!0;break;case eh:if(5===a.tag||6===a.tag)if(a=eb(a),null!==a&&0<=a.indexOf(b.value))return!0;break;case dh:if(5===a.tag&&(a=a.memoizedProps["data-testname"],
"string"===typeof a&&a.toLowerCase()===b.value.toLowerCase()))return!0;break;default:throw Error(n(365));}return!1}function ih(a){switch(a.$$typeof){case ah:return"<"+(va(a.value)||"Unknown")+">";case bh:return":has("+(ih(a)||"")+")";case ch:return'[role="'+a.value+'"]';case eh:return'"'+a.value+'"';case dh:return'[data-testname="'+a.value+'"]';default:throw Error(n(365));}}
function jh(a,b){var c=[];a=[a,0];for(var d=0;d<a.length;){var e=a[d++],f=a[d++],g=b[f];if(5!==e.tag||!fb(e)){for(;null!=g&&hh(e,g);)f++,g=b[f];if(f===b.length)c.push(e);else for(e=e.child;null!==e;)a.push(e,f),e=e.sibling}}return c}function kh(a,b){if(!bb)throw Error(n(363));a=gh(a);a=jh(a,b);b=[];a=Array.from(a);for(var c=0;c<a.length;){var d=a[c++];if(5===d.tag)fb(d)||b.push(d.stateNode);else for(d=d.child;null!==d;)a.push(d),d=d.sibling}return b}
var lh=Math.ceil,mh=ea.ReactCurrentDispatcher,nh=ea.ReactCurrentOwner,U=ea.ReactCurrentBatchConfig,G=0,F=null,W=null,X=0,Wf=0,eg=gc(0),Q=0,oh=null,vd=0,ph=0,qh=0,rh=null,Y=null,Vg=0,Uf=Infinity;function sh(){Uf=E()+500}var Bf=!1,Cf=null,Ef=null,th=!1,uh=null,vh=0,wh=0,xh=null,yh=-1,zh=0;function H(){return 0!==(G&6)?E():-1!==yh?yh:yh=E()}
function zd(a){if(0===(a.mode&1))return 1;if(0!==(G&2)&&0!==X)return X&-X;if(null!==Yc.transition)return 0===zh&&(a=tc,tc<<=1,0===(tc&4194240)&&(tc=64),zh=a),zh;a=D;return 0!==a?a:Ya()}function Ad(a,b,c){if(50<wh)throw wh=0,xh=null,Error(n(185));var d=Ah(a,b);if(null===d)return null;Bc(d,b,c);if(0===(G&2)||d!==F)d===F&&(0===(G&2)&&(ph|=b),4===Q&&Bh(d,X)),Z(d,c),1===b&&0===G&&0===(a.mode&1)&&(sh(),Tc&&Xc());return d}
function Ah(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}
function Z(a,b){var c=a.callbackNode;yc(a,b);var d=wc(a,a===F?X:0);if(0===d)null!==c&&Gc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&Gc(c);if(1===b)0===a.tag?Wc(Ch.bind(null,a)):Vc(Ch.bind(null,a)),$a?ab(function(){0===G&&Xc()}):Fc(Jc,Xc),c=null;else{switch(Ec(d)){case 1:c=Jc;break;case 4:c=Kc;break;case 16:c=Lc;break;case 536870912:c=Mc;break;default:c=Lc}c=Dh(c,Eh.bind(null,a))}a.callbackPriority=b;a.callbackNode=c}}
function Eh(a,b){yh=-1;zh=0;if(0!==(G&6))throw Error(n(327));var c=a.callbackNode;if(Fh()&&a.callbackNode!==c)return null;var d=wc(a,a===F?X:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Gh(a,d);else{b=d;var e=G;G|=2;var f=Hh();if(F!==a||X!==b)sh(),Ih(a,b);do try{Jh();break}catch(h){Kh(a,h)}while(1);fd();mh.current=f;G=e;null!==W?b=0:(F=null,X=0,b=Q)}if(0!==b){2===b&&(e=zc(a),0!==e&&(d=e,b=Lh(a,e)));if(1===b)throw c=oh,Ih(a,0),Bh(a,d),Z(a,E()),c;if(6===b)Bh(a,d);else{e=a.current.alternate;
if(0===(d&30)&&!Mh(e)&&(b=Gh(a,d),2===b&&(f=zc(a),0!==f&&(d=f,b=Lh(a,f))),1===b))throw c=oh,Ih(a,0),Bh(a,d),Z(a,E()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(n(345));case 2:Nh(a,Y);break;case 3:Bh(a,d);if((d&130023424)===d&&(b=Vg+500-E(),10<b)){if(0!==wc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){H();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Qa(Nh.bind(null,a,Y),b);break}Nh(a,Y);break;case 4:Bh(a,d);if((d&4194240)===d)break;b=a.eventTimes;for(e=-1;0<
d;){var g=31-qc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f}d=e;d=E()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lh(d/1960))-d;if(10<d){a.timeoutHandle=Qa(Nh.bind(null,a,Y),d);break}Nh(a,Y);break;case 5:Nh(a,Y);break;default:throw Error(n(329));}}}Z(a,E());return a.callbackNode===c?Eh.bind(null,a):null}function Lh(a,b){var c=rh;a.current.memoizedState.isDehydrated&&(Ih(a,b).flags|=256);a=Gh(a,b);2!==a&&(b=Y,Y=c,null!==b&&Sf(b));return a}
function Sf(a){null===Y?Y=a:Y.push.apply(Y,a)}function Mh(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!Rc(f(),e))return!1}catch(g){return!1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else{if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return!0;b=b.return}b.sibling.return=b.return;b=b.sibling}}return!0}
function Bh(a,b){b&=~qh;b&=~ph;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-qc(b),d=1<<c;a[c]=-1;b&=~d}}function Ch(a){if(0!==(G&6))throw Error(n(327));Fh();var b=wc(a,0);if(0===(b&1))return Z(a,E()),null;var c=Gh(a,b);if(0!==a.tag&&2===c){var d=zc(a);0!==d&&(b=d,c=Lh(a,d))}if(1===c)throw c=oh,Ih(a,0),Bh(a,b),Z(a,E()),c;if(6===c)throw Error(n(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Nh(a,Y);Z(a,E());return null}
function Oh(a){null!==uh&&0===uh.tag&&0===(G&6)&&Fh();var b=G;G|=1;var c=U.transition,d=D;try{if(U.transition=null,D=1,a)return a()}finally{D=d,U.transition=c,G=b,0===(G&6)&&Xc()}}function Vf(){Wf=eg.current;x(eg)}
function Ih(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;c!==Sa&&(a.timeoutHandle=Sa,Ra(c));if(null!==W)for(c=W.return;null!==c;){var d=c;Sd(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&kc();break;case 3:we();x(B);x(A);Be();break;case 5:ye(d);break;case 4:we();break;case 13:x(J);break;case 19:x(J);break;case 10:hd(d.type._context);break;case 22:case 23:Vf()}c=c.return}F=a;W=a=je(a.current,null);X=Wf=b;Q=0;oh=null;qh=ph=vd=0;Y=rh=null;if(null!==md){for(b=
0;b<md.length;b++)if(c=md[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g}c.pending=d}md=null}return a}
function Kh(a,b){do{var c=W;try{fd();Ce.current=Oe;if(Fe){for(var d=K.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}Fe=!1}Ee=0;M=L=K=null;Ge=!1;He=0;nh.current=null;if(null===c||null===c.return){Q=1;oh=b;W=null;break}a:{var f=a,g=c.return,h=c,k=b;b=X;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,v=m.tag;if(0===(m.mode&1)&&(0===v||11===v||15===v)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null)}var z=Hf(g);if(null!==z){z.flags&=-257;If(z,g,h,f,b);z.mode&1&&Ff(f,l,b);b=z;k=l;var q=b.updateQueue;if(null===q){var N=new Set;N.add(k);b.updateQueue=N}else q.add(k);break a}else{if(0===(b&1)){Ff(f,l,b);Tf();break a}k=Error(n(426))}}else if(I&&h.mode&1){var da=Hf(g);if(null!==da){0===(da.flags&65536)&&(da.flags|=256);If(da,g,h,f,b);ee(k);break a}}f=k;4!==Q&&(Q=2);null===rh?rh=[f]:rh.push(f);k=xf(k,h);h=g;do{switch(h.tag){case 3:h.flags|=
65536;b&=-b;h.lanes|=b;var t=Af(h,k,b);td(h,t);break a;case 1:f=k;var w=h.type,u=h.stateNode;if(0===(h.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ef||!Ef.has(u)))){h.flags|=65536;b&=-b;h.lanes|=b;var V=Df(h,f,b);td(h,V);break a}}h=h.return}while(null!==h)}Ph(c)}catch(wa){b=wa;W===c&&null!==c&&(W=c=c.return);continue}break}while(1)}function Hh(){var a=mh.current;mh.current=Oe;return null===a?Oe:a}
function Tf(){if(0===Q||3===Q||2===Q)Q=4;null===F||0===(vd&268435455)&&0===(ph&268435455)||Bh(F,X)}function Gh(a,b){var c=G;G|=2;var d=Hh();F===a&&X===b||Ih(a,b);do try{Qh();break}catch(e){Kh(a,e)}while(1);fd();G=c;mh.current=d;if(null!==W)throw Error(n(261));F=null;X=0;return Q}function Qh(){for(;null!==W;)Rh(W)}function Jh(){for(;null!==W&&!Hc();)Rh(W)}function Rh(a){var b=Sh(a.alternate,a,Wf);a.memoizedProps=a.pendingProps;null===b?Ph(a):W=b;nh.current=null}
function Ph(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Rf(c,b,Wf),null!==c){W=c;return}}else{c=xg(c,b);if(null!==c){c.flags&=32767;W=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else{Q=6;W=null;return}}b=b.sibling;if(null!==b){W=b;return}W=b=a}while(null!==b);0===Q&&(Q=5)}function Nh(a,b){var c=D,d=U.transition;try{U.transition=null,D=1,Th(a,b,c)}finally{U.transition=d,D=c}return null}
function Th(a,b,c){do Fh();while(null!==uh);if(0!==(G&6))throw Error(n(327));var d=a.finishedWork,e=a.finishedLanes;if(null===d)return null;a.finishedWork=null;a.finishedLanes=0;if(d===a.current)throw Error(n(177));a.callbackNode=null;a.callbackPriority=0;var f=d.lanes|d.childLanes;Cc(a,f);a===F&&(W=F=null,X=0);0===(d.subtreeFlags&2064)&&0===(d.flags&2064)||th||(th=!0,Dh(Lc,function(){Fh();return null}));f=0!==(d.flags&15990);if(0!==(d.subtreeFlags&15990)||f){f=U.transition;U.transition=null;var g=
D;D=1;var h=G;G|=4;nh.current=null;Eg(a,d);Ug(a,d,e);Ja(a.containerInfo);a.current=d;Xg(d,a,e);Ic();G=h;D=g;U.transition=f}else a.current=d;th&&(th=!1,uh=a,vh=e);f=a.pendingLanes;0===f&&(Ef=null);Pc(d.stateNode,c);Z(a,E());if(null!==b)for(c=a.onRecoverableError,d=0;d<b.length;d++)c(b[d]);if(Bf)throw Bf=!1,a=Cf,Cf=null,a;0!==(vh&1)&&0!==a.tag&&Fh();f=a.pendingLanes;0!==(f&1)?a===xh?wh++:(wh=0,xh=a):wh=0;Xc();return null}
function Fh(){if(null!==uh){var a=Ec(vh),b=U.transition,c=D;try{U.transition=null;D=16>a?16:a;if(null===uh)var d=!1;else{a=uh;uh=null;vh=0;if(0!==(G&6))throw Error(n(331));var e=G;G|=4;for(S=a.current;null!==S;){var f=S,g=f.child;if(0!==(S.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(S=l;null!==S;){var m=S;switch(m.tag){case 0:case 11:case 15:Fg(8,m,f)}var v=m.child;if(null!==v)v.return=m,S=v;else for(;null!==S;){m=S;var r=m.sibling,z=m.return;Lg(m);if(m===
l){S=null;break}if(null!==r){r.return=z;S=r;break}S=z}}}var q=f.alternate;if(null!==q){var N=q.child;if(null!==N){q.child=null;do{var da=N.sibling;N.sibling=null;N=da}while(null!==N)}}S=f}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,S=g;else b:for(;null!==S;){f=S;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Fg(9,f,f.return)}var t=f.sibling;if(null!==t){t.return=f.return;S=t;break b}S=f.return}}var w=a.current;for(S=w;null!==S;){g=S;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,S=u;else b:for(g=w;null!==S;){h=S;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Gg(9,h)}}catch(wa){T(h,h.return,wa)}if(h===g){S=null;break b}var V=h.sibling;if(null!==V){V.return=h.return;S=V;break b}S=h.return}}G=e;Xc();if(Oc&&"function"===typeof Oc.onPostCommitFiberRoot)try{Oc.onPostCommitFiberRoot(Nc,a)}catch(wa){}d=!0}return d}finally{D=c,U.transition=b}}return!1}function Uh(a,b,c){b=xf(c,b);b=Af(a,b,1);rd(a,b);b=H();a=Ah(a,1);null!==a&&(Bc(a,1,b),Z(a,b))}
function T(a,b,c){if(3===a.tag)Uh(a,a,c);else for(;null!==b;){if(3===b.tag){Uh(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ef||!Ef.has(d))){a=xf(c,a);a=Df(b,a,1);rd(b,a);a=H();b=Ah(b,1);null!==b&&(Bc(b,1,a),Z(b,a));break}}b=b.return}}
function Gf(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=H();a.pingedLanes|=a.suspendedLanes&c;F===a&&(X&c)===c&&(4===Q||3===Q&&(X&130023424)===X&&500>E()-Vg?Ih(a,0):qh|=c);Z(a,b)}function Vh(a,b){0===b&&(0===(a.mode&1)?b=1:(b=uc,uc<<=1,0===(uc&130023424)&&(uc=4194304)));var c=H();a=Ah(a,b);null!==a&&(Bc(a,b,c),Z(a,c))}function qg(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Vh(a,c)}
function Tg(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(n(314));}null!==d&&d.delete(b);Vh(a,c)}var Sh;
Sh=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||B.current)kd=!0;else{if(0===(a.lanes&c)&&0===(b.flags&128))return kd=!1,wg(a,b,c);kd=0!==(a.flags&131072)?!0:!1}else kd=!1,I&&0!==(b.flags&1048576)&&Qd(b,Jd,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;var e=jc(b,A.current);jd(b,c);e=Ke(null,b,d,a,e,c);var f=Pe();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?
(b.tag=1,b.memoizedState=null,b.updateQueue=null,C(d)?(f=!0,nc(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,od(b),e.updater=Bd,b.stateNode=e,e._reactInternals=b,Fd(b,d,a,c),b=hg(null,b,d,!0,f,c)):(b.tag=0,I&&f&&Rd(b),R(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Wh(d);a=ad(d,a);switch(e){case 0:b=cg(null,b,d,a,c);break a;case 1:b=gg(null,b,d,
a,c);break a;case 11:b=Yf(null,b,d,a,c);break a;case 14:b=$f(null,b,d,ad(d.type,a),c);break a}throw Error(n(306,d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:ad(d,e),cg(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:ad(d,e),gg(a,b,d,e,c);case 3:a:{ig(b);if(null===a)throw Error(n(387));d=b.pendingProps;f=b.memoizedState;e=f.element;pd(a,b);ud(b,d,null,c);var g=b.memoizedState;d=g.element;if(p&&f.isDehydrated)if(f={element:d,isDehydrated:!1,
cache:g.cache,transitions:g.transitions},b.updateQueue.baseState=f,b.memoizedState=f,b.flags&256){e=Error(n(423));b=jg(a,b,d,c,e);break a}else if(d!==e){e=Error(n(424));b=jg(a,b,d,c,e);break a}else for(p&&(Ud=Nb(b.stateNode.containerInfo),Td=b,I=!0,Wd=null,Vd=!1),c=pe(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else{de();if(d===e){b=Zf(a,b,c);break a}R(a,b,d,c)}b=b.child}return b;case 5:return xe(b),null===a&&ae(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,
Oa(d,e)?g=null:null!==f&&Oa(d,f)&&(b.flags|=32),fg(a,b),R(a,b,g,c),b.child;case 6:return null===a&&ae(b),null;case 13:return mg(a,b,c);case 4:return ve(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=oe(b,null,d,c):R(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:ad(d,e),Yf(a,b,d,e,c);case 7:return R(a,b,b.pendingProps,c),b.child;case 8:return R(a,b,b.pendingProps.children,c),b.child;case 12:return R(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=
b.type._context;e=b.pendingProps;f=b.memoizedProps;g=e.value;gd(b,d,g);if(null!==f)if(Rc(f.value,g)){if(f.children===e.children&&!B.current){b=Zf(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=qd(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=
c);id(f.return,c,b);h.lanes|=c;break}k=k.next}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(n(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);id(g,c,b);g=f.sibling}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return}f=g}R(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,d=b.pendingProps.children,jd(b,c),e=ld(e),d=d(e),b.flags|=
1,R(a,b,d,c),b.child;case 14:return d=b.type,e=ad(d,b.pendingProps),e=ad(d.type,e),$f(a,b,d,e,c);case 15:return bg(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:ad(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),b.tag=1,C(d)?(a=!0,nc(b)):a=!1,jd(b,c),Dd(b,d,e),Fd(b,d,e,c),hg(null,b,d,!0,a,c);case 19:return vg(a,b,c);case 22:return dg(a,b,c)}throw Error(n(156,b.tag));};function Dh(a,b){return Fc(a,b)}
function Xh(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null}function Yd(a,b,c,d){return new Xh(a,b,c,d)}function ag(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function Wh(a){if("function"===typeof a)return ag(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===na)return 11;if(a===qa)return 14}return 2}
function je(a,b){var c=a.alternate;null===c?(c=Yd(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function le(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)ag(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ia:return ne(c.children,e,f,b);case ja:g=8;e|=8;break;case ka:return a=Yd(12,c,b,e|2),a.elementType=ka,a.lanes=f,a;case oa:return a=Yd(13,c,b,e),a.elementType=oa,a.lanes=f,a;case pa:return a=Yd(19,c,b,e),a.elementType=pa,a.lanes=f,a;case sa:return ng(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case la:g=10;break a;case ma:g=9;break a;case na:g=11;
break a;case qa:g=14;break a;case ra:g=16;d=null;break a}throw Error(n(130,null==a?a:typeof a,""));}b=Yd(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function ne(a,b,c,d){a=Yd(7,a,d,b);a.lanes=c;return a}function ng(a,b,c,d){a=Yd(22,a,d,b);a.elementType=sa;a.lanes=c;a.stateNode={};return a}function ke(a,b,c){a=Yd(6,a,null,b);a.lanes=c;return a}
function me(a,b,c){b=Yd(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function Yh(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=Sa;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=Ac(0);this.expirationTimes=Ac(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Ac(0);this.identifierPrefix=d;this.onRecoverableError=e;p&&(this.mutableSourceEagerHydrationData=
null)}function Zh(a,b,c,d,e,f,g,h,k){a=new Yh(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Yd(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null};od(f);return a}
function $h(a){if(!a)return hc;a=a._reactInternals;a:{if(ya(a)!==a||1!==a.tag)throw Error(n(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(C(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return}while(null!==b);throw Error(n(171));}if(1===a.tag){var c=a.type;if(C(c))return mc(a,c,b)}return b}
function ai(a){var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(n(188));a=Object.keys(a).join(",");throw Error(n(268,a));}a=Ba(b);return null===a?null:a.stateNode}function bi(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function ci(a,b){bi(a,b);(a=a.alternate)&&bi(a,b)}function di(a){a=Ba(a);return null===a?null:a.stateNode}function ei(){return null}
exports.attemptContinuousHydration=function(a){if(13===a.tag){var b=H();Ad(a,134217728,b);ci(a,134217728)}};exports.attemptHydrationAtCurrentPriority=function(a){if(13===a.tag){var b=H(),c=zd(a);Ad(a,c,b);ci(a,c)}};exports.attemptSynchronousHydration=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=vc(b.pendingLanes);0!==c&&(Dc(b,c|1),Z(b,E()),0===(G&6)&&(sh(),Xc()))}break;case 13:var d=H();Oh(function(){return Ad(a,1,d)});ci(a,1)}};
exports.batchedUpdates=function(a,b){var c=G;G|=1;try{return a(b)}finally{G=c,0===G&&(sh(),Tc&&Xc())}};exports.createComponentSelector=function(a){return{$$typeof:ah,value:a}};exports.createContainer=function(a,b,c,d,e,f,g){return Zh(a,b,!1,null,c,d,e,f,g)};exports.createHasPseudoClassSelector=function(a){return{$$typeof:bh,value:a}};
exports.createHydrationContainer=function(a,b,c,d,e,f,g,h,k){a=Zh(c,d,!0,a,e,f,g,h,k);a.context=$h(null);c=a.current;d=H();e=zd(c);f=qd(d,e);f.callback=void 0!==b&&null!==b?b:null;rd(c,f);a.current.lanes=e;Bc(a,e,d);Z(a,d);return a};exports.createPortal=function(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:ha,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}};exports.createRoleSelector=function(a){return{$$typeof:ch,value:a}};
exports.createTestNameSelector=function(a){return{$$typeof:dh,value:a}};exports.createTextSelector=function(a){return{$$typeof:eh,value:a}};exports.deferredUpdates=function(a){var b=D,c=U.transition;try{return U.transition=null,D=16,a()}finally{D=b,U.transition=c}};exports.discreteUpdates=function(a,b,c,d,e){var f=D,g=U.transition;try{return U.transition=null,D=1,a(b,c,d,e)}finally{D=f,U.transition=g,0===G&&sh()}};exports.findAllNodes=kh;
exports.findBoundingRects=function(a,b){if(!bb)throw Error(n(363));b=kh(a,b);a=[];for(var c=0;c<b.length;c++)a.push(db(b[c]));for(b=a.length-1;0<b;b--){c=a[b];for(var d=c.x,e=d+c.width,f=c.y,g=f+c.height,h=b-1;0<=h;h--)if(b!==h){var k=a[h],l=k.x,m=l+k.width,v=k.y,r=v+k.height;if(d>=l&&f>=v&&e<=m&&g<=r){a.splice(b,1);break}else if(!(d!==l||c.width!==k.width||r<f||v>g)){v>f&&(k.height+=v-f,k.y=f);r<g&&(k.height=g-v);a.splice(b,1);break}else if(!(f!==v||c.height!==k.height||m<d||l>e)){l>d&&(k.width+=
l-d,k.x=d);m<e&&(k.width=e-l);a.splice(b,1);break}}}return a};exports.findHostInstance=ai;exports.findHostInstanceWithNoPortals=function(a){a=Aa(a);a=null!==a?Da(a):null;return null===a?null:a.stateNode};exports.findHostInstanceWithWarning=function(a){return ai(a)};exports.flushControlled=function(a){var b=G;G|=1;var c=U.transition,d=D;try{U.transition=null,D=1,a()}finally{D=d,U.transition=c,G=b,0===G&&(sh(),Xc())}};exports.flushPassiveEffects=Fh;exports.flushSync=Oh;
exports.focusWithin=function(a,b){if(!bb)throw Error(n(363));a=gh(a);b=jh(a,b);b=Array.from(b);for(a=0;a<b.length;){var c=b[a++];if(!fb(c)){if(5===c.tag&&hb(c.stateNode))return!0;for(c=c.child;null!==c;)b.push(c),c=c.sibling}}return!1};exports.getCurrentUpdatePriority=function(){return D};
exports.getFindAllNodesFailureDescription=function(a,b){if(!bb)throw Error(n(363));var c=0,d=[];a=[gh(a),0];for(var e=0;e<a.length;){var f=a[e++],g=a[e++],h=b[g];if(5!==f.tag||!fb(f))if(hh(f,h)&&(d.push(ih(h)),g++,g>c&&(c=g)),g<b.length)for(f=f.child;null!==f;)a.push(f,g),f=f.sibling}if(c<b.length){for(a=[];c<b.length;c++)a.push(ih(b[c]));return"findAllNodes was able to match part of the selector:\n  "+(d.join(" > ")+"\n\nNo matching component was found for:\n  ")+a.join(" > ")}return null};
exports.getPublicRootInstance=function(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return Fa(a.child.stateNode);default:return a.child.stateNode}};
exports.injectIntoDevTools=function(a){a={bundleType:a.bundleType,version:a.version,rendererPackageName:a.rendererPackageName,rendererConfig:a.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ea.ReactCurrentDispatcher,findHostInstanceByFiber:di,findFiberByHostInstance:a.findFiberByHostInstance||
ei,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.0.0-fc46dba67-20220329"};if("undefined"===typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)a=!1;else{var b=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(b.isDisabled||!b.supportsFiber)a=!0;else{try{Nc=b.inject(a),Oc=b}catch(c){}a=b.checkDCE?!0:!1}}return a};exports.isAlreadyRendering=function(){return!1};
exports.observeVisibleRects=function(a,b,c,d){if(!bb)throw Error(n(363));a=kh(a,b);var e=ib(a,c,d).disconnect;return{disconnect:function(){e()}}};exports.registerMutableSourceForHydration=function(a,b){var c=b._getVersion;c=c(b._source);null==a.mutableSourceEagerHydrationData?a.mutableSourceEagerHydrationData=[b,c]:a.mutableSourceEagerHydrationData.push(b,c)};exports.runWithPriority=function(a,b){var c=D;try{return D=a,b()}finally{D=c}};exports.shouldError=function(){return null};
exports.shouldSuspend=function(){return!1};exports.updateContainer=function(a,b,c,d){var e=b.current,f=H(),g=zd(e);c=$h(c);null===b.context?b.context=c:b.pendingContext=c;b=qd(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);rd(e,b);a=Ad(e,g,f);null!==a&&sd(a,e,g);return g};

    return exports;
};


/***/ }),

/***/ 1801:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(3122);
} else {}


/***/ }),

/***/ 7962:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(9166);
} else {}


/***/ }),

/***/ 6475:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t)}}function H(a){B=!1;G(a);if(!A)if(null!==h(r))A=!0,I(J);else{var b=h(t);null!==b&&K(H,b.startTime-a)}}
function J(a,b){A=!1;B&&(B=!1,E(L),L=-1);z=!0;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b)}else k(r);v=h(r)}if(null!==v)var w=!0;else{var m=h(t);null!==m&&K(H,m.startTime-b);w=!1}return w}finally{v=null,y=c,z=!1}}var N=!1,O=null,L=-1,P=5,Q=-1;
function M(){return exports.unstable_now()-Q<P?!1:!0}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a)}finally{b?S():(N=!1,O=null)}}else N=!1}var S;if("function"===typeof F)S=function(){F(R)};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null)}}else S=function(){D(R,0)};function I(a){O=a;N||(N=!0,S())}function K(a,b){L=D(function(){a(exports.unstable_now())},b)}
exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){A||z||(A=!0,I(J))};
exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y}var c=y;y=b;try{return a()}finally{y=c}};exports.unstable_pauseExecution=function(){};
exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=y;y=a;try{return b()}finally{y=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J)));return a};
exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c}}};


/***/ }),

/***/ 4616:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(6475);
} else {}


/***/ })

}]);