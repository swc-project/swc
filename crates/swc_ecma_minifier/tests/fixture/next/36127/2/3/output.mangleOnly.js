export class Text {
    constructor(){}
    lineAt(e) {
        if (e < 0 || e > this.length) throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
        return this.lineInner(e, false, 1, 0);
    }
    line(e) {
        if (e < 1 || e > this.lines) throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
        return this.lineInner(e, true, 1, 0);
    }
    replace(e, n, i) {
        let s = [];
        this.decompose(0, e, s, 2);
        if (i.length) i.decompose(0, i.length, s, 1 | 2);
        this.decompose(n, this.length, s, 1);
        return t.from(s, this.length - (n - e) + i.length);
    }
    append(e) {
        return this.replace(this.length, this.length, e);
    }
    slice(e, n = this.length) {
        let i = [];
        this.decompose(e, n, i, 0);
        return t.from(i, n - e);
    }
    eq(e) {
        if (e == this) return true;
        if (e.length != this.length || e.lines != this.lines) return false;
        let t = this.scanIdentical(e, 1), n = this.length - this.scanIdentical(e, -1);
        let i = new l(this), s = new l(e);
        for(let h = t, r = t;;){
            i.next(h);
            s.next(h);
            h = 0;
            if (i.lineBreak != s.lineBreak || i.done != s.done || i.value != s.value) return false;
            r += i.value.length;
            if (i.done || r >= n) return true;
        }
    }
    iter(e = 1) {
        return new l(this, e);
    }
    iterRange(e, t = this.length) {
        return new h(this, e, t);
    }
    iterLines(e, t) {
        let n;
        if (e == null) {
            n = this.iter();
        } else {
            if (t == null) t = this.lines + 1;
            let i = this.line(e).from;
            n = this.iterRange(i, Math.max(i, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
        }
        return new r(n);
    }
    toString() {
        return this.sliceString(0);
    }
    toJSON() {
        let e = [];
        this.flatten(e);
        return e;
    }
    static of(n) {
        if (n.length == 0) throw new RangeError("A document must have at least one line");
        if (n.length == 1 && !n[0]) return Text.empty;
        return n.length <= 32 ? new e(n) : t.from(e.split(n, []));
    }
}
Symbol.iterator;
class e extends Text {
    constructor(e, t = n(e)){
        super();
        this.text = e;
        this.length = t;
    }
    get lines() {
        return this.text.length;
    }
    get children() {
        return null;
    }
    lineInner(e, t, n, i) {
        for(let s = 0;; s++){
            let l = this.text[s], h = i + l.length;
            if ((t ? n : h) >= e) return new Line(i, h, n, l);
            i = h + 1;
            n++;
        }
    }
    decompose(t, n, l, h) {
        let r = t <= 0 && n >= this.length ? this : new e(s(this.text, t, n), Math.min(n, this.length) - Math.max(0, t));
        if (h & 1) {
            let o = l.pop();
            let f = i(r.text, o.text.slice(), 0, r.length);
            if (f.length <= 32) {
                l.push(new e(f, o.length + r.length));
            } else {
                let u = f.length >> 1;
                l.push(new e(f.slice(0, u)), new e(f.slice(u)));
            }
        } else {
            l.push(r);
        }
    }
    replace(n, l, h) {
        if (!(h instanceof e)) return super.replace(n, l, h);
        let r = i(this.text, i(h.text, s(this.text, 0, n)), l);
        let o = this.length + h.length - (l - n);
        if (r.length <= 32) return new e(r, o);
        return t.from(e.split(r, []), o);
    }
    sliceString(e, t = this.length, n = "\n") {
        let i = "";
        for(let s = 0, l = 0; s <= t && l < this.text.length; l++){
            let h = this.text[l], r = s + h.length;
            if (s > e && l) i += n;
            if (e < r && t > s) i += h.slice(Math.max(0, e - s), t - s);
            s = r + 1;
        }
        return i;
    }
    flatten(e) {
        for (let t of this.text)e.push(t);
    }
    scanIdentical() {
        return 0;
    }
    static split(t, n) {
        let i = [], s = -1;
        for (let l of t){
            i.push(l);
            s += l.length + 1;
            if (i.length == 32) {
                n.push(new e(i, s));
                i = [];
                s = -1;
            }
        }
        if (s > -1) n.push(new e(i, s));
        return n;
    }
}
class t extends Text {
    constructor(e, t){
        super();
        this.children = e;
        this.length = t;
        this.lines = 0;
        for (let n of e)this.lines += n.lines;
    }
    lineInner(e, t, n, i) {
        for(let s = 0;; s++){
            let l = this.children[s], h = i + l.length, r = n + l.lines - 1;
            if ((t ? r : h) >= e) return l.lineInner(e, t, n, i);
            i = h + 1;
            n = r + 1;
        }
    }
    decompose(e, t, n, i) {
        for(let s = 0, l = 0; l <= t && s < this.children.length; s++){
            let h = this.children[s], r = l + h.length;
            if (e <= r && t >= l) {
                let o = i & ((l <= e ? 1 : 0) | (r >= t ? 2 : 0));
                if (l >= e && r <= t && !o) n.push(h);
                else h.decompose(e - l, t - l, n, o);
            }
            l = r + 1;
        }
    }
    replace(e, n, i) {
        if (i.lines < this.lines) for(let s = 0, l = 0; s < this.children.length; s++){
            let h = this.children[s], r = l + h.length;
            if (e >= l && n <= r) {
                let o = h.replace(e - l, n - l, i);
                let f = this.lines - h.lines + o.lines;
                if (o.lines < (f >> (5 - 1)) && o.lines > (f >> (5 + 1))) {
                    let u = this.children.slice();
                    u[s] = o;
                    return new t(u, this.length - (n - e) + i.length);
                }
                return super.replace(l, r, o);
            }
            l = r + 1;
        }
        return super.replace(e, n, i);
    }
    sliceString(e, t = this.length, n = "\n") {
        let i = "";
        for(let s = 0, l = 0; s < this.children.length && l <= t; s++){
            let h = this.children[s], r = l + h.length;
            if (l > e && s) i += n;
            if (e < r && t > l) i += h.sliceString(e - l, t - l, n);
            l = r + 1;
        }
        return i;
    }
    flatten(e) {
        for (let t of this.children)t.flatten(e);
    }
    scanIdentical(e, n) {
        if (!(e instanceof t)) return 0;
        let i = 0;
        let [s, l, h, r] = n > 0 ? [
            0,
            0,
            this.children.length,
            e.children.length
        ] : [
            this.children.length - 1,
            e.children.length - 1,
            -1,
            -1
        ];
        for(;; s += n, l += n){
            if (s == h || l == r) return i;
            let o = this.children[s], f = e.children[l];
            if (o != f) return i + o.scanIdentical(f, n);
            i += o.length + 1;
        }
    }
    static from(n, i = n.reduce((e, t)=>e + t.length + 1, -1)) {
        let s = 0;
        for (let l of n)s += l.lines;
        if (s < 32) {
            let h = [];
            for (let r of n)r.flatten(h);
            return new e(h, i);
        }
        let o = Math.max(32, s >> 5), f = o << 1, u = o >> 1;
        let a = [], c = 0, g = -1, p = [];
        function d(n) {
            let i;
            if (n.lines > f && n instanceof t) {
                for (let s of n.children)d(s);
            } else if (n.lines > u && (c > u || !c)) {
                x();
                a.push(n);
            } else if (n instanceof e && c && (i = p[p.length - 1]) instanceof e && n.lines + i.lines <= 32) {
                c += n.lines;
                g += n.length + 1;
                p[p.length - 1] = new e(i.text.concat(n.text), i.length + 1 + n.length);
            } else {
                if (c + n.lines > o) x();
                c += n.lines;
                g += n.length + 1;
                p.push(n);
            }
        }
        function x() {
            if (c == 0) return;
            a.push(p.length == 1 ? p[0] : t.from(p, g));
            g = -1;
            c = p.length = 0;
        }
        for (let m of n)d(m);
        x();
        return a.length == 1 ? a[0] : new t(a, i);
    }
}
Text.empty = new e([
    ""
], 0);
function n(e) {
    let t = -1;
    for (let n of e)t += n.length + 1;
    return t;
}
function i(e, t, n = 0, i = 1e9) {
    for(let s = 0, l = 0, h = true; l < e.length && s <= i; l++){
        let r = e[l], o = s + r.length;
        if (o >= n) {
            if (o > i) r = r.slice(0, i - s);
            if (s < n) r = r.slice(n - s);
            if (h) {
                t[t.length - 1] += r;
                h = false;
            } else t.push(r);
        }
        s = o + 1;
    }
    return t;
}
function s(e, t, n) {
    return i(e, [
        ""
    ], t, n);
}
class l {
    constructor(t, n = 1){
        this.dir = n;
        this.done = false;
        this.lineBreak = false;
        this.value = "";
        this.nodes = [
            t
        ];
        this.offsets = [
            n > 0 ? 1 : (t instanceof e ? t.text.length : t.children.length) << 1
        ];
    }
    nextInner(t, n) {
        this.done = this.lineBreak = false;
        for(;;){
            let i = this.nodes.length - 1;
            let s = this.nodes[i], l = this.offsets[i], h = l >> 1;
            let r = s instanceof e ? s.text.length : s.children.length;
            if (h == (n > 0 ? r : 0)) {
                if (i == 0) {
                    this.done = true;
                    this.value = "";
                    return this;
                }
                if (n > 0) this.offsets[i - 1]++;
                this.nodes.pop();
                this.offsets.pop();
            } else if ((l & 1) == (n > 0 ? 0 : 1)) {
                this.offsets[i] += n;
                if (t == 0) {
                    this.lineBreak = true;
                    this.value = "\n";
                    return this;
                }
                t--;
            } else if (s instanceof e) {
                let o = s.text[h + (n < 0 ? -1 : 0)];
                this.offsets[i] += n;
                if (o.length > Math.max(0, t)) {
                    this.value = t == 0 ? o : n > 0 ? o.slice(t) : o.slice(0, o.length - t);
                    return this;
                }
                t -= o.length;
            } else {
                let f = s.children[h + (n < 0 ? -1 : 0)];
                if (t > f.length) {
                    t -= f.length;
                    this.offsets[i] += n;
                } else {
                    if (n < 0) this.offsets[i]--;
                    this.nodes.push(f);
                    this.offsets.push(n > 0 ? 1 : (f instanceof e ? f.text.length : f.children.length) << 1);
                }
            }
        }
    }
    next(e = 0) {
        if (e < 0) {
            this.nextInner(-e, (-this.dir));
            e = this.value.length;
        }
        return this.nextInner(e, this.dir);
    }
}
Symbol.iterator;
class h {
    constructor(e, t, n){
        this.value = "";
        this.done = false;
        this.cursor = new l(e, t > n ? -1 : 1);
        this.pos = t > n ? e.length : 0;
        this.from = Math.min(t, n);
        this.to = Math.max(t, n);
    }
    nextInner(e, t) {
        if (t < 0 ? this.pos <= this.from : this.pos >= this.to) {
            this.value = "";
            this.done = true;
            return this;
        }
        e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
        let n = t < 0 ? this.pos - this.from : this.to - this.pos;
        if (e > n) e = n;
        n -= e;
        let { value: i  } = this.cursor.next(e);
        this.pos += (i.length + e) * t;
        this.value = i.length <= n ? i : t < 0 ? i.slice(i.length - n) : i.slice(0, n);
        this.done = !this.value;
        return this;
    }
    next(e = 0) {
        if (e < 0) e = Math.max(e, this.from - this.pos);
        else if (e > 0) e = Math.min(e, this.to - this.pos);
        return this.nextInner(e, this.cursor.dir);
    }
    get lineBreak() {
        return this.cursor.lineBreak && this.value != "";
    }
}
Symbol.iterator;
class r {
    constructor(e){
        this.inner = e;
        this.afterBreak = true;
        this.value = "";
        this.done = false;
    }
    next(e = 0) {
        let { done: t , lineBreak: n , value: i  } = this.inner.next(e);
        if (t) {
            this.done = true;
            this.value = "";
        } else if (n) {
            if (this.afterBreak) {
                this.value = "";
            } else {
                this.afterBreak = true;
                this.next();
            }
        } else {
            this.value = i;
            this.afterBreak = false;
        }
        return this;
    }
    get lineBreak() {
        return false;
    }
}
Symbol.iterator;
if (typeof Symbol != "undefined") {
    Text.prototype[Symbol.iterator] = function() {
        return this.iter();
    };
    l.prototype[Symbol.iterator] = h.prototype[Symbol.iterator] = r.prototype[Symbol.iterator] = function() {
        return this;
    };
}
export class Line {
    constructor(e, t, n, i){
        this.from = e;
        this.to = t;
        this.number = n;
        this.text = i;
    }
    get length() {
        return this.to - this.from;
    }
}
