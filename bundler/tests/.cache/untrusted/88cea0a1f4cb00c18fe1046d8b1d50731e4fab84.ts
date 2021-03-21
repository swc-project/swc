// Loaded from https://cdn.skypack.dev/-/json-ptr@v2.0.0-XFXjbv5ra9DLE4KMOqCF/dist=es2020,mode=imports/optimized/json-ptr.js


import * as tslib from "/-/tslib@v2.1.0-MLGlgmjPar8j2y7qEZaV/dist=es2020,mode=imports/optimized/tslib.js";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function(path, base) {
      return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}
function getDefaultExportFromNamespaceIfNotNamed(n) {
  return n && Object.prototype.hasOwnProperty.call(n, "default") && Object.keys(n).length === 1 ? n["default"] : n;
}
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var types = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
});
var util = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.decodePtrInit = exports.pickDecoder = exports.looksLikeFragment = exports.unsetValueAtPath = exports.setValueAtPath = exports.compilePointerDereference = exports.toArrayIndexReference = exports.encodeUriFragmentIdentifier = exports.decodeUriFragmentIdentifier = exports.encodePointer = exports.decodePointer = exports.encodePointerSegments = exports.decodePointerSegments = exports.encodeFragmentSegments = exports.decodeFragmentSegments = exports.replace = void 0;
  function replace2(source, find, repl) {
    let res = "";
    let rem = source;
    let beg = 0;
    let end = -1;
    while ((end = rem.indexOf(find)) > -1) {
      res += source.substring(beg, beg + end) + repl;
      rem = rem.substring(end + find.length, rem.length);
      beg += end + find.length;
    }
    if (rem.length > 0) {
      res += source.substring(source.length - rem.length, source.length);
    }
    return res;
  }
  exports.replace = replace2;
  function decodeFragmentSegments2(segments) {
    let i = -1;
    const len = segments.length;
    const res = new Array(len);
    while (++i < len) {
      if (typeof segments[i] === "string") {
        res[i] = replace2(replace2(decodeURIComponent(segments[i]), "~1", "/"), "~0", "~");
      } else {
        res[i] = segments[i];
      }
    }
    return res;
  }
  exports.decodeFragmentSegments = decodeFragmentSegments2;
  function encodeFragmentSegments2(segments) {
    let i = -1;
    const len = segments.length;
    const res = new Array(len);
    while (++i < len) {
      if (typeof segments[i] === "string") {
        res[i] = encodeURIComponent(replace2(replace2(segments[i], "~", "~0"), "/", "~1"));
      } else {
        res[i] = segments[i];
      }
    }
    return res;
  }
  exports.encodeFragmentSegments = encodeFragmentSegments2;
  function decodePointerSegments2(segments) {
    let i = -1;
    const len = segments.length;
    const res = new Array(len);
    while (++i < len) {
      if (typeof segments[i] === "string") {
        res[i] = replace2(replace2(segments[i], "~1", "/"), "~0", "~");
      } else {
        res[i] = segments[i];
      }
    }
    return res;
  }
  exports.decodePointerSegments = decodePointerSegments2;
  function encodePointerSegments2(segments) {
    let i = -1;
    const len = segments.length;
    const res = new Array(len);
    while (++i < len) {
      if (typeof segments[i] === "string") {
        res[i] = replace2(replace2(segments[i], "~", "~0"), "/", "~1");
      } else {
        res[i] = segments[i];
      }
    }
    return res;
  }
  exports.encodePointerSegments = encodePointerSegments2;
  function decodePointer2(ptr) {
    if (typeof ptr !== "string") {
      throw new TypeError("Invalid type: JSON Pointers are represented as strings.");
    }
    if (ptr.length === 0) {
      return [];
    }
    if (ptr[0] !== "/") {
      throw new ReferenceError("Invalid JSON Pointer syntax. Non-empty pointer must begin with a solidus `/`.");
    }
    return decodePointerSegments2(ptr.substring(1).split("/"));
  }
  exports.decodePointer = decodePointer2;
  function encodePointer2(path) {
    if (!path || path && !Array.isArray(path)) {
      throw new TypeError("Invalid type: path must be an array of segments.");
    }
    if (path.length === 0) {
      return "";
    }
    return "/".concat(encodePointerSegments2(path).join("/"));
  }
  exports.encodePointer = encodePointer2;
  function decodeUriFragmentIdentifier2(ptr) {
    if (typeof ptr !== "string") {
      throw new TypeError("Invalid type: JSON Pointers are represented as strings.");
    }
    if (ptr.length === 0 || ptr[0] !== "#") {
      throw new ReferenceError("Invalid JSON Pointer syntax; URI fragment identifiers must begin with a hash.");
    }
    if (ptr.length === 1) {
      return [];
    }
    if (ptr[1] !== "/") {
      throw new ReferenceError("Invalid JSON Pointer syntax.");
    }
    return decodeFragmentSegments2(ptr.substring(2).split("/"));
  }
  exports.decodeUriFragmentIdentifier = decodeUriFragmentIdentifier2;
  function encodeUriFragmentIdentifier2(path) {
    if (!path || path && !Array.isArray(path)) {
      throw new TypeError("Invalid type: path must be an array of segments.");
    }
    if (path.length === 0) {
      return "#";
    }
    return "#/".concat(encodeFragmentSegments2(path).join("/"));
  }
  exports.encodeUriFragmentIdentifier = encodeUriFragmentIdentifier2;
  function toArrayIndexReference2(arr, idx) {
    if (typeof idx === "number")
      return idx;
    const len = idx.length;
    if (!len)
      return -1;
    let cursor = 0;
    if (len === 1 && idx[0] === "-") {
      if (!Array.isArray(arr)) {
        return 0;
      }
      return arr.length;
    }
    while (++cursor < len) {
      if (idx[cursor] < "0" || idx[cursor] > "9") {
        return -1;
      }
    }
    return parseInt(idx, 10);
  }
  exports.toArrayIndexReference = toArrayIndexReference2;
  function compilePointerDereference2(path) {
    let body = "if (typeof(it) !== 'undefined'";
    if (path.length === 0) {
      return (it) => it;
    }
    body = path.reduce((body2, _, i) => {
      return body2 + " && \n	typeof((it = it['" + replace2(path[i] + "", "\\", "\\\\") + "'])) !== 'undefined'";
    }, "if (typeof(it) !== 'undefined'");
    body = body + ") {\n	return it;\n }";
    return new Function("it", body);
  }
  exports.compilePointerDereference = compilePointerDereference2;
  function setValueAtPath2(target, val, path, force = false) {
    if (path.length === 0) {
      throw new Error("Cannot set the root object; assign it directly.");
    }
    if (typeof target === "undefined") {
      throw new TypeError("Cannot set values on undefined");
    }
    let it = target;
    const len = path.length;
    const end = path.length - 1;
    let step;
    let cursor = -1;
    let rem;
    let p;
    while (++cursor < len) {
      step = path[cursor];
      if (step === "__proto__" || step === "constructor" || step === "prototype") {
        throw new Error("Attempted prototype pollution disallowed.");
      }
      if (Array.isArray(it)) {
        if (step === "-" && cursor === end) {
          it.push(val);
          return void 0;
        }
        p = toArrayIndexReference2(it, step);
        if (it.length > p) {
          if (cursor === end) {
            rem = it[p];
            it[p] = val;
            break;
          }
          it = it[p];
        } else if (cursor === end && p === it.length) {
          if (force) {
            it.push(val);
            return void 0;
          }
        } else if (force) {
          it = it[p] = cursor === end ? val : {};
        }
      } else {
        if (typeof it[step] === "undefined") {
          if (force) {
            if (cursor === end) {
              it[step] = val;
              return void 0;
            }
            if (toArrayIndexReference2(it[step], path[cursor + 1]) !== -1) {
              it = it[step] = [];
              continue;
            }
            it = it[step] = {};
            continue;
          }
          return void 0;
        }
        if (cursor === end) {
          rem = it[step];
          it[step] = val;
          break;
        }
        it = it[step];
      }
    }
    return rem;
  }
  exports.setValueAtPath = setValueAtPath2;
  function unsetValueAtPath2(target, path) {
    if (path.length === 0) {
      throw new Error("Cannot unset the root object; assign it directly.");
    }
    if (typeof target === "undefined") {
      throw new TypeError("Cannot unset values on undefined");
    }
    let it = target;
    const len = path.length;
    const end = path.length - 1;
    let step;
    let cursor = -1;
    let rem;
    let p;
    while (++cursor < len) {
      step = path[cursor];
      if (Array.isArray(it)) {
        p = toArrayIndexReference2(it, step);
        if (p >= it.length)
          return void 0;
        if (cursor === end) {
          rem = it[p];
          delete it[p];
          break;
        }
        it = it[p];
      } else {
        if (typeof it[step] === "undefined") {
          return void 0;
        }
        if (cursor === end) {
          rem = it[step];
          delete it[step];
          break;
        }
        it = it[step];
      }
    }
    return rem;
  }
  exports.unsetValueAtPath = unsetValueAtPath2;
  function looksLikeFragment2(ptr) {
    return (ptr === null || ptr === void 0 ? void 0 : ptr.length) > 0 && ptr[0] === "#";
  }
  exports.looksLikeFragment = looksLikeFragment2;
  function pickDecoder2(ptr) {
    return looksLikeFragment2(ptr) ? decodeUriFragmentIdentifier2 : decodePointer2;
  }
  exports.pickDecoder = pickDecoder2;
  function decodePtrInit2(ptr) {
    return Array.isArray(ptr) ? ptr.slice(0) : pickDecoder2(ptr)(ptr);
  }
  exports.decodePtrInit = decodePtrInit2;
});
var pointer = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.JsonReference = exports.JsonPointer = void 0;
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  function shouldDescend(obj) {
    return isObject(obj) && !JsonReference2.isReference(obj);
  }
  function descendingVisit(target, visitor, encoder) {
    const distinctObjects = new Map();
    const q = [{obj: target, path: []}];
    while (q.length) {
      const {obj, path} = q.shift();
      visitor(encoder(path), obj);
      if (shouldDescend(obj)) {
        distinctObjects.set(obj, new JsonPointer2(util.encodeUriFragmentIdentifier(path)));
        if (!Array.isArray(obj)) {
          const keys = Object.keys(obj);
          const len = keys.length;
          let i = -1;
          while (++i < len) {
            const it = obj[keys[i]];
            if (isObject(it) && distinctObjects.has(it)) {
              q.push({
                obj: new JsonReference2(distinctObjects.get(it)),
                path: path.concat(keys[i])
              });
            } else {
              q.push({
                obj: it,
                path: path.concat(keys[i])
              });
            }
          }
        } else {
          let j = -1;
          const len = obj.length;
          while (++j < len) {
            const it = obj[j];
            if (isObject(it) && distinctObjects.has(it)) {
              q.push({
                obj: new JsonReference2(distinctObjects.get(it)),
                path: path.concat([j + ""])
              });
            } else {
              q.push({
                obj: it,
                path: path.concat([j + ""])
              });
            }
          }
        }
      }
    }
  }
  const $ptr = Symbol("pointer");
  const $frg = Symbol("fragmentId");
  const $get = Symbol("getter");
  class JsonPointer2 {
    constructor(ptr) {
      this.path = util.decodePtrInit(ptr);
    }
    static create(pointer2) {
      return new JsonPointer2(pointer2);
    }
    static has(target, pointer2) {
      if (typeof pointer2 === "string" || Array.isArray(pointer2)) {
        pointer2 = new JsonPointer2(pointer2);
      }
      return pointer2.has(target);
    }
    static get(target, pointer2) {
      if (typeof pointer2 === "string" || Array.isArray(pointer2)) {
        pointer2 = new JsonPointer2(pointer2);
      }
      return pointer2.get(target);
    }
    static set(target, pointer2, val, force = false) {
      if (typeof pointer2 === "string" || Array.isArray(pointer2)) {
        pointer2 = new JsonPointer2(pointer2);
      }
      return pointer2.set(target, val, force);
    }
    static unset(target, pointer2) {
      if (typeof pointer2 === "string" || Array.isArray(pointer2)) {
        pointer2 = new JsonPointer2(pointer2);
      }
      return pointer2.unset(target);
    }
    static decode(pointer2) {
      return util.pickDecoder(pointer2)(pointer2);
    }
    static visit(target, visitor, fragmentId = false) {
      descendingVisit(target, visitor, fragmentId ? util.encodeUriFragmentIdentifier : util.encodePointer);
    }
    static listPointers(target) {
      const res = [];
      descendingVisit(target, (pointer2, value) => {
        res.push({pointer: pointer2, value});
      }, util.encodePointer);
      return res;
    }
    static listFragmentIds(target) {
      const res = [];
      descendingVisit(target, (fragmentId, value) => {
        res.push({fragmentId, value});
      }, util.encodeUriFragmentIdentifier);
      return res;
    }
    static flatten(target, fragmentId = false) {
      const res = {};
      descendingVisit(target, (p, v) => {
        res[p] = v;
      }, fragmentId ? util.encodeUriFragmentIdentifier : util.encodePointer);
      return res;
    }
    static map(target, fragmentId = false) {
      const res = new Map();
      descendingVisit(target, res.set.bind(res), fragmentId ? util.encodeUriFragmentIdentifier : util.encodePointer);
      return res;
    }
    get(target) {
      if (!this[$get]) {
        this[$get] = util.compilePointerDereference(this.path);
      }
      return this[$get](target);
    }
    set(target, value, force = false) {
      return util.setValueAtPath(target, value, this.path, force);
    }
    unset(target) {
      return util.unsetValueAtPath(target, this.path);
    }
    has(target) {
      return typeof this.get(target) !== "undefined";
    }
    concat(ptr) {
      return new JsonPointer2(this.path.concat(ptr instanceof JsonPointer2 ? ptr.path : util.decodePtrInit(ptr)));
    }
    get pointer() {
      if (this[$ptr] === void 0) {
        this[$ptr] = util.encodePointer(this.path);
      }
      return this[$ptr];
    }
    get uriFragmentIdentifier() {
      if (!this[$frg]) {
        this[$frg] = util.encodeUriFragmentIdentifier(this.path);
      }
      return this[$frg];
    }
    toString() {
      return this.pointer;
    }
  }
  exports.JsonPointer = JsonPointer2;
  const $pointer = Symbol("pointer");
  class JsonReference2 {
    constructor(pointer2) {
      this[$pointer] = pointer2 instanceof JsonPointer2 ? pointer2 : new JsonPointer2(pointer2);
      this.$ref = this[$pointer].uriFragmentIdentifier;
    }
    static isReference(candidate) {
      if (!candidate)
        return false;
      const ref = candidate;
      return typeof ref.$ref === "string" && typeof ref.resolve === "function";
    }
    resolve(target) {
      return this[$pointer].get(target);
    }
    pointer() {
      return this[$pointer];
    }
    toString() {
      return this.$ref;
    }
  }
  exports.JsonReference = JsonReference2;
});
var tslib_1 = /* @__PURE__ */ getDefaultExportFromNamespaceIfNotNamed(tslib);
var dist = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  tslib_1.__exportStar(types, exports);
  tslib_1.__exportStar(util, exports);
  tslib_1.__exportStar(pointer, exports);
});
var __pika_web_default_export_for_treeshaking__ = /* @__PURE__ */ getDefaultExportFromCjs(dist);
var JsonPointer = dist.JsonPointer;
var JsonReference = dist.JsonReference;
var compilePointerDereference = dist.compilePointerDereference;
var decodeFragmentSegments = dist.decodeFragmentSegments;
var decodePointer = dist.decodePointer;
var decodePointerSegments = dist.decodePointerSegments;
var decodePtrInit = dist.decodePtrInit;
var decodeUriFragmentIdentifier = dist.decodeUriFragmentIdentifier;
export default __pika_web_default_export_for_treeshaking__;
var encodeFragmentSegments = dist.encodeFragmentSegments;
var encodePointer = dist.encodePointer;
var encodePointerSegments = dist.encodePointerSegments;
var encodeUriFragmentIdentifier = dist.encodeUriFragmentIdentifier;
var looksLikeFragment = dist.looksLikeFragment;
var pickDecoder = dist.pickDecoder;
var replace = dist.replace;
var setValueAtPath = dist.setValueAtPath;
var toArrayIndexReference = dist.toArrayIndexReference;
var unsetValueAtPath = dist.unsetValueAtPath;
export {JsonPointer, JsonReference, dist as __moduleExports, compilePointerDereference, decodeFragmentSegments, decodePointer, decodePointerSegments, decodePtrInit, decodeUriFragmentIdentifier, encodeFragmentSegments, encodePointer, encodePointerSegments, encodeUriFragmentIdentifier, looksLikeFragment, pickDecoder, replace, setValueAtPath, toArrayIndexReference, unsetValueAtPath};
