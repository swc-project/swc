export class Text {
    constructor(){}
    lineAt(a) {
        if (a < 0 || a > this.length) throw RangeError(`Invalid position ${a} in document of length ${this.length}`);
        return this.lineInner(a, !1, 1, 0);
    }
    line(a) {
        if (a < 1 || a > this.lines) throw RangeError(`Invalid line number ${a} in ${this.lines}-line document`);
        return this.lineInner(a, !0, 1, 0);
    }
    replace(a, c, d) {
        let e = [];
        return this.decompose(0, a, e, 2), d.length && d.decompose(0, d.length, e, 3), this.decompose(c, this.length, e, 1), b.from(e, this.length - (c - a) + d.length);
    }
    append(a) {
        return this.replace(this.length, this.length, a);
    }
    slice(a, c = this.length) {
        let d = [];
        return this.decompose(a, c, d, 0), b.from(d, c - a);
    }
    eq(a) {
        if (a == this) return !0;
        if (a.length != this.length || a.lines != this.lines) return !1;
        let b = this.scanIdentical(a, 1), c = this.length - this.scanIdentical(a, -1), d = new e(this), f = new e(a);
        for(let g = b, h = b;;){
            if (d.next(g), f.next(g), g = 0, d.lineBreak != f.lineBreak || d.done != f.done || d.value != f.value) return !1;
            if (h += d.value.length, d.done || h >= c) return !0;
        }
    }
    iter(a = 1) {
        return new e(this, a);
    }
    iterRange(a, b = this.length) {
        return new f(this, a, b);
    }
    iterLines(a, b) {
        let c;
        if (null == a) c = this.iter();
        else {
            null == b && (b = this.lines + 1);
            let d = this.line(a).from;
            c = this.iterRange(d, Math.max(d, b == this.lines + 1 ? this.length : b <= 1 ? 0 : this.line(b - 1).to));
        }
        return new g(c);
    }
    toString() {
        return this.sliceString(0);
    }
    toJSON() {
        let a = [];
        return this.flatten(a), a;
    }
    static of(c) {
        if (0 == c.length) throw RangeError("A document must have at least one line");
        return 1 != c.length || c[0] ? c.length <= 32 ? new a(c) : b.from(a.split(c, [])) : Text.empty;
    }
}
class a extends Text {
    constructor(a, b = function(a) {
        let b = -1;
        for (let c of a)b += c.length + 1;
        return b;
    }(a)){
        super(), this.text = a, this.length = b;
    }
    get lines() {
        return this.text.length;
    }
    get children() {
        return null;
    }
    lineInner(a, b, c, d) {
        for(let e = 0;; e++){
            let f = this.text[e], g = d + f.length;
            if ((b ? c : g) >= a) return new Line(d, g, c, f);
            d = g + 1, c++;
        }
    }
    decompose(b, e, f, g) {
        let h = b <= 0 && e >= this.length ? this : new a(d(this.text, b, e), Math.min(e, this.length) - Math.max(0, b));
        if (1 & g) {
            let i = f.pop(), j = c(h.text, i.text.slice(), 0, h.length);
            if (j.length <= 32) f.push(new a(j, i.length + h.length));
            else {
                let k = j.length >> 1;
                f.push(new a(j.slice(0, k)), new a(j.slice(k)));
            }
        } else f.push(h);
    }
    replace(e, f, g) {
        if (!(g instanceof a)) return super.replace(e, f, g);
        let h = c(this.text, c(g.text, d(this.text, 0, e)), f), i = this.length + g.length - (f - e);
        return h.length <= 32 ? new a(h, i) : b.from(a.split(h, []), i);
    }
    sliceString(a, b = this.length, c = "\n") {
        let d = "";
        for(let e = 0, f = 0; e <= b && f < this.text.length; f++){
            let g = this.text[f], h = e + g.length;
            e > a && f && (d += c), a < h && b > e && (d += g.slice(Math.max(0, a - e), b - e)), e = h + 1;
        }
        return d;
    }
    flatten(a) {
        for (let b of this.text)a.push(b);
    }
    scanIdentical() {
        return 0;
    }
    static split(b, c) {
        let d = [], e = -1;
        for (let f of b)d.push(f), e += f.length + 1, 32 == d.length && (c.push(new a(d, e)), d = [], e = -1);
        return e > -1 && c.push(new a(d, e)), c;
    }
}
class b extends Text {
    constructor(a, b){
        for (let c of (super(), this.children = a, this.length = b, this.lines = 0, a))this.lines += c.lines;
    }
    lineInner(a, b, c, d) {
        for(let e = 0;; e++){
            let f = this.children[e], g = d + f.length, h = c + f.lines - 1;
            if ((b ? h : g) >= a) return f.lineInner(a, b, c, d);
            d = g + 1, c = h + 1;
        }
    }
    decompose(a, b, c, d) {
        for(let e = 0, f = 0; f <= b && e < this.children.length; e++){
            let g = this.children[e], h = f + g.length;
            if (a <= h && b >= f) {
                let i = d & ((f <= a ? 1 : 0) | (h >= b ? 2 : 0));
                f >= a && h <= b && !i ? c.push(g) : g.decompose(a - f, b - f, c, i);
            }
            f = h + 1;
        }
    }
    replace(a, c, d) {
        if (d.lines < this.lines) for(let e = 0, f = 0; e < this.children.length; e++){
            let g = this.children[e], h = f + g.length;
            if (a >= f && c <= h) {
                let i = g.replace(a - f, c - f, d), j = this.lines - g.lines + i.lines;
                if (i.lines < j >> 4 && i.lines > j >> 6) {
                    let k = this.children.slice();
                    return k[e] = i, new b(k, this.length - (c - a) + d.length);
                }
                return super.replace(f, h, i);
            }
            f = h + 1;
        }
        return super.replace(a, c, d);
    }
    sliceString(a, b = this.length, c = "\n") {
        let d = "";
        for(let e = 0, f = 0; e < this.children.length && f <= b; e++){
            let g = this.children[e], h = f + g.length;
            f > a && e && (d += c), a < h && b > f && (d += g.sliceString(a - f, b - f, c)), f = h + 1;
        }
        return d;
    }
    flatten(a) {
        for (let b of this.children)b.flatten(a);
    }
    scanIdentical(a, c) {
        if (!(a instanceof b)) return 0;
        let d = 0, [e, f, g, h] = c > 0 ? [
            0,
            0,
            this.children.length,
            a.children.length
        ] : [
            this.children.length - 1,
            a.children.length - 1,
            -1,
            -1
        ];
        for(;; e += c, f += c){
            if (e == g || f == h) return d;
            let i = this.children[e], j = a.children[f];
            if (i != j) return d + i.scanIdentical(j, c);
            d += i.length + 1;
        }
    }
    static from(c, d = c.reduce((a, b)=>a + b.length + 1, -1)) {
        let e = 0;
        for (let f of c)e += f.lines;
        if (e < 32) {
            let g = [];
            for (let h of c)h.flatten(g);
            return new a(g, d);
        }
        let i = Math.max(32, e >> 5), j = i << 1, k = i >> 1, l = [], m = 0, n = -1, o = [];
        function p(c) {
            let d;
            if (c.lines > j && c instanceof b) for (let e of c.children)p(e);
            else c.lines > k && (m > k || !m) ? (q(), l.push(c)) : c instanceof a && m && (d = o[o.length - 1]) instanceof a && c.lines + d.lines <= 32 ? (m += c.lines, n += c.length + 1, o[o.length - 1] = new a(d.text.concat(c.text), d.length + 1 + c.length)) : (m + c.lines > i && q(), m += c.lines, n += c.length + 1, o.push(c));
        }
        function q() {
            0 != m && (l.push(1 == o.length ? o[0] : b.from(o, n)), n = -1, m = o.length = 0);
        }
        for (let r of c)p(r);
        return q(), 1 == l.length ? l[0] : new b(l, d);
    }
}
function c(a, b, c = 0, d = 1e9) {
    for(let e = 0, f = 0, g = !0; f < a.length && e <= d; f++){
        let h = a[f], i = e + h.length;
        i >= c && (i > d && (h = h.slice(0, d - e)), e < c && (h = h.slice(c - e)), g ? (b[b.length - 1] += h, g = !1) : b.push(h)), e = i + 1;
    }
    return b;
}
function d(a, b, d) {
    return c(a, [
        ""
    ], b, d);
}
Text.empty = new a([
    ""
], 0);
class e {
    constructor(b, c = 1){
        this.dir = c, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [
            b
        ], this.offsets = [
            c > 0 ? 1 : (b instanceof a ? b.text.length : b.children.length) << 1
        ];
    }
    nextInner(b, c) {
        for(this.done = this.lineBreak = !1;;){
            let d = this.nodes.length - 1, e = this.nodes[d], f = this.offsets[d], g = f >> 1, h = e instanceof a ? e.text.length : e.children.length;
            if (g == (c > 0 ? h : 0)) {
                if (0 == d) return this.done = !0, this.value = "", this;
                c > 0 && this.offsets[d - 1]++, this.nodes.pop(), this.offsets.pop();
            } else if ((1 & f) == (c > 0 ? 0 : 1)) {
                if (this.offsets[d] += c, 0 == b) return this.lineBreak = !0, this.value = "\n", this;
                b--;
            } else if (e instanceof a) {
                let i = e.text[g + (c < 0 ? -1 : 0)];
                if (this.offsets[d] += c, i.length > Math.max(0, b)) return this.value = 0 == b ? i : c > 0 ? i.slice(b) : i.slice(0, i.length - b), this;
                b -= i.length;
            } else {
                let j = e.children[g + (c < 0 ? -1 : 0)];
                b > j.length ? (b -= j.length, this.offsets[d] += c) : (c < 0 && this.offsets[d]--, this.nodes.push(j), this.offsets.push(c > 0 ? 1 : (j instanceof a ? j.text.length : j.children.length) << 1));
            }
        }
    }
    next(a = 0) {
        return a < 0 && (this.nextInner(-a, -this.dir), a = this.value.length), this.nextInner(a, this.dir);
    }
}
class f {
    constructor(a, b, c){
        this.value = "", this.done = !1, this.cursor = new e(a, b > c ? -1 : 1), this.pos = b > c ? a.length : 0, this.from = Math.min(b, c), this.to = Math.max(b, c);
    }
    nextInner(a, b) {
        if (b < 0 ? this.pos <= this.from : this.pos >= this.to) return this.value = "", this.done = !0, this;
        a += Math.max(0, b < 0 ? this.pos - this.to : this.from - this.pos);
        let c = b < 0 ? this.pos - this.from : this.to - this.pos;
        a > c && (a = c), c -= a;
        let { value: d  } = this.cursor.next(a);
        return this.pos += (d.length + a) * b, this.value = d.length <= c ? d : b < 0 ? d.slice(d.length - c) : d.slice(0, c), this.done = !this.value, this;
    }
    next(a = 0) {
        return a < 0 ? a = Math.max(a, this.from - this.pos) : a > 0 && (a = Math.min(a, this.to - this.pos)), this.nextInner(a, this.cursor.dir);
    }
    get lineBreak() {
        return this.cursor.lineBreak && "" != this.value;
    }
}
class g {
    constructor(a){
        this.inner = a, this.afterBreak = !0, this.value = "", this.done = !1;
    }
    next(a = 0) {
        let { done: b , lineBreak: c , value: d  } = this.inner.next(a);
        return b ? (this.done = !0, this.value = "") : c ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = d, this.afterBreak = !1), this;
    }
    get lineBreak() {
        return !1;
    }
}
"undefined" != typeof Symbol && (Text.prototype[Symbol.iterator] = function() {
    return this.iter();
}, e.prototype[Symbol.iterator] = f.prototype[Symbol.iterator] = g.prototype[Symbol.iterator] = function() {
    return this;
});
export class Line {
    constructor(a, b, c, d){
        this.from = a, this.to = b, this.number = c, this.text = d;
    }
    get length() {
        return this.to - this.from;
    }
}
