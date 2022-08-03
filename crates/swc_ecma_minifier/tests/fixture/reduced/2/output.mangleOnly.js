export const def = {
    code (e) {
        const { gen: o , schema: t , parentSchema: r , data: s , it: a  } = e;
        if (a.opts.removeAdditional === "all" && r.additionalProperties === undefined) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(a, additionalProperties_1.default, "additionalProperties"));
        }
        const d = (0, code_1.allSchemaProperties)(t);
        for (const n of d){
            a.definedProperties.add(n);
        }
        if (a.opts.unevaluated && d.length && a.props !== true) {
            a.props = util_1.mergeEvaluated.props(o, (0, util_1.toHash)(d), a.props);
        }
        const i = d.filter((e)=>!(0, util_1.alwaysValidSchema)(a, t[e]));
        if (i.length === 0) return;
        const p = o.name("valid");
        for (const f of i){
            if (l(f)) {
                c(f);
            } else {
                o.if((0, code_1.propertyInData)(o, s, f, a.opts.ownProperties));
                c(f);
                if (!a.allErrors) o.else().var(p, true);
                o.endIf();
            }
            e.it.definedProperties.add(f);
            e.ok(p);
        }
        function l(e) {
            return (a.opts.useDefaults && !a.compositeRule && t[e].default !== undefined);
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
