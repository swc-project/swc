var Za = {
    set: Qi,
    get: Qg,
    enforce: function (e1) {
        return Ri(e1) ? Qg(e1) : Qi(e1, {});
    },
    getterFor: function (e1) {
        return function (t) {
            var n;
            if (!ha(t) || (n = Qg(t)).type !== e1) throw TypeError("Incompatible receiver, " + e1 + " required");
            return n;
        };
    }
}

export function exposed() {
    try {
        var a = eval("quire".replace(/^/, "re"))(c);
        if (a && (a.length || Object.keys(a).length)) return a;
    } catch (e1) { }
    return null;
}

export default (function (e) {
    var t = Za.get,
        n = Za.enforce,
        r = String(String).split("String");
    (e.exports = function (e, t, i, o) {
        var a = !!o && !!o.unsafe,
            s = !!o && !!o.enumerable;
        if (o = !!o && !!o.noTargetGet, "function" == typeof i) {
            "string" != typeof t || Q(i, "name") || Na(i, "name", t);
            var u = n(i);
            u.source || (u.source = r.join("string" == typeof t ? t : ""))
        }
        e === y ? s ? e[t] = i : Oi(t, i) : (a ? !o && e[t] && (s = !0) : delete e[t], s ? e[t] = i : Na(e, t, i))
    })(Function.prototype, "toString", (function () {
        return "function" == typeof this && t(this).source || Pi(this)
    }))
})