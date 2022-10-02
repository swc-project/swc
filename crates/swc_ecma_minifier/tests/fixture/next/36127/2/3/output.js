export class Text {
    constructor(){}
    lineAt(t) {
        if (t < 0 || t > this.length) throw RangeError(`Invalid position ${t} in document of length ${this.length}`);
        return this.lineInner(t, !1, 1, 0);
    }
    line(t) {
        if (t < 1 || t > this.lines) throw RangeError(`Invalid line number ${t} in ${this.lines}-line document`);
        return this.lineInner(t, !0, 1, 0);
    }
    replace(t, n, i) {
        let s = [];
        return this.decompose(0, t, s, 2), i.length && i.decompose(0, i.length, s, 3), this.decompose(n, this.length, s, 1), e.from(s, this.length - (n - t) + i.length);
    }
    append(t) {
        return this.replace(this.length, this.length, t);
    }
    slice(t, n = this.length) {
        let i = [];
        return this.decompose(t, n, i, 0), e.from(i, n - t);
    }
    eq(t) {
        if (t == this) return !0;
        if (t.length != this.length || t.lines != this.lines) return !1;
        let e = this.scanIdentical(t, 1), n = this.length - this.scanIdentical(t, -1), s = new i(this), h = new i(t);
        for(let l = e, r = e;;){
            if (s.next(l), h.next(l), l = 0, s.lineBreak != h.lineBreak || s.done != h.done || s.value != h.value) return !1;
            if (r += s.value.length, s.done || r >= n) return !0;
        }
    }
    iter(t = 1) {
        return new i(this, t);
    }
    iterRange(t, e = this.length) {
        return new s(this, t, e);
    }
    iterLines(t, e) {
        let n;
        if (null == t) n = this.iter();
        else {
            null == e && (e = this.lines + 1);
            let i = this.line(t).from;
            n = this.iterRange(i, Math.max(i, e == this.lines + 1 ? this.length : e <= 1 ? 0 : this.line(e - 1).to));
        }
        return new h(n);
    }
    toString() {
        return this.sliceString(0);
    }
    toJSON() {
        let t = [];
        return this.flatten(t), t;
    }
    static of(n) {
        if (0 == n.length) throw RangeError("A document must have at least one line");
        return 1 != n.length || n[0] ? n.length <= 32 ? new t(n) : e.from(t.split(n, [])) : Text.empty;
    }
}
class t extends Text {
    constructor(t, e = function(t) {
        let e = -1;
        for (let n of t)e += n.length + 1;
        return e;
    }(t)){
        super(), this.text = t, this.length = e;
    }
    get lines() {
        return this.text.length;
    }
    get children() {
        return null;
    }
    lineInner(t, e, n, i) {
        for(let s = 0;; s++){
            let h = this.text[s], l = i + h.length;
            if ((e ? n : l) >= t) return new Line(i, l, n, h);
            i = l + 1, n++;
        }
    }
    decompose(e, i, s, h) {
        let l = e <= 0 && i >= this.length ? this : new t(n(this.text, [
            ""
        ], e, i), Math.min(i, this.length) - Math.max(0, e));
        if (1 & h) {
            let r = s.pop(), o = n(l.text, r.text.slice(), 0, l.length);
            if (o.length <= 32) s.push(new t(o, r.length + l.length));
            else {
                let f = o.length >> 1;
                s.push(new t(o.slice(0, f)), new t(o.slice(f)));
            }
        } else s.push(l);
    }
    replace(i, s, h) {
        if (!(h instanceof t)) return super.replace(i, s, h);
        let l = n(this.text, n(h.text, n(this.text, [
            ""
        ], 0, i)), s), r = this.length + h.length - (s - i);
        return l.length <= 32 ? new t(l, r) : e.from(t.split(l, []), r);
    }
    sliceString(t, e = this.length, n = "\n") {
        let i = "";
        for(let s = 0, h = 0; s <= e && h < this.text.length; h++){
            let l = this.text[h], r = s + l.length;
            s > t && h && (i += n), t < r && e > s && (i += l.slice(Math.max(0, t - s), e - s)), s = r + 1;
        }
        return i;
    }
    flatten(t) {
        for (let e of this.text)t.push(e);
    }
    scanIdentical() {
        return 0;
    }
    static split(e, n) {
        let i = [], s = -1;
        for (let h of e)i.push(h), s += h.length + 1, 32 == i.length && (n.push(new t(i, s)), i = [], s = -1);
        return s > -1 && n.push(new t(i, s)), n;
    }
}
class e extends Text {
    constructor(t, e){
        for (let n of (super(), this.children = t, this.length = e, this.lines = 0, t))this.lines += n.lines;
    }
    lineInner(t, e, n, i) {
        for(let s = 0;; s++){
            let h = this.children[s], l = i + h.length, r = n + h.lines - 1;
            if ((e ? r : l) >= t) return h.lineInner(t, e, n, i);
            i = l + 1, n = r + 1;
        }
    }
    decompose(t, e, n, i) {
        for(let s = 0, h = 0; h <= e && s < this.children.length; s++){
            let l = this.children[s], r = h + l.length;
            if (t <= r && e >= h) {
                let o = i & ((h <= t ? 1 : 0) | (r >= e ? 2 : 0));
                h >= t && r <= e && !o ? n.push(l) : l.decompose(t - h, e - h, n, o);
            }
            h = r + 1;
        }
    }
    replace(t, n, i) {
        if (i.lines < this.lines) for(let s = 0, h = 0; s < this.children.length; s++){
            let l = this.children[s], r = h + l.length;
            if (t >= h && n <= r) {
                let o = l.replace(t - h, n - h, i), f = this.lines - l.lines + o.lines;
                if (o.lines < f >> 4 && o.lines > f >> 6) {
                    let c = this.children.slice();
                    return c[s] = o, new e(c, this.length - (n - t) + i.length);
                }
                return super.replace(h, r, o);
            }
            h = r + 1;
        }
        return super.replace(t, n, i);
    }
    sliceString(t, e = this.length, n = "\n") {
        let i = "";
        for(let s = 0, h = 0; s < this.children.length && h <= e; s++){
            let l = this.children[s], r = h + l.length;
            h > t && s && (i += n), t < r && e > h && (i += l.sliceString(t - h, e - h, n)), h = r + 1;
        }
        return i;
    }
    flatten(t) {
        for (let e of this.children)e.flatten(t);
    }
    scanIdentical(t, n) {
        if (!(t instanceof e)) return 0;
        let i = 0, [s, h, l, r] = n > 0 ? [
            0,
            0,
            this.children.length,
            t.children.length
        ] : [
            this.children.length - 1,
            t.children.length - 1,
            -1,
            -1
        ];
        for(;; s += n, h += n){
            if (s == l || h == r) return i;
            let o = this.children[s], f = t.children[h];
            if (o != f) return i + o.scanIdentical(f, n);
            i += o.length + 1;
        }
    }
    static from(n, i = n.reduce((t, e)=>t + e.length + 1, -1)) {
        let s = 0;
        for (let h of n)s += h.lines;
        if (s < 32) {
            let l = [];
            for (let r of n)r.flatten(l);
            return new t(l, i);
        }
        let o = Math.max(32, s >> 5), f = o << 1, c = o >> 1, u = [], a = 0, g = -1, p = [];
        function d() {
            0 != a && (u.push(1 == p.length ? p[0] : e.from(p, g)), g = -1, a = p.length = 0);
        }
        for (let x of n)!function n(i) {
            let s;
            if (i.lines > f && i instanceof e) for (let h of i.children)n(h);
            else i.lines > c && (a > c || !a) ? (d(), u.push(i)) : i instanceof t && a && (s = p[p.length - 1]) instanceof t && i.lines + s.lines <= 32 ? (a += i.lines, g += i.length + 1, p[p.length - 1] = new t(s.text.concat(i.text), s.length + 1 + i.length)) : (a + i.lines > o && d(), a += i.lines, g += i.length + 1, p.push(i));
        }(x);
        return d(), 1 == u.length ? u[0] : new e(u, i);
    }
}
function n(t, e, n = 0, i = 1e9) {
    for(let s = 0, h = 0, l = !0; h < t.length && s <= i; h++){
        let r = t[h], o = s + r.length;
        o >= n && (o > i && (r = r.slice(0, i - s)), s < n && (r = r.slice(n - s)), l ? (e[e.length - 1] += r, l = !1) : e.push(r)), s = o + 1;
    }
    return e;
}
Text.empty = new t([
    ""
], 0);
class i {
    constructor(e, n = 1){
        this.dir = n, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [
            e
        ], this.offsets = [
            n > 0 ? 1 : (e instanceof t ? e.text.length : e.children.length) << 1
        ];
    }
    nextInner(e, n) {
        for(this.done = this.lineBreak = !1;;){
            let i = this.nodes.length - 1, s = this.nodes[i], h = this.offsets[i], l = h >> 1, r = s instanceof t ? s.text.length : s.children.length;
            if (l == (n > 0 ? r : 0)) {
                if (0 == i) return this.done = !0, this.value = "", this;
                n > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
            } else if ((1 & h) == (n > 0 ? 0 : 1)) {
                if (this.offsets[i] += n, 0 == e) return this.lineBreak = !0, this.value = "\n", this;
                e--;
            } else if (s instanceof t) {
                let o = s.text[l + (n < 0 ? -1 : 0)];
                if (this.offsets[i] += n, o.length > Math.max(0, e)) return this.value = 0 == e ? o : n > 0 ? o.slice(e) : o.slice(0, o.length - e), this;
                e -= o.length;
            } else {
                let f = s.children[l + (n < 0 ? -1 : 0)];
                e > f.length ? (e -= f.length, this.offsets[i] += n) : (n < 0 && this.offsets[i]--, this.nodes.push(f), this.offsets.push(n > 0 ? 1 : (f instanceof t ? f.text.length : f.children.length) << 1));
            }
        }
    }
    next(t = 0) {
        return t < 0 && (this.nextInner(-t, -this.dir), t = this.value.length), this.nextInner(t, this.dir);
    }
}
class s {
    constructor(t, e, n){
        this.value = "", this.done = !1, this.cursor = new i(t, e > n ? -1 : 1), this.pos = e > n ? t.length : 0, this.from = Math.min(e, n), this.to = Math.max(e, n);
    }
    nextInner(t, e) {
        if (e < 0 ? this.pos <= this.from : this.pos >= this.to) return this.value = "", this.done = !0, this;
        t += Math.max(0, e < 0 ? this.pos - this.to : this.from - this.pos);
        let n = e < 0 ? this.pos - this.from : this.to - this.pos;
        t > n && (t = n), n -= t;
        let { value: i  } = this.cursor.next(t);
        return this.pos += (i.length + t) * e, this.value = i.length <= n ? i : e < 0 ? i.slice(i.length - n) : i.slice(0, n), this.done = !this.value, this;
    }
    next(t = 0) {
        return t < 0 ? t = Math.max(t, this.from - this.pos) : t > 0 && (t = Math.min(t, this.to - this.pos)), this.nextInner(t, this.cursor.dir);
    }
    get lineBreak() {
        return this.cursor.lineBreak && "" != this.value;
    }
}
class h {
    constructor(t){
        this.inner = t, this.afterBreak = !0, this.value = "", this.done = !1;
    }
    next(t = 0) {
        let { done: e , lineBreak: n , value: i  } = this.inner.next(t);
        return e ? (this.done = !0, this.value = "") : n ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = i, this.afterBreak = !1), this;
    }
    get lineBreak() {
        return !1;
    }
}
"undefined" != typeof Symbol && (Text.prototype[Symbol.iterator] = function() {
    return this.iter();
}, i.prototype[Symbol.iterator] = s.prototype[Symbol.iterator] = h.prototype[Symbol.iterator] = function() {
    return this;
});
export class Line {
    constructor(t, e, n, i){
        this.from = t, this.to = e, this.number = n, this.text = i;
    }
    get length() {
        return this.to - this.from;
    }
}
