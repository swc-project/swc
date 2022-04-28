(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[398],{

/***/ 6428:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = Image;

var _react = _interopRequireWildcard(__webpack_require__(2784));

var _head = _interopRequireDefault(__webpack_require__(3233));

var _imageConfig = __webpack_require__(5922);

var _useIntersection = __webpack_require__(1514);

var _imageConfigContext = __webpack_require__(4053);

var _utils = __webpack_require__(3177);

var _normalizeTrailingSlash = __webpack_require__(5737);

function Image(_param) {
  var {
    src,
    sizes,
    unoptimized = false,
    priority = false,
    loading,
    lazyRoot = null,
    lazyBoundary = '200px',
    className,
    quality,
    width,
    height,
    style,
    objectFit,
    objectPosition,
    onLoadingComplete,
    placeholder = 'empty',
    blurDataURL
  } = _param,
      all = _objectWithoutProperties(_param, ["src", "sizes", "unoptimized", "priority", "loading", "lazyRoot", "lazyBoundary", "className", "quality", "width", "height", "style", "objectFit", "objectPosition", "onLoadingComplete", "placeholder", "blurDataURL"]);

  const configContext = (0, _react).useContext(_imageConfigContext.ImageConfigContext);
  const config = (0, _react).useMemo(() => {
    const c = configEnv || configContext || _imageConfig.imageConfigDefault;
    const allSizes = [...c.deviceSizes, ...c.imageSizes].sort((a, b) => a - b);
    const deviceSizes = c.deviceSizes.sort((a, b) => a - b);
    return _objectSpread({}, c, {
      allSizes,
      deviceSizes
    });
  }, [configContext]);
  let rest = all;
  let layout = sizes ? 'responsive' : 'intrinsic';

  if ('layout' in rest) {
    // Override default layout if the user specified one:
    if (rest.layout) layout = rest.layout; // Remove property so it's not spread on <img>:

    delete rest.layout;
  }

  let loader = defaultImageLoader;

  if ('loader' in rest) {
    if (rest.loader) {
      const customImageLoader = rest.loader;

      var _tmp;

      _tmp = obj => {
        const {
          config: _
        } = obj,
              opts = _objectWithoutProperties(obj, ["config"]); // The config object is internal only so we must
        // not pass it to the user-defined loader()


        return customImageLoader(opts);
      }, loader = _tmp, _tmp;
    } // Remove property so it's not spread on <img>


    delete rest.loader;
  }

  let staticSrc = '';

  if (isStaticImport(src)) {
    const staticImageData = isStaticRequire(src) ? src.default : src;

    if (!staticImageData.src) {
      throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(staticImageData)));
    }

    blurDataURL = blurDataURL || staticImageData.blurDataURL;
    staticSrc = staticImageData.src;

    if (!layout || layout !== 'fill') {
      height = height || staticImageData.height;
      width = width || staticImageData.width;

      if (!staticImageData.height || !staticImageData.width) {
        throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(staticImageData)));
      }
    }
  }

  src = typeof src === 'string' ? src : staticSrc;
  const widthInt = getInt(width);
  const heightInt = getInt(height);
  const qualityInt = getInt(quality);
  let isLazy = !priority && (loading === 'lazy' || typeof loading === 'undefined');

  if (src.startsWith('data:') || src.startsWith('blob:')) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    unoptimized = true;
    isLazy = false;
  }

  if ( true && loadedImageURLs.has(src)) {
    isLazy = false;
  }

  const [blurComplete, setBlurComplete] = (0, _react).useState(false);
  const [setIntersection, isIntersected, resetIntersected] = (0, _useIntersection).useIntersection({
    rootRef: lazyRoot,
    rootMargin: lazyBoundary,
    disabled: !isLazy
  });
  const isVisible = !isLazy || isIntersected;
  const wrapperStyle = {
    boxSizing: 'border-box',
    display: 'block',
    overflow: 'hidden',
    width: 'initial',
    height: 'initial',
    background: 'none',
    opacity: 1,
    border: 0,
    margin: 0,
    padding: 0
  };
  const sizerStyle = {
    boxSizing: 'border-box',
    display: 'block',
    width: 'initial',
    height: 'initial',
    background: 'none',
    opacity: 1,
    border: 0,
    margin: 0,
    padding: 0
  };
  let hasSizer = false;
  let sizerSvgUrl;
  const layoutStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    boxSizing: 'border-box',
    padding: 0,
    border: 'none',
    margin: 'auto',
    display: 'block',
    width: 0,
    height: 0,
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    objectFit,
    objectPosition
  };

  if (false) {}

  if (false) {}

  const imgStyle = Object.assign({}, style, layout === 'raw' ? {
    aspectRatio: "".concat(widthInt, " / ").concat(heightInt)
  } : layoutStyle);
  const blurStyle = placeholder === 'blur' && !blurComplete ? {
    filter: 'blur(20px)',
    backgroundSize: objectFit || 'cover',
    backgroundImage: "url(\"".concat(blurDataURL, "\")"),
    backgroundPosition: objectPosition || '0% 0%'
  } : {};

  if (layout === 'fill') {
    // <Image src="i.png" layout="fill" />
    wrapperStyle.display = 'block';
    wrapperStyle.position = 'absolute';
    wrapperStyle.top = 0;
    wrapperStyle.left = 0;
    wrapperStyle.bottom = 0;
    wrapperStyle.right = 0;
  } else if (typeof widthInt !== 'undefined' && typeof heightInt !== 'undefined') {
    // <Image src="i.png" width="100" height="100" />
    const quotient = heightInt / widthInt;
    const paddingTop = isNaN(quotient) ? '100%' : "".concat(quotient * 100, "%");

    if (layout === 'responsive') {
      // <Image src="i.png" width="100" height="100" layout="responsive" />
      wrapperStyle.display = 'block';
      wrapperStyle.position = 'relative';
      hasSizer = true;
      sizerStyle.paddingTop = paddingTop;
    } else if (layout === 'intrinsic') {
      // <Image src="i.png" width="100" height="100" layout="intrinsic" />
      wrapperStyle.display = 'inline-block';
      wrapperStyle.position = 'relative';
      wrapperStyle.maxWidth = '100%';
      hasSizer = true;
      sizerStyle.maxWidth = '100%';
      sizerSvgUrl = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(widthInt, "%27%20height=%27").concat(heightInt, "%27/%3e");
    } else if (layout === 'fixed') {
      // <Image src="i.png" width="100" height="100" layout="fixed" />
      wrapperStyle.display = 'inline-block';
      wrapperStyle.position = 'relative';
      wrapperStyle.width = widthInt;
      wrapperStyle.height = heightInt;
    }
  } else {
    // <Image src="i.png" />
    if (false) {}
  }

  let imgAttributes = {
    src: emptyDataURL,
    srcSet: undefined,
    sizes: undefined
  };

  if (isVisible) {
    imgAttributes = generateImgAttrs({
      config,
      src,
      unoptimized,
      layout,
      width: widthInt,
      quality: qualityInt,
      sizes,
      loader
    });
  }

  let srcString = src;

  if (false) {}

  let imageSrcSetPropName = 'imagesrcset';
  let imageSizesPropName = 'imagesizes';

  if (true) {
    imageSrcSetPropName = 'imageSrcSet';
    imageSizesPropName = 'imageSizes';
  }

  const linkProps = {
    // Note: imagesrcset and imagesizes are not in the link element type with react 17.
    [imageSrcSetPropName]: imgAttributes.srcSet,
    [imageSizesPropName]: imgAttributes.sizes
  };
  const useLayoutEffect =  false ? 0 : _react.default.useLayoutEffect;
  const onLoadingCompleteRef = (0, _react).useRef(onLoadingComplete);
  const previousImageSrc = (0, _react).useRef(src);
  (0, _react).useEffect(() => {
    onLoadingCompleteRef.current = onLoadingComplete;
  }, [onLoadingComplete]);
  useLayoutEffect(() => {
    if (previousImageSrc.current !== src) {
      resetIntersected();
      previousImageSrc.current = src;
    }
  }, [resetIntersected, src]);

  const imgElementArgs = _objectSpread({
    isLazy,
    imgAttributes,
    heightInt,
    widthInt,
    qualityInt,
    layout,
    className,
    imgStyle,
    blurStyle,
    loading,
    config,
    unoptimized,
    placeholder,
    loader,
    srcString,
    onLoadingCompleteRef,
    setBlurComplete,
    setIntersection,
    isVisible
  }, rest);

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, layout === 'raw' ? /*#__PURE__*/_react.default.createElement(ImageElement, Object.assign({}, imgElementArgs)) : /*#__PURE__*/_react.default.createElement("span", {
    style: wrapperStyle
  }, hasSizer ? /*#__PURE__*/_react.default.createElement("span", {
    style: sizerStyle
  }, sizerSvgUrl ? /*#__PURE__*/_react.default.createElement("img", {
    style: {
      display: 'block',
      maxWidth: '100%',
      width: 'initial',
      height: 'initial',
      background: 'none',
      opacity: 1,
      border: 0,
      margin: 0,
      padding: 0
    },
    alt: "",
    "aria-hidden": true,
    src: sizerSvgUrl
  }) : null) : null, /*#__PURE__*/_react.default.createElement(ImageElement, Object.assign({}, imgElementArgs))), priority ? // Note how we omit the `href` attribute, as it would only be relevant
  // for browsers that do not support `imagesrcset`, and in those cases
  // it would likely cause the incorrect image to be preloaded.
  //
  // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset

  /*#__PURE__*/
  _react.default.createElement(_head.default, null, /*#__PURE__*/_react.default.createElement("link", Object.assign({
    key: '__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
    rel: "preload",
    as: "image",
    href: imgAttributes.srcSet ? undefined : imgAttributes.src
  }, linkProps))) : null);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj.default = obj;
    return newObj;
  }
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var ref;
const experimentalLayoutRaw = (ref = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","experimentalLayoutRaw":false}) === null || ref === void 0 ? void 0 : ref.experimentalLayoutRaw;
const configEnv = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","experimentalLayoutRaw":false};
const loadedImageURLs = new Set();
const allImgs = new Map();
let perfObserver;
const emptyDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

if (false) {}

const VALID_LOADING_VALUES = (/* unused pure expression or super */ null && (['lazy', 'eager', undefined]));
const loaders = new Map([['default', defaultLoader], ['imgix', imgixLoader], ['cloudinary', cloudinaryLoader], ['akamai', akamaiLoader], ['custom', customLoader]]);
const VALID_LAYOUT_VALUES = (/* unused pure expression or super */ null && (['fill', 'fixed', 'intrinsic', 'responsive', 'raw', undefined]));

function isStaticRequire(src) {
  return src.default !== undefined;
}

function isStaticImageData(src) {
  return src.src !== undefined;
}

function isStaticImport(src) {
  return typeof src === 'object' && (isStaticRequire(src) || isStaticImageData(src));
}

function getWidths({
  deviceSizes,
  allSizes
}, width, layout, sizes) {
  if (sizes && (layout === 'fill' || layout === 'responsive' || layout === 'raw')) {
    // Find all the "vw" percent sizes used in the sizes prop
    const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
    const percentSizes = [];

    for (let match; match = viewportWidthRe.exec(sizes); match) {
      percentSizes.push(parseInt(match[2]));
    }

    if (percentSizes.length) {
      const smallestRatio = Math.min(...percentSizes) * 0.01;
      return {
        widths: allSizes.filter(s => s >= deviceSizes[0] * smallestRatio),
        kind: 'w'
      };
    }

    return {
      widths: allSizes,
      kind: 'w'
    };
  }

  if (typeof width !== 'number' || layout === 'fill' || layout === 'responsive') {
    return {
      widths: deviceSizes,
      kind: 'w'
    };
  }

  const widths = [...new Set( // > This means that most OLED screens that say they are 3x resolution,
  // > are actually 3x in the green color, but only 1.5x in the red and
  // > blue colors. Showing a 3x resolution image in the app vs a 2x
  // > resolution image will be visually the same, though the 3x image
  // > takes significantly more data. Even true 3x resolution screens are
  // > wasteful as the human eye cannot see that level of detail without
  // > something like a magnifying glass.
  // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
  [width, width * 2
  /*, width * 3*/
  ].map(w => allSizes.find(p => p >= w) || allSizes[allSizes.length - 1]))];
  return {
    widths,
    kind: 'x'
  };
}

function generateImgAttrs({
  config,
  src,
  unoptimized,
  layout,
  width,
  quality,
  sizes,
  loader
}) {
  if (unoptimized) {
    return {
      src,
      srcSet: undefined,
      sizes: undefined
    };
  }

  const {
    widths,
    kind
  } = getWidths(config, width, layout, sizes);
  const last = widths.length - 1;
  return {
    sizes: !sizes && kind === 'w' ? '100vw' : sizes,
    srcSet: widths.map((w, i) => "".concat(loader({
      config,
      src,
      quality,
      width: w
    }), " ").concat(kind === 'w' ? w : i + 1).concat(kind)).join(', '),
    // It's intended to keep `src` the last attribute because React updates
    // attributes in order. If we keep `src` the first one, Safari will
    // immediately start to fetch `src`, before `sizes` and `srcSet` are even
    // updated by React. That causes multiple unnecessary requests if `srcSet`
    // and `sizes` are defined.
    // This bug cannot be reproduced in Chrome or Firefox.
    src: loader({
      config,
      src,
      quality,
      width: widths[last]
    })
  };
}

function getInt(x) {
  if (typeof x === 'number') {
    return x;
  }

  if (typeof x === 'string') {
    return parseInt(x, 10);
  }

  return undefined;
}

function defaultImageLoader(loaderProps) {
  var ref2;
  const loaderKey = ((ref2 = loaderProps.config) === null || ref2 === void 0 ? void 0 : ref2.loader) || 'default';
  const load = loaders.get(loaderKey);

  if (load) {
    return load(loaderProps);
  }

  throw new Error("Unknown \"loader\" found in \"next.config.js\". Expected: ".concat(_imageConfig.VALID_LOADERS.join(', '), ". Received: ").concat(loaderKey));
} // See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.


function handleLoading(img, src, layout, placeholder, onLoadingCompleteRef, setBlurComplete) {
  if (!img || img.src === emptyDataURL || img['data-loaded-src'] === src) {
    return;
  }

  img['data-loaded-src'] = src;
  const p = 'decode' in img ? img.decode() : Promise.resolve();
  p.catch(() => {}).then(() => {
    if (!img.parentNode) {
      // Exit early in case of race condition:
      // - onload() is called
      // - decode() is called but incomplete
      // - unmount is called
      // - decode() completes
      return;
    }

    loadedImageURLs.add(src);

    if (placeholder === 'blur') {
      setBlurComplete(true);
    }

    if (onLoadingCompleteRef === null || onLoadingCompleteRef === void 0 ? void 0 : onLoadingCompleteRef.current) {
      const {
        naturalWidth,
        naturalHeight
      } = img; // Pass back read-only primitive values but not the
      // underlying DOM element because it could be misused.

      onLoadingCompleteRef.current({
        naturalWidth,
        naturalHeight
      });
    }

    if (false) { var ref3; }
  });
}

const ImageElement = _param => {
  var {
    imgAttributes,
    heightInt,
    widthInt,
    qualityInt,
    layout,
    className,
    imgStyle,
    blurStyle,
    isLazy,
    placeholder,
    loading,
    srcString,
    config,
    unoptimized,
    loader,
    onLoadingCompleteRef,
    setBlurComplete,
    setIntersection,
    onLoad,
    onError,
    isVisible
  } = _param,
      rest = _objectWithoutProperties(_param, ["imgAttributes", "heightInt", "widthInt", "qualityInt", "layout", "className", "imgStyle", "blurStyle", "isLazy", "placeholder", "loading", "srcString", "config", "unoptimized", "loader", "onLoadingCompleteRef", "setBlurComplete", "setIntersection", "onLoad", "onError", "isVisible"]);

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("img", Object.assign({}, rest, imgAttributes, layout === 'raw' && !imgAttributes.sizes ? {
    height: heightInt,
    width: widthInt
  } : {}, {
    decoding: "async",
    "data-nimg": layout,
    className: className,
    style: _objectSpread({}, imgStyle, blurStyle),
    ref: (0, _react).useCallback(img => {
      setIntersection(img);

      if (img === null || img === void 0 ? void 0 : img.complete) {
        handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
      }
    }, [setIntersection, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete]),
    onLoad: event => {
      const img = event.currentTarget;
      handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);

      if (onLoad) {
        onLoad(event);
      }
    },
    onError: event => {
      if (placeholder === 'blur') {
        // If the real image fails to load, this will still remove the placeholder.
        setBlurComplete(true);
      }

      if (onError) {
        onError(event);
      }
    }
  })), (isLazy || placeholder === 'blur') && /*#__PURE__*/_react.default.createElement("noscript", null, /*#__PURE__*/_react.default.createElement("img", Object.assign({}, rest, generateImgAttrs({
    config,
    src: srcString,
    unoptimized,
    layout,
    width: widthInt,
    quality: qualityInt,
    sizes: imgAttributes.sizes,
    loader
  }), layout === 'raw' && !imgAttributes.sizes ? {
    height: heightInt,
    width: widthInt
  } : {}, {
    decoding: "async",
    "data-nimg": layout,
    style: imgStyle,
    className: className,
    // @ts-ignore - TODO: upgrade to `@types/react@17`
    loading: loading || 'lazy'
  }))));
};

