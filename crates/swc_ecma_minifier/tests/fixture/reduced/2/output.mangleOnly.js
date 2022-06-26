export const def = {
    code (a) {
        const { gen: b , schema: c , parentSchema: d , data: e , it: f  } = a;
        if (f.opts.removeAdditional === "all" && d.additionalProperties === undefined) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(f, additionalProperties_1.default, "additionalProperties"));
        }
        const g = (0, code_1.allSchemaProperties)(c);
        for (const h of g){
            f.definedProperties.add(h);
        }
        if (f.opts.unevaluated && g.length && f.props !== true) {
            f.props = util_1.mergeEvaluated.props(b, (0, util_1.toHash)(g), f.props);
        }
        const i = g.filter((a)=>!(0, util_1.alwaysValidSchema)(f, c[a]));
        if (i.length === 0) return;
        const j = b.name("valid");
        for (const k of i){
            if (l(k)) {
                m(k);
            } else {
                b.if((0, code_1.propertyInData)(b, e, k, f.opts.ownProperties));
                m(k);
                if (!f.allErrors) b.else().var(j, true);
                b.endIf();
            }
            a.it.definedProperties.add(k);
            a.ok(j);
        }
        function l(a) {
            return (f.opts.useDefaults && !f.compositeRule && c[a].default !== undefined);
        }
        function m(b) {
            a.subschema({
                keyword: "properties",
                schemaProp: b,
                dataProp: b
            }, j);
        }
    }
};
