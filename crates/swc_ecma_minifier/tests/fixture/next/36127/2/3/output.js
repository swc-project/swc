/// The data structure for documents. @nonabstract
export class Text {
    /// @internal
    constructor(){}
    /// Get the line description around the given position.
    lineAt(t) {
        if (t < 0 || t > this.length) throw RangeError(`Invalid position ${t} in document of length ${this.length}`);
        return this.lineInner(t, !1, 1, 0);
    }
    /// Get the description for the given (1-based) line number.
    line(t) {
        if (t < 1 || t > this.lines) throw RangeError(`Invalid line number ${t} in ${this.lines}-line document`);
        return this.lineInner(t, !0, 1, 0);
    }
    /// Replace a range of the text with the given content.
    replace(n, i, t) {
        let e = [];
        return this.decompose(0, n, e, 2 /* Open.To */ ), t.length && t.decompose(0, t.length, e, 3 /* Open.To */ ), this.decompose(i, this.length, e, 1 /* Open.From */ ), h.from(e, this.length - (i - n) + t.length);
    }
    /// Append another document to this one.
    append(t) {
        return this.replace(this.length, this.length, t);
    }
    /// Retrieve the text between the given points.
    slice(t, e = this.length) {
        let n = [];
        return this.decompose(t, e, n, 0), h.from(n, e - t);
    }
    /// Test whether this text is equal to another instance.
    eq(t) {
        if (t == this) return !0;
        if (t.length != this.length || t.lines != this.lines) return !1;
        let e = this.scanIdentical(t, 1), i = this.length - this.scanIdentical(t, -1), s = new n(this), h = new n(t);
        for(let t = e, n = e;;){
            if (s.next(t), h.next(t), t = 0, s.lineBreak != h.lineBreak || s.done != h.done || s.value != h.value) return !1;
            if (n += s.value.length, s.done || n >= i) return !0;
        }
    }
    /// Iterate over the text. When `dir` is `-1`, iteration happens
    /// from end to start. This will return lines and the breaks between
    /// them as separate strings.
    iter(t = 1) {
        return new n(this, t);
    }
    /// Iterate over a range of the text. When `from` > `to`, the
    /// iterator will run in reverse.
    iterRange(t, e = this.length) {
        return new i(this, t, e);
    }
    /// Return a cursor that iterates over the given range of lines,
    /// _without_ returning the line breaks between, and yielding empty
    /// strings for empty lines.
    ///
    /// When `from` and `to` are given, they should be 1-based line numbers.
    iterLines(e, n) {
        let t;
        if (null == e) t = this.iter();
        else {
            null == n && (n = this.lines + 1);
            let i = this.line(e).from;
            t = this.iterRange(i, Math.max(i, n == this.lines + 1 ? this.length : n <= 1 ? 0 : this.line(n - 1).to));
        }
        return new s(t);
    }
    /// @internal
    toString() {
        return this.sliceString(0);
    }
    /// Convert the document to an array of lines (which can be
    /// deserialized again via [`Text.of`](#state.Text^of)).
    toJSON() {
        let t = [];
        return this.flatten(t), t;
    }
    /// Create a `Text` instance for the given array of lines.
    static of(e) {
        if (0 == e.length) throw RangeError("A document must have at least one line");
        return 1 != e.length || e[0] ? e.length <= 32 /* Tree.Branch */  ? new t(e) : h.from(t.split(e, [])) : Text.empty;
    }
}
// Leaves store an array of line strings. There are always line breaks
// between these strings. Leaves are limited in size and have to be
// contained in TextNode instances for bigger documents.
class t extends Text {
    constructor(t, e = function(e) {
        let t = -1;
        for (let n of e)t += n.length + 1;
        return t;
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
            let l = this.text[s], h = i + l.length;
            if ((e ? n : h) >= t) return new Line(i, h, n, l);
            i = h + 1, n++;
        }
    }
    decompose(n, i, s, h) {
        let l = n <= 0 && i >= this.length ? this : new t(e(this.text, [
            ""
        ], n, i), Math.min(i, this.length) - Math.max(0, n));
        if (1 /* Open.From */  & h) {
            let n = s.pop(), i = e(l.text, n.text.slice(), 0, l.length);
            if (i.length <= 32 /* Tree.Branch */ ) s.push(new t(i, n.length + l.length));
            else {
                let e = i.length >> 1;
                s.push(new t(i.slice(0, e)), new t(i.slice(e)));
            }
        } else s.push(l);
    }
    replace(i, s, n) {
        if (!(n instanceof t)) return super.replace(i, s, n);
        let l = e(this.text, e(n.text, e(this.text, [
            ""
        ], 0, i)), s), r = this.length + n.length - (s - i);
        return l.length <= 32 /* Tree.Branch */  ? new t(l, r) : h.from(t.split(l, []), r);
    }
    sliceString(e, n = this.length, i = "\n") {
        let t = "";
        for(let h = 0, s = 0; h <= n && s < this.text.length; s++){
            let l = this.text[s], r = h + l.length;
            h > e && s && (t += i), e < r && n > h && (t += l.slice(Math.max(0, e - h), n - h)), h = r + 1;
        }
        return t;
    }
    flatten(t) {
        for (let e of this.text)t.push(e);
    }
    scanIdentical() {
        return 0;
    }
    static split(s, e) {
        let i = [], n = -1;
        for (let h of s)i.push(h), n += h.length + 1, 32 /* Tree.Branch */  == i.length && (e.push(new t(i, n)), i = [], n = -1);
        return n > -1 && e.push(new t(i, n)), e;
    }
}
// Nodes provide the tree structure of the `Text` type. They store a
// number of other nodes or leaves, taking care to balance themselves
// on changes. There are implied line breaks _between_ the children of
// a node (but not before the first or after the last child).
class h extends Text {
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
            let r = this.children[s], l = h + r.length;
            if (t <= l && e >= h) {
                let s = i & (+(h <= t) | 2 /* Open.To */  * (l >= e));
                h >= t && l <= e && !s ? n.push(r) : r.decompose(t - h, e - h, n, s);
            }
            h = l + 1;
        }
    }
    replace(e, n, t) {
        if (t.lines < this.lines) for(let i = 0, s = 0; i < this.children.length; i++){
            let r = this.children[i], l = s + r.length;
            // Fast path: if the change only affects one child and the
            // child's size remains in the acceptable range, only update
            // that child
            if (e >= s && n <= l) {
                let o = r.replace(e - s, n - s, t), f = this.lines - r.lines + o.lines;
                if (o.lines < f >> 4 && o.lines > f >> 6) {
                    let s = this.children.slice();
                    return s[i] = o, new h(s, this.length - (n - e) + t.length);
                }
                return super.replace(s, l, o);
            }
            s = l + 1;
        }
        return super.replace(e, n, t);
    }
    sliceString(e, n = this.length, i = "\n") {
        let t = "";
        for(let s = 0, h = 0; s < this.children.length && h <= n; s++){
            let l = this.children[s], r = h + l.length;
            h > e && s && (t += i), e < r && n > h && (t += l.sliceString(e - h, n - h, i)), h = r + 1;
        }
        return t;
    }
    flatten(t) {
        for (let e of this.children)e.flatten(t);
    }
    scanIdentical(t, e) {
        if (!(t instanceof h)) return 0;
        let n = 0, [i, s, l, r] = e > 0 ? [
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
        for(;; i += e, s += e){
            if (i == l || s == r) return n;
            let h = this.children[i], o = t.children[s];
            if (h != o) return n + h.scanIdentical(o, e);
            n += h.length + 1;
        }
    }
    static from(s, l = s.reduce((t, e)=>t + e.length + 1, -1)) {
        let n = 0;
        for (let t of s)n += t.lines;
        if (n < 32 /* Tree.Branch */ ) {
            let e = [];
            for (let t of s)t.flatten(e);
            return new t(e, l);
        }
        let i = Math.max(32 /* Tree.Branch */ , n >> 5 /* Tree.BranchShift */ ), o = i << 1, f = i >> 1, e = [], c = 0, u = -1, a = [];
        function r() {
            0 != c && (e.push(1 == a.length ? a[0] : h.from(a, u)), u = -1, c = a.length = 0);
        }
        for (let n of s)!function n(s) {
            let l;
            if (s.lines > o && s instanceof h) for (let t of s.children)n(t);
            else s.lines > f && (c > f || !c) ? (r(), e.push(s)) : s instanceof t && c && (l = a[a.length - 1]) instanceof t && s.lines + l.lines <= 32 /* Tree.Branch */  ? (c += s.lines, u += s.length + 1, a[a.length - 1] = new t(l.text.concat(s.text), l.length + 1 + s.length)) : (c + s.lines > i && r(), c += s.lines, u += s.length + 1, a.push(s));
        }(n);
        return r(), 1 == e.length ? e[0] : new h(e, l);
    }
}
function e(n, t, i = 0, s = 1e9) {
    for(let h = 0, e = 0, l = !0; e < n.length && h <= s; e++){
        let r = n[e], o = h + r.length;
        o >= i && (o > s && (r = r.slice(0, s - h)), h < i && (r = r.slice(i - h)), l ? (t[t.length - 1] += r, l = !1) : t.push(r)), h = o + 1;
    }
    return t;
}
Text.empty = new t([
    ""
], 0);
class n {
    constructor(e, n = 1){
        this.dir = n, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [
            e
        ], this.offsets = [
            n > 0 ? 1 : (e instanceof t ? e.text.length : e.children.length) << 1
        ];
    }
    nextInner(e, n) {
        for(this.done = this.lineBreak = !1;;){
            let s = this.nodes.length - 1, i = this.nodes[s], h = this.offsets[s], l = h >> 1, r = i instanceof t ? i.text.length : i.children.length;
            if (l == (n > 0 ? r : 0)) {
                if (0 == s) return this.done = !0, this.value = "", this;
                n > 0 && this.offsets[s - 1]++, this.nodes.pop(), this.offsets.pop();
            } else if ((1 & h) == (n > 0 ? 0 : 1)) {
                if (this.offsets[s] += n, 0 == e) return this.lineBreak = !0, this.value = "\n", this;
                e--;
            } else if (i instanceof t) {
                // Move to the next string
                let t = i.text[l + (n < 0 ? -1 : 0)];
                if (this.offsets[s] += n, t.length > Math.max(0, e)) return this.value = 0 == e ? t : n > 0 ? t.slice(e) : t.slice(0, t.length - e), this;
                e -= t.length;
            } else {
                let h = i.children[l + (n < 0 ? -1 : 0)];
                e > h.length ? (e -= h.length, this.offsets[s] += n) : (n < 0 && this.offsets[s]--, this.nodes.push(h), this.offsets.push(n > 0 ? 1 : (h instanceof t ? h.text.length : h.children.length) << 1));
            }
        }
    }
    next(t = 0) {
        return t < 0 && (this.nextInner(-t, -this.dir), t = this.value.length), this.nextInner(t, this.dir);
    }
}
class i {
    constructor(i, t, e){
        this.value = "", this.done = !1, this.cursor = new n(i, t > e ? -1 : 1), this.pos = t > e ? i.length : 0, this.from = Math.min(t, e), this.to = Math.max(t, e);
    }
    nextInner(t, i) {
        if (i < 0 ? this.pos <= this.from : this.pos >= this.to) return this.value = "", this.done = !0, this;
        t += Math.max(0, i < 0 ? this.pos - this.to : this.from - this.pos);
        let e = i < 0 ? this.pos - this.from : this.to - this.pos;
        t > e && (t = e), e -= t;
        let { value: n } = this.cursor.next(t);
        return this.pos += (n.length + t) * i, this.value = n.length <= e ? n : i < 0 ? n.slice(n.length - e) : n.slice(0, e), this.done = !this.value, this;
    }
    next(t = 0) {
        return t < 0 ? t = Math.max(t, this.from - this.pos) : t > 0 && (t = Math.min(t, this.to - this.pos)), this.nextInner(t, this.cursor.dir);
    }
    get lineBreak() {
        return this.cursor.lineBreak && "" != this.value;
    }
}
class s {
    constructor(t){
        this.inner = t, this.afterBreak = !0, this.value = "", this.done = !1;
    }
    next(t = 0) {
        let { done: e, lineBreak: n, value: i } = this.inner.next(t);
        return e ? (this.done = !0, this.value = "") : n ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = i, this.afterBreak = !1), this;
    }
    get lineBreak() {
        return !1;
    }
}
"undefined" != typeof Symbol && (Text.prototype[Symbol.iterator] = function() {
    return this.iter();
}, n.prototype[Symbol.iterator] = i.prototype[Symbol.iterator] = s.prototype[Symbol.iterator] = function() {
    return this;
});
/// This type describes a line in the document. It is created
/// on-demand when lines are [queried](#state.Text.lineAt).
export class Line {
    /// @internal
    constructor(/// The position of the start of the line.
    t, /// The position at the end of the line (_before_ the line break,
    /// or at the end of document for the last line).
    e, /// This line's line number (1-based).
    n, /// The line's content.
    i){
        this.from = t, this.to = e, this.number = n, this.text = i;
    }
    /// The length of the line (not including any line break after it).
    get length() {
        return this.to - this.from;
    }
}