function normalizeSrc(src) {
  return src[0] === '/' ? src.slice(1) : src;
}

function imgixLoader({
  config,
  src,
  width,
  quality
}) {
  // Demo: https://static.imgix.net/daisy.png?auto=format&fit=max&w=300
  const url = new URL("".concat(config.path).concat(normalizeSrc(src)));
  const params = url.searchParams;
  params.set('auto', params.get('auto') || 'format');
  params.set('fit', params.get('fit') || 'max');
  params.set('w', params.get('w') || width.toString());

  if (quality) {
    params.set('q', quality.toString());
  }

  return url.href;
}

function akamaiLoader({
  config,
  src,
  width
}) {
  return "".concat(config.path).concat(normalizeSrc(src), "?imwidth=").concat(width);
}

function cloudinaryLoader({
  config,
  src,
  width,
  quality
}) {
  // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')];
  const paramsString = params.join(',') + '/';
  return "".concat(config.path).concat(paramsString).concat(normalizeSrc(src));
}

function customLoader({
  src
}) {
  throw new Error("Image with src \"".concat(src, "\" is missing \"loader\" prop.") + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader");
}

function defaultLoader({
  config,
  src,
  width,
  quality
}) {
  if (false) {}

  if (src.endsWith('.svg') && !config.dangerouslyAllowSVG) {
    // Special case to make svg serve as-is to avoid proxying
    // through the built-in Image Optimization API.
    return src;
  }

  return "".concat((0, _normalizeTrailingSlash).normalizePathTrailingSlash(config.path), "?url=").concat(encodeURIComponent(src), "&w=").concat(width, "&q=").concat(quality || 75);
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 1514:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useIntersection = useIntersection;

var _react = __webpack_require__(2784);

var _requestIdleCallback = __webpack_require__(1859);

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

function useIntersection({
  rootRef,
  rootMargin,
  disabled
}) {
  const isDisabled = disabled || !hasIntersectionObserver;
  const unobserve = (0, _react).useRef();
  const [visible, setVisible] = (0, _react).useState(false);
  const [root, setRoot] = (0, _react).useState(rootRef ? rootRef.current : null);
  const setRef = (0, _react).useCallback(el => {
    if (unobserve.current) {
      unobserve.current();
      unobserve.current = undefined;
    }

    if (isDisabled || visible) return;

    if (el && el.tagName) {
      unobserve.current = observe(el, isVisible => isVisible && setVisible(isVisible), {
        root,
        rootMargin
      });
    }
  }, [isDisabled, root, rootMargin, visible]);
  const resetVisible = (0, _react).useCallback(() => {
    setVisible(false);
  }, []);
  (0, _react).useEffect(() => {
    if (!hasIntersectionObserver) {
      if (!visible) {
        const idleCallback = (0, _requestIdleCallback).requestIdleCallback(() => setVisible(true));
        return () => (0, _requestIdleCallback).cancelIdleCallback(idleCallback);
      }
    }
  }, [visible]);
  (0, _react).useEffect(() => {
    if (rootRef) setRoot(rootRef.current);
  }, [rootRef]);
  return [setRef, visible, resetVisible];
}

function observe(element, callback, options) {
  const {
    id,
    observer,
    elements
  } = createObserver(options);
  elements.set(element, callback);
  observer.observe(element);
  return function unobserve() {
    elements.delete(element);
    observer.unobserve(element); // Destroy observer when there's nothing left to watch:

    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
      let index = idList.findIndex(obj => obj.root === id.root && obj.margin === id.margin);

      if (index > -1) {
        idList.splice(index, 1);
      }
    }
  };
}

const observers = new Map();
const idList = [];

function createObserver(options) {
  const id = {
    root: options.root || null,
    margin: options.rootMargin || ''
  };
  let existing = idList.find(obj => obj.root === id.root && obj.margin === id.margin);
  let instance;

  if (existing) {
    instance = observers.get(existing);
  } else {
    instance = observers.get(id);
    idList.push(id);
  }

  if (instance) {
    return instance;
  }

  const elements = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const callback = elements.get(entry.target);
      const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;

      if (callback && isVisible) {
        callback(isVisible);
      }
    });
  }, options);
  observers.set(id, instance = {
    id,
    observer,
    elements
  });
  return instance;
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 6577:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(6428)


