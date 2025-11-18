/*
 Copyright (c) 2018-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/ /**
 * @packageDocumentation
 * @module core/math
 */ import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
import { CCClass } from "../data/class";
import { Mat3 } from "./mat3";
import { Quat } from "./quat";
import { enumerableProps, EPSILON } from "./utils";
import { Vec3 } from "./vec3";
import { legacyCC } from "../global-exports";
import { MathBase } from "./math-base";
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function _typeof(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _type_of(obj);
};
export var preTransforms = Object.freeze([
    Object.freeze([
        1,
        0,
        0,
        1
    ]),
    Object.freeze([
        0,
        1,
        -1,
        0
    ]),
    Object.freeze([
        -1,
        0,
        0,
        -1
    ]),
    Object.freeze([
        0,
        -1,
        1,
        0
    ])
]);
/**
 * @en Mathematical 4x4 matrix.
 * @zh 表示四维（4x4）矩阵。
 */ export var Mat4 = /*#__PURE__*/ function(MathBase1) {
    "use strict";
    _inherits(Mat4, MathBase1);
    function Mat4(param, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15) {
        var m00 = param === void 0 ? 1 : param, m01 = param1 === void 0 ? 0 : param1, m02 = param2 === void 0 ? 0 : param2, m03 = param3 === void 0 ? 0 : param3, m04 = param4 === void 0 ? 0 : param4, m05 = param5 === void 0 ? 1 : param5, m06 = param6 === void 0 ? 0 : param6, m07 = param7 === void 0 ? 0 : param7, m08 = param8 === void 0 ? 0 : param8, m09 = param9 === void 0 ? 0 : param9, m10 = param10 === void 0 ? 1 : param10, m11 = param11 === void 0 ? 0 : param11, m12 = param12 === void 0 ? 0 : param12, m13 = param13 === void 0 ? 0 : param13, m14 = param14 === void 0 ? 0 : param14, m15 = param15 === void 0 ? 1 : param15;
        _classCallCheck(this, Mat4);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Mat4).call(this));
        if (m00 && (typeof m00 === "undefined" ? "undefined" : _type_of(m00)) === "object") {
            if (ArrayBuffer.isView(m00)) {
                _this._array = m00;
                _this._array.set([
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]);
            } else {
                var v = m00.array;
                _this._array = MathBase.createFloatArray(16);
                _this._array[0] = v[0];
                _this._array[1] = v[1];
                _this._array[2] = v[2];
                _this._array[3] = v[3];
                _this._array[4] = v[4];
                _this._array[5] = v[5];
                _this._array[6] = v[6];
                _this._array[7] = v[7];
                _this._array[8] = v[8];
                _this._array[9] = v[9];
                _this._array[10] = v[10];
                _this._array[11] = v[11];
                _this._array[12] = v[12];
                _this._array[13] = v[13];
                _this._array[14] = v[14];
                _this._array[15] = v[15];
            }
        } else {
            _this._array = MathBase.createFloatArray(16);
            _this._array[0] = m00;
            _this._array[1] = m01;
            _this._array[2] = m02;
            _this._array[3] = m03;
            _this._array[4] = m04;
            _this._array[5] = m05;
            _this._array[6] = m06;
            _this._array[7] = m07;
            _this._array[8] = m08;
            _this._array[9] = m09;
            _this._array[10] = m10;
            _this._array[11] = m11;
            _this._array[12] = m12;
            _this._array[13] = m13;
            _this._array[14] = m14;
            _this._array[15] = m15;
        }
        return _this;
    }
    _createClass(Mat4, [
        {
            key: "m00",
            get: /**
                 * @en Value at column 0 row 0 of the matrix.
                 * @zh 矩阵第 0 列第 0 行的元素。
                 */ function get() {
                return this._array[0];
            },
            set: function set(m) {
                this._array[0] = m;
            }
        },
        {
            key: "m01",
            get: /**
                 * @en Value at column 0 row 1 of the matrix.
                 * @zh 矩阵第 0 列第 1 行的元素。
                 */ function get() {
                return this._array[1];
            },
            set: function set(m) {
                this._array[1] = m;
            }
        },
        {
            key: "m02",
            get: /**
                 * @en Value at column 0 row 2 of the matrix.
                 * @zh 矩阵第 0 列第 2 行的元素。
                 */ function get() {
                return this._array[2];
            },
            set: function set(m) {
                this._array[2] = m;
            }
        },
        {
            key: "m03",
            get: /**
                 * @en Value at column 0 row 3 of the matrix.
                 * @zh 矩阵第 0 列第 3 行的元素。
                 */ function get() {
                return this._array[3];
            },
            set: function set(m) {
                this._array[3] = m;
            }
        },
        {
            key: "m04",
            get: /**
                 * @en Value at column 1 row 0 of the matrix.
                 * @zh 矩阵第 1 列第 0 行的元素。
                 */ function get() {
                return this._array[4];
            },
            set: function set(m) {
                this._array[4] = m;
            }
        },
        {
            key: "m05",
            get: /**
                 * @en Value at column 1 row 1 of the matrix.
                 * @zh 矩阵第 1 列第 1 行的元素。
                 */ function get() {
                return this._array[5];
            },
            set: function set(m) {
                this._array[5] = m;
            }
        },
        {
            key: "m06",
            get: /**
                 * @en Value at column 1 row 2 of the matrix.
                 * @zh 矩阵第 1 列第 2 行的元素。
                 */ function get() {
                return this._array[6];
            },
            set: function set(m) {
                this._array[6] = m;
            }
        },
        {
            key: "m07",
            get: /**
                 * @en Value at column 1 row 3 of the matrix.
                 * @zh 矩阵第 1 列第 3 行的元素。
                 */ function get() {
                return this._array[7];
            },
            set: function set(m) {
                this._array[7] = m;
            }
        },
        {
            key: "m08",
            get: /**
                 * @en Value at column 2 row 0 of the matrix.
                 * @zh 矩阵第 2 列第 0 行的元素。
                 */ function get() {
                return this._array[8];
            },
            set: function set(m) {
                this._array[8] = m;
            }
        },
        {
            key: "m09",
            get: /**
                 * @en Value at column 2 row 1 of the matrix.
                 * @zh 矩阵第 2 列第 1 行的元素。
                 */ function get() {
                return this._array[9];
            },
            set: function set(m) {
                this._array[9] = m;
            }
        },
        {
            key: "m10",
            get: /**
                 * @en Value at column 2 row 2 of the matrix.
                 * @zh 矩阵第 2 列第 2 行的元素。
                 */ function get() {
                return this._array[10];
            },
            set: function set(m) {
                this._array[10] = m;
            }
        },
        {
            key: "m11",
            get: /**
                 * @en Value at column 2 row 3 of the matrix.
                 * @zh 矩阵第 2 列第 3 行的元素。
                 */ function get() {
                return this._array[11];
            },
            set: function set(m) {
                this._array[11] = m;
            }
        },
        {
            key: "m12",
            get: /**
                 * @en Value at column 3 row 0 of the matrix.
                 * @zh 矩阵第 3 列第 0 行的元素。
                 */ function get() {
                return this._array[12];
            },
            set: function set(m) {
                this._array[12] = m;
            }
        },
        {
            key: "m13",
            get: /**
                 * @en Value at column 3 row 1 of the matrix.
                 * @zh 矩阵第 3 列第 1 行的元素。
                 */ function get() {
                return this._array[13];
            },
            set: function set(m) {
                this._array[13] = m;
            }
        },
        {
            key: "m14",
            get: /**
                 * @en Value at column 3 row 2 of the matrix.
                 * @zh 矩阵第 3 列第 2 行的元素。
                 */ function get() {
                return this._array[14];
            },
            set: function set(m) {
                this._array[14] = m;
            }
        },
        {
            key: "m15",
            get: /**
                 * @en Value at column 3 row 3 of the matrix.
                 * @zh 矩阵第 3 列第 3 行的元素。
                 */ function get() {
                return this._array[15];
            },
            set: function set(m) {
                this._array[15] = m;
            }
        },
        {
            key: "clone",
            value: /**
                 * @en Clone a new matrix from the current matrix.
                 * @zh 克隆当前矩阵。
                 */ function clone() {
                var v = this._array;
                return new Mat4(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[12], v[13], v[14], v[15]);
            }
        },
        {
            key: "set",
            value: function set(param, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15) {
                var m00 = param === void 0 ? 1 : param, m01 = param1 === void 0 ? 0 : param1, m02 = param2 === void 0 ? 0 : param2, m03 = param3 === void 0 ? 0 : param3, m04 = param4 === void 0 ? 0 : param4, m05 = param5 === void 0 ? 1 : param5, m06 = param6 === void 0 ? 0 : param6, m07 = param7 === void 0 ? 0 : param7, m08 = param8 === void 0 ? 0 : param8, m09 = param9 === void 0 ? 0 : param9, m10 = param10 === void 0 ? 1 : param10, m11 = param11 === void 0 ? 0 : param11, m12 = param12 === void 0 ? 0 : param12, m13 = param13 === void 0 ? 0 : param13, m14 = param14 === void 0 ? 0 : param14, m15 = param15 === void 0 ? 1 : param15;
                if (m00 && (typeof m00 === "undefined" ? "undefined" : _type_of(m00)) === "object") {
                    var v = m00.array;
                    this._array[1] = v[1];
                    this._array[2] = v[2];
                    this._array[3] = v[3];
                    this._array[4] = v[4];
                    this._array[5] = v[5];
                    this._array[6] = v[6];
                    this._array[7] = v[7];
                    this._array[8] = v[8];
                    this._array[9] = v[9];
                    this._array[10] = v[10];
                    this._array[11] = v[11];
                    this._array[12] = v[12];
                    this._array[13] = v[13];
                    this._array[14] = v[14];
                    this._array[15] = v[15];
                    this._array[0] = v[0];
                } else {
                    this._array[1] = m01;
                    this._array[2] = m02;
                    this._array[3] = m03;
                    this._array[4] = m04;
                    this._array[5] = m05;
                    this._array[6] = m06;
                    this._array[7] = m07;
                    this._array[8] = m08;
                    this._array[9] = m09;
                    this._array[10] = m10;
                    this._array[11] = m11;
                    this._array[12] = m12;
                    this._array[13] = m13;
                    this._array[14] = m14;
                    this._array[15] = m15;
                    this._array[0] = m00;
                }
                return this;
            }
        },
        {
            key: "equals",
            value: /**
                 * @en Returns whether the specified matrices are approximately equal.
                 * @zh 判断当前矩阵是否在误差范围内与指定矩阵相等。
                 * @param other Comparative matrix
                 * @param epsilon The error allowed. It`s should be a non-negative number.
                 * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
                 */ function equals(other, param) {
                var epsilon = param === void 0 ? EPSILON : param;
                var v = other.array;
                return Math.abs(this._array[0] - v[0]) <= epsilon * Math.max(1, Math.abs(this._array[0]), Math.abs(v[0])) && Math.abs(this._array[1] - v[1]) <= epsilon * Math.max(1, Math.abs(this._array[1]), Math.abs(v[1])) && Math.abs(this._array[2] - v[2]) <= epsilon * Math.max(1, Math.abs(this._array[2]), Math.abs(v[2])) && Math.abs(this._array[3] - v[3]) <= epsilon * Math.max(1, Math.abs(this._array[3]), Math.abs(v[3])) && Math.abs(this._array[4] - v[4]) <= epsilon * Math.max(1, Math.abs(this._array[4]), Math.abs(v[4])) && Math.abs(this._array[5] - v[5]) <= epsilon * Math.max(1, Math.abs(this._array[5]), Math.abs(v[5])) && Math.abs(this._array[6] - v[6]) <= epsilon * Math.max(1, Math.abs(this._array[6]), Math.abs(v[6])) && Math.abs(this._array[7] - v[7]) <= epsilon * Math.max(1, Math.abs(this._array[7]), Math.abs(v[7])) && Math.abs(this._array[8] - v[8]) <= epsilon * Math.max(1, Math.abs(this._array[8]), Math.abs(v[8])) && Math.abs(this._array[9] - v[9]) <= epsilon * Math.max(1, Math.abs(this._array[9]), Math.abs(v[9])) && Math.abs(this._array[10] - v[10]) <= epsilon * Math.max(1, Math.abs(this._array[10]), Math.abs(v[10])) && Math.abs(this._array[11] - v[11]) <= epsilon * Math.max(1, Math.abs(this._array[11]), Math.abs(v[11])) && Math.abs(this._array[12] - v[12]) <= epsilon * Math.max(1, Math.abs(this._array[12]), Math.abs(v[12])) && Math.abs(this._array[13] - v[13]) <= epsilon * Math.max(1, Math.abs(this._array[13]), Math.abs(v[13])) && Math.abs(this._array[14] - v[14]) <= epsilon * Math.max(1, Math.abs(this._array[14]), Math.abs(v[14])) && Math.abs(this._array[15] - v[15]) <= epsilon * Math.max(1, Math.abs(this._array[15]), Math.abs(v[15]));
            }
        },
        {
            key: "strictEquals",
            value: /**
                 * @en Returns whether the specified matrices are equal.
                 * @zh 判断当前矩阵是否与指定矩阵相等。
                 * @param other Comparative matrix
                 * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
                 */ function strictEquals(other) {
                var v = other.array;
                return this._array[0] === other.m00 && this._array[1] === v[1] && this._array[2] === v[2] && this._array[3] === v[3] && this._array[4] === v[4] && this._array[5] === v[5] && this._array[6] === v[6] && this._array[7] === v[7] && this._array[8] === v[8] && this._array[9] === v[9] && this._array[10] === v[10] && this._array[11] === v[11] && this._array[12] === v[12] && this._array[13] === v[13] && this._array[14] === v[14] && this._array[15] === v[15];
            }
        },
        {
            key: "toString",
            value: /**
                 * @en Returns a string representation of a matrix.
                 * @zh 返回当前矩阵的字符串表示。
                 * @return 当前矩阵的字符串表示。
                 */ function toString() {
                return "[\n".concat(this._array[0], ", ").concat(this._array[1], ", ").concat(this._array[2], ", ").concat(this._array[3], ",\n").concat(this._array[4], ", ").concat(this._array[5], ", ").concat(this._array[6], ", ").concat(this._array[7], ",\n").concat(this._array[8], ", ").concat(this._array[9], ", ").concat(this._array[10], ", ").concat(this._array[11], ",\n").concat(this._array[12], ", ").concat(this._array[13], ", ").concat(this._array[14], ", ").concat(this._array[15], "\n") + "]";
            }
        },
        {
            key: "identity",
            value: /**
                 * @en set the current matrix to an identity matrix.
                 * @zh 将当前矩阵设为单位矩阵。
                 * @return `this`
                 */ function identity() {
                this._array[0] = 1;
                this._array[1] = 0;
                this._array[2] = 0;
                this._array[3] = 0;
                this._array[4] = 0;
                this._array[5] = 1;
                this._array[6] = 0;
                this._array[7] = 0;
                this._array[8] = 0;
                this._array[9] = 0;
                this._array[10] = 1;
                this._array[11] = 0;
                this._array[12] = 0;
                this._array[13] = 0;
                this._array[14] = 0;
                this._array[15] = 1;
                return this;
            }
        },
        {
            key: "zero",
            value: /**
                 * @en set the current matrix to an zero matrix.
                 * @zh 将当前矩阵设为 0矩阵。
                 * @return `this`
                 */ function zero() {
                this.m00 = 0;
                this.m01 = 0;
                this.m02 = 0;
                this.m03 = 0;
                this.m04 = 0;
                this.m05 = 0;
                this.m06 = 0;
                this.m07 = 0;
                this.m08 = 0;
                this.m09 = 0;
                this.m10 = 0;
                this.m11 = 0;
                this.m12 = 0;
                this.m13 = 0;
                this.m14 = 0;
                this.m15 = 0;
                return this;
            }
        },
        {
            key: "transpose",
            value: /**
                 * @en Transposes the current matrix.
                 * @zh 计算当前矩阵的转置矩阵。
                 */ function transpose() {
                var a01 = this._array[1];
                var a02 = this._array[2];
                var a03 = this._array[3];
                var a12 = this._array[6];
                var a13 = this._array[7];
                var a23 = this._array[11];
                this._array[1] = this._array[4];
                this._array[2] = this._array[8];
                this._array[3] = this._array[12];
                this._array[4] = a01;
                this._array[6] = this._array[9];
                this._array[7] = this._array[13];
                this._array[8] = a02;
                this._array[9] = a12;
                this._array[11] = this._array[14];
                this._array[12] = a03;
                this._array[13] = a13;
                this._array[14] = a23;
                return this;
            }
        },
        {
            key: "invert",
            value: /**
                 * @en Inverts the current matrix. When matrix is not invertible the matrix will be set to zeros.
                 * @zh 计算当前矩阵的逆矩阵。注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
                 */ function invert() {
                var a00 = this._array[0];
                var a01 = this._array[1];
                var a02 = this._array[2];
                var a03 = this._array[3];
                var a10 = this._array[4];
                var a11 = this._array[5];
                var a12 = this._array[6];
                var a13 = this._array[7];
                var a20 = this._array[8];
                var a21 = this._array[9];
                var a22 = this._array[10];
                var a23 = this._array[11];
                var a30 = this._array[12];
                var a31 = this._array[13];
                var a32 = this._array[14];
                var a33 = this._array[15];
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32;
                // Calculate the determinant
                var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                if (det === 0) {
                    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                    return this;
                }
                det = 1 / det;
                this._array[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                this._array[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                this._array[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                this._array[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
                this._array[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                this._array[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                this._array[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                this._array[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
                this._array[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                this._array[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                this._array[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                this._array[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
                this._array[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
                this._array[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
                this._array[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
                this._array[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
                return this;
            }
        },
        {
            key: "determinant",
            value: /**
                 * @en Calculates the determinant of the current matrix.
                 * @zh 计算当前矩阵的行列式。
                 * @return 当前矩阵的行列式。
                 */ function determinant() {
                var a00 = this._array[0];
                var a01 = this._array[1];
                var a02 = this._array[2];
                var a03 = this._array[3];
                var a10 = this._array[4];
                var a11 = this._array[5];
                var a12 = this._array[6];
                var a13 = this._array[7];
                var a20 = this._array[8];
                var a21 = this._array[9];
                var a22 = this._array[10];
                var a23 = this._array[11];
                var a30 = this._array[12];
                var a31 = this._array[13];
                var a32 = this._array[14];
                var a33 = this._array[15];
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32;
                // Calculate the determinant
                return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            }
        },
        {
            key: "add",
            value: /**
                 * @en Adds the current matrix and another matrix to the current matrix.
                 * @zh 矩阵加法。将当前矩阵与指定矩阵的相加，结果返回给当前矩阵。
                 * @param mat the second operand
                 */ function add(mat) {
                var v = mat.array;
                this._array[0] += v[0];
                this._array[1] += v[1];
                this._array[2] += v[2];
                this._array[3] += v[3];
                this._array[4] += v[4];
                this._array[5] += v[5];
                this._array[6] += v[6];
                this._array[7] += v[7];
                this._array[8] += v[8];
                this._array[9] += v[9];
                this._array[10] += v[10];
                this._array[11] += v[11];
                this._array[12] += v[12];
                this._array[13] += v[13];
                this._array[14] += v[14];
                this._array[15] += v[15];
                return this;
            }
        },
        {
            key: "subtract",
            value: /**
                 * @en Subtracts another matrix from the current matrix.
                 * @zh 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
                 * @param mat the second operand
                 */ function subtract(mat) {
                var v = mat.array;
                this._array[0] -= v[0];
                this._array[1] -= v[1];
                this._array[2] -= v[2];
                this._array[3] -= v[3];
                this._array[4] -= v[4];
                this._array[5] -= v[5];
                this._array[6] -= v[6];
                this._array[7] -= v[7];
                this._array[8] -= v[8];
                this._array[9] -= v[9];
                this._array[10] -= v[10];
                this._array[11] -= v[11];
                this._array[12] -= v[12];
                this._array[13] -= v[13];
                this._array[14] -= v[14];
                this._array[15] -= v[15];
                return this;
            }
        },
        {
            key: "multiply",
            value: /**
                 * @en Multiply the current matrix with another matrix.
                 * @zh 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
                 * @param mat the second operand
                 */ function multiply(mat) {
                var a00 = this._array[0];
                var a01 = this._array[1];
                var a02 = this._array[2];
                var a03 = this._array[3];
                var a10 = this._array[4];
                var a11 = this._array[5];
                var a12 = this._array[6];
                var a13 = this._array[7];
                var a20 = this._array[8];
                var a21 = this._array[9];
                var a22 = this._array[10];
                var a23 = this._array[11];
                var a30 = this._array[12];
                var a31 = this._array[13];
                var a32 = this._array[14];
                var a33 = this._array[15];
                var v = mat.array;
                // Cache only the current line of the second matrix
                var b0 = v[0];
                var b1 = v[1];
                var b2 = v[2];
                var b3 = v[3];
                this._array[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                this._array[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                this._array[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                this._array[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = v[4];
                b1 = v[5];
                b2 = v[6];
                b3 = v[7];
                this._array[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                this._array[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                this._array[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                this._array[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = v[8];
                b1 = v[9];
                b2 = v[10];
                b3 = v[11];
                this._array[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                this._array[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                this._array[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                this._array[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = v[12];
                b1 = v[13];
                b2 = v[14];
                b3 = v[15];
                this._array[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                this._array[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                this._array[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                this._array[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                return this;
            }
        },
        {
            key: "multiplyScalar",
            value: /**
                 * @en Multiply each element of the current matrix by a scalar number.
                 * @zh 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
                 * @param scalar amount to scale the matrix's elements by
                 */ function multiplyScalar(scalar) {
                this._array[0] *= scalar;
                this._array[1] *= scalar;
                this._array[2] *= scalar;
                this._array[3] *= scalar;
                this._array[4] *= scalar;
                this._array[5] *= scalar;
                this._array[6] *= scalar;
                this._array[7] *= scalar;
                this._array[8] *= scalar;
                this._array[9] *= scalar;
                this._array[10] *= scalar;
                this._array[11] *= scalar;
                this._array[12] *= scalar;
                this._array[13] *= scalar;
                this._array[14] *= scalar;
                this._array[15] *= scalar;
                return this;
            }
        },
        {
            key: "translate",
            value: /**
                 * @en Translate the current matrix by the given vector
                 * @zh 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
                 * @param vec vector to translate by
                 */ function translate(vec) {
                console.warn("function changed");
                var v = vec.array;
                this._array[12] += v[0];
                this._array[13] += v[1];
                this._array[14] += v[2];
                return this;
            }
        },
        {
            key: "scale",
            value: /**
                 * @en Multiply the current matrix with a scale vector.
                 * @zh 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出。
                 * @param vec vector to scale by
                 */ function scale(vec) {
                var v = vec.array;
                var x = v[0];
                var y = v[1];
                var z = v[2];
                this._array[0] *= x;
                this._array[1] *= x;
                this._array[2] *= x;
                this._array[3] *= x;
                this._array[4] *= y;
                this._array[5] *= y;
                this._array[6] *= y;
                this._array[7] *= y;
                this._array[8] *= z;
                this._array[9] *= z;
                this._array[10] *= z;
                this._array[11] *= z;
                return this;
            }
        },
        {
            key: "rotate",
            value: /**
                 * @en Rotates the current matrix by the given angle around the given axis
                 * @zh 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
                 * @param rad Angle of rotation (in radians)
                 * @param axis Axis of rotation
                 */ function rotate(rad, axis) {
                var x = axis.x;
                var y = axis.y;
                var z = axis.z;
                var len = Math.sqrt(x * x + y * y + z * z);
                if (Math.abs(len) < EPSILON) {
                    return null;
                }
                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var t = 1 - c;
                var a00 = this._array[0];
                var a01 = this._array[1];
                var a02 = this._array[2];
                var a03 = this._array[3];
                var a10 = this._array[4];
                var a11 = this._array[5];
                var a12 = this._array[6];
                var a13 = this._array[7];
                var a20 = this._array[8];
                var a21 = this._array[9];
                var a22 = this._array[10];
                var a23 = this._array[11];
                // Construct the elements of the rotation matrix
                var b00 = x * x * t + c;
                var b01 = y * x * t + z * s;
                var b02 = z * x * t - y * s;
                var b10 = x * y * t - z * s;
                var b11 = y * y * t + c;
                var b12 = z * y * t + x * s;
                var b20 = x * z * t + y * s;
                var b21 = y * z * t - x * s;
                var b22 = z * z * t + c;
                // Perform rotation-specific matrix multiplication
                this._array[0] = a00 * b00 + a10 * b01 + a20 * b02;
                this._array[1] = a01 * b00 + a11 * b01 + a21 * b02;
                this._array[2] = a02 * b00 + a12 * b01 + a22 * b02;
                this._array[3] = a03 * b00 + a13 * b01 + a23 * b02;
                this._array[4] = a00 * b10 + a10 * b11 + a20 * b12;
                this._array[5] = a01 * b10 + a11 * b11 + a21 * b12;
                this._array[6] = a02 * b10 + a12 * b11 + a22 * b12;
                this._array[7] = a03 * b10 + a13 * b11 + a23 * b12;
                this._array[8] = a00 * b20 + a10 * b21 + a20 * b22;
                this._array[9] = a01 * b20 + a11 * b21 + a21 * b22;
                this._array[10] = a02 * b20 + a12 * b21 + a22 * b22;
                this._array[11] = a03 * b20 + a13 * b21 + a23 * b22;
                return this;
            }
        },
        {
            key: "getTranslation",
            value: /**
                 * @en Returns the translation vector component of a transformation matrix.
                 * @zh 从当前矩阵中计算出位移变换的部分，并以各个轴上位移的形式赋值给出口向量。
                 * @param out Vector to receive translation component.
                 */ function getTranslation(out) {
                out.x = this._array[12];
                out.y = this._array[13];
                out.z = this._array[14];
                return out;
            }
        },
        {
            key: "getScale",
            value: /**
                 * @en Returns the scale factor component of a transformation matrix
                 * @zh 从当前矩阵中计算出缩放变换的部分，并以各个轴上缩放的形式赋值给出口向量。
                 * @param out Vector to receive scale component
                 */ function getScale(out) {
                var o = out.array;
                var t = m3_1.array;
                var m00 = t[0] = this._array[0];
                var m01 = t[1] = this._array[1];
                var m02 = t[2] = this._array[2];
                var m04 = t[3] = this._array[4];
                var m05 = t[4] = this._array[5];
                var m06 = t[5] = this._array[6];
                var m08 = t[6] = this._array[8];
                var m09 = t[7] = this._array[9];
                var m10 = t[8] = this._array[10];
                o[0] = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
                o[1] = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
                o[2] = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10);
                // account for refections
                if (Mat3.determinant(m3_1) < 0) {
                    out.x *= -1;
                }
                return out;
            }
        },
        {
            key: "getRotation",
            value: /**
                 * @en Returns the rotation factor component of a transformation matrix
                 * @zh 从当前矩阵中计算出旋转变换的部分，并以四元数的形式赋值给出口四元数。
                 * @param out Vector to receive rotation component
                 */ function getRotation(out) {
                var trace = this._array[0] + this._array[5] + this._array[10];
                var S = 0;
                if (trace > 0) {
                    S = Math.sqrt(trace + 1) * 2;
                    out.w = 0.25 * S;
                    out.x = (this._array[6] - this._array[9]) / S;
                    out.y = (this._array[8] - this._array[2]) / S;
                    out.z = (this._array[1] - this._array[4]) / S;
                } else if (this._array[0] > this._array[5] && this._array[0] > this._array[10]) {
                    S = Math.sqrt(1 + this._array[0] - this._array[5] - this._array[10]) * 2;
                    out.w = (this._array[6] - this._array[9]) / S;
                    out.x = 0.25 * S;
                    out.y = (this._array[1] + this._array[4]) / S;
                    out.z = (this._array[8] + this._array[2]) / S;
                } else if (this._array[5] > this._array[10]) {
                    S = Math.sqrt(1 + this._array[5] - this._array[0] - this._array[10]) * 2;
                    out.w = (this._array[8] - this._array[2]) / S;
                    out.x = (this._array[1] + this._array[4]) / S;
                    out.y = 0.25 * S;
                    out.z = (this._array[6] + this._array[9]) / S;
                } else {
                    S = Math.sqrt(1 + this._array[10] - this._array[0] - this._array[5]) * 2;
                    out.w = (this._array[1] - this._array[4]) / S;
                    out.x = (this._array[8] + this._array[2]) / S;
                    out.y = (this._array[6] + this._array[9]) / S;
                    out.z = 0.25 * S;
                }
                return out;
            }
        },
        {
            key: "fromRTS",
            value: /**
                 * @en Resets the matrix values by the given rotation quaternion, translation vector and scale vector
                 * @zh 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
                 * @param q Rotation quaternion
                 * @param v Translation vector
                 * @param s Scaling vector
                 * @return `this`
                 */ function fromRTS(q, v, s) {
                var x = q.x;
                var y = q.y;
                var z = q.z;
                var w = q.w;
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var xy = x * y2;
                var xz = x * z2;
                var yy = y * y2;
                var yz = y * z2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                var sx = s.x;
                var sy = s.y;
                var sz = s.z;
                this._array[0] = (1 - (yy + zz)) * sx;
                this._array[1] = (xy + wz) * sx;
                this._array[2] = (xz - wy) * sx;
                this._array[3] = 0;
                this._array[4] = (xy - wz) * sy;
                this._array[5] = (1 - (xx + zz)) * sy;
                this._array[6] = (yz + wx) * sy;
                this._array[7] = 0;
                this._array[8] = (xz + wy) * sz;
                this._array[9] = (yz - wx) * sz;
                this._array[10] = (1 - (xx + yy)) * sz;
                this._array[11] = 0;
                this._array[12] = v.x;
                this._array[13] = v.y;
                this._array[14] = v.z;
                this._array[15] = 1;
                return this;
            }
        },
        {
            key: "fromQuat",
            value: /**
                 * @en Resets the current matrix from the given quaternion.
                 * @zh 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
                 * @param q Rotation quaternion
                 * @return `this`
                 */ function fromQuat(q) {
                var x = q.x;
                var y = q.y;
                var z = q.z;
                var w = q.w;
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var yx = y * x2;
                var yy = y * y2;
                var zx = z * x2;
                var zy = z * y2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                this._array[0] = 1 - yy - zz;
                this._array[1] = yx + wz;
                this._array[2] = zx - wy;
                this._array[3] = 0;
                this._array[4] = yx - wz;
                this._array[5] = 1 - xx - zz;
                this._array[6] = zy + wx;
                this._array[7] = 0;
                this._array[8] = zx + wy;
                this._array[9] = zy - wx;
                this._array[10] = 1 - xx - yy;
                this._array[11] = 0;
                this._array[12] = 0;
                this._array[13] = 0;
                this._array[14] = 0;
                this._array[15] = 1;
                return this;
            }
        }
    ], [
        {
            key: "clone",
            value: /**
                 * @en Clone a matrix and save the results to out matrix
                 * @zh 获得指定矩阵的拷贝
                 */ function clone(a) {
                return new Mat4(a.m00, a.m01, a.m02, a.m03, a.m04, a.m05, a.m06, a.m07, a.m08, a.m09, a.m10, a.m11, a.m12, a.m13, a.m14, a.m15);
            }
        },
        {
            key: "copy",
            value: /**
                 * @en Copy a matrix into the out matrix
                 * @zh 复制目标矩阵
                 */ function copy(out, a) {
                out.m00 = a.m00;
                out.m01 = a.m01;
                out.m02 = a.m02;
                out.m03 = a.m03;
                out.m04 = a.m04;
                out.m05 = a.m05;
                out.m06 = a.m06;
                out.m07 = a.m07;
                out.m08 = a.m08;
                out.m09 = a.m09;
                out.m10 = a.m10;
                out.m11 = a.m11;
                out.m12 = a.m12;
                out.m13 = a.m13;
                out.m14 = a.m14;
                out.m15 = a.m15;
                return out;
            }
        },
        {
            key: "set",
            value: /**
                 * @en Sets a matrix with the given values and save the results to out matrix
                 * @zh 设置矩阵值
                 */ function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
                out.m00 = m00;
                out.m01 = m01;
                out.m02 = m02;
                out.m03 = m03;
                out.m04 = m10;
                out.m05 = m11;
                out.m06 = m12;
                out.m07 = m13;
                out.m08 = m20;
                out.m09 = m21;
                out.m10 = m22;
                out.m11 = m23;
                out.m12 = m30;
                out.m13 = m31;
                out.m14 = m32;
                out.m15 = m33;
                return out;
            }
        },
        {
            key: "identity",
            value: /**
                 * @en return an identity matrix.
                 * @zh 将目标赋值为单位矩阵
                 */ function identity(out) {
                out.m00 = 1;
                out.m01 = 0;
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = 0;
                out.m05 = 1;
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = 0;
                out.m09 = 0;
                out.m10 = 1;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "transpose",
            value: /**
                 * @en Transposes a matrix and save the results to out matrix
                 * @zh 转置矩阵
                 */ function transpose(out, a) {
                // If we are transposing ourselves we can skip a few steps but have to cache some values
                if (out === a) {
                    var a01 = a.m01;
                    var a02 = a.m02;
                    var a03 = a.m03;
                    var a12 = a.m06;
                    var a13 = a.m07;
                    var a23 = a.m11;
                    out.m01 = a.m04;
                    out.m02 = a.m08;
                    out.m03 = a.m12;
                    out.m04 = a01;
                    out.m06 = a.m09;
                    out.m07 = a.m13;
                    out.m08 = a02;
                    out.m09 = a12;
                    out.m11 = a.m14;
                    out.m12 = a03;
                    out.m13 = a13;
                    out.m14 = a23;
                } else {
                    out.m00 = a.m00;
                    out.m01 = a.m04;
                    out.m02 = a.m08;
                    out.m03 = a.m12;
                    out.m04 = a.m01;
                    out.m05 = a.m05;
                    out.m06 = a.m09;
                    out.m07 = a.m13;
                    out.m08 = a.m02;
                    out.m09 = a.m06;
                    out.m10 = a.m10;
                    out.m11 = a.m14;
                    out.m12 = a.m03;
                    out.m13 = a.m07;
                    out.m14 = a.m11;
                    out.m15 = a.m15;
                }
                return out;
            }
        },
        {
            key: "invert",
            value: /**
                 * @en Inverts a matrix. When matrix is not invertible the matrix will be set to zeros.
                 * @zh 矩阵求逆，注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
                 */ function invert(out, a) {
                var a00 = a.m00;
                var a01 = a.m01;
                var a02 = a.m02;
                var a03 = a.m03;
                var a10 = a.m04;
                var a11 = a.m05;
                var a12 = a.m06;
                var a13 = a.m07;
                var a20 = a.m08;
                var a21 = a.m09;
                var a22 = a.m10;
                var a23 = a.m11;
                var a30 = a.m12;
                var a31 = a.m13;
                var a32 = a.m14;
                var a33 = a.m15;
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32;
                // Calculate the determinant
                var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                if (det === 0) {
                    out.m00 = 0;
                    out.m01 = 0;
                    out.m02 = 0;
                    out.m03 = 0;
                    out.m04 = 0;
                    out.m05 = 0;
                    out.m06 = 0;
                    out.m07 = 0;
                    out.m08 = 0;
                    out.m09 = 0;
                    out.m10 = 0;
                    out.m11 = 0;
                    out.m12 = 0;
                    out.m13 = 0;
                    out.m14 = 0;
                    out.m15 = 0;
                    return out;
                }
                det = 1 / det;
                out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                out.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                out.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                out.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
                out.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                out.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                out.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
                out.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                out.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                out.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
                out.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
                out.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
                out.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
                out.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;
                return out;
            }
        },
        {
            key: "determinant",
            value: /**
                 * @en Calculates the determinant of a matrix
                 * @zh 矩阵行列式
                 */ function determinant(a) {
                var a00 = a.m00;
                var a01 = a.m01;
                var a02 = a.m02;
                var a03 = a.m03;
                var a10 = a.m04;
                var a11 = a.m05;
                var a12 = a.m06;
                var a13 = a.m07;
                var a20 = a.m08;
                var a21 = a.m09;
                var a22 = a.m10;
                var a23 = a.m11;
                var a30 = a.m12;
                var a31 = a.m13;
                var a32 = a.m14;
                var a33 = a.m15;
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32;
                // Calculate the determinant
                return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            }
        },
        {
            key: "multiply",
            value: /**
                 * @en Multiply two matrices and save the results to out matrix
                 * @zh 矩阵乘法
                 */ function multiply(out, a, b) {
                var a00 = a.m00;
                var a01 = a.m01;
                var a02 = a.m02;
                var a03 = a.m03;
                var a10 = a.m04;
                var a11 = a.m05;
                var a12 = a.m06;
                var a13 = a.m07;
                var a20 = a.m08;
                var a21 = a.m09;
                var a22 = a.m10;
                var a23 = a.m11;
                var a30 = a.m12;
                var a31 = a.m13;
                var a32 = a.m14;
                var a33 = a.m15;
                // Cache only the current line of the second matrix
                var b0 = b.m00;
                var b1 = b.m01;
                var b2 = b.m02;
                var b3 = b.m03;
                out.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b.m04;
                b1 = b.m05;
                b2 = b.m06;
                b3 = b.m07;
                out.m04 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out.m05 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out.m06 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out.m07 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b.m08;
                b1 = b.m09;
                b2 = b.m10;
                b3 = b.m11;
                out.m08 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out.m09 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out.m10 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out.m11 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b.m12;
                b1 = b.m13;
                b2 = b.m14;
                b3 = b.m15;
                out.m12 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out.m13 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out.m14 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out.m15 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                return out;
            }
        },
        {
            key: "transform",
            value: /**
                 * @en Transform a matrix with the given vector and save results to the out matrix
                 * @zh 在给定矩阵变换基础上加入变换
                 */ function transform(out, a, v) {
                var x = v.x;
                var y = v.y;
                var z = v.z;
                if (a === out) {
                    out.m12 = a.m00 * x + a.m04 * y + a.m08 * z + a.m12;
                    out.m13 = a.m01 * x + a.m05 * y + a.m09 * z + a.m13;
                    out.m14 = a.m02 * x + a.m06 * y + a.m10 * z + a.m14;
                    out.m15 = a.m03 * x + a.m07 * y + a.m11 * z + a.m15;
                } else {
                    var a00 = a.m00;
                    var a01 = a.m01;
                    var a02 = a.m02;
                    var a03 = a.m03;
                    var a10 = a.m04;
                    var a11 = a.m05;
                    var a12 = a.m06;
                    var a13 = a.m07;
                    var a20 = a.m08;
                    var a21 = a.m09;
                    var a22 = a.m10;
                    var a23 = a.m11;
                    var a30 = a.m12;
                    var a31 = a.m13;
                    var a32 = a.m14;
                    var a33 = a.m15;
                    out.m00 = a00;
                    out.m01 = a01;
                    out.m02 = a02;
                    out.m03 = a03;
                    out.m04 = a10;
                    out.m05 = a11;
                    out.m06 = a12;
                    out.m07 = a13;
                    out.m08 = a20;
                    out.m09 = a21;
                    out.m10 = a22;
                    out.m11 = a23;
                    out.m12 = a00 * x + a10 * y + a20 * z + a.m12;
                    out.m13 = a01 * x + a11 * y + a21 * z + a.m13;
                    out.m14 = a02 * x + a12 * y + a22 * z + a.m14;
                    out.m15 = a03 * x + a13 * y + a23 * z + a.m15;
                }
                return out;
            }
        },
        {
            key: "translate",
            value: /**
                 * @en Transform a matrix with the given translation vector and save results to the out matrix
                 * @zh 在给定矩阵变换基础上加入新位移变换
                 */ function translate(out, a, v) {
                console.warn("function changed");
                if (a === out) {
                    out.m12 += v.x;
                    out.m13 += v.y;
                    out.m14 += v.z;
                } else {
                    out.m00 = a.m00;
                    out.m01 = a.m01;
                    out.m02 = a.m02;
                    out.m03 = a.m03;
                    out.m04 = a.m04;
                    out.m05 = a.m05;
                    out.m06 = a.m06;
                    out.m07 = a.m07;
                    out.m08 = a.m08;
                    out.m09 = a.m09;
                    out.m10 = a.m10;
                    out.m11 = a.m11;
                    out.m12 += v.x;
                    out.m13 += v.y;
                    out.m14 += v.z;
                    out.m15 = a.m15;
                }
                return out;
            }
        },
        {
            key: "scale",
            value: /**
                 * @en Multiply a matrix with a scale matrix given by a scale vector and save the results into the out matrix
                 * @zh 在给定矩阵变换基础上加入新缩放变换
                 */ function scale(out, a, v) {
                var x = v.x;
                var y = v.y;
                var z = v.z;
                out.m00 = a.m00 * x;
                out.m01 = a.m01 * x;
                out.m02 = a.m02 * x;
                out.m03 = a.m03 * x;
                out.m04 = a.m04 * y;
                out.m05 = a.m05 * y;
                out.m06 = a.m06 * y;
                out.m07 = a.m07 * y;
                out.m08 = a.m08 * z;
                out.m09 = a.m09 * z;
                out.m10 = a.m10 * z;
                out.m11 = a.m11 * z;
                out.m12 = a.m12;
                out.m13 = a.m13;
                out.m14 = a.m14;
                out.m15 = a.m15;
                return out;
            }
        },
        {
            key: "rotate",
            value: /**
                 * @en Rotates the transform by the given angle and save the results into the out matrix
                 * @zh 在给定矩阵变换基础上加入新旋转变换
                 * @param rad Angle of rotation (in radians)
                 * @param axis axis of rotation
                 */ function rotate(out, a, rad, axis) {
                var x = axis.x;
                var y = axis.y;
                var z = axis.z;
                var len = Math.sqrt(x * x + y * y + z * z);
                if (Math.abs(len) < EPSILON) {
                    return null;
                }
                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var t = 1 - c;
                var a00 = a.m00;
                var a01 = a.m01;
                var a02 = a.m02;
                var a03 = a.m03;
                var a10 = a.m04;
                var a11 = a.m05;
                var a12 = a.m06;
                var a13 = a.m07;
                var a20 = a.m08;
                var a21 = a.m09;
                var a22 = a.m10;
                var a23 = a.m11;
                // Construct the elements of the rotation matrix
                var b00 = x * x * t + c;
                var b01 = y * x * t + z * s;
                var b02 = z * x * t - y * s;
                var b10 = x * y * t - z * s;
                var b11 = y * y * t + c;
                var b12 = z * y * t + x * s;
                var b20 = x * z * t + y * s;
                var b21 = y * z * t - x * s;
                var b22 = z * z * t + c;
                // Perform rotation-specific matrix multiplication
                out.m00 = a00 * b00 + a10 * b01 + a20 * b02;
                out.m01 = a01 * b00 + a11 * b01 + a21 * b02;
                out.m02 = a02 * b00 + a12 * b01 + a22 * b02;
                out.m03 = a03 * b00 + a13 * b01 + a23 * b02;
                out.m04 = a00 * b10 + a10 * b11 + a20 * b12;
                out.m05 = a01 * b10 + a11 * b11 + a21 * b12;
                out.m06 = a02 * b10 + a12 * b11 + a22 * b12;
                out.m07 = a03 * b10 + a13 * b11 + a23 * b12;
                out.m08 = a00 * b20 + a10 * b21 + a20 * b22;
                out.m09 = a01 * b20 + a11 * b21 + a21 * b22;
                out.m10 = a02 * b20 + a12 * b21 + a22 * b22;
                out.m11 = a03 * b20 + a13 * b21 + a23 * b22;
                // If the source and destination differ, copy the unchanged last row
                if (a !== out) {
                    out.m12 = a.m12;
                    out.m13 = a.m13;
                    out.m14 = a.m14;
                    out.m15 = a.m15;
                }
                return out;
            }
        },
        {
            key: "rotateX",
            value: /**
                 * @en Transform a matrix with a given angle around X axis and save the results to the out matrix
                 * @zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
                 * @param rad Angle of rotation (in radians)
                 */ function rotateX(out, a, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var a10 = a.m04;
                var a11 = a.m05;
                var a12 = a.m06;
                var a13 = a.m07;
                var a20 = a.m08;
                var a21 = a.m09;
                var a22 = a.m10;
                var a23 = a.m11;
                if (a !== out) {
                    out.m00 = a.m00;
                    out.m01 = a.m01;
                    out.m02 = a.m02;
                    out.m03 = a.m03;
                    out.m12 = a.m12;
                    out.m13 = a.m13;
                    out.m14 = a.m14;
                    out.m15 = a.m15;
                }
                // Perform axis-specific matrix multiplication
                out.m04 = a10 * c + a20 * s;
                out.m05 = a11 * c + a21 * s;
                out.m06 = a12 * c + a22 * s;
                out.m07 = a13 * c + a23 * s;
                out.m08 = a20 * c - a10 * s;
                out.m09 = a21 * c - a11 * s;
                out.m10 = a22 * c - a12 * s;
                out.m11 = a23 * c - a13 * s;
                return out;
            }
        },
        {
            key: "rotateY",
            value: /**
                 * @en Transform a matrix with a given angle around Y axis and save the results to the out matrix
                 * @zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
                 * @param rad Angle of rotation (in radians)
                 */ function rotateY(out, a, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var a00 = a.m00;
                var a01 = a.m01;
                var a02 = a.m02;
                var a03 = a.m03;
                var a20 = a.m08;
                var a21 = a.m09;
                var a22 = a.m10;
                var a23 = a.m11;
                if (a !== out) {
                    out.m04 = a.m04;
                    out.m05 = a.m05;
                    out.m06 = a.m06;
                    out.m07 = a.m07;
                    out.m12 = a.m12;
                    out.m13 = a.m13;
                    out.m14 = a.m14;
                    out.m15 = a.m15;
                }
                // Perform axis-specific matrix multiplication
                out.m00 = a00 * c - a20 * s;
                out.m01 = a01 * c - a21 * s;
                out.m02 = a02 * c - a22 * s;
                out.m03 = a03 * c - a23 * s;
                out.m08 = a00 * s + a20 * c;
                out.m09 = a01 * s + a21 * c;
                out.m10 = a02 * s + a22 * c;
                out.m11 = a03 * s + a23 * c;
                return out;
            }
        },
        {
            key: "rotateZ",
            value: /**
                 * @en Transform a matrix with a given angle around Z axis and save the results to the out matrix
                 * @zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
                 * @param rad Angle of rotation (in radians)
                 */ function rotateZ(out, a, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var a00 = a.m00;
                var a01 = a.m01;
                var a02 = a.m02;
                var a03 = a.m03;
                var a10 = a.m04;
                var a11 = a.m05;
                var a12 = a.m06;
                var a13 = a.m07;
                // If the source and destination differ, copy the unchanged last row
                if (a !== out) {
                    out.m08 = a.m08;
                    out.m09 = a.m09;
                    out.m10 = a.m10;
                    out.m11 = a.m11;
                    out.m12 = a.m12;
                    out.m13 = a.m13;
                    out.m14 = a.m14;
                    out.m15 = a.m15;
                }
                // Perform axis-specific matrix multiplication
                out.m00 = a00 * c + a10 * s;
                out.m01 = a01 * c + a11 * s;
                out.m02 = a02 * c + a12 * s;
                out.m03 = a03 * c + a13 * s;
                out.m04 = a10 * c - a00 * s;
                out.m05 = a11 * c - a01 * s;
                out.m06 = a12 * c - a02 * s;
                out.m07 = a13 * c - a03 * s;
                return out;
            }
        },
        {
            key: "fromTranslation",
            value: /**
                 * @en Sets the out matrix with a translation vector
                 * @zh 计算位移矩阵
                 */ function fromTranslation(out, v) {
                out.m00 = 1;
                out.m01 = 0;
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = 0;
                out.m05 = 1;
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = 0;
                out.m09 = 0;
                out.m10 = 1;
                out.m11 = 0;
                out.m12 = v.x;
                out.m13 = v.y;
                out.m14 = v.z;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromScaling",
            value: /**
                 * @en Sets the out matrix with a scale vector
                 * @zh 计算缩放矩阵
                 */ function fromScaling(out, v) {
                out.m00 = v.x;
                out.m01 = 0;
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = 0;
                out.m05 = v.y;
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = 0;
                out.m09 = 0;
                out.m10 = v.z;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromRotation",
            value: /**
                 * @en Sets the out matrix with rotation angle
                 * @zh 计算旋转矩阵
                 */ function fromRotation(out, rad, axis) {
                var x = axis.x;
                var y = axis.y;
                var z = axis.z;
                var len = Math.sqrt(x * x + y * y + z * z);
                if (Math.abs(len) < EPSILON) {
                    return null;
                }
                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var t = 1 - c;
                // Perform rotation-specific matrix multiplication
                out.m00 = x * x * t + c;
                out.m01 = y * x * t + z * s;
                out.m02 = z * x * t - y * s;
                out.m03 = 0;
                out.m04 = x * y * t - z * s;
                out.m05 = y * y * t + c;
                out.m06 = z * y * t + x * s;
                out.m07 = 0;
                out.m08 = x * z * t + y * s;
                out.m09 = y * z * t - x * s;
                out.m10 = z * z * t + c;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromXRotation",
            value: /**
                 * @en Calculates the matrix representing a rotation around the X axis
                 * @zh 计算绕 X 轴的旋转矩阵
                 */ function fromXRotation(out, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                // Perform axis-specific matrix multiplication
                out.m00 = 1;
                out.m01 = 0;
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = 0;
                out.m05 = c;
                out.m06 = s;
                out.m07 = 0;
                out.m08 = 0;
                out.m09 = -s;
                out.m10 = c;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromYRotation",
            value: /**
                 * @en Calculates the matrix representing a rotation around the Y axis
                 * @zh 计算绕 Y 轴的旋转矩阵
                 */ function fromYRotation(out, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                // Perform axis-specific matrix multiplication
                out.m00 = c;
                out.m01 = 0;
                out.m02 = -s;
                out.m03 = 0;
                out.m04 = 0;
                out.m05 = 1;
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = s;
                out.m09 = 0;
                out.m10 = c;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromZRotation",
            value: /**
                 * @en Calculates the matrix representing a rotation around the Z axis
                 * @zh 计算绕 Z 轴的旋转矩阵
                 */ function fromZRotation(out, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                // Perform axis-specific matrix multiplication
                out.m00 = c;
                out.m01 = s;
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = -s;
                out.m05 = c;
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = 0;
                out.m09 = 0;
                out.m10 = 1;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromRT",
            value: /**
                 * @en Calculates the transform representing the combination of a rotation and a translation
                 * @zh 根据旋转和位移信息计算矩阵
                 */ function fromRT(out, q, v) {
                var x = q.x;
                var y = q.y;
                var z = q.z;
                var w = q.w;
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var xy = x * y2;
                var xz = x * z2;
                var yy = y * y2;
                var yz = y * z2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                out.m00 = 1 - (yy + zz);
                out.m01 = xy + wz;
                out.m02 = xz - wy;
                out.m03 = 0;
                out.m04 = xy - wz;
                out.m05 = 1 - (xx + zz);
                out.m06 = yz + wx;
                out.m07 = 0;
                out.m08 = xz + wy;
                out.m09 = yz - wx;
                out.m10 = 1 - (xx + yy);
                out.m11 = 0;
                out.m12 = v.x;
                out.m13 = v.y;
                out.m14 = v.z;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "getTranslation",
            value: /**
                 * @en Extracts the translation from the matrix, assuming it's composed in order of scale, rotation, translation
                 * @zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
                 */ function getTranslation(out, mat) {
                out.x = mat.m12;
                out.y = mat.m13;
                out.z = mat.m14;
                return out;
            }
        },
        {
            key: "getScaling",
            value: /**
                 * @en Extracts the scale vector from the matrix, assuming it's composed in order of scale, rotation, translation
                 * @zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
                 */ function getScaling(out, mat) {
                var m00 = m3_1.m00 = mat.m00;
                var m01 = m3_1.m01 = mat.m01;
                var m02 = m3_1.m02 = mat.m02;
                var m04 = m3_1.m03 = mat.m04;
                var m05 = m3_1.m04 = mat.m05;
                var m06 = m3_1.m05 = mat.m06;
                var m08 = m3_1.m06 = mat.m08;
                var m09 = m3_1.m07 = mat.m09;
                var m10 = m3_1.m08 = mat.m10;
                out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
                out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
                out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10);
                // account for refections
                if (Mat3.determinant(m3_1) < 0) {
                    out.x *= -1;
                }
                return out;
            }
        },
        {
            key: "getRotation",
            value: /**
                 * @en Extracts the rotation from the matrix, assuming it's composed in order of scale, rotation, translation
                 * @zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
                 */ function getRotation(out, mat) {
                var trace = mat.m00 + mat.m05 + mat.m10;
                var S = 0;
                if (trace > 0) {
                    S = Math.sqrt(trace + 1) * 2;
                    out.w = 0.25 * S;
                    out.x = (mat.m06 - mat.m09) / S;
                    out.y = (mat.m08 - mat.m02) / S;
                    out.z = (mat.m01 - mat.m04) / S;
                } else if (mat.m00 > mat.m05 && mat.m00 > mat.m10) {
                    S = Math.sqrt(1 + mat.m00 - mat.m05 - mat.m10) * 2;
                    out.w = (mat.m06 - mat.m09) / S;
                    out.x = 0.25 * S;
                    out.y = (mat.m01 + mat.m04) / S;
                    out.z = (mat.m08 + mat.m02) / S;
                } else if (mat.m05 > mat.m10) {
                    S = Math.sqrt(1 + mat.m05 - mat.m00 - mat.m10) * 2;
                    out.w = (mat.m08 - mat.m02) / S;
                    out.x = (mat.m01 + mat.m04) / S;
                    out.y = 0.25 * S;
                    out.z = (mat.m06 + mat.m09) / S;
                } else {
                    S = Math.sqrt(1 + mat.m10 - mat.m00 - mat.m05) * 2;
                    out.w = (mat.m01 - mat.m04) / S;
                    out.x = (mat.m08 + mat.m02) / S;
                    out.y = (mat.m06 + mat.m09) / S;
                    out.z = 0.25 * S;
                }
                return out;
            }
        },
        {
            key: "toRTS",
            value: /**
                 * @en Extracts the scale, rotation and translation from the matrix, assuming it's composed in order of scale, rotation, translation
                 * @zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
                 */ function toRTS(m, q, v, s) {
                s.x = Vec3.set(v3_1, m.m00, m.m01, m.m02).length();
                m3_1.m00 = m.m00 / s.x;
                m3_1.m01 = m.m01 / s.x;
                m3_1.m02 = m.m02 / s.x;
                s.y = Vec3.set(v3_1, m.m04, m.m05, m.m06).length();
                m3_1.m03 = m.m04 / s.y;
                m3_1.m04 = m.m05 / s.y;
                m3_1.m05 = m.m06 / s.y;
                s.z = Vec3.set(v3_1, m.m08, m.m09, m.m10).length();
                m3_1.m06 = m.m08 / s.z;
                m3_1.m07 = m.m09 / s.z;
                m3_1.m08 = m.m10 / s.z;
                var det = Mat3.determinant(m3_1);
                if (det < 0) {
                    s.x *= -1;
                    m3_1.m00 *= -1;
                    m3_1.m01 *= -1;
                    m3_1.m02 *= -1;
                }
                Quat.fromMat3(q, m3_1); // already normalized
                Vec3.set(v, m.m12, m.m13, m.m14);
            }
        },
        {
            key: "fromRTS",
            value: /**
                 * @en Compose a matrix from scale, rotation and translation, applied in order.
                 * @zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
                 */ function fromRTS(out, q, v, s) {
                var x = q.x;
                var y = q.y;
                var z = q.z;
                var w = q.w;
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var xy = x * y2;
                var xz = x * z2;
                var yy = y * y2;
                var yz = y * z2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                var sx = s.x;
                var sy = s.y;
                var sz = s.z;
                out.m00 = (1 - (yy + zz)) * sx;
                out.m01 = (xy + wz) * sx;
                out.m02 = (xz - wy) * sx;
                out.m03 = 0;
                out.m04 = (xy - wz) * sy;
                out.m05 = (1 - (xx + zz)) * sy;
                out.m06 = (yz + wx) * sy;
                out.m07 = 0;
                out.m08 = (xz + wy) * sz;
                out.m09 = (yz - wx) * sz;
                out.m10 = (1 - (xx + yy)) * sz;
                out.m11 = 0;
                out.m12 = v.x;
                out.m13 = v.y;
                out.m14 = v.z;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromRTSOrigin",
            value: /**
                 * @en Compose a matrix from scale, rotation and translation, applied in order, from a given origin
                 * @zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
                 * @param q Rotation quaternion
                 * @param v Translation vector
                 * @param s Scaling vector
                 * @param o transformation Center
                 */ function fromRTSOrigin(out, q, v, s, o) {
                var x = q.x;
                var y = q.y;
                var z = q.z;
                var w = q.w;
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var xy = x * y2;
                var xz = x * z2;
                var yy = y * y2;
                var yz = y * z2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                var sx = s.x;
                var sy = s.y;
                var sz = s.z;
                var ox = o.x;
                var oy = o.y;
                var oz = o.z;
                out.m00 = (1 - (yy + zz)) * sx;
                out.m01 = (xy + wz) * sx;
                out.m02 = (xz - wy) * sx;
                out.m03 = 0;
                out.m04 = (xy - wz) * sy;
                out.m05 = (1 - (xx + zz)) * sy;
                out.m06 = (yz + wx) * sy;
                out.m07 = 0;
                out.m08 = (xz + wy) * sz;
                out.m09 = (yz - wx) * sz;
                out.m10 = (1 - (xx + yy)) * sz;
                out.m11 = 0;
                out.m12 = v.x + ox - (out.m00 * ox + out.m04 * oy + out.m08 * oz);
                out.m13 = v.y + oy - (out.m01 * ox + out.m05 * oy + out.m09 * oz);
                out.m14 = v.z + oz - (out.m02 * ox + out.m06 * oy + out.m10 * oz);
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "fromQuat",
            value: /**
                 * @en Sets the out matrix with the given quaternion
                 * @zh 根据指定的旋转信息计算矩阵
                 */ function fromQuat(out, q) {
                var x = q.x;
                var y = q.y;
                var z = q.z;
                var w = q.w;
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var yx = y * x2;
                var yy = y * y2;
                var zx = z * x2;
                var zy = z * y2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                out.m00 = 1 - yy - zz;
                out.m01 = yx + wz;
                out.m02 = zx - wy;
                out.m03 = 0;
                out.m04 = yx - wz;
                out.m05 = 1 - xx - zz;
                out.m06 = zy + wx;
                out.m07 = 0;
                out.m08 = zx + wy;
                out.m09 = zy - wx;
                out.m10 = 1 - xx - yy;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "frustum",
            value: /**
                 * @en Calculates the matrix representing the given frustum
                 * @zh 根据指定的视锥体信息计算矩阵
                 * @param left The X coordinate of the left side of the near projection plane in view space.
                 * @param right The X coordinate of the right side of the near projection plane in view space.
                 * @param bottom The Y coordinate of the bottom side of the near projection plane in view space.
                 * @param top The Y coordinate of the top side of the near projection plane in view space.
                 * @param near Z distance to the near plane from the origin in view space.
                 * @param far Z distance to the far plane from the origin in view space.
                 */ function frustum(out, left, right, bottom, top, near, far) {
                var rl = 1 / (right - left);
                var tb = 1 / (top - bottom);
                var nf = 1 / (near - far);
                out.m00 = near * 2 * rl;
                out.m01 = 0;
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = 0;
                out.m05 = near * 2 * tb;
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = (right + left) * rl;
                out.m09 = (top + bottom) * tb;
                out.m10 = (far + near) * nf;
                out.m11 = -1;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = far * near * 2 * nf;
                out.m15 = 0;
                return out;
            }
        },
        {
            key: "perspective",
            value: /**
                 * @en Calculates perspective projection matrix
                 * @zh 计算透视投影矩阵
                 * @param fovy Vertical field-of-view in degrees.
                 * @param aspect Aspect ratio
                 * @param near Near depth clipping plane value.
                 * @param far Far depth clipping plane value.
                 */ function perspective(out, fov, aspect, near, far, param, param1, param2, param3) {
                var isFOVY = param === void 0 ? true : param, minClipZ = param1 === void 0 ? -1 : param1, projectionSignY = param2 === void 0 ? 1 : param2, orientation = param3 === void 0 ? 0 : param3;
                var f = 1 / Math.tan(fov / 2);
                var nf = 1 / (near - far);
                var x = isFOVY ? f / aspect : f;
                var y = (isFOVY ? f : f * aspect) * projectionSignY;
                var preTransform = preTransforms[orientation];
                out.m00 = x * preTransform[0];
                out.m01 = x * preTransform[1];
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = y * preTransform[2];
                out.m05 = y * preTransform[3];
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = 0;
                out.m09 = 0;
                out.m10 = (far - minClipZ * near) * nf;
                out.m11 = -1;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = far * near * nf * (1 - minClipZ);
                out.m15 = 0;
                return out;
            }
        },
        {
            key: "ortho",
            value: /**
                 * @en Calculates orthogonal projection matrix
                 * @zh 计算正交投影矩阵
                 * @param left Left-side x-coordinate.
                 * @param right Right-side x-coordinate.
                 * @param bottom Bottom y-coordinate.
                 * @param top Top y-coordinate.
                 * @param near Near depth clipping plane value.
                 * @param far Far depth clipping plane value.
                 */ function ortho(out, left, right, bottom, top, near, far, param, param1, param2) {
                var minClipZ = param === void 0 ? -1 : param, projectionSignY = param1 === void 0 ? 1 : param1, orientation = param2 === void 0 ? 0 : param2;
                var lr = 1 / (left - right);
                var bt = 1 / (bottom - top) * projectionSignY;
                var nf = 1 / (near - far);
                var x = -2 * lr;
                var y = -2 * bt;
                var dx = (left + right) * lr;
                var dy = (top + bottom) * bt;
                var preTransform = preTransforms[orientation];
                out.m00 = x * preTransform[0];
                out.m01 = x * preTransform[1];
                out.m02 = 0;
                out.m03 = 0;
                out.m04 = y * preTransform[2];
                out.m05 = y * preTransform[3];
                out.m06 = 0;
                out.m07 = 0;
                out.m08 = 0;
                out.m09 = 0;
                out.m10 = nf * (1 - minClipZ);
                out.m11 = 0;
                out.m12 = dx * preTransform[0] + dy * preTransform[2];
                out.m13 = dx * preTransform[1] + dy * preTransform[3];
                out.m14 = (near - minClipZ * far) * nf;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "lookAt",
            value: /**
                 * @en
                 * Calculates the matrix with the view point information, given by eye position, target center and the up vector.
                 * Note that center to eye vector can't be zero or parallel to the up vector
                 * @zh
                 * 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
                 * @param eye The source point.
                 * @param center The target point.
                 * @param up The vector describing the up direction.
                 */ function lookAt(out, eye, center, up) {
                var eyex = eye.x;
                var eyey = eye.y;
                var eyez = eye.z;
                var upx = up.x;
                var upy = up.y;
                var upz = up.z;
                var centerx = center.x;
                var centery = center.y;
                var centerz = center.z;
                var z0 = eyex - centerx;
                var z1 = eyey - centery;
                var z2 = eyez - centerz;
                var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
                z0 *= len;
                z1 *= len;
                z2 *= len;
                var x0 = upy * z2 - upz * z1;
                var x1 = upz * z0 - upx * z2;
                var x2 = upx * z1 - upy * z0;
                len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
                x0 *= len;
                x1 *= len;
                x2 *= len;
                var y0 = z1 * x2 - z2 * x1;
                var y1 = z2 * x0 - z0 * x2;
                var y2 = z0 * x1 - z1 * x0;
                out.m00 = x0;
                out.m01 = y0;
                out.m02 = z0;
                out.m03 = 0;
                out.m04 = x1;
                out.m05 = y1;
                out.m06 = z1;
                out.m07 = 0;
                out.m08 = x2;
                out.m09 = y2;
                out.m10 = z2;
                out.m11 = 0;
                out.m12 = -(x0 * eyex + x1 * eyey + x2 * eyez);
                out.m13 = -(y0 * eyex + y1 * eyey + y2 * eyez);
                out.m14 = -(z0 * eyex + z1 * eyey + z2 * eyez);
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "inverseTranspose",
            value: /**
                 * @en Calculates the inverse transpose of a matrix and save the results to out matrix
                 * @zh 计算逆转置矩阵
                 */ function inverseTranspose(out, a) {
                var a00 = a.m00;
                var a01 = a.m01;
                var a02 = a.m02;
                var a03 = a.m03;
                var a10 = a.m04;
                var a11 = a.m05;
                var a12 = a.m06;
                var a13 = a.m07;
                var a20 = a.m08;
                var a21 = a.m09;
                var a22 = a.m10;
                var a23 = a.m11;
                var a30 = a.m12;
                var a31 = a.m13;
                var a32 = a.m14;
                var a33 = a.m15;
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32;
                // Calculate the determinant
                var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                if (!det) {
                    return null;
                }
                det = 1 / det;
                out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                out.m01 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                out.m02 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                out.m03 = 0;
                out.m04 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                out.m06 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                out.m07 = 0;
                out.m08 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                out.m09 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                out.m11 = 0;
                out.m12 = 0;
                out.m13 = 0;
                out.m14 = 0;
                out.m15 = 1;
                return out;
            }
        },
        {
            key: "toArray",
            value: /**
                 * @en Transform a matrix object to a flat array
                 * @zh 矩阵转数组
                 * @param ofs Array Start Offset
                 */ function toArray(out, m, param) {
                var ofs = param === void 0 ? 0 : param;
                out[ofs + 0] = m.m00;
                out[ofs + 1] = m.m01;
                out[ofs + 2] = m.m02;
                out[ofs + 3] = m.m03;
                out[ofs + 4] = m.m04;
                out[ofs + 5] = m.m05;
                out[ofs + 6] = m.m06;
                out[ofs + 7] = m.m07;
                out[ofs + 8] = m.m08;
                out[ofs + 9] = m.m09;
                out[ofs + 10] = m.m10;
                out[ofs + 11] = m.m11;
                out[ofs + 12] = m.m12;
                out[ofs + 13] = m.m13;
                out[ofs + 14] = m.m14;
                out[ofs + 15] = m.m15;
                return out;
            }
        },
        {
            key: "fromArray",
            value: /**
                 * @en Generates or sets a matrix with a flat array
                 * @zh 数组转矩阵
                 * @param ofs Array Start Offset
                 */ function fromArray(out, arr, param) {
                var ofs = param === void 0 ? 0 : param;
                out.m00 = arr[ofs + 0];
                out.m01 = arr[ofs + 1];
                out.m02 = arr[ofs + 2];
                out.m03 = arr[ofs + 3];
                out.m04 = arr[ofs + 4];
                out.m05 = arr[ofs + 5];
                out.m06 = arr[ofs + 6];
                out.m07 = arr[ofs + 7];
                out.m08 = arr[ofs + 8];
                out.m09 = arr[ofs + 9];
                out.m10 = arr[ofs + 10];
                out.m11 = arr[ofs + 11];
                out.m12 = arr[ofs + 12];
                out.m13 = arr[ofs + 13];
                out.m14 = arr[ofs + 14];
                out.m15 = arr[ofs + 15];
                return out;
            }
        },
        {
            key: "add",
            value: /**
                 * @en Adds two matrices and save the results to out matrix
                 * @zh 逐元素矩阵加法
                 */ function add(out, a, b) {
                out.m00 = a.m00 + b.m00;
                out.m01 = a.m01 + b.m01;
                out.m02 = a.m02 + b.m02;
                out.m03 = a.m03 + b.m03;
                out.m04 = a.m04 + b.m04;
                out.m05 = a.m05 + b.m05;
                out.m06 = a.m06 + b.m06;
                out.m07 = a.m07 + b.m07;
                out.m08 = a.m08 + b.m08;
                out.m09 = a.m09 + b.m09;
                out.m10 = a.m10 + b.m10;
                out.m11 = a.m11 + b.m11;
                out.m12 = a.m12 + b.m12;
                out.m13 = a.m13 + b.m13;
                out.m14 = a.m14 + b.m14;
                out.m15 = a.m15 + b.m15;
                return out;
            }
        },
        {
            key: "subtract",
            value: /**
                 * @en Subtracts matrix b from matrix a and save the results to out matrix
                 * @zh 逐元素矩阵减法
                 */ function subtract(out, a, b) {
                out.m00 = a.m00 - b.m00;
                out.m01 = a.m01 - b.m01;
                out.m02 = a.m02 - b.m02;
                out.m03 = a.m03 - b.m03;
                out.m04 = a.m04 - b.m04;
                out.m05 = a.m05 - b.m05;
                out.m06 = a.m06 - b.m06;
                out.m07 = a.m07 - b.m07;
                out.m08 = a.m08 - b.m08;
                out.m09 = a.m09 - b.m09;
                out.m10 = a.m10 - b.m10;
                out.m11 = a.m11 - b.m11;
                out.m12 = a.m12 - b.m12;
                out.m13 = a.m13 - b.m13;
                out.m14 = a.m14 - b.m14;
                out.m15 = a.m15 - b.m15;
                return out;
            }
        },
        {
            key: "multiplyScalar",
            value: /**
                 * @en Multiply each element of a matrix by a scalar number and save the results to out matrix
                 * @zh 矩阵标量乘法
                 */ function multiplyScalar(out, a, b) {
                out.m00 = a.m00 * b;
                out.m01 = a.m01 * b;
                out.m02 = a.m02 * b;
                out.m03 = a.m03 * b;
                out.m04 = a.m04 * b;
                out.m05 = a.m05 * b;
                out.m06 = a.m06 * b;
                out.m07 = a.m07 * b;
                out.m08 = a.m08 * b;
                out.m09 = a.m09 * b;
                out.m10 = a.m10 * b;
                out.m11 = a.m11 * b;
                out.m12 = a.m12 * b;
                out.m13 = a.m13 * b;
                out.m14 = a.m14 * b;
                out.m15 = a.m15 * b;
                return out;
            }
        },
        {
            key: "multiplyScalarAndAdd",
            value: /**
                 * @en Adds two matrices after multiplying each element of the second operand by a scalar number. And save the results to out matrix.
                 * @zh 逐元素矩阵标量乘加: A + B * scale
                 */ function multiplyScalarAndAdd(out, a, b, scale) {
                out.m00 = a.m00 + b.m00 * scale;
                out.m01 = a.m01 + b.m01 * scale;
                out.m02 = a.m02 + b.m02 * scale;
                out.m03 = a.m03 + b.m03 * scale;
                out.m04 = a.m04 + b.m04 * scale;
                out.m05 = a.m05 + b.m05 * scale;
                out.m06 = a.m06 + b.m06 * scale;
                out.m07 = a.m07 + b.m07 * scale;
                out.m08 = a.m08 + b.m08 * scale;
                out.m09 = a.m09 + b.m09 * scale;
                out.m10 = a.m10 + b.m10 * scale;
                out.m11 = a.m11 + b.m11 * scale;
                out.m12 = a.m12 + b.m12 * scale;
                out.m13 = a.m13 + b.m13 * scale;
                out.m14 = a.m14 + b.m14 * scale;
                out.m15 = a.m15 + b.m15 * scale;
                return out;
            }
        },
        {
            key: "strictEquals",
            value: /**
                 * @en Returns whether the specified matrices are equal.
                 * @zh 矩阵等价判断
                 */ function strictEquals(a, b) {
                return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07 && a.m08 === b.m08 && a.m09 === b.m09 && a.m10 === b.m10 && a.m11 === b.m11 && a.m12 === b.m12 && a.m13 === b.m13 && a.m14 === b.m14 && a.m15 === b.m15;
            }
        },
        {
            key: "equals",
            value: /**
                 * @en Returns whether the specified matrices are approximately equal.
                 * @zh 排除浮点数误差的矩阵近似等价判断
                 */ function equals(a, b, param) {
                var epsilon = param === void 0 ? EPSILON : param;
                // TAOCP vol.2, 3rd ed., s.4.2.4, p.213-225
                // defines a 'close enough' relationship between u and v that scales for magnitude
                return Math.abs(a.m00 - b.m00) <= epsilon * Math.max(1, Math.abs(a.m00), Math.abs(b.m00)) && Math.abs(a.m01 - b.m01) <= epsilon * Math.max(1, Math.abs(a.m01), Math.abs(b.m01)) && Math.abs(a.m02 - b.m02) <= epsilon * Math.max(1, Math.abs(a.m02), Math.abs(b.m02)) && Math.abs(a.m03 - b.m03) <= epsilon * Math.max(1, Math.abs(a.m03), Math.abs(b.m03)) && Math.abs(a.m04 - b.m04) <= epsilon * Math.max(1, Math.abs(a.m04), Math.abs(b.m04)) && Math.abs(a.m05 - b.m05) <= epsilon * Math.max(1, Math.abs(a.m05), Math.abs(b.m05)) && Math.abs(a.m06 - b.m06) <= epsilon * Math.max(1, Math.abs(a.m06), Math.abs(b.m06)) && Math.abs(a.m07 - b.m07) <= epsilon * Math.max(1, Math.abs(a.m07), Math.abs(b.m07)) && Math.abs(a.m08 - b.m08) <= epsilon * Math.max(1, Math.abs(a.m08), Math.abs(b.m08)) && Math.abs(a.m09 - b.m09) <= epsilon * Math.max(1, Math.abs(a.m09), Math.abs(b.m09)) && Math.abs(a.m10 - b.m10) <= epsilon * Math.max(1, Math.abs(a.m10), Math.abs(b.m10)) && Math.abs(a.m11 - b.m11) <= epsilon * Math.max(1, Math.abs(a.m11), Math.abs(b.m11)) && Math.abs(a.m12 - b.m12) <= epsilon * Math.max(1, Math.abs(a.m12), Math.abs(b.m12)) && Math.abs(a.m13 - b.m13) <= epsilon * Math.max(1, Math.abs(a.m13), Math.abs(b.m13)) && Math.abs(a.m14 - b.m14) <= epsilon * Math.max(1, Math.abs(a.m14), Math.abs(b.m14)) && Math.abs(a.m15 - b.m15) <= epsilon * Math.max(1, Math.abs(a.m15), Math.abs(b.m15));
            }
        }
    ]);
    return Mat4;
}(MathBase);
Mat4.IDENTITY = Object.freeze(new Mat4());
var v3_1 = new Vec3();
var m3_1 = new Mat3();
enumerableProps(Mat4.prototype, [
    "m00",
    "m01",
    "m02",
    "m03",
    "m04",
    "m05",
    "m06",
    "m07",
    "m08",
    "m09",
    "m10",
    "m11",
    "m12",
    "m13",
    "m14",
    "m15"
]);
CCClass.fastDefine("cc.Mat4", Mat4, {
    m00: 1,
    m01: 0,
    m02: 0,
    m03: 0,
    m04: 0,
    m05: 1,
    m06: 0,
    m07: 0,
    m08: 0,
    m09: 0,
    m10: 1,
    m11: 0,
    m12: 0,
    m13: 0,
    m14: 0,
    m15: 1
});
legacyCC.Mat4 = Mat4;
export function mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    return new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
}
legacyCC.mat4 = mat4;
