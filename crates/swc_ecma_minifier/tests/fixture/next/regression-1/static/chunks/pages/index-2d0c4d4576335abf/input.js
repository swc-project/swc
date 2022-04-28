(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 6328:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "__N_SSG": function() { return /* binding */ __N_SSG; },
  "default": function() { return /* binding */ HomePageRoute; }
});

// EXTERNAL MODULE: ../../node_modules/@react-three/drei/core/OrbitControls.js + 1 modules
var OrbitControls = __webpack_require__(5683);
// EXTERNAL MODULE: ../../node_modules/@react-three/fiber/dist/react-three-fiber.esm.js + 2 modules
var react_three_fiber_esm = __webpack_require__(5107);
// EXTERNAL MODULE: ../../node_modules/next-i18next/dist/esm/index.js + 27 modules
var esm = __webpack_require__(6094);
// EXTERNAL MODULE: ../../node_modules/next-seo/lib/next-seo.module.js
var next_seo_module = __webpack_require__(5351);
// EXTERNAL MODULE: ../../node_modules/@react-three/drei/core/MeshWobbleMaterial.js
var MeshWobbleMaterial = __webpack_require__(3041);
// EXTERNAL MODULE: ../../node_modules/@react-three/fiber/dist/index-91152509.esm.js + 2 modules
var index_91152509_esm = __webpack_require__(9060);
// EXTERNAL MODULE: ../../node_modules/react/index.js
var react = __webpack_require__(2784);
// EXTERNAL MODULE: ../../node_modules/three/build/three.module.js
var three_module = __webpack_require__(6995);
// EXTERNAL MODULE: ../../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js
var emotion_react_jsx_runtime_browser_esm = __webpack_require__(2903);
;// CONCATENATED MODULE: ./src/features/home/components/Wobble/Wobble.tsx







const Wobble = () => {
  const meshRef = (0,react.useRef)();
  const {
    0: wireframe,
    1: setWireframe
  } = (0,react.useState)(false);
  (0,index_91152509_esm.z)(() => {
    if (meshRef.current !== undefined) {
      meshRef.current.rotation.x = meshRef.current.rotation.y += 0.0001;
    }
  });
  const {
    0: video
  } = (0,react.useState)(() => {
    const vid = document.createElement('video');
    vid.src = '/videos/influx-red.mp4';
    vid.crossOrigin = 'Anonymous';
    vid.loop = true;
    vid.playbackRate = 1;
    vid.muted = true;
    return vid;
  });
  (0,react.useEffect)(() => void video.play(), [video]);
  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(emotion_react_jsx_runtime_browser_esm/* Fragment */.HY, {
    children: (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)("mesh", {
      ref: meshRef,
      onClick: () => setWireframe(!wireframe),
      children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("sphereGeometry", {
        args: [2, 2]
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(MeshWobbleMaterial/* MeshWobbleMaterial */.u, {
        color: "#4488FF",
        speed: 0.8,
        wireframe: wireframe,
        children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("videoTexture", {
          attach: "map",
          args: [video],
          offset: new three_module.Vector2(0.4, 0.1)
        })
      })]
    })
  });
};
;// CONCATENATED MODULE: ./src/features/home/components/Wobble/index.ts

;// CONCATENATED MODULE: ./src/features/home/home.config.ts
const homeConfig = {
  i18nNamespaces: ['common', 'home']
};
;// CONCATENATED MODULE: ./src/features/home/pages/HomePage.tsx









const canvasStyle = {
  width: '100vw',
  height: '100vh'
};
const HomePage = () => {
  const {
    t
  } = (0,esm/* useTranslation */.$G)(homeConfig.i18nNamespaces);
  return (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(emotion_react_jsx_runtime_browser_esm/* Fragment */.HY, {
    children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(next_seo_module/* NextSeo */.PB, {
      title: t('home:page.title'),
      description: t('home:page.description')
    }), (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(react_three_fiber_esm/* Canvas */.Xz, {
      style: canvasStyle,
      children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("ambientLight", {
        intensity: 0.4
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("directionalLight", {
        color: "yellow",
        position: [0, 5, 5]
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(Wobble, {}), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(OrbitControls/* OrbitControls */.z, {
        maxPolarAngle: 90,
        minPolarAngle: 1,
        enablePan: false,
        enableRotate: true,
        enableZoom: true,
        maxZoom: 0.1,
        minZoom: 0.01
      })]
    })]
  });
};
;// CONCATENATED MODULE: ./src/features/home/pages/index.ts

;// CONCATENATED MODULE: ./src/pages/index.tsx


var __N_SSG = true;
function HomePageRoute(_props) {
  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(HomePage, {});
}

/***/ }),

/***/ 7314:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(6328);
      }
    ]);
    if(false) {}
  

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [546,351,948,774,888,179], function() { return __webpack_exec__(7314); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);