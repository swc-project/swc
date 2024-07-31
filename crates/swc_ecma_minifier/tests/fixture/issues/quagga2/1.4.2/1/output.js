!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : "object" == typeof exports ? exports.Quagga = factory() : root.Quagga = factory();
}(window, function() {
    return /******/ function(modules) {
        // webpackBootstrap
        /******/ // The module cache
        /******/ var installedModules = {};
        /******/ /******/ // The require function
        /******/ function __webpack_require__(moduleId) {
            /******/ /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) /******/ return installedModules[moduleId].exports;
            /******/ // Create a new module (and put it into the cache)
            /******/ var module1 = installedModules[moduleId] = {
                /******/ i: moduleId,
                /******/ l: !1,
                /******/ exports: {}
            };
            /******/ /******/ // Return the exports of the module
            /******/ return(/******/ /******/ // Execute the module function
            /******/ modules[moduleId].call(module1.exports, module1, module1.exports, __webpack_require__), /******/ /******/ // Flag the module as loaded
            /******/ module1.l = !0, module1.exports);
        /******/ }
        /******/ /******/ /******/ // Load entry module and return exports
        /******/ return(/******/ /******/ /******/ // expose the modules object (__webpack_modules__)
        /******/ __webpack_require__.m = modules, /******/ /******/ // expose the module cache
        /******/ __webpack_require__.c = installedModules, /******/ /******/ // define getter function for harmony exports
        /******/ __webpack_require__.d = function(exports1, name, getter) {
            /******/ __webpack_require__.o(exports1, name) || /******/ Object.defineProperty(exports1, name, {
                enumerable: !0,
                get: getter
            });
        /******/ }, /******/ /******/ // define __esModule on exports
        /******/ __webpack_require__.r = function(exports1) {
            "undefined" != typeof Symbol && Symbol.toStringTag && /******/ Object.defineProperty(exports1, Symbol.toStringTag, {
                value: "Module"
            }), /******/ Object.defineProperty(exports1, "__esModule", {
                value: !0
            });
        /******/ }, /******/ /******/ // create a fake namespace object
        /******/ // mode & 1: value is a module id, require it
        /******/ // mode & 2: merge all properties of value into the ns
        /******/ // mode & 4: return value when already ns object
        /******/ // mode & 8|1: behave like require
        /******/ __webpack_require__.t = function(value, mode) {
            /******/ if (1 & mode && (value = __webpack_require__(value)), 8 & mode || 4 & mode && "object" == typeof value && value && value.__esModule) return value;
            /******/ var ns = Object.create(null);
            /******/ if (/******/ __webpack_require__.r(ns), /******/ Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            }), 2 & mode && "string" != typeof value) for(var key in value)__webpack_require__.d(ns, key, (function(key) {
                return value[key];
            }).bind(null, key));
            /******/ return ns;
        /******/ }, /******/ /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = function(module1) {
            /******/ var getter = module1 && module1.__esModule ? /******/ function() {
                return module1.default;
            } : /******/ function() {
                return module1;
            };
            /******/ return /******/ __webpack_require__.d(getter, "a", getter), getter;
        /******/ }, /******/ /******/ // Object.prototype.hasOwnProperty.call
        /******/ __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, /******/ /******/ // __webpack_public_path__
        /******/ __webpack_require__.p = "/", __webpack_require__(__webpack_require__.s = 89));
    /******/ }(/************************************************************************/ /******/ [
        /* 0 */ /***/ function(module1, exports1) {
            module1.exports = function(obj, key, value) {
                return key in obj ? Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : obj[key] = value, obj;
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 1 */ /***/ function(module1, exports1) {
            module1.exports = function(self1) {
                if (void 0 === self1) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self1;
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 2 */ /***/ function(module1, exports1) {
            function _getPrototypeOf(o) {
                return module1.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                }, module1.exports.default = module1.exports, module1.exports.__esModule = !0, _getPrototypeOf(o);
            }
            module1.exports = _getPrototypeOf, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 3 */ /***/ function(module1, exports1) {
            module1.exports = function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 4 */ /***/ function(module1, exports1) {
            function _defineProperties(target, props) {
                for(var i = 0; i < props.length; i++){
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            module1.exports = function(Constructor, protoProps, staticProps) {
                return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 5 */ /***/ function(module1, exports1, __webpack_require__) {
            var _typeof = __webpack_require__(19).default, assertThisInitialized = __webpack_require__(1);
            module1.exports = function(self1, call) {
                if (call && ("object" === _typeof(call) || "function" == typeof call)) return call;
                if (void 0 !== call) throw TypeError("Derived constructors may only return object or undefined");
                return assertThisInitialized(self1);
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 6 */ /***/ function(module1, exports1, __webpack_require__) {
            var setPrototypeOf = __webpack_require__(41);
            module1.exports = function(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && setPrototypeOf(subClass, superClass);
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 7 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = {
                EPSILON: __webpack_require__(62),
                create: __webpack_require__(63),
                clone: __webpack_require__(156),
                fromValues: __webpack_require__(157),
                copy: __webpack_require__(158),
                set: __webpack_require__(159),
                equals: __webpack_require__(160),
                exactEquals: __webpack_require__(161),
                add: __webpack_require__(162),
                subtract: __webpack_require__(64),
                sub: __webpack_require__(163),
                multiply: __webpack_require__(65),
                mul: __webpack_require__(164),
                divide: __webpack_require__(66),
                div: __webpack_require__(165),
                inverse: __webpack_require__(166),
                min: __webpack_require__(167),
                max: __webpack_require__(168),
                rotate: __webpack_require__(169),
                floor: __webpack_require__(170),
                ceil: __webpack_require__(171),
                round: __webpack_require__(172),
                scale: __webpack_require__(173),
                scaleAndAdd: __webpack_require__(174),
                distance: __webpack_require__(67),
                dist: __webpack_require__(175),
                squaredDistance: __webpack_require__(68),
                sqrDist: __webpack_require__(176),
                length: __webpack_require__(69),
                len: __webpack_require__(177),
                squaredLength: __webpack_require__(70),
                sqrLen: __webpack_require__(178),
                negate: __webpack_require__(179),
                normalize: __webpack_require__(180),
                dot: __webpack_require__(181),
                cross: __webpack_require__(182),
                lerp: __webpack_require__(183),
                random: __webpack_require__(184),
                transformMat2: __webpack_require__(185),
                transformMat2d: __webpack_require__(186),
                transformMat3: __webpack_require__(187),
                transformMat4: __webpack_require__(188),
                forEach: __webpack_require__(189),
                limit: __webpack_require__(190)
            };
        /***/ },
        /* 8 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            // EXPORTS
            __webpack_require__.d(__webpack_exports__, "h", function() {
                return /* binding */ imageRef;
            }), __webpack_require__.d(__webpack_exports__, "i", function() {
                return /* binding */ otsuThreshold;
            }), __webpack_require__.d(__webpack_exports__, "b", function() {
                return /* binding */ cv_utils_cluster;
            }), __webpack_require__.d(__webpack_exports__, "j", function() {
                return /* binding */ topGeneric;
            }), __webpack_require__.d(__webpack_exports__, "e", function() {
                return /* binding */ grayAndHalfSampleFromCanvasData;
            }), __webpack_require__.d(__webpack_exports__, "c", function() {
                return /* binding */ computeGray;
            }), __webpack_require__.d(__webpack_exports__, "f", function() {
                return /* binding */ halfSample;
            }), __webpack_require__.d(__webpack_exports__, "g", function() {
                return /* binding */ hsv2rgb;
            }), __webpack_require__.d(__webpack_exports__, "a", function() {
                return /* binding */ calculatePatchSize;
            }), __webpack_require__.d(__webpack_exports__, "d", function() {
                return /* binding */ computeImageArea;
            });
            // UNUSED EXPORTS: computeIntegralImage2, computeIntegralImage, thresholdImage, computeHistogram, sharpenLine, determineOtsuThreshold, computeBinaryImage, Tracer, DILATE, ERODE, dilate, erode, subtract, bitwiseOr, countNonZero, grayArrayFromImage, grayArrayFromContext, loadImageArray, _computeDivisors, _parseCSSDimensionValues, _dimensionsConverters
            // EXTERNAL MODULE: ./node_modules/gl-vec2/index.js
            var gl_vec2 = __webpack_require__(7), gl_vec3 = __webpack_require__(84), vec2 = {
                clone: gl_vec2.clone,
                dot: gl_vec2.dot
            }, cluster = {
                create: function(point, threshold) {
                    var points = [], center = {
                        rad: 0,
                        vec: vec2.clone([
                            0,
                            0
                        ])
                    }, pointMap = {};
                    function _add(pointToAdd) {
                        pointMap[pointToAdd.id] = pointToAdd, points.push(pointToAdd);
                    }
                    function updateCenter() {
                        var i, sum = 0;
                        for(i = 0; i < points.length; i++)sum += points[i].rad;
                        center.rad = sum / points.length, center.vec = vec2.clone([
                            Math.cos(center.rad),
                            Math.sin(center.rad)
                        ]);
                    }
                    return _add(point), updateCenter(), {
                        add: function(pointToAdd) {
                            pointMap[pointToAdd.id] || (_add(pointToAdd), updateCenter());
                        },
                        fits: function(otherPoint) {
                            return Math.abs(vec2.dot(otherPoint.point.vec, center.vec)) > threshold;
                        },
                        getPoints: function() {
                            return points;
                        },
                        getCenter: function() {
                            return center;
                        }
                    };
                },
                createPoint: function(newPoint, id, property) {
                    return {
                        rad: newPoint[property],
                        point: newPoint,
                        id: id
                    };
                }
            }, array_helper = __webpack_require__(10), cv_utils_vec2 = {
                clone: gl_vec2.clone
            }, vec3 = {
                clone: gl_vec3.clone
            };
            /**
                 * @param x x-coordinate
                 * @param y y-coordinate
                 * @return ImageReference {x,y} Coordinate
                 */ function imageRef(x, y) {
                return {
                    x: x,
                    y: y,
                    toVec2: function() {
                        return cv_utils_vec2.clone([
                            this.x,
                            this.y
                        ]);
                    },
                    toVec3: function() {
                        return vec3.clone([
                            this.x,
                            this.y,
                            1
                        ]);
                    },
                    round: function() {
                        return this.x = this.x > 0.0 ? Math.floor(this.x + 0.5) : Math.floor(this.x - 0.5), this.y = this.y > 0.0 ? Math.floor(this.y + 0.5) : Math.floor(this.y - 0.5), this;
                    }
                };
            }
            function otsuThreshold(imageWrapper, targetWrapper) {
                var threshold = function(imageWrapper) {
                    var hist, bitsPerPixel = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 8, bitShift = 8 - bitsPerPixel;
                    function px(init, end) {
                        for(var sum = 0, i = init; i <= end; i++)sum += hist[i];
                        return sum;
                    }
                    function mx(init, end) {
                        for(var sum = 0, i = init; i <= end; i++)sum += i * hist[i];
                        return sum;
                    }
                    return function() {
                        var p1, p2, p12, m12, vet = [
                            0
                        ], max = (1 << bitsPerPixel) - 1;
                        hist = function(imageWrapper, bitsPerPixel) {
                            bitsPerPixel || // eslint-disable-next-line no-param-reassign
                            (bitsPerPixel = 8);
                            for(var imageData = imageWrapper.data, length = imageData.length, bitShift = 8 - bitsPerPixel, hist = new Int32Array(1 << bitsPerPixel); length--;)hist[imageData[length] >> bitShift]++;
                            return hist;
                        }(imageWrapper, bitsPerPixel);
                        for(var k = 1; k < max; k++)0 == (p12 = (p1 = px(0, k)) * (p2 = px(k + 1, max))) && (p12 = 1), m12 = mx(0, k) * p2 - mx(k + 1, max) * p1, vet[k] = m12 * m12 / p12;
                        return array_helper.a.maxIndex(vet);
                    }() << bitShift;
                }(imageWrapper);
                return !function(imageWrapper, threshold, targetWrapper) {
                    targetWrapper || // eslint-disable-next-line no-param-reassign
                    (targetWrapper = imageWrapper);
                    for(var imageData = imageWrapper.data, length = imageData.length, targetData = targetWrapper.data; length--;)targetData[length] = imageData[length] < threshold ? 1 : 0;
                }(imageWrapper, threshold, targetWrapper), threshold;
            } // local thresholding
            function cv_utils_cluster(points, threshold, property) {
                var i, k, thisCluster, point, clusters = [];
                for(property || // eslint-disable-next-line no-param-reassign
                (property = "rad"), i = 0; i < points.length; i++)!function(newPoint) {
                    var found = !1;
                    for(k = 0; k < clusters.length; k++)(thisCluster = clusters[k]).fits(newPoint) && (thisCluster.add(newPoint), found = !0);
                    return found;
                } // iterate over each cloud
                (point = cluster.createPoint(points[i], i, property)) && clusters.push(cluster.create(point, threshold));
                return clusters;
            }
            function topGeneric(list, top, scoreFunc) {
                var i, score, hit, pos, minIdx = 0, min = 0, queue = [];
                for(i = 0; i < top; i++)queue[i] = {
                    score: 0,
                    item: null
                };
                for(i = 0; i < list.length; i++)if ((score = scoreFunc.apply(this, [
                    list[i]
                ])) > min) for(pos = 0, (hit = queue[minIdx]).score = score, hit.item = list[i], min = Number.MAX_VALUE; pos < top; pos++)queue[pos].score < min && (min = queue[pos].score, minIdx = pos);
                return queue;
            }
            function grayAndHalfSampleFromCanvasData(canvasData, size, outArray) {
                for(var i, topRowIdx = 0, bottomRowIdx = size.x, endIdx = Math.floor(canvasData.length / 4), outWidth = size.x / 2, outImgIdx = 0, inWidth = size.x; bottomRowIdx < endIdx;){
                    for(i = 0; i < outWidth; i++)// eslint-disable-next-line no-param-reassign
                    outArray[outImgIdx] = (0.299 * canvasData[4 * topRowIdx + 0] + 0.587 * canvasData[4 * topRowIdx + 1] + 0.114 * canvasData[4 * topRowIdx + 2] + (0.299 * canvasData[(topRowIdx + 1) * 4 + 0] + 0.587 * canvasData[(topRowIdx + 1) * 4 + 1] + 0.114 * canvasData[(topRowIdx + 1) * 4 + 2]) + (0.299 * canvasData[4 * bottomRowIdx + 0] + 0.587 * canvasData[4 * bottomRowIdx + 1] + 0.114 * canvasData[4 * bottomRowIdx + 2]) + (0.299 * canvasData[(bottomRowIdx + 1) * 4 + 0] + 0.587 * canvasData[(bottomRowIdx + 1) * 4 + 1] + 0.114 * canvasData[(bottomRowIdx + 1) * 4 + 2])) / 4, outImgIdx++, topRowIdx += 2, bottomRowIdx += 2;
                    topRowIdx += inWidth, bottomRowIdx += inWidth;
                }
            }
            function computeGray(imageData, outArray, config) {
                var l = imageData.length / 4 | 0;
                if (config && !0 === config.singleChannel) for(var i = 0; i < l; i++)// eslint-disable-next-line no-param-reassign
                outArray[i] = imageData[4 * i + 0];
                else for(var _i = 0; _i < l; _i++)// eslint-disable-next-line no-param-reassign
                outArray[_i] = 0.299 * imageData[4 * _i + 0] + 0.587 * imageData[4 * _i + 1] + 0.114 * imageData[4 * _i + 2];
            }
            /**
                 * @param inImg {ImageWrapper} input image to be sampled
                 * @param outImg {ImageWrapper} to be stored in
                 */ function halfSample(inImgWrapper, outImgWrapper) {
                for(var inImg = inImgWrapper.data, inWidth = inImgWrapper.size.x, outImg = outImgWrapper.data, topRowIdx = 0, bottomRowIdx = inWidth, endIdx = inImg.length, outWidth = inWidth / 2, outImgIdx = 0; bottomRowIdx < endIdx;){
                    for(var i = 0; i < outWidth; i++)outImg[outImgIdx] = Math.floor((inImg[topRowIdx] + inImg[topRowIdx + 1] + inImg[bottomRowIdx] + inImg[bottomRowIdx + 1]) / 4), outImgIdx++, topRowIdx += 2, bottomRowIdx += 2;
                    topRowIdx += inWidth, bottomRowIdx += inWidth;
                }
            }
            function hsv2rgb(hsv) {
                var rgb = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [
                    0,
                    0,
                    0
                ], h = hsv[0], s = hsv[1], v = hsv[2], c = v * s, x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = v - c, r = 0, g = 0, b = 0;
                return h < 60 ? (r = c, g = x) : h < 120 ? (r = x, g = c) : h < 180 ? (g = c, b = x) : h < 240 ? (g = x, b = c) : h < 300 ? (r = x, b = c) : h < 360 && (r = c, b = x), rgb[0] = (r + m) * 255 | 0, rgb[1] = (g + m) * 255 | 0, rgb[2] = (b + m) * 255 | 0, rgb;
            }
            function _computeDivisors(n) {
                for(var largeDivisors = [], divisors = [], i = 1; i < Math.sqrt(n) + 1; i++)n % i == 0 && (divisors.push(i), i !== n / i && largeDivisors.unshift(Math.floor(n / i)));
                return divisors.concat(largeDivisors);
            }
            function calculatePatchSize(patchSize, imgSize) {
                var optimalPatchSize, divisorsX = _computeDivisors(imgSize.x), divisorsY = _computeDivisors(imgSize.y), wideSide = Math.max(imgSize.x, imgSize.y), common = function(arr1, arr2) {
                    for(var i = 0, j = 0, result = []; i < arr1.length && j < arr2.length;)arr1[i] === arr2[j] ? (result.push(arr1[i]), i++, j++) : arr1[i] > arr2[j] ? j++ : i++;
                    return result;
                }(divisorsX, divisorsY), nrOfPatchesList = [
                    8,
                    10,
                    15,
                    20,
                    32,
                    60,
                    80
                ], nrOfPatchesMap = {
                    "x-small": 5,
                    small: 4,
                    medium: 3,
                    large: 2,
                    "x-large": 1
                }, nrOfPatchesIdx = nrOfPatchesMap[patchSize] || nrOfPatchesMap.medium, nrOfPatches = nrOfPatchesList[nrOfPatchesIdx], desiredPatchSize = Math.floor(wideSide / nrOfPatches);
                function findPatchSizeForDivisors(divisors) {
                    for(var i = 0, found = divisors[Math.floor(divisors.length / 2)]; i < divisors.length - 1 && divisors[i] < desiredPatchSize;)i++;
                    return (i > 0 && (found = Math.abs(divisors[i] - desiredPatchSize) > Math.abs(divisors[i - 1] - desiredPatchSize) ? divisors[i - 1] : divisors[i]), desiredPatchSize / found < nrOfPatchesList[nrOfPatchesIdx + 1] / nrOfPatchesList[nrOfPatchesIdx] && desiredPatchSize / found > nrOfPatchesList[nrOfPatchesIdx - 1] / nrOfPatchesList[nrOfPatchesIdx]) ? {
                        x: found,
                        y: found
                    } : null;
                }
                return (optimalPatchSize = findPatchSizeForDivisors(common)) || (optimalPatchSize = findPatchSizeForDivisors(_computeDivisors(wideSide))) || (optimalPatchSize = findPatchSizeForDivisors(_computeDivisors(desiredPatchSize * nrOfPatches))), optimalPatchSize;
            }
            var _dimensionsConverters = {
                top: function(dimension, context) {
                    return "%" === dimension.unit ? Math.floor(context.height * (dimension.value / 100)) : null;
                },
                right: function(dimension, context) {
                    return "%" === dimension.unit ? Math.floor(context.width - context.width * (dimension.value / 100)) : null;
                },
                bottom: function(dimension, context) {
                    return "%" === dimension.unit ? Math.floor(context.height - context.height * (dimension.value / 100)) : null;
                },
                left: function(dimension, context) {
                    return "%" === dimension.unit ? Math.floor(context.width * (dimension.value / 100)) : null;
                }
            };
            function computeImageArea(inputWidth, inputHeight, area) {
                var context = {
                    width: inputWidth,
                    height: inputHeight
                }, parsedArea = Object.keys(area).reduce(function(result, key) {
                    var value, parsed = {
                        value: parseFloat(value = area[key]),
                        unit: (value.indexOf("%"), value.length, "%")
                    }, calculated = _dimensionsConverters[key](parsed, context);
                    return result[key] = calculated, result;
                }, {});
                return {
                    sx: parsedArea.left,
                    sy: parsedArea.top,
                    sw: parsedArea.right - parsedArea.left,
                    sh: parsedArea.bottom - parsedArea.top
                };
            }
        /***/ },
        /* 9 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            // TODO: XYPosition should be an XYObject, but that breaks XYDefinition, which breaks drawPath() below.
            // XYDefinition tells us which component of a given array or object is the "X" and which is the "Y".
            // Usually this is 0 for X and 1 for Y, but might be used as 'x' for x and 'y' for Y.
            /* harmony default export */ __webpack_exports__.a = {
                drawRect: function(pos, size, ctx, style) {
                    ctx.strokeStyle = style.color, ctx.fillStyle = style.color, ctx.lineWidth = style.lineWidth || 1, ctx.beginPath(), ctx.strokeRect(pos.x, pos.y, size.x, size.y);
                },
                drawPath: function(path, def, ctx, style) {
                    ctx.strokeStyle = style.color, ctx.fillStyle = style.color, ctx.lineWidth = style.lineWidth, ctx.beginPath(), ctx.moveTo(path[0][def.x], path[0][def.y]);
                    for(var j = 1; j < path.length; j++)ctx.lineTo(path[j][def.x], path[j][def.y]);
                    ctx.closePath(), ctx.stroke();
                },
                drawImage: function(imageData, size, ctx) {
                    var canvasData = ctx.getImageData(0, 0, size.x, size.y), data = canvasData.data, canvasDataPos = data.length, imageDataPos = imageData.length;
                    if (canvasDataPos / imageDataPos != 4) return !1;
                    for(; imageDataPos--;){
                        var value = imageData[imageDataPos];
                        data[--canvasDataPos] = 255, data[--canvasDataPos] = value, data[--canvasDataPos] = value, data[--canvasDataPos] = value;
                    }
                    return ctx.putImageData(canvasData, 0, 0), !0;
                }
            };
        /***/ },
        /* 10 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            /* harmony default export */ __webpack_exports__.a = {
                init: function(arr, val) {
                    for(// arr.fill(val);
                    var l = arr.length; l--;)arr[l] = val;
                },
                /**
                     * Shuffles the content of an array
                     */ shuffle: function(arr) {
                    for(var i = arr.length - 1; i >= 0; i--){
                        var j = Math.floor(Math.random() * i), x = arr[i];
                        arr[i] = arr[j], arr[j] = x;
                    }
                    return arr;
                },
                toPointList: function(arr) {
                    var rows = arr.reduce(function(p, n) {
                        var row = "[".concat(n.join(","), "]");
                        return p.push(row), p;
                    }, []);
                    return "[".concat(rows.join(",\r\n"), "]");
                },
                /**
                     * returns the elements which's score is bigger than the threshold
                     */ threshold: function(arr, _threshold, scoreFunc) {
                    return arr.reduce(function(prev, next) {
                        return scoreFunc.apply(arr, [
                            next
                        ]) >= _threshold && prev.push(next), prev;
                    }, []);
                },
                maxIndex: function(arr) {
                    for(var max = 0, i = 0; i < arr.length; i++)arr[i] > arr[max] && (max = i);
                    return max;
                },
                max: function(arr) {
                    for(var max = 0, i = 0; i < arr.length; i++)arr[i] > max && (max = arr[i]);
                    return max;
                },
                sum: function(arr) {
                    for(var length = arr.length, sum = 0; length--;)sum += arr[length];
                    return sum;
                }
            };
        /***/ },
        /* 11 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            /* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83), _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__), _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3), _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__), _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4), _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__), gl_vec2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7), _cv_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8), _array_helper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(10), vec2 = {
                clone: gl_vec2__WEBPACK_IMPORTED_MODULE_4__.clone
            };
            function assertNumberPositive(val) {
                if (val < 0) throw Error("expected positive number, received ".concat(val));
            }
            var ImageWrapper = /*#__PURE__*/ function() {
                // Represents a basic image combining the data and size. In addition, some methods for
                // manipulation are contained within.
                function ImageWrapper(size, data) {
                    var ArrayType = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Uint8Array, initialize = arguments.length > 3 ? arguments[3] : void 0;
                    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, ImageWrapper), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "data", void 0), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "size", void 0), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "indexMapping", void 0), data ? this.data = data : (this.data = new ArrayType(size.x * size.y), initialize && _array_helper__WEBPACK_IMPORTED_MODULE_6__./* default */ a.init(this.data, 0)), this.size = size;
                } // tests if a position is within the image, extended out by a border on each side
                return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(ImageWrapper, [
                    {
                        key: "inImageWithBorder",
                        value: function(imgRef) {
                            var border = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                            // TODO: this doesn't make much sense to me, why does it go negative?  Tests are not affected by
                            // returning false, but the whole code_128 reader blows up when i throw on negative imgRef.
                            // assertNumberPositive(imgRef.x);
                            // assertNumberPositive(imgRef.y);
                            return assertNumberPositive(border), imgRef.x >= 0 && imgRef.y >= 0 && imgRef.x < this.size.x + 2 * border && imgRef.y < this.size.y + 2 * border;
                        }
                    },
                    {
                        key: "subImageAsCopy",
                        value: function(imageWrapper, from) {
                            assertNumberPositive(from.x), assertNumberPositive(from.y);
                            for(var _imageWrapper$size = imageWrapper.size, sizeX = _imageWrapper$size.x, sizeY = _imageWrapper$size.y, x = 0; x < sizeX; x++)for(var y = 0; y < sizeY; y++)// eslint-disable-next-line no-param-reassign
                            imageWrapper.data[y * sizeX + x] = this.data[(from.y + y) * this.size.x + from.x + x];
                            return imageWrapper; // TODO: this function really probably should call into ImageWrapper somewhere to make
                        // sure that all of it's parameters are set properly, something like
                        // ImageWrapper.UpdateFrom()
                        // that might take a provided data and size, and make sure there's no invalid indexMapping
                        // hanging around, and such.
                        }
                    },
                    {
                        key: "get",
                        value: function(x, y) {
                            return this.data[y * this.size.x + x];
                        }
                    },
                    {
                        key: "getSafe",
                        value: function(x, y) {
                            // cache indexMapping because if we're using it once, we'll probably need it a bunch more
                            // too
                            if (!this.indexMapping) {
                                this.indexMapping = {
                                    x: [],
                                    y: []
                                };
                                for(var i = 0; i < this.size.x; i++)this.indexMapping.x[i] = i, this.indexMapping.x[i + this.size.x] = i;
                                for(var _i = 0; _i < this.size.y; _i++)this.indexMapping.y[_i] = _i, this.indexMapping.y[_i + this.size.y] = _i;
                            }
                            return this.data[this.indexMapping.y[y + this.size.y] * this.size.x + this.indexMapping.x[x + this.size.x]];
                        }
                    },
                    {
                        key: "set",
                        value: function(x, y, value) {
                            return this.data[y * this.size.x + x] = value, delete this.indexMapping, this;
                        }
                    },
                    {
                        key: "zeroBorder",
                        value: function() {
                            for(var _this$size = this.size, width = _this$size.x, height = _this$size.y, i = 0; i < width; i++)// eslint-disable-next-line no-multi-assign
                            this.data[i] = this.data[(height - 1) * width + i] = 0;
                            for(var _i2 = 1; _i2 < height - 1; _i2++)// eslint-disable-next-line no-multi-assign
                            this.data[_i2 * width] = this.data[_i2 * width + (width - 1)] = 0;
                            return delete this.indexMapping, this;
                        }
                    },
                    {
                        key: "moments",
                        value: function(labelCount) {
                            var x, y, val, ysq, i, label, mu11, x_, y_, tmp, data = this.data, height = this.size.y, width = this.size.x, labelSum = [], result = [], PI = Math.PI, PI_4 = PI / 4;
                            if (labelCount <= 0) return result;
                            for(i = 0; i < labelCount; i++)labelSum[i] = {
                                m00: 0,
                                m01: 0,
                                m10: 0,
                                m11: 0,
                                m02: 0,
                                m20: 0,
                                theta: 0,
                                rad: 0
                            };
                            for(y = 0; y < height; y++)for(x = 0, ysq = y * y; x < width; x++)(val = data[y * width + x]) > 0 && (label = labelSum[val - 1], label.m00 += 1, label.m01 += y, label.m10 += x, label.m11 += x * y, label.m02 += ysq, label.m20 += x * x);
                            for(i = 0; i < labelCount; i++)isNaN((label = labelSum[i]).m00) || 0 === label.m00 || (x_ = label.m10 / label.m00, y_ = label.m01 / label.m00, mu11 = label.m11 / label.m00 - x_ * y_, tmp = 0.5 * Math.atan(tmp = (label.m02 / label.m00 - y_ * y_ - (label.m20 / label.m00 - x_ * x_)) / (2 * mu11)) + (mu11 >= 0 ? PI_4 : -PI_4) + PI, label.theta = (180 * tmp / PI + 90) % 180 - 90, label.theta < 0 && (label.theta += 180), label.rad = tmp > PI ? tmp - PI : tmp, label.vec = vec2.clone([
                                Math.cos(tmp),
                                Math.sin(tmp)
                            ]), result.push(label));
                            return result;
                        }
                    },
                    {
                        key: "getAsRGBA",
                        value: function() {
                            for(var scale = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1.0, ret = new Uint8ClampedArray(4 * this.size.x * this.size.y), y = 0; y < this.size.y; y++)for(var x = 0; x < this.size.x; x++){
                                var pixel = y * this.size.x + x, current = this.get(x, y) * scale;
                                ret[4 * pixel + 0] = current, ret[4 * pixel + 1] = current, ret[4 * pixel + 2] = current, ret[4 * pixel + 3] = 255;
                            }
                            return ret;
                        }
                    },
                    {
                        key: "show",
                        value: function(canvas) {
                            var scale = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1.0, ctx = canvas.getContext("2d");
                            if (!ctx) throw Error("Unable to get canvas context");
                            var frame = ctx.getImageData(0, 0, canvas.width, canvas.height), data = this.getAsRGBA(scale);
                            canvas.width = this.size.x, canvas.height = this.size.y;
                            var newFrame = new ImageData(data, frame.width, frame.height);
                            ctx.putImageData(newFrame, 0, 0);
                        }
                    },
                    {
                        key: "overlay",
                        value: function(canvas, inScale, from) {
                            var adjustedScale = inScale < 0 || inScale > 360 ? 360 : inScale, hsv = [
                                0,
                                1,
                                1
                            ], rgb = [
                                0,
                                0,
                                0
                            ], whiteRgb = [
                                255,
                                255,
                                255
                            ], blackRgb = [
                                0,
                                0,
                                0
                            ], result = [], ctx = canvas.getContext("2d");
                            if (!ctx) throw Error("Unable to get canvas context");
                            for(var frame = ctx.getImageData(from.x, from.y, this.size.x, this.size.y), data = frame.data, length = this.data.length; length--;){
                                hsv[0] = this.data[length] * adjustedScale, result = hsv[0] <= 0 ? whiteRgb : hsv[0] >= 360 ? blackRgb : Object(_cv_utils__WEBPACK_IMPORTED_MODULE_5__./* hsv2rgb */ g)(hsv, rgb);
                                var pos = 4 * length, _result = result, _result2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_result, 3);
                                data[pos] = _result2[0], data[pos + 1] = _result2[1], data[pos + 2] = _result2[2], data[pos + 3] = 255;
                            }
                            ctx.putImageData(frame, from.x, from.y);
                        }
                    }
                ]), ImageWrapper;
            }();
            /* harmony default export */ __webpack_exports__.a = ImageWrapper;
        /***/ },
        /* 12 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(228);
        /***/ },
        /* 13 */ /***/ function(module1, exports1, __webpack_require__) {
            var superPropBase = __webpack_require__(227);
            function _get(target, property, receiver) {
                return "undefined" != typeof Reflect && Reflect.get ? module1.exports = _get = Reflect.get : module1.exports = _get = function(target, property, receiver) {
                    var base = superPropBase(target, property);
                    if (base) {
                        var desc = Object.getOwnPropertyDescriptor(base, property);
                        return desc.get ? desc.get.call(receiver) : desc.value;
                    }
                }, module1.exports.default = module1.exports, module1.exports.__esModule = !0, _get(target, property, receiver || target);
            }
            module1.exports = _get, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 14 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Checks if `value` is the
                 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
                 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
                 *
                 * @static
                 * @memberOf _
                 * @since 0.1.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
                 * @example
                 *
                 * _.isObject({});
                 * // => true
                 *
                 * _.isObject([1, 2, 3]);
                 * // => true
                 *
                 * _.isObject(_.noop);
                 * // => true
                 *
                 * _.isObject(null);
                 * // => false
                 */ function(value) {
                var type = typeof value;
                return null != value && ("object" == type || "function" == type);
            };
        /***/ },
        /* 15 */ /***/ function(module1, exports1) {
            /**
                 * Checks if `value` is classified as an `Array` object.
                 *
                 * @static
                 * @memberOf _
                 * @since 0.1.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
                 * @example
                 *
                 * _.isArray([1, 2, 3]);
                 * // => true
                 *
                 * _.isArray(document.body.children);
                 * // => false
                 *
                 * _.isArray('abc');
                 * // => false
                 *
                 * _.isArray(_.noop);
                 * // => false
                 */ var isArray = Array.isArray;
            module1.exports = isArray;
        /***/ },
        /* 16 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseMerge = __webpack_require__(90), merge = __webpack_require__(145)(function(object, source, srcIndex) {
                baseMerge(object, source, srcIndex);
            });
            module1.exports = merge;
        /***/ },
        /* 17 */ /***/ function(module1, exports1, __webpack_require__) {
            var freeGlobal = __webpack_require__(45), freeSelf = "object" == typeof self && self && self.Object === Object && self, root = freeGlobal || freeSelf || Function("return this")();
            module1.exports = root;
        /***/ },
        /* 18 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Checks if `value` is object-like. A value is object-like if it's not `null`
                 * and has a `typeof` result of "object".
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
                 * @example
                 *
                 * _.isObjectLike({});
                 * // => true
                 *
                 * _.isObjectLike([1, 2, 3]);
                 * // => true
                 *
                 * _.isObjectLike(_.noop);
                 * // => false
                 *
                 * _.isObjectLike(null);
                 * // => false
                 */ function(value) {
                return null != value && "object" == typeof value;
            };
        /***/ },
        /* 19 */ /***/ function(module1, exports1) {
            function _typeof(obj) {
                return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? module1.exports = _typeof = function(obj) {
                    return typeof obj;
                } : module1.exports = _typeof = function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                }, module1.exports.default = module1.exports, module1.exports.__esModule = !0, _typeof(obj);
            }
            module1.exports = _typeof, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 20 */ /***/ function(module1, exports1) {
            function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                try {
                    var info = gen[key](arg), value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
            }
            module1.exports = function(fn) {
                return function() {
                    var self1 = this, args = arguments;
                    return new Promise(function(resolve, reject) {
                        var gen = fn.apply(self1, args);
                        function _next(value) {
                            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                        }
                        function _throw(err) {
                            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                        }
                        _next(void 0);
                    });
                };
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 21 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            /* harmony default export */ __webpack_exports__.a = {
                searchDirections: [
                    [
                        0,
                        1
                    ],
                    [
                        1,
                        1
                    ],
                    [
                        1,
                        0
                    ],
                    [
                        1,
                        -1
                    ],
                    [
                        0,
                        -1
                    ],
                    [
                        -1,
                        -1
                    ],
                    [
                        -1,
                        0
                    ],
                    [
                        -1,
                        1
                    ]
                ],
                create: function(imageWrapper, labelWrapper) {
                    var pos, imageData = imageWrapper.data, labelData = labelWrapper.data, searchDirections = this.searchDirections, width = imageWrapper.size.x;
                    function _trace(current, color, label, edgelabel) {
                        var i, y, x;
                        for(i = 0; i < 7; i++){
                            if (imageData[pos = (y = current.cy + searchDirections[current.dir][0]) * width + (x = current.cx + searchDirections[current.dir][1])] === color && (0 === labelData[pos] || labelData[pos] === label)) return labelData[pos] = label, current.cy = y, current.cx = x, !0;
                            0 === labelData[pos] && (labelData[pos] = edgelabel), current.dir = (current.dir + 1) % 8;
                        }
                        return !1;
                    }
                    function vertex2D(x, y, dir) {
                        return {
                            dir: dir,
                            x: x,
                            y: y,
                            next: null,
                            prev: null
                        };
                    }
                    return {
                        trace: function(current, color, label, edgelabel) {
                            return _trace(current, color, label, edgelabel);
                        },
                        contourTracing: function(sy, sx, label, color, edgelabel) {
                            return function(sy, sx, label, color, edgelabel) {
                                var Cv, P, ldir, Fv = null, current = {
                                    cx: sx,
                                    cy: sy,
                                    dir: 0
                                };
                                if (_trace(current, color, label, edgelabel)) {
                                    Cv = Fv = vertex2D(sx, sy, current.dir), ldir = current.dir, (P = vertex2D(current.cx, current.cy, 0)).prev = Cv, Cv.next = P, P.next = null, Cv = P;
                                    do current.dir = (current.dir + 6) % 8, _trace(current, color, label, edgelabel), ldir !== current.dir ? (Cv.dir = current.dir, (P = vertex2D(current.cx, current.cy, 0)).prev = Cv, Cv.next = P, P.next = null, Cv = P) : (Cv.dir = ldir, Cv.x = current.cx, Cv.y = current.cy), ldir = current.dir;
                                    while (current.cx !== sx || current.cy !== sy)
                                    Fv.prev = Cv.prev, Cv.prev.next = Fv;
                                }
                                return Fv;
                            }(sy, sx, label, color, edgelabel);
                        }
                    };
                }
            };
        /***/ },
        /* 22 */ /***/ function(module1, exports1, __webpack_require__) {
            var Symbol1 = __webpack_require__(27), getRawTag = __webpack_require__(103), objectToString = __webpack_require__(104), symToStringTag = Symbol1 ? Symbol1.toStringTag : void 0;
            module1.exports = /**
                 * The base implementation of `getTag` without fallbacks for buggy environments.
                 *
                 * @private
                 * @param {*} value The value to query.
                 * @returns {string} Returns the `toStringTag`.
                 */ function(value) {
                return null == value ? void 0 === value ? "[object Undefined]" : "[object Null]" : symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
            };
        /***/ },
        /* 23 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            /* WEBPACK VAR INJECTION */ (function(global) {
                /* harmony import */ var _config, _currentImageWrapper, _skelImageWrapper, _subImageWrapper, _labelImageWrapper, _patchGrid, _patchLabelGrid, _imageToPatchGrid, _binaryImageWrapper, _patchSize, _inputImageWrapper, _skeletonizer, gl_vec2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7), gl_mat2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34), _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11), _common_cv_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10), _common_image_debug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9), _rasterizer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(87), _tracer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(21), _skeletonizer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(88), _canvasContainer = {
                    ctx: {
                        binary: null
                    },
                    dom: {
                        binary: null
                    }
                }, _numPatches = {
                    x: 0,
                    y: 0
                };
                /* harmony default export */ __webpack_exports__.a = {
                    init: function(inputImageWrapper, config) {
                        var skeletonImageData;
                        _config = config, _inputImageWrapper = inputImageWrapper, _currentImageWrapper = _config.halfSample ? new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a({
                            // eslint-disable-next-line no-bitwise
                            x: _inputImageWrapper.size.x / 2 | 0,
                            // eslint-disable-next-line no-bitwise
                            y: _inputImageWrapper.size.y / 2 | 0
                        }) : _inputImageWrapper, _patchSize = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* calculatePatchSize */ a)(_config.patchSize, _currentImageWrapper.size), _numPatches.x = _currentImageWrapper.size.x / _patchSize.x | 0, _numPatches.y = _currentImageWrapper.size.y / _patchSize.y | 0, _binaryImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a(_currentImageWrapper.size, void 0, Uint8Array, !1), _labelImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a(_patchSize, void 0, Array, !0), skeletonImageData = new ArrayBuffer(65536), _subImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a(_patchSize, new Uint8Array(skeletonImageData, 0, _patchSize.x * _patchSize.y)), _skelImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a(_patchSize, new Uint8Array(skeletonImageData, _patchSize.x * _patchSize.y * 3, _patchSize.x * _patchSize.y), void 0, !0), _skeletonizer = Object(_skeletonizer__WEBPACK_IMPORTED_MODULE_8__./* default */ a)("undefined" != typeof window ? window : "undefined" != typeof self ? self : global, {
                            size: _patchSize.x
                        }, skeletonImageData), _imageToPatchGrid = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a({
                            // eslint-disable-next-line no-bitwise
                            x: _currentImageWrapper.size.x / _subImageWrapper.size.x | 0,
                            // eslint-disable-next-line no-bitwise
                            y: _currentImageWrapper.size.y / _subImageWrapper.size.y | 0
                        }, void 0, Array, !0), _patchGrid = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a(_imageToPatchGrid.size, void 0, void 0, !0), _patchLabelGrid = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__./* default */ a(_imageToPatchGrid.size, void 0, Int32Array, !0), _config.useWorker || "undefined" == typeof document || (_canvasContainer.dom.binary = document.createElement("canvas"), _canvasContainer.dom.binary.className = "binaryBuffer", !0 === _config.debug.showCanvas && document.querySelector("#debug").appendChild(_canvasContainer.dom.binary), _canvasContainer.ctx.binary = _canvasContainer.dom.binary.getContext("2d"), _canvasContainer.dom.binary.width = _binaryImageWrapper.size.x, _canvasContainer.dom.binary.height = _binaryImageWrapper.size.y);
                    },
                    locate: function() {
                        _config.halfSample && Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* halfSample */ f)(_inputImageWrapper, _currentImageWrapper), Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* otsuThreshold */ i)(_currentImageWrapper, _binaryImageWrapper), _binaryImageWrapper.zeroBorder(), _config.debug.showCanvas && _binaryImageWrapper.show(_canvasContainer.dom.binary, 255);
                        var patchesFound = /**
                     * Iterate over the entire image
                     * extract patches
                     */ function() {
                            var x, y, i, j, x1, y1, moments, rasterResult, patch, patchesFound = [];
                            for(i = 0; i < _numPatches.x; i++)for(j = 0; j < _numPatches.y; j++)x = x1 = _subImageWrapper.size.x * i, y = y1 = _subImageWrapper.size.y * j, _binaryImageWrapper.subImageAsCopy(_subImageWrapper, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* imageRef */ h)(x, y)), _skeletonizer.skeletonize(), _config.debug.showSkeleton && _skelImageWrapper.overlay(_canvasContainer.dom.binary, 360, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* imageRef */ h)(x, y)), _skelImageWrapper.zeroBorder(), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__./* default */ a.init(_labelImageWrapper.data, 0), rasterResult = _rasterizer__WEBPACK_IMPORTED_MODULE_6__./* default */ a.create(_skelImageWrapper, _labelImageWrapper).rasterize(0), _config.debug.showLabels && _labelImageWrapper.overlay(_canvasContainer.dom.binary, Math.floor(360 / rasterResult.count), {
                                x: x1,
                                y: y1
                            }), moments = _labelImageWrapper.moments(rasterResult.count), patchesFound = patchesFound.concat(/**
                     * Extracts and describes those patches which seem to contain a barcode pattern
                     * @param {Array} moments
                     * @param {Object} patchPos,
                     * @param {Number} x
                     * @param {Number} y
                     * @returns {Array} list of patches
                     */ function(moments, patchPos, x, y) {
                                var k, avg, matchingMoments, patch, eligibleMoments = [], patchesFound = [], minComponentWeight = Math.ceil(_patchSize.x / 3);
                                if (moments.length >= 2) {
                                    // only collect moments which's area covers at least minComponentWeight pixels.
                                    for(k = 0; k < moments.length; k++)moments[k].m00 > minComponentWeight && eligibleMoments.push(moments[k]);
                                     // if at least 2 moments are found which have at least minComponentWeights covered
                                    if (eligibleMoments.length >= 2) {
                                        for(k = 0, matchingMoments = /**
                     * Find similar moments (via cluster)
                     * @param {Object} moments
                     */ function(moments) {
                                            var clusters = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* cluster */ b)(moments, 0.9), topCluster = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* topGeneric */ j)(clusters, 1, function(e) {
                                                return e.getPoints().length;
                                            }), points = [], result = [];
                                            if (1 === topCluster.length) {
                                                points = topCluster[0].item.getPoints();
                                                for(var i = 0; i < points.length; i++)result.push(points[i].point);
                                            }
                                            return result;
                                        }(eligibleMoments), avg = 0; k < matchingMoments.length; k++)avg += matchingMoments[k].rad;
                                         // Only two of the moments are allowed not to fit into the equation
                                        matchingMoments.length > 1 && matchingMoments.length >= eligibleMoments.length / 4 * 3 && matchingMoments.length > moments.length / 4 && (avg /= matchingMoments.length, patch = {
                                            index: patchPos[1] * _numPatches.x + patchPos[0],
                                            pos: {
                                                x: x,
                                                y: y
                                            },
                                            box: [
                                                gl_vec2__WEBPACK_IMPORTED_MODULE_0__.clone([
                                                    x,
                                                    y
                                                ]),
                                                gl_vec2__WEBPACK_IMPORTED_MODULE_0__.clone([
                                                    x + _subImageWrapper.size.x,
                                                    y
                                                ]),
                                                gl_vec2__WEBPACK_IMPORTED_MODULE_0__.clone([
                                                    x + _subImageWrapper.size.x,
                                                    y + _subImageWrapper.size.y
                                                ]),
                                                gl_vec2__WEBPACK_IMPORTED_MODULE_0__.clone([
                                                    x,
                                                    y + _subImageWrapper.size.y
                                                ])
                                            ],
                                            moments: matchingMoments,
                                            rad: avg,
                                            vec: gl_vec2__WEBPACK_IMPORTED_MODULE_0__.clone([
                                                Math.cos(avg),
                                                Math.sin(avg)
                                            ])
                                        }, patchesFound.push(patch));
                                    }
                                }
                                return patchesFound;
                            }(moments, [
                                i,
                                j
                            ], x1, y1));
                            if (_config.debug.showFoundPatches) for(i = 0; i < patchesFound.length; i++)patch = patchesFound[i], _common_image_debug__WEBPACK_IMPORTED_MODULE_5__./* default */ a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                            return patchesFound;
                        }(); // return unless 5% or more patches are found
                        if (patchesFound.length < _numPatches.x * _numPatches.y * 0.05) return null;
                         // rasterrize area by comparing angular similarity;
                        var maxLabel = /**
                     * finds patches which are connected and share the same orientation
                     * @param {Object} patchesFound
                     */ function(patchesFound) {
                            var j, patch, label = 0, currIdx = 0, hsv = [
                                0,
                                1,
                                1
                            ], rgb = [
                                0,
                                0,
                                0
                            ];
                            for(_common_array_helper__WEBPACK_IMPORTED_MODULE_4__./* default */ a.init(_patchGrid.data, 0), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__./* default */ a.init(_patchLabelGrid.data, 0), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__./* default */ a.init(_imageToPatchGrid.data, null), j = 0; j < patchesFound.length; j++)patch = patchesFound[j], _imageToPatchGrid.data[patch.index] = patch, _patchGrid.data[patch.index] = 1;
                             // rasterize the patches found to determine area
                            for(_patchGrid.zeroBorder(); (currIdx = function() {
                                var i;
                                for(i = 0; i < _patchLabelGrid.data.length; i++)if (0 === _patchLabelGrid.data[i] && 1 === _patchGrid.data[i]) return i;
                                return _patchLabelGrid.length;
                            }()) < _patchLabelGrid.data.length;)label++, function trace(currentIdx) {
                                var x, y, currentPatch, idx, dir, current = {
                                    x: currentIdx % _patchLabelGrid.size.x,
                                    y: currentIdx / _patchLabelGrid.size.x | 0
                                };
                                if (currentIdx < _patchLabelGrid.data.length) for(dir = 0, currentPatch = _imageToPatchGrid.data[currentIdx], _patchLabelGrid.data[currentIdx] = label; dir < _tracer__WEBPACK_IMPORTED_MODULE_7__./* default */ a.searchDirections.length; dir++){
                                    if (y = current.y + _tracer__WEBPACK_IMPORTED_MODULE_7__./* default */ a.searchDirections[dir][0], x = current.x + _tracer__WEBPACK_IMPORTED_MODULE_7__./* default */ a.searchDirections[dir][1], idx = y * _patchLabelGrid.size.x + x, 0 === _patchGrid.data[idx]) {
                                        _patchLabelGrid.data[idx] = Number.MAX_VALUE; // eslint-disable-next-line no-continue
                                        continue;
                                    }
                                    0 === _patchLabelGrid.data[idx] && Math.abs(gl_vec2__WEBPACK_IMPORTED_MODULE_0__.dot(_imageToPatchGrid.data[idx].vec, currentPatch.vec)) > 0.95 && trace(idx);
                                }
                            } // prepare for finding the right patches
                            (currIdx);
                             // draw patch-labels if requested
                            if (_config.debug.showPatchLabels) for(j = 0; j < _patchLabelGrid.data.length; j++)_patchLabelGrid.data[j] > 0 && _patchLabelGrid.data[j] <= label && (patch = _imageToPatchGrid.data[j], hsv[0] = _patchLabelGrid.data[j] / (label + 1) * 360, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* hsv2rgb */ g)(hsv, rgb), _common_image_debug__WEBPACK_IMPORTED_MODULE_5__./* default */ a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                                color: "rgb(".concat(rgb.join(","), ")"),
                                lineWidth: 2
                            }));
                            return label;
                        }(patchesFound);
                        if (maxLabel < 1) return null;
                         // search for area with the most patches (biggest connected area)
                        var topLabels = /**
                     * Finds those connected areas which contain at least 6 patches
                     * and returns them ordered DESC by the number of contained patches
                     * @param {Number} maxLabel
                     */ function(maxLabel) {
                            var i, sum, labelHist = [];
                            for(i = 0; i < maxLabel; i++)labelHist.push(0);
                            for(sum = _patchLabelGrid.data.length; sum--;)_patchLabelGrid.data[sum] > 0 && labelHist[_patchLabelGrid.data[sum] - 1]++;
                            return (labelHist = labelHist.map(function(val, idx) {
                                return {
                                    val: val,
                                    label: idx + 1
                                };
                            })).sort(function(a, b) {
                                return b.val - a.val;
                            }), labelHist.filter(function(el) {
                                return el.val >= 5;
                            });
                        }(maxLabel);
                        return 0 === topLabels.length ? null : /**
                     *
                     */ function(topLabels, maxLabel) {
                            var i, j, sum, patch, box, patches = [], boxes = [], hsv = [
                                0,
                                1,
                                1
                            ], rgb = [
                                0,
                                0,
                                0
                            ];
                            for(i = 0; i < topLabels.length; i++){
                                for(sum = _patchLabelGrid.data.length, patches.length = 0; sum--;)_patchLabelGrid.data[sum] === topLabels[i].label && (patch = _imageToPatchGrid.data[sum], patches.push(patch));
                                if ((box = /**
                     * Creates a bounding box which encloses all the given patches
                     * @returns {Array} The minimal bounding box
                     */ function(patches) {
                                    var overAvg, i, j, patch, transMat, box, scale, minx = _binaryImageWrapper.size.x, miny = _binaryImageWrapper.size.y, maxx = -_binaryImageWrapper.size.x, maxy = -_binaryImageWrapper.size.y;
                                    for(i = 0, overAvg = 0; i < patches.length; i++)overAvg += (patch = patches[i]).rad, _config.debug.showPatches && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__./* default */ a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                                        color: "red"
                                    });
                                    for(overAvg /= patches.length, (overAvg = (180 * overAvg / Math.PI + 90) % 180 - 90) < 0 && (overAvg += 180), overAvg = (180 - overAvg) * Math.PI / 180, transMat = gl_mat2__WEBPACK_IMPORTED_MODULE_1__.copy(gl_mat2__WEBPACK_IMPORTED_MODULE_1__.create(), [
                                        Math.cos(overAvg),
                                        Math.sin(overAvg),
                                        -Math.sin(overAvg),
                                        Math.cos(overAvg)
                                    ]), i = 0; i < patches.length; i++){
                                        for(j = 0, patch = patches[i]; j < 4; j++)gl_vec2__WEBPACK_IMPORTED_MODULE_0__.transformMat2(patch.box[j], patch.box[j], transMat);
                                        _config.debug.boxFromPatches.showTransformed && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__./* default */ a.drawPath(patch.box, {
                                            x: 0,
                                            y: 1
                                        }, _canvasContainer.ctx.binary, {
                                            color: "#99ff00",
                                            lineWidth: 2
                                        });
                                    } // find bounding box
                                    for(i = 0; i < patches.length; i++)for(j = 0, patch = patches[i]; j < 4; j++)patch.box[j][0] < minx && (minx = patch.box[j][0]), patch.box[j][0] > maxx && (maxx = patch.box[j][0]), patch.box[j][1] < miny && (miny = patch.box[j][1]), patch.box[j][1] > maxy && (maxy = patch.box[j][1]);
                                    for(box = [
                                        [
                                            minx,
                                            miny
                                        ],
                                        [
                                            maxx,
                                            miny
                                        ],
                                        [
                                            maxx,
                                            maxy
                                        ],
                                        [
                                            minx,
                                            maxy
                                        ]
                                    ], _config.debug.boxFromPatches.showTransformedBox && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__./* default */ a.drawPath(box, {
                                        x: 0,
                                        y: 1
                                    }, _canvasContainer.ctx.binary, {
                                        color: "#ff0000",
                                        lineWidth: 2
                                    }), scale = _config.halfSample ? 2 : 1, transMat = gl_mat2__WEBPACK_IMPORTED_MODULE_1__.invert(transMat, transMat), j = 0; j < 4; j++)gl_vec2__WEBPACK_IMPORTED_MODULE_0__.transformMat2(box[j], box[j], transMat);
                                    for(_config.debug.boxFromPatches.showBB && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__./* default */ a.drawPath(box, {
                                        x: 0,
                                        y: 1
                                    }, _canvasContainer.ctx.binary, {
                                        color: "#ff0000",
                                        lineWidth: 2
                                    }), j = 0; j < 4; j++)gl_vec2__WEBPACK_IMPORTED_MODULE_0__.scale(box[j], box[j], scale);
                                    return box;
                                }(patches)) && (boxes.push(box), _config.debug.showRemainingPatchLabels)) for(j = 0; j < patches.length; j++)patch = patches[j], hsv[0] = topLabels[i].label / (maxLabel + 1) * 360, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* hsv2rgb */ g)(hsv, rgb), _common_image_debug__WEBPACK_IMPORTED_MODULE_5__./* default */ a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                                    color: "rgb(".concat(rgb.join(","), ")"),
                                    lineWidth: 2
                                });
                            }
                            return boxes;
                        }(topLabels, maxLabel);
                    },
                    checkImageConstraints: function(inputStream, config) {
                        var patchSize, area, width = inputStream.getWidth(), height = inputStream.getHeight(), thisHalfSample = config.halfSample ? 0.5 : 1;
                        inputStream.getConfig().area && (area = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* computeImageArea */ d)(width, height, inputStream.getConfig().area), inputStream.setTopRight({
                            x: area.sx,
                            y: area.sy
                        }), inputStream.setCanvasSize({
                            x: width,
                            y: height
                        }), width = area.sw, height = area.sh);
                        var size = {
                            x: Math.floor(width * thisHalfSample),
                            y: Math.floor(height * thisHalfSample)
                        };
                        if (patchSize = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__./* calculatePatchSize */ a)(config.patchSize, size), console.log("Patch-Size: ".concat(JSON.stringify(patchSize))), inputStream.setWidth(Math.floor(Math.floor(size.x / patchSize.x) * (1 / thisHalfSample) * patchSize.x)), inputStream.setHeight(Math.floor(Math.floor(size.y / patchSize.y) * (1 / thisHalfSample) * patchSize.y)), inputStream.getWidth() % patchSize.x == 0 && inputStream.getHeight() % patchSize.y == 0) return !0;
                        throw Error("Image dimensions do not comply with the current settings: Width (".concat(width, " )and height (").concat(height, ") must a multiple of ").concat(patchSize.x));
                    }
                };
            /* WEBPACK VAR INJECTION */ }).call(this, __webpack_require__(46));
        /***/ },
        /* 24 */ /***/ function(module1, exports1, __webpack_require__) {
            var listCacheClear = __webpack_require__(92), listCacheDelete = __webpack_require__(93), listCacheGet = __webpack_require__(94), listCacheHas = __webpack_require__(95), listCacheSet = __webpack_require__(96);
            /**
                 * Creates an list cache object.
                 *
                 * @private
                 * @constructor
                 * @param {Array} [entries] The key-value pairs to cache.
                 */ function ListCache(entries) {
                var index = -1, length = null == entries ? 0 : entries.length;
                for(this.clear(); ++index < length;){
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            } // Add methods to `ListCache`.
            ListCache.prototype.clear = listCacheClear, ListCache.prototype.delete = listCacheDelete, ListCache.prototype.get = listCacheGet, ListCache.prototype.has = listCacheHas, ListCache.prototype.set = listCacheSet, module1.exports = ListCache;
        /***/ },
        /* 25 */ /***/ function(module1, exports1, __webpack_require__) {
            var eq = __webpack_require__(26);
            module1.exports = /**
                 * Gets the index at which the `key` is found in `array` of key-value pairs.
                 *
                 * @private
                 * @param {Array} array The array to inspect.
                 * @param {*} key The key to search for.
                 * @returns {number} Returns the index of the matched value, else `-1`.
                 */ function(array, key) {
                for(var length = array.length; length--;)if (eq(array[length][0], key)) return length;
                return -1;
            };
        /***/ },
        /* 26 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Performs a
                 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
                 * comparison between two values to determine if they are equivalent.
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Lang
                 * @param {*} value The value to compare.
                 * @param {*} other The other value to compare.
                 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
                 * @example
                 *
                 * var object = { 'a': 1 };
                 * var other = { 'a': 1 };
                 *
                 * _.eq(object, object);
                 * // => true
                 *
                 * _.eq(object, other);
                 * // => false
                 *
                 * _.eq('a', 'a');
                 * // => true
                 *
                 * _.eq('a', Object('a'));
                 * // => false
                 *
                 * _.eq(NaN, NaN);
                 * // => true
                 */ function(value, other) {
                return value === other || value != value && other != other;
            };
        /***/ },
        /* 27 */ /***/ function(module1, exports1, __webpack_require__) {
            /** Built-in value references. */ var Symbol1 = __webpack_require__(17).Symbol;
            module1.exports = Symbol1;
        /***/ },
        /* 28 */ /***/ function(module1, exports1, __webpack_require__) {
            /* Built-in method references that are verified to be native. */ var nativeCreate = __webpack_require__(35)(Object, "create");
            module1.exports = nativeCreate;
        /***/ },
        /* 29 */ /***/ function(module1, exports1, __webpack_require__) {
            var isKeyable = __webpack_require__(117);
            module1.exports = /**
                 * Gets the data for `map`.
                 *
                 * @private
                 * @param {Object} map The map to query.
                 * @param {string} key The reference key.
                 * @returns {*} Returns the map data.
                 */ function(map, key) {
                var data = map.__data__;
                return isKeyable(key) ? data["string" == typeof key ? "string" : "hash"] : data.map;
            };
        /***/ },
        /* 30 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseIsArguments = __webpack_require__(132), isObjectLike = __webpack_require__(18), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, propertyIsEnumerable = objectProto.propertyIsEnumerable, isArguments = baseIsArguments(function() {
                return arguments;
            }()) ? baseIsArguments : function(value) {
                return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
            };
            module1.exports = isArguments;
        /***/ },
        /* 31 */ /***/ function(module1, exports1) {
            /** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
            module1.exports = /**
                 * Checks if `value` is a valid array-like index.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
                 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
                 */ function(value, length) {
                var type = typeof value;
                return !!(length = null == length ? 9007199254740991 : length) && ("number" == type || "symbol" != type && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
            };
        /***/ },
        /* 32 */ /***/ function(module1, exports1, __webpack_require__) {
            var isArray = __webpack_require__(15), isKey = __webpack_require__(232), stringToPath = __webpack_require__(233), toString = __webpack_require__(236);
            module1.exports = /**
                 * Casts `value` to a path array if it's not one.
                 *
                 * @private
                 * @param {*} value The value to inspect.
                 * @param {Object} [object] The object to query keys on.
                 * @returns {Array} Returns the cast property path array.
                 */ function(value, object) {
                return isArray(value) ? value : isKey(value, object) ? [
                    value
                ] : stringToPath(toString(value));
            };
        /***/ },
        /* 33 */ /***/ function(module1, exports1, __webpack_require__) {
            var arrayWithoutHoles = __webpack_require__(224), iterableToArray = __webpack_require__(225), unsupportedIterableToArray = __webpack_require__(60), nonIterableSpread = __webpack_require__(226);
            module1.exports = function(arr) {
                return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 34 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = {
                determinant: __webpack_require__(251),
                transpose: __webpack_require__(252),
                multiply: __webpack_require__(253),
                identity: __webpack_require__(254),
                adjoint: __webpack_require__(255),
                rotate: __webpack_require__(256),
                invert: __webpack_require__(257),
                create: __webpack_require__(258),
                scale: __webpack_require__(259),
                copy: __webpack_require__(260),
                frob: __webpack_require__(261),
                ldu: __webpack_require__(262)
            };
        /***/ },
        /* 35 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseIsNative = __webpack_require__(102), getValue = __webpack_require__(108);
            module1.exports = /**
                 * Gets the native function at `key` of `object`.
                 *
                 * @private
                 * @param {Object} object The object to query.
                 * @param {string} key The key of the method to get.
                 * @returns {*} Returns the function if it's native, else `undefined`.
                 */ function(object, key) {
                var value = getValue(object, key);
                return baseIsNative(value) ? value : void 0;
            };
        /***/ },
        /* 36 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isObject = __webpack_require__(14);
            module1.exports = /**
                 * Checks if `value` is classified as a `Function` object.
                 *
                 * @static
                 * @memberOf _
                 * @since 0.1.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
                 * @example
                 *
                 * _.isFunction(_);
                 * // => true
                 *
                 * _.isFunction(/abc/);
                 * // => false
                 */ function(value) {
                if (!isObject(value)) return !1;
                 // The use of `Object#toString` avoids issues with the `typeof` operator
                // in Safari 9 which returns 'object' for typed arrays and other constructors.
                var tag = baseGetTag(value);
                return "[object Function]" == tag || "[object GeneratorFunction]" == tag || "[object AsyncFunction]" == tag || "[object Proxy]" == tag;
            };
        /***/ },
        /* 37 */ /***/ function(module1, exports1, __webpack_require__) {
            var defineProperty = __webpack_require__(49);
            module1.exports = /**
                 * The base implementation of `assignValue` and `assignMergeValue` without
                 * value checks.
                 *
                 * @private
                 * @param {Object} object The object to modify.
                 * @param {string} key The key of the property to assign.
                 * @param {*} value The value to assign.
                 */ function(object, key, value) {
                "__proto__" == key && defineProperty ? defineProperty(object, key, {
                    configurable: !0,
                    enumerable: !0,
                    value: value,
                    writable: !0
                }) : object[key] = value;
            };
        /***/ },
        /* 38 */ /***/ function(module1, exports1) {
            module1.exports = function(module1) {
                return module1.webpackPolyfill || (module1.deprecate = function() {}, module1.paths = [], module1.children || (module1.children = []), Object.defineProperty(module1, "loaded", {
                    enumerable: !0,
                    get: function() {
                        return module1.l;
                    }
                }), Object.defineProperty(module1, "id", {
                    enumerable: !0,
                    get: function() {
                        return module1.i;
                    }
                }), module1.webpackPolyfill = 1), module1;
            };
        /***/ },
        /* 39 */ /***/ function(module1, exports1, __webpack_require__) {
            var isFunction = __webpack_require__(36), isLength = __webpack_require__(40);
            module1.exports = /**
                 * Checks if `value` is array-like. A value is considered array-like if it's
                 * not a function and has a `value.length` that's an integer greater than or
                 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
                 * @example
                 *
                 * _.isArrayLike([1, 2, 3]);
                 * // => true
                 *
                 * _.isArrayLike(document.body.children);
                 * // => true
                 *
                 * _.isArrayLike('abc');
                 * // => true
                 *
                 * _.isArrayLike(_.noop);
                 * // => false
                 */ function(value) {
                return null != value && isLength(value.length) && !isFunction(value);
            };
        /***/ },
        /* 40 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Checks if `value` is a valid array-like length.
                 *
                 * **Note:** This method is loosely based on
                 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
                 * @example
                 *
                 * _.isLength(3);
                 * // => true
                 *
                 * _.isLength(Number.MIN_VALUE);
                 * // => false
                 *
                 * _.isLength(Infinity);
                 * // => false
                 *
                 * _.isLength('3');
                 * // => false
                 */ function(value) {
                return "number" == typeof value && value > -1 && value % 1 == 0 && value <= 9007199254740991;
            };
        /***/ },
        /* 41 */ /***/ function(module1, exports1) {
            function _setPrototypeOf(o, p) {
                return module1.exports = _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                }, module1.exports.default = module1.exports, module1.exports.__esModule = !0, _setPrototypeOf(o, p);
            }
            module1.exports = _setPrototypeOf, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 42 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isObjectLike = __webpack_require__(18);
            module1.exports = /**
                 * Checks if `value` is classified as a `Symbol` primitive or object.
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
                 * @example
                 *
                 * _.isSymbol(Symbol.iterator);
                 * // => true
                 *
                 * _.isSymbol('abc');
                 * // => false
                 */ function(value) {
                return "symbol" == typeof value || isObjectLike(value) && "[object Symbol]" == baseGetTag(value);
            };
        /***/ },
        /* 43 */ /***/ function(module1, exports1, __webpack_require__) {
            var isSymbol = __webpack_require__(42), INFINITY = 1 / 0;
            module1.exports = /**
                 * Converts `value` to a string key if it's not a string or symbol.
                 *
                 * @private
                 * @param {*} value The value to inspect.
                 * @returns {string|symbol} Returns the key.
                 */ function(value) {
                if ("string" == typeof value || isSymbol(value)) return value;
                var result = value + "";
                return "0" == result && 1 / value == -INFINITY ? "-0" : result;
            };
        /***/ },
        /* 44 */ /***/ function(module1, exports1, __webpack_require__) {
            /* Built-in method references that are verified to be native. */ var Map1 = __webpack_require__(35)(__webpack_require__(17), "Map");
            module1.exports = Map1;
        /***/ },
        /* 45 */ /***/ function(module1, exports1, __webpack_require__) {
            /* WEBPACK VAR INJECTION */ (function(global) {
                /** Detect free variable `global` from Node.js. */ var freeGlobal = "object" == typeof global && global && global.Object === Object && global;
                module1.exports = freeGlobal;
            /* WEBPACK VAR INJECTION */ }).call(this, __webpack_require__(46));
        /***/ },
        /* 46 */ /***/ function(module1, exports1) {
            var g; // This works in non-strict mode
            g = function() {
                return this;
            }();
            try {
                // This works if eval is allowed (see CSP)
                g = g || Function("return this")();
            } catch (e) {
                // This works if the window reference is available
                "object" == typeof window && (g = window);
            } // g can still be undefined, but nothing to do about it...
            // We return undefined, instead of nothing here, so it's
            // easier to handle this case. if(!global) { ...}
            module1.exports = g;
        /***/ },
        /* 47 */ /***/ function(module1, exports1, __webpack_require__) {
            var mapCacheClear = __webpack_require__(109), mapCacheDelete = __webpack_require__(116), mapCacheGet = __webpack_require__(118), mapCacheHas = __webpack_require__(119), mapCacheSet = __webpack_require__(120);
            /**
                 * Creates a map cache object to store key-value pairs.
                 *
                 * @private
                 * @constructor
                 * @param {Array} [entries] The key-value pairs to cache.
                 */ function MapCache(entries) {
                var index = -1, length = null == entries ? 0 : entries.length;
                for(this.clear(); ++index < length;){
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            } // Add methods to `MapCache`.
            MapCache.prototype.clear = mapCacheClear, MapCache.prototype.delete = mapCacheDelete, MapCache.prototype.get = mapCacheGet, MapCache.prototype.has = mapCacheHas, MapCache.prototype.set = mapCacheSet, module1.exports = MapCache;
        /***/ },
        /* 48 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseAssignValue = __webpack_require__(37), eq = __webpack_require__(26);
            module1.exports = /**
                 * This function is like `assignValue` except that it doesn't assign
                 * `undefined` values.
                 *
                 * @private
                 * @param {Object} object The object to modify.
                 * @param {string} key The key of the property to assign.
                 * @param {*} value The value to assign.
                 */ function(object, key, value) {
                (void 0 === value || eq(object[key], value)) && (void 0 !== value || key in object) || baseAssignValue(object, key, value);
            };
        /***/ },
        /* 49 */ /***/ function(module1, exports1, __webpack_require__) {
            var getNative = __webpack_require__(35), defineProperty = function() {
                try {
                    var func = getNative(Object, "defineProperty");
                    return func({}, "", {}), func;
                } catch (e) {}
            }();
            module1.exports = defineProperty;
        /***/ },
        /* 50 */ /***/ function(module1, exports1, __webpack_require__) {
            /** Built-in value references. */ var getPrototype = __webpack_require__(131)(Object.getPrototypeOf, Object);
            module1.exports = getPrototype;
        /***/ },
        /* 51 */ /***/ function(module1, exports1) {
            /** Used for built-in method references. */ var objectProto = Object.prototype;
            module1.exports = /**
                 * Checks if `value` is likely a prototype object.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
                 */ function(value) {
                var Ctor = value && value.constructor;
                return value === ("function" == typeof Ctor && Ctor.prototype || objectProto);
            };
        /***/ },
        /* 52 */ /***/ function(module1, exports1, __webpack_require__) {
            /* WEBPACK VAR INJECTION */ (function(module1) {
                var root = __webpack_require__(17), stubFalse = __webpack_require__(134), freeExports = exports1 && !exports1.nodeType && exports1, freeModule = freeExports && "object" == typeof module1 && module1 && !module1.nodeType && module1, Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0, nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
                module1.exports = nativeIsBuffer || stubFalse;
            /* WEBPACK VAR INJECTION */ }).call(this, __webpack_require__(38)(module1));
        /***/ },
        /* 53 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseIsTypedArray = __webpack_require__(136), baseUnary = __webpack_require__(137), nodeUtil = __webpack_require__(138), nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray, isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
            module1.exports = isTypedArray;
        /***/ },
        /* 54 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
                 *
                 * @private
                 * @param {Object} object The object to query.
                 * @param {string} key The key of the property to get.
                 * @returns {*} Returns the property value.
                 */ function(object, key) {
                if (("constructor" !== key || "function" != typeof object[key]) && "__proto__" != key) return object[key];
            };
        /***/ },
        /* 55 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseAssignValue = __webpack_require__(37), eq = __webpack_require__(26), hasOwnProperty = Object.prototype.hasOwnProperty;
            module1.exports = /**
                 * Assigns `value` to `key` of `object` if the existing value is not equivalent
                 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
                 * for equality comparisons.
                 *
                 * @private
                 * @param {Object} object The object to modify.
                 * @param {string} key The key of the property to assign.
                 * @param {*} value The value to assign.
                 */ function(object, key, value) {
                var objValue = object[key];
                hasOwnProperty.call(object, key) && eq(objValue, value) && (void 0 !== value || key in object) || baseAssignValue(object, key, value);
            };
        /***/ },
        /* 56 */ /***/ function(module1, exports1, __webpack_require__) {
            var arrayLikeKeys = __webpack_require__(141), baseKeysIn = __webpack_require__(143), isArrayLike = __webpack_require__(39);
            module1.exports = /**
                 * Creates an array of the own and inherited enumerable property names of `object`.
                 *
                 * **Note:** Non-object values are coerced to objects.
                 *
                 * @static
                 * @memberOf _
                 * @since 3.0.0
                 * @category Object
                 * @param {Object} object The object to query.
                 * @returns {Array} Returns the array of property names.
                 * @example
                 *
                 * function Foo() {
                 *   this.a = 1;
                 *   this.b = 2;
                 * }
                 *
                 * Foo.prototype.c = 3;
                 *
                 * _.keysIn(new Foo);
                 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
                 */ function(object) {
                return isArrayLike(object) ? arrayLikeKeys(object, !0) : baseKeysIn(object);
            };
        /***/ },
        /* 57 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * This method returns the first argument it receives.
                 *
                 * @static
                 * @since 0.1.0
                 * @memberOf _
                 * @category Util
                 * @param {*} value Any value.
                 * @returns {*} Returns `value`.
                 * @example
                 *
                 * var object = { 'a': 1 };
                 *
                 * console.log(_.identity(object) === object);
                 * // => true
                 */ function(value) {
                return value;
            };
        /***/ },
        /* 58 */ /***/ function(module1, exports1, __webpack_require__) {
            var apply = __webpack_require__(147), nativeMax = Math.max;
            module1.exports = /**
                 * A specialized version of `baseRest` which transforms the rest array.
                 *
                 * @private
                 * @param {Function} func The function to apply a rest parameter to.
                 * @param {number} [start=func.length-1] The start position of the rest parameter.
                 * @param {Function} transform The rest array transform.
                 * @returns {Function} Returns the new function.
                 */ function(func, start, transform) {
                return start = nativeMax(void 0 === start ? func.length - 1 : start, 0), function() {
                    for(var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length); ++index < length;)array[index] = args[start + index];
                    index = -1;
                    for(var otherArgs = Array(start + 1); ++index < start;)otherArgs[index] = args[index];
                    return otherArgs[start] = transform(array), apply(func, this, otherArgs);
                };
            };
        /***/ },
        /* 59 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseSetToString = __webpack_require__(148), setToString = __webpack_require__(150)(baseSetToString);
            module1.exports = setToString;
        /***/ },
        /* 60 */ /***/ function(module1, exports1, __webpack_require__) {
            var arrayLikeToArray = __webpack_require__(61);
            module1.exports = function(o, minLen) {
                if (o) {
                    if ("string" == typeof o) return arrayLikeToArray(o, minLen);
                    var n = Object.prototype.toString.call(o).slice(8, -1);
                    if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(o);
                    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
                }
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 61 */ /***/ function(module1, exports1) {
            module1.exports = function(arr, len) {
                (null == len || len > arr.length) && (len = arr.length);
                for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
                return arr2;
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 62 */ /***/ function(module1, exports1) {
            module1.exports = 0.000001;
        /***/ },
        /* 63 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a new, empty vec2
                 *
                 * @returns {vec2} a new 2D vector
                 */ function() {
                var out = new Float32Array(2);
                return out[0] = 0, out[1] = 0, out;
            };
        /***/ },
        /* 64 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Subtracts vector b from vector a
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {vec2} out
                 */ function(out, a, b) {
                return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out;
            };
        /***/ },
        /* 65 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Multiplies two vec2's
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {vec2} out
                 */ function(out, a, b) {
                return out[0] = a[0] * b[0], out[1] = a[1] * b[1], out;
            };
        /***/ },
        /* 66 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Divides two vec2's
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {vec2} out
                 */ function(out, a, b) {
                return out[0] = a[0] / b[0], out[1] = a[1] / b[1], out;
            };
        /***/ },
        /* 67 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the euclidian distance between two vec2's
                 *
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {Number} distance between a and b
                 */ function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1];
                return Math.sqrt(x * x + y * y);
            };
        /***/ },
        /* 68 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the squared euclidian distance between two vec2's
                 *
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {Number} squared distance between a and b
                 */ function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1];
                return x * x + y * y;
            };
        /***/ },
        /* 69 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the length of a vec2
                 *
                 * @param {vec2} a vector to calculate length of
                 * @returns {Number} length of a
                 */ function(a) {
                var x = a[0], y = a[1];
                return Math.sqrt(x * x + y * y);
            };
        /***/ },
        /* 70 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the squared length of a vec2
                 *
                 * @param {vec2} a vector to calculate squared length of
                 * @returns {Number} squared length of a
                 */ function(a) {
                var x = a[0], y = a[1];
                return x * x + y * y;
            };
        /***/ },
        /* 71 */ /***/ function(module1, exports1) {
            module1.exports = 0.000001;
        /***/ },
        /* 72 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a new, empty vec3
                 *
                 * @returns {vec3} a new 3D vector
                 */ function() {
                var out = new Float32Array(3);
                return out[0] = 0, out[1] = 0, out[2] = 0, out;
            };
        /***/ },
        /* 73 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a new vec3 initialized with the given values
                 *
                 * @param {Number} x X component
                 * @param {Number} y Y component
                 * @param {Number} z Z component
                 * @returns {vec3} a new 3D vector
                 */ function(x, y, z) {
                var out = new Float32Array(3);
                return out[0] = x, out[1] = y, out[2] = z, out;
            };
        /***/ },
        /* 74 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Normalize a vec3
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a vector to normalize
                 * @returns {vec3} out
                 */ function(out, a) {
                var x = a[0], y = a[1], z = a[2], len = x * x + y * y + z * z;
                return len > 0 && (//TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len), out[0] = a[0] * len, out[1] = a[1] * len, out[2] = a[2] * len), out;
            };
        /***/ },
        /* 75 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the dot product of two vec3's
                 *
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {Number} dot product of a and b
                 */ function(a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
            };
        /***/ },
        /* 76 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Subtracts vector b from vector a
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out;
            };
        /***/ },
        /* 77 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Multiplies two vec3's
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                return out[0] = a[0] * b[0], out[1] = a[1] * b[1], out[2] = a[2] * b[2], out;
            };
        /***/ },
        /* 78 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Divides two vec3's
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                return out[0] = a[0] / b[0], out[1] = a[1] / b[1], out[2] = a[2] / b[2], out;
            };
        /***/ },
        /* 79 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the euclidian distance between two vec3's
                 *
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {Number} distance between a and b
                 */ function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
                return Math.sqrt(x * x + y * y + z * z);
            };
        /***/ },
        /* 80 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the squared euclidian distance between two vec3's
                 *
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {Number} squared distance between a and b
                 */ function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
                return x * x + y * y + z * z;
            };
        /***/ },
        /* 81 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the length of a vec3
                 *
                 * @param {vec3} a vector to calculate length of
                 * @returns {Number} length of a
                 */ function(a) {
                var x = a[0], y = a[1], z = a[2];
                return Math.sqrt(x * x + y * y + z * z);
            };
        /***/ },
        /* 82 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the squared length of a vec3
                 *
                 * @param {vec3} a vector to calculate squared length of
                 * @returns {Number} squared length of a
                 */ function(a) {
                var x = a[0], y = a[1], z = a[2];
                return x * x + y * y + z * z;
            };
        /***/ },
        /* 83 */ /***/ function(module1, exports1, __webpack_require__) {
            var arrayWithHoles = __webpack_require__(153), iterableToArrayLimit = __webpack_require__(154), unsupportedIterableToArray = __webpack_require__(60), nonIterableRest = __webpack_require__(155);
            module1.exports = function(arr, i) {
                return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 84 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = {
                EPSILON: __webpack_require__(71),
                create: __webpack_require__(72),
                clone: __webpack_require__(191),
                angle: __webpack_require__(192),
                fromValues: __webpack_require__(73),
                copy: __webpack_require__(193),
                set: __webpack_require__(194),
                equals: __webpack_require__(195),
                exactEquals: __webpack_require__(196),
                add: __webpack_require__(197),
                subtract: __webpack_require__(76),
                sub: __webpack_require__(198),
                multiply: __webpack_require__(77),
                mul: __webpack_require__(199),
                divide: __webpack_require__(78),
                div: __webpack_require__(200),
                min: __webpack_require__(201),
                max: __webpack_require__(202),
                floor: __webpack_require__(203),
                ceil: __webpack_require__(204),
                round: __webpack_require__(205),
                scale: __webpack_require__(206),
                scaleAndAdd: __webpack_require__(207),
                distance: __webpack_require__(79),
                dist: __webpack_require__(208),
                squaredDistance: __webpack_require__(80),
                sqrDist: __webpack_require__(209),
                length: __webpack_require__(81),
                len: __webpack_require__(210),
                squaredLength: __webpack_require__(82),
                sqrLen: __webpack_require__(211),
                negate: __webpack_require__(212),
                inverse: __webpack_require__(213),
                normalize: __webpack_require__(74),
                dot: __webpack_require__(75),
                cross: __webpack_require__(214),
                lerp: __webpack_require__(215),
                random: __webpack_require__(216),
                transformMat4: __webpack_require__(217),
                transformMat3: __webpack_require__(218),
                transformQuat: __webpack_require__(219),
                rotateX: __webpack_require__(220),
                rotateY: __webpack_require__(221),
                rotateZ: __webpack_require__(222),
                forEach: __webpack_require__(223)
            };
        /***/ },
        /* 85 */ /***/ function(module1, exports1, __webpack_require__) {
            var basePick = __webpack_require__(229), pick = __webpack_require__(243)(function(object, paths) {
                return null == object ? {} : basePick(object, paths);
            });
            module1.exports = pick;
        /***/ },
        /* 86 */ /***/ function(module1, exports1, __webpack_require__) {
            var getPrototypeOf = __webpack_require__(2), setPrototypeOf = __webpack_require__(41), isNativeFunction = __webpack_require__(248), construct = __webpack_require__(249);
            function _wrapNativeSuper(Class) {
                var _cache = "function" == typeof Map ? new Map() : void 0;
                return module1.exports = _wrapNativeSuper = function(Class) {
                    if (null === Class || !isNativeFunction(Class)) return Class;
                    if ("function" != typeof Class) throw TypeError("Super expression must either be null or a function");
                    if (void 0 !== _cache) {
                        if (_cache.has(Class)) return _cache.get(Class);
                        _cache.set(Class, Wrapper);
                    }
                    function Wrapper() {
                        return construct(Class, arguments, getPrototypeOf(this).constructor);
                    }
                    return Wrapper.prototype = Object.create(Class.prototype, {
                        constructor: {
                            value: Wrapper,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), setPrototypeOf(Wrapper, Class);
                }, module1.exports.default = module1.exports, module1.exports.__esModule = !0, _wrapNativeSuper(Class);
            }
            module1.exports = _wrapNativeSuper, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 87 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            /* harmony import */ var _tracer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21), Rasterizer = {
                createContour2D: function() {
                    return {
                        dir: null,
                        index: null,
                        firstVertex: null,
                        insideContours: null,
                        nextpeer: null,
                        prevpeer: null
                    };
                },
                CONTOUR_DIR: {
                    CW_DIR: 0,
                    CCW_DIR: 1,
                    UNKNOWN_DIR: 2
                },
                DIR: {
                    OUTSIDE_EDGE: -32767,
                    INSIDE_EDGE: -32766
                },
                create: function(imageWrapper, labelWrapper) {
                    var imageData = imageWrapper.data, labelData = labelWrapper.data, width = imageWrapper.size.x, height = imageWrapper.size.y, tracer = _tracer__WEBPACK_IMPORTED_MODULE_0__./* default */ a.create(imageWrapper, labelWrapper);
                    return {
                        rasterize: function(depthlabel) {
                            var color, bc, lc, labelindex, cx, cy, vertex, p, cc, sc, pos, i, colorMap = [], connectedCount = 0;
                            for(i = 0; i < 400; i++)colorMap[i] = 0;
                            for(cy = 1, colorMap[0] = imageData[0], cc = null; cy < height - 1; cy++)for(cx = 1, labelindex = 0, bc = colorMap[0]; cx < width - 1; cx++)if (0 === labelData[pos = cy * width + cx]) {
                                if ((color = imageData[pos]) !== bc) {
                                    if (0 === labelindex) colorMap[lc = connectedCount + 1] = color, bc = color, null !== (vertex = tracer.contourTracing(cy, cx, lc, color, Rasterizer.DIR.OUTSIDE_EDGE)) && (connectedCount++, labelindex = lc, (p = Rasterizer.createContour2D()).dir = Rasterizer.CONTOUR_DIR.CW_DIR, p.index = labelindex, p.firstVertex = vertex, p.nextpeer = cc, p.insideContours = null, null !== cc && (cc.prevpeer = p), cc = p);
                                    else if (null !== (vertex = tracer.contourTracing(cy, cx, Rasterizer.DIR.INSIDE_EDGE, color, labelindex))) {
                                        for((p = Rasterizer.createContour2D()).firstVertex = vertex, p.insideContours = null, 0 === depthlabel ? p.dir = Rasterizer.CONTOUR_DIR.CCW_DIR : p.dir = Rasterizer.CONTOUR_DIR.CW_DIR, p.index = depthlabel, sc = cc; null !== sc && sc.index !== labelindex;)sc = sc.nextpeer;
                                        null !== sc && (p.nextpeer = sc.insideContours, null !== sc.insideContours && (sc.insideContours.prevpeer = p), sc.insideContours = p);
                                    }
                                } else labelData[pos] = labelindex;
                            } else labelData[pos] === Rasterizer.DIR.OUTSIDE_EDGE || labelData[pos] === Rasterizer.DIR.INSIDE_EDGE ? (labelindex = 0, bc = labelData[pos] === Rasterizer.DIR.INSIDE_EDGE ? imageData[pos] : colorMap[0]) : bc = colorMap[labelindex = labelData[pos]];
                            for(sc = cc; null !== sc;)sc.index = depthlabel, sc = sc.nextpeer;
                            return {
                                cc: cc,
                                count: connectedCount
                            };
                        },
                        debug: {
                            drawContour: function(canvas, firstContour) {
                                var iq, q, p, ctx = canvas.getContext("2d"), pq = firstContour;
                                for(ctx.strokeStyle = "red", ctx.fillStyle = "red", ctx.lineWidth = 1, iq = null !== pq ? pq.insideContours : null; null !== pq;){
                                    switch(null !== iq ? (q = iq, iq = iq.nextpeer) : (q = pq, iq = null !== (pq = pq.nextpeer) ? pq.insideContours : null), q.dir){
                                        case Rasterizer.CONTOUR_DIR.CW_DIR:
                                            ctx.strokeStyle = "red";
                                            break;
                                        case Rasterizer.CONTOUR_DIR.CCW_DIR:
                                            ctx.strokeStyle = "blue";
                                            break;
                                        case Rasterizer.CONTOUR_DIR.UNKNOWN_DIR:
                                            ctx.strokeStyle = "green";
                                    }
                                    p = q.firstVertex, ctx.beginPath(), ctx.moveTo(p.x, p.y);
                                    do p = p.next, ctx.lineTo(p.x, p.y);
                                    while (p !== q.firstVertex)
                                    ctx.stroke();
                                }
                            }
                        }
                    };
                }
            };
            /* harmony default export */ __webpack_exports__.a = Rasterizer;
        /***/ },
        /* 88 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            /* @preserve ASM END */ /* harmony default export */ __webpack_exports__.a = /* eslint-disable no-param-reassign */ /* eslint-disable no-bitwise */ /* eslint-disable eqeqeq */ /* @preserve ASM BEGIN */ function(stdlib, foreign, buffer) {
                "use asm";
                var images = new stdlib.Uint8Array(buffer);
                var size = foreign.size | 0;
                var imul = stdlib.Math.imul;
                function erode(inImagePtr, outImagePtr) {
                    inImagePtr |= 0;
                    outImagePtr |= 0;
                    var v = 0;
                    var u = 0;
                    var sum = 0;
                    var yStart1 = 0;
                    var yStart2 = 0;
                    var xStart1 = 0;
                    var xStart2 = 0;
                    var offset = 0;
                    for(v = 1; (v | 0) < (size - 1 | 0); v = v + 1 | 0){
                        offset = offset + size | 0;
                        for(u = 1; (u | 0) < (size - 1 | 0); u = u + 1 | 0){
                            yStart1 = offset - size | 0;
                            yStart2 = offset + size | 0;
                            xStart1 = u - 1 | 0;
                            xStart2 = u + 1 | 0;
                            sum = (images[inImagePtr + yStart1 + xStart1 | 0] | 0) + (images[inImagePtr + yStart1 + xStart2 | 0] | 0) + (images[inImagePtr + offset + u | 0] | 0) + (images[inImagePtr + yStart2 + xStart1 | 0] | 0) + (images[inImagePtr + yStart2 + xStart2 | 0] | 0) | 0;
                            if ((sum | 0) == 5) images[outImagePtr + offset + u | 0] = 1;
                            else images[outImagePtr + offset + u | 0] = 0;
                        }
                    }
                }
                function subtract(aImagePtr, bImagePtr, outImagePtr) {
                    aImagePtr |= 0;
                    bImagePtr |= 0;
                    outImagePtr |= 0;
                    var length = 0;
                    length = imul(size, size) | 0;
                    while((length | 0) > 0){
                        length = length - 1 | 0;
                        images[outImagePtr + length | 0] = (images[aImagePtr + length | 0] | 0) - (images[bImagePtr + length | 0] | 0) | 0;
                    }
                }
                function bitwiseOr(aImagePtr, bImagePtr, outImagePtr) {
                    aImagePtr |= 0;
                    bImagePtr |= 0;
                    outImagePtr |= 0;
                    var length = 0;
                    length = imul(size, size) | 0;
                    while((length | 0) > 0){
                        length = length - 1 | 0;
                        images[outImagePtr + length | 0] = images[aImagePtr + length | 0] | 0 | (images[bImagePtr + length | 0] | 0) | 0;
                    }
                }
                function countNonZero(imagePtr) {
                    imagePtr |= 0;
                    var sum = 0;
                    var length = 0;
                    length = imul(size, size) | 0;
                    while((length | 0) > 0){
                        length = length - 1 | 0;
                        sum = (sum | 0) + (images[imagePtr + length | 0] | 0) | 0;
                    }
                    return sum | 0;
                }
                function init(imagePtr, value) {
                    imagePtr |= 0;
                    value |= 0;
                    var length = 0;
                    length = imul(size, size) | 0;
                    while((length | 0) > 0){
                        length = length - 1 | 0;
                        images[imagePtr + length | 0] = value;
                    }
                }
                function dilate(inImagePtr, outImagePtr) {
                    inImagePtr |= 0;
                    outImagePtr |= 0;
                    var v = 0;
                    var u = 0;
                    var sum = 0;
                    var yStart1 = 0;
                    var yStart2 = 0;
                    var xStart1 = 0;
                    var xStart2 = 0;
                    var offset = 0;
                    for(v = 1; (v | 0) < (size - 1 | 0); v = v + 1 | 0){
                        offset = offset + size | 0;
                        for(u = 1; (u | 0) < (size - 1 | 0); u = u + 1 | 0){
                            yStart1 = offset - size | 0;
                            yStart2 = offset + size | 0;
                            xStart1 = u - 1 | 0;
                            xStart2 = u + 1 | 0;
                            sum = (images[inImagePtr + yStart1 + xStart1 | 0] | 0) + (images[inImagePtr + yStart1 + xStart2 | 0] | 0) + (images[inImagePtr + offset + u | 0] | 0) + (images[inImagePtr + yStart2 + xStart1 | 0] | 0) + (images[inImagePtr + yStart2 + xStart2 | 0] | 0) | 0;
                            if ((sum | 0) > 0) images[outImagePtr + offset + u | 0] = 1;
                            else images[outImagePtr + offset + u | 0] = 0;
                        }
                    }
                }
                function memcpy(srcImagePtr, dstImagePtr) {
                    srcImagePtr |= 0;
                    dstImagePtr |= 0;
                    var length = 0;
                    length = imul(size, size) | 0;
                    while((length | 0) > 0){
                        length = length - 1 | 0;
                        images[dstImagePtr + length | 0] = images[srcImagePtr + length | 0] | 0;
                    }
                }
                function zeroBorder(imagePtr) {
                    imagePtr |= 0;
                    var x = 0;
                    var y = 0;
                    for(x = 0; (x | 0) < (size - 1 | 0); x = x + 1 | 0){
                        images[imagePtr + x | 0] = 0;
                        images[imagePtr + y | 0] = 0;
                        y = y + size - 1 | 0;
                        images[imagePtr + y | 0] = 0;
                        y = y + 1 | 0;
                    }
                    for(x = 0; (x | 0) < (size | 0); x = x + 1 | 0){
                        images[imagePtr + y | 0] = 0;
                        y = y + 1 | 0;
                    }
                }
                function skeletonize() {
                    var subImagePtr = 0;
                    var erodedImagePtr = 0;
                    var tempImagePtr = 0;
                    var skelImagePtr = 0;
                    var sum = 0;
                    var done = 0;
                    erodedImagePtr = imul(size, size) | 0;
                    tempImagePtr = erodedImagePtr + erodedImagePtr | 0;
                    skelImagePtr = tempImagePtr + erodedImagePtr | 0; // init skel-image
                    init(skelImagePtr, 0);
                    zeroBorder(subImagePtr);
                    do {
                        erode(subImagePtr, erodedImagePtr);
                        dilate(erodedImagePtr, tempImagePtr);
                        subtract(subImagePtr, tempImagePtr, tempImagePtr);
                        bitwiseOr(skelImagePtr, tempImagePtr, skelImagePtr);
                        memcpy(erodedImagePtr, subImagePtr);
                        sum = countNonZero(subImagePtr) | 0;
                        done = (sum | 0) == 0 | 0;
                    }while (!done)
                }
                return {
                    skeletonize: skeletonize
                };
            };
        /* eslint-enable eqeqeq */ /***/ },
        /* 89 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(263);
        /***/ },
        /* 90 */ /***/ function(module1, exports1, __webpack_require__) {
            var Stack = __webpack_require__(91), assignMergeValue = __webpack_require__(48), baseFor = __webpack_require__(121), baseMergeDeep = __webpack_require__(123), isObject = __webpack_require__(14), keysIn = __webpack_require__(56), safeGet = __webpack_require__(54);
            module1.exports = /**
                 * The base implementation of `_.merge` without support for multiple sources.
                 *
                 * @private
                 * @param {Object} object The destination object.
                 * @param {Object} source The source object.
                 * @param {number} srcIndex The index of `source`.
                 * @param {Function} [customizer] The function to customize merged values.
                 * @param {Object} [stack] Tracks traversed source values and their merged
                 *  counterparts.
                 */ function baseMerge(object, source, srcIndex, customizer, stack) {
                object !== source && baseFor(source, function(srcValue, key) {
                    if (stack || (stack = new Stack()), isObject(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
                    else {
                        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
                        void 0 === newValue && (newValue = srcValue), assignMergeValue(object, key, newValue);
                    }
                }, keysIn);
            };
        /***/ },
        /* 91 */ /***/ function(module1, exports1, __webpack_require__) {
            var ListCache = __webpack_require__(24), stackClear = __webpack_require__(97), stackDelete = __webpack_require__(98), stackGet = __webpack_require__(99), stackHas = __webpack_require__(100), stackSet = __webpack_require__(101);
            /**
                 * Creates a stack cache object to store key-value pairs.
                 *
                 * @private
                 * @constructor
                 * @param {Array} [entries] The key-value pairs to cache.
                 */ function Stack(entries) {
                var data = this.__data__ = new ListCache(entries);
                this.size = data.size;
            } // Add methods to `Stack`.
            Stack.prototype.clear = stackClear, Stack.prototype.delete = stackDelete, Stack.prototype.get = stackGet, Stack.prototype.has = stackHas, Stack.prototype.set = stackSet, module1.exports = Stack;
        /***/ },
        /* 92 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Removes all key-value entries from the list cache.
                 *
                 * @private
                 * @name clear
                 * @memberOf ListCache
                 */ function() {
                this.__data__ = [], this.size = 0;
            };
        /***/ },
        /* 93 */ /***/ function(module1, exports1, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25), splice = Array.prototype.splice;
            module1.exports = /**
                 * Removes `key` and its value from the list cache.
                 *
                 * @private
                 * @name delete
                 * @memberOf ListCache
                 * @param {string} key The key of the value to remove.
                 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                 */ function(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return !(index < 0) && (index == data.length - 1 ? data.pop() : splice.call(data, index, 1), --this.size, !0);
            };
        /***/ },
        /* 94 */ /***/ function(module1, exports1, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25);
            module1.exports = /**
                 * Gets the list cache value for `key`.
                 *
                 * @private
                 * @name get
                 * @memberOf ListCache
                 * @param {string} key The key of the value to get.
                 * @returns {*} Returns the entry value.
                 */ function(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return index < 0 ? void 0 : data[index][1];
            };
        /***/ },
        /* 95 */ /***/ function(module1, exports1, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25);
            module1.exports = /**
                 * Checks if a list cache value for `key` exists.
                 *
                 * @private
                 * @name has
                 * @memberOf ListCache
                 * @param {string} key The key of the entry to check.
                 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                 */ function(key) {
                return assocIndexOf(this.__data__, key) > -1;
            };
        /***/ },
        /* 96 */ /***/ function(module1, exports1, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25);
            module1.exports = /**
                 * Sets the list cache `key` to `value`.
                 *
                 * @private
                 * @name set
                 * @memberOf ListCache
                 * @param {string} key The key of the value to set.
                 * @param {*} value The value to set.
                 * @returns {Object} Returns the list cache instance.
                 */ function(key, value) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return index < 0 ? (++this.size, data.push([
                    key,
                    value
                ])) : data[index][1] = value, this;
            };
        /***/ },
        /* 97 */ /***/ function(module1, exports1, __webpack_require__) {
            var ListCache = __webpack_require__(24);
            module1.exports = /**
                 * Removes all key-value entries from the stack.
                 *
                 * @private
                 * @name clear
                 * @memberOf Stack
                 */ function() {
                this.__data__ = new ListCache(), this.size = 0;
            };
        /***/ },
        /* 98 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Removes `key` and its value from the stack.
                 *
                 * @private
                 * @name delete
                 * @memberOf Stack
                 * @param {string} key The key of the value to remove.
                 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                 */ function(key) {
                var data = this.__data__, result = data.delete(key);
                return this.size = data.size, result;
            };
        /***/ },
        /* 99 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Gets the stack value for `key`.
                 *
                 * @private
                 * @name get
                 * @memberOf Stack
                 * @param {string} key The key of the value to get.
                 * @returns {*} Returns the entry value.
                 */ function(key) {
                return this.__data__.get(key);
            };
        /***/ },
        /* 100 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Checks if a stack value for `key` exists.
                 *
                 * @private
                 * @name has
                 * @memberOf Stack
                 * @param {string} key The key of the entry to check.
                 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                 */ function(key) {
                return this.__data__.has(key);
            };
        /***/ },
        /* 101 */ /***/ function(module1, exports1, __webpack_require__) {
            var ListCache = __webpack_require__(24), Map1 = __webpack_require__(44), MapCache = __webpack_require__(47);
            module1.exports = /**
                 * Sets the stack `key` to `value`.
                 *
                 * @private
                 * @name set
                 * @memberOf Stack
                 * @param {string} key The key of the value to set.
                 * @param {*} value The value to set.
                 * @returns {Object} Returns the stack cache instance.
                 */ function(key, value) {
                var data = this.__data__;
                if (data instanceof ListCache) {
                    var pairs = data.__data__;
                    if (!Map1 || pairs.length < 199) return pairs.push([
                        key,
                        value
                    ]), this.size = ++data.size, this;
                    data = this.__data__ = new MapCache(pairs);
                }
                return data.set(key, value), this.size = data.size, this;
            };
        /***/ },
        /* 102 */ /***/ function(module1, exports1, __webpack_require__) {
            var isFunction = __webpack_require__(36), isMasked = __webpack_require__(105), isObject = __webpack_require__(14), toSource = __webpack_require__(107), reIsHostCtor = /^\[object .+?Constructor\]$/, objectProto = Object.prototype, funcToString = Function.prototype.toString, hasOwnProperty = objectProto.hasOwnProperty, reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            module1.exports = /**
                 * The base implementation of `_.isNative` without bad shim checks.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is a native function,
                 *  else `false`.
                 */ function(value) {
                return !(!isObject(value) || isMasked(value)) && (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
            };
        /***/ },
        /* 103 */ /***/ function(module1, exports1, __webpack_require__) {
            var Symbol1 = __webpack_require__(27), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, nativeObjectToString = objectProto.toString, symToStringTag = Symbol1 ? Symbol1.toStringTag : void 0;
            module1.exports = /**
                 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
                 *
                 * @private
                 * @param {*} value The value to query.
                 * @returns {string} Returns the raw `toStringTag`.
                 */ function(value) {
                var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
                try {
                    value[symToStringTag] = void 0;
                    var unmasked = !0;
                } catch (e) {}
                var result = nativeObjectToString.call(value);
                return unmasked && (isOwn ? value[symToStringTag] = tag : delete value[symToStringTag]), result;
            };
        /***/ },
        /* 104 */ /***/ function(module1, exports1) {
            /**
                 * Used to resolve the
                 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
                 * of values.
                 */ var nativeObjectToString = Object.prototype.toString;
            module1.exports = /**
                 * Converts `value` to a string using `Object.prototype.toString`.
                 *
                 * @private
                 * @param {*} value The value to convert.
                 * @returns {string} Returns the converted string.
                 */ function(value) {
                return nativeObjectToString.call(value);
            };
        /***/ },
        /* 105 */ /***/ function(module1, exports1, __webpack_require__) {
            var uid, coreJsData = __webpack_require__(106), maskSrcKey = (uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "")) ? "Symbol(src)_1." + uid : "";
            module1.exports = /**
                 * Checks if `func` has its source masked.
                 *
                 * @private
                 * @param {Function} func The function to check.
                 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
                 */ function(func) {
                return !!maskSrcKey && maskSrcKey in func;
            };
        /***/ },
        /* 106 */ /***/ function(module1, exports1, __webpack_require__) {
            /** Used to detect overreaching core-js shims. */ var coreJsData = __webpack_require__(17)["__core-js_shared__"];
            module1.exports = coreJsData;
        /***/ },
        /* 107 */ /***/ function(module1, exports1) {
            /** Used to resolve the decompiled source of functions. */ var funcToString = Function.prototype.toString;
            module1.exports = /**
                 * Converts `func` to its source code.
                 *
                 * @private
                 * @param {Function} func The function to convert.
                 * @returns {string} Returns the source code.
                 */ function(func) {
                if (null != func) {
                    try {
                        return funcToString.call(func);
                    } catch (e) {}
                    try {
                        return func + "";
                    } catch (e) {}
                }
                return "";
            };
        /***/ },
        /* 108 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Gets the value at `key` of `object`.
                 *
                 * @private
                 * @param {Object} [object] The object to query.
                 * @param {string} key The key of the property to get.
                 * @returns {*} Returns the property value.
                 */ function(object, key) {
                return null == object ? void 0 : object[key];
            };
        /***/ },
        /* 109 */ /***/ function(module1, exports1, __webpack_require__) {
            var Hash = __webpack_require__(110), ListCache = __webpack_require__(24), Map1 = __webpack_require__(44);
            module1.exports = /**
                 * Removes all key-value entries from the map.
                 *
                 * @private
                 * @name clear
                 * @memberOf MapCache
                 */ function() {
                this.size = 0, this.__data__ = {
                    hash: new Hash(),
                    map: new (Map1 || ListCache)(),
                    string: new Hash()
                };
            };
        /***/ },
        /* 110 */ /***/ function(module1, exports1, __webpack_require__) {
            var hashClear = __webpack_require__(111), hashDelete = __webpack_require__(112), hashGet = __webpack_require__(113), hashHas = __webpack_require__(114), hashSet = __webpack_require__(115);
            /**
                 * Creates a hash object.
                 *
                 * @private
                 * @constructor
                 * @param {Array} [entries] The key-value pairs to cache.
                 */ function Hash(entries) {
                var index = -1, length = null == entries ? 0 : entries.length;
                for(this.clear(); ++index < length;){
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            } // Add methods to `Hash`.
            Hash.prototype.clear = hashClear, Hash.prototype.delete = hashDelete, Hash.prototype.get = hashGet, Hash.prototype.has = hashHas, Hash.prototype.set = hashSet, module1.exports = Hash;
        /***/ },
        /* 111 */ /***/ function(module1, exports1, __webpack_require__) {
            var nativeCreate = __webpack_require__(28);
            module1.exports = /**
                 * Removes all key-value entries from the hash.
                 *
                 * @private
                 * @name clear
                 * @memberOf Hash
                 */ function() {
                this.__data__ = nativeCreate ? nativeCreate(null) : {}, this.size = 0;
            };
        /***/ },
        /* 112 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Removes `key` and its value from the hash.
                 *
                 * @private
                 * @name delete
                 * @memberOf Hash
                 * @param {Object} hash The hash to modify.
                 * @param {string} key The key of the value to remove.
                 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                 */ function(key) {
                var result = this.has(key) && delete this.__data__[key];
                return this.size -= result ? 1 : 0, result;
            };
        /***/ },
        /* 113 */ /***/ function(module1, exports1, __webpack_require__) {
            var nativeCreate = __webpack_require__(28), hasOwnProperty = Object.prototype.hasOwnProperty;
            module1.exports = /**
                 * Gets the hash value for `key`.
                 *
                 * @private
                 * @name get
                 * @memberOf Hash
                 * @param {string} key The key of the value to get.
                 * @returns {*} Returns the entry value.
                 */ function(key) {
                var data = this.__data__;
                if (nativeCreate) {
                    var result = data[key];
                    return "__lodash_hash_undefined__" === result ? void 0 : result;
                }
                return hasOwnProperty.call(data, key) ? data[key] : void 0;
            };
        /***/ },
        /* 114 */ /***/ function(module1, exports1, __webpack_require__) {
            var nativeCreate = __webpack_require__(28), hasOwnProperty = Object.prototype.hasOwnProperty;
            module1.exports = /**
                 * Checks if a hash value for `key` exists.
                 *
                 * @private
                 * @name has
                 * @memberOf Hash
                 * @param {string} key The key of the entry to check.
                 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                 */ function(key) {
                var data = this.__data__;
                return nativeCreate ? void 0 !== data[key] : hasOwnProperty.call(data, key);
            };
        /***/ },
        /* 115 */ /***/ function(module1, exports1, __webpack_require__) {
            var nativeCreate = __webpack_require__(28);
            module1.exports = /**
                 * Sets the hash `key` to `value`.
                 *
                 * @private
                 * @name set
                 * @memberOf Hash
                 * @param {string} key The key of the value to set.
                 * @param {*} value The value to set.
                 * @returns {Object} Returns the hash instance.
                 */ function(key, value) {
                var data = this.__data__;
                return this.size += this.has(key) ? 0 : 1, data[key] = nativeCreate && void 0 === value ? "__lodash_hash_undefined__" : value, this;
            };
        /***/ },
        /* 116 */ /***/ function(module1, exports1, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module1.exports = /**
                 * Removes `key` and its value from the map.
                 *
                 * @private
                 * @name delete
                 * @memberOf MapCache
                 * @param {string} key The key of the value to remove.
                 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                 */ function(key) {
                var result = getMapData(this, key).delete(key);
                return this.size -= result ? 1 : 0, result;
            };
        /***/ },
        /* 117 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Checks if `value` is suitable for use as unique object key.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
                 */ function(value) {
                var type = typeof value;
                return "string" == type || "number" == type || "symbol" == type || "boolean" == type ? "__proto__" !== value : null === value;
            };
        /***/ },
        /* 118 */ /***/ function(module1, exports1, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module1.exports = /**
                 * Gets the map value for `key`.
                 *
                 * @private
                 * @name get
                 * @memberOf MapCache
                 * @param {string} key The key of the value to get.
                 * @returns {*} Returns the entry value.
                 */ function(key) {
                return getMapData(this, key).get(key);
            };
        /***/ },
        /* 119 */ /***/ function(module1, exports1, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module1.exports = /**
                 * Checks if a map value for `key` exists.
                 *
                 * @private
                 * @name has
                 * @memberOf MapCache
                 * @param {string} key The key of the entry to check.
                 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                 */ function(key) {
                return getMapData(this, key).has(key);
            };
        /***/ },
        /* 120 */ /***/ function(module1, exports1, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module1.exports = /**
                 * Sets the map `key` to `value`.
                 *
                 * @private
                 * @name set
                 * @memberOf MapCache
                 * @param {string} key The key of the value to set.
                 * @param {*} value The value to set.
                 * @returns {Object} Returns the map cache instance.
                 */ function(key, value) {
                var data = getMapData(this, key), size = data.size;
                return data.set(key, value), this.size += data.size == size ? 0 : 1, this;
            };
        /***/ },
        /* 121 */ /***/ function(module1, exports1, __webpack_require__) {
            /**
                 * The base implementation of `baseForOwn` which iterates over `object`
                 * properties returned by `keysFunc` and invokes `iteratee` for each property.
                 * Iteratee functions may exit iteration early by explicitly returning `false`.
                 *
                 * @private
                 * @param {Object} object The object to iterate over.
                 * @param {Function} iteratee The function invoked per iteration.
                 * @param {Function} keysFunc The function to get the keys of `object`.
                 * @returns {Object} Returns `object`.
                 */ var baseFor = __webpack_require__(122)();
            module1.exports = baseFor;
        /***/ },
        /* 122 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
                 *
                 * @private
                 * @param {boolean} [fromRight] Specify iterating from right to left.
                 * @returns {Function} Returns the new base function.
                 */ function(fromRight) {
                return function(object, iteratee, keysFunc) {
                    for(var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--;){
                        var key = props[fromRight ? length : ++index];
                        if (!1 === iteratee(iterable[key], key, iterable)) break;
                    }
                    return object;
                };
            };
        /***/ },
        /* 123 */ /***/ function(module1, exports1, __webpack_require__) {
            var assignMergeValue = __webpack_require__(48), cloneBuffer = __webpack_require__(124), cloneTypedArray = __webpack_require__(125), copyArray = __webpack_require__(128), initCloneObject = __webpack_require__(129), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), isArrayLikeObject = __webpack_require__(133), isBuffer = __webpack_require__(52), isFunction = __webpack_require__(36), isObject = __webpack_require__(14), isPlainObject = __webpack_require__(135), isTypedArray = __webpack_require__(53), safeGet = __webpack_require__(54), toPlainObject = __webpack_require__(139);
            module1.exports = /**
                 * A specialized version of `baseMerge` for arrays and objects which performs
                 * deep merges and tracks traversed objects enabling objects with circular
                 * references to be merged.
                 *
                 * @private
                 * @param {Object} object The destination object.
                 * @param {Object} source The source object.
                 * @param {string} key The key of the value to merge.
                 * @param {number} srcIndex The index of `source`.
                 * @param {Function} mergeFunc The function to merge values.
                 * @param {Function} [customizer] The function to customize assigned values.
                 * @param {Object} [stack] Tracks traversed source values and their merged
                 *  counterparts.
                 */ function(object, source, key, srcIndex, mergeFunc, customizer, stack) {
                var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
                if (stacked) {
                    assignMergeValue(object, key, stacked);
                    return;
                }
                var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0, isCommon = void 0 === newValue;
                if (isCommon) {
                    var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
                    newValue = srcValue, isArr || isBuff || isTyped ? isArray(objValue) ? newValue = objValue : isArrayLikeObject(objValue) ? newValue = copyArray(objValue) : isBuff ? (isCommon = !1, newValue = cloneBuffer(srcValue, !0)) : isTyped ? (isCommon = !1, newValue = cloneTypedArray(srcValue, !0)) : newValue = [] : isPlainObject(srcValue) || isArguments(srcValue) ? (newValue = objValue, isArguments(objValue) ? newValue = toPlainObject(objValue) : (!isObject(objValue) || isFunction(objValue)) && (newValue = initCloneObject(srcValue))) : isCommon = !1;
                }
                isCommon && (// Recursively merge objects and arrays (susceptible to call stack limits).
                stack.set(srcValue, newValue), mergeFunc(newValue, srcValue, srcIndex, customizer, stack), stack.delete(srcValue)), assignMergeValue(object, key, newValue);
            };
        /***/ },
        /* 124 */ /***/ function(module1, exports1, __webpack_require__) {
            /* WEBPACK VAR INJECTION */ (function(module1) {
                var root = __webpack_require__(17), freeExports = exports1 && !exports1.nodeType && exports1, freeModule = freeExports && "object" == typeof module1 && module1 && !module1.nodeType && module1, Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
                module1.exports = /**
                     * Creates a clone of  `buffer`.
                     *
                     * @private
                     * @param {Buffer} buffer The buffer to clone.
                     * @param {boolean} [isDeep] Specify a deep clone.
                     * @returns {Buffer} Returns the cloned buffer.
                     */ function(buffer, isDeep) {
                    if (isDeep) return buffer.slice();
                    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
                    return buffer.copy(result), result;
                };
            /* WEBPACK VAR INJECTION */ }).call(this, __webpack_require__(38)(module1));
        /***/ },
        /* 125 */ /***/ function(module1, exports1, __webpack_require__) {
            var cloneArrayBuffer = __webpack_require__(126);
            module1.exports = /**
                 * Creates a clone of `typedArray`.
                 *
                 * @private
                 * @param {Object} typedArray The typed array to clone.
                 * @param {boolean} [isDeep] Specify a deep clone.
                 * @returns {Object} Returns the cloned typed array.
                 */ function(typedArray, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
                return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
            };
        /***/ },
        /* 126 */ /***/ function(module1, exports1, __webpack_require__) {
            var Uint8Array1 = __webpack_require__(127);
            module1.exports = /**
                 * Creates a clone of `arrayBuffer`.
                 *
                 * @private
                 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
                 * @returns {ArrayBuffer} Returns the cloned array buffer.
                 */ function(arrayBuffer) {
                var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
                return new Uint8Array1(result).set(new Uint8Array1(arrayBuffer)), result;
            };
        /***/ },
        /* 127 */ /***/ function(module1, exports1, __webpack_require__) {
            /** Built-in value references. */ var Uint8Array1 = __webpack_require__(17).Uint8Array;
            module1.exports = Uint8Array1;
        /***/ },
        /* 128 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Copies the values of `source` to `array`.
                 *
                 * @private
                 * @param {Array} source The array to copy values from.
                 * @param {Array} [array=[]] The array to copy values to.
                 * @returns {Array} Returns `array`.
                 */ function(source, array) {
                var index = -1, length = source.length;
                for(array || (array = Array(length)); ++index < length;)array[index] = source[index];
                return array;
            };
        /***/ },
        /* 129 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseCreate = __webpack_require__(130), getPrototype = __webpack_require__(50), isPrototype = __webpack_require__(51);
            module1.exports = /**
                 * Initializes an object clone.
                 *
                 * @private
                 * @param {Object} object The object to clone.
                 * @returns {Object} Returns the initialized clone.
                 */ function(object) {
                return "function" != typeof object.constructor || isPrototype(object) ? {} : baseCreate(getPrototype(object));
            };
        /***/ },
        /* 130 */ /***/ function(module1, exports1, __webpack_require__) {
            var isObject = __webpack_require__(14), objectCreate = Object.create, baseCreate = function() {
                function object() {}
                return function(proto) {
                    if (!isObject(proto)) return {};
                    if (objectCreate) return objectCreate(proto);
                    object.prototype = proto;
                    var result = new object();
                    return object.prototype = void 0, result;
                };
            }();
            module1.exports = baseCreate;
        /***/ },
        /* 131 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a unary function that invokes `func` with its argument transformed.
                 *
                 * @private
                 * @param {Function} func The function to wrap.
                 * @param {Function} transform The argument transform.
                 * @returns {Function} Returns the new function.
                 */ function(func, transform) {
                return function(arg) {
                    return func(transform(arg));
                };
            };
        /***/ },
        /* 132 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isObjectLike = __webpack_require__(18);
            module1.exports = /**
                 * The base implementation of `_.isArguments`.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
                 */ function(value) {
                return isObjectLike(value) && "[object Arguments]" == baseGetTag(value);
            };
        /***/ },
        /* 133 */ /***/ function(module1, exports1, __webpack_require__) {
            var isArrayLike = __webpack_require__(39), isObjectLike = __webpack_require__(18);
            module1.exports = /**
                 * This method is like `_.isArrayLike` except that it also checks if `value`
                 * is an object.
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is an array-like object,
                 *  else `false`.
                 * @example
                 *
                 * _.isArrayLikeObject([1, 2, 3]);
                 * // => true
                 *
                 * _.isArrayLikeObject(document.body.children);
                 * // => true
                 *
                 * _.isArrayLikeObject('abc');
                 * // => false
                 *
                 * _.isArrayLikeObject(_.noop);
                 * // => false
                 */ function(value) {
                return isObjectLike(value) && isArrayLike(value);
            };
        /***/ },
        /* 134 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * This method returns `false`.
                 *
                 * @static
                 * @memberOf _
                 * @since 4.13.0
                 * @category Util
                 * @returns {boolean} Returns `false`.
                 * @example
                 *
                 * _.times(2, _.stubFalse);
                 * // => [false, false]
                 */ function() {
                return !1;
            };
        /***/ },
        /* 135 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), getPrototype = __webpack_require__(50), isObjectLike = __webpack_require__(18), objectProto = Object.prototype, funcToString = Function.prototype.toString, hasOwnProperty = objectProto.hasOwnProperty, objectCtorString = funcToString.call(Object);
            module1.exports = /**
                 * Checks if `value` is a plain object, that is, an object created by the
                 * `Object` constructor or one with a `[[Prototype]]` of `null`.
                 *
                 * @static
                 * @memberOf _
                 * @since 0.8.0
                 * @category Lang
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
                 * @example
                 *
                 * function Foo() {
                 *   this.a = 1;
                 * }
                 *
                 * _.isPlainObject(new Foo);
                 * // => false
                 *
                 * _.isPlainObject([1, 2, 3]);
                 * // => false
                 *
                 * _.isPlainObject({ 'x': 0, 'y': 0 });
                 * // => true
                 *
                 * _.isPlainObject(Object.create(null));
                 * // => true
                 */ function(value) {
                if (!isObjectLike(value) || "[object Object]" != baseGetTag(value)) return !1;
                var proto = getPrototype(value);
                if (null === proto) return !0;
                var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
                return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
            };
        /***/ },
        /* 136 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isLength = __webpack_require__(40), isObjectLike = __webpack_require__(18), typedArrayTags = {};
            typedArrayTags["[object Float32Array]"] = typedArrayTags["[object Float64Array]"] = typedArrayTags["[object Int8Array]"] = typedArrayTags["[object Int16Array]"] = typedArrayTags["[object Int32Array]"] = typedArrayTags["[object Uint8Array]"] = typedArrayTags["[object Uint8ClampedArray]"] = typedArrayTags["[object Uint16Array]"] = typedArrayTags["[object Uint32Array]"] = !0, typedArrayTags["[object Arguments]"] = typedArrayTags["[object Array]"] = typedArrayTags["[object ArrayBuffer]"] = typedArrayTags["[object Boolean]"] = typedArrayTags["[object DataView]"] = typedArrayTags["[object Date]"] = typedArrayTags["[object Error]"] = typedArrayTags["[object Function]"] = typedArrayTags["[object Map]"] = typedArrayTags["[object Number]"] = typedArrayTags["[object Object]"] = typedArrayTags["[object RegExp]"] = typedArrayTags["[object Set]"] = typedArrayTags["[object String]"] = typedArrayTags["[object WeakMap]"] = !1, module1.exports = /**
                 * The base implementation of `_.isTypedArray` without Node.js optimizations.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
                 */ function(value) {
                return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
            };
        /***/ },
        /* 137 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * The base implementation of `_.unary` without support for storing metadata.
                 *
                 * @private
                 * @param {Function} func The function to cap arguments for.
                 * @returns {Function} Returns the new capped function.
                 */ function(func) {
                return function(value) {
                    return func(value);
                };
            };
        /***/ },
        /* 138 */ /***/ function(module1, exports1, __webpack_require__) {
            /* WEBPACK VAR INJECTION */ (function(module1) {
                var freeGlobal = __webpack_require__(45), freeExports = exports1 && !exports1.nodeType && exports1, freeModule = freeExports && "object" == typeof module1 && module1 && !module1.nodeType && module1, freeProcess = freeModule && freeModule.exports === freeExports && freeGlobal.process, nodeUtil = function() {
                    try {
                        // Use `util.types` for Node.js 10+.
                        var types = freeModule && freeModule.require && freeModule.require("util").types;
                        if (types) return types;
                         // Legacy `process.binding('util')` for Node.js < 10.
                        return freeProcess && freeProcess.binding && freeProcess.binding("util");
                    } catch (e) {}
                }();
                module1.exports = nodeUtil;
            /* WEBPACK VAR INJECTION */ }).call(this, __webpack_require__(38)(module1));
        /***/ },
        /* 139 */ /***/ function(module1, exports1, __webpack_require__) {
            var copyObject = __webpack_require__(140), keysIn = __webpack_require__(56);
            module1.exports = /**
                 * Converts `value` to a plain object flattening inherited enumerable string
                 * keyed properties of `value` to own properties of the plain object.
                 *
                 * @static
                 * @memberOf _
                 * @since 3.0.0
                 * @category Lang
                 * @param {*} value The value to convert.
                 * @returns {Object} Returns the converted plain object.
                 * @example
                 *
                 * function Foo() {
                 *   this.b = 2;
                 * }
                 *
                 * Foo.prototype.c = 3;
                 *
                 * _.assign({ 'a': 1 }, new Foo);
                 * // => { 'a': 1, 'b': 2 }
                 *
                 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
                 * // => { 'a': 1, 'b': 2, 'c': 3 }
                 */ function(value) {
                return copyObject(value, keysIn(value));
            };
        /***/ },
        /* 140 */ /***/ function(module1, exports1, __webpack_require__) {
            var assignValue = __webpack_require__(55), baseAssignValue = __webpack_require__(37);
            module1.exports = /**
                 * Copies properties of `source` to `object`.
                 *
                 * @private
                 * @param {Object} source The object to copy properties from.
                 * @param {Array} props The property identifiers to copy.
                 * @param {Object} [object={}] The object to copy properties to.
                 * @param {Function} [customizer] The function to customize copied values.
                 * @returns {Object} Returns `object`.
                 */ function(source, props, object, customizer) {
                var isNew = !object;
                object || (object = {});
                for(var index = -1, length = props.length; ++index < length;){
                    var key = props[index], newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
                    void 0 === newValue && (newValue = source[key]), isNew ? baseAssignValue(object, key, newValue) : assignValue(object, key, newValue);
                }
                return object;
            };
        /***/ },
        /* 141 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseTimes = __webpack_require__(142), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), isBuffer = __webpack_require__(52), isIndex = __webpack_require__(31), isTypedArray = __webpack_require__(53), hasOwnProperty = Object.prototype.hasOwnProperty;
            module1.exports = /**
                 * Creates an array of the enumerable property names of the array-like `value`.
                 *
                 * @private
                 * @param {*} value The value to query.
                 * @param {boolean} inherited Specify returning inherited property names.
                 * @returns {Array} Returns the array of property names.
                 */ function(value, inherited) {
                var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
                for(var key in value)(inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
                ("length" == key || isBuff && ("offset" == key || "parent" == key) || isType && ("buffer" == key || "byteLength" == key || "byteOffset" == key) || // Skip index properties.
                isIndex(key, length))) && result.push(key);
                return result;
            };
        /***/ },
        /* 142 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * The base implementation of `_.times` without support for iteratee shorthands
                 * or max array length checks.
                 *
                 * @private
                 * @param {number} n The number of times to invoke `iteratee`.
                 * @param {Function} iteratee The function invoked per iteration.
                 * @returns {Array} Returns the array of results.
                 */ function(n, iteratee) {
                for(var index = -1, result = Array(n); ++index < n;)result[index] = iteratee(index);
                return result;
            };
        /***/ },
        /* 143 */ /***/ function(module1, exports1, __webpack_require__) {
            var isObject = __webpack_require__(14), isPrototype = __webpack_require__(51), nativeKeysIn = __webpack_require__(144), hasOwnProperty = Object.prototype.hasOwnProperty;
            module1.exports = /**
                 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
                 *
                 * @private
                 * @param {Object} object The object to query.
                 * @returns {Array} Returns the array of property names.
                 */ function(object) {
                if (!isObject(object)) return nativeKeysIn(object);
                var isProto = isPrototype(object), result = [];
                for(var key in object)"constructor" == key && (isProto || !hasOwnProperty.call(object, key)) || result.push(key);
                return result;
            };
        /***/ },
        /* 144 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * This function is like
                 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
                 * except that it includes inherited enumerable properties.
                 *
                 * @private
                 * @param {Object} object The object to query.
                 * @returns {Array} Returns the array of property names.
                 */ function(object) {
                var result = [];
                if (null != object) for(var key in Object(object))result.push(key);
                return result;
            };
        /***/ },
        /* 145 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseRest = __webpack_require__(146), isIterateeCall = __webpack_require__(151);
            module1.exports = /**
                 * Creates a function like `_.assign`.
                 *
                 * @private
                 * @param {Function} assigner The function to assign values.
                 * @returns {Function} Returns the new assigner function.
                 */ function(assigner) {
                return baseRest(function(object, sources) {
                    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
                    for(customizer = assigner.length > 3 && "function" == typeof customizer ? (length--, customizer) : void 0, guard && isIterateeCall(sources[0], sources[1], guard) && (customizer = length < 3 ? void 0 : customizer, length = 1), object = Object(object); ++index < length;){
                        var source = sources[index];
                        source && assigner(object, source, index, customizer);
                    }
                    return object;
                });
            };
        /***/ },
        /* 146 */ /***/ function(module1, exports1, __webpack_require__) {
            var identity = __webpack_require__(57), overRest = __webpack_require__(58), setToString = __webpack_require__(59);
            module1.exports = /**
                 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
                 *
                 * @private
                 * @param {Function} func The function to apply a rest parameter to.
                 * @param {number} [start=func.length-1] The start position of the rest parameter.
                 * @returns {Function} Returns the new function.
                 */ function(func, start) {
                return setToString(overRest(func, start, identity), func + "");
            };
        /***/ },
        /* 147 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * A faster alternative to `Function#apply`, this function invokes `func`
                 * with the `this` binding of `thisArg` and the arguments of `args`.
                 *
                 * @private
                 * @param {Function} func The function to invoke.
                 * @param {*} thisArg The `this` binding of `func`.
                 * @param {Array} args The arguments to invoke `func` with.
                 * @returns {*} Returns the result of `func`.
                 */ function(func, thisArg, args) {
                switch(args.length){
                    case 0:
                        return func.call(thisArg);
                    case 1:
                        return func.call(thisArg, args[0]);
                    case 2:
                        return func.call(thisArg, args[0], args[1]);
                    case 3:
                        return func.call(thisArg, args[0], args[1], args[2]);
                }
                return func.apply(thisArg, args);
            };
        /***/ },
        /* 148 */ /***/ function(module1, exports1, __webpack_require__) {
            var constant = __webpack_require__(149), defineProperty = __webpack_require__(49), identity = __webpack_require__(57), baseSetToString = defineProperty ? function(func, string) {
                return defineProperty(func, "toString", {
                    configurable: !0,
                    enumerable: !1,
                    value: constant(string),
                    writable: !0
                });
            } : identity;
            module1.exports = baseSetToString;
        /***/ },
        /* 149 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a function that returns `value`.
                 *
                 * @static
                 * @memberOf _
                 * @since 2.4.0
                 * @category Util
                 * @param {*} value The value to return from the new function.
                 * @returns {Function} Returns the new constant function.
                 * @example
                 *
                 * var objects = _.times(2, _.constant({ 'a': 1 }));
                 *
                 * console.log(objects);
                 * // => [{ 'a': 1 }, { 'a': 1 }]
                 *
                 * console.log(objects[0] === objects[1]);
                 * // => true
                 */ function(value) {
                return function() {
                    return value;
                };
            };
        /***/ },
        /* 150 */ /***/ function(module1, exports1) {
            /* Built-in method references for those with the same name as other `lodash` methods. */ var nativeNow = Date.now;
            module1.exports = /**
                 * Creates a function that'll short out and invoke `identity` instead
                 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
                 * milliseconds.
                 *
                 * @private
                 * @param {Function} func The function to restrict.
                 * @returns {Function} Returns the new shortable function.
                 */ function(func) {
                var count = 0, lastCalled = 0;
                return function() {
                    var stamp = nativeNow(), remaining = 16 - (stamp - lastCalled);
                    if (lastCalled = stamp, remaining > 0) {
                        if (++count >= 800) return arguments[0];
                    } else count = 0;
                    return func.apply(void 0, arguments);
                };
            };
        /***/ },
        /* 151 */ /***/ function(module1, exports1, __webpack_require__) {
            var eq = __webpack_require__(26), isArrayLike = __webpack_require__(39), isIndex = __webpack_require__(31), isObject = __webpack_require__(14);
            module1.exports = /**
                 * Checks if the given arguments are from an iteratee call.
                 *
                 * @private
                 * @param {*} value The potential iteratee value argument.
                 * @param {*} index The potential iteratee index or key argument.
                 * @param {*} object The potential iteratee object argument.
                 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
                 *  else `false`.
                 */ function(value, index, object) {
                if (!isObject(object)) return !1;
                var type = typeof index;
                return ("number" == type ? !!(isArrayLike(object) && isIndex(index, object.length)) : "string" == type && index in object) && eq(object[index], value);
            };
        /***/ },
        /* 152 */ /***/ function(module1, exports1) {
            "undefined" == typeof window || window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(/* function FrameRequestCallback */ callback) {
                window.setTimeout(callback, 1000 / 60);
            }), "function" != typeof Math.imul && /* eslint-disable no-bitwise */ (Math.imul = function(a, b) {
                var al = 0xffff & a, bl = 0xffff & b;
                // the final |0 converts the unsigned value into a signed value
                return al * bl + ((a >>> 16 & 0xffff) * bl + al * (b >>> 16 & 0xffff) << 16 >>> 0) | 0;
            }), "function" != typeof Object.assign && (Object.assign = function(target) {
                // .length of function is 2
                "use strict";
                if (null === target) // TypeError if undefined or null
                throw TypeError("Cannot convert undefined or null to object");
                for(var to = Object(target), index = 1; index < arguments.length; index++){
                    // eslint-disable-next-line prefer-rest-params
                    var nextSource = arguments[index];
                    if (null !== nextSource) // Skip over if undefined or null
                    // eslint-disable-next-line no-restricted-syntax
                    for(var nextKey in nextSource)// Avoid bugs when hasOwnProperty is shadowed
                    Object.prototype.hasOwnProperty.call(nextSource, nextKey) && (to[nextKey] = nextSource[nextKey]);
                }
                return to;
            });
        /***/ },
        /* 153 */ /***/ function(module1, exports1) {
            module1.exports = function(arr) {
                if (Array.isArray(arr)) return arr;
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 154 */ /***/ function(module1, exports1) {
            module1.exports = function(arr, i) {
                var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
                if (null != _i) {
                    var _arr = [], _n = !0, _d = !1;
                    try {
                        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
                    } catch (err) {
                        _d = !0, _e = err;
                    } finally{
                        try {
                            _n || null == _i.return || _i.return();
                        } finally{
                            if (_d) throw _e;
                        }
                    }
                    return _arr;
                }
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 155 */ /***/ function(module1, exports1) {
            module1.exports = function() {
                throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 156 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a new vec2 initialized with values from an existing vector
                 *
                 * @param {vec2} a vector to clone
                 * @returns {vec2} a new 2D vector
                 */ function(a) {
                var out = new Float32Array(2);
                return out[0] = a[0], out[1] = a[1], out;
            };
        /***/ },
        /* 157 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a new vec2 initialized with the given values
                 *
                 * @param {Number} x X component
                 * @param {Number} y Y component
                 * @returns {vec2} a new 2D vector
                 */ function(x, y) {
                var out = new Float32Array(2);
                return out[0] = x, out[1] = y, out;
            };
        /***/ },
        /* 158 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Copy the values from one vec2 to another
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the source vector
                 * @returns {vec2} out
                 */ function(out, a) {
                return out[0] = a[0], out[1] = a[1], out;
            };
        /***/ },
        /* 159 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Set the components of a vec2 to the given values
                 *
                 * @param {vec2} out the receiving vector
                 * @param {Number} x X component
                 * @param {Number} y Y component
                 * @returns {vec2} out
                 */ function(out, x, y) {
                return out[0] = x, out[1] = y, out;
            };
        /***/ },
        /* 160 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = /**
                 * Returns whether or not the vectors have approximately the same elements in the same position.
                 *
                 * @param {vec2} a The first vector.
                 * @param {vec2} b The second vector.
                 * @returns {Boolean} True if the vectors are equal, false otherwise.
                 */ function(a, b) {
                var a0 = a[0], a1 = a[1], b0 = b[0], b1 = b[1];
                return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
            };
            var EPSILON = __webpack_require__(62);
        /***/ },
        /* 161 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
                 *
                 * @param {vec2} a The first vector.
                 * @param {vec2} b The second vector.
                 * @returns {Boolean} True if the vectors are equal, false otherwise.
                 */ function(a, b) {
                return a[0] === b[0] && a[1] === b[1];
            };
        /***/ },
        /* 162 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Adds two vec2's
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {vec2} out
                 */ function(out, a, b) {
                return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out;
            };
        /***/ },
        /* 163 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(64);
        /***/ },
        /* 164 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(65);
        /***/ },
        /* 165 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(66);
        /***/ },
        /* 166 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns the inverse of the components of a vec2
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a vector to invert
                 * @returns {vec2} out
                 */ function(out, a) {
                return out[0] = 1.0 / a[0], out[1] = 1.0 / a[1], out;
            };
        /***/ },
        /* 167 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns the minimum of two vec2's
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {vec2} out
                 */ function(out, a, b) {
                return out[0] = Math.min(a[0], b[0]), out[1] = Math.min(a[1], b[1]), out;
            };
        /***/ },
        /* 168 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns the maximum of two vec2's
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {vec2} out
                 */ function(out, a, b) {
                return out[0] = Math.max(a[0], b[0]), out[1] = Math.max(a[1], b[1]), out;
            };
        /***/ },
        /* 169 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Rotates a vec2 by an angle
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the vector to rotate
                 * @param {Number} angle the angle of rotation (in radians)
                 * @returns {vec2} out
                 */ function(out, a, angle) {
                var c = Math.cos(angle), s = Math.sin(angle), x = a[0], y = a[1];
                return out[0] = x * c - y * s, out[1] = x * s + y * c, out;
            };
        /***/ },
        /* 170 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Math.floor the components of a vec2
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a vector to floor
                 * @returns {vec2} out
                 */ function(out, a) {
                return out[0] = Math.floor(a[0]), out[1] = Math.floor(a[1]), out;
            };
        /***/ },
        /* 171 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Math.ceil the components of a vec2
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a vector to ceil
                 * @returns {vec2} out
                 */ function(out, a) {
                return out[0] = Math.ceil(a[0]), out[1] = Math.ceil(a[1]), out;
            };
        /***/ },
        /* 172 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Math.round the components of a vec2
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a vector to round
                 * @returns {vec2} out
                 */ function(out, a) {
                return out[0] = Math.round(a[0]), out[1] = Math.round(a[1]), out;
            };
        /***/ },
        /* 173 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Scales a vec2 by a scalar number
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the vector to scale
                 * @param {Number} b amount to scale the vector by
                 * @returns {vec2} out
                 */ function(out, a, b) {
                return out[0] = a[0] * b, out[1] = a[1] * b, out;
            };
        /***/ },
        /* 174 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Adds two vec2's after scaling the second operand by a scalar value
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @param {Number} scale the amount to scale b by before adding
                 * @returns {vec2} out
                 */ function(out, a, b, scale) {
                return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out;
            };
        /***/ },
        /* 175 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(67);
        /***/ },
        /* 176 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(68);
        /***/ },
        /* 177 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(69);
        /***/ },
        /* 178 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(70);
        /***/ },
        /* 179 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Negates the components of a vec2
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a vector to negate
                 * @returns {vec2} out
                 */ function(out, a) {
                return out[0] = -a[0], out[1] = -a[1], out;
            };
        /***/ },
        /* 180 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Normalize a vec2
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a vector to normalize
                 * @returns {vec2} out
                 */ function(out, a) {
                var x = a[0], y = a[1], len = x * x + y * y;
                return len > 0 && (//TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len), out[0] = a[0] * len, out[1] = a[1] * len), out;
            };
        /***/ },
        /* 181 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the dot product of two vec2's
                 *
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {Number} dot product of a and b
                 */ function(a, b) {
                return a[0] * b[0] + a[1] * b[1];
            };
        /***/ },
        /* 182 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Computes the cross product of two vec2's
                 * Note that the cross product must by definition produce a 3D vector
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                var z = a[0] * b[1] - a[1] * b[0];
                return out[0] = out[1] = 0, out[2] = z, out;
            };
        /***/ },
        /* 183 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Performs a linear interpolation between two vec2's
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the first operand
                 * @param {vec2} b the second operand
                 * @param {Number} t interpolation amount between the two inputs
                 * @returns {vec2} out
                 */ function(out, a, b, t) {
                var ax = a[0], ay = a[1];
                return out[0] = ax + t * (b[0] - ax), out[1] = ay + t * (b[1] - ay), out;
            };
        /***/ },
        /* 184 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Generates a random vector with the given scale
                 *
                 * @param {vec2} out the receiving vector
                 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
                 * @returns {vec2} out
                 */ function(out, scale) {
                scale = scale || 1.0;
                var r = 2.0 * Math.random() * Math.PI;
                return out[0] = Math.cos(r) * scale, out[1] = Math.sin(r) * scale, out;
            };
        /***/ },
        /* 185 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transforms the vec2 with a mat2
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the vector to transform
                 * @param {mat2} m matrix to transform with
                 * @returns {vec2} out
                 */ function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[2] * y, out[1] = m[1] * x + m[3] * y, out;
            };
        /***/ },
        /* 186 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transforms the vec2 with a mat2d
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the vector to transform
                 * @param {mat2d} m matrix to transform with
                 * @returns {vec2} out
                 */ function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[2] * y + m[4], out[1] = m[1] * x + m[3] * y + m[5], out;
            };
        /***/ },
        /* 187 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transforms the vec2 with a mat3
                 * 3rd vector component is implicitly '1'
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the vector to transform
                 * @param {mat3} m matrix to transform with
                 * @returns {vec2} out
                 */ function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[3] * y + m[6], out[1] = m[1] * x + m[4] * y + m[7], out;
            };
        /***/ },
        /* 188 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transforms the vec2 with a mat4
                 * 3rd vector component is implicitly '0'
                 * 4th vector component is implicitly '1'
                 *
                 * @param {vec2} out the receiving vector
                 * @param {vec2} a the vector to transform
                 * @param {mat4} m matrix to transform with
                 * @returns {vec2} out
                 */ function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[4] * y + m[12], out[1] = m[1] * x + m[5] * y + m[13], out;
            };
        /***/ },
        /* 189 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = /**
                 * Perform some operation over an array of vec2s.
                 *
                 * @param {Array} a the array of vectors to iterate over
                 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
                 * @param {Number} offset Number of elements to skip at the beginning of the array
                 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
                 * @param {Function} fn Function to call for each vector in the array
                 * @param {Object} [arg] additional argument to pass to fn
                 * @returns {Array} a
                 * @function
                 */ function(a, stride, offset, count, fn, arg) {
                var i, l;
                for(stride || (stride = 2), offset || (offset = 0), l = count ? Math.min(count * stride + offset, a.length) : a.length, i = offset; i < l; i += stride)vec[0] = a[i], vec[1] = a[i + 1], fn(vec, vec, arg), a[i] = vec[0], a[i + 1] = vec[1];
                return a;
            };
            var vec = __webpack_require__(63)();
        /***/ },
        /* 190 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Limit the magnitude of this vector to the value used for the `max`
                 * parameter.
                 *
                 * @param  {vec2} the vector to limit
                 * @param  {Number} max the maximum magnitude for the vector
                 * @returns {vec2} out
                 */ function(out, a, max) {
                var mSq = a[0] * a[0] + a[1] * a[1];
                if (mSq > max * max) {
                    var n = Math.sqrt(mSq);
                    out[0] = a[0] / n * max, out[1] = a[1] / n * max;
                } else out[0] = a[0], out[1] = a[1];
                return out;
            };
        /***/ },
        /* 191 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a new vec3 initialized with values from an existing vector
                 *
                 * @param {vec3} a vector to clone
                 * @returns {vec3} a new 3D vector
                 */ function(a) {
                var out = new Float32Array(3);
                return out[0] = a[0], out[1] = a[1], out[2] = a[2], out;
            };
        /***/ },
        /* 192 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = /**
                 * Get the angle between two 3D vectors
                 * @param {vec3} a The first operand
                 * @param {vec3} b The second operand
                 * @returns {Number} The angle in radians
                 */ function(a, b) {
                var tempA = fromValues(a[0], a[1], a[2]), tempB = fromValues(b[0], b[1], b[2]);
                normalize(tempA, tempA), normalize(tempB, tempB);
                var cosine = dot(tempA, tempB);
                return cosine > 1.0 ? 0 : Math.acos(cosine);
            };
            var fromValues = __webpack_require__(73), normalize = __webpack_require__(74), dot = __webpack_require__(75);
        /***/ },
        /* 193 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Copy the values from one vec3 to another
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the source vector
                 * @returns {vec3} out
                 */ function(out, a) {
                return out[0] = a[0], out[1] = a[1], out[2] = a[2], out;
            };
        /***/ },
        /* 194 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Set the components of a vec3 to the given values
                 *
                 * @param {vec3} out the receiving vector
                 * @param {Number} x X component
                 * @param {Number} y Y component
                 * @param {Number} z Z component
                 * @returns {vec3} out
                 */ function(out, x, y, z) {
                return out[0] = x, out[1] = y, out[2] = z, out;
            };
        /***/ },
        /* 195 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = /**
                 * Returns whether or not the vectors have approximately the same elements in the same position.
                 *
                 * @param {vec3} a The first vector.
                 * @param {vec3} b The second vector.
                 * @returns {Boolean} True if the vectors are equal, false otherwise.
                 */ function(a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], b0 = b[0], b1 = b[1], b2 = b[2];
                return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
            };
            var EPSILON = __webpack_require__(71);
        /***/ },
        /* 196 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
                 *
                 * @param {vec3} a The first vector.
                 * @param {vec3} b The second vector.
                 * @returns {Boolean} True if the vectors are equal, false otherwise.
                 */ function(a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            };
        /***/ },
        /* 197 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Adds two vec3's
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out;
            };
        /***/ },
        /* 198 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(76);
        /***/ },
        /* 199 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(77);
        /***/ },
        /* 200 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(78);
        /***/ },
        /* 201 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns the minimum of two vec3's
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                return out[0] = Math.min(a[0], b[0]), out[1] = Math.min(a[1], b[1]), out[2] = Math.min(a[2], b[2]), out;
            };
        /***/ },
        /* 202 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns the maximum of two vec3's
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                return out[0] = Math.max(a[0], b[0]), out[1] = Math.max(a[1], b[1]), out[2] = Math.max(a[2], b[2]), out;
            };
        /***/ },
        /* 203 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Math.floor the components of a vec3
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a vector to floor
                 * @returns {vec3} out
                 */ function(out, a) {
                return out[0] = Math.floor(a[0]), out[1] = Math.floor(a[1]), out[2] = Math.floor(a[2]), out;
            };
        /***/ },
        /* 204 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Math.ceil the components of a vec3
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a vector to ceil
                 * @returns {vec3} out
                 */ function(out, a) {
                return out[0] = Math.ceil(a[0]), out[1] = Math.ceil(a[1]), out[2] = Math.ceil(a[2]), out;
            };
        /***/ },
        /* 205 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Math.round the components of a vec3
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a vector to round
                 * @returns {vec3} out
                 */ function(out, a) {
                return out[0] = Math.round(a[0]), out[1] = Math.round(a[1]), out[2] = Math.round(a[2]), out;
            };
        /***/ },
        /* 206 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Scales a vec3 by a scalar number
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the vector to scale
                 * @param {Number} b amount to scale the vector by
                 * @returns {vec3} out
                 */ function(out, a, b) {
                return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out;
            };
        /***/ },
        /* 207 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Adds two vec3's after scaling the second operand by a scalar value
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @param {Number} scale the amount to scale b by before adding
                 * @returns {vec3} out
                 */ function(out, a, b, scale) {
                return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out;
            };
        /***/ },
        /* 208 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(79);
        /***/ },
        /* 209 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(80);
        /***/ },
        /* 210 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(81);
        /***/ },
        /* 211 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = __webpack_require__(82);
        /***/ },
        /* 212 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Negates the components of a vec3
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a vector to negate
                 * @returns {vec3} out
                 */ function(out, a) {
                return out[0] = -a[0], out[1] = -a[1], out[2] = -a[2], out;
            };
        /***/ },
        /* 213 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns the inverse of the components of a vec3
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a vector to invert
                 * @returns {vec3} out
                 */ function(out, a) {
                return out[0] = 1.0 / a[0], out[1] = 1.0 / a[1], out[2] = 1.0 / a[2], out;
            };
        /***/ },
        /* 214 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Computes the cross product of two vec3's
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @returns {vec3} out
                 */ function(out, a, b) {
                var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
                return out[0] = ay * bz - az * by, out[1] = az * bx - ax * bz, out[2] = ax * by - ay * bx, out;
            };
        /***/ },
        /* 215 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Performs a linear interpolation between two vec3's
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the first operand
                 * @param {vec3} b the second operand
                 * @param {Number} t interpolation amount between the two inputs
                 * @returns {vec3} out
                 */ function(out, a, b, t) {
                var ax = a[0], ay = a[1], az = a[2];
                return out[0] = ax + t * (b[0] - ax), out[1] = ay + t * (b[1] - ay), out[2] = az + t * (b[2] - az), out;
            };
        /***/ },
        /* 216 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Generates a random vector with the given scale
                 *
                 * @param {vec3} out the receiving vector
                 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
                 * @returns {vec3} out
                 */ function(out, scale) {
                var r = 2.0 * Math.random() * Math.PI, z = 2.0 * Math.random() - 1.0, zScale = Math.sqrt(1.0 - z * z) * (scale = scale || 1.0);
                return out[0] = Math.cos(r) * zScale, out[1] = Math.sin(r) * zScale, out[2] = z * scale, out;
            };
        /***/ },
        /* 217 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transforms the vec3 with a mat4.
                 * 4th vector component is implicitly '1'
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the vector to transform
                 * @param {mat4} m matrix to transform with
                 * @returns {vec3} out
                 */ function(out, a, m) {
                var x = a[0], y = a[1], z = a[2], w = m[3] * x + m[7] * y + m[11] * z + m[15];
                return w = w || 1.0, out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w, out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w, out;
            };
        /***/ },
        /* 218 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transforms the vec3 with a mat3.
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the vector to transform
                 * @param {mat4} m the 3x3 matrix to transform with
                 * @returns {vec3} out
                 */ function(out, a, m) {
                var x = a[0], y = a[1], z = a[2];
                return out[0] = x * m[0] + y * m[3] + z * m[6], out[1] = x * m[1] + y * m[4] + z * m[7], out[2] = x * m[2] + y * m[5] + z * m[8], out;
            };
        /***/ },
        /* 219 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transforms the vec3 with a quat
                 *
                 * @param {vec3} out the receiving vector
                 * @param {vec3} a the vector to transform
                 * @param {quat} q quaternion to transform with
                 * @returns {vec3} out
                 */ function(out, a, q) {
                // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
                var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], // calculate quat * vec
                ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat
                return out[0] = ix * qw + -(iw * qx) + -(iy * qz) - -(iz * qy), out[1] = iy * qw + -(iw * qy) + -(iz * qx) - -(ix * qz), out[2] = iz * qw + -(iw * qz) + -(ix * qy) - -(iy * qx), out;
            };
        /***/ },
        /* 220 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Rotate a 3D vector around the x-axis
                 * @param {vec3} out The receiving vec3
                 * @param {vec3} a The vec3 point to rotate
                 * @param {vec3} b The origin of the rotation
                 * @param {Number} c The angle of rotation
                 * @returns {vec3} out
                 */ function(out, a, b, c) {
                var by = b[1], bz = b[2], py = a[1] - by, pz = a[2] - bz, sc = Math.sin(c), cc = Math.cos(c);
                return out[0] = a[0], out[1] = by + py * cc - pz * sc, out[2] = bz + py * sc + pz * cc, out;
            };
        /***/ },
        /* 221 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Rotate a 3D vector around the y-axis
                 * @param {vec3} out The receiving vec3
                 * @param {vec3} a The vec3 point to rotate
                 * @param {vec3} b The origin of the rotation
                 * @param {Number} c The angle of rotation
                 * @returns {vec3} out
                 */ function(out, a, b, c) {
                var bx = b[0], bz = b[2], px = a[0] - bx, pz = a[2] - bz, sc = Math.sin(c), cc = Math.cos(c);
                return out[0] = bx + pz * sc + px * cc, out[1] = a[1], out[2] = bz + pz * cc - px * sc, out;
            };
        /***/ },
        /* 222 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Rotate a 3D vector around the z-axis
                 * @param {vec3} out The receiving vec3
                 * @param {vec3} a The vec3 point to rotate
                 * @param {vec3} b The origin of the rotation
                 * @param {Number} c The angle of rotation
                 * @returns {vec3} out
                 */ function(out, a, b, c) {
                var bx = b[0], by = b[1], px = a[0] - bx, py = a[1] - by, sc = Math.sin(c), cc = Math.cos(c);
                return out[0] = bx + px * cc - py * sc, out[1] = by + px * sc + py * cc, out[2] = a[2], out;
            };
        /***/ },
        /* 223 */ /***/ function(module1, exports1, __webpack_require__) {
            module1.exports = /**
                 * Perform some operation over an array of vec3s.
                 *
                 * @param {Array} a the array of vectors to iterate over
                 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
                 * @param {Number} offset Number of elements to skip at the beginning of the array
                 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
                 * @param {Function} fn Function to call for each vector in the array
                 * @param {Object} [arg] additional argument to pass to fn
                 * @returns {Array} a
                 * @function
                 */ function(a, stride, offset, count, fn, arg) {
                var i, l;
                for(stride || (stride = 3), offset || (offset = 0), l = count ? Math.min(count * stride + offset, a.length) : a.length, i = offset; i < l; i += stride)vec[0] = a[i], vec[1] = a[i + 1], vec[2] = a[i + 2], fn(vec, vec, arg), a[i] = vec[0], a[i + 1] = vec[1], a[i + 2] = vec[2];
                return a;
            };
            var vec = __webpack_require__(72)();
        /***/ },
        /* 224 */ /***/ function(module1, exports1, __webpack_require__) {
            var arrayLikeToArray = __webpack_require__(61);
            module1.exports = function(arr) {
                if (Array.isArray(arr)) return arrayLikeToArray(arr);
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 225 */ /***/ function(module1, exports1) {
            module1.exports = function(iter) {
                if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 226 */ /***/ function(module1, exports1) {
            module1.exports = function() {
                throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 227 */ /***/ function(module1, exports1, __webpack_require__) {
            var getPrototypeOf = __webpack_require__(2);
            module1.exports = function(object, property) {
                for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = getPrototypeOf(object)););
                return object;
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 228 */ /***/ function(module1, exports1, __webpack_require__) {
            /**
                 * Copyright (c) 2014-present, Facebook, Inc.
                 *
                 * This source code is licensed under the MIT license found in the
                 * LICENSE file in the root directory of this source tree.
                 */ var runtime = function(exports1) {
                "use strict";
                var undefined, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
                function wrap(innerFn, outerFn, self1, tryLocsList) {
                    var state, generator = Object.create((outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator).prototype), context = new Context(tryLocsList || []);
                    return(// .throw, and .return methods.
                    generator._invoke = (state = GenStateSuspendedStart, function(method, arg) {
                        if (state === GenStateExecuting) throw Error("Generator is already running");
                        if (state === GenStateCompleted) {
                            if ("throw" === method) throw arg;
                             // Be forgiving, per 25.3.3.3.3 of the spec:
                            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                            return doneResult();
                        }
                        for(context.method = method, context.arg = arg;;){
                            var delegate = context.delegate;
                            if (delegate) {
                                var delegateResult = // result, either by returning a { value, done } result from the
                                // delegate iterator, or by modifying context.method and context.arg,
                                // setting context.delegate to null, and returning the ContinueSentinel.
                                function maybeInvokeDelegate(delegate, context) {
                                    var method = delegate.iterator[context.method];
                                    if (undefined === method) {
                                        if (// A .throw or .return when the delegate iterator has no .throw
                                        // method always terminates the yield* loop.
                                        context.delegate = null, "throw" === context.method) {
                                            // Note: ["return"] must be used for ES3 parsing compatibility.
                                            if (delegate.iterator.return && (// If the delegate iterator has a return method, give it a
                                            // chance to clean up.
                                            context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) // If maybeInvokeDelegate(context) changed context.method from
                                            // "return" to "throw", let that override the TypeError below.
                                            return ContinueSentinel;
                                            context.method = "throw", context.arg = TypeError("The iterator does not provide a 'throw' method");
                                        }
                                        return ContinueSentinel;
                                    }
                                    var record = tryCatch(method, delegate.iterator, context.arg);
                                    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
                                    var info = record.arg;
                                    return info ? info.done ? (// Assign the result of the finished delegate to the temporary
                                    // variable specified by delegate.resultName (see delegateYield).
                                    context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), // the outer generator.
                                    context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
                                } // Define Generator.prototype.{next,throw,return} in terms of the
                                (delegate, context);
                                if (delegateResult) {
                                    if (delegateResult === ContinueSentinel) continue;
                                    return delegateResult;
                                }
                            }
                            if ("next" === context.method) // Setting context._sent for legacy support of Babel's
                            // function.sent implementation.
                            context.sent = context._sent = context.arg;
                            else if ("throw" === context.method) {
                                if (state === GenStateSuspendedStart) throw state = GenStateCompleted, context.arg;
                                context.dispatchException(context.arg);
                            } else "return" === context.method && context.abrupt("return", context.arg);
                            state = GenStateExecuting;
                            var record = tryCatch(innerFn, self1, context);
                            if ("normal" === record.type) {
                                if (// If an exception is thrown from innerFn, we leave state ===
                                // GenStateExecuting and loop back for another invocation.
                                state = context.done ? GenStateCompleted : "suspendedYield", record.arg === ContinueSentinel) continue;
                                return {
                                    value: record.arg,
                                    done: context.done
                                };
                            }
                            "throw" === record.type && (state = GenStateCompleted, // context.dispatchException(context.arg) call above.
                            context.method = "throw", context.arg = record.arg);
                        }
                    }), generator);
                }
                // record like context.tryEntries[i].completion. This interface could
                // have been (and was previously) designed to take a closure to be
                // invoked without arguments, but in all the cases we care about we
                // already have an existing method we want to call, so there's no need
                // to create a new function object. We can even get away with assuming
                // the method takes exactly one argument, since that happens to be true
                // in every case, so we don't have to touch the arguments object. The
                // only additional allocation required is the completion record, which
                // has a stable shape and so hopefully should be cheap to allocate.
                function tryCatch(fn, obj, arg) {
                    try {
                        return {
                            type: "normal",
                            arg: fn.call(obj, arg)
                        };
                    } catch (err) {
                        return {
                            type: "throw",
                            arg: err
                        };
                    }
                }
                exports1.wrap = wrap;
                var GenStateSuspendedStart = "suspendedStart", GenStateExecuting = "executing", GenStateCompleted = "completed", ContinueSentinel = {};
                // .constructor.prototype properties for functions that return Generator
                // objects. For full spec compliance, you may wish to configure your
                // minifier not to mangle the names of these two functions.
                function Generator() {}
                function GeneratorFunction() {}
                function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
                // don't natively support it.
                var IteratorPrototype = {};
                IteratorPrototype[iteratorSymbol] = function() {
                    return this;
                };
                var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([])));
                NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && // This environment has a native %IteratorPrototype%; use it instead
                // of the polyfill.
                (IteratorPrototype = NativeIteratorPrototype);
                var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
                // Iterator interface in terms of a single ._invoke method.
                function defineIteratorMethods(prototype) {
                    [
                        "next",
                        "throw",
                        "return"
                    ].forEach(function(method) {
                        prototype[method] = function(arg) {
                            return this._invoke(method, arg);
                        };
                    });
                }
                function AsyncIterator(generator, PromiseImpl) {
                    var previousPromise;
                    // .throw, and .return (see defineIteratorMethods).
                    this._invoke = function(method, arg) {
                        function callInvokeWithMethodAndArg() {
                            return new PromiseImpl(function(resolve, reject) {
                                !function invoke(method, arg, resolve, reject) {
                                    var record = tryCatch(generator[method], generator, arg);
                                    if ("throw" === record.type) reject(record.arg);
                                    else {
                                        var result = record.arg, value = result.value;
                                        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function(value) {
                                            invoke("next", value, resolve, reject);
                                        }, function(err) {
                                            invoke("throw", err, resolve, reject);
                                        }) : PromiseImpl.resolve(value).then(function(unwrapped) {
                                            // When a yielded Promise is resolved, its final value becomes
                                            // the .value of the Promise<{value,done}> result for the
                                            // current iteration.
                                            result.value = unwrapped, resolve(result);
                                        }, function(error) {
                                            // If a rejected Promise was yielded, throw the rejection back
                                            // into the async generator function so it can be handled there.
                                            return invoke("throw", error, resolve, reject);
                                        });
                                    }
                                }(method, arg, resolve, reject);
                            });
                        }
                        return previousPromise = // all previous Promises have been resolved before calling invoke,
                        // so that results are always delivered in the correct order. If
                        // enqueue has not been called before, then it is important to
                        // call invoke immediately, without waiting on a callback to fire,
                        // so that the async generator function has the opportunity to do
                        // any necessary setup in a predictable way. This predictability
                        // is why the Promise constructor synchronously invokes its
                        // executor callback, and why async functions synchronously
                        // execute code before the first await. Since we implement simple
                        // async functions in terms of async generators, it is especially
                        // important to get this right, even though it requires care.
                        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // invocations of the iterator.
                        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                    } // Define the unified helper method that is used to implement .next,
                    ;
                }
                function pushTryEntry(locs) {
                    var entry = {
                        tryLoc: locs[0]
                    };
                    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
                }
                function resetTryEntry(entry) {
                    var record = entry.completion || {};
                    record.type = "normal", delete record.arg, entry.completion = record;
                }
                function Context(tryLocsList) {
                    // The root entry object (effectively a try statement without a catch
                    // or a finally block) gives us a place to store values thrown from
                    // locations where there is no enclosing try statement.
                    this.tryEntries = [
                        {
                            tryLoc: "root"
                        }
                    ], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
                }
                function values(iterable) {
                    if (iterable) {
                        var iteratorMethod = iterable[iteratorSymbol];
                        if (iteratorMethod) return iteratorMethod.call(iterable);
                        if ("function" == typeof iterable.next) return iterable;
                        if (!isNaN(iterable.length)) {
                            var i = -1, next = function next() {
                                for(; ++i < iterable.length;)if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
                                return next.value = undefined, next.done = !0, next;
                            };
                            return next.next = next;
                        }
                    } // Return an iterator with no values.
                    return {
                        next: doneResult
                    };
                }
                function doneResult() {
                    return {
                        value: undefined,
                        done: !0
                    };
                }
                // or not, return the runtime object so that we can declare the variable
                // regeneratorRuntime in the outer scope, which allows this module to be
                // injected easily by `bin/regenerator --include-runtime script.js`.
                return GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype, GeneratorFunctionPrototype.constructor = GeneratorFunction, GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction", exports1.isGeneratorFunction = function(genFun) {
                    var ctor = "function" == typeof genFun && genFun.constructor;
                    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === // For the native GeneratorFunction constructor, the best we can
                    // do is to check its .name property.
                    (ctor.displayName || ctor.name));
                }, exports1.mark = function(genFun) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, toStringTagSymbol in genFun || (genFun[toStringTagSymbol] = "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
                }, // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
                // `hasOwn.call(value, "__await")` to determine if the yielded value is
                // meant to be awaited.
                exports1.awrap = function(arg) {
                    return {
                        __await: arg
                    };
                }, defineIteratorMethods(AsyncIterator.prototype), AsyncIterator.prototype[asyncIteratorSymbol] = function() {
                    return this;
                }, exports1.AsyncIterator = AsyncIterator, // AsyncIterator objects; they just return a Promise for the value of
                // the final result produced by the iterator.
                exports1.async = function(innerFn, outerFn, self1, tryLocsList, PromiseImpl) {
                    void 0 === PromiseImpl && (PromiseImpl = Promise);
                    var iter = new AsyncIterator(wrap(innerFn, outerFn, self1, tryLocsList), PromiseImpl);
                    return exports1.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
                     : iter.next().then(function(result) {
                        return result.done ? result.value : iter.next();
                    });
                }, // unified ._invoke helper method.
                defineIteratorMethods(Gp), Gp[toStringTagSymbol] = "Generator", // @@iterator function is called on it. Some browsers' implementations of the
                // iterator prototype chain incorrectly implement this, causing the Generator
                // object to not be returned from this call. This ensures that doesn't happen.
                // See https://github.com/facebook/regenerator/issues/274 for more details.
                Gp[iteratorSymbol] = function() {
                    return this;
                }, Gp.toString = function() {
                    return "[object Generator]";
                }, exports1.keys = function(object) {
                    var keys = [];
                    for(var key in object)keys.push(key);
                    // things simple and return the next function itself.
                    return keys.reverse(), function next() {
                        for(; keys.length;){
                            var key = keys.pop();
                            if (key in object) return next.value = key, next.done = !1, next;
                        } // To avoid creating an additional object, we just hang the .value
                        return(// and .done properties off the next function object itself. This
                        // also ensures that the minifier will not anonymize the function.
                        next.done = !0, next);
                    };
                }, exports1.values = values, Context.prototype = {
                    constructor: Context,
                    reset: function(skipTempReset) {
                        if (this.prev = 0, this.next = 0, // function.sent implementation.
                        this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for(var name in this)// Not sure about the optimal order of these conditions:
                        "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
                    },
                    stop: function() {
                        this.done = !0;
                        var rootRecord = this.tryEntries[0].completion;
                        if ("throw" === rootRecord.type) throw rootRecord.arg;
                        return this.rval;
                    },
                    dispatchException: function(exception) {
                        if (this.done) throw exception;
                        var context = this;
                        function handle(loc, caught) {
                            return record.type = "throw", record.arg = exception, context.next = loc, caught && (// If the dispatched exception was caught by a catch block,
                            // then let that catch block handle the exception normally.
                            context.method = "next", context.arg = undefined), !!caught;
                        }
                        for(var i = this.tryEntries.length - 1; i >= 0; --i){
                            var entry = this.tryEntries[i], record = entry.completion;
                            if ("root" === entry.tryLoc) // Exception thrown outside of any try block that could handle
                            // it, so set the completion value of the entire function to
                            // throw the exception.
                            return handle("end");
                            if (entry.tryLoc <= this.prev) {
                                var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc");
                                if (hasCatch && hasFinally) {
                                    if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                                    if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                } else if (hasCatch) {
                                    if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                                } else if (hasFinally) {
                                    if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                } else throw Error("try statement without catch or finally");
                            }
                        }
                    },
                    abrupt: function(type, arg) {
                        for(var i = this.tryEntries.length - 1; i >= 0; --i){
                            var entry = this.tryEntries[i];
                            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                                var finallyEntry = entry;
                                break;
                            }
                        }
                        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && // Ignore the finally entry if control is not jumping to a
                        // location outside the try/catch block.
                        (finallyEntry = null);
                        var record = finallyEntry ? finallyEntry.completion : {};
                        return (record.type = type, record.arg = arg, finallyEntry) ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
                    },
                    complete: function(record, afterLoc) {
                        if ("throw" === record.type) throw record.arg;
                        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
                    },
                    finish: function(finallyLoc) {
                        for(var i = this.tryEntries.length - 1; i >= 0; --i){
                            var entry = this.tryEntries[i];
                            if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
                        }
                    },
                    catch: function(tryLoc) {
                        for(var i = this.tryEntries.length - 1; i >= 0; --i){
                            var entry = this.tryEntries[i];
                            if (entry.tryLoc === tryLoc) {
                                var record = entry.completion;
                                if ("throw" === record.type) {
                                    var thrown = record.arg;
                                    resetTryEntry(entry);
                                }
                                return thrown;
                            }
                        } // The context.catch method must only be called with a location
                        // argument that corresponds to a known catch block.
                        throw Error("illegal catch attempt");
                    },
                    delegateYield: function(iterable, resultName, nextLoc) {
                        return this.delegate = {
                            iterator: values(iterable),
                            resultName: resultName,
                            nextLoc: nextLoc
                        }, "next" === this.method && // Deliberately forget the last sent value so that we don't
                        // accidentally pass it on to the delegate.
                        (this.arg = undefined), ContinueSentinel;
                    }
                }, exports1;
            }(// If this script is executing as a CommonJS module, use module.exports
            // as the regeneratorRuntime namespace. Otherwise create a new empty
            // object. Either way, the resulting object will be used to initialize
            // the regeneratorRuntime variable at the top of this file.
            module1.exports);
            try {
                regeneratorRuntime = runtime;
            } catch (accidentalStrictMode) {
                // This module should not be running in strict mode, so the above
                // assignment should always work unless something is misconfigured. Just
                // in case runtime.js accidentally runs in strict mode, we can escape
                // strict mode using a global Function call. This could conceivably fail
                // if a Content Security Policy forbids using Function, but in that case
                // the proper solution is to fix the accidental strict mode problem. If
                // you've misconfigured your bundler to force strict mode and applied a
                // CSP to forbid Function, and you're not willing to fix either of those
                // problems, please detail your unique predicament in a GitHub issue.
                Function("r", "regeneratorRuntime = r")(runtime);
            }
        /***/ },
        /* 229 */ /***/ function(module1, exports1, __webpack_require__) {
            var basePickBy = __webpack_require__(230), hasIn = __webpack_require__(240);
            module1.exports = /**
                 * The base implementation of `_.pick` without support for individual
                 * property identifiers.
                 *
                 * @private
                 * @param {Object} object The source object.
                 * @param {string[]} paths The property paths to pick.
                 * @returns {Object} Returns the new object.
                 */ function(object, paths) {
                return basePickBy(object, paths, function(value, path) {
                    return hasIn(object, path);
                });
            };
        /***/ },
        /* 230 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseGet = __webpack_require__(231), baseSet = __webpack_require__(239), castPath = __webpack_require__(32);
            module1.exports = /**
                 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
                 *
                 * @private
                 * @param {Object} object The source object.
                 * @param {string[]} paths The property paths to pick.
                 * @param {Function} predicate The function invoked per property.
                 * @returns {Object} Returns the new object.
                 */ function(object, paths, predicate) {
                for(var index = -1, length = paths.length, result = {}; ++index < length;){
                    var path = paths[index], value = baseGet(object, path);
                    predicate(value, path) && baseSet(result, castPath(path, object), value);
                }
                return result;
            };
        /***/ },
        /* 231 */ /***/ function(module1, exports1, __webpack_require__) {
            var castPath = __webpack_require__(32), toKey = __webpack_require__(43);
            module1.exports = /**
                 * The base implementation of `_.get` without support for default values.
                 *
                 * @private
                 * @param {Object} object The object to query.
                 * @param {Array|string} path The path of the property to get.
                 * @returns {*} Returns the resolved value.
                 */ function(object, path) {
                path = castPath(path, object);
                for(var index = 0, length = path.length; null != object && index < length;)object = object[toKey(path[index++])];
                return index && index == length ? object : void 0;
            };
        /***/ },
        /* 232 */ /***/ function(module1, exports1, __webpack_require__) {
            var isArray = __webpack_require__(15), isSymbol = __webpack_require__(42), reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
            module1.exports = /**
                 * Checks if `value` is a property name and not a property path.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @param {Object} [object] The object to query keys on.
                 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
                 */ function(value, object) {
                if (isArray(value)) return !1;
                var type = typeof value;
                return !!("number" == type || "symbol" == type || "boolean" == type || null == value || isSymbol(value)) || reIsPlainProp.test(value) || !reIsDeepProp.test(value) || null != object && value in Object(object);
            };
        /***/ },
        /* 233 */ /***/ function(module1, exports1, __webpack_require__) {
            var memoizeCapped = __webpack_require__(234), rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, reEscapeChar = /\\(\\)?/g, stringToPath = memoizeCapped(function(string) {
                var result = [];
                return 46 === string.charCodeAt(0) && result.push(""), string.replace(rePropName, function(match, number, quote, subString) {
                    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
                }), result;
            });
            module1.exports = stringToPath;
        /***/ },
        /* 234 */ /***/ function(module1, exports1, __webpack_require__) {
            var memoize = __webpack_require__(235);
            module1.exports = /**
                 * A specialized version of `_.memoize` which clears the memoized function's
                 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
                 *
                 * @private
                 * @param {Function} func The function to have its output memoized.
                 * @returns {Function} Returns the new memoized function.
                 */ function(func) {
                var result = memoize(func, function(key) {
                    return 500 === cache.size && cache.clear(), key;
                }), cache = result.cache;
                return result;
            };
        /***/ },
        /* 235 */ /***/ function(module1, exports1, __webpack_require__) {
            var MapCache = __webpack_require__(47);
            /**
                 * Creates a function that memoizes the result of `func`. If `resolver` is
                 * provided, it determines the cache key for storing the result based on the
                 * arguments provided to the memoized function. By default, the first argument
                 * provided to the memoized function is used as the map cache key. The `func`
                 * is invoked with the `this` binding of the memoized function.
                 *
                 * **Note:** The cache is exposed as the `cache` property on the memoized
                 * function. Its creation may be customized by replacing the `_.memoize.Cache`
                 * constructor with one whose instances implement the
                 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
                 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
                 *
                 * @static
                 * @memberOf _
                 * @since 0.1.0
                 * @category Function
                 * @param {Function} func The function to have its output memoized.
                 * @param {Function} [resolver] The function to resolve the cache key.
                 * @returns {Function} Returns the new memoized function.
                 * @example
                 *
                 * var object = { 'a': 1, 'b': 2 };
                 * var other = { 'c': 3, 'd': 4 };
                 *
                 * var values = _.memoize(_.values);
                 * values(object);
                 * // => [1, 2]
                 *
                 * values(other);
                 * // => [3, 4]
                 *
                 * object.a = 2;
                 * values(object);
                 * // => [1, 2]
                 *
                 * // Modify the result cache.
                 * values.cache.set(object, ['a', 'b']);
                 * values(object);
                 * // => ['a', 'b']
                 *
                 * // Replace `_.memoize.Cache`.
                 * _.memoize.Cache = WeakMap;
                 */ function memoize(func, resolver) {
                if ("function" != typeof func || null != resolver && "function" != typeof resolver) throw TypeError("Expected a function");
                var memoized = function() {
                    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
                    if (cache.has(key)) return cache.get(key);
                    var result = func.apply(this, args);
                    return memoized.cache = cache.set(key, result) || cache, result;
                };
                return memoized.cache = new (memoize.Cache || MapCache)(), memoized;
            } // Expose `MapCache`.
            memoize.Cache = MapCache, module1.exports = memoize;
        /***/ },
        /* 236 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseToString = __webpack_require__(237);
            module1.exports = /**
                 * Converts `value` to a string. An empty string is returned for `null`
                 * and `undefined` values. The sign of `-0` is preserved.
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Lang
                 * @param {*} value The value to convert.
                 * @returns {string} Returns the converted string.
                 * @example
                 *
                 * _.toString(null);
                 * // => ''
                 *
                 * _.toString(-0);
                 * // => '-0'
                 *
                 * _.toString([1, 2, 3]);
                 * // => '1,2,3'
                 */ function(value) {
                return null == value ? "" : baseToString(value);
            };
        /***/ },
        /* 237 */ /***/ function(module1, exports1, __webpack_require__) {
            var Symbol1 = __webpack_require__(27), arrayMap = __webpack_require__(238), isArray = __webpack_require__(15), isSymbol = __webpack_require__(42), INFINITY = 1 / 0, symbolProto = Symbol1 ? Symbol1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
            module1.exports = /**
                 * The base implementation of `_.toString` which doesn't convert nullish
                 * values to empty strings.
                 *
                 * @private
                 * @param {*} value The value to process.
                 * @returns {string} Returns the string.
                 */ function baseToString(value) {
                // Exit early for strings to avoid a performance hit in some environments.
                if ("string" == typeof value) return value;
                if (isArray(value)) // Recursively convert values (susceptible to call stack limits).
                return arrayMap(value, baseToString) + "";
                if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
                var result = value + "";
                return "0" == result && 1 / value == -INFINITY ? "-0" : result;
            };
        /***/ },
        /* 238 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * A specialized version of `_.map` for arrays without support for iteratee
                 * shorthands.
                 *
                 * @private
                 * @param {Array} [array] The array to iterate over.
                 * @param {Function} iteratee The function invoked per iteration.
                 * @returns {Array} Returns the new mapped array.
                 */ function(array, iteratee) {
                for(var index = -1, length = null == array ? 0 : array.length, result = Array(length); ++index < length;)result[index] = iteratee(array[index], index, array);
                return result;
            };
        /***/ },
        /* 239 */ /***/ function(module1, exports1, __webpack_require__) {
            var assignValue = __webpack_require__(55), castPath = __webpack_require__(32), isIndex = __webpack_require__(31), isObject = __webpack_require__(14), toKey = __webpack_require__(43);
            module1.exports = /**
                 * The base implementation of `_.set`.
                 *
                 * @private
                 * @param {Object} object The object to modify.
                 * @param {Array|string} path The path of the property to set.
                 * @param {*} value The value to set.
                 * @param {Function} [customizer] The function to customize path creation.
                 * @returns {Object} Returns `object`.
                 */ function(object, path, value, customizer) {
                if (!isObject(object)) return object;
                path = castPath(path, object);
                for(var index = -1, length = path.length, lastIndex = length - 1, nested = object; null != nested && ++index < length;){
                    var key = toKey(path[index]), newValue = value;
                    if ("__proto__" === key || "constructor" === key || "prototype" === key) break;
                    if (index != lastIndex) {
                        var objValue = nested[key];
                        void 0 === (newValue = customizer ? customizer(objValue, key, nested) : void 0) && (newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {});
                    }
                    assignValue(nested, key, newValue), nested = nested[key];
                }
                return object;
            };
        /***/ },
        /* 240 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseHasIn = __webpack_require__(241), hasPath = __webpack_require__(242);
            module1.exports = /**
                 * Checks if `path` is a direct or inherited property of `object`.
                 *
                 * @static
                 * @memberOf _
                 * @since 4.0.0
                 * @category Object
                 * @param {Object} object The object to query.
                 * @param {Array|string} path The path to check.
                 * @returns {boolean} Returns `true` if `path` exists, else `false`.
                 * @example
                 *
                 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
                 *
                 * _.hasIn(object, 'a');
                 * // => true
                 *
                 * _.hasIn(object, 'a.b');
                 * // => true
                 *
                 * _.hasIn(object, ['a', 'b']);
                 * // => true
                 *
                 * _.hasIn(object, 'b');
                 * // => false
                 */ function(object, path) {
                return null != object && hasPath(object, path, baseHasIn);
            };
        /***/ },
        /* 241 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * The base implementation of `_.hasIn` without support for deep paths.
                 *
                 * @private
                 * @param {Object} [object] The object to query.
                 * @param {Array|string} key The key to check.
                 * @returns {boolean} Returns `true` if `key` exists, else `false`.
                 */ function(object, key) {
                return null != object && key in Object(object);
            };
        /***/ },
        /* 242 */ /***/ function(module1, exports1, __webpack_require__) {
            var castPath = __webpack_require__(32), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), isIndex = __webpack_require__(31), isLength = __webpack_require__(40), toKey = __webpack_require__(43);
            module1.exports = /**
                 * Checks if `path` exists on `object`.
                 *
                 * @private
                 * @param {Object} object The object to query.
                 * @param {Array|string} path The path to check.
                 * @param {Function} hasFunc The function to check properties.
                 * @returns {boolean} Returns `true` if `path` exists, else `false`.
                 */ function(object, path, hasFunc) {
                path = castPath(path, object);
                for(var index = -1, length = path.length, result = !1; ++index < length;){
                    var key = toKey(path[index]);
                    if (!(result = null != object && hasFunc(object, key))) break;
                    object = object[key];
                }
                return result || ++index != length ? result : !!(length = null == object ? 0 : object.length) && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
            };
        /***/ },
        /* 243 */ /***/ function(module1, exports1, __webpack_require__) {
            var flatten = __webpack_require__(244), overRest = __webpack_require__(58), setToString = __webpack_require__(59);
            module1.exports = /**
                 * A specialized version of `baseRest` which flattens the rest array.
                 *
                 * @private
                 * @param {Function} func The function to apply a rest parameter to.
                 * @returns {Function} Returns the new function.
                 */ function(func) {
                return setToString(overRest(func, void 0, flatten), func + "");
            };
        /***/ },
        /* 244 */ /***/ function(module1, exports1, __webpack_require__) {
            var baseFlatten = __webpack_require__(245);
            module1.exports = /**
                 * Flattens `array` a single level deep.
                 *
                 * @static
                 * @memberOf _
                 * @since 0.1.0
                 * @category Array
                 * @param {Array} array The array to flatten.
                 * @returns {Array} Returns the new flattened array.
                 * @example
                 *
                 * _.flatten([1, [2, [3, [4]], 5]]);
                 * // => [1, 2, [3, [4]], 5]
                 */ function(array) {
                return (null == array ? 0 : array.length) ? baseFlatten(array, 1) : [];
            };
        /***/ },
        /* 245 */ /***/ function(module1, exports1, __webpack_require__) {
            var arrayPush = __webpack_require__(246), isFlattenable = __webpack_require__(247);
            module1.exports = /**
                 * The base implementation of `_.flatten` with support for restricting flattening.
                 *
                 * @private
                 * @param {Array} array The array to flatten.
                 * @param {number} depth The maximum recursion depth.
                 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
                 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
                 * @param {Array} [result=[]] The initial result value.
                 * @returns {Array} Returns the new flattened array.
                 */ function baseFlatten(array, depth, predicate, isStrict, result) {
                var index = -1, length = array.length;
                for(predicate || (predicate = isFlattenable), result || (result = []); ++index < length;){
                    var value = array[index];
                    depth > 0 && predicate(value) ? depth > 1 ? // Recursively flatten arrays (susceptible to call stack limits).
                    baseFlatten(value, depth - 1, predicate, isStrict, result) : arrayPush(result, value) : isStrict || (result[result.length] = value);
                }
                return result;
            };
        /***/ },
        /* 246 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Appends the elements of `values` to `array`.
                 *
                 * @private
                 * @param {Array} array The array to modify.
                 * @param {Array} values The values to append.
                 * @returns {Array} Returns `array`.
                 */ function(array, values) {
                for(var index = -1, length = values.length, offset = array.length; ++index < length;)array[offset + index] = values[index];
                return array;
            };
        /***/ },
        /* 247 */ /***/ function(module1, exports1, __webpack_require__) {
            var Symbol1 = __webpack_require__(27), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), spreadableSymbol = Symbol1 ? Symbol1.isConcatSpreadable : void 0;
            module1.exports = /**
                 * Checks if `value` is a flattenable `arguments` object or array.
                 *
                 * @private
                 * @param {*} value The value to check.
                 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
                 */ function(value) {
                return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
            };
        /***/ },
        /* 248 */ /***/ function(module1, exports1) {
            module1.exports = function(fn) {
                return -1 !== Function.toString.call(fn).indexOf("[native code]");
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 249 */ /***/ function(module1, exports1, __webpack_require__) {
            var setPrototypeOf = __webpack_require__(41), isNativeReflectConstruct = __webpack_require__(250);
            function _construct(Parent, args, Class) {
                return isNativeReflectConstruct() ? module1.exports = _construct = Reflect.construct : module1.exports = _construct = function(Parent, args, Class) {
                    var a = [
                        null
                    ];
                    a.push.apply(a, args);
                    var instance = new (Function.bind.apply(Parent, a))();
                    return Class && setPrototypeOf(instance, Class.prototype), instance;
                }, module1.exports.default = module1.exports, module1.exports.__esModule = !0, _construct.apply(null, arguments);
            }
            module1.exports = _construct, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 250 */ /***/ function(module1, exports1) {
            module1.exports = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                } catch (e) {
                    return !1;
                }
            }, module1.exports.default = module1.exports, module1.exports.__esModule = !0;
        /***/ },
        /* 251 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the determinant of a mat2
                 *
                 * @alias mat2.determinant
                 * @param {mat2} a the source matrix
                 * @returns {Number} determinant of a
                 */ function(a) {
                return a[0] * a[3] - a[2] * a[1];
            };
        /***/ },
        /* 252 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Transpose the values of a mat2
                 *
                 * @alias mat2.transpose
                 * @param {mat2} out the receiving matrix
                 * @param {mat2} a the source matrix
                 * @returns {mat2} out
                 */ function(out, a) {
                // If we are transposing ourselves we can skip a few steps but have to cache some values
                if (out === a) {
                    var a1 = a[1];
                    out[1] = a[2], out[2] = a1;
                } else out[0] = a[0], out[1] = a[2], out[2] = a[1], out[3] = a[3];
                return out;
            };
        /***/ },
        /* 253 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Multiplies two mat2's
                 *
                 * @alias mat2.multiply
                 * @param {mat2} out the receiving matrix
                 * @param {mat2} a the first operand
                 * @param {mat2} b the second operand
                 * @returns {mat2} out
                 */ function(out, a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
                return out[0] = a0 * b0 + a2 * b1, out[1] = a1 * b0 + a3 * b1, out[2] = a0 * b2 + a2 * b3, out[3] = a1 * b2 + a3 * b3, out;
            };
        /***/ },
        /* 254 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Set a mat2 to the identity matrix
                 *
                 * @alias mat2.identity
                 * @param {mat2} out the receiving matrix
                 * @returns {mat2} out
                 */ function(out) {
                return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 1, out;
            };
        /***/ },
        /* 255 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Calculates the adjugate of a mat2
                 *
                 * @alias mat2.adjoint
                 * @param {mat2} out the receiving matrix
                 * @param {mat2} a the source matrix
                 * @returns {mat2} out
                 */ function(out, a) {
                // Caching this value is nessecary if out == a
                var a0 = a[0];
                return out[0] = a[3], out[1] = -a[1], out[2] = -a[2], out[3] = a0, out;
            };
        /***/ },
        /* 256 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Rotates a mat2 by the given angle
                 *
                 * @alias mat2.rotate
                 * @param {mat2} out the receiving matrix
                 * @param {mat2} a the matrix to rotate
                 * @param {Number} rad the angle to rotate the matrix by
                 * @returns {mat2} out
                 */ function(out, a, rad) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], s = Math.sin(rad), c = Math.cos(rad);
                return out[0] = a0 * c + a2 * s, out[1] = a1 * c + a3 * s, out[2] = -(a0 * s) + a2 * c, out[3] = -(a1 * s) + a3 * c, out;
            };
        /***/ },
        /* 257 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Inverts a mat2
                 *
                 * @alias mat2.invert
                 * @param {mat2} out the receiving matrix
                 * @param {mat2} a the source matrix
                 * @returns {mat2} out
                 */ function(out, a) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], det = a0 * a3 - a2 * a1;
                return det ? (det = 1.0 / det, out[0] = a3 * det, out[1] = -a1 * det, out[2] = -a2 * det, out[3] = a0 * det, out) : null;
            };
        /***/ },
        /* 258 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Creates a new identity mat2
                 *
                 * @alias mat2.create
                 * @returns {mat2} a new 2x2 matrix
                 */ function() {
                var out = new Float32Array(4);
                return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 1, out;
            };
        /***/ },
        /* 259 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Scales the mat2 by the dimensions in the given vec2
                 *
                 * @alias mat2.scale
                 * @param {mat2} out the receiving matrix
                 * @param {mat2} a the matrix to rotate
                 * @param {vec2} v the vec2 to scale the matrix by
                 * @returns {mat2} out
                 **/ function(out, a, v) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], v0 = v[0], v1 = v[1];
                return out[0] = a0 * v0, out[1] = a1 * v0, out[2] = a2 * v1, out[3] = a3 * v1, out;
            };
        /***/ },
        /* 260 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Copy the values from one mat2 to another
                 *
                 * @alias mat2.copy
                 * @param {mat2} out the receiving matrix
                 * @param {mat2} a the source matrix
                 * @returns {mat2} out
                 */ function(out, a) {
                return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out;
            };
        /***/ },
        /* 261 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns Frobenius norm of a mat2
                 *
                 * @alias mat2.frob
                 * @param {mat2} a the matrix to calculate Frobenius norm of
                 * @returns {Number} Frobenius norm
                 */ function(a) {
                return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
            };
        /***/ },
        /* 262 */ /***/ function(module1, exports1) {
            module1.exports = /**
                 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
                 *
                 * @alias mat2.ldu
                 * @param {mat2} L the lower triangular matrix
                 * @param {mat2} D the diagonal matrix
                 * @param {mat2} U the upper triangular matrix
                 * @param {mat2} a the input matrix to factorize
                 */ function(L, D, U, a) {
                return L[2] = a[2] / a[0], U[0] = a[0], U[1] = a[1], U[3] = a[3] - L[2] * U[1], [
                    L,
                    D,
                    U
                ];
            };
        /***/ },
        /* 263 */ /***/ function(module1, __webpack_exports__, __webpack_require__) {
            "use strict";
            // ESM COMPAT FLAG
            __webpack_require__.r(__webpack_exports__), // EXPORTS
            __webpack_require__.d(__webpack_exports__, "BarcodeDecoder", function() {
                return /* reexport */ barcode_decoder;
            }), __webpack_require__.d(__webpack_exports__, "Readers", function() {
                return /* reexport */ reader_namespaceObject;
            }), __webpack_require__.d(__webpack_exports__, "CameraAccess", function() {
                return /* reexport */ camera_access;
            }), __webpack_require__.d(__webpack_exports__, "ImageDebug", function() {
                return /* reexport */ image_debug.a;
            }), __webpack_require__.d(__webpack_exports__, "ImageWrapper", function() {
                return /* reexport */ image_wrapper.a;
            }), __webpack_require__.d(__webpack_exports__, "ResultCollector", function() {
                return /* reexport */ result_collector;
            });
            // NAMESPACE OBJECT: ./src/reader/index.ts
            var BarcodeDirection, BarcodeDirection1, streamRef, reader_namespaceObject = {};
            __webpack_require__.r(reader_namespaceObject), __webpack_require__.d(reader_namespaceObject, "BarcodeReader", function() {
                return barcode_reader;
            }), __webpack_require__.d(reader_namespaceObject, "TwoOfFiveReader", function() {
                return _2of5_reader;
            }), __webpack_require__.d(reader_namespaceObject, "NewCodabarReader", function() {
                return codabar_reader;
            }), __webpack_require__.d(reader_namespaceObject, "Code128Reader", function() {
                return code_128_reader;
            }), __webpack_require__.d(reader_namespaceObject, "Code32Reader", function() {
                return code_32_reader;
            }), __webpack_require__.d(reader_namespaceObject, "Code39Reader", function() {
                return code_39_reader;
            }), __webpack_require__.d(reader_namespaceObject, "Code39VINReader", function() {
                return code_39_vin_reader;
            }), __webpack_require__.d(reader_namespaceObject, "Code93Reader", function() {
                return code_93_reader;
            }), __webpack_require__.d(reader_namespaceObject, "EAN2Reader", function() {
                return ean_2_reader;
            }), __webpack_require__.d(reader_namespaceObject, "EAN5Reader", function() {
                return ean_5_reader;
            }), __webpack_require__.d(reader_namespaceObject, "EAN8Reader", function() {
                return ean_8_reader;
            }), __webpack_require__.d(reader_namespaceObject, "EANReader", function() {
                return ean_reader;
            }), __webpack_require__.d(reader_namespaceObject, "I2of5Reader", function() {
                return i2of5_reader;
            }), __webpack_require__.d(reader_namespaceObject, "UPCEReader", function() {
                return upc_e_reader;
            }), __webpack_require__.d(reader_namespaceObject, "UPCReader", function() {
                return upc_reader;
            });
            // EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/typeof.js
            var helpers_typeof = __webpack_require__(19), typeof_default = /*#__PURE__*/ __webpack_require__.n(helpers_typeof), merge = __webpack_require__(16), merge_default = /*#__PURE__*/ __webpack_require__.n(merge);
            __webpack_require__(152);
            // EXTERNAL MODULE: ./src/common/image_wrapper.ts
            var image_wrapper = __webpack_require__(11), Bresenham = {}, Slope = {
                DIR: {
                    UP: 1,
                    DOWN: -1
                }
            };
            /**
                 * Scans a line of the given image from point p1 to p2 and returns a result object containing
                 * gray-scale values (0-255) of the underlying pixels in addition to the min
                 * and max values.
                 * @param {Object} imageWrapper
                 * @param {Object} p1 The start point {x,y}
                 * @param {Object} p2 The end point {x,y}
                 * @returns {line, min, max}
                 */ Bresenham.getBarcodeLine = function(imageWrapper, p1, p2) {
                /* eslint-disable no-bitwise */ var error, y, tmp, x, val, x0 = 0 | p1.x, y0 = 0 | p1.y, x1 = 0 | p2.x, y1 = 0 | p2.y, steep = Math.abs(y1 - y0) > Math.abs(x1 - x0), line = [], imageData = imageWrapper.data, width = imageWrapper.size.x, min = 255, max = 0;
                function read(a, b) {
                    min = (val = imageData[b * width + a]) < min ? val : min, max = val > max ? val : max, line.push(val);
                }
                steep && (tmp = x0, x0 = y0, y0 = tmp, tmp = x1, x1 = y1, y1 = tmp), x0 > x1 && (tmp = x0, x0 = x1, x1 = tmp, tmp = y0, y0 = y1, y1 = tmp);
                var deltaX = x1 - x0, deltaY = Math.abs(y1 - y0);
                error = deltaX / 2 | 0, y = y0;
                var yStep = y0 < y1 ? 1 : -1;
                for(x = x0; x < x1; x++)steep ? read(y, x) : read(x, y), (error -= deltaY) < 0 && (y += yStep, error += deltaX);
                return {
                    line: line,
                    min: min,
                    max: max
                };
            }, /**
                 * Converts the result from getBarcodeLine into a binary representation
                 * also considering the frequency and slope of the signal for more robust results
                 * @param {Object} result {line, min, max}
                 */ Bresenham.toBinaryLine = function(result) {
                var slope, slope2, currentDir, dir, i, j, min = result.min, max = result.max, line = result.line, center = min + (max - min) / 2, extrema = [], threshold = (max - min) / 12, rThreshold = -threshold;
                for(currentDir = line[0] > center ? Slope.DIR.UP : Slope.DIR.DOWN, extrema.push({
                    pos: 0,
                    val: line[0]
                }), i = 0; i < line.length - 2; i++)dir = (slope = line[i + 1] - line[i]) + (slope2 = line[i + 2] - line[i + 1]) < rThreshold && line[i + 1] < 1.5 * center ? Slope.DIR.DOWN : slope + slope2 > threshold && line[i + 1] > 0.5 * center ? Slope.DIR.UP : currentDir, currentDir !== dir && (extrema.push({
                    pos: i,
                    val: line[i]
                }), currentDir = dir);
                for(extrema.push({
                    pos: line.length,
                    val: line[line.length - 1]
                }), j = extrema[0].pos; j < extrema[1].pos; j++)line[j] = line[j] > center ? 0 : 1;
                 // iterate over extrema and convert to binary based on avg between minmax
                for(i = 1; i < extrema.length - 1; i++)for(threshold = extrema[i + 1].val > extrema[i].val ? extrema[i].val + (extrema[i + 1].val - extrema[i].val) / 3 * 2 | 0 : extrema[i + 1].val + (extrema[i].val - extrema[i + 1].val) / 3 | 0, j = extrema[i].pos; j < extrema[i + 1].pos; j++)line[j] = line[j] > threshold ? 0 : 1;
                return {
                    line: line,
                    threshold: threshold
                };
            }, /**
                 * Used for development only
                 */ Bresenham.debug = {
                printFrequency: function(line, canvas) {
                    var i, ctx = canvas.getContext("2d"); // eslint-disable-next-line no-param-reassign
                    for(canvas.width = line.length, canvas.height = 256, ctx.beginPath(), ctx.strokeStyle = "blue", i = 0; i < line.length; i++)ctx.moveTo(i, 255), ctx.lineTo(i, 255 - line[i]);
                    ctx.stroke(), ctx.closePath();
                },
                printPattern: function(line, canvas) {
                    var i, ctx = canvas.getContext("2d");
                    for(i = 0, canvas.width = line.length, ctx.fillColor = "black"; i < line.length; i++)1 === line[i] && ctx.fillRect(i, 0, 1, 100);
                }
            };
            // EXTERNAL MODULE: ./src/common/image_debug.ts
            var image_debug = __webpack_require__(9), classCallCheck = __webpack_require__(3), classCallCheck_default = /*#__PURE__*/ __webpack_require__.n(classCallCheck), createClass = __webpack_require__(4), createClass_default = /*#__PURE__*/ __webpack_require__.n(createClass), assertThisInitialized = __webpack_require__(1), assertThisInitialized_default = /*#__PURE__*/ __webpack_require__.n(assertThisInitialized), inherits = __webpack_require__(6), inherits_default = /*#__PURE__*/ __webpack_require__.n(inherits), possibleConstructorReturn = __webpack_require__(5), possibleConstructorReturn_default = /*#__PURE__*/ __webpack_require__.n(possibleConstructorReturn), getPrototypeOf = __webpack_require__(2), getPrototypeOf_default = /*#__PURE__*/ __webpack_require__.n(getPrototypeOf), defineProperty = __webpack_require__(0), defineProperty_default = /*#__PURE__*/ __webpack_require__.n(defineProperty), array_helper = __webpack_require__(10);
            (BarcodeDirection = BarcodeDirection1 || (BarcodeDirection1 = {}))[BarcodeDirection.Forward = 1] = "Forward", BarcodeDirection[BarcodeDirection.Reverse = -1] = "Reverse";
            /* harmony default export */ var barcode_reader = /*#__PURE__*/ function() {
                function BarcodeReader(config, supplements) {
                    return classCallCheck_default()(this, BarcodeReader), defineProperty_default()(this, "_row", []), defineProperty_default()(this, "config", {}), defineProperty_default()(this, "supplements", []), defineProperty_default()(this, "SINGLE_CODE_ERROR", 0), defineProperty_default()(this, "FORMAT", "unknown"), defineProperty_default()(this, "CONFIG_KEYS", {}), this._row = [], this.config = config || {}, supplements && (this.supplements = supplements), this;
                }
                return createClass_default()(BarcodeReader, [
                    {
                        key: "_nextUnset",
                        value: function(line) {
                            for(var start = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, i = start; i < line.length; i++)if (!line[i]) return i;
                            return line.length;
                        }
                    },
                    {
                        key: "_matchPattern",
                        value: function(counter, code, maxSingleError) {
                            var error = 0, singleError = 0, sum = 0, modulo = 0, barWidth = 0, scaled = 0;
                            maxSingleError = maxSingleError || this.SINGLE_CODE_ERROR || 1;
                            for(var i = 0; i < counter.length; i++)sum += counter[i], modulo += code[i];
                            if (sum < modulo) return Number.MAX_VALUE;
                            maxSingleError *= barWidth = sum / modulo;
                            for(var _i = 0; _i < counter.length; _i++){
                                if ((singleError = Math.abs(counter[_i] - (scaled = code[_i] * barWidth)) / scaled) > maxSingleError) return Number.MAX_VALUE;
                                error += singleError;
                            }
                            return error / modulo;
                        }
                    },
                    {
                        key: "_nextSet",
                        value: function(line) {
                            for(var offset = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, i = offset; i < line.length; i++)if (line[i]) return i;
                            return line.length;
                        }
                    },
                    {
                        key: "_correctBars",
                        value: function(counter, correction, indices) {
                            for(var length = indices.length, tmp = 0; length--;)(tmp = counter[indices[length]] * (1 - (1 - correction) / 2)) > 1 && (counter[indices[length]] = tmp);
                        }
                    },
                    {
                        key: "decodePattern",
                        value: function(pattern) {
                            // console.warn('* decodePattern', pattern);
                            this._row = pattern;
                            var result = this.decode(); // console.warn('* first result=', result);
                            return null === result ? (this._row.reverse(), (result = this.decode()) && (result.direction = BarcodeDirection1.Reverse, result.start = this._row.length - result.start, result.end = this._row.length - result.end)) : result.direction = BarcodeDirection1.Forward, result && (result.format = this.FORMAT), result;
                        }
                    },
                    {
                        key: "_matchRange",
                        value: function(start, end, value) {
                            var i;
                            for(i = start = start < 0 ? 0 : start; i < end; i++)if (this._row[i] !== value) return !1;
                            return !0;
                        }
                    },
                    {
                        key: "_fillCounters",
                        value: function() {
                            var offset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._nextUnset(this._row), end = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this._row.length, isWhite = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2], counters = [], counterPos = 0;
                            counters[0] = 0;
                            for(var i = offset; i < end; i++)this._row[i] ^ (isWhite ? 1 : 0) ? counters[counterPos]++ : (counters[++counterPos] = 1, isWhite = !isWhite);
                            return counters;
                        }
                    },
                    {
                        key: "_toCounters",
                        value: function(start, counters) {
                            var numCounters = counters.length, end = this._row.length, isWhite = !this._row[start], counterPos = 0;
                            array_helper.a.init(counters, 0);
                            for(var i = start; i < end; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counters[counterPos]++;
                            else {
                                if (++counterPos === numCounters) break;
                                counters[counterPos] = 1, isWhite = !isWhite;
                            }
                            return counters;
                        }
                    }
                ], [
                    {
                        key: "Exception",
                        get: function() {
                            return {
                                StartNotFoundException: "Start-Info was not found!",
                                CodeNotFoundException: "Code could not be found!",
                                PatternNotFoundException: "Pattern could not be found!"
                            };
                        }
                    }
                ]), BarcodeReader;
            }(), code_128_reader = /*#__PURE__*/ function(_BarcodeReader) {
                inherits_default()(Code128Reader, _BarcodeReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Code128Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function Code128Reader() {
                    var _this;
                    classCallCheck_default()(this, Code128Reader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "CODE_SHIFT", 98), defineProperty_default()(assertThisInitialized_default()(_this), "CODE_C", 99), defineProperty_default()(assertThisInitialized_default()(_this), "CODE_B", 100), defineProperty_default()(assertThisInitialized_default()(_this), "CODE_A", 101), defineProperty_default()(assertThisInitialized_default()(_this), "START_CODE_A", 103), defineProperty_default()(assertThisInitialized_default()(_this), "START_CODE_B", 104), defineProperty_default()(assertThisInitialized_default()(_this), "START_CODE_C", 105), defineProperty_default()(assertThisInitialized_default()(_this), "STOP_CODE", 106), defineProperty_default()(assertThisInitialized_default()(_this), "CODE_PATTERN", [
                        [
                            2,
                            1,
                            2,
                            2,
                            2,
                            2
                        ],
                        [
                            2,
                            2,
                            2,
                            1,
                            2,
                            2
                        ],
                        [
                            2,
                            2,
                            2,
                            2,
                            2,
                            1
                        ],
                        [
                            1,
                            2,
                            1,
                            2,
                            2,
                            3
                        ],
                        [
                            1,
                            2,
                            1,
                            3,
                            2,
                            2
                        ],
                        [
                            1,
                            3,
                            1,
                            2,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            2,
                            1,
                            3
                        ],
                        [
                            1,
                            2,
                            2,
                            3,
                            1,
                            2
                        ],
                        [
                            1,
                            3,
                            2,
                            2,
                            1,
                            2
                        ],
                        [
                            2,
                            2,
                            1,
                            2,
                            1,
                            3
                        ],
                        [
                            2,
                            2,
                            1,
                            3,
                            1,
                            2
                        ],
                        [
                            2,
                            3,
                            1,
                            2,
                            1,
                            2
                        ],
                        [
                            1,
                            1,
                            2,
                            2,
                            3,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            1,
                            3,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            2,
                            3,
                            1
                        ],
                        [
                            1,
                            1,
                            3,
                            2,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            3,
                            1,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            3,
                            2,
                            2,
                            1
                        ],
                        [
                            2,
                            2,
                            3,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            2,
                            1,
                            1,
                            3,
                            2
                        ],
                        [
                            2,
                            2,
                            1,
                            2,
                            3,
                            1
                        ],
                        [
                            2,
                            1,
                            3,
                            2,
                            1,
                            2
                        ],
                        [
                            2,
                            2,
                            3,
                            1,
                            1,
                            2
                        ],
                        [
                            3,
                            1,
                            2,
                            1,
                            3,
                            1
                        ],
                        [
                            3,
                            1,
                            1,
                            2,
                            2,
                            2
                        ],
                        [
                            3,
                            2,
                            1,
                            1,
                            2,
                            2
                        ],
                        [
                            3,
                            2,
                            1,
                            2,
                            2,
                            1
                        ],
                        [
                            3,
                            1,
                            2,
                            2,
                            1,
                            2
                        ],
                        [
                            3,
                            2,
                            2,
                            1,
                            1,
                            2
                        ],
                        [
                            3,
                            2,
                            2,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            2,
                            1,
                            2,
                            3
                        ],
                        [
                            2,
                            1,
                            2,
                            3,
                            2,
                            1
                        ],
                        [
                            2,
                            3,
                            2,
                            1,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            3,
                            2,
                            3
                        ],
                        [
                            1,
                            3,
                            1,
                            1,
                            2,
                            3
                        ],
                        [
                            1,
                            3,
                            1,
                            3,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            2,
                            3,
                            1,
                            3
                        ],
                        [
                            1,
                            3,
                            2,
                            1,
                            1,
                            3
                        ],
                        [
                            1,
                            3,
                            2,
                            3,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            1,
                            3,
                            1,
                            3
                        ],
                        [
                            2,
                            3,
                            1,
                            1,
                            1,
                            3
                        ],
                        [
                            2,
                            3,
                            1,
                            3,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            2,
                            1,
                            3,
                            3
                        ],
                        [
                            1,
                            1,
                            2,
                            3,
                            3,
                            1
                        ],
                        [
                            1,
                            3,
                            2,
                            1,
                            3,
                            1
                        ],
                        [
                            1,
                            1,
                            3,
                            1,
                            2,
                            3
                        ],
                        [
                            1,
                            1,
                            3,
                            3,
                            2,
                            1
                        ],
                        [
                            1,
                            3,
                            3,
                            1,
                            2,
                            1
                        ],
                        [
                            3,
                            1,
                            3,
                            1,
                            2,
                            1
                        ],
                        [
                            2,
                            1,
                            1,
                            3,
                            3,
                            1
                        ],
                        [
                            2,
                            3,
                            1,
                            1,
                            3,
                            1
                        ],
                        [
                            2,
                            1,
                            3,
                            1,
                            1,
                            3
                        ],
                        [
                            2,
                            1,
                            3,
                            3,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            3,
                            1,
                            3,
                            1
                        ],
                        [
                            3,
                            1,
                            1,
                            1,
                            2,
                            3
                        ],
                        [
                            3,
                            1,
                            1,
                            3,
                            2,
                            1
                        ],
                        [
                            3,
                            3,
                            1,
                            1,
                            2,
                            1
                        ],
                        [
                            3,
                            1,
                            2,
                            1,
                            1,
                            3
                        ],
                        [
                            3,
                            1,
                            2,
                            3,
                            1,
                            1
                        ],
                        [
                            3,
                            3,
                            2,
                            1,
                            1,
                            1
                        ],
                        [
                            3,
                            1,
                            4,
                            1,
                            1,
                            1
                        ],
                        [
                            2,
                            2,
                            1,
                            4,
                            1,
                            1
                        ],
                        [
                            4,
                            3,
                            1,
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            2,
                            2,
                            4
                        ],
                        [
                            1,
                            1,
                            1,
                            4,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            1,
                            1,
                            2,
                            4
                        ],
                        [
                            1,
                            2,
                            1,
                            4,
                            2,
                            1
                        ],
                        [
                            1,
                            4,
                            1,
                            1,
                            2,
                            2
                        ],
                        [
                            1,
                            4,
                            1,
                            2,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            2,
                            2,
                            1,
                            4
                        ],
                        [
                            1,
                            1,
                            2,
                            4,
                            1,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            1,
                            1,
                            4
                        ],
                        [
                            1,
                            2,
                            2,
                            4,
                            1,
                            1
                        ],
                        [
                            1,
                            4,
                            2,
                            1,
                            1,
                            2
                        ],
                        [
                            1,
                            4,
                            2,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            4,
                            1,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            2,
                            1,
                            1,
                            1,
                            4
                        ],
                        [
                            4,
                            1,
                            3,
                            1,
                            1,
                            1
                        ],
                        [
                            2,
                            4,
                            1,
                            1,
                            1,
                            2
                        ],
                        [
                            1,
                            3,
                            4,
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            2,
                            4,
                            2
                        ],
                        [
                            1,
                            2,
                            1,
                            1,
                            4,
                            2
                        ],
                        [
                            1,
                            2,
                            1,
                            2,
                            4,
                            1
                        ],
                        [
                            1,
                            1,
                            4,
                            2,
                            1,
                            2
                        ],
                        [
                            1,
                            2,
                            4,
                            1,
                            1,
                            2
                        ],
                        [
                            1,
                            2,
                            4,
                            2,
                            1,
                            1
                        ],
                        [
                            4,
                            1,
                            1,
                            2,
                            1,
                            2
                        ],
                        [
                            4,
                            2,
                            1,
                            1,
                            1,
                            2
                        ],
                        [
                            4,
                            2,
                            1,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            2,
                            1,
                            4,
                            1
                        ],
                        [
                            2,
                            1,
                            4,
                            1,
                            2,
                            1
                        ],
                        [
                            4,
                            1,
                            2,
                            1,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            1,
                            4,
                            3
                        ],
                        [
                            1,
                            1,
                            1,
                            3,
                            4,
                            1
                        ],
                        [
                            1,
                            3,
                            1,
                            1,
                            4,
                            1
                        ],
                        [
                            1,
                            1,
                            4,
                            1,
                            1,
                            3
                        ],
                        [
                            1,
                            1,
                            4,
                            3,
                            1,
                            1
                        ],
                        [
                            4,
                            1,
                            1,
                            1,
                            1,
                            3
                        ],
                        [
                            4,
                            1,
                            1,
                            3,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            3,
                            1,
                            4,
                            1
                        ],
                        [
                            1,
                            1,
                            4,
                            1,
                            3,
                            1
                        ],
                        [
                            3,
                            1,
                            1,
                            1,
                            4,
                            1
                        ],
                        [
                            4,
                            1,
                            1,
                            1,
                            3,
                            1
                        ],
                        [
                            2,
                            1,
                            1,
                            4,
                            1,
                            2
                        ],
                        [
                            2,
                            1,
                            1,
                            2,
                            1,
                            4
                        ],
                        [
                            2,
                            1,
                            1,
                            2,
                            3,
                            2
                        ],
                        [
                            2,
                            3,
                            3,
                            1,
                            1,
                            1,
                            2
                        ]
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "SINGLE_CODE_ERROR", 0.64), defineProperty_default()(assertThisInitialized_default()(_this), "AVG_CODE_ERROR", 0.3), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "code_128"), defineProperty_default()(assertThisInitialized_default()(_this), "MODULE_INDICES", {
                        bar: [
                            0,
                            2,
                            4
                        ],
                        space: [
                            1,
                            3,
                            5
                        ]
                    }), _this;
                }
                return createClass_default()(Code128Reader, [
                    {
                        key: "_decodeCode",
                        value: function(start, correction) {
                            for(var bestMatch = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: start,
                                end: start,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            }, counter = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ], isWhite = !this._row[start], counterPos = 0, i = start; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    correction && this._correct(counter, correction);
                                    for(var code = 0; code < this.CODE_PATTERN.length; code++){
                                        var error = this._matchPattern(counter, this.CODE_PATTERN[code]);
                                        error < bestMatch.error && (bestMatch.code = code, bestMatch.error = error);
                                    }
                                    if (bestMatch.end = i, -1 === bestMatch.code || bestMatch.error > this.AVG_CODE_ERROR) return null;
                                    return this.CODE_PATTERN[bestMatch.code] && (bestMatch.correction.bar = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.bar), bestMatch.correction.space = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.space)), bestMatch;
                                }
                                counter[++counterPos] = 1, isWhite = !isWhite;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_correct",
                        value: function(counter, correction) {
                            this._correctBars(counter, correction.bar, this.MODULE_INDICES.bar), this._correctBars(counter, correction.space, this.MODULE_INDICES.space);
                        }
                    },
                    {
                        key: "_findStart",
                        // TODO: _findStart and decodeCode share similar code, can we re-use some?
                        value: function() {
                            for(var counter = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ], offset = this._nextSet(this._row), bestMatch = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            }, isWhite = !1, counterPos = 0, i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    for(var sum = counter.reduce(function(prev, next) {
                                        return prev + next;
                                    }, 0), code = this.START_CODE_A; code <= this.START_CODE_C; code++){
                                        var error = this._matchPattern(counter, this.CODE_PATTERN[code]);
                                        error < bestMatch.error && (bestMatch.code = code, bestMatch.error = error);
                                    }
                                    if (bestMatch.error < this.AVG_CODE_ERROR) return bestMatch.start = i - sum, bestMatch.end = i, bestMatch.correction.bar = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.bar), bestMatch.correction.space = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.space), bestMatch;
                                    for(var j = 0; j < 4; j++)counter[j] = counter[j + 2];
                                    counter[4] = 0, counter[5] = 0, counterPos--;
                                } else counterPos++;
                                counter[counterPos] = 1, isWhite = !isWhite;
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            var _this2 = this, startInfo = this._findStart();
                            if (null === startInfo) return null;
                             // var self = this,
                            //     done = false,
                            //     result = [],
                            //     multiplier = 0,
                            //     checksum = 0,
                            //     codeset,
                            //     rawResult = [],
                            //     decodedCodes = [],
                            //     shiftNext = false,
                            //     unshift,
                            //     removeLastCharacter = true;
                            var code = {
                                code: startInfo.code,
                                start: startInfo.start,
                                end: startInfo.end,
                                correction: {
                                    bar: startInfo.correction.bar,
                                    space: startInfo.correction.space
                                }
                            }, decodedCodes = [];
                            decodedCodes.push(code);
                            for(var checksum = code.code, codeset = function(c) {
                                switch(c){
                                    case _this2.START_CODE_A:
                                        return _this2.CODE_A;
                                    case _this2.START_CODE_B:
                                        return _this2.CODE_B;
                                    case _this2.START_CODE_C:
                                        return _this2.CODE_C;
                                    default:
                                        return null;
                                }
                            }(code.code), done = !1, shiftNext = !1, unshift = !1, removeLastCharacter = !0, multiplier = 0, rawResult = [], result = []; !done;){
                                if (unshift = shiftNext, shiftNext = !1, null !== (code = this._decodeCode(code.end, code.correction))) switch(code.code !== this.STOP_CODE && (removeLastCharacter = !0), code.code !== this.STOP_CODE && (rawResult.push(code.code), checksum += ++multiplier * code.code), decodedCodes.push(code), codeset){
                                    case this.CODE_A:
                                        if (code.code < 64) result.push(String.fromCharCode(32 + code.code));
                                        else if (code.code < 96) result.push(String.fromCharCode(code.code - 64));
                                        else switch(code.code !== this.STOP_CODE && (removeLastCharacter = !1), code.code){
                                            case this.CODE_SHIFT:
                                                shiftNext = !0, codeset = this.CODE_B;
                                                break;
                                            case this.CODE_B:
                                                codeset = this.CODE_B;
                                                break;
                                            case this.CODE_C:
                                                codeset = this.CODE_C;
                                                break;
                                            case this.STOP_CODE:
                                                done = !0;
                                        }
                                        break;
                                    case this.CODE_B:
                                        if (code.code < 96) result.push(String.fromCharCode(32 + code.code));
                                        else switch(code.code !== this.STOP_CODE && (removeLastCharacter = !1), code.code){
                                            case this.CODE_SHIFT:
                                                shiftNext = !0, codeset = this.CODE_A;
                                                break;
                                            case this.CODE_A:
                                                codeset = this.CODE_A;
                                                break;
                                            case this.CODE_C:
                                                codeset = this.CODE_C;
                                                break;
                                            case this.STOP_CODE:
                                                done = !0;
                                        }
                                        break;
                                    case this.CODE_C:
                                        if (code.code < 100) result.push(code.code < 10 ? "0" + code.code : code.code);
                                        else switch(code.code !== this.STOP_CODE && (removeLastCharacter = !1), code.code){
                                            case this.CODE_A:
                                                codeset = this.CODE_A;
                                                break;
                                            case this.CODE_B:
                                                codeset = this.CODE_B;
                                                break;
                                            case this.STOP_CODE:
                                                done = !0;
                                        }
                                }
                                else done = !0;
                                unshift && (codeset = codeset === this.CODE_A ? this.CODE_B : this.CODE_A);
                            }
                            return null === code ? null : (code.end = this._nextUnset(this._row, code.end), this._verifyTrailingWhitespace(code) && (checksum -= multiplier * rawResult[rawResult.length - 1]) % 103 === rawResult[rawResult.length - 1] && result.length) ? (removeLastCharacter && result.splice(result.length - 1, 1), {
                                code: result.join(""),
                                start: startInfo.start,
                                end: code.end,
                                codeset: codeset,
                                startInfo: startInfo,
                                decodedCodes: decodedCodes,
                                endInfo: code,
                                format: this.FORMAT
                            }) : null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function(endInfo) {
                            var trailingWhitespaceEnd;
                            return (trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2) < this._row.length && this._matchRange(endInfo.end, trailingWhitespaceEnd, 0) ? endInfo : null;
                        }
                    },
                    {
                        key: "calculateCorrection",
                        value: function(expected, normalized, indices) {
                            for(var length = indices.length, sumNormalized = 0, sumExpected = 0; length--;)sumExpected += expected[indices[length]], sumNormalized += normalized[indices[length]];
                            return sumExpected / sumNormalized;
                        }
                    }
                ]), Code128Reader;
            }(barcode_reader);
            // CONCATENATED MODULE: ./src/reader/ean_reader.ts
            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    enumerableOnly && (symbols = symbols.filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                    })), keys.push.apply(keys, symbols);
                }
                return keys;
            }
            function _objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
                        defineProperty_default()(target, key, source[key]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
                return target;
            }
            var START_PATTERN = [
                1,
                1,
                1
            ], MIDDLE_PATTERN = [
                1,
                1,
                1,
                1,
                1
            ], EXTENSION_START_PATTERN = [
                1,
                1,
                2
            ], CODE_PATTERN = [
                [
                    3,
                    2,
                    1,
                    1
                ],
                [
                    2,
                    2,
                    2,
                    1
                ],
                [
                    2,
                    1,
                    2,
                    2
                ],
                [
                    1,
                    4,
                    1,
                    1
                ],
                [
                    1,
                    1,
                    3,
                    2
                ],
                [
                    1,
                    2,
                    3,
                    1
                ],
                [
                    1,
                    1,
                    1,
                    4
                ],
                [
                    1,
                    3,
                    1,
                    2
                ],
                [
                    1,
                    2,
                    1,
                    3
                ],
                [
                    3,
                    1,
                    1,
                    2
                ],
                [
                    1,
                    1,
                    2,
                    3
                ],
                [
                    1,
                    2,
                    2,
                    2
                ],
                [
                    2,
                    2,
                    1,
                    2
                ],
                [
                    1,
                    1,
                    4,
                    1
                ],
                [
                    2,
                    3,
                    1,
                    1
                ],
                [
                    1,
                    3,
                    2,
                    1
                ],
                [
                    4,
                    1,
                    1,
                    1
                ],
                [
                    2,
                    1,
                    3,
                    1
                ],
                [
                    3,
                    1,
                    2,
                    1
                ],
                [
                    2,
                    1,
                    1,
                    3
                ]
            ], CODE_FREQUENCY = [
                0,
                11,
                13,
                14,
                19,
                25,
                28,
                21,
                22,
                26
            ], ean_reader = /*#__PURE__*/ function(_BarcodeReader) {
                inherits_default()(EANReader, _BarcodeReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(EANReader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                // TODO: does this need to be in the class?
                function EANReader(config, supplements) {
                    var _this;
                    return classCallCheck_default()(this, EANReader), _this = _super.call(this, merge_default()({
                        supplements: []
                    }, config), supplements), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "ean_13"), defineProperty_default()(assertThisInitialized_default()(_this), "SINGLE_CODE_ERROR", 0.7), defineProperty_default()(assertThisInitialized_default()(_this), "STOP_PATTERN", [
                        1,
                        1,
                        1
                    ]), _this;
                }
                return createClass_default()(EANReader, [
                    {
                        key: "_findPattern",
                        value: function(pattern, offset, isWhite, tryHarder) {
                            var counter = Array(pattern.length).fill(0), bestMatch = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            }, counterPos = 0;
                            offset || (offset = this._nextSet(this._row));
                            for(var found = !1, i = offset; i < this._row.length; i++)// console.warn(`* loop i=${offset} len=${this._row.length} isWhite=${isWhite} counterPos=${counterPos}`);
                            if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos] += 1;
                            else {
                                if (counterPos === counter.length - 1) {
                                    var error = this._matchPattern(counter, pattern); // console.warn('* matchPattern', error, counter, pattern);
                                    if (error < 0.48 && bestMatch.error && error < bestMatch.error) return found = !0, bestMatch.error = error, bestMatch.start = i - counter.reduce(function(sum, value) {
                                        return sum + value;
                                    }, 0), bestMatch.end = i, bestMatch;
                                    if (tryHarder) {
                                        for(var j = 0; j < counter.length - 2; j++)counter[j] = counter[j + 2];
                                        counter[counter.length - 2] = 0, counter[counter.length - 1] = 0, counterPos--;
                                    }
                                } else counterPos++;
                                counter[counterPos] = 1, isWhite = !isWhite;
                            }
                            return found ? bestMatch : null;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function(start, coderange) {
                            // console.warn('* decodeCode', start, coderange);
                            var counter = [
                                0,
                                0,
                                0,
                                0
                            ], bestMatch = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: start,
                                end: start
                            }, isWhite = !this._row[start], counterPos = 0;
                            coderange || // console.warn('* decodeCode before length');
                            (coderange = CODE_PATTERN.length);
                            for(var i = start; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    for(var code = 0; code < coderange; code++){
                                        var error = this._matchPattern(counter, CODE_PATTERN[code]);
                                        bestMatch.end = i, error < bestMatch.error && (bestMatch.code = code, bestMatch.error = error);
                                    }
                                    if (bestMatch.error > 0.48) // console.warn('* return null');
                                    return null;
                                     // console.warn('* return bestMatch', JSON.stringify(bestMatch));
                                    return bestMatch;
                                }
                                counter[++counterPos] = 1, isWhite = !isWhite;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function() {
                            for(// console.warn('* findStart');
                            var offset = this._nextSet(this._row), startInfo = null; !startInfo && (startInfo = this._findPattern(START_PATTERN, offset, !1, !0));){
                                var leadingWhitespaceStart = startInfo.start - (startInfo.end - startInfo.start);
                                if (leadingWhitespaceStart >= 0 && this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) // console.warn('* returning startInfo');
                                return startInfo;
                                offset = startInfo.end, startInfo = null;
                            } // console.warn('* returning null');
                            return null;
                        }
                    },
                    {
                        key: "_calculateFirstDigit",
                        value: function(codeFrequency) {
                            // console.warn('* calculateFirstDigit', codeFrequency);
                            for(var i = 0; i < CODE_FREQUENCY.length; i++)if (codeFrequency === CODE_FREQUENCY[i]) // console.warn('* returning', i);
                            return i;
                             // console.warn('* return null');
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function(inCode, result, decodedCodes) {
                            for(var outCode = _objectSpread({}, inCode), codeFrequency = 0x0, i = 0; i < 6; i++){
                                if (!(outCode = this._decodeCode(outCode.end))) // console.warn('* return null');
                                return null;
                                outCode.code >= 10 ? (outCode.code -= 10, codeFrequency |= 1 << 5 - i) : codeFrequency |= 0 << 5 - i, result.push(outCode.code), decodedCodes.push(outCode);
                            }
                            // console.warn('* decodePayload', inCode, result, decodedCodes);
                            var firstDigit = this._calculateFirstDigit(codeFrequency);
                            if (null === firstDigit) // console.warn('* return null');
                            return null;
                            result.unshift(firstDigit);
                            var middlePattern = this._findPattern(MIDDLE_PATTERN, outCode.end, !0, !1); // console.warn('* findPattern=', JSON.stringify(middlePattern));
                            if (null === middlePattern || !middlePattern.end) // console.warn('* return null');
                            return null;
                            decodedCodes.push(middlePattern);
                            for(var _i = 0; _i < 6; _i++){
                                if (!(middlePattern = this._decodeCode(middlePattern.end, 10))) // console.warn('* return null');
                                return null;
                                decodedCodes.push(middlePattern), result.push(middlePattern.code);
                            } // console.warn('* end code=', JSON.stringify(middlePattern));
                            // console.warn('* end result=', JSON.stringify(result));
                            // console.warn('* end decodedCodes=', decodedCodes);
                            return middlePattern;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function(endInfo) {
                            // console.warn('* verifyTrailingWhitespace', JSON.stringify(endInfo));
                            var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start);
                            return trailingWhitespaceEnd < this._row.length && this._matchRange(endInfo.end, trailingWhitespaceEnd, 0) ? endInfo : null // console.warn('* return null');
                            ;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function(offset, isWhite) {
                            // console.warn('* findEnd', offset, isWhite);
                            var endInfo = this._findPattern(this.STOP_PATTERN, offset, isWhite, !1);
                            return null !== endInfo ? this._verifyTrailingWhitespace(endInfo) : null;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function(result) {
                            for(var sum = 0, i = result.length - 2; i >= 0; i -= 2)sum += result[i];
                            sum *= 3;
                            for(var _i2 = result.length - 1; _i2 >= 0; _i2 -= 2)sum += result[_i2];
                             // console.warn('* end checksum', sum % 10 === 0);
                            return sum % 10 == 0;
                        }
                    },
                    {
                        key: "_decodeExtensions",
                        value: function(offset) {
                            var start = this._nextSet(this._row, offset), startInfo = this._findPattern(EXTENSION_START_PATTERN, start, !1, !1);
                            if (null === startInfo) return null;
                             // console.warn('* decodeExtensions', this.supplements);
                            // console.warn('* there are ', this.supplements.length, ' supplements');
                            for(var i = 0; i < this.supplements.length; i++)// console.warn('* extensions loop', i, this.supplements[i], this.supplements[i]._decode);
                            try {
                                var result = this.supplements[i].decode(this._row, startInfo.end); // console.warn('* decode result=', result);
                                if (null !== result) return {
                                    code: result.code,
                                    start: start,
                                    startInfo: startInfo,
                                    end: result.end,
                                    decodedCodes: result.decodedCodes,
                                    format: this.supplements[i].FORMAT
                                };
                            } catch (err) {
                                console.error("* decodeExtensions error in ", this.supplements[i], ": ", err);
                            }
                             // console.warn('* end decodeExtensions');
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            // console.warn('* decode', row);
                            // console.warn('* decode', start);
                            var result = [], decodedCodes = [], resultInfo = {}, startInfo = this._findStart();
                            if (!startInfo) return null;
                            var code = {
                                start: startInfo.start,
                                end: startInfo.end
                            };
                            if (decodedCodes.push(code), !(code = this._decodePayload(code, result, decodedCodes)) || !(code = this._findEnd(code.end, !1)) || (decodedCodes.push(code), !this._checksum(result))) return null;
                            if (this.supplements.length > 0) {
                                var supplement = this._decodeExtensions(code.end); // console.warn('* decodeExtensions returns', supplement);
                                if (!supplement || !supplement.decodedCodes) return null;
                                var lastCode = supplement.decodedCodes[supplement.decodedCodes.length - 1], endInfo = {
                                    start: lastCode.start + ((lastCode.end - lastCode.start) / 2 | 0),
                                    end: lastCode.end
                                };
                                if (!this._verifyTrailingWhitespace(endInfo)) return null;
                                resultInfo = {
                                    supplement: supplement,
                                    code: result.join("") + supplement.code
                                };
                            }
                            return _objectSpread(_objectSpread({
                                code: result.join(""),
                                start: startInfo.start,
                                end: code.end,
                                startInfo: startInfo,
                                decodedCodes: decodedCodes
                            }, resultInfo), {}, {
                                format: this.FORMAT
                            });
                        }
                    }
                ]), EANReader;
            }(barcode_reader), toConsumableArray = __webpack_require__(33), toConsumableArray_default = /*#__PURE__*/ __webpack_require__.n(toConsumableArray), ALPHABET = new Uint16Array(toConsumableArray_default()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%").map(function(_char) {
                return _char.charCodeAt(0);
            })), CHARACTER_ENCODINGS = new Uint16Array([
                0x034,
                0x121,
                0x061,
                0x160,
                0x031,
                0x130,
                0x070,
                0x025,
                0x124,
                0x064,
                0x109,
                0x049,
                0x148,
                0x019,
                0x118,
                0x058,
                0x00d,
                0x10c,
                0x04c,
                0x01c,
                0x103,
                0x043,
                0x142,
                0x013,
                0x112,
                0x052,
                0x007,
                0x106,
                0x046,
                0x016,
                0x181,
                0x0c1,
                0x1c0,
                0x091,
                0x190,
                0x0d0,
                0x085,
                0x184,
                0x0c4,
                0x094,
                0x0a8,
                0x0a2,
                0x08a,
                0x02a
            ]), code_39_reader = /*#__PURE__*/ function(_BarcodeReader) {
                inherits_default()(Code39Reader, _BarcodeReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Code39Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function Code39Reader() {
                    var _this;
                    classCallCheck_default()(this, Code39Reader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "code_39"), _this;
                }
                return createClass_default()(Code39Reader, [
                    {
                        key: "_findStart",
                        value: function() {
                            for(var offset = this._nextSet(this._row), patternStart = offset, counter = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]), counterPos = 0, isWhite = !1, i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    // find start pattern
                                    if (0x094 === this._toPattern(counter)) {
                                        var whiteSpaceMustStart = Math.floor(Math.max(0, patternStart - (i - patternStart) / 4));
                                        if (this._matchRange(whiteSpaceMustStart, patternStart, 0)) return {
                                            start: patternStart,
                                            end: i
                                        };
                                    }
                                    patternStart += counter[0] + counter[1];
                                    for(var j = 0; j < 7; j++)counter[j] = counter[j + 2];
                                    counter[7] = 0, counter[8] = 0, counterPos--;
                                } else counterPos++;
                                counter[counterPos] = 1, isWhite = !isWhite;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function(counters) {
                            for(var numCounters = counters.length, maxNarrowWidth = 0, numWideBars = numCounters, wideBarWidth = 0; numWideBars > 3;){
                                maxNarrowWidth = this._findNextWidth(counters, maxNarrowWidth), numWideBars = 0;
                                for(var pattern = 0, i = 0; i < numCounters; i++)counters[i] > maxNarrowWidth && (pattern |= 1 << numCounters - 1 - i, numWideBars++, wideBarWidth += counters[i]);
                                if (3 === numWideBars) {
                                    for(var _i = 0; _i < numCounters && numWideBars > 0; _i++)if (counters[_i] > maxNarrowWidth && (numWideBars--, 2 * counters[_i] >= wideBarWidth)) return -1;
                                    return pattern;
                                }
                            }
                            return -1;
                        }
                    },
                    {
                        key: "_findNextWidth",
                        value: function(counters, current) {
                            for(var minWidth = Number.MAX_VALUE, i = 0; i < counters.length; i++)counters[i] < minWidth && counters[i] > current && (minWidth = counters[i]);
                            return minWidth;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function(pattern) {
                            for(var i = 0; i < CHARACTER_ENCODINGS.length; i++)if (CHARACTER_ENCODINGS[i] === pattern) return String.fromCharCode(ALPHABET[i]);
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function(lastStart, nextStart, counters) {
                            var patternSize = array_helper.a.sum(counters);
                            return 3 * (nextStart - lastStart - patternSize) >= patternSize;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            var decodedChar, lastStart, counters = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]), result = [];
                            if (!(start = this._findStart())) return null;
                            var nextStart = this._nextSet(this._row, start.end);
                            do {
                                counters = this._toCounters(nextStart, counters);
                                var pattern = this._toPattern(counters);
                                if (pattern < 0 || null === (decodedChar = this._patternToChar(pattern))) return null;
                                result.push(decodedChar), lastStart = nextStart, nextStart += array_helper.a.sum(counters), nextStart = this._nextSet(this._row, nextStart);
                            }while ("*" !== decodedChar)
                            return (result.pop(), result.length && this._verifyTrailingWhitespace(lastStart, nextStart, counters)) ? {
                                code: result.join(""),
                                start: start.start,
                                end: nextStart,
                                startInfo: start,
                                decodedCodes: result,
                                format: this.FORMAT
                            } : null;
                        }
                    }
                ]), Code39Reader;
            }(barcode_reader), get = __webpack_require__(13), get_default = /*#__PURE__*/ __webpack_require__.n(get), patterns_IOQ = /[IOQ]/g, patterns_AZ09 = /[A-Z0-9]{17}/, code_39_vin_reader = /*#__PURE__*/ function(_Code39Reader) {
                inherits_default()(Code39VINReader, _Code39Reader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Code39VINReader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function Code39VINReader() {
                    var _this;
                    classCallCheck_default()(this, Code39VINReader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "code_39_vin"), _this;
                }
                return createClass_default()(Code39VINReader, [
                    {
                        key: "_checkChecksum",
                        // TODO (this was todo in original repo, no text was there. sorry.)
                        value: function(code) {
                            return !!code;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            var result = get_default()(getPrototypeOf_default()(Code39VINReader.prototype), "decode", this).call(this, row, start);
                            if (!result) return null;
                            var code = result.code;
                            return code ? (code = code.replace(patterns_IOQ, "")).match(patterns_AZ09) ? this._checkChecksum(code) ? (result.code = code, result) : null : (console.log("Failed AZ09 pattern code:", code), null) : null;
                        }
                    }
                ]), Code39VINReader;
            }(code_39_reader), codabar_reader_ALPHABET = [
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                45,
                36,
                58,
                47,
                46,
                43,
                65,
                66,
                67,
                68
            ], codabar_reader_CHARACTER_ENCODINGS = [
                0x003,
                0x006,
                0x009,
                0x060,
                0x012,
                0x042,
                0x021,
                0x024,
                0x030,
                0x048,
                0x00c,
                0x018,
                0x045,
                0x051,
                0x054,
                0x015,
                0x01a,
                0x029,
                0x00b,
                0x00e
            ], START_END = [
                0x01a,
                0x029,
                0x00b,
                0x00e
            ], codabar_reader = /*#__PURE__*/ function(_BarcodeReader) {
                inherits_default()(NewCodabarReader, _BarcodeReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(NewCodabarReader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function NewCodabarReader() {
                    var _this;
                    classCallCheck_default()(this, NewCodabarReader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "_counters", []), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "codabar"), _this;
                }
                return createClass_default()(NewCodabarReader, [
                    {
                        key: "_computeAlternatingThreshold",
                        value: function(offset, end) {
                            for(var min = Number.MAX_VALUE, max = 0, counter = 0, i = offset; i < end; i += 2)(counter = this._counters[i]) > max && (max = counter), counter < min && (min = counter);
                            return (min + max) / 2.0 | 0;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function(offset) {
                            var end = offset + 7;
                            if (end > this._counters.length) return -1;
                            for(var barThreshold = this._computeAlternatingThreshold(offset, end), spaceThreshold = this._computeAlternatingThreshold(offset + 1, end), bitmask = 64, threshold = 0, pattern = 0, i = 0; i < 7; i++)threshold = (1 & i) == 0 ? barThreshold : spaceThreshold, this._counters[offset + i] > threshold && (pattern |= bitmask), bitmask >>= 1;
                            return pattern;
                        }
                    },
                    {
                        key: "_isStartEnd",
                        value: function(pattern) {
                            for(var i = 0; i < START_END.length; i++)if (START_END[i] === pattern) return !0;
                            return !1;
                        }
                    },
                    {
                        key: "_sumCounters",
                        value: function(start, end) {
                            for(var sum = 0, i = start; i < end; i++)sum += this._counters[i];
                            return sum;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function() {
                            for(var start = this._nextUnset(this._row), end = start, i = 1; i < this._counters.length; i++){
                                var pattern = this._toPattern(i);
                                if (-1 !== pattern && this._isStartEnd(pattern)) return(// TODO: Look for whitespace ahead
                                start += this._sumCounters(0, i), end = start + this._sumCounters(i, i + 8), {
                                    start: start,
                                    end: end,
                                    startCounter: i,
                                    endCounter: i + 8
                                });
                            }
                            return null;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function(pattern) {
                            for(var i = 0; i < codabar_reader_CHARACTER_ENCODINGS.length; i++)if (codabar_reader_CHARACTER_ENCODINGS[i] === pattern) return String.fromCharCode(codabar_reader_ALPHABET[i]);
                            return null;
                        }
                    },
                    {
                        key: "_calculatePatternLength",
                        value: function(offset) {
                            for(var sum = 0, i = offset; i < offset + 7; i++)sum += this._counters[i];
                            return sum;
                        }
                    },
                    {
                        key: "_verifyWhitespace",
                        value: function(startCounter, endCounter) {
                            return !!((startCounter - 1 <= 0 || this._counters[startCounter - 1] >= this._calculatePatternLength(startCounter) / 2.0) && (endCounter + 8 >= this._counters.length || this._counters[endCounter + 7] >= this._calculatePatternLength(endCounter) / 2.0));
                        }
                    },
                    {
                        key: "_charToPattern",
                        value: function(_char) {
                            for(var charCode = _char.charCodeAt(0), i = 0; i < codabar_reader_ALPHABET.length; i++)if (codabar_reader_ALPHABET[i] === charCode) return codabar_reader_CHARACTER_ENCODINGS[i];
                            return 0x0;
                        }
                    },
                    {
                        key: "_thresholdResultPattern",
                        value: function(result, startCounter) {
                            for(var pattern, categorization = {
                                space: {
                                    narrow: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    },
                                    wide: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    }
                                },
                                bar: {
                                    narrow: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    },
                                    wide: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    }
                                }
                            }, pos = startCounter, i = 0; i < result.length; i++){
                                pattern = this._charToPattern(result[i]);
                                for(var j = 6; j >= 0; j--){
                                    var kind = (1 & j) == 2 ? categorization.bar : categorization.space, cat = (1 & pattern) == 1 ? kind.wide : kind.narrow;
                                    cat.size += this._counters[pos + j], cat.counts++, pattern >>= 1;
                                }
                                pos += 8;
                            }
                            return [
                                "space",
                                "bar"
                            ].forEach(function(key) {
                                var newkind = categorization[key];
                                newkind.wide.min = Math.floor((newkind.narrow.size / newkind.narrow.counts + newkind.wide.size / newkind.wide.counts) / 2), newkind.narrow.max = Math.ceil(newkind.wide.min), newkind.wide.max = Math.ceil((2.0 * newkind.wide.size + 1.5) / newkind.wide.counts);
                            }), categorization;
                        }
                    },
                    {
                        key: "_validateResult",
                        value: function(result, startCounter) {
                            for(var pattern, thresholds = this._thresholdResultPattern(result, startCounter), pos = startCounter, i = 0; i < result.length; i++){
                                pattern = this._charToPattern(result[i]);
                                for(var j = 6; j >= 0; j--){
                                    var kind = (1 & j) == 0 ? thresholds.bar : thresholds.space, cat = (1 & pattern) == 1 ? kind.wide : kind.narrow, size = this._counters[pos + j];
                                    if (size < cat.min || size > cat.max) return !1;
                                    pattern >>= 1;
                                }
                                pos += 8;
                            }
                            return !0;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            if (this._counters = this._fillCounters(), !(start = this._findStart())) return null;
                            var pattern, nextStart = start.startCounter, result = [];
                            do {
                                if ((pattern = this._toPattern(nextStart)) < 0) return null;
                                var decodedChar = this._patternToChar(pattern);
                                if (null === decodedChar) return null;
                                if (result.push(decodedChar), nextStart += 8, result.length > 1 && this._isStartEnd(pattern)) break;
                            }while (nextStart < this._counters.length) // verify end
                            if (result.length - 2 < 4 || !this._isStartEnd(pattern) || !this._verifyWhitespace(start.startCounter, nextStart - 8) || !this._validateResult(result, start.startCounter)) return null;
                             // verify end white space
                            nextStart = nextStart > this._counters.length ? this._counters.length : nextStart;
                            var end = start.start + this._sumCounters(start.startCounter, nextStart - 8);
                            return {
                                code: result.join(""),
                                start: start.start,
                                end: end,
                                startInfo: start,
                                decodedCodes: result,
                                format: this.FORMAT
                            };
                        }
                    }
                ]), NewCodabarReader;
            }(barcode_reader), upc_reader = /*#__PURE__*/ function(_EANReader) {
                inherits_default()(UPCReader, _EANReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(UPCReader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function UPCReader() {
                    var _this;
                    classCallCheck_default()(this, UPCReader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "upc_a"), _this;
                }
                return createClass_default()(UPCReader, [
                    {
                        key: "decode",
                        value: function(row, start) {
                            var result = ean_reader.prototype.decode.call(this);
                            return result && result.code && 13 === result.code.length && "0" === result.code.charAt(0) ? (result.code = result.code.substring(1), result) : null;
                        }
                    }
                ]), UPCReader;
            }(ean_reader), ean_8_reader = /*#__PURE__*/ function(_EANReader) {
                inherits_default()(EAN8Reader, _EANReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(EAN8Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function EAN8Reader() {
                    var _this;
                    classCallCheck_default()(this, EAN8Reader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "ean_8"), _this;
                }
                return createClass_default()(EAN8Reader, [
                    {
                        key: "_decodePayload",
                        value: function(inCode, result, decodedCodes) {
                            for(var code = inCode, i = 0; i < 4; i++){
                                if (!(code = this._decodeCode(code.end, 10))) return null;
                                result.push(code.code), decodedCodes.push(code);
                            }
                            if (null === (code = this._findPattern(MIDDLE_PATTERN, code.end, !0, !1))) return null;
                            decodedCodes.push(code);
                            for(var _i = 0; _i < 4; _i++){
                                if (!(code = this._decodeCode(code.end, 10))) return null;
                                decodedCodes.push(code), result.push(code.code);
                            }
                            return code;
                        }
                    }
                ]), EAN8Reader;
            }(ean_reader), ean_2_reader = /*#__PURE__*/ function(_EANReader) {
                inherits_default()(EAN2Reader, _EANReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(EAN2Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function EAN2Reader() {
                    var _this;
                    classCallCheck_default()(this, EAN2Reader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "ean_2"), _this;
                }
                return createClass_default()(EAN2Reader, [
                    {
                        key: "decode",
                        value: function(row, start) {
                            row && (this._row = row);
                            var codeFrequency = 0, offset = start, end = this._row.length, result = [], decodedCodes = [], code = null;
                            if (void 0 === offset) return null;
                            for(var i = 0; i < 2 && offset < end; i++){
                                if (!(code = this._decodeCode(offset))) return null;
                                decodedCodes.push(code), result.push(code.code % 10), code.code >= 10 && (codeFrequency |= 1 << 1 - i), 1 !== i && (offset = this._nextSet(this._row, code.end), offset = this._nextUnset(this._row, offset));
                            }
                            if (2 !== result.length || parseInt(result.join("")) % 4 !== codeFrequency) return null;
                            var startInfo = this._findStart();
                            return {
                                code: result.join(""),
                                decodedCodes: decodedCodes,
                                end: code.end,
                                format: this.FORMAT,
                                startInfo: startInfo,
                                start: startInfo.start
                            };
                        }
                    }
                ]), EAN2Reader;
            }(ean_reader), CHECK_DIGIT_ENCODINGS = [
                24,
                20,
                18,
                17,
                12,
                6,
                3,
                10,
                9,
                5
            ], ean_5_reader = /*#__PURE__*/ function(_EANReader) {
                inherits_default()(EAN5Reader, _EANReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(EAN5Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function EAN5Reader() {
                    var _this;
                    classCallCheck_default()(this, EAN5Reader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "ean_5"), _this;
                }
                return createClass_default()(EAN5Reader, [
                    {
                        key: "decode",
                        value: function(row, start) {
                            if (void 0 === start) return null;
                            row && (this._row = row);
                            for(var codeFrequency = 0, offset = start, end = this._row.length, code = null, result = [], decodedCodes = [], i = 0; i < 5 && offset < end; i++){
                                if (!(code = this._decodeCode(offset))) return null;
                                decodedCodes.push(code), result.push(code.code % 10), code.code >= 10 && (codeFrequency |= 1 << 4 - i), 4 !== i && (offset = this._nextSet(this._row, code.end), offset = this._nextUnset(this._row, offset));
                            }
                            if (5 !== result.length || function(result) {
                                for(var length = result.length, sum = 0, i = length - 2; i >= 0; i -= 2)sum += result[i];
                                sum *= 3;
                                for(var _i = length - 1; _i >= 0; _i -= 2)sum += result[_i];
                                return (sum *= 3) % 10;
                            }(result) !== function(codeFrequency) {
                                for(var i = 0; i < 10; i++)if (codeFrequency === CHECK_DIGIT_ENCODINGS[i]) return i;
                                return null;
                            }(codeFrequency)) return null;
                            var startInfo = this._findStart();
                            return {
                                code: result.join(""),
                                decodedCodes: decodedCodes,
                                end: code.end,
                                format: this.FORMAT,
                                startInfo: startInfo,
                                start: startInfo.start
                            };
                        }
                    }
                ]), EAN5Reader;
            }(ean_reader);
            // CONCATENATED MODULE: ./src/reader/upc_e_reader.ts
            function upc_e_reader_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    enumerableOnly && (symbols = symbols.filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                    })), keys.push.apply(keys, symbols);
                }
                return keys;
            }
            /* harmony default export */ var upc_e_reader = /*#__PURE__*/ function(_EANReader) {
                inherits_default()(UPCEReader, _EANReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(UPCEReader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function UPCEReader() {
                    var _this;
                    classCallCheck_default()(this, UPCEReader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "CODE_FREQUENCY", [
                        [
                            56,
                            52,
                            50,
                            49,
                            44,
                            38,
                            35,
                            42,
                            41,
                            37
                        ],
                        [
                            7,
                            11,
                            13,
                            14,
                            19,
                            25,
                            28,
                            21,
                            22,
                            26
                        ]
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "STOP_PATTERN", [
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "upc_e"), _this;
                }
                return createClass_default()(UPCEReader, [
                    {
                        key: "_decodePayload",
                        value: function(inCode, result, decodedCodes) {
                            for(var outCode = function(target) {
                                for(var i = 1; i < arguments.length; i++){
                                    var source = null != arguments[i] ? arguments[i] : {};
                                    i % 2 ? upc_e_reader_ownKeys(Object(source), !0).forEach(function(key) {
                                        defineProperty_default()(target, key, source[key]);
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : upc_e_reader_ownKeys(Object(source)).forEach(function(key) {
                                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                                    });
                                }
                                return target;
                            }({}, inCode), codeFrequency = 0x0, i = 0; i < 6; i++){
                                if (!(outCode = this._decodeCode(outCode.end))) return null;
                                outCode.code >= 10 && (outCode.code = outCode.code - 10, codeFrequency |= 1 << 5 - i), result.push(outCode.code), decodedCodes.push(outCode);
                            }
                            return this._determineParity(codeFrequency, result) ? outCode : null;
                        }
                    },
                    {
                        key: "_determineParity",
                        value: function(codeFrequency, result) {
                            for(var nrSystem = 0; nrSystem < this.CODE_FREQUENCY.length; nrSystem++)for(var i = 0; i < this.CODE_FREQUENCY[nrSystem].length; i++)if (codeFrequency === this.CODE_FREQUENCY[nrSystem][i]) return result.unshift(nrSystem), result.push(i), !0;
                            return !1;
                        }
                    },
                    {
                        key: "_convertToUPCA",
                        value: function(result) {
                            var upca = [
                                result[0]
                            ], lastDigit = result[result.length - 2];
                            return (upca = lastDigit <= 2 ? upca.concat(result.slice(1, 3)).concat([
                                lastDigit,
                                0,
                                0,
                                0,
                                0
                            ]).concat(result.slice(3, 6)) : 3 === lastDigit ? upca.concat(result.slice(1, 4)).concat([
                                0,
                                0,
                                0,
                                0,
                                0
                            ]).concat(result.slice(4, 6)) : 4 === lastDigit ? upca.concat(result.slice(1, 5)).concat([
                                0,
                                0,
                                0,
                                0,
                                0,
                                result[5]
                            ]) : upca.concat(result.slice(1, 6)).concat([
                                0,
                                0,
                                0,
                                0,
                                lastDigit
                            ])).push(result[result.length - 1]), upca;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function(result) {
                            return get_default()(getPrototypeOf_default()(UPCEReader.prototype), "_checksum", this).call(this, this._convertToUPCA(result));
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function(offset, isWhite) {
                            return get_default()(getPrototypeOf_default()(UPCEReader.prototype), "_findEnd", this).call(this, offset, !0);
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function(endInfo) {
                            var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2;
                            return trailingWhitespaceEnd < this._row.length && this._matchRange(endInfo.end, trailingWhitespaceEnd, 0) ? endInfo : null;
                        }
                    }
                ]), UPCEReader;
            }(ean_reader), i2of5_reader = /*#__PURE__*/ function(_BarcodeReader) {
                inherits_default()(I2of5Reader, _BarcodeReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(I2of5Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function I2of5Reader(opts) {
                    var _this;
                    return classCallCheck_default()(this, I2of5Reader), _this = _super.call(this, merge_default()({
                        normalizeBarSpaceWidth: !1
                    }, opts)), defineProperty_default()(assertThisInitialized_default()(_this), "barSpaceRatio", [
                        1,
                        1
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "SINGLE_CODE_ERROR", 0.78), defineProperty_default()(assertThisInitialized_default()(_this), "AVG_CODE_ERROR", 0.38), defineProperty_default()(assertThisInitialized_default()(_this), "START_PATTERN", [
                        1,
                        1,
                        1,
                        1
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "STOP_PATTERN", [
                        1,
                        1,
                        3
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "CODE_PATTERN", [
                        [
                            1,
                            1,
                            3,
                            3,
                            1
                        ],
                        [
                            3,
                            1,
                            1,
                            1,
                            3
                        ],
                        [
                            1,
                            3,
                            1,
                            1,
                            3
                        ],
                        [
                            3,
                            3,
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            3,
                            1,
                            3
                        ],
                        [
                            3,
                            1,
                            3,
                            1,
                            1
                        ],
                        [
                            1,
                            3,
                            3,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            3,
                            3
                        ],
                        [
                            3,
                            1,
                            1,
                            3,
                            1
                        ],
                        [
                            1,
                            3,
                            1,
                            3,
                            1
                        ]
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "MAX_CORRECTION_FACTOR", 5), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "i2of5"), opts.normalizeBarSpaceWidth && (_this.SINGLE_CODE_ERROR = 0.38, _this.AVG_CODE_ERROR = 0.09), _this.config = opts, possibleConstructorReturn_default()(_this, assertThisInitialized_default()(_this));
                }
                return createClass_default()(I2of5Reader, [
                    {
                        key: "_matchPattern",
                        value: function(counter, code) {
                            if (this.config.normalizeBarSpaceWidth) {
                                for(var counterSum = [
                                    0,
                                    0
                                ], codeSum = [
                                    0,
                                    0
                                ], correction = [
                                    0,
                                    0
                                ], correctionRatio = this.MAX_CORRECTION_FACTOR, correctionRatioInverse = 1 / correctionRatio, i = 0; i < counter.length; i++)counterSum[i % 2] += counter[i], codeSum[i % 2] += code[i];
                                correction[0] = codeSum[0] / counterSum[0], correction[1] = codeSum[1] / counterSum[1], correction[0] = Math.max(Math.min(correction[0], correctionRatio), correctionRatioInverse), correction[1] = Math.max(Math.min(correction[1], correctionRatio), correctionRatioInverse), this.barSpaceRatio = correction;
                                for(var _i = 0; _i < counter.length; _i++)counter[_i] *= this.barSpaceRatio[_i % 2];
                            }
                            return get_default()(getPrototypeOf_default()(I2of5Reader.prototype), "_matchPattern", this).call(this, counter, code);
                        }
                    },
                    {
                        key: "_findPattern",
                        value: function(pattern, offset) {
                            var isWhite = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], tryHarder = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], counter = Array(pattern.length).fill(0), counterPos = 0, bestMatch = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            }, epsilon = this.AVG_CODE_ERROR;
                            isWhite = isWhite || !1, tryHarder = tryHarder || !1, offset || (offset = this._nextSet(this._row));
                            for(var i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    var sum = counter.reduce(function(prev, next) {
                                        return prev + next;
                                    }, 0), error = this._matchPattern(counter, pattern);
                                    if (error < epsilon) return bestMatch.error = error, bestMatch.start = i - sum, bestMatch.end = i, bestMatch;
                                    if (!tryHarder) return null;
                                    for(var j = 0; j < counter.length - 2; j++)counter[j] = counter[j + 2];
                                    counter[counter.length - 2] = 0, counter[counter.length - 1] = 0, counterPos--;
                                } else counterPos++;
                                counter[counterPos] = 1, isWhite = !isWhite;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function() {
                            for(var leadingWhitespaceStart = 0, offset = this._nextSet(this._row), startInfo = null, narrowBarWidth = 1; !startInfo && (startInfo = this._findPattern(this.START_PATTERN, offset, !1, !0));){
                                if (narrowBarWidth = Math.floor((startInfo.end - startInfo.start) / 4), (leadingWhitespaceStart = startInfo.start - 10 * narrowBarWidth) >= 0 && this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) return startInfo;
                                offset = startInfo.end, startInfo = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function(endInfo) {
                            var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2;
                            return trailingWhitespaceEnd < this._row.length && this._matchRange(endInfo.end, trailingWhitespaceEnd, 0) ? endInfo : null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function() {
                            this._row.reverse();
                            var endInfo = this._findPattern(this.STOP_PATTERN);
                            if (this._row.reverse(), null === endInfo) return null;
                             // reverse numbers
                            var tmp = endInfo.start;
                            return endInfo.start = this._row.length - endInfo.end, endInfo.end = this._row.length - tmp, null !== endInfo ? this._verifyTrailingWhitespace(endInfo) : null;
                        }
                    },
                    {
                        key: "_decodePair",
                        value: function(counterPair) {
                            for(var codes = [], i = 0; i < counterPair.length; i++){
                                var code = this._decodeCode(counterPair[i]);
                                if (!code) return null;
                                codes.push(code);
                            }
                            return codes;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function(counter) {
                            for(var epsilon = this.AVG_CODE_ERROR, bestMatch = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            }, code = 0; code < this.CODE_PATTERN.length; code++){
                                var error = this._matchPattern(counter, this.CODE_PATTERN[code]);
                                error < bestMatch.error && (bestMatch.code = code, bestMatch.error = error);
                            }
                            return bestMatch.error < epsilon ? bestMatch : null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function(counters, result, decodedCodes) {
                            for(var pos = 0, counterLength = counters.length, counterPair = [
                                [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]
                            ], codes = null; pos < counterLength;){
                                for(var i = 0; i < 5; i++)counterPair[0][i] = counters[pos] * this.barSpaceRatio[0], counterPair[1][i] = counters[pos + 1] * this.barSpaceRatio[1], pos += 2;
                                if (!(codes = this._decodePair(counterPair))) return null;
                                for(var _i2 = 0; _i2 < codes.length; _i2++)result.push(codes[_i2].code + ""), decodedCodes.push(codes[_i2]);
                            }
                            return codes;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function(counters) {
                            return counters.length % 10 == 0;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            var result = [], decodedCodes = [], startInfo = this._findStart();
                            if (!startInfo) return null;
                            decodedCodes.push(startInfo);
                            var endInfo = this._findEnd();
                            if (!endInfo) return null;
                            var counters = this._fillCounters(startInfo.end, endInfo.start, !1);
                            return this._verifyCounterLength(counters) && this._decodePayload(counters, result, decodedCodes) && result.length % 2 == 0 && !(result.length < 6) ? (decodedCodes.push(endInfo), {
                                code: result.join(""),
                                start: startInfo.start,
                                end: endInfo.end,
                                startInfo: startInfo,
                                decodedCodes: decodedCodes,
                                format: this.FORMAT
                            }) : null;
                        }
                    }
                ]), I2of5Reader;
            }(barcode_reader), _2of5_reader_START_PATTERN = [
                3,
                1,
                3,
                1,
                1,
                1
            ], STOP_PATTERN = [
                3,
                1,
                1,
                1,
                3
            ], _2of5_reader_CODE_PATTERN = [
                [
                    1,
                    1,
                    3,
                    3,
                    1
                ],
                [
                    3,
                    1,
                    1,
                    1,
                    3
                ],
                [
                    1,
                    3,
                    1,
                    1,
                    3
                ],
                [
                    3,
                    3,
                    1,
                    1,
                    1
                ],
                [
                    1,
                    1,
                    3,
                    1,
                    3
                ],
                [
                    3,
                    1,
                    3,
                    1,
                    1
                ],
                [
                    1,
                    3,
                    3,
                    1,
                    1
                ],
                [
                    1,
                    1,
                    1,
                    3,
                    3
                ],
                [
                    3,
                    1,
                    1,
                    3,
                    1
                ],
                [
                    1,
                    3,
                    1,
                    3,
                    1
                ]
            ], START_PATTERN_LENGTH = _2of5_reader_START_PATTERN.reduce(function(sum, val) {
                return sum + val;
            }, 0), _2of5_reader = /*#__PURE__*/ function(_BarcodeReader) {
                inherits_default()(TwoOfFiveReader, _BarcodeReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(TwoOfFiveReader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function TwoOfFiveReader() {
                    var _this;
                    classCallCheck_default()(this, TwoOfFiveReader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "barSpaceRatio", [
                        1,
                        1
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "2of5"), defineProperty_default()(assertThisInitialized_default()(_this), "SINGLE_CODE_ERROR", 0.78), defineProperty_default()(assertThisInitialized_default()(_this), "AVG_CODE_ERROR", 0.3), _this;
                }
                return createClass_default()(TwoOfFiveReader, [
                    {
                        key: "_findPattern",
                        value: function(pattern, offset) {
                            var isWhite = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], tryHarder = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], counter = [], counterPos = 0, bestMatch = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            }, sum = 0, error = 0, epsilon = this.AVG_CODE_ERROR;
                            offset || (offset = this._nextSet(this._row));
                            for(var i = 0; i < pattern.length; i++)counter[i] = 0;
                            for(var _i = offset; _i < this._row.length; _i++)if (this._row[_i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    sum = 0;
                                    for(var j = 0; j < counter.length; j++)sum += counter[j];
                                    if ((error = this._matchPattern(counter, pattern)) < epsilon) return bestMatch.error = error, bestMatch.start = _i - sum, bestMatch.end = _i, bestMatch;
                                    if (!tryHarder) return null;
                                    for(var _j = 0; _j < counter.length - 2; _j++)counter[_j] = counter[_j + 2];
                                    counter[counter.length - 2] = 0, counter[counter.length - 1] = 0, counterPos--;
                                } else counterPos++;
                                counter[counterPos] = 1, isWhite = !isWhite;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function() {
                            for(var startInfo = null, offset = this._nextSet(this._row), narrowBarWidth = 1, leadingWhitespaceStart = 0; !startInfo;){
                                if (!(startInfo = this._findPattern(_2of5_reader_START_PATTERN, offset, !1, !0))) return null;
                                if (narrowBarWidth = Math.floor((startInfo.end - startInfo.start) / START_PATTERN_LENGTH), (leadingWhitespaceStart = startInfo.start - 5 * narrowBarWidth) >= 0 && this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) break;
                                offset = startInfo.end, startInfo = null;
                            }
                            return startInfo;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function(endInfo) {
                            var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2;
                            return trailingWhitespaceEnd < this._row.length && this._matchRange(endInfo.end, trailingWhitespaceEnd, 0) ? endInfo : null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function() {
                            // TODO: reverse, followed by some calcs, followed by another reverse? really?
                            this._row.reverse();
                            var offset = this._nextSet(this._row), endInfo = this._findPattern(STOP_PATTERN, offset, !1, !0);
                            if (this._row.reverse(), null === endInfo) return null;
                             // reverse numbers
                            var tmp = endInfo.start;
                            return endInfo.start = this._row.length - endInfo.end, endInfo.end = this._row.length - tmp, null !== endInfo ? this._verifyTrailingWhitespace(endInfo) : null;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function(counters) {
                            return counters.length % 10 == 0;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function(counter) {
                            for(var epsilon = this.AVG_CODE_ERROR, bestMatch = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            }, code = 0; code < _2of5_reader_CODE_PATTERN.length; code++){
                                var error = this._matchPattern(counter, _2of5_reader_CODE_PATTERN[code]);
                                error < bestMatch.error && (bestMatch.code = code, bestMatch.error = error);
                            }
                            return bestMatch.error < epsilon ? bestMatch : null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function(counters, result, decodedCodes) {
                            for(var pos = 0, counterLength = counters.length, counter = [
                                0,
                                0,
                                0,
                                0,
                                0
                            ], code = null; pos < counterLength;){
                                for(var i = 0; i < 5; i++)counter[i] = counters[pos] * this.barSpaceRatio[0], pos += 2;
                                if (!(code = this._decodeCode(counter))) return null;
                                result.push("".concat(code.code)), decodedCodes.push(code);
                            }
                            return code;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            var startInfo = this._findStart();
                            if (!startInfo) return null;
                            var endInfo = this._findEnd();
                            if (!endInfo) return null;
                            var counters = this._fillCounters(startInfo.end, endInfo.start, !1);
                            if (!this._verifyCounterLength(counters)) return null;
                            var decodedCodes = [];
                            decodedCodes.push(startInfo);
                            var result = [];
                            return !this._decodePayload(counters, result, decodedCodes) || result.length < 5 ? null : (decodedCodes.push(endInfo), {
                                code: result.join(""),
                                start: startInfo.start,
                                end: endInfo.end,
                                startInfo: startInfo,
                                decodedCodes: decodedCodes,
                                format: this.FORMAT
                            });
                        }
                    }
                ]), TwoOfFiveReader;
            }(barcode_reader), code_93_reader_ALPHABET = new Uint16Array(toConsumableArray_default()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*").map(function(_char) {
                return _char.charCodeAt(0);
            })), code_93_reader_CHARACTER_ENCODINGS = new Uint16Array([
                0x114,
                0x148,
                0x144,
                0x142,
                0x128,
                0x124,
                0x122,
                0x150,
                0x112,
                0x10a,
                0x1a8,
                0x1a4,
                0x1a2,
                0x194,
                0x192,
                0x18a,
                0x168,
                0x164,
                0x162,
                0x134,
                0x11a,
                0x158,
                0x14c,
                0x146,
                0x12c,
                0x116,
                0x1b4,
                0x1b2,
                0x1ac,
                0x1a6,
                0x196,
                0x19a,
                0x16c,
                0x166,
                0x136,
                0x13a,
                0x12e,
                0x1d4,
                0x1d2,
                0x1ca,
                0x16e,
                0x176,
                0x1ae,
                0x126,
                0x1da,
                0x1d6,
                0x132,
                0x15e
            ]), code_93_reader = /*#__PURE__*/ function(_BarcodeReader) {
                inherits_default()(Code93Reader, _BarcodeReader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Code93Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function Code93Reader() {
                    var _this;
                    classCallCheck_default()(this, Code93Reader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "code_93"), _this;
                }
                return createClass_default()(Code93Reader, [
                    {
                        key: "_patternToChar",
                        value: function(pattern) {
                            for(var i = 0; i < code_93_reader_CHARACTER_ENCODINGS.length; i++)if (code_93_reader_CHARACTER_ENCODINGS[i] === pattern) return String.fromCharCode(code_93_reader_ALPHABET[i]);
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function(counters) {
                            for(var numCounters = counters.length, sum = counters.reduce(function(prev, next) {
                                return prev + next;
                            }, 0), pattern = 0, i = 0; i < numCounters; i++){
                                var normalized = Math.round(9 * counters[i] / sum);
                                if (normalized < 1 || normalized > 4) return -1;
                                if ((1 & i) == 0) for(var j = 0; j < normalized; j++)pattern = pattern << 1 | 1;
                                else pattern <<= normalized;
                            }
                            return pattern;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function() {
                            for(var offset = this._nextSet(this._row), patternStart = offset, counter = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]), counterPos = 0, isWhite = !1, i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    // find start pattern
                                    if (0x15e === this._toPattern(counter)) {
                                        var whiteSpaceMustStart = Math.floor(Math.max(0, patternStart - (i - patternStart) / 4));
                                        if (this._matchRange(whiteSpaceMustStart, patternStart, 0)) return {
                                            start: patternStart,
                                            end: i
                                        };
                                    }
                                    patternStart += counter[0] + counter[1];
                                    for(var j = 0; j < 4; j++)counter[j] = counter[j + 2];
                                    counter[4] = 0, counter[5] = 0, counterPos--;
                                } else counterPos++;
                                counter[counterPos] = 1, isWhite = !isWhite;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyEnd",
                        value: function(lastStart, nextStart) {
                            return lastStart !== nextStart && !!this._row[nextStart];
                        }
                    },
                    {
                        key: "_decodeExtended",
                        value: function(charArray) {
                            for(var length = charArray.length, result = [], i = 0; i < length; i++){
                                var _char2 = charArray[i];
                                if (_char2 >= "a" && _char2 <= "d") {
                                    if (i > length - 2) return null;
                                    var nextChar = charArray[++i], nextCharCode = nextChar.charCodeAt(0), decodedChar = void 0;
                                    switch(_char2){
                                        case "a":
                                            if (!(nextChar >= "A") || !(nextChar <= "Z")) return null;
                                            decodedChar = String.fromCharCode(nextCharCode - 64);
                                            break;
                                        case "b":
                                            if (nextChar >= "A" && nextChar <= "E") decodedChar = String.fromCharCode(nextCharCode - 38);
                                            else if (nextChar >= "F" && nextChar <= "J") decodedChar = String.fromCharCode(nextCharCode - 11);
                                            else if (nextChar >= "K" && nextChar <= "O") decodedChar = String.fromCharCode(nextCharCode + 16);
                                            else if (nextChar >= "P" && nextChar <= "S") decodedChar = String.fromCharCode(nextCharCode + 43);
                                            else {
                                                if (!(nextChar >= "T") || !(nextChar <= "Z")) return null;
                                                decodedChar = "";
                                            }
                                            break;
                                        case "c":
                                            if (nextChar >= "A" && nextChar <= "O") decodedChar = String.fromCharCode(nextCharCode - 32);
                                            else {
                                                if ("Z" !== nextChar) return null;
                                                decodedChar = ":";
                                            }
                                            break;
                                        case "d":
                                            if (!(nextChar >= "A") || !(nextChar <= "Z")) return null;
                                            decodedChar = String.fromCharCode(nextCharCode + 32);
                                            break;
                                        default:
                                            return console.warn("* code_93_reader _decodeExtended hit default case, this may be an error", decodedChar), null;
                                    }
                                    result.push(decodedChar);
                                } else result.push(_char2);
                            }
                            return result;
                        }
                    },
                    {
                        key: "_matchCheckChar",
                        value: function(charArray, index, maxWeight) {
                            var arrayToCheck = charArray.slice(0, index), length = arrayToCheck.length;
                            return code_93_reader_ALPHABET[arrayToCheck.reduce(function(sum, _char3, i) {
                                return sum + ((-1 * i + (length - 1)) % maxWeight + 1) * code_93_reader_ALPHABET.indexOf(_char3.charCodeAt(0));
                            }, 0) % 47] === charArray[index].charCodeAt(0);
                        }
                    },
                    {
                        key: "_verifyChecksums",
                        value: function(charArray) {
                            return this._matchCheckChar(charArray, charArray.length - 2, 20) && this._matchCheckChar(charArray, charArray.length - 1, 15);
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            if (!(start = this._findStart())) return null;
                            var lastStart, decodedChar, counters = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]), result = [], nextStart = this._nextSet(this._row, start.end);
                            do {
                                counters = this._toCounters(nextStart, counters);
                                var pattern = this._toPattern(counters);
                                if (pattern < 0 || null === (decodedChar = this._patternToChar(pattern))) return null;
                                result.push(decodedChar), lastStart = nextStart, nextStart += array_helper.a.sum(counters), nextStart = this._nextSet(this._row, nextStart);
                            }while ("*" !== decodedChar)
                            return (result.pop(), result.length && this._verifyEnd(lastStart, nextStart) && this._verifyChecksums(result)) ? (result = result.slice(0, result.length - 2), null === (result = this._decodeExtended(result))) ? null : {
                                code: result.join(""),
                                start: start.start,
                                end: nextStart,
                                startInfo: start,
                                decodedCodes: result,
                                format: this.FORMAT
                            } : null;
                        }
                    }
                ]), Code93Reader;
            }(barcode_reader), code_32_reader_patterns_AEIO = /[AEIO]/g, code_32_reader = /*#__PURE__*/ function(_Code39Reader) {
                inherits_default()(Code32Reader, _Code39Reader);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Code32Reader);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function Code32Reader() {
                    var _this;
                    classCallCheck_default()(this, Code32Reader);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "code_32_reader"), _this;
                }
                return createClass_default()(Code32Reader, [
                    {
                        key: "_decodeCode32",
                        value: function(code) {
                            if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(code)) return null;
                            for(var res = 0, i = 0; i < code.length; i++)res = 32 * res + "0123456789BCDFGHJKLMNPQRSTUVWXYZ".indexOf(code[i]);
                            var code32 = "" + res;
                            return code32.length < 9 && (code32 = ("000000000" + code32).slice(-9)), "A" + code32;
                        }
                    },
                    {
                        key: "_checkChecksum",
                        value: function(code) {
                            return !!code;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            var result = get_default()(getPrototypeOf_default()(Code32Reader.prototype), "decode", this).call(this, row, start);
                            if (!result) return null;
                            var code = result.code;
                            if (!code || (code = code.replace(code_32_reader_patterns_AEIO, ""), !this._checkChecksum(code))) return null;
                            var code32 = this._decodeCode32(code);
                            return code32 ? (result.code = code32, result) : null;
                        }
                    }
                ]), Code32Reader;
            }(code_39_reader), READERS = {
                code_128_reader: code_128_reader,
                ean_reader: ean_reader,
                ean_5_reader: ean_5_reader,
                ean_2_reader: ean_2_reader,
                ean_8_reader: ean_8_reader,
                code_39_reader: code_39_reader,
                code_39_vin_reader: code_39_vin_reader,
                codabar_reader: codabar_reader,
                upc_reader: upc_reader,
                upc_e_reader: upc_e_reader,
                i2of5_reader: i2of5_reader,
                "2of5_reader": _2of5_reader,
                code_93_reader: code_93_reader,
                code_32_reader: code_32_reader
            }, barcode_decoder = {
                registerReader: function(name, reader) {
                    READERS[name] = reader;
                },
                create: function(config, inputImageWrapper) {
                    var _canvas = {
                        ctx: {
                            frequency: null,
                            pattern: null,
                            overlay: null
                        },
                        dom: {
                            frequency: null,
                            pattern: null,
                            overlay: null
                        }
                    }, _barcodeReaders = [];
                    function initReaders() {
                        config.readers.forEach(function(readerConfig) {
                            var reader, configuration = {}, supplements = [];
                            "object" === typeof_default()(readerConfig) ? (reader = readerConfig.format, configuration = readerConfig.config) : "string" == typeof readerConfig && (reader = readerConfig), console.log("Before registering reader: ", reader), configuration.supplements && (supplements = configuration.supplements.map(function(supplement) {
                                return new READERS[supplement]();
                            }));
                            try {
                                var readerObj = new READERS[reader](configuration, supplements);
                                _barcodeReaders.push(readerObj);
                            } catch (err) {
                                throw console.error("* Error constructing reader ", reader, err), err;
                            }
                        }), console.log("Registered Readers: ".concat(_barcodeReaders.map(function(reader) {
                            return JSON.stringify({
                                format: reader.FORMAT,
                                config: reader.config
                            });
                        }).join(", ")));
                    }
                    function tryDecode(line) {
                        var i, result = null, barcodeLine = Bresenham.getBarcodeLine(inputImageWrapper, line[0], line[1]);
                        for(config.debug.showFrequency && (image_debug.a.drawPath(line, {
                            x: "x",
                            y: "y"
                        }, _canvas.ctx.overlay, {
                            color: "red",
                            lineWidth: 3
                        }), Bresenham.debug.printFrequency(barcodeLine.line, _canvas.dom.frequency)), Bresenham.toBinaryLine(barcodeLine), config.debug.showPattern && Bresenham.debug.printPattern(barcodeLine.line, _canvas.dom.pattern), i = 0; i < _barcodeReaders.length && null === result; i++)result = _barcodeReaders[i].decodePattern(barcodeLine.line);
                        return null === result ? null : {
                            codeResult: result,
                            barcodeLine: barcodeLine
                        };
                    }
                    /**
                         * With the help of the configured readers (Code128 or EAN) this function tries to detect a
                         * valid barcode pattern within the given area.
                         * @param {Object} box The area to search in
                         * @returns {Object} the result {codeResult, line, angle, pattern, threshold}
                         */ function _decodeFromBoundingBox(box) {
                        var line, line1, result, ctx = _canvas.ctx.overlay;
                        config.debug.drawBoundingBox && ctx && image_debug.a.drawPath(box, {
                            x: 0,
                            y: 1
                        }, ctx, {
                            color: "blue",
                            lineWidth: 2
                        });
                        var lineLength = Math.sqrt(Math.pow(Math.abs((line = line1 = [
                            {
                                x: (box[1][0] - box[0][0]) / 2 + box[0][0],
                                y: (box[1][1] - box[0][1]) / 2 + box[0][1]
                            },
                            {
                                x: (box[3][0] - box[2][0]) / 2 + box[2][0],
                                y: (box[3][1] - box[2][1]) / 2 + box[2][1]
                            }
                        ])[1].y - line[0].y), 2) + Math.pow(Math.abs(line[1].x - line[0].x), 2)), lineAngle = Math.atan2(line1[1].y - line1[0].y, line1[1].x - line1[0].x);
                        return null === (line1 = /**
                         * extend the line on both ends
                         * @param {Array} line
                         * @param {Number} angle
                         */ function(line, angle, ext) {
                            function extendLine(amount) {
                                var extension = {
                                    y: amount * Math.sin(angle),
                                    x: amount * Math.cos(angle)
                                };
                                /* eslint-disable no-param-reassign */ line[0].y -= extension.y, line[0].x -= extension.x, line[1].y += extension.y, line[1].x += extension.x;
                            /* eslint-enable no-param-reassign */ } // check if inside image
                            for(extendLine(ext); ext > 1 && (!inputImageWrapper.inImageWithBorder(line[0]) || !inputImageWrapper.inImageWithBorder(line[1]));)extendLine(-// eslint-disable-next-line no-param-reassign
                            (ext -= Math.ceil(ext / 2)));
                            return line;
                        }(line1, lineAngle, Math.floor(0.1 * lineLength))) ? null : (null === (result = tryDecode(line1)) && (result = /**
                         * This method slices the given area apart and tries to detect a barcode-pattern
                         * for each slice. It returns the decoded barcode, or null if nothing was found
                         * @param {Array} box
                         * @param {Array} line
                         * @param {Number} lineAngle
                         */ function(box, line, lineAngle) {
                            var i, dir, extension, sideLength = Math.sqrt(Math.pow(box[1][0] - box[0][0], 2) + Math.pow(box[1][1] - box[0][1], 2)), result = null, xdir = Math.sin(lineAngle), ydir = Math.cos(lineAngle);
                            for(i = 1; i < 16 && null === result; i++)extension = {
                                y: // move line perpendicular to angle
                                // eslint-disable-next-line no-mixed-operators
                                (dir = sideLength / 16 * i * (i % 2 == 0 ? -1 : 1)) * xdir,
                                x: dir * ydir
                            }, /* eslint-disable no-param-reassign */ line[0].y += extension.x, line[0].x -= extension.y, line[1].y += extension.x, line[1].x -= extension.y, /* eslint-enable no-param-reassign */ result = tryDecode(line);
                            return result;
                        }(box, line1, lineAngle)), null === result) ? null : (result && config.debug.drawScanline && ctx && image_debug.a.drawPath(line1, {
                            x: "x",
                            y: "y"
                        }, ctx, {
                            color: "red",
                            lineWidth: 3
                        }), {
                            codeResult: result.codeResult,
                            line: line1,
                            angle: lineAngle,
                            pattern: result.barcodeLine.line,
                            threshold: result.barcodeLine.threshold
                        });
                    }
                    return function() {
                        if ("undefined" != typeof document) {
                            var $debug = document.querySelector("#debug.detection");
                            _canvas.dom.frequency = document.querySelector("canvas.frequency"), !_canvas.dom.frequency && (_canvas.dom.frequency = document.createElement("canvas"), _canvas.dom.frequency.className = "frequency", $debug && $debug.appendChild(_canvas.dom.frequency)), _canvas.ctx.frequency = _canvas.dom.frequency.getContext("2d"), _canvas.dom.pattern = document.querySelector("canvas.patternBuffer"), !_canvas.dom.pattern && (_canvas.dom.pattern = document.createElement("canvas"), _canvas.dom.pattern.className = "patternBuffer", $debug && $debug.appendChild(_canvas.dom.pattern)), _canvas.ctx.pattern = _canvas.dom.pattern.getContext("2d"), _canvas.dom.overlay = document.querySelector("canvas.drawingBuffer"), _canvas.dom.overlay && (_canvas.ctx.overlay = _canvas.dom.overlay.getContext("2d"));
                        }
                    }(), initReaders(), function() {
                        if ("undefined" != typeof document) {
                            var i, vis = [
                                {
                                    node: _canvas.dom.frequency,
                                    prop: config.debug.showFrequency
                                },
                                {
                                    node: _canvas.dom.pattern,
                                    prop: config.debug.showPattern
                                }
                            ];
                            for(i = 0; i < vis.length; i++)!0 === vis[i].prop ? vis[i].node.style.display = "block" : vis[i].node.style.display = "none";
                        }
                    }(), {
                        decodeFromBoundingBox: function(box) {
                            return _decodeFromBoundingBox(box);
                        },
                        decodeFromBoundingBoxes: function(boxes) {
                            var i, result, barcodes = [], multiple = config.multiple;
                            for(i = 0; i < boxes.length; i++){
                                var box = boxes[i];
                                if ((result = _decodeFromBoundingBox(box) || {}).box = box, multiple) barcodes.push(result);
                                else if (result.codeResult) return result;
                            }
                            if (multiple) return {
                                barcodes: barcodes
                            };
                        },
                        decodeFromImage: function(inputImageWrapper) {
                            return function(imageWrapper) {
                                for(var result = null, i = 0; i < _barcodeReaders.length && null === result; i++)result = _barcodeReaders[i].decodeImage ? _barcodeReaders[i].decodeImage(imageWrapper) : null;
                                return result;
                            }(inputImageWrapper);
                        },
                        registerReader: function(name, reader) {
                            if (READERS[name]) throw Error("cannot register existing reader", name);
                            READERS[name] = reader;
                        },
                        setReaders: function(readers) {
                            // eslint-disable-next-line no-param-reassign
                            config.readers = readers, _barcodeReaders.length = 0, initReaders();
                        }
                    };
                }
            }, events = function() {
                var events = {};
                function getEvent(eventName) {
                    return events[eventName] || (events[eventName] = {
                        subscribers: []
                    }), events[eventName];
                }
                function publishSubscription(subscription, data) {
                    subscription.async ? setTimeout(function() {
                        subscription.callback(data);
                    }, 4) : subscription.callback(data);
                }
                function _subscribe(event, callback, async) {
                    var subscription;
                    if ("function" == typeof callback) subscription = {
                        callback: callback,
                        async: async
                    };
                    else if (!(subscription = callback).callback) throw Error("Callback was not specified on options");
                    getEvent(event).subscribers.push(subscription);
                }
                return {
                    subscribe: function(event, callback, async) {
                        return _subscribe(event, callback, async);
                    },
                    publish: function(eventName, data) {
                        var event = getEvent(eventName), subscribers = event.subscribers;
                        subscribers.filter(function(subscriber) {
                            return !!subscriber.once;
                        }).forEach(function(subscriber) {
                            publishSubscription(subscriber, data);
                        }), event.subscribers = subscribers.filter(function(subscriber) {
                            return !subscriber.once;
                        }), event.subscribers.forEach(function(subscriber) {
                            publishSubscription(subscriber, data);
                        });
                    },
                    once: function(event, callback) {
                        var async = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                        _subscribe(event, {
                            callback: callback,
                            async: async,
                            once: !0
                        });
                    },
                    unsubscribe: function(eventName, callback) {
                        if (eventName) {
                            var _event = getEvent(eventName);
                            _event && callback ? _event.subscribers = _event.subscribers.filter(function(subscriber) {
                                return subscriber.callback !== callback;
                            }) : _event.subscribers = [];
                        } else events = {};
                    }
                };
            }(), asyncToGenerator = __webpack_require__(20), asyncToGenerator_default = /*#__PURE__*/ __webpack_require__.n(asyncToGenerator), regenerator = __webpack_require__(12), regenerator_default = /*#__PURE__*/ __webpack_require__.n(regenerator), pick = __webpack_require__(85), pick_default = /*#__PURE__*/ __webpack_require__.n(pick), wrapNativeSuper = __webpack_require__(86), Exception_Exception = /*#__PURE__*/ function(_Error) {
                inherits_default()(Exception, _Error);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Exception);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, getPrototypeOf_default()(this).constructor) : Super.apply(this, arguments), possibleConstructorReturn_default()(this, result);
                });
                function Exception(m, code) {
                    var _this;
                    return classCallCheck_default()(this, Exception), _this = _super.call(this, m), defineProperty_default()(assertThisInitialized_default()(_this), "code", void 0), _this.code = code, Object.setPrototypeOf(assertThisInitialized_default()(_this), Exception.prototype), _this;
                }
                return Exception;
            }(/*#__PURE__*/ /*#__PURE__*/ __webpack_require__.n(wrapNativeSuper)()(Error)), ERROR_DESC = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
            function _initCamera() {
                return (_initCamera = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee2(video, constraints) {
                    var stream;
                    return regenerator_default.a.wrap(function(_context2) {
                        for(;;)switch(_context2.prev = _context2.next){
                            case 0:
                                return _context2.next = 2, function(constraints) {
                                    try {
                                        return navigator.mediaDevices.getUserMedia(constraints);
                                    } catch (err) {
                                        return Promise.reject(new Exception_Exception("getUserMedia is not defined. ".concat(ERROR_DESC), -1));
                                    }
                                }(constraints);
                            case 2:
                                if (streamRef = stream = _context2.sent, !video) {
                                    _context2.next = 11;
                                    break;
                                }
                                return video.setAttribute("autoplay", "true"), video.setAttribute("muted", "true"), video.setAttribute("playsinline", "true"), // eslint-disable-next-line no-param-reassign
                                video.srcObject = stream, video.addEventListener("loadedmetadata", function() {
                                    video.play();
                                }), _context2.abrupt("return", function(video) {
                                    return new Promise(function(resolve, reject) {
                                        var attempts = 10;
                                        !function checkVideo() {
                                            attempts > 0 ? video.videoWidth > 10 && video.videoHeight > 10 ? (console.log("* dev: checkVideo found ".concat(video.videoWidth, "px x ").concat(video.videoHeight, "px")), resolve()) : window.setTimeout(checkVideo, 500) : reject(new Exception_Exception("Unable to play video stream. Is webcam working?", -1)), attempts--;
                                        }();
                                    });
                                }(video));
                            case 11:
                                return _context2.abrupt("return", Promise.resolve());
                            case 12:
                            case "end":
                                return _context2.stop();
                        }
                    }, _callee2);
                }))).apply(this, arguments);
            }
            function _enumerateVideoDevices() {
                return (_enumerateVideoDevices = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee3() {
                    var devices;
                    return regenerator_default.a.wrap(function(_context3) {
                        for(;;)switch(_context3.prev = _context3.next){
                            case 0:
                                return _context3.next = 2, function() {
                                    try {
                                        return navigator.mediaDevices.enumerateDevices();
                                    } catch (err) {
                                        return Promise.reject(new Exception_Exception("enumerateDevices is not defined. ".concat(ERROR_DESC), -1));
                                    }
                                }();
                            case 2:
                                return devices = _context3.sent, _context3.abrupt("return", devices.filter(function(device) {
                                    return "videoinput" === device.kind;
                                }));
                            case 4:
                            case "end":
                                return _context3.stop();
                        }
                    }, _callee3);
                }))).apply(this, arguments);
            }
            function getActiveTrack() {
                if (!streamRef) return null;
                var tracks = streamRef.getVideoTracks();
                return tracks && null != tracks && tracks.length ? tracks[0] : null;
            }
            /**
                 * Used for accessing information about the active stream track and available video devices.
                 */ var QuaggaJSCameraAccess = {
                requestedVideoElement: null,
                request: function(video, videoConstraints) {
                    return asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee() {
                        var newConstraints;
                        return regenerator_default.a.wrap(function(_context) {
                            for(;;)switch(_context.prev = _context.next){
                                case 0:
                                    return QuaggaJSCameraAccess.requestedVideoElement = video, _context.next = 3, // I think it was just that way so it could be chained to other functions that did return a Promise.
                                    // That's not necessary with async functions being a thing, so that should be fixed.
                                    function() {
                                        var normalized, videoConstraints = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, video = (normalized = pick_default()(videoConstraints, [
                                            "width",
                                            "height",
                                            "facingMode",
                                            "aspectRatio",
                                            "deviceId"
                                        ]), void 0 !== videoConstraints.minAspectRatio && videoConstraints.minAspectRatio > 0 && (normalized.aspectRatio = videoConstraints.minAspectRatio, console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead")), void 0 !== videoConstraints.facing && (normalized.facingMode = videoConstraints.facing, console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'")), normalized);
                                        return video && video.deviceId && video.facingMode && delete video.facingMode, Promise.resolve({
                                            audio: !1,
                                            video: video
                                        });
                                    }(videoConstraints);
                                case 3:
                                    return newConstraints = _context.sent, _context.abrupt("return", /**
                 * Tries to attach the camera-stream to a given video-element
                 * and calls the callback function when the content is ready
                 * @param {Object} constraints
                 * @param {Object} video
                 */ function(_x, _x2) {
                                        return _initCamera.apply(this, arguments);
                                    }(video, newConstraints));
                                case 5:
                                case "end":
                                    return _context.stop();
                            }
                        }, _callee);
                    }))();
                },
                release: function() {
                    var tracks = streamRef && streamRef.getVideoTracks();
                    return null !== QuaggaJSCameraAccess.requestedVideoElement && QuaggaJSCameraAccess.requestedVideoElement.pause(), new Promise(function(resolve) {
                        setTimeout(function() {
                            tracks && tracks.length && tracks[0].stop(), streamRef = null, QuaggaJSCameraAccess.requestedVideoElement = null, resolve();
                        }, 0);
                    });
                },
                enumerateVideoDevices: function() {
                    return _enumerateVideoDevices.apply(this, arguments);
                },
                getActiveStreamLabel: function() {
                    var track = getActiveTrack();
                    return track ? track.label : "";
                },
                getActiveTrack: getActiveTrack
            }, camera_access = QuaggaJSCameraAccess, result_collector = {
                create: function(config) {
                    var _config$capacity, canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), results = [], capacity = null !== (_config$capacity = config.capacity) && void 0 !== _config$capacity ? _config$capacity : 20, capture = !0 === config.capture;
                    return {
                        addResult: function(data, imageSize, codeResult) {
                            var list, filter, result = {}; // this is 'any' to avoid having to construct a whole QuaggaJSCodeResult :|
                            capacity && codeResult && !((list = config.blacklist) && list.some(function(item) {
                                return Object.keys(item).every(function(key) {
                                    return item[key] === codeResult[key];
                                });
                            })) && ("function" != typeof (filter = config.filter) || filter(codeResult)) && (capacity--, result.codeResult = codeResult, capture && (canvas.width = imageSize.x, canvas.height = imageSize.y, image_debug.a.drawImage(data, imageSize, ctx), result.frame = canvas.toDataURL()), results.push(result));
                        },
                        getResults: function() {
                            return results;
                        }
                    };
                }
            }, config_config = {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    constraints: {
                        width: 640,
                        height: 480,
                        // aspectRatio: 640/480, // optional
                        facingMode: "environment"
                    },
                    area: {
                        top: "0%",
                        right: "0%",
                        left: "0%",
                        bottom: "0%"
                    },
                    singleChannel: !1
                },
                locate: !0,
                numOfWorkers: 0,
                decoder: {
                    readers: [
                        "code_128_reader"
                    ],
                    debug: {
                        drawBoundingBox: !1,
                        showFrequency: !1,
                        drawScanline: !1,
                        showPattern: !1
                    }
                },
                locator: {
                    halfSample: !0,
                    patchSize: "medium",
                    // x-small, small, medium, large, x-large
                    debug: {
                        showCanvas: !1,
                        showPatches: !1,
                        showFoundPatches: !1,
                        showSkeleton: !1,
                        showLabels: !1,
                        showPatchLabels: !1,
                        showRemainingPatchLabels: !1,
                        boxFromPatches: {
                            showTransformed: !1,
                            showTransformedBox: !1,
                            showBB: !1
                        }
                    }
                }
            }, gl_vec2 = __webpack_require__(7), QuaggaContext_QuaggaContext = function QuaggaContext() {
                classCallCheck_default()(this, QuaggaContext), defineProperty_default()(this, "config", void 0), defineProperty_default()(this, "inputStream", void 0), defineProperty_default()(this, "framegrabber", void 0), defineProperty_default()(this, "inputImageWrapper", void 0), defineProperty_default()(this, "stopped", !1), defineProperty_default()(this, "boxSize", void 0), defineProperty_default()(this, "resultCollector", void 0), defineProperty_default()(this, "decoder", void 0), defineProperty_default()(this, "workerPool", []), defineProperty_default()(this, "onUIThread", !0), defineProperty_default()(this, "canvasContainer", new QuaggaContext_CanvasContainer());
            }, QuaggaContext_CanvasInfo = function CanvasInfo() {
                classCallCheck_default()(this, CanvasInfo), defineProperty_default()(this, "image", void 0), defineProperty_default()(this, "overlay", void 0);
            }, QuaggaContext_CanvasContainer = function CanvasContainer() {
                classCallCheck_default()(this, CanvasContainer), defineProperty_default()(this, "ctx", void 0), defineProperty_default()(this, "dom", void 0), this.ctx = new QuaggaContext_CanvasInfo(), this.dom = new QuaggaContext_CanvasInfo();
            }, barcode_locator = __webpack_require__(23);
            // CONCATENATED MODULE: ./src/quagga/getViewPort.ts
            function getViewPort_getViewPort(target) {
                if ("undefined" == typeof document) return null;
                 // Check if target is already a DOM element
                if (target instanceof HTMLElement && target.nodeName && 1 === target.nodeType) return target;
                 // Use '#interactive.viewport' as a fallback selector (backwards compatibility)
                var selector = "string" == typeof target ? target : "#interactive.viewport";
                return document.querySelector(selector);
            }
            function getCanvasAndContext(selector, className) {
                var canvas, canvas1 = ((canvas = document.querySelector(selector)) || ((canvas = document.createElement("canvas")).className = className), canvas), context = canvas1.getContext("2d");
                return {
                    canvas: canvas1,
                    context: context
                };
            }
            // CONCATENATED MODULE: ./src/input/exif_helper.js
            // NOTE: (SOME OF) THIS IS BROWSER ONLY CODE.  Node does not have 'atob' built in, nor XMLHttpRequest.
            // How exactly is this set of functions used in Quagga? Do we need the browser specific code? Do we
            // need to port any part of this that doesn't work in Node to node?
            // Tags scraped from https://github.com/exif-js/exif-js
            var ExifTags = {
                0x0112: "orientation"
            }, AvailableTags = Object.keys(ExifTags).map(function(key) {
                return ExifTags[key];
            });
            function readToBuffer(blob) {
                return new Promise(function(resolve) {
                    var fileReader = new FileReader();
                    fileReader.onload = function(e) {
                        return resolve(e.target.result);
                    }, fileReader.readAsArrayBuffer(blob);
                });
            }
            // CONCATENATED MODULE: ./src/input/image_loader.js
            var ImageLoader = {};
            ImageLoader.load = function(directory, callback, offset, size, sequence) {
                var i, img, num, htmlImagesSrcArray = Array(size), htmlImagesArray = Array(htmlImagesSrcArray.length);
                if (!1 === sequence) htmlImagesSrcArray[0] = directory;
                else for(i = 0; i < htmlImagesSrcArray.length; i++)num = offset + i, htmlImagesSrcArray[i] = "".concat(directory, "image-").concat("00".concat(num).slice(-3), ".jpg");
                for(i = 0, htmlImagesArray.notLoaded = [], htmlImagesArray.addImage = function(image) {
                    htmlImagesArray.notLoaded.push(image);
                }, htmlImagesArray.loaded = function(loadedImg) {
                    for(var notloadedImgs = htmlImagesArray.notLoaded, x = 0; x < notloadedImgs.length; x++)if (notloadedImgs[x] === loadedImg) {
                        notloadedImgs.splice(x, 1);
                        for(var y = 0; y < htmlImagesSrcArray.length; y++){
                            var imgName = htmlImagesSrcArray[y].substr(htmlImagesSrcArray[y].lastIndexOf("/"));
                            if (-1 !== loadedImg.src.lastIndexOf(imgName)) {
                                htmlImagesArray[y] = {
                                    img: loadedImg
                                };
                                break;
                            }
                        }
                        break;
                    }
                    0 === notloadedImgs.length && (console.log("Images loaded"), !1 === sequence ? (function(src) {
                        var tags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : AvailableTags;
                        return /^blob:/i.test(src) ? new Promise(function(resolve, reject) {
                            var http = new XMLHttpRequest();
                            http.open("GET", src, !0), http.responseType = "blob", http.onreadystatechange = function() {
                                http.readyState === XMLHttpRequest.DONE && (200 === http.status || 0 === http.status) && resolve(this.response);
                            }, http.onerror = reject, http.send();
                        }).then(readToBuffer).then(function(buffer) {
                            return function(file) {
                                var selectedTags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : AvailableTags, dataView = new DataView(file), length = file.byteLength, exifTags = selectedTags.reduce(function(result, selectedTag) {
                                    var exifTag = Object.keys(ExifTags).filter(function(tag) {
                                        return ExifTags[tag] === selectedTag;
                                    })[0];
                                    return exifTag && (result[exifTag] = selectedTag), result;
                                }, {}), offset = 2;
                                if (0xff !== dataView.getUint8(0) || 0xd8 !== dataView.getUint8(1)) return !1;
                                for(; offset < length && 0xff === dataView.getUint8(offset);){
                                    if (0xe1 === dataView.getUint8(offset + 1)) return function(file, start, exifTags) {
                                        if ("Exif" !== function(buffer, start, length) {
                                            for(var outstr = "", n = start; n < start + 4; n++)outstr += String.fromCharCode(buffer.getUint8(n));
                                            return outstr;
                                        }(file, start, 0)) return !1;
                                        var bigEnd, tiffOffset = start + 6;
                                        if (0x4949 === file.getUint16(tiffOffset)) bigEnd = !1;
                                        else {
                                            if (0x4d4d !== file.getUint16(tiffOffset)) return !1;
                                            bigEnd = !0;
                                        }
                                        if (0x002a !== file.getUint16(tiffOffset + 2, !bigEnd)) return !1;
                                        var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
                                        return !(firstIFDOffset < 0x00000008) && function(file, tiffStart, dirStart, strings, bigEnd) {
                                            for(var entries = file.getUint16(dirStart, !bigEnd), tags = {}, i = 0; i < entries; i++){
                                                var entryOffset = dirStart + 12 * i + 2, tag = strings[file.getUint16(entryOffset, !bigEnd)];
                                                tag && (tags[tag] = function(file, entryOffset, tiffStart, dirStart, bigEnd) {
                                                    var type = file.getUint16(entryOffset + 2, !bigEnd), numValues = file.getUint32(entryOffset + 4, !bigEnd);
                                                    return 3 === type && 1 === numValues ? file.getUint16(entryOffset + 8, !bigEnd) : null;
                                                }(file, entryOffset, 0, 0, bigEnd));
                                            }
                                            return tags;
                                        }(file, 0, tiffOffset + firstIFDOffset, exifTags, bigEnd);
                                    }(dataView, offset + 4, exifTags);
                                    offset += 2 + dataView.getUint16(offset + 2);
                                }
                                return !1;
                            }(buffer, tags);
                        }) : Promise.resolve(null);
                    })(directory, [
                        "orientation"
                    ]).then(function(tags) {
                        htmlImagesArray[0].tags = tags, callback(htmlImagesArray);
                    }).catch(function(e) {
                        console.log(e), callback(htmlImagesArray);
                    }) : callback(htmlImagesArray));
                }; i < htmlImagesSrcArray.length; i++)img = new Image(), htmlImagesArray.addImage(img), function(img, htmlImagesArray) {
                    img.onload = function() {
                        htmlImagesArray.loaded(this);
                    };
                }(img, htmlImagesArray), img.src = htmlImagesSrcArray[i];
            };
            // CONCATENATED MODULE: ./src/input/input_stream/input_stream_browser.ts
            /* eslint-disable @typescript-eslint/no-explicit-any */ var inputStreamFactory = {
                createVideoStream: function(video) {
                    var _calculatedWidth, _calculatedHeight, _config = null, _eventNames = [
                        "canrecord",
                        "ended"
                    ], _eventHandlers = {}, _topRight = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    }, _canvasSize = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    }, inputStream = {
                        getRealWidth: function() {
                            return video.videoWidth;
                        },
                        getRealHeight: function() {
                            return video.videoHeight;
                        },
                        getWidth: function() {
                            return _calculatedWidth;
                        },
                        getHeight: function() {
                            return _calculatedHeight;
                        },
                        setWidth: function(width) {
                            _calculatedWidth = width;
                        },
                        setHeight: function(height) {
                            _calculatedHeight = height;
                        },
                        setInputStream: function(config) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            _config = config, this.setAttribute("src", void 0 !== config.src ? config.src : "");
                        },
                        ended: function() {
                            return video.ended;
                        },
                        getConfig: function() {
                            return _config;
                        },
                        setAttribute: function(name, value) {
                            video && video.setAttribute(name, value);
                        },
                        pause: function() {
                            video.pause();
                        },
                        play: function() {
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            video.play();
                        },
                        setCurrentTime: function(time) {
                            var _config4;
                            (null === (_config4 = _config) || void 0 === _config4 ? void 0 : _config4.type) !== "LiveStream" && this.setAttribute("currentTime", time.toString());
                        },
                        addEventListener: function(event, f, bool) {
                            -1 !== _eventNames.indexOf(event) ? (_eventHandlers[event] || (_eventHandlers[event] = []), _eventHandlers[event].push(f)) : video.addEventListener(event, f, bool);
                        },
                        clearEventHandlers: function() {
                            _eventNames.forEach(function(eventName) {
                                var handlers = _eventHandlers[eventName];
                                handlers && handlers.length > 0 && handlers.forEach(function(handler) {
                                    video.removeEventListener(eventName, handler);
                                });
                            });
                        },
                        trigger: function(eventName, args) {
                            var _config2, _config3, width, height, j, handlers = _eventHandlers[eventName];
                            if ("canrecord" === eventName && (width = video.videoWidth, height = video.videoHeight, _calculatedWidth = null !== (_config2 = _config) && void 0 !== _config2 && _config2.size ? width / height > 1 ? _config.size : Math.floor(width / height * _config.size) : width, _calculatedHeight = null !== (_config3 = _config) && void 0 !== _config3 && _config3.size ? width / height > 1 ? Math.floor(height / width * _config.size) : _config.size : height, _canvasSize.x = _calculatedWidth, _canvasSize.y = _calculatedHeight), handlers && handlers.length > 0) for(j = 0; j < handlers.length; j++)handlers[j].apply(inputStream, args);
                        },
                        setTopRight: function(topRight) {
                            _topRight.x = topRight.x, _topRight.y = topRight.y;
                        },
                        getTopRight: function() {
                            return _topRight;
                        },
                        setCanvasSize: function(size) {
                            _canvasSize.x = size.x, _canvasSize.y = size.y;
                        },
                        getCanvasSize: function() {
                            return _canvasSize;
                        },
                        getFrame: function() {
                            return video;
                        }
                    };
                    return inputStream;
                },
                createLiveStream: function(video) {
                    video && video.setAttribute("autoplay", "true");
                    var that = inputStreamFactory.createVideoStream(video);
                    return that.ended = function() {
                        return !1;
                    }, that;
                },
                createImageStream: function() {
                    var calculatedWidth, calculatedHeight, _config = null, width = 0, height = 0, frameIdx = 0, paused = !0, loaded = !1, imgArray = null, size = 0, baseUrl = null, _ended = !1, _eventNames = [
                        "canrecord",
                        "ended"
                    ], _eventHandlers = {}, _topRight = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    }, _canvasSize = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function publishEvent(eventName, args) {
                        var j, handlers = _eventHandlers[eventName];
                        if (handlers && handlers.length > 0) for(j = 0; j < handlers.length; j++)// eslint-disable-next-line @typescript-eslint/no-use-before-define
                        handlers[j].apply(inputStream, args); // TODO: typescript complains that any[] is not valid for a second arg for apply?!
                    } // TODO: any code shared with the first InputStream above should be shared not copied
                    // TODO: publishEvent needs access to inputStream, but inputStream needs access to publishEvent
                    // TODO: This is why it's a 'var', so it hoists back.  This is ugly, and should be changed.
                    // eslint-disable-next-line no-var,vars-on-top
                    var inputStream = {
                        trigger: publishEvent,
                        getWidth: function() {
                            return calculatedWidth;
                        },
                        getHeight: function() {
                            return calculatedHeight;
                        },
                        setWidth: function(newWidth) {
                            calculatedWidth = newWidth;
                        },
                        setHeight: function(newHeight) {
                            calculatedHeight = newHeight;
                        },
                        getRealWidth: function() {
                            return width;
                        },
                        getRealHeight: function() {
                            return height;
                        },
                        setInputStream: function(stream) {
                            var _config7;
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            _config = stream, !1 === stream.sequence ? (// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                            baseUrl = stream.src, size = 1) : (// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                            baseUrl = stream.src, size = stream.length), loaded = !1, ImageLoader.load(baseUrl, function(imgs) {
                                var _config5, _config6;
                                if (imgArray = imgs, imgs[0].tags && imgs[0].tags.orientation) // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                switch(imgs[0].tags.orientation){
                                    case 6:
                                    case 8:
                                        width = imgs[0].img.height, height = imgs[0].img.width;
                                        break;
                                    default:
                                        width = imgs[0].img.width, height = imgs[0].img.height;
                                }
                                else width = imgs[0].img.width, height = imgs[0].img.height;
                                 // eslint-disable-next-line no-nested-ternary
                                calculatedWidth = null !== (_config5 = _config) && void 0 !== _config5 && _config5.size ? width / height > 1 ? _config.size : Math.floor(width / height * _config.size) : width, calculatedHeight = null !== (_config6 = _config) && void 0 !== _config6 && _config6.size ? width / height > 1 ? Math.floor(height / width * _config.size) : _config.size : height, _canvasSize.x = calculatedWidth, _canvasSize.y = calculatedHeight, loaded = !0, frameIdx = 0, setTimeout(function() {
                                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                    publishEvent("canrecord", []);
                                }, 0);
                            }, 1, size, null === (_config7 = _config) || void 0 === _config7 ? void 0 : _config7.sequence);
                        },
                        ended: function() {
                            return _ended;
                        },
                        setAttribute: function() {},
                        getConfig: function() {
                            return _config;
                        },
                        pause: function() {
                            paused = !0;
                        },
                        play: function() {
                            paused = !1;
                        },
                        setCurrentTime: function(time) {
                            frameIdx = time;
                        },
                        addEventListener: function(event, f) {
                            -1 !== _eventNames.indexOf(event) && (_eventHandlers[event] || (_eventHandlers[event] = []), _eventHandlers[event].push(f));
                        },
                        clearEventHandlers: function() {
                            Object.keys(_eventHandlers).forEach(function(ind) {
                                return delete _eventHandlers[ind];
                            });
                        },
                        setTopRight: function(topRight) {
                            _topRight.x = topRight.x, _topRight.y = topRight.y;
                        },
                        getTopRight: function() {
                            return _topRight;
                        },
                        setCanvasSize: function(canvasSize) {
                            _canvasSize.x = canvasSize.x, _canvasSize.y = canvasSize.y;
                        },
                        getCanvasSize: function() {
                            return _canvasSize;
                        },
                        getFrame: function() {
                            var frame, _imgArray;
                            return loaded ? (!paused && (// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            frame = null === (_imgArray = imgArray) || void 0 === _imgArray ? void 0 : _imgArray[frameIdx], frameIdx < size - 1 ? frameIdx++ : setTimeout(function() {
                                _ended = !0, publishEvent("ended", []);
                            }, 0)), frame) : null;
                        }
                    };
                    return inputStream;
                }
            }, cv_utils = __webpack_require__(8), TO_RADIANS = Math.PI / 180, FrameGrabber = {};
            // CONCATENATED MODULE: ./src/quagga/qworker.ts
            function qworker_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    enumerableOnly && (symbols = symbols.filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                    })), keys.push.apply(keys, symbols);
                }
                return keys;
            }
            function qworker_objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? qworker_ownKeys(Object(source), !0).forEach(function(key) {
                        defineProperty_default()(target, key, source[key]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : qworker_ownKeys(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
                return target;
            }
            FrameGrabber.create = function(inputStream, canvas) {
                var _canvas, _that = {}, _streamConfig = inputStream.getConfig(), _videoSize = Object(cv_utils.h)(inputStream.getRealWidth(), inputStream.getRealHeight()), _canvasSize = inputStream.getCanvasSize(), _size = Object(cv_utils.h)(inputStream.getWidth(), inputStream.getHeight()), topRight = inputStream.getTopRight(), _sx = topRight.x, _sy = topRight.y, _ctx = null, _data = null;
                return (_canvas = canvas || document.createElement("canvas")).width = _canvasSize.x, _canvas.height = _canvasSize.y, _ctx = _canvas.getContext("2d"), _data = new Uint8Array(_size.x * _size.y), console.log("FrameGrabber", JSON.stringify({
                    size: _size,
                    topRight: topRight,
                    videoSize: _videoSize,
                    canvasSize: _canvasSize
                })), /**
                     * Uses the given array as frame-buffer
                     */ _that.attachData = function(data) {
                    _data = data;
                }, /**
                     * Returns the used frame-buffer
                     */ _that.getData = function() {
                    return _data;
                }, /**
                     * Fetches a frame from the input-stream and puts into the frame-buffer.
                     * The image-data is converted to gray-scale and then half-sampled if configured.
                     */ _that.grab = function() {
                    var ctxData, doHalfSample = _streamConfig.halfSample, frame = inputStream.getFrame(), drawable = frame, drawAngle = 0;
                    if (drawable) {
                        if (_canvas.width !== _canvasSize.x && (console.log("WARNING: canvas-size needs to be adjusted"), _canvas.width = _canvasSize.x), _canvas.height !== _canvasSize.y && (console.log("WARNING: canvas-size needs to be adjusted"), _canvas.height = _canvasSize.y), "ImageStream" === _streamConfig.type && (drawable = frame.img, frame.tags && frame.tags.orientation)) switch(frame.tags.orientation){
                            case 6:
                                drawAngle = 90 * TO_RADIANS;
                                break;
                            case 8:
                                drawAngle = -90 * TO_RADIANS;
                        }
                        return 0 !== drawAngle ? (_ctx.translate(_canvasSize.x / 2, _canvasSize.y / 2), _ctx.rotate(drawAngle), _ctx.drawImage(drawable, -_canvasSize.y / 2, -_canvasSize.x / 2, _canvasSize.y, _canvasSize.x), _ctx.rotate(-drawAngle), _ctx.translate(-_canvasSize.x / 2, -_canvasSize.y / 2)) : _ctx.drawImage(drawable, 0, 0, _canvasSize.x, _canvasSize.y), ctxData = _ctx.getImageData(_sx, _sy, _size.x, _size.y).data, doHalfSample ? Object(cv_utils.e)(ctxData, _size, _data) : Object(cv_utils.c)(ctxData, _data, _streamConfig), !0;
                    }
                    return !1;
                }, _that.getSize = function() {
                    return _size;
                }, _that;
            };
            /* Worker functions. These are straight from the original quagga.js file.
                 * Not presently used, as worker support is non-functional.  Keeping them around temporarily
                 * to refer to until it is re-implemented. We may be able to fix/use some of this.
                 */ // TODO: need a typescript interface for FrameGrabber
            var workerPool = [];
            function workerInterface(factory) {
                if (factory) {
                    var imageWrapper, Quagga = factory().default;
                    if (!Quagga) {
                        // @ts-ignore
                        self.postMessage({
                            event: "error",
                            message: "Quagga could not be created"
                        });
                        return;
                    }
                } // @ts-ignore
                function onProcessed(result) {
                    self.postMessage({
                        event: "processed",
                        // @ts-ignore
                        imageData: imageWrapper.data,
                        result: result
                    }, [
                        imageWrapper.data.buffer
                    ]);
                }
                function workerInterfaceReady() {
                    self.postMessage({
                        event: "initialized",
                        // @ts-ignore
                        imageData: imageWrapper.data
                    }, [
                        imageWrapper.data.buffer
                    ]);
                } // @ts-ignore
                self.onmessage = function(e) {
                    if ("init" === e.data.cmd) {
                        var config = e.data.config;
                        config.numOfWorkers = 0, imageWrapper = new Quagga.ImageWrapper({
                            x: e.data.size.x,
                            y: e.data.size.y
                        }, new Uint8Array(e.data.imageData)), Quagga.init(config, workerInterfaceReady, imageWrapper), Quagga.onProcessed(onProcessed);
                    } else "process" === e.data.cmd ? (// @ts-ignore
                    imageWrapper.data = new Uint8Array(e.data.imageData), Quagga.start()) : "setReaders" === e.data.cmd ? Quagga.setReaders(e.data.readers) : "registerReader" === e.data.cmd && Quagga.registerReader(e.data.name, e.data.reader);
                };
            }
            function adjustWorkerPool(capacity, config, inputStream, cb) {
                var increaseBy = capacity - workerPool.length;
                if (0 === increaseBy && cb) cb();
                else if (increaseBy < 0) workerPool.slice(increaseBy).forEach(function(workerThread) {
                    workerThread.worker.terminate(), console.log("Worker terminated!");
                }), workerPool = workerPool.slice(0, increaseBy), cb && cb();
                else {
                    var workerInitialized = function(workerThread) {
                        workerPool.push(workerThread), workerPool.length >= capacity && cb && cb();
                    };
                    if (config) for(var i = 0; i < increaseBy; i++)!function(config, inputStream, cb) {
                        var blob, factorySource, blobURL = ("undefined" != typeof __factorySource__ && // @ts-ignore
                        (factorySource = __factorySource__), /* jshint ignore:end */ blob = new Blob([
                            "(" + workerInterface.toString() + ")(" + factorySource + ");"
                        ], {
                            type: "text/javascript"
                        }), window.URL.createObjectURL(blob)), workerThread = {
                            worker: new Worker(blobURL),
                            imageData: new Uint8Array(inputStream.getWidth() * inputStream.getHeight()),
                            busy: !0
                        };
                        workerThread.worker.onmessage = function(e) {
                            "initialized" === e.data.event ? (URL.revokeObjectURL(blobURL), workerThread.busy = !1, workerThread.imageData = new Uint8Array(e.data.imageData), console.log("Worker initialized"), cb(workerThread)) : "processed" === e.data.event ? (workerThread.imageData = new Uint8Array(e.data.imageData), workerThread.busy = !1) : "error" === e.data.event && console.log("Worker error: " + e.data.message);
                        }, workerThread.worker.postMessage({
                            cmd: "init",
                            size: {
                                x: inputStream.getWidth(),
                                y: inputStream.getHeight()
                            },
                            imageData: workerThread.imageData,
                            config: qworker_objectSpread(qworker_objectSpread({}, config), {}, {
                                inputStream: qworker_objectSpread(qworker_objectSpread({}, config.inputStream), {}, {
                                    target: null
                                })
                            })
                        }, [
                            workerThread.imageData.buffer
                        ]);
                    }(config, inputStream, workerInitialized);
                }
            }
            // CONCATENATED MODULE: ./src/quagga/transform.ts
            /* eslint-disable no-param-reassign */ function moveBox(box, xOffset, yOffset) {
                for(var corner = box.length; corner--;)box[corner][0] += xOffset, box[corner][1] += yOffset;
            }
            // CONCATENATED MODULE: ./src/quagga/quagga.ts
            var quagga_Quagga = /*#__PURE__*/ function() {
                var _stop;
                function Quagga() {
                    var _this = this;
                    classCallCheck_default()(this, Quagga), defineProperty_default()(this, "context", new QuaggaContext_QuaggaContext()), defineProperty_default()(this, "canRecord", function(callback) {
                        var _this$context$config;
                        _this.context.config && (barcode_locator.a.checkImageConstraints(_this.context.inputStream, null === (_this$context$config = _this.context.config) || void 0 === _this$context$config ? void 0 : _this$context$config.locator), _this.initCanvas(), _this.context.framegrabber = FrameGrabber.create(_this.context.inputStream, _this.context.canvasContainer.dom.image), void 0 === _this.context.config.numOfWorkers && (_this.context.config.numOfWorkers = 0), adjustWorkerPool(_this.context.config.numOfWorkers, _this.context.config, _this.context.inputStream, function() {
                            var _this$context$config2;
                            (null === (_this$context$config2 = _this.context.config) || void 0 === _this$context$config2 ? void 0 : _this$context$config2.numOfWorkers) === 0 && _this.initializeData(), _this.ready(callback);
                        }));
                    }), defineProperty_default()(this, "update", function() {
                        if (_this.context.onUIThread) {
                            var frameGrabber, availableWorker, _this$context$inputIm2, _this$context$inputIm, workersUpdated = (frameGrabber = _this.context.framegrabber, workerPool.length ? !!(availableWorker = workerPool.filter(function(workerThread) {
                                return !workerThread.busy;
                            })[0]) && (frameGrabber.attachData(availableWorker.imageData), frameGrabber.grab() && (availableWorker.busy = !0, availableWorker.worker.postMessage({
                                cmd: "process",
                                imageData: availableWorker.imageData
                            }, [
                                availableWorker.imageData.buffer
                            ])), !0) : null);
                            workersUpdated || (_this.context.framegrabber.attachData(null === (_this$context$inputIm = _this.context.inputImageWrapper) || void 0 === _this$context$inputIm ? void 0 : _this$context$inputIm.data), _this.context.framegrabber.grab() && !workersUpdated && _this.locateAndDecode());
                        } else _this.context.framegrabber.attachData(null === (_this$context$inputIm2 = _this.context.inputImageWrapper) || void 0 === _this$context$inputIm2 ? void 0 : _this$context$inputIm2.data), _this.context.framegrabber.grab(), _this.locateAndDecode();
                    });
                }
                return createClass_default()(Quagga, [
                    {
                        key: "initBuffers",
                        value: function(imageWrapper) {
                            if (this.context.config) {
                                var inputStream, locator, inputImageWrapper, boxSize, _initBuffers2 = (inputStream = this.context.inputStream, locator = this.context.config.locator, inputImageWrapper = imageWrapper || new image_wrapper.a({
                                    x: inputStream.getWidth(),
                                    y: inputStream.getHeight(),
                                    type: "XYSize"
                                }), console.log("image wrapper size ".concat(inputImageWrapper.size)), boxSize = [
                                    Object(gl_vec2.clone)([
                                        0,
                                        0
                                    ]),
                                    Object(gl_vec2.clone)([
                                        0,
                                        inputImageWrapper.size.y
                                    ]),
                                    Object(gl_vec2.clone)([
                                        inputImageWrapper.size.x,
                                        inputImageWrapper.size.y
                                    ]),
                                    Object(gl_vec2.clone)([
                                        inputImageWrapper.size.x,
                                        0
                                    ])
                                ], barcode_locator.a.init(inputImageWrapper, locator), {
                                    inputImageWrapper: inputImageWrapper,
                                    boxSize: boxSize
                                }), inputImageWrapper1 = _initBuffers2.inputImageWrapper, boxSize1 = _initBuffers2.boxSize;
                                this.context.inputImageWrapper = inputImageWrapper1, this.context.boxSize = boxSize1;
                            }
                        }
                    },
                    {
                        key: "initializeData",
                        value: function(imageWrapper) {
                            this.context.config && (this.initBuffers(imageWrapper), this.context.decoder = barcode_decoder.create(this.context.config.decoder, this.context.inputImageWrapper));
                        }
                    },
                    {
                        key: "getViewPort",
                        value: function() {
                            return this.context.config && this.context.config.inputStream ? getViewPort_getViewPort(this.context.config.inputStream.target) : null;
                        }
                    },
                    {
                        key: "ready",
                        value: function(callback) {
                            this.context.inputStream.play(), callback();
                        }
                    },
                    {
                        key: "initCanvas",
                        value: function() {
                            var container = function(context) {
                                var _context$config, _context$config$input, _context$config2, _context$config2$inpu, viewport = getViewPort_getViewPort(null == context ? void 0 : null === (_context$config = context.config) || void 0 === _context$config ? void 0 : null === (_context$config$input = _context$config.inputStream) || void 0 === _context$config$input ? void 0 : _context$config$input.target), type = null == context ? void 0 : null === (_context$config2 = context.config) || void 0 === _context$config2 ? void 0 : null === (_context$config2$inpu = _context$config2.inputStream) || void 0 === _context$config2$inpu ? void 0 : _context$config2$inpu.type;
                                if (!type) return null;
                                var container = function(canvasSize) {
                                    if ("undefined" != typeof document) {
                                        var image = getCanvasAndContext("canvas.imgBuffer", "imgBuffer"), overlay = getCanvasAndContext("canvas.drawingBuffer", "drawingBuffer");
                                        return image.canvas.width = overlay.canvas.width = canvasSize.x, image.canvas.height = overlay.canvas.height = canvasSize.y, {
                                            dom: {
                                                image: image.canvas,
                                                overlay: overlay.canvas
                                            },
                                            ctx: {
                                                image: image.context,
                                                overlay: overlay.context
                                            }
                                        };
                                    }
                                    return null;
                                }(context.inputStream.getCanvasSize());
                                if (!container) return {
                                    dom: {
                                        image: null,
                                        overlay: null
                                    },
                                    ctx: {
                                        image: null,
                                        overlay: null
                                    }
                                };
                                var dom = container.dom;
                                return "undefined" != typeof document && viewport && ("ImageStream" !== type || viewport.contains(dom.image) || viewport.appendChild(dom.image), viewport.contains(dom.overlay) || viewport.appendChild(dom.overlay)), container;
                            }(this.context);
                            if (container) {
                                var ctx = container.ctx, dom = container.dom;
                                this.context.canvasContainer.dom.image = dom.image, this.context.canvasContainer.dom.overlay = dom.overlay, this.context.canvasContainer.ctx.image = ctx.image, this.context.canvasContainer.ctx.overlay = ctx.overlay;
                            }
                        }
                    },
                    {
                        key: "initInputStream",
                        value: function(callback) {
                            if (this.context.config && this.context.config.inputStream) {
                                var _this$context$config$ = this.context.config.inputStream, inputType = _this$context$config$.type, constraints = _this$context$config$.constraints, _setupInputStream = // CONCATENATED MODULE: ./src/quagga/setupInputStream.ts
                                // TODO: need to create an InputStream typescript interface, so we don't have an "any" in the next line
                                function() {
                                    var type = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "LiveStream", viewport = arguments.length > 1 ? arguments[1] : void 0, InputStream = arguments.length > 2 ? arguments[2] : void 0;
                                    switch(type){
                                        case "VideoStream":
                                            var video = document.createElement("video");
                                            return {
                                                video: video,
                                                inputStream: InputStream.createVideoStream(video)
                                            };
                                        case "ImageStream":
                                            return {
                                                inputStream: InputStream.createImageStream()
                                            };
                                        case "LiveStream":
                                            var _video = null;
                                            return !viewport || (_video = viewport.querySelector("video")) || (_video = document.createElement("video"), viewport.appendChild(_video)), {
                                                video: _video,
                                                inputStream: InputStream.createLiveStream(_video)
                                            };
                                        default:
                                            return console.error("* setupInputStream invalid type ".concat(type)), {
                                                video: null,
                                                inputStream: null
                                            };
                                    }
                                }(inputType, this.getViewPort(), inputStreamFactory), video = _setupInputStream.video, inputStream = _setupInputStream.inputStream;
                                "LiveStream" === inputType && video && camera_access.request(video, constraints).then(function() {
                                    return inputStream.trigger("canrecord");
                                }).catch(function(err) {
                                    return callback(err);
                                }), inputStream.setAttribute("preload", "auto"), inputStream.setInputStream(this.context.config.inputStream), inputStream.addEventListener("canrecord", this.canRecord.bind(void 0, callback)), this.context.inputStream = inputStream;
                            }
                        }
                    },
                    {
                        key: "getBoundingBoxes",
                        value: function() {
                            var _this$context$config3;
                            return null !== (_this$context$config3 = this.context.config) && void 0 !== _this$context$config3 && _this$context$config3.locate ? barcode_locator.a.locate() : [
                                [
                                    Object(gl_vec2.clone)(this.context.boxSize[0]),
                                    Object(gl_vec2.clone)(this.context.boxSize[1]),
                                    Object(gl_vec2.clone)(this.context.boxSize[2]),
                                    Object(gl_vec2.clone)(this.context.boxSize[3])
                                ]
                            ];
                        }
                    },
                    {
                        key: "transformResult",
                        value: function(result) {
                            var line, _this2 = this, topRight = this.context.inputStream.getTopRight(), xOffset = topRight.x, yOffset = topRight.y;
                            if ((0 !== xOffset || 0 !== yOffset) && (result.barcodes && // TODO: BarcodeInfo may not be the right type here.
                            result.barcodes.forEach(function(barcode) {
                                return _this2.transformResult(barcode);
                            }), result.line && 2 === result.line.length && (line = result.line, line[0].x += xOffset, line[0].y += yOffset, line[1].x += xOffset, line[1].y += yOffset), result.box && moveBox(result.box, xOffset, yOffset), result.boxes && result.boxes.length > 0)) for(var i = 0; i < result.boxes.length; i++)moveBox(result.boxes[i], xOffset, yOffset);
                        }
                    },
                    {
                        key: "addResult",
                        value: function(result, imageData) {
                            var _this3 = this;
                            imageData && this.context.resultCollector && (result.barcodes ? result.barcodes.filter(function(barcode) {
                                return barcode.codeResult;
                            }).forEach(function(barcode) {
                                return _this3.addResult(barcode, imageData);
                            }) : result.codeResult && this.context.resultCollector.addResult(imageData, this.context.inputStream.getCanvasSize(), result.codeResult)); // TODO: Figure out what data structure holds a "barcodes" result, if any...
                        }
                    },
                    {
                        key: "hasCodeResult",
                        value: function(result) {
                            return !!(result && (result.barcodes ? result.barcodes.some(function(barcode) {
                                return barcode.codeResult;
                            }) : result.codeResult));
                        }
                    },
                    {
                        key: "publishResult",
                        value: function() {
                            var result = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, imageData = arguments.length > 1 ? arguments[1] : void 0, resultToPublish = result;
                            result && this.context.onUIThread && (this.transformResult(result), this.addResult(result, imageData), resultToPublish = result.barcodes || result), events.publish("processed", resultToPublish), this.hasCodeResult(result) && events.publish("detected", resultToPublish);
                        }
                    },
                    {
                        key: "locateAndDecode",
                        value: function() {
                            var boxes = this.getBoundingBoxes();
                            if (boxes) {
                                var _this$context$inputIm3, decodeResult = this.context.decoder.decodeFromBoundingBoxes(boxes) || {};
                                decodeResult.boxes = boxes, this.publishResult(decodeResult, null === (_this$context$inputIm3 = this.context.inputImageWrapper) || void 0 === _this$context$inputIm3 ? void 0 : _this$context$inputIm3.data);
                            } else {
                                var _this$context$inputIm4, imageResult = this.context.decoder.decodeFromImage(this.context.inputImageWrapper);
                                imageResult ? this.publishResult(imageResult, null === (_this$context$inputIm4 = this.context.inputImageWrapper) || void 0 === _this$context$inputIm4 ? void 0 : _this$context$inputIm4.data) : this.publishResult();
                            }
                        }
                    },
                    {
                        key: "startContinuousUpdate",
                        value: function() {
                            var _this$context$config4, _this4 = this, next = null, delay = 1000 / ((null === (_this$context$config4 = this.context.config) || void 0 === _this$context$config4 ? void 0 : _this$context$config4.frequency) || 60);
                            this.context.stopped = !1;
                            var context = this.context;
                            !function newFrame(timestamp) {
                                next = next || timestamp, context.stopped || (timestamp >= next && (next += delay, _this4.update()), window.requestAnimationFrame(newFrame));
                            }(performance.now());
                        }
                    },
                    {
                        key: "start",
                        value: function() {
                            var _this$context$config5, _this$context$config6;
                            this.context.onUIThread && (null === (_this$context$config5 = this.context.config) || void 0 === _this$context$config5 ? void 0 : null === (_this$context$config6 = _this$context$config5.inputStream) || void 0 === _this$context$config6 ? void 0 : _this$context$config6.type) === "LiveStream" ? this.startContinuousUpdate() : this.update();
                        }
                    },
                    {
                        key: "stop",
                        value: (_stop = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee() {
                            var _this$context$config7;
                            return regenerator_default.a.wrap(function(_context) {
                                for(;;)switch(_context.prev = _context.next){
                                    case 0:
                                        if (this.context.stopped = !0, adjustWorkerPool(0), !(null !== (_this$context$config7 = this.context.config) && void 0 !== _this$context$config7 && _this$context$config7.inputStream && "LiveStream" === this.context.config.inputStream.type)) {
                                            _context.next = 6;
                                            break;
                                        }
                                        return _context.next = 5, camera_access.release();
                                    case 5:
                                        this.context.inputStream.clearEventHandlers();
                                    case 6:
                                    case "end":
                                        return _context.stop();
                                }
                            }, _callee, this);
                        })), function() {
                            return _stop.apply(this, arguments);
                        })
                    },
                    {
                        key: "setReaders",
                        value: function(readers) {
                            this.context.decoder && this.context.decoder.setReaders(readers), workerPool.forEach(function(workerThread) {
                                return workerThread.worker.postMessage({
                                    cmd: "setReaders",
                                    readers: readers
                                });
                            });
                        }
                    },
                    {
                        key: "registerReader",
                        value: function(name, reader) {
                            barcode_decoder.registerReader(name, reader), this.context.decoder && this.context.decoder.registerReader(name, reader), workerPool.forEach(function(workerThread) {
                                return workerThread.worker.postMessage({
                                    cmd: "registerReader",
                                    name: name,
                                    reader: reader
                                });
                            });
                        }
                    }
                ]), Quagga;
            }(), instance = new quagga_Quagga(), quagga_context = instance.context, QuaggaJSStaticInterface = {
                init: function(config, cb, imageWrapper) {
                    var promise, quaggaInstance = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : instance;
                    return cb || (promise = new Promise(function(resolve, reject) {
                        cb = function(err) {
                            err ? reject(err) : resolve();
                        };
                    })), quaggaInstance.context.config = merge_default()({}, config_config, config), quaggaInstance.context.config.numOfWorkers > 0 && (quaggaInstance.context.config.numOfWorkers = 0), imageWrapper ? (quaggaInstance.context.onUIThread = !1, quaggaInstance.initializeData(imageWrapper), cb && cb()) : quaggaInstance.initInputStream(cb), promise;
                },
                start: function() {
                    return instance.start();
                },
                stop: function() {
                    return instance.stop();
                },
                pause: function() {
                    quagga_context.stopped = !0;
                },
                onDetected: function(callback) {
                    if (!callback || "function" != typeof callback && ("object" !== typeof_default()(callback) || !callback.callback)) {
                        console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
                        return;
                    }
                    events.subscribe("detected", callback);
                },
                offDetected: function(callback) {
                    events.unsubscribe("detected", callback);
                },
                onProcessed: function(callback) {
                    if (!callback || "function" != typeof callback && ("object" !== typeof_default()(callback) || !callback.callback)) {
                        console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
                        return;
                    }
                    events.subscribe("processed", callback);
                },
                offProcessed: function(callback) {
                    events.unsubscribe("processed", callback);
                },
                setReaders: function(readers) {
                    if (!readers) {
                        console.trace("* warning: Quagga.setReaders called with no readers, ignoring");
                        return;
                    }
                    instance.setReaders(readers);
                },
                registerReader: function(name, reader) {
                    if (!name) {
                        console.trace("* warning: Quagga.registerReader called with no name, ignoring");
                        return;
                    }
                    if (!reader) {
                        console.trace("* warning: Quagga.registerReader called with no reader, ignoring");
                        return;
                    }
                    instance.registerReader(name, reader);
                },
                registerResultCollector: function(resultCollector) {
                    resultCollector && "function" == typeof resultCollector.addResult && (quagga_context.resultCollector = resultCollector);
                },
                get canvas () {
                    return quagga_context.canvasContainer;
                },
                decodeSingle: function(config, resultCallback) {
                    var _this = this, quaggaInstance = new quagga_Quagga();
                    return (config = merge_default()({
                        inputStream: {
                            type: "ImageStream",
                            sequence: !1,
                            size: 800,
                            src: config.src
                        },
                        numOfWorkers: config.debug ? 0 : 1,
                        locator: {
                            halfSample: !1
                        }
                    }, config)).numOfWorkers > 0 && (config.numOfWorkers = 0), config.numOfWorkers > 0 && ("undefined" == typeof Blob || "undefined" == typeof Worker) && (console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0"), config.numOfWorkers = 0), new Promise(function(resolve, reject) {
                        try {
                            _this.init(config, function() {
                                events.once("processed", function(result) {
                                    quaggaInstance.stop(), resultCallback && resultCallback.call(null, result), resolve(result);
                                }, !0), quaggaInstance.start();
                            }, null, quaggaInstance);
                        } catch (err) {
                            reject(err);
                        }
                    });
                },
                // add the usually expected "default" for use with require, build step won't allow us to
                // write to module.exports so do it here.
                get default () {
                    return QuaggaJSStaticInterface;
                },
                Readers: reader_namespaceObject,
                CameraAccess: camera_access,
                ImageDebug: image_debug.a,
                ImageWrapper: image_wrapper.a,
                ResultCollector: result_collector
            };
            __webpack_exports__.default = QuaggaJSStaticInterface;
        /***/ }
    ]).default;
});
