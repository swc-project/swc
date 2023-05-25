export const def = {
    code (cxt) {
        const { gen , schema , parentSchema , data , it  } = cxt;
        "all" === it.opts.removeAdditional && void 0 === parentSchema.additionalProperties && additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps)it.definedProperties.add(prop);
        it.opts.unevaluated && allProps.length && !0 !== it.props && (it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props));
        const properties = allProps.filter((p)=>!(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (0 === properties.length) return;
        const valid = gen.name("valid");
        for (const prop of properties)it.opts.useDefaults && !it.compositeRule && void 0 !== schema[prop].default ? applyPropertySchema(prop) : (gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties)), applyPropertySchema(prop), it.allErrors || gen.else().var(valid, !0), gen.endIf()), cxt.it.definedProperties.add(prop), cxt.ok(valid);
        function applyPropertySchema(prop) {
            cxt.subschema({
                keyword: "properties",
                schemaProp: prop,
                dataProp: prop
            }, valid);
        }
    }
};
