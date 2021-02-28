// Loaded from https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/stream.js


import { t } from "./chunk-dac557ba.js";
import "./chunk-0c2d1322.js";
import "./buffer.js";
import "./util.js";
import "./chunk-6e68c801.js";
import r from "./events.js";
import { o, s, e, t as t$1, i, r as r$1, m } from "./chunk-cffba9d4.js";
var l,
    d = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
l = p;
var f = r.EventEmitter;

function p() {
  f.call(this || d);
}

t(p, f), p.Readable = o, p.Writable = s, p.Duplex = e, p.Transform = t$1, p.PassThrough = i, p.finished = r$1, p.pipeline = m, p.Stream = p, p.prototype.pipe = function (e, r) {
  var t = this || d;

  function o(r) {
    e.writable && !1 === e.write(r) && t.pause && t.pause();
  }

  function i() {
    t.readable && t.resume && t.resume();
  }

  t.on("data", o), e.on("drain", i), e._isStdio || r && !1 === r.end || (t.on("end", a), t.on("close", s));
  var n = !1;

  function a() {
    n || (n = !0, e.end());
  }

  function s() {
    n || (n = !0, "function" == typeof e.destroy && e.destroy());
  }

  function m(e) {
    if (l(), 0 === f.listenerCount(this || d, "error")) throw e;
  }

  function l() {
    t.removeListener("data", o), e.removeListener("drain", i), t.removeListener("end", a), t.removeListener("close", s), t.removeListener("error", m), e.removeListener("error", m), t.removeListener("end", l), t.removeListener("close", l), e.removeListener("close", l);
  }

  return t.on("error", m), e.on("error", m), t.on("end", l), t.on("close", l), e.on("close", l), e.emit("pipe", t), e;
};
var b = l;
var Readable = b.Readable;
var Writable = b.Writable;
var Duplex = b.Duplex;
var Transform = b.Transform;
var PassThrough = b.PassThrough;
var finished = b.finished;
var pipeline = b.pipeline;
var Stream = b.Stream;
export default b;
export { Duplex, PassThrough, Readable, Stream, Transform, Writable, finished, pipeline };