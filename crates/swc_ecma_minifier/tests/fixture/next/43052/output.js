(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        610
    ],
    {
        1522: function(__unused_webpack_module, exports, __webpack_require__) {
            var e, t;
            e = this, t = function(exports, React) {
                "use strict";
                var index_production = {
                    exports: {}
                };
                (function(module, exports) {
                    var t;
                    t = function(exports) {
                        function asPromise(e, t) {
                            for(var r1 = Array(arguments.length - 1), n1 = 0, o1 = 2, i1 = !0; o1 < arguments.length;)r1[n1++] = arguments[o1++];
                            return new Promise(function(o1, s1) {
                                r1[n1] = function(e) {
                                    if (i1) if (i1 = !1, e) s1(e);
                                    else {
                                        for(var t = Array(arguments.length - 1), r1 = 0; r1 < t.length;)t[r1++] = arguments[r1];
                                        o1.apply(null, t);
                                    }
                                };
                                try {
                                    e.apply(t || null, r1);
                                } catch (e1) {
                                    i1 && (i1 = !1, s1(e1));
                                }
                            });
                        }
                        var base64$1 = {};
                        !function(e) {
                            var t = e;
                            t.length = function(e) {
                                var t = e.length;
                                if (!t) return 0;
                                for(var r1 = 0; --t % 4 > 1 && "=" === e.charAt(t);)++r1;
                                return Math.ceil(3 * e.length) / 4 - r1;
                            };
                            for(var r1 = Array(64), n1 = Array(123), o1 = 0; o1 < 64;)n1[r1[o1] = o1 < 26 ? o1 + 65 : o1 < 52 ? o1 + 71 : o1 < 62 ? o1 - 4 : o1 - 59 | 43] = o1++;
                            t.encode = function(e, t, n1) {
                                for(var o1, i1 = null, s1 = [], a1 = 0, c = 0; t < n1;){
                                    var u = e[t++];
                                    switch(c){
                                        case 0:
                                            s1[a1++] = r1[u >> 2], o1 = (3 & u) << 4, c = 1;
                                            break;
                                        case 1:
                                            s1[a1++] = r1[o1 | u >> 4], o1 = (15 & u) << 2, c = 2;
                                            break;
                                        case 2:
                                            s1[a1++] = r1[o1 | u >> 6], s1[a1++] = r1[63 & u], c = 0;
                                    }
                                    a1 > 8191 && ((i1 || (i1 = [])).push(String.fromCharCode.apply(String, s1)), a1 = 0);
                                }
                                return c && (s1[a1++] = r1[o1], s1[a1++] = 61, 1 === c && (s1[a1++] = 61)), i1 ? (a1 && i1.push(String.fromCharCode.apply(String, s1.slice(0, a1))), i1.join("")) : String.fromCharCode.apply(String, s1.slice(0, a1));
                            };
                            var i1 = "invalid encoding";
                            t.decode = function(e, t, r1) {
                                for(var o1, s1 = r1, a1 = 0, c = 0; c < e.length;){
                                    var u = e.charCodeAt(c++);
                                    if (61 === u && a1 > 1) break;
                                    if (void 0 === (u = n1[u])) throw Error(i1);
                                    switch(a1){
                                        case 0:
                                            o1 = u, a1 = 1;
                                            break;
                                        case 1:
                                            t[r1++] = o1 << 2 | (48 & u) >> 4, o1 = u, a1 = 2;
                                            break;
                                        case 2:
                                            t[r1++] = (15 & o1) << 4 | (60 & u) >> 2, o1 = u, a1 = 3;
                                            break;
                                        case 3:
                                            t[r1++] = (3 & o1) << 6 | u, a1 = 0;
                                    }
                                }
                                if (1 === a1) throw Error(i1);
                                return r1 - s1;
                            }, t.test = function(e) {
                                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e);
                            };
                        }(base64$1);
                        function EventEmitter() {
                            this._listeners = {};
                        }
                        EventEmitter.prototype.on = function(e, t, r1) {
                            return (this._listeners[e] || (this._listeners[e] = [])).push({
                                fn: t,
                                ctx: r1 || this
                            }), this;
                        }, EventEmitter.prototype.off = function(e, t) {
                            if (void 0 === e) this._listeners = {};
                            else if (void 0 === t) this._listeners[e] = [];
                            else for(var r1 = this._listeners[e], n1 = 0; n1 < r1.length;)r1[n1].fn === t ? r1.splice(n1, 1) : ++n1;
                            return this;
                        }, EventEmitter.prototype.emit = function(e) {
                            var t = this._listeners[e];
                            if (t) {
                                for(var r1 = [], n1 = 1; n1 < arguments.length;)r1.push(arguments[n1++]);
                                for(n1 = 0; n1 < t.length;)t[n1].fn.apply(t[n1++].ctx, r1);
                            }
                            return this;
                        };
                        function factory(e) {
                            return "undefined" != typeof Float64Array ? void (e.writeDoubleLE = n ? o : i, e.writeDoubleBE = n ? i : o, e.readDoubleLE = n ? s : a, e.readDoubleBE = n ? a : s) : void (e.writeDoubleLE = t.bind(null, writeUintLE, 0, 4), e.writeDoubleBE = t.bind(null, writeUintBE, 4, 0), e.readDoubleLE = r.bind(null, readUintLE, 0, 4), e.readDoubleBE = r.bind(null, readUintBE, 4, 0)), e;
                        }
                        function writeUintLE(e, t, r1) {
                            t[r1] = 255 & e, t[r1 + 1] = e >>> 8 & 255, t[r1 + 2] = e >>> 16 & 255, t[r1 + 3] = e >>> 24;
                        }
                        function writeUintBE(e, t, r1) {
                            t[r1] = e >>> 24, t[r1 + 1] = e >>> 16 & 255, t[r1 + 2] = e >>> 8 & 255, t[r1 + 3] = 255 & e;
                        }
                        function readUintLE(e, t) {
                            return (e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24) >>> 0;
                        }
                        function readUintBE(e, t) {
                            return (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0;
                        }
                        function inquire(moduleName) {
                            try {
                                var mod = eval("quire".replace(/^/, "re"))(moduleName);
                                if (mod && (mod.length || Object.keys(mod).length)) return mod;
                            } catch (e) {}
                            return null;
                        }
                        var utf8$2 = {};
                        var e;
                        var t;
                        e = utf8$2, t = e, true;
                        function pool(e, t, r1) {
                            var n1 = r1 || 8192, o1 = n1 >>> 1, i1 = null, s1 = n1;
                            return function(r1) {
                                if (r1 < 1 || r1 > o1) return e(r1);
                                s1 + r1 > n1 && (i1 = e(n1), s1 = 0);
                                var a1 = t.call(i1, s1, s1 += r1);
                                return 7 & s1 && (s1 = 1 + (7 | s1)), a1;
                            };
                        }
                        async function* chunkBlocks(e, t = {}) {}
                        async function uploadCarChunks(e, t, r1 = {}) {}
                        async function createUpload(e, t, r1) {}
                        async function uploadCarBytes(e, t, r1 = {}) {}
                        exports.chunkBlocks = chunkBlocks, exports.createUpload = createUpload, exports.encodeDirectory = encodeDirectory, exports.encodeFile = encodeFile, exports.uploadCarBytes = uploadCarBytes, exports.uploadCarChunks = uploadCarChunks, Object.defineProperty(exports, "__esModule", {
                            value: !0
                        });
                    }, t(exports);
                })(index_production, index_production.exports);
                const UploaderContext = React.createContext([
                    {
                        uploadedCarChunks: []
                    },
                    {}
                ]);
                function UploaderProvider({}) {}
                function useUploader() {
                    return React.useContext(UploaderContext);
                }
                exports.UploaderProvider = UploaderProvider, exports.chunkBlocks = index_production.exports.chunkBlocks, exports.encodeDirectory = index_production.exports.encodeDirectory, exports.encodeFile = index_production.exports.encodeFile, exports.useUploader = useUploader, Object.defineProperty(exports, "__esModule", {
                    value: !0
                });
            }, t(exports, __webpack_require__(7294), __webpack_require__(1321)), true;
        }
    }
]);
