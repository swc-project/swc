export class Text {
    constructor(){}
    lineAt(a) {
        if (a < 0 || a > this.length) throw new RangeError(`Invalid position ${a} in document of length ${this.length}`);
        return this.lineInner(a, false, 1, 0);
    }
    line(a) {
        if (a < 1 || a > this.lines) throw new RangeError(`Invalid line number ${a} in ${this.lines}-line document`);
        return this.lineInner(a, true, 1, 0);
    }
    replace(a, c, d) {
        let e = [];
        this.decompose(0, a, e, 2);
        if (d.length) d.decompose(0, d.length, e, 1 | 2);
        this.decompose(c, this.length, e, 1);
        return b.from(e, this.length - (c - a) + d.length);
    }
    append(a) {
        return this.replace(this.length, this.length, a);
    }
    slice(a, c = this.length) {
        let d = [];
        this.decompose(a, c, d, 0);
        return b.from(d, c - a);
    }
    eq(a) {
        if (a == this) return true;
        if (a.length != this.length || a.lines != this.lines) return false;
        let b = this.scanIdentical(a, 1), c = this.length - this.scanIdentical(a, -1);
        let d = new f(this), e = new f(a);
        for(let g = b, h = b;;){
            d.next(g);
            e.next(g);
            g = 0;
            if (d.lineBreak != e.lineBreak || d.done != e.done || d.value != e.value) return false;
            h += d.value.length;
            if (d.done || h >= c) return true;
        }
    }
    iter(a = 1) {
        return new f(this, a);
    }
    iterRange(a, b = this.length) {
        return new g(this, a, b);
    }
    iterLines(a, b) {
        let c;
        if (a == null) {
            c = this.iter();
        } else {
            if (b == null) b = this.lines + 1;
            let d = this.line(a).from;
            c = this.iterRange(d, Math.max(d, b == this.lines + 1 ? this.length : b <= 1 ? 0 : this.line(b - 1).to));
        }
        return new h(c);
    }
    toString() {
        return this.sliceString(0);
    }
    toJSON() {
        let a = [];
        this.flatten(a);
        return a;
    }
    static of(c) {
        if (c.length == 0) throw new RangeError("A document must have at least one line");
        if (c.length == 1 && !c[0]) return Text.empty;
        return c.length <= 32 ? new a(c) : b.from(a.split(c, []));
    }
}
Symbol.iterator;
class a extends Text {
    constructor(a, b = c(a)){
        super();
        this.text = a;
        this.length = b;
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
            d = g + 1;
            c++;
        }
    }
    decompose(b, c, f, g) {
        let h = b <= 0 && c >= this.length ? this : new a(e(this.text, b, c), Math.min(c, this.length) - Math.max(0, b));
        if (g & 1) {
            let i = f.pop();
            let j = d(h.text, i.text.slice(), 0, h.length);
            if (j.length <= 32) {
                f.push(new a(j, i.length + h.length));
            } else {
                let k = j.length >> 1;
                f.push(new a(j.slice(0, k)), new a(j.slice(k)));
            }
        } else {
            f.push(h);
        }
    }
    replace(c, f, g) {
        if (!(g instanceof a)) return super.replace(c, f, g);
        let h = d(this.text, d(g.text, e(this.text, 0, c)), f);
        let i = this.length + g.length - (f - c);
        if (h.length <= 32) return new a(h, i);
        return b.from(a.split(h, []), i);
    }
    sliceString(a, b = this.length, c = "\n") {
        let d = "";
        for(let e = 0, f = 0; e <= b && f < this.text.length; f++){
            let g = this.text[f], h = e + g.length;
            if (e > a && f) d += c;
            if (a < h && b > e) d += g.slice(Math.max(0, a - e), b - e);
            e = h + 1;
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
        for (let f of b){
            d.push(f);
            e += f.length + 1;
            if (d.length == 32) {
                c.push(new a(d, e));
                d = [];
                e = -1;
            }
        }
        if (e > -1) c.push(new a(d, e));
        return c;
    }
}
class b extends Text {
    constructor(a, b){
        super();
        this.children = a;
        this.length = b;
        this.lines = 0;
        for (let c of a)this.lines += c.lines;
    }
    lineInner(a, b, c, d) {
        for(let e = 0;; e++){
            let f = this.children[e], g = d + f.length, h = c + f.lines - 1;
            if ((b ? h : g) >= a) return f.lineInner(a, b, c, d);
            d = g + 1;
            c = h + 1;
        }
    }
    decompose(a, b, c, d) {
        for(let e = 0, f = 0; f <= b && e < this.children.length; e++){
            let g = this.children[e], h = f + g.length;
            if (a <= h && b >= f) {
                let i = d & ((f <= a ? 1 : 0) | (h >= b ? 2 : 0));
                if (f >= a && h <= b && !i) c.push(g);
                else g.decompose(a - f, b - f, c, i);
            }
            f = h + 1;
        }
    }
    replace(a, c, d) {
        if (d.lines < this.lines) for(let e = 0, f = 0; e < this.children.length; e++){
            let g = this.children[e], h = f + g.length;
            if (a >= f && c <= h) {
                let i = g.replace(a - f, c - f, d);
                let j = this.lines - g.lines + i.lines;
                if (i.lines < (j >> (5 - 1)) && i.lines > (j >> (5 + 1))) {
                    let k = this.children.slice();
                    k[e] = i;
                    return new b(k, this.length - (c - a) + d.length);
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
            if (f > a && e) d += c;
            if (a < h && b > f) d += g.sliceString(a - f, b - f, c);
            f = h + 1;
        }
        return d;
    }
    flatten(a) {
        for (let b of this.children)b.flatten(a);
    }
    scanIdentical(a, c) {
        if (!(a instanceof b)) return 0;
        let d = 0;
        let [e, f, g, h] = c > 0 ? [
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
        let i = Math.max(32, e >> 5), j = i << 1, k = i >> 1;
        let l = [], m = 0, n = -1, o = [];
        function p(c) {
            let d;
            if (c.lines > j && c instanceof b) {
                for (let e of c.children)p(e);
            } else if (c.lines > k && (m > k || !m)) {
                q();
                l.push(c);
            } else if (c instanceof a && m && (d = o[o.length - 1]) instanceof a && c.lines + d.lines <= 32) {
                m += c.lines;
                n += c.length + 1;
                o[o.length - 1] = new a(d.text.concat(c.text), d.length + 1 + c.length);
            } else {
                if (m + c.lines > i) q();
                m += c.lines;
                n += c.length + 1;
                o.push(c);
            }
        }
        function q() {
            if (m == 0) return;
            l.push(o.length == 1 ? o[0] : b.from(o, n));
            n = -1;
            m = o.length = 0;
        }
        for (let r of c)p(r);
        q();
        return l.length == 1 ? l[0] : new b(l, d);
    }
}
Text.empty = new a([
    ""
], 0);
function c(a) {
    let b = -1;
    for (let c of a)b += c.length + 1;
    return b;
}
function d(a, b, c = 0, d = 1e9) {
    for(let e = 0, f = 0, g = true; f < a.length && e <= d; f++){
        let h = a[f], i = e + h.length;
        if (i >= c) {
            if (i > d) h = h.slice(0, d - e);
            if (e < c) h = h.slice(c - e);
            if (g) {
                b[b.length - 1] += h;
                g = false;
            } else b.push(h);
        }
        e = i + 1;
    }
    return b;
}
function e(a, b, c) {
    return d(a, [
        ""
    ], b, c);
}
class f {
    constructor(b, c = 1){
        this.dir = c;
        this.done = false;
        this.lineBreak = false;
        this.value = "";
        this.nodes = [
            b
        ];
        this.offsets = [
            c > 0 ? 1 : (b instanceof a ? b.text.length : b.children.length) << 1
        ];
    }
    nextInner(b, c) {
        this.done = this.lineBreak = false;
        for(;;){
            let d = this.nodes.length - 1;
            let e = this.nodes[d], f = this.offsets[d], g = f >> 1;
            let h = e instanceof a ? e.text.length : e.children.length;
            if (g == (c > 0 ? h : 0)) {
                if (d == 0) {
                    this.done = true;
                    this.value = "";
                    return this;
                }
                if (c > 0) this.offsets[d - 1]++;
                this.nodes.pop();
                this.offsets.pop();
            } else if ((f & 1) == (c > 0 ? 0 : 1)) {
                this.offsets[d] += c;
                if (b == 0) {
                    this.lineBreak = true;
                    this.value = "\n";
                    return this;
                }
                b--;
            } else if (e instanceof a) {
                let i = e.text[g + (c < 0 ? -1 : 0)];
                this.offsets[d] += c;
                if (i.length > Math.max(0, b)) {
                    this.value = b == 0 ? i : c > 0 ? i.slice(b) : i.slice(0, i.length - b);
                    return this;
                }
                b -= i.length;
            } else {
                let j = e.children[g + (c < 0 ? -1 : 0)];
                if (b > j.length) {
                    b -= j.length;
                    this.offsets[d] += c;
                } else {
                    if (c < 0) this.offsets[d]--;
                    this.nodes.push(j);
                    this.offsets.push(c > 0 ? 1 : (j instanceof a ? j.text.length : j.children.length) << 1);
                }
            }
        }
    }
    next(a = 0) {
        if (a < 0) {
            this.nextInner(-a, (-this.dir));
            a = this.value.length;
        }
        return this.nextInner(a, this.dir);
    }
}
Symbol.iterator;
class g {
    constructor(a, b, c){
        this.value = "";
        this.done = false;
        this.cursor = new f(a, b > c ? -1 : 1);
        this.pos = b > c ? a.length : 0;
        this.from = Math.min(b, c);
        this.to = Math.max(b, c);
    }
    nextInner(a, b) {
        if (b < 0 ? this.pos <= this.from : this.pos >= this.to) {
            this.value = "";
            this.done = true;
            return this;
        }
        a += Math.max(0, b < 0 ? this.pos - this.to : this.from - this.pos);
        let c = b < 0 ? this.pos - this.from : this.to - this.pos;
        if (a > c) a = c;
        c -= a;
        let { value: d  } = this.cursor.next(a);
        this.pos += (d.length + a) * b;
        this.value = d.length <= c ? d : b < 0 ? d.slice(d.length - c) : d.slice(0, c);
        this.done = !this.value;
        return this;
    }
    next(a = 0) {
        if (a < 0) a = Math.max(a, this.from - this.pos);
        else if (a > 0) a = Math.min(a, this.to - this.pos);
        return this.nextInner(a, this.cursor.dir);
    }
    get lineBreak() {
        return this.cursor.lineBreak && this.value != "";
    }
}
Symbol.iterator;
class h {
    constructor(a){
        this.inner = a;
        this.afterBreak = true;
        this.value = "";
        this.done = false;
    }
    next(a = 0) {
        let { done: b , lineBreak: c , value: d  } = this.inner.next(a);
        if (b) {
            this.done = true;
            this.value = "";
        } else if (c) {
            if (this.afterBreak) {
                this.value = "";
            } else {
                this.afterBreak = true;
                this.next();
            }
        } else {
            this.value = d;
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
    f.prototype[Symbol.iterator] = g.prototype[Symbol.iterator] = h.prototype[Symbol.iterator] = function() {
        return this;
    };
}
export class Line {
    constructor(a, b, c, d){
        this.from = a;
        this.to = b;
        this.number = c;
        this.text = d;
    }
    get length() {
        return this.to - this.from;
    }
}