/***/ }),

/***/ 4589:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "M": function() { return /* binding */ AnimatePresence; }
});

// EXTERNAL MODULE: ../../node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(5163);
// EXTERNAL MODULE: ../../node_modules/react/index.js
var react = __webpack_require__(2784);
// EXTERNAL MODULE: ../../node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(6432);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var use_isomorphic_effect = __webpack_require__(3617);
;// CONCATENATED MODULE: ../../node_modules/framer-motion/dist/es/utils/use-is-mounted.mjs



function useIsMounted() {
    var isMounted = (0,react.useRef)(false);
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () {
        isMounted.current = true;
        return function () {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
}



;// CONCATENATED MODULE: ../../node_modules/framer-motion/dist/es/utils/use-force-update.mjs





function useForceUpdate() {
    var isMounted = useIsMounted();
    var _a = (0,tslib_es6/* __read */.CR)((0,react.useState)(0), 2), forcedRenderCount = _a[0], setForcedRenderCount = _a[1];
    var forceRender = (0,react.useCallback)(function () {
        isMounted.current && setForcedRenderCount(forcedRenderCount + 1);
    }, [forcedRenderCount]);
    /**
     * Defer this to the end of the next animation frame in case there are multiple
     * synchronous calls.
     */
    var deferredForceRender = (0,react.useCallback)(function () { return es/* default.postRender */.ZP.postRender(forceRender); }, [forceRender]);
    return [deferredForceRender, forcedRenderCount];
}



// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/context/PresenceContext.mjs
var PresenceContext = __webpack_require__(7967);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/utils/use-constant.mjs
var use_constant = __webpack_require__(3105);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/utils/use-id.mjs
var use_id = __webpack_require__(6481);
;// CONCATENATED MODULE: ../../node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs







var PresenceChild = function (_a) {
    var children = _a.children, initial = _a.initial, isPresent = _a.isPresent, onExitComplete = _a.onExitComplete, custom = _a.custom, presenceAffectsLayout = _a.presenceAffectsLayout;
    var presenceChildren = (0,use_constant/* useConstant */.h)(newChildrenMap);
    var id = (0,use_id/* useId */.M)();
    var context = (0,react.useMemo)(function () { return ({
        id: id,
        initial: initial,
        isPresent: isPresent,
        custom: custom,
        onExitComplete: function (childId) {
            var e_1, _a;
            presenceChildren.set(childId, true);
            try {
                for (var _b = (0,tslib_es6/* __values */.XA)(presenceChildren.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var isComplete = _c.value;
                    if (!isComplete)
                        return; // can stop searching when any is incomplete
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete();
        },
        register: function (childId) {
            presenceChildren.set(childId, false);
            return function () { return presenceChildren.delete(childId); };
        },
    }); }, 
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    presenceAffectsLayout ? undefined : [isPresent]);
    (0,react.useMemo)(function () {
        presenceChildren.forEach(function (_, key) { return presenceChildren.set(key, false); });
    }, [isPresent]);
    /**
     * If there's no `motion` components to fire exit animations, we want to remove this
     * component immediately.
     */
    react.useEffect(function () {
        !isPresent && !presenceChildren.size && (onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete());
    }, [isPresent]);
    return (react.createElement(PresenceContext/* PresenceContext.Provider */.O.Provider, { value: context }, children));
};
function newChildrenMap() {
    return new Map();
}



// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var LayoutGroupContext = __webpack_require__(3422);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/utils/use-unmount-effect.mjs
var use_unmount_effect = __webpack_require__(6073);
;// CONCATENATED MODULE: ../../node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs











var getChildKey = function (child) { return child.key || ""; };
var isDev = "production" !== "production";
function updateChildLookup(children, allChildren) {
    var seenChildren = isDev ? new Set() : null;
    children.forEach(function (child) {
        var key = getChildKey(child);
        if (isDev && seenChildren && seenChildren.has(key)) {
            console.warn("Children of AnimatePresence require unique keys. \"".concat(key, "\" is a duplicate."));
            seenChildren.add(key);
        }
        allChildren.set(key, child);
    });
}
function onlyElements(children) {
    var filtered = [];
    // We use forEach here instead of map as map mutates the component key by preprending `.$`
    react.Children.forEach(children, function (child) {
        if ((0,react.isValidElement)(child))
            filtered.push(child);
    });
    return filtered;
}
/**
 * `AnimatePresence` enables the animation of components that have been removed from the tree.
 *
 * When adding/removing more than a single child, every child **must** be given a unique `key` prop.
 *
 * Any `motion` components that have an `exit` property defined will animate out when removed from
 * the tree.
 *
 * ```jsx
 * import { motion, AnimatePresence } from 'framer-motion'
 *
 * export const Items = ({ items }) => (
 *   <AnimatePresence>
 *     {items.map(item => (
 *       <motion.div
 *         key={item.id}
 *         initial={{ opacity: 0 }}
 *         animate={{ opacity: 1 }}
 *         exit={{ opacity: 0 }}
 *       />
 *     ))}
 *   </AnimatePresence>
 * )
 * ```
 *
 * You can sequence exit animations throughout a tree using variants.
 *
 * If a child contains multiple `motion` components with `exit` props, it will only unmount the child
 * once all `motion` components have finished animating out. Likewise, any components using
 * `usePresence` all need to call `safeToRemove`.
 *
 * @public
 */
var AnimatePresence = function (_a) {
    var children = _a.children, custom = _a.custom, _b = _a.initial, initial = _b === void 0 ? true : _b, onExitComplete = _a.onExitComplete, exitBeforeEnter = _a.exitBeforeEnter, _c = _a.presenceAffectsLayout, presenceAffectsLayout = _c === void 0 ? true : _c;
    // We want to force a re-render once all exiting animations have finished. We
    // either use a local forceRender function, or one from a parent context if it exists.
    var _d = (0,tslib_es6/* __read */.CR)(useForceUpdate(), 1), forceRender = _d[0];
    var forceRenderLayoutGroup = (0,react.useContext)(LayoutGroupContext/* LayoutGroupContext */.p).forceRender;
    if (forceRenderLayoutGroup)
        forceRender = forceRenderLayoutGroup;
    var isMounted = useIsMounted();
    // Filter out any children that aren't ReactElements. We can only track ReactElements with a props.key
    var filteredChildren = onlyElements(children);
    var childrenToRender = filteredChildren;
    var exiting = new Set();
    // Keep a living record of the children we're actually rendering so we
    // can diff to figure out which are entering and exiting
    var presentChildren = (0,react.useRef)(childrenToRender);
    // A lookup table to quickly reference components by key
    var allChildren = (0,react.useRef)(new Map()).current;
    // If this is the initial component render, just deal with logic surrounding whether
    // we play onMount animations or not.
    var isInitialRender = (0,react.useRef)(true);
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () {
        isInitialRender.current = false;
        updateChildLookup(filteredChildren, allChildren);
        presentChildren.current = childrenToRender;
    });
    (0,use_unmount_effect/* useUnmountEffect */.z)(function () {
        isInitialRender.current = true;
        allChildren.clear();
        exiting.clear();
    });
    if (isInitialRender.current) {
        return (react.createElement(react.Fragment, null, childrenToRender.map(function (child) { return (react.createElement(PresenceChild, { key: getChildKey(child), isPresent: true, initial: initial ? undefined : false, presenceAffectsLayout: presenceAffectsLayout }, child)); })));
    }
    // If this is a subsequent render, deal with entering and exiting children
    childrenToRender = (0,tslib_es6/* __spreadArray */.ev)([], (0,tslib_es6/* __read */.CR)(childrenToRender), false);
    // Diff the keys of the currently-present and target children to update our
    // exiting list.
    var presentKeys = presentChildren.current.map(getChildKey);
    var targetKeys = filteredChildren.map(getChildKey);
    // Diff the present children with our target children and mark those that are exiting
    var numPresent = presentKeys.length;
    for (var i = 0; i < numPresent; i++) {
        var key = presentKeys[i];
        if (targetKeys.indexOf(key) === -1) {
            exiting.add(key);
        }
    }
    // If we currently have exiting children, and we're deferring rendering incoming children
    // until after all current children have exiting, empty the childrenToRender array
    if (exitBeforeEnter && exiting.size) {
        childrenToRender = [];
    }
    // Loop through all currently exiting components and clone them to overwrite `animate`
    // with any `exit` prop they might have defined.
    exiting.forEach(function (key) {
        // If this component is actually entering again, early return
        if (targetKeys.indexOf(key) !== -1)
            return;
        var child = allChildren.get(key);
        if (!child)
            return;
        var insertionIndex = presentKeys.indexOf(key);
        var onExit = function () {
            allChildren.delete(key);
            exiting.delete(key);
            // Remove this child from the present children
            var removeIndex = presentChildren.current.findIndex(function (presentChild) { return presentChild.key === key; });
            presentChildren.current.splice(removeIndex, 1);
            // Defer re-rendering until all exiting children have indeed left
            if (!exiting.size) {
                presentChildren.current = filteredChildren;
                if (isMounted.current === false)
                    return;
                forceRender();
                onExitComplete && onExitComplete();
            }
        };
        childrenToRender.splice(insertionIndex, 0, react.createElement(PresenceChild, { key: getChildKey(child), isPresent: false, onExitComplete: onExit, custom: custom, presenceAffectsLayout: presenceAffectsLayout }, child));
    });
    // Add `MotionContext` even to children that don't need it to ensure we're rendering
    // the same tree between renders
    childrenToRender = childrenToRender.map(function (child) {
        var key = child.key;
        return exiting.has(key) ? (child) : (react.createElement(PresenceChild, { key: getChildKey(child), isPresent: true, presenceAffectsLayout: presenceAffectsLayout }, child));
    });
    if (false) {}
    return (react.createElement(react.Fragment, null, exiting.size
        ? childrenToRender
        : childrenToRender.map(function (child) { return (0,react.cloneElement)(child); })));
};




/***/ })

}]);