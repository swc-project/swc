!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : "object" == typeof exports ? exports.Quagga = factory() : root.Quagga = factory();
}(window, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.l = !0, module.exports;
        }
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.r = function(exports) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(exports, "__esModule", {
                value: !0
            });
        }, __webpack_require__.t = function(value, mode) {
            if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
            var ns = Object.create(null);
            if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            }), 2 & mode && "string" != typeof value) for(var key1 in value)__webpack_require__.d(ns, key1, (function(key) {
                return value[key];
            }).bind(null, key1));
            return ns;
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "/", __webpack_require__(__webpack_require__.s = 89);
    }([
        function(module, exports) {
            module.exports = function(obj, key, value) {
                return key in obj ? Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : obj[key] = value, obj;
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            function _getPrototypeOf(o1) {
                return module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                }, module.exports.default = module.exports, module.exports.__esModule = !0, _getPrototypeOf(o1);
            }
            module.exports = _getPrototypeOf, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            function _defineProperties(target, props) {
                for(var i = 0; i < props.length; i++){
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            module.exports = function(Constructor, protoProps, staticProps) {
                return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            var _typeof = __webpack_require__(19).default, assertThisInitialized = __webpack_require__(1);
            module.exports = function(self, call) {
                if (call && ("object" === _typeof(call) || "function" == typeof call)) return call;
                if (void 0 !== call) throw new TypeError("Derived constructors may only return object or undefined");
                return assertThisInitialized(self);
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            var setPrototypeOf = __webpack_require__(41);
            module.exports = function(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && setPrototypeOf(subClass, superClass);
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            module.exports = {
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
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "h", function() {
                return imageRef;
            }), __webpack_require__.d(__webpack_exports__, "i", function() {
                return otsuThreshold;
            }), __webpack_require__.d(__webpack_exports__, "b", function() {
                return cv_utils_cluster;
            }), __webpack_require__.d(__webpack_exports__, "j", function() {
                return topGeneric;
            }), __webpack_require__.d(__webpack_exports__, "e", function() {
                return grayAndHalfSampleFromCanvasData;
            }), __webpack_require__.d(__webpack_exports__, "c", function() {
                return computeGray;
            }), __webpack_require__.d(__webpack_exports__, "f", function() {
                return halfSample;
            }), __webpack_require__.d(__webpack_exports__, "g", function() {
                return hsv2rgb;
            }), __webpack_require__.d(__webpack_exports__, "a", function() {
                return calculatePatchSize;
            }), __webpack_require__.d(__webpack_exports__, "d", function() {
                return computeImageArea;
            });
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
                            Math.sin(center.rad), 
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
            function imageRef(x, y) {
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
            function otsuThreshold(imageWrapper1, targetWrapper1) {
                var threshold1 = function(imageWrapper2) {
                    var hist1, bitsPerPixel1 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 8;
                    function px(init, end) {
                        for(var sum = 0, i = init; i <= end; i++)sum += hist1[i];
                        return sum;
                    }
                    function mx(init, end) {
                        for(var sum = 0, i = init; i <= end; i++)sum += i * hist1[i];
                        return sum;
                    }
                    return function() {
                        var p1, p2, p12, m1, m2, m12, vet = [
                            0
                        ], max = (1 << bitsPerPixel1) - 1;
                        hist1 = function(imageWrapper, bitsPerPixel) {
                            bitsPerPixel || (bitsPerPixel = 8);
                            for(var imageData = imageWrapper.data, length = imageData.length, bitShift = 8 - bitsPerPixel, hist = new Int32Array(1 << bitsPerPixel); length--;)hist[imageData[length] >> bitShift]++;
                            return hist;
                        }(imageWrapper2, bitsPerPixel1);
                        for(var k = 1; k < max; k++)p1 = px(0, k), p2 = px(k + 1, max), p12 = p1 * p2, 0 === p12 && (p12 = 1), m1 = mx(0, k) * p2, m2 = mx(k + 1, max) * p1, m12 = m1 - m2, vet[k] = m12 * m12 / p12;
                        return array_helper.a.maxIndex(vet);
                    }() << 8 - bitsPerPixel1;
                }(imageWrapper1);
                return !function(imageWrapper, threshold, targetWrapper) {
                    targetWrapper || (targetWrapper = imageWrapper);
                    for(var imageData = imageWrapper.data, length = imageData.length, targetData = targetWrapper.data; length--;)targetData[length] = imageData[length] < threshold ? 1 : 0;
                }(imageWrapper1, threshold1, targetWrapper1), threshold1;
            }
            function cv_utils_cluster(points, threshold, property) {
                var i, k, thisCluster, point, clusters = [];
                function addToCluster(newPoint) {
                    var found = !1;
                    for(k = 0; k < clusters.length; k++)(thisCluster = clusters[k]).fits(newPoint) && (thisCluster.add(newPoint), found = !0);
                    return found;
                }
                for(property || (property = "rad"), i = 0; i < points.length; i++)addToCluster(point = cluster.createPoint(points[i], i, property)) || clusters.push(cluster.create(point, threshold));
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
                    for(i = 0; i < outWidth; i++)outArray[outImgIdx] = (0.299 * canvasData[4 * topRowIdx + 0] + 0.587 * canvasData[4 * topRowIdx + 1] + 0.114 * canvasData[4 * topRowIdx + 2] + (0.299 * canvasData[(topRowIdx + 1) * 4 + 0] + 0.587 * canvasData[(topRowIdx + 1) * 4 + 1] + 0.114 * canvasData[(topRowIdx + 1) * 4 + 2]) + (0.299 * canvasData[4 * bottomRowIdx + 0] + 0.587 * canvasData[4 * bottomRowIdx + 1] + 0.114 * canvasData[4 * bottomRowIdx + 2]) + (0.299 * canvasData[(bottomRowIdx + 1) * 4 + 0] + 0.587 * canvasData[(bottomRowIdx + 1) * 4 + 1] + 0.114 * canvasData[(bottomRowIdx + 1) * 4 + 2])) / 4, outImgIdx++, topRowIdx += 2, bottomRowIdx += 2;
                    topRowIdx += inWidth, bottomRowIdx += inWidth;
                }
            }
            function computeGray(imageData, outArray, config) {
                var l = imageData.length / 4 | 0;
                if (config && !0 === config.singleChannel) for(var i = 0; i < l; i++)outArray[i] = imageData[4 * i + 0];
                else for(var _i = 0; _i < l; _i++)outArray[_i] = 0.299 * imageData[4 * _i + 0] + 0.587 * imageData[4 * _i + 1] + 0.114 * imageData[4 * _i + 2];
            }
            function halfSample(inImgWrapper, outImgWrapper) {
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
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = {
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
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = {
                init: function(arr, val) {
                    for(var l = arr.length; l--;)arr[l] = val;
                },
                shuffle: function(arr) {
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
                threshold: function(arr, _threshold, scoreFunc) {
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
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83), _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__), _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3), _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__), _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4), _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__), gl_vec2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7), _cv_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8), _array_helper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(10), vec2 = {
                clone: gl_vec2__WEBPACK_IMPORTED_MODULE_4__.clone
            };
            function assertNumberPositive(val) {
                if (val < 0) throw new Error("expected positive number, received ".concat(val));
            }
            var ImageWrapper1 = function() {
                function ImageWrapper(size, data) {
                    var ArrayType = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Uint8Array, initialize = arguments.length > 3 ? arguments[3] : void 0;
                    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, ImageWrapper), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "data", void 0), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "size", void 0), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "indexMapping", void 0), data ? this.data = data : (this.data = new ArrayType(size.x * size.y), initialize && _array_helper__WEBPACK_IMPORTED_MODULE_6__.a.init(this.data, 0)), this.size = size;
                }
                return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(ImageWrapper, [
                    {
                        key: "inImageWithBorder",
                        value: function(imgRef) {
                            var border = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                            return assertNumberPositive(border), imgRef.x >= 0 && imgRef.y >= 0 && imgRef.x < this.size.x + 2 * border && imgRef.y < this.size.y + 2 * border;
                        }
                    },
                    {
                        key: "subImageAsCopy",
                        value: function(imageWrapper, from) {
                            assertNumberPositive(from.x), assertNumberPositive(from.y);
                            for(var _imageWrapper$size = imageWrapper.size, sizeX = _imageWrapper$size.x, sizeY = _imageWrapper$size.y, x = 0; x < sizeX; x++)for(var y = 0; y < sizeY; y++)imageWrapper.data[y * sizeX + x] = this.data[(from.y + y) * this.size.x + from.x + x];
                            return imageWrapper;
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
                            for(var _this$size = this.size, width = _this$size.x, height = _this$size.y, i = 0; i < width; i++)this.data[i] = this.data[(height - 1) * width + i] = 0;
                            for(var _i2 = 1; _i2 < height - 1; _i2++)this.data[_i2 * width] = this.data[_i2 * width + (width - 1)] = 0;
                            return delete this.indexMapping, this;
                        }
                    },
                    {
                        key: "moments",
                        value: function(labelCount) {
                            var x, y, val, ysq, i, label, mu11, mu02, mu20, x_, y_, tmp, data = this.data, height = this.size.y, width = this.size.x, labelSum = [], result = [], PI = Math.PI, PI_4 = PI / 4;
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
                            for(i = 0; i < labelCount; i++)isNaN((label = labelSum[i]).m00) || 0 === label.m00 || (x_ = label.m10 / label.m00, y_ = label.m01 / label.m00, mu11 = label.m11 / label.m00 - x_ * y_, mu02 = label.m02 / label.m00 - y_ * y_, mu20 = label.m20 / label.m00 - x_ * x_, tmp = (mu02 - mu20) / (2 * mu11), tmp = 0.5 * Math.atan(tmp) + (mu11 >= 0 ? PI_4 : -PI_4) + PI, label.theta = (180 * tmp / PI + 90) % 180 - 90, label.theta < 0 && (label.theta += 180), label.rad = tmp > PI ? tmp - PI : tmp, label.vec = vec2.clone([
                                Math.cos(tmp),
                                Math.sin(tmp), 
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
                            if (!ctx) throw new Error("Unable to get canvas context");
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
                            if (!ctx) throw new Error("Unable to get canvas context");
                            for(var frame = ctx.getImageData(from.x, from.y, this.size.x, this.size.y), data = frame.data, length = this.data.length; length--;){
                                hsv[0] = this.data[length] * adjustedScale, result = hsv[0] <= 0 ? whiteRgb : hsv[0] >= 360 ? blackRgb : Object(_cv_utils__WEBPACK_IMPORTED_MODULE_5__.g)(hsv, rgb);
                                var pos = 4 * length, _result = result, _result2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_result, 3);
                                data[pos] = _result2[0], data[pos + 1] = _result2[1], data[pos + 2] = _result2[2], data[pos + 3] = 255;
                            }
                            ctx.putImageData(frame, from.x, from.y);
                        }
                    }, 
                ]), ImageWrapper;
            }();
            __webpack_exports__.a = ImageWrapper1;
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(228);
        },
        function(module, exports, __webpack_require__) {
            var superPropBase = __webpack_require__(227);
            function _get(target1, property1, receiver1) {
                return "undefined" != typeof Reflect && Reflect.get ? (module.exports = _get = Reflect.get, module.exports.default = module.exports, module.exports.__esModule = !0) : (module.exports = _get = function(target, property, receiver) {
                    var base = superPropBase(target, property);
                    if (base) {
                        var desc = Object.getOwnPropertyDescriptor(base, property);
                        return desc.get ? desc.get.call(receiver) : desc.value;
                    }
                }, module.exports.default = module.exports, module.exports.__esModule = !0), _get(target1, property1, receiver1 || target1);
            }
            module.exports = _get, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(value) {
                var type = typeof value;
                return null != value && ("object" == type || "function" == type);
            };
        },
        function(module, exports) {
            var isArray = Array.isArray;
            module.exports = isArray;
        },
        function(module, exports, __webpack_require__) {
            var baseMerge = __webpack_require__(90), merge = __webpack_require__(145)(function(object, source, srcIndex) {
                baseMerge(object, source, srcIndex);
            });
            module.exports = merge;
        },
        function(module, exports, __webpack_require__) {
            var freeGlobal = __webpack_require__(45), freeSelf = "object" == typeof self && self && self.Object === Object && self, root = freeGlobal || freeSelf || Function("return this")();
            module.exports = root;
        },
        function(module, exports) {
            module.exports = function(value) {
                return null != value && "object" == typeof value;
            };
        },
        function(module, exports) {
            function _typeof(obj1) {
                return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? (module.exports = _typeof = function(obj) {
                    return typeof obj;
                }, module.exports.default = module.exports, module.exports.__esModule = !0) : (module.exports = _typeof = function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                }, module.exports.default = module.exports, module.exports.__esModule = !0), _typeof(obj1);
            }
            module.exports = _typeof, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                try {
                    var info = gen[key](arg), value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
            }
            module.exports = function(fn) {
                return function() {
                    var self = this, args = arguments;
                    return new Promise(function(resolve, reject) {
                        var gen = fn.apply(self, args);
                        function _next(value) {
                            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                        }
                        function _throw(err) {
                            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                        }
                        _next(void 0);
                    });
                };
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = {
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
                    ], 
                ],
                create: function(imageWrapper, labelWrapper) {
                    var pos, imageData = imageWrapper.data, labelData = labelWrapper.data, searchDirections = this.searchDirections, width = imageWrapper.size.x;
                    function _trace(current, color, label, edgelabel) {
                        var i, y, x;
                        for(i = 0; i < 7; i++){
                            if (y = current.cy + searchDirections[current.dir][0], x = current.cx + searchDirections[current.dir][1], pos = y * width + x, imageData[pos] === color && (0 === labelData[pos] || labelData[pos] === label)) return labelData[pos] = label, current.cy = y, current.cx = x, !0;
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
                        contourTracing: function(sy1, sx1, label1, color1, edgelabel1) {
                            return function(sy, sx, label, color, edgelabel) {
                                var Cv, P, ldir, Fv = null, current = {
                                    cx: sx,
                                    cy: sy,
                                    dir: 0
                                };
                                if (_trace(current, color, label, edgelabel)) {
                                    Cv = Fv = vertex2D(sx, sy, current.dir), ldir = current.dir, P = vertex2D(current.cx, current.cy, 0), P.prev = Cv, Cv.next = P, P.next = null, Cv = P;
                                    do current.dir = (current.dir + 6) % 8, _trace(current, color, label, edgelabel), ldir !== current.dir ? (Cv.dir = current.dir, (P = vertex2D(current.cx, current.cy, 0)).prev = Cv, Cv.next = P, P.next = null, Cv = P) : (Cv.dir = ldir, Cv.x = current.cx, Cv.y = current.cy), ldir = current.dir;
                                    while (current.cx !== sx || current.cy !== sy)
                                    Fv.prev = Cv.prev, Cv.prev.next = Fv;
                                }
                                return Fv;
                            }(sy1, sx1, label1, color1, edgelabel1);
                        }
                    };
                }
            };
        },
        function(module, exports, __webpack_require__) {
            var Symbol = __webpack_require__(27), getRawTag = __webpack_require__(103), objectToString = __webpack_require__(104), symToStringTag = Symbol ? Symbol.toStringTag : void 0;
            module.exports = function(value) {
                return null == value ? void 0 === value ? "[object Undefined]" : "[object Null]" : symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
            };
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            (function(global) {
                var _config, _currentImageWrapper, _skelImageWrapper, _subImageWrapper, _labelImageWrapper, _patchGrid, _patchLabelGrid, _imageToPatchGrid, _binaryImageWrapper, _patchSize, _inputImageWrapper, _skeletonizer, gl_vec2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7), gl_mat2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34), _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11), _common_cv_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10), _common_image_debug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9), _rasterizer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(87), _tracer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(21), _skeletonizer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(88), _canvasContainer = {
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
                function boxFromPatches(patches) {
                    var overAvg, i, j, patch, transMat, box, scale, minx = _binaryImageWrapper.size.x, miny = _binaryImageWrapper.size.y, maxx = -_binaryImageWrapper.size.x, maxy = -_binaryImageWrapper.size.y;
                    for(i = 0, overAvg = 0; i < patches.length; i++)overAvg += (patch = patches[i]).rad, _config.debug.showPatches && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__.a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                        color: "red"
                    });
                    for(overAvg /= patches.length, (overAvg = (180 * overAvg / Math.PI + 90) % 180 - 90) < 0 && (overAvg += 180), overAvg = (180 - overAvg) * Math.PI / 180, transMat = gl_mat2__WEBPACK_IMPORTED_MODULE_1__.copy(gl_mat2__WEBPACK_IMPORTED_MODULE_1__.create(), [
                        Math.cos(overAvg),
                        Math.sin(overAvg),
                        -Math.sin(overAvg),
                        Math.cos(overAvg), 
                    ]), i = 0; i < patches.length; i++){
                        for(j = 0, patch = patches[i]; j < 4; j++)gl_vec2__WEBPACK_IMPORTED_MODULE_0__.transformMat2(patch.box[j], patch.box[j], transMat);
                        _config.debug.boxFromPatches.showTransformed && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__.a.drawPath(patch.box, {
                            x: 0,
                            y: 1
                        }, _canvasContainer.ctx.binary, {
                            color: "#99ff00",
                            lineWidth: 2
                        });
                    }
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
                        ], 
                    ], _config.debug.boxFromPatches.showTransformedBox && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__.a.drawPath(box, {
                        x: 0,
                        y: 1
                    }, _canvasContainer.ctx.binary, {
                        color: "#ff0000",
                        lineWidth: 2
                    }), scale = _config.halfSample ? 2 : 1, transMat = gl_mat2__WEBPACK_IMPORTED_MODULE_1__.invert(transMat, transMat), j = 0; j < 4; j++)gl_vec2__WEBPACK_IMPORTED_MODULE_0__.transformMat2(box[j], box[j], transMat);
                    for(_config.debug.boxFromPatches.showBB && _common_image_debug__WEBPACK_IMPORTED_MODULE_5__.a.drawPath(box, {
                        x: 0,
                        y: 1
                    }, _canvasContainer.ctx.binary, {
                        color: "#ff0000",
                        lineWidth: 2
                    }), j = 0; j < 4; j++)gl_vec2__WEBPACK_IMPORTED_MODULE_0__.scale(box[j], box[j], scale);
                    return box;
                }
                function skeletonize(x, y) {
                    _binaryImageWrapper.subImageAsCopy(_subImageWrapper, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.h)(x, y)), _skeletonizer.skeletonize(), _config.debug.showSkeleton && _skelImageWrapper.overlay(_canvasContainer.dom.binary, 360, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.h)(x, y));
                }
                function describePatch(moments1, patchPos, x, y) {
                    var k, avg, matchingMoments, patch, eligibleMoments = [], patchesFound = [], minComponentWeight = Math.ceil(_patchSize.x / 3);
                    if (moments1.length >= 2) {
                        for(k = 0; k < moments1.length; k++)moments1[k].m00 > minComponentWeight && eligibleMoments.push(moments1[k]);
                        if (eligibleMoments.length >= 2) {
                            for(k = 0, matchingMoments = function(moments) {
                                var clusters = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.b)(moments, 0.9), topCluster = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.j)(clusters, 1, function(e) {
                                    return e.getPoints().length;
                                }), points = [], result = [];
                                if (1 === topCluster.length) {
                                    points = topCluster[0].item.getPoints();
                                    for(var i = 0; i < points.length; i++)result.push(points[i].point);
                                }
                                return result;
                            }(eligibleMoments), avg = 0; k < matchingMoments.length; k++)avg += matchingMoments[k].rad;
                            matchingMoments.length > 1 && matchingMoments.length >= eligibleMoments.length / 4 * 3 && matchingMoments.length > moments1.length / 4 && (avg /= matchingMoments.length, patch = {
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
                                        y + _subImageWrapper.size.y, 
                                    ]),
                                    gl_vec2__WEBPACK_IMPORTED_MODULE_0__.clone([
                                        x,
                                        y + _subImageWrapper.size.y
                                    ]), 
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
                }
                __webpack_exports__.a = {
                    init: function(inputImageWrapper, config) {
                        var skeletonImageData;
                        _config = config, _inputImageWrapper = inputImageWrapper, _currentImageWrapper = _config.halfSample ? new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a({
                            x: _inputImageWrapper.size.x / 2 | 0,
                            y: _inputImageWrapper.size.y / 2 | 0
                        }) : _inputImageWrapper, _patchSize = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.a)(_config.patchSize, _currentImageWrapper.size), _numPatches.x = _currentImageWrapper.size.x / _patchSize.x | 0, _numPatches.y = _currentImageWrapper.size.y / _patchSize.y | 0, _binaryImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a(_currentImageWrapper.size, void 0, Uint8Array, !1), _labelImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a(_patchSize, void 0, Array, !0), skeletonImageData = new ArrayBuffer(65536), _subImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a(_patchSize, new Uint8Array(skeletonImageData, 0, _patchSize.x * _patchSize.y)), _skelImageWrapper = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a(_patchSize, new Uint8Array(skeletonImageData, _patchSize.x * _patchSize.y * 3, _patchSize.x * _patchSize.y), void 0, !0), _skeletonizer = Object(_skeletonizer__WEBPACK_IMPORTED_MODULE_8__.a)("undefined" != typeof window ? window : "undefined" != typeof self ? self : global, {
                            size: _patchSize.x
                        }, skeletonImageData), _imageToPatchGrid = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a({
                            x: _currentImageWrapper.size.x / _subImageWrapper.size.x | 0,
                            y: _currentImageWrapper.size.y / _subImageWrapper.size.y | 0
                        }, void 0, Array, !0), _patchGrid = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a(_imageToPatchGrid.size, void 0, void 0, !0), _patchLabelGrid = new _common_image_wrapper__WEBPACK_IMPORTED_MODULE_2__.a(_imageToPatchGrid.size, void 0, Int32Array, !0), _config.useWorker || "undefined" == typeof document || (_canvasContainer.dom.binary = document.createElement("canvas"), _canvasContainer.dom.binary.className = "binaryBuffer", !0 === _config.debug.showCanvas && document.querySelector("#debug").appendChild(_canvasContainer.dom.binary), _canvasContainer.ctx.binary = _canvasContainer.dom.binary.getContext("2d"), _canvasContainer.dom.binary.width = _binaryImageWrapper.size.x, _canvasContainer.dom.binary.height = _binaryImageWrapper.size.y);
                    },
                    locate: function() {
                        _config.halfSample && Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.f)(_inputImageWrapper, _currentImageWrapper), Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.i)(_currentImageWrapper, _binaryImageWrapper), _binaryImageWrapper.zeroBorder(), _config.debug.showCanvas && _binaryImageWrapper.show(_canvasContainer.dom.binary, 255);
                        var patchesFound1 = function() {
                            var i, j, x, y, moments, rasterizer, rasterResult, patch, patchesFound = [];
                            for(i = 0; i < _numPatches.x; i++)for(j = 0; j < _numPatches.y; j++)x = _subImageWrapper.size.x * i, y = _subImageWrapper.size.y * j, skeletonize(x, y), _skelImageWrapper.zeroBorder(), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__.a.init(_labelImageWrapper.data, 0), rasterizer = _rasterizer__WEBPACK_IMPORTED_MODULE_6__.a.create(_skelImageWrapper, _labelImageWrapper), rasterResult = rasterizer.rasterize(0), _config.debug.showLabels && _labelImageWrapper.overlay(_canvasContainer.dom.binary, Math.floor(360 / rasterResult.count), {
                                x: x,
                                y: y
                            }), moments = _labelImageWrapper.moments(rasterResult.count), patchesFound = patchesFound.concat(describePatch(moments, [
                                i,
                                j
                            ], x, y));
                            if (_config.debug.showFoundPatches) for(i = 0; i < patchesFound.length; i++)patch = patchesFound[i], _common_image_debug__WEBPACK_IMPORTED_MODULE_5__.a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                            return patchesFound;
                        }();
                        if (patchesFound1.length < _numPatches.x * _numPatches.y * 0.05) return null;
                        var maxLabel1 = function(patchesFound) {
                            var j, patch, label = 0, currIdx = 0, hsv = [
                                0,
                                1,
                                1
                            ], rgb = [
                                0,
                                0,
                                0
                            ];
                            function notYetProcessed() {
                                var i;
                                for(i = 0; i < _patchLabelGrid.data.length; i++)if (0 === _patchLabelGrid.data[i] && 1 === _patchGrid.data[i]) return i;
                                return _patchLabelGrid.length;
                            }
                            function trace(currentIdx) {
                                var x, y, currentPatch, idx, dir, current = {
                                    x: currentIdx % _patchLabelGrid.size.x,
                                    y: currentIdx / _patchLabelGrid.size.x | 0
                                };
                                if (currentIdx < _patchLabelGrid.data.length) for(dir = 0, currentPatch = _imageToPatchGrid.data[currentIdx], _patchLabelGrid.data[currentIdx] = label; dir < _tracer__WEBPACK_IMPORTED_MODULE_7__.a.searchDirections.length; dir++){
                                    if (y = current.y + _tracer__WEBPACK_IMPORTED_MODULE_7__.a.searchDirections[dir][0], x = current.x + _tracer__WEBPACK_IMPORTED_MODULE_7__.a.searchDirections[dir][1], idx = y * _patchLabelGrid.size.x + x, 0 === _patchGrid.data[idx]) {
                                        _patchLabelGrid.data[idx] = Number.MAX_VALUE;
                                        continue;
                                    }
                                    0 === _patchLabelGrid.data[idx] && Math.abs(gl_vec2__WEBPACK_IMPORTED_MODULE_0__.dot(_imageToPatchGrid.data[idx].vec, currentPatch.vec)) > 0.95 && trace(idx);
                                }
                            }
                            for(_common_array_helper__WEBPACK_IMPORTED_MODULE_4__.a.init(_patchGrid.data, 0), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__.a.init(_patchLabelGrid.data, 0), _common_array_helper__WEBPACK_IMPORTED_MODULE_4__.a.init(_imageToPatchGrid.data, null), j = 0; j < patchesFound.length; j++)patch = patchesFound[j], _imageToPatchGrid.data[patch.index] = patch, _patchGrid.data[patch.index] = 1;
                            for(_patchGrid.zeroBorder(); (currIdx = notYetProcessed()) < _patchLabelGrid.data.length;)label++, trace(currIdx);
                            if (_config.debug.showPatchLabels) for(j = 0; j < _patchLabelGrid.data.length; j++)_patchLabelGrid.data[j] > 0 && _patchLabelGrid.data[j] <= label && (patch = _imageToPatchGrid.data[j], hsv[0] = _patchLabelGrid.data[j] / (label + 1) * 360, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.g)(hsv, rgb), _common_image_debug__WEBPACK_IMPORTED_MODULE_5__.a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                                color: "rgb(".concat(rgb.join(","), ")"),
                                lineWidth: 2
                            }));
                            return label;
                        }(patchesFound1);
                        if (maxLabel1 < 1) return null;
                        var topLabels1 = function(maxLabel) {
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
                        }(maxLabel1);
                        return 0 === topLabels1.length ? null : function(topLabels, maxLabel) {
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
                                if ((box = boxFromPatches(patches)) && (boxes.push(box), _config.debug.showRemainingPatchLabels)) for(j = 0; j < patches.length; j++)patch = patches[j], hsv[0] = topLabels[i].label / (maxLabel + 1) * 360, Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.g)(hsv, rgb), _common_image_debug__WEBPACK_IMPORTED_MODULE_5__.a.drawRect(patch.pos, _subImageWrapper.size, _canvasContainer.ctx.binary, {
                                    color: "rgb(".concat(rgb.join(","), ")"),
                                    lineWidth: 2
                                });
                            }
                            return boxes;
                        }(topLabels1, maxLabel1);
                    },
                    checkImageConstraints: function(inputStream, config) {
                        var patchSize, area, width = inputStream.getWidth(), height = inputStream.getHeight(), thisHalfSample = config.halfSample ? 0.5 : 1;
                        inputStream.getConfig().area && (area = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.d)(width, height, inputStream.getConfig().area), inputStream.setTopRight({
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
                        if (patchSize = Object(_common_cv_utils__WEBPACK_IMPORTED_MODULE_3__.a)(config.patchSize, size), console.log("Patch-Size: ".concat(JSON.stringify(patchSize))), inputStream.setWidth(Math.floor(Math.floor(size.x / patchSize.x) * (1 / thisHalfSample) * patchSize.x)), inputStream.setHeight(Math.floor(Math.floor(size.y / patchSize.y) * (1 / thisHalfSample) * patchSize.y)), inputStream.getWidth() % patchSize.x == 0 && inputStream.getHeight() % patchSize.y == 0) return !0;
                        throw new Error("Image dimensions do not comply with the current settings: Width (".concat(width, " )and height (").concat(height, ") must a multiple of ").concat(patchSize.x));
                    }
                };
            }).call(this, __webpack_require__(46));
        },
        function(module, exports, __webpack_require__) {
            var listCacheClear = __webpack_require__(92), listCacheDelete = __webpack_require__(93), listCacheGet = __webpack_require__(94), listCacheHas = __webpack_require__(95), listCacheSet = __webpack_require__(96);
            function ListCache(entries) {
                var index = -1, length = null == entries ? 0 : entries.length;
                for(this.clear(); ++index < length;){
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }
            ListCache.prototype.clear = listCacheClear, ListCache.prototype.delete = listCacheDelete, ListCache.prototype.get = listCacheGet, ListCache.prototype.has = listCacheHas, ListCache.prototype.set = listCacheSet, module.exports = ListCache;
        },
        function(module, exports, __webpack_require__) {
            var eq = __webpack_require__(26);
            module.exports = function(array, key) {
                for(var length = array.length; length--;)if (eq(array[length][0], key)) return length;
                return -1;
            };
        },
        function(module, exports) {
            module.exports = function(value, other) {
                return value === other || value != value && other != other;
            };
        },
        function(module, exports, __webpack_require__) {
            var Symbol = __webpack_require__(17).Symbol;
            module.exports = Symbol;
        },
        function(module, exports, __webpack_require__) {
            var nativeCreate = __webpack_require__(35)(Object, "create");
            module.exports = nativeCreate;
        },
        function(module, exports, __webpack_require__) {
            var isKeyable = __webpack_require__(117);
            module.exports = function(map, key) {
                var data = map.__data__;
                return isKeyable(key) ? data["string" == typeof key ? "string" : "hash"] : data.map;
            };
        },
        function(module, exports, __webpack_require__) {
            var baseIsArguments = __webpack_require__(132), isObjectLike = __webpack_require__(18), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, propertyIsEnumerable = objectProto.propertyIsEnumerable, isArguments = baseIsArguments(function() {
                return arguments;
            }()) ? baseIsArguments : function(value) {
                return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
            };
            module.exports = isArguments;
        },
        function(module, exports) {
            var reIsUint = /^(?:0|[1-9]\d*)$/;
            module.exports = function(value, length) {
                var type = typeof value;
                return !!(length = null == length ? 9007199254740991 : length) && ("number" == type || "symbol" != type && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
            };
        },
        function(module, exports, __webpack_require__) {
            var isArray = __webpack_require__(15), isKey = __webpack_require__(232), stringToPath = __webpack_require__(233), toString = __webpack_require__(236);
            module.exports = function(value, object) {
                return isArray(value) ? value : isKey(value, object) ? [
                    value
                ] : stringToPath(toString(value));
            };
        },
        function(module, exports, __webpack_require__) {
            var arrayWithoutHoles = __webpack_require__(224), iterableToArray = __webpack_require__(225), unsupportedIterableToArray = __webpack_require__(60), nonIterableSpread = __webpack_require__(226);
            module.exports = function(arr) {
                return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            module.exports = {
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
        },
        function(module, exports, __webpack_require__) {
            var baseIsNative = __webpack_require__(102), getValue = __webpack_require__(108);
            module.exports = function(object, key) {
                var value = getValue(object, key);
                return baseIsNative(value) ? value : void 0;
            };
        },
        function(module, exports, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isObject = __webpack_require__(14);
            module.exports = function(value) {
                if (!isObject(value)) return !1;
                var tag = baseGetTag(value);
                return "[object Function]" == tag || "[object GeneratorFunction]" == tag || "[object AsyncFunction]" == tag || "[object Proxy]" == tag;
            };
        },
        function(module, exports, __webpack_require__) {
            var defineProperty = __webpack_require__(49);
            module.exports = function(object, key, value) {
                "__proto__" == key && defineProperty ? defineProperty(object, key, {
                    configurable: !0,
                    enumerable: !0,
                    value: value,
                    writable: !0
                }) : object[key] = value;
            };
        },
        function(module1, exports) {
            module1.exports = function(module) {
                return module.webpackPolyfill || (module.deprecate = function() {}, module.paths = [], module.children || (module.children = []), Object.defineProperty(module, "loaded", {
                    enumerable: !0,
                    get: function() {
                        return module.l;
                    }
                }), Object.defineProperty(module, "id", {
                    enumerable: !0,
                    get: function() {
                        return module.i;
                    }
                }), module.webpackPolyfill = 1), module;
            };
        },
        function(module, exports, __webpack_require__) {
            var isFunction = __webpack_require__(36), isLength = __webpack_require__(40);
            module.exports = function(value) {
                return null != value && isLength(value.length) && !isFunction(value);
            };
        },
        function(module, exports) {
            module.exports = function(value) {
                return "number" == typeof value && value > -1 && value % 1 == 0 && value <= 9007199254740991;
            };
        },
        function(module, exports) {
            function _setPrototypeOf(o2, p3) {
                return module.exports = _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                }, module.exports.default = module.exports, module.exports.__esModule = !0, _setPrototypeOf(o2, p3);
            }
            module.exports = _setPrototypeOf, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isObjectLike = __webpack_require__(18);
            module.exports = function(value) {
                return "symbol" == typeof value || isObjectLike(value) && "[object Symbol]" == baseGetTag(value);
            };
        },
        function(module, exports, __webpack_require__) {
            var isSymbol = __webpack_require__(42), INFINITY = 1 / 0;
            module.exports = function(value) {
                if ("string" == typeof value || isSymbol(value)) return value;
                var result = value + "";
                return "0" == result && 1 / value == -INFINITY ? "-0" : result;
            };
        },
        function(module, exports, __webpack_require__) {
            var getNative = __webpack_require__(35), root = __webpack_require__(17), Map = getNative(root, "Map");
            module.exports = Map;
        },
        function(module, exports, __webpack_require__) {
            (function(global) {
                var freeGlobal = "object" == typeof global && global && global.Object === Object && global;
                module.exports = freeGlobal;
            }).call(this, __webpack_require__(46));
        },
        function(module, exports) {
            var g;
            g = function() {
                return this;
            }();
            try {
                g = g || new Function("return this")();
            } catch (e) {
                "object" == typeof window && (g = window);
            }
            module.exports = g;
        },
        function(module, exports, __webpack_require__) {
            var mapCacheClear = __webpack_require__(109), mapCacheDelete = __webpack_require__(116), mapCacheGet = __webpack_require__(118), mapCacheHas = __webpack_require__(119), mapCacheSet = __webpack_require__(120);
            function MapCache(entries) {
                var index = -1, length = null == entries ? 0 : entries.length;
                for(this.clear(); ++index < length;){
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }
            MapCache.prototype.clear = mapCacheClear, MapCache.prototype.delete = mapCacheDelete, MapCache.prototype.get = mapCacheGet, MapCache.prototype.has = mapCacheHas, MapCache.prototype.set = mapCacheSet, module.exports = MapCache;
        },
        function(module, exports, __webpack_require__) {
            var baseAssignValue = __webpack_require__(37), eq = __webpack_require__(26);
            module.exports = function(object, key, value) {
                (void 0 === value || eq(object[key], value)) && (void 0 !== value || key in object) || baseAssignValue(object, key, value);
            };
        },
        function(module, exports, __webpack_require__) {
            var getNative = __webpack_require__(35), defineProperty = function() {
                try {
                    var func = getNative(Object, "defineProperty");
                    return func({}, "", {}), func;
                } catch (e) {}
            }();
            module.exports = defineProperty;
        },
        function(module, exports, __webpack_require__) {
            var getPrototype = __webpack_require__(131)(Object.getPrototypeOf, Object);
            module.exports = getPrototype;
        },
        function(module, exports) {
            var objectProto = Object.prototype;
            module.exports = function(value) {
                var Ctor = value && value.constructor;
                return value === ("function" == typeof Ctor && Ctor.prototype || objectProto);
            };
        },
        function(module2, exports, __webpack_require__) {
            (function(module) {
                var root = __webpack_require__(17), stubFalse = __webpack_require__(134), freeExports = exports && !exports.nodeType && exports, freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module, moduleExports = freeModule && freeModule.exports === freeExports, Buffer = moduleExports ? root.Buffer : void 0, nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
                module.exports = nativeIsBuffer || stubFalse;
            }).call(this, __webpack_require__(38)(module2));
        },
        function(module, exports, __webpack_require__) {
            var baseIsTypedArray = __webpack_require__(136), baseUnary = __webpack_require__(137), nodeUtil = __webpack_require__(138), nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray, isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
            module.exports = isTypedArray;
        },
        function(module, exports) {
            module.exports = function(object, key) {
                if (("constructor" !== key || "function" != typeof object[key]) && "__proto__" != key) return object[key];
            };
        },
        function(module, exports, __webpack_require__) {
            var baseAssignValue = __webpack_require__(37), eq = __webpack_require__(26), hasOwnProperty = Object.prototype.hasOwnProperty;
            module.exports = function(object, key, value) {
                var objValue = object[key];
                hasOwnProperty.call(object, key) && eq(objValue, value) && (void 0 !== value || key in object) || baseAssignValue(object, key, value);
            };
        },
        function(module, exports, __webpack_require__) {
            var arrayLikeKeys = __webpack_require__(141), baseKeysIn = __webpack_require__(143), isArrayLike = __webpack_require__(39);
            module.exports = function(object) {
                return isArrayLike(object) ? arrayLikeKeys(object, !0) : baseKeysIn(object);
            };
        },
        function(module, exports) {
            function identity(value) {
                return value;
            }
            module.exports = identity;
        },
        function(module, exports, __webpack_require__) {
            var apply = __webpack_require__(147), nativeMax = Math.max;
            module.exports = function(func, start, transform) {
                return start = nativeMax(void 0 === start ? func.length - 1 : start, 0), function() {
                    for(var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length); ++index < length;)array[index] = args[start + index];
                    index = -1;
                    for(var otherArgs = Array(start + 1); ++index < start;)otherArgs[index] = args[index];
                    return otherArgs[start] = transform(array), apply(func, this, otherArgs);
                };
            };
        },
        function(module, exports, __webpack_require__) {
            var baseSetToString = __webpack_require__(148), shortOut = __webpack_require__(150), setToString = shortOut(baseSetToString);
            module.exports = setToString;
        },
        function(module, exports, __webpack_require__) {
            var arrayLikeToArray = __webpack_require__(61);
            module.exports = function(o, minLen) {
                if (o) {
                    if ("string" == typeof o) return arrayLikeToArray(o, minLen);
                    var n = Object.prototype.toString.call(o).slice(8, -1);
                    if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(o);
                    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
                }
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(arr, len) {
                (null == len || len > arr.length) && (len = arr.length);
                for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
                return arr2;
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = 0.000001;
        },
        function(module, exports) {
            module.exports = function() {
                var out = new Float32Array(2);
                return out[0] = 0, out[1] = 0, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] * b[0], out[1] = a[1] * b[1], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] / b[0], out[1] = a[1] / b[1], out;
            };
        },
        function(module, exports) {
            module.exports = function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1];
                return Math.sqrt(x * x + y * y);
            };
        },
        function(module, exports) {
            module.exports = function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1];
                return x * x + y * y;
            };
        },
        function(module, exports) {
            module.exports = function(a) {
                var x = a[0], y = a[1];
                return Math.sqrt(x * x + y * y);
            };
        },
        function(module, exports) {
            module.exports = function(a) {
                var x = a[0], y = a[1];
                return x * x + y * y;
            };
        },
        function(module, exports) {
            module.exports = 0.000001;
        },
        function(module, exports) {
            module.exports = function() {
                var out = new Float32Array(3);
                return out[0] = 0, out[1] = 0, out[2] = 0, out;
            };
        },
        function(module, exports) {
            module.exports = function(x, y, z) {
                var out = new Float32Array(3);
                return out[0] = x, out[1] = y, out[2] = z, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                var x = a[0], y = a[1], z = a[2], len = x * x + y * y + z * z;
                return len > 0 && (len = 1 / Math.sqrt(len), out[0] = a[0] * len, out[1] = a[1] * len, out[2] = a[2] * len), out;
            };
        },
        function(module, exports) {
            module.exports = function(a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] * b[0], out[1] = a[1] * b[1], out[2] = a[2] * b[2], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] / b[0], out[1] = a[1] / b[1], out[2] = a[2] / b[2], out;
            };
        },
        function(module, exports) {
            module.exports = function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
                return Math.sqrt(x * x + y * y + z * z);
            };
        },
        function(module, exports) {
            module.exports = function(a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
                return x * x + y * y + z * z;
            };
        },
        function(module, exports) {
            module.exports = function(a) {
                var x = a[0], y = a[1], z = a[2];
                return Math.sqrt(x * x + y * y + z * z);
            };
        },
        function(module, exports) {
            module.exports = function(a) {
                var x = a[0], y = a[1], z = a[2];
                return x * x + y * y + z * z;
            };
        },
        function(module, exports, __webpack_require__) {
            var arrayWithHoles = __webpack_require__(153), iterableToArrayLimit = __webpack_require__(154), unsupportedIterableToArray = __webpack_require__(60), nonIterableRest = __webpack_require__(155);
            module.exports = function(arr, i) {
                return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            module.exports = {
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
        },
        function(module, exports, __webpack_require__) {
            var basePick = __webpack_require__(229), pick = __webpack_require__(243)(function(object, paths) {
                return null == object ? {} : basePick(object, paths);
            });
            module.exports = pick;
        },
        function(module, exports, __webpack_require__) {
            var getPrototypeOf = __webpack_require__(2), setPrototypeOf = __webpack_require__(41), isNativeFunction = __webpack_require__(248), construct = __webpack_require__(249);
            function _wrapNativeSuper(Class1) {
                var _cache = "function" == typeof Map ? new Map() : void 0;
                return module.exports = _wrapNativeSuper = function(Class) {
                    if (null === Class || !isNativeFunction(Class)) return Class;
                    if ("function" != typeof Class) throw new TypeError("Super expression must either be null or a function");
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
                }, module.exports.default = module.exports, module.exports.__esModule = !0, _wrapNativeSuper(Class1);
            }
            module.exports = _wrapNativeSuper, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var _tracer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21), Rasterizer = {
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
                    var imageData = imageWrapper.data, labelData = labelWrapper.data, width = imageWrapper.size.x, height = imageWrapper.size.y, tracer = _tracer__WEBPACK_IMPORTED_MODULE_0__.a.create(imageWrapper, labelWrapper);
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
                                    switch(null !== iq ? (q = iq, iq = iq.nextpeer) : (q = pq, pq = pq.nextpeer, iq = null !== pq ? pq.insideContours : null), q.dir){
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
            __webpack_exports__.a = Rasterizer;
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = function(stdlib, foreign, buffer) {
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
                    skelImagePtr = tempImagePtr + erodedImagePtr | 0;
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
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(263);
        },
        function(module, exports, __webpack_require__) {
            var Stack = __webpack_require__(91), assignMergeValue = __webpack_require__(48), baseFor = __webpack_require__(121), baseMergeDeep = __webpack_require__(123), isObject = __webpack_require__(14), keysIn = __webpack_require__(56), safeGet = __webpack_require__(54);
            function baseMerge(object, source, srcIndex, customizer, stack) {
                object !== source && baseFor(source, function(srcValue, key) {
                    if (stack || (stack = new Stack()), isObject(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
                    else {
                        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
                        void 0 === newValue && (newValue = srcValue), assignMergeValue(object, key, newValue);
                    }
                }, keysIn);
            }
            module.exports = baseMerge;
        },
        function(module, exports, __webpack_require__) {
            var ListCache = __webpack_require__(24), stackClear = __webpack_require__(97), stackDelete = __webpack_require__(98), stackGet = __webpack_require__(99), stackHas = __webpack_require__(100), stackSet = __webpack_require__(101);
            function Stack(entries) {
                var data = this.__data__ = new ListCache(entries);
                this.size = data.size;
            }
            Stack.prototype.clear = stackClear, Stack.prototype.delete = stackDelete, Stack.prototype.get = stackGet, Stack.prototype.has = stackHas, Stack.prototype.set = stackSet, module.exports = Stack;
        },
        function(module, exports) {
            module.exports = function() {
                this.__data__ = [], this.size = 0;
            };
        },
        function(module, exports, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25), splice = Array.prototype.splice;
            module.exports = function(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return !(index < 0) && (index == data.length - 1 ? data.pop() : splice.call(data, index, 1), --this.size, !0);
            };
        },
        function(module, exports, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25);
            module.exports = function(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return index < 0 ? void 0 : data[index][1];
            };
        },
        function(module, exports, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25);
            module.exports = function(key) {
                return assocIndexOf(this.__data__, key) > -1;
            };
        },
        function(module, exports, __webpack_require__) {
            var assocIndexOf = __webpack_require__(25);
            module.exports = function(key, value) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return index < 0 ? (++this.size, data.push([
                    key,
                    value
                ])) : data[index][1] = value, this;
            };
        },
        function(module, exports, __webpack_require__) {
            var ListCache = __webpack_require__(24);
            module.exports = function() {
                this.__data__ = new ListCache(), this.size = 0;
            };
        },
        function(module, exports) {
            module.exports = function(key) {
                var data = this.__data__, result = data.delete(key);
                return this.size = data.size, result;
            };
        },
        function(module, exports) {
            module.exports = function(key) {
                return this.__data__.get(key);
            };
        },
        function(module, exports) {
            module.exports = function(key) {
                return this.__data__.has(key);
            };
        },
        function(module, exports, __webpack_require__) {
            var ListCache = __webpack_require__(24), Map = __webpack_require__(44), MapCache = __webpack_require__(47);
            module.exports = function(key, value) {
                var data = this.__data__;
                if (data instanceof ListCache) {
                    var pairs = data.__data__;
                    if (!Map || pairs.length < 199) return pairs.push([
                        key,
                        value
                    ]), this.size = ++data.size, this;
                    data = this.__data__ = new MapCache(pairs);
                }
                return data.set(key, value), this.size = data.size, this;
            };
        },
        function(module, exports, __webpack_require__) {
            var isFunction = __webpack_require__(36), isMasked = __webpack_require__(105), isObject = __webpack_require__(14), toSource = __webpack_require__(107), reIsHostCtor = /^\[object .+?Constructor\]$/, funcProto = Function.prototype, objectProto = Object.prototype, funcToString = funcProto.toString, hasOwnProperty = objectProto.hasOwnProperty, reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            module.exports = function(value) {
                return !(!isObject(value) || isMasked(value)) && (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
            };
        },
        function(module, exports, __webpack_require__) {
            var Symbol = __webpack_require__(27), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, nativeObjectToString = objectProto.toString, symToStringTag = Symbol ? Symbol.toStringTag : void 0;
            module.exports = function(value) {
                var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
                try {
                    value[symToStringTag] = void 0;
                    var unmasked = !0;
                } catch (e) {}
                var result = nativeObjectToString.call(value);
                return unmasked && (isOwn ? value[symToStringTag] = tag : delete value[symToStringTag]), result;
            };
        },
        function(module, exports) {
            var nativeObjectToString = Object.prototype.toString;
            module.exports = function(value) {
                return nativeObjectToString.call(value);
            };
        },
        function(module, exports, __webpack_require__) {
            var uid, coreJsData = __webpack_require__(106), maskSrcKey = (uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "")) ? "Symbol(src)_1." + uid : "";
            module.exports = function(func) {
                return !!maskSrcKey && maskSrcKey in func;
            };
        },
        function(module, exports, __webpack_require__) {
            var coreJsData = __webpack_require__(17)["__core-js_shared__"];
            module.exports = coreJsData;
        },
        function(module, exports) {
            var funcToString = Function.prototype.toString;
            module.exports = function(func) {
                if (null != func) {
                    try {
                        return funcToString.call(func);
                    } catch (e) {}
                    try {
                        return func + "";
                    } catch (e1) {}
                }
                return "";
            };
        },
        function(module, exports) {
            module.exports = function(object, key) {
                return null == object ? void 0 : object[key];
            };
        },
        function(module, exports, __webpack_require__) {
            var Hash = __webpack_require__(110), ListCache = __webpack_require__(24), Map = __webpack_require__(44);
            module.exports = function() {
                this.size = 0, this.__data__ = {
                    hash: new Hash(),
                    map: new (Map || ListCache)(),
                    string: new Hash()
                };
            };
        },
        function(module, exports, __webpack_require__) {
            var hashClear = __webpack_require__(111), hashDelete = __webpack_require__(112), hashGet = __webpack_require__(113), hashHas = __webpack_require__(114), hashSet = __webpack_require__(115);
            function Hash(entries) {
                var index = -1, length = null == entries ? 0 : entries.length;
                for(this.clear(); ++index < length;){
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }
            Hash.prototype.clear = hashClear, Hash.prototype.delete = hashDelete, Hash.prototype.get = hashGet, Hash.prototype.has = hashHas, Hash.prototype.set = hashSet, module.exports = Hash;
        },
        function(module, exports, __webpack_require__) {
            var nativeCreate = __webpack_require__(28);
            module.exports = function() {
                this.__data__ = nativeCreate ? nativeCreate(null) : {}, this.size = 0;
            };
        },
        function(module, exports) {
            module.exports = function(key) {
                var result = this.has(key) && delete this.__data__[key];
                return this.size -= result ? 1 : 0, result;
            };
        },
        function(module, exports, __webpack_require__) {
            var nativeCreate = __webpack_require__(28), hasOwnProperty = Object.prototype.hasOwnProperty;
            module.exports = function(key) {
                var data = this.__data__;
                if (nativeCreate) {
                    var result = data[key];
                    return "__lodash_hash_undefined__" === result ? void 0 : result;
                }
                return hasOwnProperty.call(data, key) ? data[key] : void 0;
            };
        },
        function(module, exports, __webpack_require__) {
            var nativeCreate = __webpack_require__(28), hasOwnProperty = Object.prototype.hasOwnProperty;
            module.exports = function(key) {
                var data = this.__data__;
                return nativeCreate ? void 0 !== data[key] : hasOwnProperty.call(data, key);
            };
        },
        function(module, exports, __webpack_require__) {
            var nativeCreate = __webpack_require__(28);
            module.exports = function(key, value) {
                var data = this.__data__;
                return this.size += this.has(key) ? 0 : 1, data[key] = nativeCreate && void 0 === value ? "__lodash_hash_undefined__" : value, this;
            };
        },
        function(module, exports, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module.exports = function(key) {
                var result = getMapData(this, key).delete(key);
                return this.size -= result ? 1 : 0, result;
            };
        },
        function(module, exports) {
            module.exports = function(value) {
                var type = typeof value;
                return "string" == type || "number" == type || "symbol" == type || "boolean" == type ? "__proto__" !== value : null === value;
            };
        },
        function(module, exports, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module.exports = function(key) {
                return getMapData(this, key).get(key);
            };
        },
        function(module, exports, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module.exports = function(key) {
                return getMapData(this, key).has(key);
            };
        },
        function(module, exports, __webpack_require__) {
            var getMapData = __webpack_require__(29);
            module.exports = function(key, value) {
                var data = getMapData(this, key), size = data.size;
                return data.set(key, value), this.size += data.size == size ? 0 : 1, this;
            };
        },
        function(module, exports, __webpack_require__) {
            var baseFor = __webpack_require__(122)();
            module.exports = baseFor;
        },
        function(module, exports) {
            module.exports = function(fromRight) {
                return function(object, iteratee, keysFunc) {
                    for(var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--;){
                        var key = props[fromRight ? length : ++index];
                        if (!1 === iteratee(iterable[key], key, iterable)) break;
                    }
                    return object;
                };
            };
        },
        function(module, exports, __webpack_require__) {
            var assignMergeValue = __webpack_require__(48), cloneBuffer = __webpack_require__(124), cloneTypedArray = __webpack_require__(125), copyArray = __webpack_require__(128), initCloneObject = __webpack_require__(129), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), isArrayLikeObject = __webpack_require__(133), isBuffer = __webpack_require__(52), isFunction = __webpack_require__(36), isObject = __webpack_require__(14), isPlainObject = __webpack_require__(135), isTypedArray = __webpack_require__(53), safeGet = __webpack_require__(54), toPlainObject = __webpack_require__(139);
            module.exports = function(object, source, key, srcIndex, mergeFunc, customizer, stack) {
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
                isCommon && (stack.set(srcValue, newValue), mergeFunc(newValue, srcValue, srcIndex, customizer, stack), stack.delete(srcValue)), assignMergeValue(object, key, newValue);
            };
        },
        function(module3, exports, __webpack_require__) {
            (function(module) {
                var root = __webpack_require__(17), freeExports = exports && !exports.nodeType && exports, freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module, Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
                module.exports = function(buffer, isDeep) {
                    if (isDeep) return buffer.slice();
                    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
                    return buffer.copy(result), result;
                };
            }).call(this, __webpack_require__(38)(module3));
        },
        function(module, exports, __webpack_require__) {
            var cloneArrayBuffer = __webpack_require__(126);
            module.exports = function(typedArray, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
                return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
            };
        },
        function(module, exports, __webpack_require__) {
            var Uint8Array = __webpack_require__(127);
            module.exports = function(arrayBuffer) {
                var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
                return new Uint8Array(result).set(new Uint8Array(arrayBuffer)), result;
            };
        },
        function(module, exports, __webpack_require__) {
            var Uint8Array = __webpack_require__(17).Uint8Array;
            module.exports = Uint8Array;
        },
        function(module, exports) {
            module.exports = function(source, array) {
                var index = -1, length = source.length;
                for(array || (array = Array(length)); ++index < length;)array[index] = source[index];
                return array;
            };
        },
        function(module, exports, __webpack_require__) {
            var baseCreate = __webpack_require__(130), getPrototype = __webpack_require__(50), isPrototype = __webpack_require__(51);
            module.exports = function(object) {
                return "function" != typeof object.constructor || isPrototype(object) ? {} : baseCreate(getPrototype(object));
            };
        },
        function(module, exports, __webpack_require__) {
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
            module.exports = baseCreate;
        },
        function(module, exports) {
            module.exports = function(func, transform) {
                return function(arg) {
                    return func(transform(arg));
                };
            };
        },
        function(module, exports, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isObjectLike = __webpack_require__(18);
            module.exports = function(value) {
                return isObjectLike(value) && "[object Arguments]" == baseGetTag(value);
            };
        },
        function(module, exports, __webpack_require__) {
            var isArrayLike = __webpack_require__(39), isObjectLike = __webpack_require__(18);
            module.exports = function(value) {
                return isObjectLike(value) && isArrayLike(value);
            };
        },
        function(module, exports) {
            function stubFalse() {
                return !1;
            }
            module.exports = stubFalse;
        },
        function(module, exports, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), getPrototype = __webpack_require__(50), isObjectLike = __webpack_require__(18), funcProto = Function.prototype, objectProto = Object.prototype, funcToString = funcProto.toString, hasOwnProperty = objectProto.hasOwnProperty, objectCtorString = funcToString.call(Object);
            module.exports = function(value) {
                if (!isObjectLike(value) || "[object Object]" != baseGetTag(value)) return !1;
                var proto = getPrototype(value);
                if (null === proto) return !0;
                var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
                return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
            };
        },
        function(module, exports, __webpack_require__) {
            var baseGetTag = __webpack_require__(22), isLength = __webpack_require__(40), isObjectLike = __webpack_require__(18), typedArrayTags = {};
            typedArrayTags["[object Float32Array]"] = typedArrayTags["[object Float64Array]"] = typedArrayTags["[object Int8Array]"] = typedArrayTags["[object Int16Array]"] = typedArrayTags["[object Int32Array]"] = typedArrayTags["[object Uint8Array]"] = typedArrayTags["[object Uint8ClampedArray]"] = typedArrayTags["[object Uint16Array]"] = typedArrayTags["[object Uint32Array]"] = !0, typedArrayTags["[object Arguments]"] = typedArrayTags["[object Array]"] = typedArrayTags["[object ArrayBuffer]"] = typedArrayTags["[object Boolean]"] = typedArrayTags["[object DataView]"] = typedArrayTags["[object Date]"] = typedArrayTags["[object Error]"] = typedArrayTags["[object Function]"] = typedArrayTags["[object Map]"] = typedArrayTags["[object Number]"] = typedArrayTags["[object Object]"] = typedArrayTags["[object RegExp]"] = typedArrayTags["[object Set]"] = typedArrayTags["[object String]"] = typedArrayTags["[object WeakMap]"] = !1, module.exports = function(value) {
                return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
            };
        },
        function(module, exports) {
            module.exports = function(func) {
                return function(value) {
                    return func(value);
                };
            };
        },
        function(module4, exports, __webpack_require__) {
            (function(module) {
                var freeGlobal = __webpack_require__(45), freeExports = exports && !exports.nodeType && exports, freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module, freeProcess = freeModule && freeModule.exports === freeExports && freeGlobal.process, nodeUtil = function() {
                    try {
                        var types = freeModule && freeModule.require && freeModule.require("util").types;
                        if (types) return types;
                        return freeProcess && freeProcess.binding && freeProcess.binding("util");
                    } catch (e) {}
                }();
                module.exports = nodeUtil;
            }).call(this, __webpack_require__(38)(module4));
        },
        function(module, exports, __webpack_require__) {
            var copyObject = __webpack_require__(140), keysIn = __webpack_require__(56);
            module.exports = function(value) {
                return copyObject(value, keysIn(value));
            };
        },
        function(module, exports, __webpack_require__) {
            var assignValue = __webpack_require__(55), baseAssignValue = __webpack_require__(37);
            module.exports = function(source, props, object, customizer) {
                var isNew = !object;
                object || (object = {});
                for(var index = -1, length = props.length; ++index < length;){
                    var key = props[index], newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
                    void 0 === newValue && (newValue = source[key]), isNew ? baseAssignValue(object, key, newValue) : assignValue(object, key, newValue);
                }
                return object;
            };
        },
        function(module, exports, __webpack_require__) {
            var baseTimes = __webpack_require__(142), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), isBuffer = __webpack_require__(52), isIndex = __webpack_require__(31), isTypedArray = __webpack_require__(53), hasOwnProperty = Object.prototype.hasOwnProperty;
            module.exports = function(value, inherited) {
                var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
                for(var key in value)(inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && ("length" == key || isBuff && ("offset" == key || "parent" == key) || isType && ("buffer" == key || "byteLength" == key || "byteOffset" == key) || isIndex(key, length))) && result.push(key);
                return result;
            };
        },
        function(module, exports) {
            module.exports = function(n, iteratee) {
                for(var index = -1, result = Array(n); ++index < n;)result[index] = iteratee(index);
                return result;
            };
        },
        function(module, exports, __webpack_require__) {
            var isObject = __webpack_require__(14), isPrototype = __webpack_require__(51), nativeKeysIn = __webpack_require__(144), hasOwnProperty = Object.prototype.hasOwnProperty;
            module.exports = function(object) {
                if (!isObject(object)) return nativeKeysIn(object);
                var isProto = isPrototype(object), result = [];
                for(var key in object)"constructor" == key && (isProto || !hasOwnProperty.call(object, key)) || result.push(key);
                return result;
            };
        },
        function(module, exports) {
            module.exports = function(object) {
                var result = [];
                if (null != object) for(var key in Object(object))result.push(key);
                return result;
            };
        },
        function(module, exports, __webpack_require__) {
            var baseRest = __webpack_require__(146), isIterateeCall = __webpack_require__(151);
            module.exports = function(assigner) {
                return baseRest(function(object, sources) {
                    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
                    for(customizer = assigner.length > 3 && "function" == typeof customizer ? (length--, customizer) : void 0, guard && isIterateeCall(sources[0], sources[1], guard) && (customizer = length < 3 ? void 0 : customizer, length = 1), object = Object(object); ++index < length;){
                        var source = sources[index];
                        source && assigner(object, source, index, customizer);
                    }
                    return object;
                });
            };
        },
        function(module, exports, __webpack_require__) {
            var identity = __webpack_require__(57), overRest = __webpack_require__(58), setToString = __webpack_require__(59);
            module.exports = function(func, start) {
                return setToString(overRest(func, start, identity), func + "");
            };
        },
        function(module, exports) {
            module.exports = function(func, thisArg, args) {
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
        },
        function(module, exports, __webpack_require__) {
            var constant = __webpack_require__(149), defineProperty = __webpack_require__(49), identity = __webpack_require__(57);
            module.exports = defineProperty ? function(func, string) {
                return defineProperty(func, "toString", {
                    configurable: !0,
                    enumerable: !1,
                    value: constant(string),
                    writable: !0
                });
            } : identity;
        },
        function(module, exports) {
            module.exports = function(value) {
                return function() {
                    return value;
                };
            };
        },
        function(module, exports) {
            var HOT_SPAN = 16, nativeNow = Date.now;
            module.exports = function(func) {
                var count = 0, lastCalled = 0;
                return function() {
                    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
                    if (lastCalled = stamp, remaining > 0) {
                        if (++count >= 800) return arguments[0];
                    } else count = 0;
                    return func.apply(void 0, arguments);
                };
            };
        },
        function(module, exports, __webpack_require__) {
            var eq = __webpack_require__(26), isArrayLike = __webpack_require__(39), isIndex = __webpack_require__(31), isObject = __webpack_require__(14);
            module.exports = function(value, index, object) {
                if (!isObject(object)) return !1;
                var type = typeof index;
                return ("number" == type ? !!(isArrayLike(object) && isIndex(index, object.length)) : "string" == type && index in object) && eq(object[index], value);
            };
        },
        function(module, exports) {
            "undefined" == typeof window || window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            }), "function" != typeof Math.imul && (Math.imul = function(a, b) {
                var al = 0xffff & a, bl = 0xffff & b;
                return al * bl + ((a >>> 16 & 0xffff) * bl + al * (b >>> 16 & 0xffff) << 16 >>> 0) | 0;
            }), "function" != typeof Object.assign && (Object.assign = function(target) {
                "use strict";
                if (null === target) throw new TypeError("Cannot convert undefined or null to object");
                for(var to = Object(target), index = 1; index < arguments.length; index++){
                    var nextSource = arguments[index];
                    if (null !== nextSource) for(var nextKey in nextSource)Object.prototype.hasOwnProperty.call(nextSource, nextKey) && (to[nextKey] = nextSource[nextKey]);
                }
                return to;
            });
        },
        function(module, exports) {
            module.exports = function(arr) {
                if (Array.isArray(arr)) return arr;
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(arr, i) {
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
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(a) {
                var out = new Float32Array(2);
                return out[0] = a[0], out[1] = a[1], out;
            };
        },
        function(module, exports) {
            module.exports = function(x, y) {
                var out = new Float32Array(2);
                return out[0] = x, out[1] = y, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = a[0], out[1] = a[1], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, x, y) {
                return out[0] = x, out[1] = y, out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = function(a, b) {
                var a0 = a[0], a1 = a[1], b0 = b[0], b1 = b[1];
                return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
            };
            var EPSILON = __webpack_require__(62);
        },
        function(module, exports) {
            module.exports = function(a, b) {
                return a[0] === b[0] && a[1] === b[1];
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(64);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(65);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(66);
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = 1.0 / a[0], out[1] = 1.0 / a[1], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = Math.min(a[0], b[0]), out[1] = Math.min(a[1], b[1]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = Math.max(a[0], b[0]), out[1] = Math.max(a[1], b[1]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, angle) {
                var c = Math.cos(angle), s = Math.sin(angle), x = a[0], y = a[1];
                return out[0] = x * c - y * s, out[1] = x * s + y * c, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = Math.floor(a[0]), out[1] = Math.floor(a[1]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = Math.ceil(a[0]), out[1] = Math.ceil(a[1]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = Math.round(a[0]), out[1] = Math.round(a[1]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] * b, out[1] = a[1] * b, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b, scale) {
                return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(67);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(68);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(69);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(70);
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = -a[0], out[1] = -a[1], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                var x = a[0], y = a[1], len = x * x + y * y;
                return len > 0 && (len = 1 / Math.sqrt(len), out[0] = a[0] * len, out[1] = a[1] * len), out;
            };
        },
        function(module, exports) {
            module.exports = function(a, b) {
                return a[0] * b[0] + a[1] * b[1];
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                var z = a[0] * b[1] - a[1] * b[0];
                return out[0] = out[1] = 0, out[2] = z, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b, t) {
                var ax = a[0], ay = a[1];
                return out[0] = ax + t * (b[0] - ax), out[1] = ay + t * (b[1] - ay), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, scale) {
                scale = scale || 1.0;
                var r = 2.0 * Math.random() * Math.PI;
                return out[0] = Math.cos(r) * scale, out[1] = Math.sin(r) * scale, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[2] * y, out[1] = m[1] * x + m[3] * y, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[2] * y + m[4], out[1] = m[1] * x + m[3] * y + m[5], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[3] * y + m[6], out[1] = m[1] * x + m[4] * y + m[7], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, m) {
                var x = a[0], y = a[1];
                return out[0] = m[0] * x + m[4] * y + m[12], out[1] = m[1] * x + m[5] * y + m[13], out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = function(a, stride, offset, count, fn, arg) {
                var i, l;
                for(stride || (stride = 2), offset || (offset = 0), l = count ? Math.min(count * stride + offset, a.length) : a.length, i = offset; i < l; i += stride)vec[0] = a[i], vec[1] = a[i + 1], fn(vec, vec, arg), a[i] = vec[0], a[i + 1] = vec[1];
                return a;
            };
            var vec = __webpack_require__(63)();
        },
        function(module, exports) {
            module.exports = function(out, a, max) {
                var mSq = a[0] * a[0] + a[1] * a[1];
                if (mSq > max * max) {
                    var n = Math.sqrt(mSq);
                    out[0] = a[0] / n * max, out[1] = a[1] / n * max;
                } else out[0] = a[0], out[1] = a[1];
                return out;
            };
        },
        function(module, exports) {
            module.exports = function(a) {
                var out = new Float32Array(3);
                return out[0] = a[0], out[1] = a[1], out[2] = a[2], out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = function(a, b) {
                var tempA = fromValues(a[0], a[1], a[2]), tempB = fromValues(b[0], b[1], b[2]);
                normalize(tempA, tempA), normalize(tempB, tempB);
                var cosine = dot(tempA, tempB);
                return cosine > 1.0 ? 0 : Math.acos(cosine);
            };
            var fromValues = __webpack_require__(73), normalize = __webpack_require__(74), dot = __webpack_require__(75);
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = a[0], out[1] = a[1], out[2] = a[2], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, x, y, z) {
                return out[0] = x, out[1] = y, out[2] = z, out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = function(a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], b0 = b[0], b1 = b[1], b2 = b[2];
                return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
            };
            var EPSILON = __webpack_require__(71);
        },
        function(module, exports) {
            module.exports = function(a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(76);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(77);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(78);
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = Math.min(a[0], b[0]), out[1] = Math.min(a[1], b[1]), out[2] = Math.min(a[2], b[2]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = Math.max(a[0], b[0]), out[1] = Math.max(a[1], b[1]), out[2] = Math.max(a[2], b[2]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = Math.floor(a[0]), out[1] = Math.floor(a[1]), out[2] = Math.floor(a[2]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = Math.ceil(a[0]), out[1] = Math.ceil(a[1]), out[2] = Math.ceil(a[2]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = Math.round(a[0]), out[1] = Math.round(a[1]), out[2] = Math.round(a[2]), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b, scale) {
                return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(79);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(80);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(81);
        },
        function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(82);
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = -a[0], out[1] = -a[1], out[2] = -a[2], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = 1.0 / a[0], out[1] = 1.0 / a[1], out[2] = 1.0 / a[2], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
                return out[0] = ay * bz - az * by, out[1] = az * bx - ax * bz, out[2] = ax * by - ay * bx, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b, t) {
                var ax = a[0], ay = a[1], az = a[2];
                return out[0] = ax + t * (b[0] - ax), out[1] = ay + t * (b[1] - ay), out[2] = az + t * (b[2] - az), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, scale) {
                var r = 2.0 * Math.random() * Math.PI, z = 2.0 * Math.random() - 1.0, zScale = Math.sqrt(1.0 - z * z) * (scale = scale || 1.0);
                return out[0] = Math.cos(r) * zScale, out[1] = Math.sin(r) * zScale, out[2] = z * scale, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, m) {
                var x = a[0], y = a[1], z = a[2], w = m[3] * x + m[7] * y + m[11] * z + m[15];
                return w = w || 1.0, out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w, out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, m) {
                var x = a[0], y = a[1], z = a[2];
                return out[0] = x * m[0] + y * m[3] + z * m[6], out[1] = x * m[1] + y * m[4] + z * m[7], out[2] = x * m[2] + y * m[5] + z * m[8], out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, q) {
                var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
                return out[0] = ix * qw + -(iw * qx) + -(iy * qz) - -(iz * qy), out[1] = iy * qw + -(iw * qy) + -(iz * qx) - -(ix * qz), out[2] = iz * qw + -(iw * qz) + -(ix * qy) - -(iy * qx), out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b, c) {
                var by = b[1], bz = b[2], py = a[1] - by, pz = a[2] - bz, sc = Math.sin(c), cc = Math.cos(c);
                return out[0] = a[0], out[1] = by + py * cc - pz * sc, out[2] = bz + py * sc + pz * cc, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b, c) {
                var bx = b[0], bz = b[2], px = a[0] - bx, pz = a[2] - bz, sc = Math.sin(c), cc = Math.cos(c);
                return out[0] = bx + pz * sc + px * cc, out[1] = a[1], out[2] = bz + pz * cc - px * sc, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b, c) {
                var bx = b[0], by = b[1], px = a[0] - bx, py = a[1] - by, sc = Math.sin(c), cc = Math.cos(c);
                return out[0] = bx + px * cc - py * sc, out[1] = by + px * sc + py * cc, out[2] = a[2], out;
            };
        },
        function(module, exports, __webpack_require__) {
            module.exports = function(a, stride, offset, count, fn, arg) {
                var i, l;
                for(stride || (stride = 3), offset || (offset = 0), l = count ? Math.min(count * stride + offset, a.length) : a.length, i = offset; i < l; i += stride)vec[0] = a[i], vec[1] = a[i + 1], vec[2] = a[i + 2], fn(vec, vec, arg), a[i] = vec[0], a[i + 1] = vec[1], a[i + 2] = vec[2];
                return a;
            };
            var vec = __webpack_require__(72)();
        },
        function(module, exports, __webpack_require__) {
            var arrayLikeToArray = __webpack_require__(61);
            module.exports = function(arr) {
                if (Array.isArray(arr)) return arrayLikeToArray(arr);
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(iter) {
                if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            var getPrototypeOf = __webpack_require__(2);
            module.exports = function(object, property) {
                for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = getPrototypeOf(object)););
                return object;
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports1, __webpack_require__) {
            var runtime = function(exports) {
                "use strict";
                var undefined, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
                function wrap(innerFn, outerFn, self, tryLocsList) {
                    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []);
                    return generator._invoke = makeInvokeMethod(innerFn, self, context), generator;
                }
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
                exports.wrap = wrap;
                var GenStateSuspendedStart = "suspendedStart", GenStateExecuting = "executing", GenStateCompleted = "completed", ContinueSentinel = {};
                function Generator() {}
                function GeneratorFunction() {}
                function GeneratorFunctionPrototype() {}
                var IteratorPrototype = {};
                IteratorPrototype[iteratorSymbol] = function() {
                    return this;
                };
                var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([])));
                NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
                var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
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
                    function invoke(method, arg, resolve, reject) {
                        var record = tryCatch(generator[method], generator, arg);
                        if ("throw" === record.type) reject(record.arg);
                        else {
                            var result = record.arg, value1 = result.value;
                            return value1 && "object" == typeof value1 && hasOwn.call(value1, "__await") ? PromiseImpl.resolve(value1.__await).then(function(value) {
                                invoke("next", value, resolve, reject);
                            }, function(err) {
                                invoke("throw", err, resolve, reject);
                            }) : PromiseImpl.resolve(value1).then(function(unwrapped) {
                                result.value = unwrapped, resolve(result);
                            }, function(error) {
                                return invoke("throw", error, resolve, reject);
                            });
                        }
                    }
                    this._invoke = function(method, arg) {
                        function callInvokeWithMethodAndArg() {
                            return new PromiseImpl(function(resolve, reject) {
                                invoke(method, arg, resolve, reject);
                            });
                        }
                        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                    };
                }
                function makeInvokeMethod(innerFn, self, context) {
                    var state = GenStateSuspendedStart;
                    return function(method, arg) {
                        if (state === GenStateExecuting) throw new Error("Generator is already running");
                        if (state === GenStateCompleted) {
                            if ("throw" === method) throw arg;
                            return doneResult();
                        }
                        for(context.method = method, context.arg = arg;;){
                            var delegate = context.delegate;
                            if (delegate) {
                                var delegateResult = maybeInvokeDelegate(delegate, context);
                                if (delegateResult) {
                                    if (delegateResult === ContinueSentinel) continue;
                                    return delegateResult;
                                }
                            }
                            if ("next" === context.method) context.sent = context._sent = context.arg;
                            else if ("throw" === context.method) {
                                if (state === GenStateSuspendedStart) throw state = GenStateCompleted, context.arg;
                                context.dispatchException(context.arg);
                            } else "return" === context.method && context.abrupt("return", context.arg);
                            state = GenStateExecuting;
                            var record = tryCatch(innerFn, self, context);
                            if ("normal" === record.type) {
                                if (state = context.done ? GenStateCompleted : "suspendedYield", record.arg === ContinueSentinel) continue;
                                return {
                                    value: record.arg,
                                    done: context.done
                                };
                            }
                            "throw" === record.type && (state = GenStateCompleted, context.method = "throw", context.arg = record.arg);
                        }
                    };
                }
                function maybeInvokeDelegate(delegate, context) {
                    var method = delegate.iterator[context.method];
                    if (method === undefined) {
                        if (context.delegate = null, "throw" === context.method) {
                            if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
                            context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return ContinueSentinel;
                    }
                    var record = tryCatch(method, delegate.iterator, context.arg);
                    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
                    var info = record.arg;
                    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
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
                    this.tryEntries = [
                        {
                            tryLoc: "root"
                        }, 
                    ], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
                }
                function values(iterable) {
                    if (iterable) {
                        var iteratorMethod = iterable[iteratorSymbol];
                        if (iteratorMethod) return iteratorMethod.call(iterable);
                        if ("function" == typeof iterable.next) return iterable;
                        if (!isNaN(iterable.length)) {
                            var i = -1, next1 = function next() {
                                for(; ++i < iterable.length;)if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
                                return next.value = undefined, next.done = !0, next;
                            };
                            return next1.next = next1;
                        }
                    }
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
                return GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype, GeneratorFunctionPrototype.constructor = GeneratorFunction, GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction", exports.isGeneratorFunction = function(genFun) {
                    var ctor = "function" == typeof genFun && genFun.constructor;
                    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
                }, exports.mark = function(genFun) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, toStringTagSymbol in genFun || (genFun[toStringTagSymbol] = "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
                }, exports.awrap = function(arg) {
                    return {
                        __await: arg
                    };
                }, defineIteratorMethods(AsyncIterator.prototype), AsyncIterator.prototype[asyncIteratorSymbol] = function() {
                    return this;
                }, exports.AsyncIterator = AsyncIterator, exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
                    void 0 === PromiseImpl && (PromiseImpl = Promise);
                    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
                    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
                        return result.done ? result.value : iter.next();
                    });
                }, defineIteratorMethods(Gp), Gp[toStringTagSymbol] = "Generator", Gp[iteratorSymbol] = function() {
                    return this;
                }, Gp.toString = function() {
                    return "[object Generator]";
                }, exports.keys = function(object) {
                    var keys = [];
                    for(var key2 in object)keys.push(key2);
                    return keys.reverse(), function next() {
                        for(; keys.length;){
                            var key = keys.pop();
                            if (key in object) return next.value = key, next.done = !1, next;
                        }
                        return next.done = !0, next;
                    };
                }, exports.values = values, Context.prototype = {
                    constructor: Context,
                    reset: function(skipTempReset) {
                        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for(var name in this)"t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
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
                            return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
                        }
                        for(var i = this.tryEntries.length - 1; i >= 0; --i){
                            var entry = this.tryEntries[i], record = entry.completion;
                            if ("root" === entry.tryLoc) return handle("end");
                            if (entry.tryLoc <= this.prev) {
                                var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc");
                                if (hasCatch && hasFinally) {
                                    if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                                    if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                } else if (hasCatch) {
                                    if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                                } else if (hasFinally) {
                                    if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                } else throw new Error("try statement without catch or finally");
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
                        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
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
                        }
                        throw new Error("illegal catch attempt");
                    },
                    delegateYield: function(iterable, resultName, nextLoc) {
                        return this.delegate = {
                            iterator: values(iterable),
                            resultName: resultName,
                            nextLoc: nextLoc
                        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
                    }
                }, exports;
            }(module.exports);
            try {
                regeneratorRuntime = runtime;
            } catch (accidentalStrictMode) {
                Function("r", "regeneratorRuntime = r")(runtime);
            }
        },
        function(module, exports, __webpack_require__) {
            var basePickBy = __webpack_require__(230), hasIn = __webpack_require__(240);
            module.exports = function(object, paths) {
                return basePickBy(object, paths, function(value, path) {
                    return hasIn(object, path);
                });
            };
        },
        function(module, exports, __webpack_require__) {
            var baseGet = __webpack_require__(231), baseSet = __webpack_require__(239), castPath = __webpack_require__(32);
            module.exports = function(object, paths, predicate) {
                for(var index = -1, length = paths.length, result = {}; ++index < length;){
                    var path = paths[index], value = baseGet(object, path);
                    predicate(value, path) && baseSet(result, castPath(path, object), value);
                }
                return result;
            };
        },
        function(module, exports, __webpack_require__) {
            var castPath = __webpack_require__(32), toKey = __webpack_require__(43);
            module.exports = function(object, path) {
                path = castPath(path, object);
                for(var index = 0, length = path.length; null != object && index < length;)object = object[toKey(path[index++])];
                return index && index == length ? object : void 0;
            };
        },
        function(module, exports, __webpack_require__) {
            var isArray = __webpack_require__(15), isSymbol = __webpack_require__(42), reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
            module.exports = function(value, object) {
                if (isArray(value)) return !1;
                var type = typeof value;
                return !!("number" == type || "symbol" == type || "boolean" == type || null == value || isSymbol(value)) || reIsPlainProp.test(value) || !reIsDeepProp.test(value) || null != object && value in Object(object);
            };
        },
        function(module, exports, __webpack_require__) {
            var memoizeCapped = __webpack_require__(234), rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, reEscapeChar = /\\(\\)?/g, stringToPath = memoizeCapped(function(string) {
                var result = [];
                return 46 === string.charCodeAt(0) && result.push(""), string.replace(rePropName, function(match, number, quote, subString) {
                    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
                }), result;
            });
            module.exports = stringToPath;
        },
        function(module, exports, __webpack_require__) {
            var memoize = __webpack_require__(235);
            module.exports = function(func) {
                var result = memoize(func, function(key) {
                    return 500 === cache.size && cache.clear(), key;
                }), cache = result.cache;
                return result;
            };
        },
        function(module, exports, __webpack_require__) {
            var MapCache = __webpack_require__(47);
            function memoize(func, resolver) {
                if ("function" != typeof func || null != resolver && "function" != typeof resolver) throw new TypeError("Expected a function");
                var memoized = function() {
                    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
                    if (cache.has(key)) return cache.get(key);
                    var result = func.apply(this, args);
                    return memoized.cache = cache.set(key, result) || cache, result;
                };
                return memoized.cache = new (memoize.Cache || MapCache)(), memoized;
            }
            memoize.Cache = MapCache, module.exports = memoize;
        },
        function(module, exports, __webpack_require__) {
            var baseToString = __webpack_require__(237);
            module.exports = function(value) {
                return null == value ? "" : baseToString(value);
            };
        },
        function(module, exports, __webpack_require__) {
            var Symbol = __webpack_require__(27), arrayMap = __webpack_require__(238), isArray = __webpack_require__(15), isSymbol = __webpack_require__(42), INFINITY = 1 / 0, symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
            function baseToString(value) {
                if ("string" == typeof value) return value;
                if (isArray(value)) return arrayMap(value, baseToString) + "";
                if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
                var result = value + "";
                return "0" == result && 1 / value == -INFINITY ? "-0" : result;
            }
            module.exports = baseToString;
        },
        function(module, exports) {
            module.exports = function(array, iteratee) {
                for(var index = -1, length = null == array ? 0 : array.length, result = Array(length); ++index < length;)result[index] = iteratee(array[index], index, array);
                return result;
            };
        },
        function(module, exports, __webpack_require__) {
            var assignValue = __webpack_require__(55), castPath = __webpack_require__(32), isIndex = __webpack_require__(31), isObject = __webpack_require__(14), toKey = __webpack_require__(43);
            module.exports = function(object, path, value, customizer) {
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
        },
        function(module, exports, __webpack_require__) {
            var baseHasIn = __webpack_require__(241), hasPath = __webpack_require__(242);
            module.exports = function(object, path) {
                return null != object && hasPath(object, path, baseHasIn);
            };
        },
        function(module, exports) {
            module.exports = function(object, key) {
                return null != object && key in Object(object);
            };
        },
        function(module, exports, __webpack_require__) {
            var castPath = __webpack_require__(32), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), isIndex = __webpack_require__(31), isLength = __webpack_require__(40), toKey = __webpack_require__(43);
            module.exports = function(object, path, hasFunc) {
                path = castPath(path, object);
                for(var index = -1, length = path.length, result = !1; ++index < length;){
                    var key = toKey(path[index]);
                    if (!(result = null != object && hasFunc(object, key))) break;
                    object = object[key];
                }
                return result || ++index != length ? result : !!(length = null == object ? 0 : object.length) && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
            };
        },
        function(module, exports, __webpack_require__) {
            var flatten = __webpack_require__(244), overRest = __webpack_require__(58), setToString = __webpack_require__(59);
            module.exports = function(func) {
                return setToString(overRest(func, void 0, flatten), func + "");
            };
        },
        function(module, exports, __webpack_require__) {
            var baseFlatten = __webpack_require__(245);
            module.exports = function(array) {
                return (null == array ? 0 : array.length) ? baseFlatten(array, 1) : [];
            };
        },
        function(module, exports, __webpack_require__) {
            var arrayPush = __webpack_require__(246), isFlattenable = __webpack_require__(247);
            function baseFlatten(array, depth, predicate, isStrict, result) {
                var index = -1, length = array.length;
                for(predicate || (predicate = isFlattenable), result || (result = []); ++index < length;){
                    var value = array[index];
                    depth > 0 && predicate(value) ? depth > 1 ? baseFlatten(value, depth - 1, predicate, isStrict, result) : arrayPush(result, value) : isStrict || (result[result.length] = value);
                }
                return result;
            }
            module.exports = baseFlatten;
        },
        function(module, exports) {
            module.exports = function(array, values) {
                for(var index = -1, length = values.length, offset = array.length; ++index < length;)array[offset + index] = values[index];
                return array;
            };
        },
        function(module, exports, __webpack_require__) {
            var Symbol = __webpack_require__(27), isArguments = __webpack_require__(30), isArray = __webpack_require__(15), spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : void 0;
            module.exports = function(value) {
                return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
            };
        },
        function(module, exports) {
            module.exports = function(fn) {
                return -1 !== Function.toString.call(fn).indexOf("[native code]");
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports, __webpack_require__) {
            var setPrototypeOf = __webpack_require__(41), isNativeReflectConstruct = __webpack_require__(250);
            function _construct(Parent1, args1, Class2) {
                return isNativeReflectConstruct() ? (module.exports = _construct = Reflect.construct, module.exports.default = module.exports, module.exports.__esModule = !0) : (module.exports = _construct = function(Parent, args, Class) {
                    var a = [
                        null
                    ];
                    a.push.apply(a, args);
                    var instance = new (Function.bind.apply(Parent, a))();
                    return Class && setPrototypeOf(instance, Class.prototype), instance;
                }, module.exports.default = module.exports, module.exports.__esModule = !0), _construct.apply(null, arguments);
            }
            module.exports = _construct, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                } catch (e) {
                    return !1;
                }
            }, module.exports.default = module.exports, module.exports.__esModule = !0;
        },
        function(module, exports) {
            module.exports = function(a) {
                return a[0] * a[3] - a[2] * a[1];
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                if (out === a) {
                    var a1 = a[1];
                    out[1] = a[2], out[2] = a1;
                } else out[0] = a[0], out[1] = a[2], out[2] = a[1], out[3] = a[3];
                return out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
                return out[0] = a0 * b0 + a2 * b1, out[1] = a1 * b0 + a3 * b1, out[2] = a0 * b2 + a2 * b3, out[3] = a1 * b2 + a3 * b3, out;
            };
        },
        function(module, exports) {
            module.exports = function(out) {
                return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 1, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                var a0 = a[0];
                return out[0] = a[3], out[1] = -a[1], out[2] = -a[2], out[3] = a0, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, rad) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], s = Math.sin(rad), c = Math.cos(rad);
                return out[0] = a0 * c + a2 * s, out[1] = a1 * c + a3 * s, out[2] = -(a0 * s) + a2 * c, out[3] = -(a1 * s) + a3 * c, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], det = a0 * a3 - a2 * a1;
                return det ? (det = 1.0 / det, out[0] = a3 * det, out[1] = -a1 * det, out[2] = -a2 * det, out[3] = a0 * det, out) : null;
            };
        },
        function(module, exports) {
            module.exports = function() {
                var out = new Float32Array(4);
                return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 1, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a, v) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], v0 = v[0], v1 = v[1];
                return out[0] = a0 * v0, out[1] = a1 * v0, out[2] = a2 * v1, out[3] = a3 * v1, out;
            };
        },
        function(module, exports) {
            module.exports = function(out, a) {
                return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out;
            };
        },
        function(module, exports) {
            module.exports = function(a) {
                return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
            };
        },
        function(module, exports) {
            module.exports = function(L, D, U, a) {
                return L[2] = a[2] / a[0], U[0] = a[0], U[1] = a[1], U[3] = a[3] - L[2] * U[1], [
                    L,
                    D,
                    U
                ];
            };
        },
        function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, "BarcodeDecoder", function() {
                return barcode_decoder;
            }), __webpack_require__.d(__webpack_exports__, "Readers", function() {
                return reader_namespaceObject;
            }), __webpack_require__.d(__webpack_exports__, "CameraAccess", function() {
                return camera_access;
            }), __webpack_require__.d(__webpack_exports__, "ImageDebug", function() {
                return image_debug.a;
            }), __webpack_require__.d(__webpack_exports__, "ImageWrapper", function() {
                return image_wrapper.a;
            }), __webpack_require__.d(__webpack_exports__, "ResultCollector", function() {
                return result_collector;
            });
            var BarcodeDirection, streamRef, reader_namespaceObject = {};
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
            var helpers_typeof = __webpack_require__(19), typeof_default = __webpack_require__.n(helpers_typeof), merge = __webpack_require__(16), merge_default = __webpack_require__.n(merge);
            __webpack_require__(152);
            var image_wrapper = __webpack_require__(11), Bresenham = {}, Slope = {
                DIR: {
                    UP: 1,
                    DOWN: -1
                }
            };
            Bresenham.getBarcodeLine = function(imageWrapper, p1, p2) {
                var error, y, tmp, x, val, x0 = 0 | p1.x, y0 = 0 | p1.y, x1 = 0 | p2.x, y1 = 0 | p2.y, steep = Math.abs(y1 - y0) > Math.abs(x1 - x0), line = [], imageData = imageWrapper.data, width = imageWrapper.size.x, min = 255, max = 0;
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
            }, Bresenham.toBinaryLine = function(result) {
                var slope, slope2, currentDir, dir, i, j, min = result.min, max = result.max, line = result.line, center = min + (max - min) / 2, extrema = [], threshold = (max - min) / 12, rThreshold = -threshold;
                for(currentDir = line[0] > center ? Slope.DIR.UP : Slope.DIR.DOWN, extrema.push({
                    pos: 0,
                    val: line[0]
                }), i = 0; i < line.length - 2; i++)slope = line[i + 1] - line[i], slope2 = line[i + 2] - line[i + 1], dir = slope + slope2 < rThreshold && line[i + 1] < 1.5 * center ? Slope.DIR.DOWN : slope + slope2 > threshold && line[i + 1] > 0.5 * center ? Slope.DIR.UP : currentDir, currentDir !== dir && (extrema.push({
                    pos: i,
                    val: line[i]
                }), currentDir = dir);
                for(extrema.push({
                    pos: line.length,
                    val: line[line.length - 1]
                }), j = extrema[0].pos; j < extrema[1].pos; j++)line[j] = line[j] > center ? 0 : 1;
                for(i = 1; i < extrema.length - 1; i++)for(threshold = extrema[i + 1].val > extrema[i].val ? extrema[i].val + (extrema[i + 1].val - extrema[i].val) / 3 * 2 | 0 : extrema[i + 1].val + (extrema[i].val - extrema[i + 1].val) / 3 | 0, j = extrema[i].pos; j < extrema[i + 1].pos; j++)line[j] = line[j] > threshold ? 0 : 1;
                return {
                    line: line,
                    threshold: threshold
                };
            }, Bresenham.debug = {
                printFrequency: function(line, canvas) {
                    var i, ctx = canvas.getContext("2d");
                    for(canvas.width = line.length, canvas.height = 256, ctx.beginPath(), ctx.strokeStyle = "blue", i = 0; i < line.length; i++)ctx.moveTo(i, 255), ctx.lineTo(i, 255 - line[i]);
                    ctx.stroke(), ctx.closePath();
                },
                printPattern: function(line, canvas) {
                    var i, ctx = canvas.getContext("2d");
                    for(i = 0, canvas.width = line.length, ctx.fillColor = "black"; i < line.length; i++)1 === line[i] && ctx.fillRect(i, 0, 1, 100);
                }
            };
            var BarcodeDirection1, bresenham = Bresenham, image_debug = __webpack_require__(9), classCallCheck = __webpack_require__(3), classCallCheck_default = __webpack_require__.n(classCallCheck), createClass = __webpack_require__(4), createClass_default = __webpack_require__.n(createClass), assertThisInitialized = __webpack_require__(1), assertThisInitialized_default = __webpack_require__.n(assertThisInitialized), inherits = __webpack_require__(6), inherits_default = __webpack_require__.n(inherits), possibleConstructorReturn = __webpack_require__(5), possibleConstructorReturn_default = __webpack_require__.n(possibleConstructorReturn), getPrototypeOf = __webpack_require__(2), getPrototypeOf_default = __webpack_require__.n(getPrototypeOf), defineProperty = __webpack_require__(0), defineProperty_default = __webpack_require__.n(defineProperty), array_helper = __webpack_require__(10);
            (BarcodeDirection1 = BarcodeDirection || (BarcodeDirection = {}))[BarcodeDirection1.Forward = 1] = "Forward", BarcodeDirection1[BarcodeDirection1.Reverse = -1] = "Reverse";
            var barcode_reader_BarcodeReader = function() {
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
                            var error = 0, singleError = 0, sum = 0, modulo = 0, barWidth = 0, count = 0, scaled = 0;
                            maxSingleError = maxSingleError || this.SINGLE_CODE_ERROR || 1;
                            for(var i = 0; i < counter.length; i++)sum += counter[i], modulo += code[i];
                            if (sum < modulo) return Number.MAX_VALUE;
                            maxSingleError *= barWidth = sum / modulo;
                            for(var _i = 0; _i < counter.length; _i++){
                                if (count = counter[_i], scaled = code[_i] * barWidth, singleError = Math.abs(count - scaled) / scaled, singleError > maxSingleError) return Number.MAX_VALUE;
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
                            this._row = pattern;
                            var result = this.decode();
                            return null === result ? (this._row.reverse(), (result = this.decode()) && (result.direction = BarcodeDirection.Reverse, result.start = this._row.length - result.start, result.end = this._row.length - result.end)) : result.direction = BarcodeDirection.Forward, result && (result.format = this.FORMAT), result;
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
                            counters[counterPos] = 0;
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
                    }, 
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
                    }, 
                ]), BarcodeReader;
            }(), barcode_reader = barcode_reader_BarcodeReader, code_128_reader = function(_BarcodeReader) {
                inherits_default()(Code128Reader, _BarcodeReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = Code128Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function Code128Reader() {
                    var _this;
                    classCallCheck_default()(this, Code128Reader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                        ], 
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
                            ], offset = start, isWhite = !this._row[offset], counterPos = 0, i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
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
                            }(code.code), done = !1, shiftNext = !1, unshift = shiftNext, removeLastCharacter = !0, multiplier = 0, rawResult = [], result = []; !done;){
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
                            return null === code ? null : (code.end = this._nextUnset(this._row, code.end), this._verifyTrailingWhitespace(code)) ? (checksum -= multiplier * rawResult[rawResult.length - 1]) % 103 !== rawResult[rawResult.length - 1] ? null : result.length ? (removeLastCharacter && result.splice(result.length - 1, 1), {
                                code: result.join(""),
                                start: startInfo.start,
                                end: code.end,
                                codeset: codeset,
                                startInfo: startInfo,
                                decodedCodes: decodedCodes,
                                endInfo: code,
                                format: this.FORMAT
                            }) : null : null;
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
                    }, 
                ]), Code128Reader;
            }(barcode_reader);
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
                ], 
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
            ], ean_reader = function(_BarcodeReader) {
                inherits_default()(EANReader, _BarcodeReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = EANReader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
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
                            var counter = new Array(pattern.length).fill(0), bestMatch = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            }, counterPos = 0;
                            offset || (offset = this._nextSet(this._row));
                            for(var found = !1, i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos] += 1;
                            else {
                                if (counterPos === counter.length - 1) {
                                    var error = this._matchPattern(counter, pattern);
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
                            var counter = [
                                0,
                                0,
                                0,
                                0
                            ], offset = start, bestMatch = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: start,
                                end: start
                            }, isWhite = !this._row[offset], counterPos = 0;
                            coderange || (coderange = CODE_PATTERN.length);
                            for(var i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
                                    for(var code = 0; code < coderange; code++){
                                        var error = this._matchPattern(counter, CODE_PATTERN[code]);
                                        bestMatch.end = i, error < bestMatch.error && (bestMatch.code = code, bestMatch.error = error);
                                    }
                                    if (bestMatch.error > 0.48) return null;
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
                            for(var offset = this._nextSet(this._row), startInfo = null; !startInfo && (startInfo = this._findPattern(START_PATTERN, offset, !1, !0));){
                                var leadingWhitespaceStart = startInfo.start - (startInfo.end - startInfo.start);
                                if (leadingWhitespaceStart >= 0 && this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) return startInfo;
                                offset = startInfo.end, startInfo = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculateFirstDigit",
                        value: function(codeFrequency) {
                            for(var i = 0; i < CODE_FREQUENCY.length; i++)if (codeFrequency === CODE_FREQUENCY[i]) return i;
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function(inCode, result, decodedCodes) {
                            for(var outCode = _objectSpread({}, inCode), codeFrequency = 0x0, i = 0; i < 6; i++){
                                if (!(outCode = this._decodeCode(outCode.end))) return null;
                                outCode.code >= 10 ? (outCode.code -= 10, codeFrequency |= 1 << 5 - i) : codeFrequency |= 0 << 5 - i, result.push(outCode.code), decodedCodes.push(outCode);
                            }
                            var firstDigit = this._calculateFirstDigit(codeFrequency);
                            if (null === firstDigit) return null;
                            result.unshift(firstDigit);
                            var middlePattern = this._findPattern(MIDDLE_PATTERN, outCode.end, !0, !1);
                            if (null === middlePattern || !middlePattern.end) return null;
                            decodedCodes.push(middlePattern);
                            for(var _i = 0; _i < 6; _i++){
                                if (!(middlePattern = this._decodeCode(middlePattern.end, 10))) return null;
                                decodedCodes.push(middlePattern), result.push(middlePattern.code);
                            }
                            return middlePattern;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function(endInfo) {
                            var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start);
                            return trailingWhitespaceEnd < this._row.length && this._matchRange(endInfo.end, trailingWhitespaceEnd, 0) ? endInfo : null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function(offset, isWhite) {
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
                            return sum % 10 == 0;
                        }
                    },
                    {
                        key: "_decodeExtensions",
                        value: function(offset) {
                            var start = this._nextSet(this._row, offset), startInfo = this._findPattern(EXTENSION_START_PATTERN, start, !1, !1);
                            if (null === startInfo) return null;
                            for(var i = 0; i < this.supplements.length; i++)try {
                                var result = this.supplements[i].decode(this._row, startInfo.end);
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
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function(row, start) {
                            var result = new Array(), decodedCodes = new Array(), resultInfo = {}, startInfo = this._findStart();
                            if (!startInfo) return null;
                            var code = {
                                start: startInfo.start,
                                end: startInfo.end
                            };
                            if (decodedCodes.push(code), !(code = this._decodePayload(code, result, decodedCodes))) return null;
                            if (!(code = this._findEnd(code.end, !1))) return null;
                            if (decodedCodes.push(code), !this._checksum(result)) return null;
                            if (this.supplements.length > 0) {
                                var supplement = this._decodeExtensions(code.end);
                                if (!supplement) return null;
                                if (!supplement.decodedCodes) return null;
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
                    }, 
                ]), EANReader;
            }(barcode_reader), toConsumableArray = __webpack_require__(33), toConsumableArray_default = __webpack_require__.n(toConsumableArray), ALPHABET = new Uint16Array(toConsumableArray_default()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%").map(function(_char) {
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
                0x02a, 
            ]), code_39_reader = function(_BarcodeReader) {
                inherits_default()(Code39Reader, _BarcodeReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = Code39Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function Code39Reader() {
                    var _this;
                    classCallCheck_default()(this, Code39Reader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                                0, 
                            ]), counterPos = 0, isWhite = !1, i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
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
                                0, 
                            ]), result = [];
                            if (!(start = this._findStart())) return null;
                            var nextStart = this._nextSet(this._row, start.end);
                            do {
                                counters = this._toCounters(nextStart, counters);
                                var pattern = this._toPattern(counters);
                                if (pattern < 0) return null;
                                if (null === (decodedChar = this._patternToChar(pattern))) return null;
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
                    }, 
                ]), Code39Reader;
            }(barcode_reader), get = __webpack_require__(13), get_default = __webpack_require__.n(get), patterns = {
                IOQ: /[IOQ]/g,
                AZ09: /[A-Z0-9]{17}/
            }, code_39_vin_reader = function(_Code39Reader) {
                inherits_default()(Code39VINReader, _Code39Reader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = Code39VINReader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function Code39VINReader() {
                    var _this;
                    classCallCheck_default()(this, Code39VINReader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), defineProperty_default()(assertThisInitialized_default()(_this), "FORMAT", "code_39_vin"), _this;
                }
                return createClass_default()(Code39VINReader, [
                    {
                        key: "_checkChecksum",
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
                            return code ? (code = code.replace(patterns.IOQ, "")).match(patterns.AZ09) ? this._checkChecksum(code) ? (result.code = code, result) : null : (console.log("Failed AZ09 pattern code:", code), null) : null;
                        }
                    }, 
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
                68, 
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
                0x00e, 
            ], START_END = [
                0x01a,
                0x029,
                0x00b,
                0x00e
            ], codabar_reader = function(_BarcodeReader) {
                inherits_default()(NewCodabarReader, _BarcodeReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = NewCodabarReader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function NewCodabarReader() {
                    var _this;
                    classCallCheck_default()(this, NewCodabarReader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                                if (-1 !== pattern && this._isStartEnd(pattern)) return start += this._sumCounters(0, i), end = start + this._sumCounters(i, i + 8), {
                                    start: start,
                                    end: end,
                                    startCounter: i,
                                    endCounter: i + 8
                                };
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
                            }while (nextStart < this._counters.length)
                            if (result.length - 2 < 4 || !this._isStartEnd(pattern)) return null;
                            if (!this._verifyWhitespace(start.startCounter, nextStart - 8)) return null;
                            if (!this._validateResult(result, start.startCounter)) return null;
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
                    }, 
                ]), NewCodabarReader;
            }(barcode_reader), upc_reader = function(_EANReader) {
                inherits_default()(UPCReader, _EANReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = UPCReader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function UPCReader() {
                    var _this;
                    classCallCheck_default()(this, UPCReader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                    }, 
                ]), UPCReader;
            }(ean_reader), ean_8_reader = function(_EANReader) {
                inherits_default()(EAN8Reader, _EANReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = EAN8Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function EAN8Reader() {
                    var _this;
                    classCallCheck_default()(this, EAN8Reader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                    }, 
                ]), EAN8Reader;
            }(ean_reader), ean_2_reader = function(_EANReader) {
                inherits_default()(EAN2Reader, _EANReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = EAN2Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function EAN2Reader() {
                    var _this;
                    classCallCheck_default()(this, EAN2Reader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                    }, 
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
                5, 
            ], ean_5_reader = function(_EANReader) {
                inherits_default()(EAN5Reader, _EANReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = EAN5Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function EAN5Reader() {
                    var _this;
                    classCallCheck_default()(this, EAN5Reader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                            for(var codeFrequency1 = 0, offset = start, end = this._row.length, code = null, result1 = [], decodedCodes = [], i1 = 0; i1 < 5 && offset < end; i1++){
                                if (!(code = this._decodeCode(offset))) return null;
                                decodedCodes.push(code), result1.push(code.code % 10), code.code >= 10 && (codeFrequency1 |= 1 << 4 - i1), 4 !== i1 && (offset = this._nextSet(this._row, code.end), offset = this._nextUnset(this._row, offset));
                            }
                            if (5 !== result1.length) return null;
                            if (function(result) {
                                for(var length = result.length, sum = 0, i = length - 2; i >= 0; i -= 2)sum += result[i];
                                sum *= 3;
                                for(var _i = length - 1; _i >= 0; _i -= 2)sum += result[_i];
                                return (sum *= 3) % 10;
                            }(result1) !== function(codeFrequency) {
                                for(var i = 0; i < 10; i++)if (codeFrequency === CHECK_DIGIT_ENCODINGS[i]) return i;
                                return null;
                            }(codeFrequency1)) return null;
                            var startInfo = this._findStart();
                            return {
                                code: result1.join(""),
                                decodedCodes: decodedCodes,
                                end: code.end,
                                format: this.FORMAT,
                                startInfo: startInfo,
                                start: startInfo.start
                            };
                        }
                    }, 
                ]), EAN5Reader;
            }(ean_reader);
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
            var upc_e_reader = function(_EANReader) {
                inherits_default()(UPCEReader, _EANReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = UPCEReader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function UPCEReader() {
                    var _this;
                    classCallCheck_default()(this, UPCEReader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                        ], 
                    ]), defineProperty_default()(assertThisInitialized_default()(_this), "STOP_PATTERN", [
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7,
                        1 / 6 * 7, 
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
                            }({}, inCode), codeFrequency = 0x0, i2 = 0; i2 < 6; i2++){
                                if (!(outCode = this._decodeCode(outCode.end))) return null;
                                outCode.code >= 10 && (outCode.code = outCode.code - 10, codeFrequency |= 1 << 5 - i2), result.push(outCode.code), decodedCodes.push(outCode);
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
                    }, 
                ]), UPCEReader;
            }(ean_reader), i2of5_reader = function(_BarcodeReader) {
                inherits_default()(I2of5Reader, _BarcodeReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = I2of5Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
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
                        ], 
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
                            var isWhite = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], tryHarder = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], counter = new Array(pattern.length).fill(0), counterPos = 0, bestMatch = {
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
                                if (narrowBarWidth = Math.floor((startInfo.end - startInfo.start) / 4), leadingWhitespaceStart = startInfo.start - 10 * narrowBarWidth, leadingWhitespaceStart >= 0 && this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) return startInfo;
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
                                ], 
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
                            var result = new Array(), decodedCodes = new Array(), startInfo = this._findStart();
                            if (!startInfo) return null;
                            decodedCodes.push(startInfo);
                            var endInfo = this._findEnd();
                            if (!endInfo) return null;
                            var counters = this._fillCounters(startInfo.end, endInfo.start, !1);
                            return this._verifyCounterLength(counters) && this._decodePayload(counters, result, decodedCodes) ? result.length % 2 != 0 || result.length < 6 ? null : (decodedCodes.push(endInfo), {
                                code: result.join(""),
                                start: startInfo.start,
                                end: endInfo.end,
                                startInfo: startInfo,
                                decodedCodes: decodedCodes,
                                format: this.FORMAT
                            }) : null;
                        }
                    }, 
                ]), I2of5Reader;
            }(barcode_reader), _2of5_reader_START_PATTERN = [
                3,
                1,
                3,
                1,
                1,
                1, 
            ], STOP_PATTERN = [
                3,
                1,
                1,
                1,
                3, 
            ], _2of5_reader_CODE_PATTERN = [
                [
                    1,
                    1,
                    3,
                    3,
                    1, 
                ],
                [
                    3,
                    1,
                    1,
                    1,
                    3, 
                ],
                [
                    1,
                    3,
                    1,
                    1,
                    3, 
                ],
                [
                    3,
                    3,
                    1,
                    1,
                    1, 
                ],
                [
                    1,
                    1,
                    3,
                    1,
                    3, 
                ],
                [
                    3,
                    1,
                    3,
                    1,
                    1, 
                ],
                [
                    1,
                    3,
                    3,
                    1,
                    1, 
                ],
                [
                    1,
                    1,
                    1,
                    3,
                    3, 
                ],
                [
                    3,
                    1,
                    1,
                    3,
                    1, 
                ],
                [
                    1,
                    3,
                    1,
                    3,
                    1, 
                ], 
            ], START_PATTERN_LENGTH = _2of5_reader_START_PATTERN.reduce(function(sum, val) {
                return sum + val;
            }, 0), _2of5_reader = function(_BarcodeReader) {
                inherits_default()(TwoOfFiveReader, _BarcodeReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = TwoOfFiveReader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function TwoOfFiveReader() {
                    var _this;
                    classCallCheck_default()(this, TwoOfFiveReader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                                if (narrowBarWidth = Math.floor((startInfo.end - startInfo.start) / START_PATTERN_LENGTH), leadingWhitespaceStart = startInfo.start - 5 * narrowBarWidth, leadingWhitespaceStart >= 0 && this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) break;
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
                            this._row.reverse();
                            var offset = this._nextSet(this._row), endInfo = this._findPattern(STOP_PATTERN, offset, !1, !0);
                            if (this._row.reverse(), null === endInfo) return null;
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
                            return this._decodePayload(counters, result, decodedCodes) ? result.length < 5 ? null : (decodedCodes.push(endInfo), {
                                code: result.join(""),
                                start: startInfo.start,
                                end: endInfo.end,
                                startInfo: startInfo,
                                decodedCodes: decodedCodes,
                                format: this.FORMAT
                            }) : null;
                        }
                    }, 
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
                0x15e, 
            ]), code_93_reader = function(_BarcodeReader) {
                inherits_default()(Code93Reader, _BarcodeReader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = Code93Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function Code93Reader() {
                    var _this;
                    classCallCheck_default()(this, Code93Reader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                                0, 
                            ]), counterPos = 0, isWhite = !1, i = offset; i < this._row.length; i++)if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
                            else {
                                if (counterPos === counter.length - 1) {
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
                                                decodedChar = "\x7f";
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
                                0, 
                            ]), result = [], nextStart = this._nextSet(this._row, start.end);
                            do {
                                counters = this._toCounters(nextStart, counters);
                                var pattern = this._toPattern(counters);
                                if (pattern < 0) return null;
                                if (null === (decodedChar = this._patternToChar(pattern))) return null;
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
                    }, 
                ]), Code93Reader;
            }(barcode_reader), code_32_reader_patterns = {
                AEIO: /[AEIO]/g,
                AZ09: /[A-Z0-9]/
            }, code_32_reader = function(_Code39Reader) {
                inherits_default()(Code32Reader, _Code39Reader);
                var Derived, hasNativeReflectConstruct, _super = (Derived = Code32Reader, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function Code32Reader() {
                    var _this;
                    classCallCheck_default()(this, Code32Reader);
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
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
                            if (!code) return null;
                            if (code = code.replace(code_32_reader_patterns.AEIO, ""), !this._checkChecksum(code)) return null;
                            var code32 = this._decodeCode32(code);
                            return code32 ? (result.code = code32, result) : null;
                        }
                    }, 
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
                create: function(config, inputImageWrapper1) {
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
                        var i, result = null, barcodeLine = bresenham.getBarcodeLine(inputImageWrapper1, line[0], line[1]);
                        for(config.debug.showFrequency && (image_debug.a.drawPath(line, {
                            x: "x",
                            y: "y"
                        }, _canvas.ctx.overlay, {
                            color: "red",
                            lineWidth: 3
                        }), bresenham.debug.printFrequency(barcodeLine.line, _canvas.dom.frequency)), bresenham.toBinaryLine(barcodeLine), config.debug.showPattern && bresenham.debug.printPattern(barcodeLine.line, _canvas.dom.pattern), i = 0; i < _barcodeReaders.length && null === result; i++)result = _barcodeReaders[i].decodePattern(barcodeLine.line);
                        return null === result ? null : {
                            codeResult: result,
                            barcodeLine: barcodeLine
                        };
                    }
                    function _decodeFromBoundingBox(box2) {
                        var line2, result2, box1, line1, ctx = _canvas.ctx.overlay;
                        config.debug.drawBoundingBox && ctx && image_debug.a.drawPath(box2, {
                            x: 0,
                            y: 1
                        }, ctx, {
                            color: "blue",
                            lineWidth: 2
                        });
                        var lineLength = Math.sqrt(Math.pow(Math.abs((line1 = line2 = [
                            {
                                x: ((box1 = box2)[1][0] - box1[0][0]) / 2 + box1[0][0],
                                y: (box1[1][1] - box1[0][1]) / 2 + box1[0][1]
                            },
                            {
                                x: (box1[3][0] - box1[2][0]) / 2 + box1[2][0],
                                y: (box1[3][1] - box1[2][1]) / 2 + box1[2][1]
                            }, 
                        ])[1].y - line1[0].y), 2) + Math.pow(Math.abs(line1[1].x - line1[0].x), 2)), lineAngle1 = Math.atan2(line2[1].y - line2[0].y, line2[1].x - line2[0].x);
                        return null === (line2 = function(line, angle, ext) {
                            function extendLine(amount) {
                                var extension = {
                                    y: amount * Math.sin(angle),
                                    x: amount * Math.cos(angle)
                                };
                                line[0].y -= extension.y, line[0].x -= extension.x, line[1].y += extension.y, line[1].x += extension.x;
                            }
                            for(extendLine(ext); ext > 1 && (!inputImageWrapper1.inImageWithBorder(line[0]) || !inputImageWrapper1.inImageWithBorder(line[1]));)extendLine(-(ext -= Math.ceil(ext / 2)));
                            return line;
                        }(line2, lineAngle1, Math.floor(0.1 * lineLength))) ? null : (null === (result2 = tryDecode(line2)) && (result2 = function(box, line, lineAngle) {
                            var i, dir, extension, sideLength = Math.sqrt(Math.pow(box[1][0] - box[0][0], 2) + Math.pow(box[1][1] - box[0][1], 2)), result = null, xdir = Math.sin(lineAngle), ydir = Math.cos(lineAngle);
                            for(i = 1; i < 16 && null === result; i++)extension = {
                                y: (dir = sideLength / 16 * i * (i % 2 == 0 ? -1 : 1)) * xdir,
                                x: dir * ydir
                            }, line[0].y += extension.x, line[0].x -= extension.y, line[1].y += extension.x, line[1].x -= extension.y, result = tryDecode(line);
                            return result;
                        }(box2, line2, lineAngle1)), null === result2) ? null : (result2 && config.debug.drawScanline && ctx && image_debug.a.drawPath(line2, {
                            x: "x",
                            y: "y"
                        }, ctx, {
                            color: "red",
                            lineWidth: 3
                        }), {
                            codeResult: result2.codeResult,
                            line: line2,
                            angle: lineAngle1,
                            pattern: result2.barcodeLine.line,
                            threshold: result2.barcodeLine.threshold
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
                                }, 
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
                            if (READERS[name]) throw new Error("cannot register existing reader", name);
                            READERS[name] = reader;
                        },
                        setReaders: function(readers) {
                            config.readers = readers, _barcodeReaders.length = 0, initReaders();
                        }
                    };
                }
            }, events1 = function() {
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
                    else if (!(subscription = callback).callback) throw new Error("Callback was not specified on options");
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
            }(), asyncToGenerator = __webpack_require__(20), asyncToGenerator_default = __webpack_require__.n(asyncToGenerator), regenerator = __webpack_require__(12), regenerator_default = __webpack_require__.n(regenerator), pick = __webpack_require__(85), pick_default = __webpack_require__.n(pick), wrapNativeSuper = __webpack_require__(86), wrapNativeSuper_default = __webpack_require__.n(wrapNativeSuper), Exception_Exception = function(_Error) {
                inherits_default()(Exception, _Error);
                var Derived, hasNativeReflectConstruct, _super = (Derived = Exception, hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = getPrototypeOf_default()(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = getPrototypeOf_default()(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return possibleConstructorReturn_default()(this, result);
                });
                function Exception(m, code) {
                    var _this;
                    return classCallCheck_default()(this, Exception), _this = _super.call(this, m), defineProperty_default()(assertThisInitialized_default()(_this), "code", void 0), _this.code = code, Object.setPrototypeOf(assertThisInitialized_default()(_this), Exception.prototype), _this;
                }
                return Exception;
            }(wrapNativeSuper_default()(Error)), ERROR_DESC = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
            function enumerateDevices() {
                try {
                    return navigator.mediaDevices.enumerateDevices();
                } catch (err) {
                    var error = new Exception_Exception("enumerateDevices is not defined. ".concat(ERROR_DESC), -1);
                    return Promise.reject(error);
                }
            }
            function getUserMedia(constraints) {
                try {
                    return navigator.mediaDevices.getUserMedia(constraints);
                } catch (err) {
                    var error = new Exception_Exception("getUserMedia is not defined. ".concat(ERROR_DESC), -1);
                    return Promise.reject(error);
                }
            }
            function waitForVideo(video) {
                return new Promise(function(resolve, reject) {
                    var attempts = 10;
                    function checkVideo() {
                        attempts > 0 ? video.videoWidth > 10 && video.videoHeight > 10 ? (console.log("* dev: checkVideo found ".concat(video.videoWidth, "px x ").concat(video.videoHeight, "px")), resolve()) : window.setTimeout(checkVideo, 500) : reject(new Exception_Exception("Unable to play video stream. Is webcam working?", -1)), attempts--;
                    }
                    checkVideo();
                });
            }
            function initCamera(_x, _x2) {
                return _initCamera.apply(this, arguments);
            }
            function _initCamera() {
                return (_initCamera = asyncToGenerator_default()(regenerator_default.a.mark(function _callee2(video, constraints) {
                    var stream;
                    return regenerator_default.a.wrap(function(_context2) {
                        for(;;)switch(_context2.prev = _context2.next){
                            case 0:
                                return _context2.next = 2, getUserMedia(constraints);
                            case 2:
                                if (streamRef = stream = _context2.sent, !video) {
                                    _context2.next = 11;
                                    break;
                                }
                                return video.setAttribute("autoplay", "true"), video.setAttribute("muted", "true"), video.setAttribute("playsinline", "true"), video.srcObject = stream, video.addEventListener("loadedmetadata", function() {
                                    video.play();
                                }), _context2.abrupt("return", waitForVideo(video));
                            case 11:
                                return _context2.abrupt("return", Promise.resolve());
                            case 12:
                            case "end":
                                return _context2.stop();
                        }
                    }, _callee2);
                }))).apply(this, arguments);
            }
            function pickConstraints() {
                var videoConstraints, normalized, videoConstraints1 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, video = (videoConstraints = videoConstraints1, normalized = pick_default()(videoConstraints, [
                    "width",
                    "height",
                    "facingMode",
                    "aspectRatio",
                    "deviceId", 
                ]), void 0 !== videoConstraints.minAspectRatio && videoConstraints.minAspectRatio > 0 && (normalized.aspectRatio = videoConstraints.minAspectRatio, console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead")), void 0 !== videoConstraints.facing && (normalized.facingMode = videoConstraints.facing, console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'")), normalized);
                return video && video.deviceId && video.facingMode && delete video.facingMode, Promise.resolve({
                    audio: !1,
                    video: video
                });
            }
            function _enumerateVideoDevices() {
                return (_enumerateVideoDevices = asyncToGenerator_default()(regenerator_default.a.mark(function _callee3() {
                    var devices;
                    return regenerator_default.a.wrap(function(_context3) {
                        for(;;)switch(_context3.prev = _context3.next){
                            case 0:
                                return _context3.next = 2, enumerateDevices();
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
            var QuaggaJSCameraAccess = {
                requestedVideoElement: null,
                request: function(video, videoConstraints) {
                    return asyncToGenerator_default()(regenerator_default.a.mark(function _callee() {
                        var newConstraints;
                        return regenerator_default.a.wrap(function(_context) {
                            for(;;)switch(_context.prev = _context.next){
                                case 0:
                                    return QuaggaJSCameraAccess.requestedVideoElement = video, _context.next = 3, pickConstraints(videoConstraints);
                                case 3:
                                    return newConstraints = _context.sent, _context.abrupt("return", initCamera(video, newConstraints));
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
                            var codeResult1, codeResult2, list, codeResult3, filter, result = {};
                            codeResult1 = codeResult, capacity && codeResult1 && (codeResult2 = codeResult1, !((list = config.blacklist) && list.some(function(item) {
                                return Object.keys(item).every(function(key) {
                                    return item[key] === codeResult2[key];
                                });
                            }))) && (codeResult3 = codeResult1, "function" != typeof (filter = config.filter) || filter(codeResult3)) && (capacity--, result.codeResult = codeResult, capture && (canvas.width = imageSize.x, canvas.height = imageSize.y, image_debug.a.drawImage(data, imageSize, ctx), result.frame = canvas.toDataURL()), results.push(result));
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
            function getViewPort_getViewPort(target) {
                return "undefined" == typeof document ? null : target instanceof HTMLElement && target.nodeName && 1 === target.nodeType ? target : document.querySelector("string" == typeof target ? target : "#interactive.viewport");
            }
            function getCanvasAndContext(selector, className) {
                var selector1, className1, canvas, canvas1 = (selector1 = selector, className1 = className, (canvas = document.querySelector(selector1)) || ((canvas = document.createElement("canvas")).className = className1), canvas), context = canvas1.getContext("2d");
                return {
                    canvas: canvas1,
                    context: context
                };
            }
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
            function readEXIFData(file, start, exifTags) {
                if ("Exif" !== getStringFromBuffer(file, start, 4)) return !1;
                var bigEnd, tiffOffset = start + 6;
                if (0x4949 === file.getUint16(tiffOffset)) bigEnd = !1;
                else {
                    if (0x4d4d !== file.getUint16(tiffOffset)) return !1;
                    bigEnd = !0;
                }
                if (0x002a !== file.getUint16(tiffOffset + 2, !bigEnd)) return !1;
                var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
                return !(firstIFDOffset < 0x00000008) && readTags(file, tiffOffset, tiffOffset + firstIFDOffset, exifTags, bigEnd);
            }
            function readTags(file, tiffStart, dirStart, strings, bigEnd) {
                for(var entries = file.getUint16(dirStart, !bigEnd), tags = {}, i = 0; i < entries; i++){
                    var entryOffset = dirStart + 12 * i + 2, tag = strings[file.getUint16(entryOffset, !bigEnd)];
                    tag && (tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd));
                }
                return tags;
            }
            function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
                var type = file.getUint16(entryOffset + 2, !bigEnd), numValues = file.getUint32(entryOffset + 4, !bigEnd);
                return 3 === type && 1 === numValues ? file.getUint16(entryOffset + 8, !bigEnd) : null;
            }
            function getStringFromBuffer(buffer, start, length) {
                for(var outstr = "", n = start; n < start + length; n++)outstr += String.fromCharCode(buffer.getUint8(n));
                return outstr;
            }
            var ImageLoader = {};
            function addOnloadHandler(img, htmlImagesArray) {
                img.onload = function() {
                    htmlImagesArray.loaded(this);
                };
            }
            ImageLoader.load = function(directory, callback, offset1, size, sequence) {
                var i, img, num, htmlImagesSrcArray = new Array(size), htmlImagesArray = new Array(htmlImagesSrcArray.length);
                if (!1 === sequence) htmlImagesSrcArray[0] = directory;
                else for(i = 0; i < htmlImagesSrcArray.length; i++)num = offset1 + i, htmlImagesSrcArray[i] = "".concat(directory, "image-").concat("00".concat(num).slice(-3), ".jpg");
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
                        var url, tags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : AvailableTags;
                        return /^blob:/i.test(src) ? (url = src, new Promise(function(resolve, reject) {
                            var http = new XMLHttpRequest();
                            http.open("GET", url, !0), http.responseType = "blob", http.onreadystatechange = function() {
                                http.readyState === XMLHttpRequest.DONE && (200 === http.status || 0 === http.status) && resolve(this.response);
                            }, http.onerror = reject, http.send();
                        })).then(readToBuffer).then(function(buffer) {
                            return function(file) {
                                var selectedTags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : AvailableTags, dataView = new DataView(file), length = file.byteLength, exifTags = selectedTags.reduce(function(result, selectedTag) {
                                    var exifTag = Object.keys(ExifTags).filter(function(tag) {
                                        return ExifTags[tag] === selectedTag;
                                    })[0];
                                    return exifTag && (result[exifTag] = selectedTag), result;
                                }, {}), offset = 2;
                                if (0xff !== dataView.getUint8(0) || 0xd8 !== dataView.getUint8(1)) return !1;
                                for(; offset < length && 0xff === dataView.getUint8(offset);){
                                    if (0xe1 === dataView.getUint8(offset + 1)) return readEXIFData(dataView, offset + 4, exifTags);
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
                }; i < htmlImagesSrcArray.length; i++)img = new Image(), htmlImagesArray.addImage(img), addOnloadHandler(img, htmlImagesArray), img.src = htmlImagesSrcArray[i];
            };
            var image_loader = ImageLoader, inputStreamFactory = {
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
                        if (handlers && handlers.length > 0) for(j = 0; j < handlers.length; j++)handlers[j].apply(inputStream, args);
                    }
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
                            _config = stream, !1 === stream.sequence ? (baseUrl = stream.src, size = 1) : (baseUrl = stream.src, size = stream.length), loaded = !1, image_loader.load(baseUrl, function(imgs) {
                                var _config5, _config6;
                                if (imgArray = imgs, imgs[0].tags && imgs[0].tags.orientation) switch(imgs[0].tags.orientation){
                                    case 6:
                                    case 8:
                                        width = imgs[0].img.height, height = imgs[0].img.width;
                                        break;
                                    default:
                                        width = imgs[0].img.width, height = imgs[0].img.height;
                                }
                                else width = imgs[0].img.width, height = imgs[0].img.height;
                                calculatedWidth = null !== (_config5 = _config) && void 0 !== _config5 && _config5.size ? width / height > 1 ? _config.size : Math.floor(width / height * _config.size) : width, calculatedHeight = null !== (_config6 = _config) && void 0 !== _config6 && _config6.size ? width / height > 1 ? Math.floor(height / width * _config.size) : _config.size : height, _canvasSize.x = calculatedWidth, _canvasSize.y = calculatedHeight, loaded = !0, frameIdx = 0, setTimeout(function() {
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
                            return loaded ? (!paused && (frame = null === (_imgArray = imgArray) || void 0 === _imgArray ? void 0 : _imgArray[frameIdx], frameIdx < size - 1 ? frameIdx++ : setTimeout(function() {
                                _ended = !0, publishEvent("ended", []);
                            }, 0)), frame) : null;
                        }
                    };
                    return inputStream;
                }
            }, input_stream_browser = inputStreamFactory, cv_utils = __webpack_require__(8), TO_RADIANS = Math.PI / 180, FrameGrabber = {};
            FrameGrabber.create = function(inputStream, canvas2) {
                var _canvas, _that = {}, _streamConfig = inputStream.getConfig(), _videoSize = Object(cv_utils.h)(inputStream.getRealWidth(), inputStream.getRealHeight()), _canvasSize = inputStream.getCanvasSize(), _size = Object(cv_utils.h)(inputStream.getWidth(), inputStream.getHeight()), topRight = inputStream.getTopRight(), _sx = topRight.x, _sy = topRight.y, _ctx = null, _data = null;
                return (_canvas = canvas2 || document.createElement("canvas")).width = _canvasSize.x, _canvas.height = _canvasSize.y, _ctx = _canvas.getContext("2d"), _data = new Uint8Array(_size.x * _size.y), console.log("FrameGrabber", JSON.stringify({
                    size: _size,
                    topRight: topRight,
                    videoSize: _videoSize,
                    canvasSize: _canvasSize
                })), _that.attachData = function(data) {
                    _data = data;
                }, _that.getData = function() {
                    return _data;
                }, _that.grab = function() {
                    var canvas, targetSize, ctxData, doHalfSample = _streamConfig.halfSample, frame = inputStream.getFrame(), drawable = frame, drawAngle = 0;
                    if (drawable) {
                        if (canvas = _canvas, targetSize = _canvasSize, canvas.width !== targetSize.x && (console.log("WARNING: canvas-size needs to be adjusted"), canvas.width = targetSize.x), canvas.height !== targetSize.y && (console.log("WARNING: canvas-size needs to be adjusted"), canvas.height = targetSize.y), "ImageStream" === _streamConfig.type && (drawable = frame.img, frame.tags && frame.tags.orientation)) switch(frame.tags.orientation){
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
            var frame_grabber_browser = FrameGrabber;
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
            var workerPool = [];
            function workerInterface(factory) {
                if (factory) {
                    var imageWrapper, Quagga = factory().default;
                    if (!Quagga) {
                        self.postMessage({
                            event: "error",
                            message: "Quagga could not be created"
                        });
                        return;
                    }
                }
                function onProcessed(result) {
                    self.postMessage({
                        event: "processed",
                        imageData: imageWrapper.data,
                        result: result
                    }, [
                        imageWrapper.data.buffer
                    ]);
                }
                function workerInterfaceReady() {
                    self.postMessage({
                        event: "initialized",
                        imageData: imageWrapper.data
                    }, [
                        imageWrapper.data.buffer
                    ]);
                }
                self.onmessage = function(e) {
                    if ("init" === e.data.cmd) {
                        var config = e.data.config;
                        config.numOfWorkers = 0, imageWrapper = new Quagga.ImageWrapper({
                            x: e.data.size.x,
                            y: e.data.size.y
                        }, new Uint8Array(e.data.imageData)), Quagga.init(config, workerInterfaceReady, imageWrapper), Quagga.onProcessed(onProcessed);
                    } else "process" === e.data.cmd ? (imageWrapper.data = new Uint8Array(e.data.imageData), Quagga.start()) : "setReaders" === e.data.cmd ? Quagga.setReaders(e.data.readers) : "registerReader" === e.data.cmd && Quagga.registerReader(e.data.name, e.data.reader);
                };
            }
            function initWorker(config, inputStream, cb) {
                var blob, factorySource, config1, blobURL = ("undefined" != typeof __factorySource__ && (factorySource = __factorySource__), blob = new Blob([
                    "(" + workerInterface.toString() + ")(" + factorySource + ");", 
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
                    config: qworker_objectSpread(qworker_objectSpread({}, config1 = config), {}, {
                        inputStream: qworker_objectSpread(qworker_objectSpread({}, config1.inputStream), {}, {
                            target: null
                        })
                    })
                }, [
                    workerThread.imageData.buffer
                ]);
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
                    if (config) for(var i = 0; i < increaseBy; i++)initWorker(config, inputStream, workerInitialized);
                }
            }
            function moveBox(box, xOffset, yOffset) {
                for(var corner = box.length; corner--;)box[corner][0] += xOffset, box[corner][1] += yOffset;
            }
            var quagga_Quagga = function() {
                var _stop;
                function Quagga() {
                    var _this = this;
                    classCallCheck_default()(this, Quagga), defineProperty_default()(this, "context", new QuaggaContext_QuaggaContext()), defineProperty_default()(this, "canRecord", function(callback) {
                        var _this$context$config;
                        _this.context.config && (barcode_locator.a.checkImageConstraints(_this.context.inputStream, null === (_this$context$config = _this.context.config) || void 0 === _this$context$config ? void 0 : _this$context$config.locator), _this.initCanvas(), _this.context.framegrabber = frame_grabber_browser.create(_this.context.inputStream, _this.context.canvasContainer.dom.image), void 0 === _this.context.config.numOfWorkers && (_this.context.config.numOfWorkers = 0), adjustWorkerPool(_this.context.config.numOfWorkers, _this.context.config, _this.context.inputStream, function() {
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
                            workersUpdated || (_this.context.framegrabber.attachData(null === (_this$context$inputIm = _this.context.inputImageWrapper) || void 0 === _this$context$inputIm ? void 0 : _this$context$inputIm.data), _this.context.framegrabber.grab() && (workersUpdated || _this.locateAndDecode()));
                        } else _this.context.framegrabber.attachData(null === (_this$context$inputIm2 = _this.context.inputImageWrapper) || void 0 === _this$context$inputIm2 ? void 0 : _this$context$inputIm2.data), _this.context.framegrabber.grab(), _this.locateAndDecode();
                    });
                }
                return createClass_default()(Quagga, [
                    {
                        key: "initBuffers",
                        value: function(imageWrapper) {
                            if (this.context.config) {
                                var inputStream, imageWrapper3, locator, inputImageWrapper, boxSize, _initBuffers2 = (inputStream = this.context.inputStream, imageWrapper3 = imageWrapper, locator = this.context.config.locator, inputImageWrapper = imageWrapper3 || new image_wrapper.a({
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
                                        inputImageWrapper.size.y, 
                                    ]),
                                    Object(gl_vec2.clone)([
                                        inputImageWrapper.size.x,
                                        0
                                    ]), 
                                ], barcode_locator.a.init(inputImageWrapper, locator), {
                                    inputImageWrapper: inputImageWrapper,
                                    boxSize: boxSize
                                }), inputImageWrapper2 = _initBuffers2.inputImageWrapper, boxSize1 = _initBuffers2.boxSize;
                                this.context.inputImageWrapper = inputImageWrapper2, this.context.boxSize = boxSize1;
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
                            var container1 = function(context) {
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
                            if (container1) {
                                var ctx = container1.ctx, dom1 = container1.dom;
                                this.context.canvasContainer.dom.image = dom1.image, this.context.canvasContainer.dom.overlay = dom1.overlay, this.context.canvasContainer.ctx.image = ctx.image, this.context.canvasContainer.ctx.overlay = ctx.overlay;
                            }
                        }
                    },
                    {
                        key: "initInputStream",
                        value: function(callback) {
                            if (this.context.config && this.context.config.inputStream) {
                                var _this$context$config$ = this.context.config.inputStream, inputType = _this$context$config$.type, constraints = _this$context$config$.constraints, _setupInputStream = function() {
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
                                }(inputType, this.getViewPort(), input_stream_browser), video1 = _setupInputStream.video, inputStream = _setupInputStream.inputStream;
                                "LiveStream" === inputType && video1 && camera_access.request(video1, constraints).then(function() {
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
                                    Object(gl_vec2.clone)(this.context.boxSize[3]), 
                                ], 
                            ];
                        }
                    },
                    {
                        key: "transformResult",
                        value: function(result) {
                            var line, xOffset, yOffset, _this2 = this, topRight = this.context.inputStream.getTopRight(), xOffset1 = topRight.x, yOffset1 = topRight.y;
                            if ((0 !== xOffset1 || 0 !== yOffset1) && (result.barcodes && result.barcodes.forEach(function(barcode) {
                                return _this2.transformResult(barcode);
                            }), result.line && 2 === result.line.length && (line = result.line, xOffset = xOffset1, yOffset = yOffset1, line[0].x += xOffset, line[0].y += yOffset, line[1].x += xOffset, line[1].y += yOffset), result.box && moveBox(result.box, xOffset1, yOffset1), result.boxes && result.boxes.length > 0)) for(var i = 0; i < result.boxes.length; i++)moveBox(result.boxes[i], xOffset1, yOffset1);
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
                            }) : result.codeResult && this.context.resultCollector.addResult(imageData, this.context.inputStream.getCanvasSize(), result.codeResult));
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
                            result && this.context.onUIThread && (this.transformResult(result), this.addResult(result, imageData), resultToPublish = result.barcodes || result), events1.publish("processed", resultToPublish), this.hasCodeResult(result) && events1.publish("detected", resultToPublish);
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
                        value: (_stop = asyncToGenerator_default()(regenerator_default.a.mark(function _callee() {
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
                            var readers1;
                            this.context.decoder && this.context.decoder.setReaders(readers), readers1 = readers, workerPool.forEach(function(workerThread) {
                                return workerThread.worker.postMessage({
                                    cmd: "setReaders",
                                    readers: readers1
                                });
                            });
                        }
                    },
                    {
                        key: "registerReader",
                        value: function(name, reader) {
                            var name1, reader1;
                            barcode_decoder.registerReader(name, reader), this.context.decoder && this.context.decoder.registerReader(name, reader), name1 = name, reader1 = reader, workerPool.forEach(function(workerThread) {
                                return workerThread.worker.postMessage({
                                    cmd: "registerReader",
                                    name: name1,
                                    reader: reader1
                                });
                            });
                        }
                    }, 
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
                    events1.subscribe("detected", callback);
                },
                offDetected: function(callback) {
                    events1.unsubscribe("detected", callback);
                },
                onProcessed: function(callback) {
                    if (!callback || "function" != typeof callback && ("object" !== typeof_default()(callback) || !callback.callback)) {
                        console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
                        return;
                    }
                    events1.subscribe("processed", callback);
                },
                offProcessed: function(callback) {
                    events1.unsubscribe("processed", callback);
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
                                events1.once("processed", function(result) {
                                    quaggaInstance.stop(), resultCallback && resultCallback.call(null, result), resolve(result);
                                }, !0), quaggaInstance.start();
                            }, null, quaggaInstance);
                        } catch (err) {
                            reject(err);
                        }
                    });
                },
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
        }
    ]).default;
});
