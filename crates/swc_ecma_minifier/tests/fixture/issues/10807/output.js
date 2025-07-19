export function markDep(depProp, PropMeta, t, changedFunction, props) {
    //debugger;
    for(var names = [], currName = "", currOpts = [], hasDefaultValue = !1, defaultValue = null, propType = null, changeHandler = null, setterFunc = null, getterFunc = null, aliasName = null, propertyAlias = null, i = 0; i < props.length; i++)!function() {
        if (i % 2 == 0) {
            if ((currName = props[i]).indexOf(":") >= 0) {
                var parts = currName.split(":");
                2 == parts.length ? (currName = parts[0], aliasName = parts[1], propertyAlias = currName.substring(0, 1).toLowerCase() + currName.substring(1) + "Property") : (currName = parts[0], 0 == (aliasName = parts[1]).length && (aliasName = currName.substring(0, 1).toLowerCase() + currName.substring(1)), propertyAlias = parts[2]);
            } else propertyAlias = (aliasName = currName.substring(0, 1).toLowerCase() + currName.substring(1)) + "Property";
            names.push(currName);
        } else {
            2 == (currOpts = props[i]).length ? (hasDefaultValue = !0, defaultValue = currOpts[1]) : hasDefaultValue = !1, propType = Type.decodePropType(currOpts[0]);
            var changedName_1 = currName;
            changeHandler = function(o, a) {
                o[changedFunction].call(o, changedName_1, a.oldValue, a.newValue);
            };
            var meta = null;
            meta = hasDefaultValue ? PropMeta.createWithDefaultAndCallback(defaultValue, changeHandler) : PropMeta.createWithCallback(changeHandler);
            var dp_1 = depProp.registerAlt(currName, propType, t.$type, meta);
            setterFunc = function(v) {
                this.setValueAlt(dp_1, v);
            }, getterFunc = propType.isEnumType ? function() {
                return typeGetValue(this.getValueAlt(dp_1));
            } : function() {
                return this.getValueAlt(dp_1);
            }, Object.defineProperty(t.prototype, aliasName, {
                set: setterFunc,
                get: getterFunc,
                configurable: !0
            }), t[propertyAlias] = dp_1;
        }
    }();
    return names;
}
