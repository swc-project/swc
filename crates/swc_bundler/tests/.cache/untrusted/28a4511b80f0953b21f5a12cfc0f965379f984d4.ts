// Loaded from https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-6e68c801.js


import t$1 from "./buffer.js";
var e = {},
    n = t$1,
    o = n.Buffer;

function t(r, e) {
  for (var n in r) e[n] = r[n];
}

function f(r, e, n) {
  return o(r, e, n);
}

o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? e = n : (t(n, e), e.Buffer = f), f.prototype = Object.create(o.prototype), t(o, f), f.from = function (r, e, n) {
  if ("number" == typeof r) throw new TypeError("Argument must not be a number");
  return o(r, e, n);
}, f.alloc = function (r, e, n) {
  if ("number" != typeof r) throw new TypeError("Argument must be a number");
  var t = o(r);
  return void 0 !== e ? "string" == typeof n ? t.fill(e, n) : t.fill(e) : t.fill(0), t;
}, f.allocUnsafe = function (r) {
  if ("number" != typeof r) throw new TypeError("Argument must be a number");
  return o(r);
}, f.allocUnsafeSlow = function (r) {
  if ("number" != typeof r) throw new TypeError("Argument must be a number");
  return n.SlowBuffer(r);
};
var u = e;

var e$1 = {},
    s = u.Buffer,
    i = s.isEncoding || function (t) {
  switch ((t = "" + t) && t.toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
    case "raw":
      return !0;

    default:
      return !1;
  }
};

function a(t) {
  var e;

  switch (this.encoding = function (t) {
    var e = function (t) {
      if (!t) return "utf8";

      for (var e;;) switch (t) {
        case "utf8":
        case "utf-8":
          return "utf8";

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";

        case "latin1":
        case "binary":
          return "latin1";

        case "base64":
        case "ascii":
        case "hex":
          return t;

        default:
          if (e) return;
          t = ("" + t).toLowerCase(), e = !0;
      }
    }(t);

    if ("string" != typeof e && (s.isEncoding === i || !i(t))) throw new Error("Unknown encoding: " + t);
    return e || t;
  }(t), this.encoding) {
    case "utf16le":
      this.text = h, this.end = l, e = 4;
      break;

    case "utf8":
      this.fillLast = n$1, e = 4;
      break;

    case "base64":
      this.text = u$1, this.end = o$1, e = 3;
      break;

    default:
      return this.write = f$1, this.end = c, void 0;
  }

  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = s.allocUnsafe(e);
}

function r(t) {
  return t <= 127 ? 0 : t >> 5 == 6 ? 2 : t >> 4 == 14 ? 3 : t >> 3 == 30 ? 4 : t >> 6 == 2 ? -1 : -2;
}

function n$1(t) {
  var e = this.lastTotal - this.lastNeed,
      s = function (t, e, s) {
    if (128 != (192 & e[0])) return t.lastNeed = 0, "�";

    if (t.lastNeed > 1 && e.length > 1) {
      if (128 != (192 & e[1])) return t.lastNeed = 1, "�";
      if (t.lastNeed > 2 && e.length > 2 && 128 != (192 & e[2])) return t.lastNeed = 2, "�";
    }
  }(this, t);

  return void 0 !== s ? s : this.lastNeed <= t.length ? (t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (t.copy(this.lastChar, e, 0, t.length), this.lastNeed -= t.length, void 0);
}

function h(t, e) {
  if ((t.length - e) % 2 == 0) {
    var s = t.toString("utf16le", e);

    if (s) {
      var i = s.charCodeAt(s.length - 1);
      if (i >= 55296 && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], s.slice(0, -1);
    }

    return s;
  }

  return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1);
}

function l(t) {
  var e = t && t.length ? this.write(t) : "";

  if (this.lastNeed) {
    var s = this.lastTotal - this.lastNeed;
    return e + this.lastChar.toString("utf16le", 0, s);
  }

  return e;
}

function u$1(t, e) {
  var s = (t.length - e) % 3;
  return 0 === s ? t.toString("base64", e) : (this.lastNeed = 3 - s, this.lastTotal = 3, 1 === s ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - s));
}

function o$1(t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
}

function f$1(t) {
  return t.toString(this.encoding);
}

function c(t) {
  return t && t.length ? this.write(t) : "";
}

e$1.StringDecoder = a, a.prototype.write = function (t) {
  if (0 === t.length) return "";
  var e, s;

  if (this.lastNeed) {
    if (void 0 === (e = this.fillLast(t))) return "";
    s = this.lastNeed, this.lastNeed = 0;
  } else s = 0;

  return s < t.length ? e ? e + this.text(t, s) : this.text(t, s) : e || "";
}, a.prototype.end = function (t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + "�" : e;
}, a.prototype.text = function (t, e) {
  var s = function (t, e, s) {
    var i = e.length - 1;
    if (i < s) return 0;
    var a = r(e[i]);
    if (a >= 0) return a > 0 && (t.lastNeed = a - 1), a;
    if (--i < s || -2 === a) return 0;
    if ((a = r(e[i])) >= 0) return a > 0 && (t.lastNeed = a - 2), a;
    if (--i < s || -2 === a) return 0;
    if ((a = r(e[i])) >= 0) return a > 0 && (2 === a ? a = 0 : t.lastNeed = a - 3), a;
    return 0;
  }(this, t, e);

  if (!this.lastNeed) return t.toString("utf8", e);
  this.lastTotal = s;
  var i = t.length - (s - this.lastNeed);
  return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i);
}, a.prototype.fillLast = function (t) {
  if (this.lastNeed <= t.length) return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
};
export { u as r, e$1 as s };