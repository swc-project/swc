function a(b, c = {
}, d = false) {
    return {
        rule: b,
        params: c,
        implicit: d
    };
}
function e(b) {
    if (typeof b === "undefined") {
        return a("nullable", {
            value: b
        }, true);
    }
}
function f(b) {
    return b.find((c)=>c === e
    ) ? true : false;
}
function g(b) {
    return b === undefined || b === null || b === "";
}
function h(b) {
    return g(b) ? a("required", {
        value: b
    }, true) : undefined;
}
function i(b) {
    return b.find((c)=>c === h
    ) ? false : true;
}
const j = (b, c, d, k)=>{
    c.attr = d;
    if (typeof b === "function") {
        return b(c, k || "");
    } else {
        for(let l in c){
            b = b.replace(`:${l}`, c[l]);
        }
        return b;
    }
};
const m = (b)=>{
    const c = b.split(":");
    c.shift();
    return c.join(":");
};
const n = (b, c, d, k, l)=>{
    return b[`${c}.${d}`] || b[`${c}.${k}`] || b[c] || b[d] || b[k] || l;
};
const o = (b, { messages , attributes  })=>{
    const k = {
    };
    const l = (messages || {
    })["default"] || ":attr is invalid";
    for(let p in b){
        const q = b[p];
        const r = (attributes || {
        })[p] || p;
        k[p] = {
        };
        for (let s of q){
            const t = m(s.rule);
            const u = t ? s.rule.substr(0, s.rule.length - t.length - 1) : s.rule;
            if (s.rule === "validateObject" && s.params.errors) {
                k[p][u] = o(s.params.errors, {
                    messages,
                    attributes
                });
            } else if (s.rule === "validateArray" && s.params.errors) {
                k[p][u] = o(s.params.errors, {
                    messages,
                    attributes
                });
            } else {
                const v = n(messages || {
                }, p, s.rule, u, l);
                k[p][u] = j(v, s.params, r, t);
            }
        }
    }
    return k;
};
const w = (b)=>{
    return b.match(/^\d+$/) ? true : false;
};
const x = (b, c)=>{
    if (typeof b[c] !== "undefined") {
        return b[c];
    }
    const d = c.split(".");
    const k = d.reduce((l, p)=>{
        if (l && typeof l === "object") {
            return l[p];
        } else if (l instanceof Array && w(p)) {
            const r = parseInt(p);
            return l[r];
        }
    }, {
        ...b
    });
    return k;
};
const y = (b, c)=>{
    const d = x(b, c);
    return typeof d !== "undefined";
};
const z = (b)=>{
    return {
        getValue: (c)=>x(b, c)
        ,
        hasValue: (d)=>y(b, d)
    };
};
const A = {
    "fileExists:pathCheck": "file :value doesn't exists",
    "fileExists:stringCheck": "file path must be a string",
    isArray: ":attr must be an array",
    isBool: ":attr must be a boolean",
    isEmail: ":attr is not a valid email address",
    isFloat: ":attr must be a float number",
    isIn: ":value is not allowed",
    isInt: ":attr must be an integer",
    isNumber: ":attr must be a number",
    isNumeric: ":attr must be numeric",
    isString: ":attr must be a string",
    lengthBetween: ":attr characters length must be between :minLength-:maxLength",
    match: ":attr format is incorrect",
    maxLength: ":attr cannot be higher than :maxValue characters",
    maxNumber: ":attr cannot be higher than :maxValue",
    minLength: ":attr cannot be lower than :minValue characters",
    minNumber: ":attr cannot be lower than :minValue",
    notIn: ":value is not allowed",
    notNull: ":value cannot be null",
    numberBetween: ":value must be between :minValue - :maxValue",
    required: ":attr is required",
    default: ":attr is invalid"
};
const B = (b, c)=>{
    return b[c];
};
const C = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule", 
]);
const D = async (b, d, k)=>{
    const l = [];
    if (g(b) && i(d)) {
        const p = d.filter((q)=>C.has(q.name)
        );
        if (p.length === 0) {
            return [];
        }
        for (let r of d.filter((s)=>C.has(s.name)
        )){
            let t = r(b, k);
            if (t instanceof Promise) {
                t = await t;
            }
            if (t !== undefined && t.noContext) {
                return [];
            }
            if (t !== undefined) {
                l.push(t);
                if (t.implicit) {
                    return l;
                }
            }
        }
        d = d.filter((v)=>!C.has(v.name)
        );
    }
    if (typeof b === "object" && b === null && f(d)) {
        return [];
    }
    for (let E of d){
        let F = E(b, k);
        if (F instanceof Promise) {
            F = await F;
        }
        if (F !== undefined && !F.noContext) {
            l.push(F);
            if (F.implicit === true) {
                break;
            }
        }
    }
    return l;
};
const G = async (b, c)=>{
    const d = {
    };
    const k = z(b);
    for(let l in c){
        const p = c[l] instanceof Array ? c[l] : [
            c[l]
        ];
        const r = B(b, l);
        const s = await D(r, p, k);
        if (s.length) {
            d[l] = s;
        }
    }
    return d;
};
const H = async (b, c, d = {
    messages: A
})=>{
    const k = await G(b, c);
    const l = Object.keys(k).length === 0;
    const q = l ? {
    } : o(k, d);
    return [
        l,
        q
    ];
};
function I(b) {
    if (typeof b !== "number") {
        return a("isNumber", {
            value: b
        });
    }
}
const J = {
    name: "",
    age: "20"
};
const [K, L] = await H(J, {
    name: h,
    age: [
        h,
        I
    ]
});
console.log({
    passes: K,
    errors: L
});
