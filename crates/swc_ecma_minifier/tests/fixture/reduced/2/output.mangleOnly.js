export const def = {
    code (e) {
        const { gen: o , schema: t , parentSchema: r , data: a , it: s  } = e;
        if (s.opts.removeAdditional === "all" && r.additionalProperties === undefined) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(s, additionalProperties_1.default, "additionalProperties"));
        }
        const d = (0, code_1.allSchemaProperties)(t);
        for (const i of d){
            s.definedProperties.add(i);
        }
        if (s.opts.unevaluated && d.length && s.props !== true) {
            s.props = util_1.mergeEvaluated.props(o, (0, util_1.toHash)(d), s.props);
        }
        const n = d.filter((e)=>!(0, util_1.alwaysValidSchema)(s, t[e]));
        if (n.length === 0) return;
        const p = o.name("valid");
        for (const l of n){
            if (f(l)) {
                c(l);
            } else {
                o.if((0, code_1.propertyInData)(o, a, l, s.opts.ownProperties));
                c(l);
                if (!s.allErrors) o.else().var(p, true);
                o.endIf();
            }
            e.it.definedProperties.add(l);
            e.ok(p);
        }
        function f(e) {
            return (s.opts.useDefaults && !s.compositeRule && t[e].default !== undefined);
        }
        function c(o) {
            e.subschema({
                keyword: "properties",
                schemaProp: o,
                dataProp: o
            }, p);
        }
    }
};
