export function markDep(depProp, PropMeta, t, changedFunction, props) {
    var names = [];
    var currName = "";
    var currOpts = [];
    var hasDefaultValue = false;
    var defaultValue = null;
    var propType = null;
    var changeHandler = null;
    var setterFunc = null;
    var getterFunc = null;
    var aliasName = null;
    var propertyAlias = null;
    var _loop_1 = function () {
        if (i % 2 == 0) {
            currName = props[i];
            if (currName.indexOf(":") >= 0) {
                var parts = currName.split(":");
                if (parts.length == 2) {
                    currName = parts[0];
                    aliasName = parts[1];
                    propertyAlias =
                        currName.substring(0, 1).toLowerCase() +
                        currName.substring(1) +
                        "Property";
                } else {
                    currName = parts[0];
                    aliasName = parts[1];
                    if (aliasName.length == 0) {
                        aliasName =
                            currName.substring(0, 1).toLowerCase() +
                            currName.substring(1);
                    }
                    propertyAlias = parts[2];
                }
            } else {
                aliasName =
                    currName.substring(0, 1).toLowerCase() +
                    currName.substring(1);
                propertyAlias = aliasName + "Property";
            }
            names.push(currName);
        } else {
            currOpts = props[i];
            if (currOpts.length == 2) {
                hasDefaultValue = true;
                defaultValue = currOpts[1];
                propType = Type.decodePropType(currOpts[0]);
            } else {
                hasDefaultValue = false;
                propType = Type.decodePropType(currOpts[0]);
            }
            var changedName_1 = currName;
            changeHandler = function (o, a) {
                o[changedFunction].call(
                    o,
                    changedName_1,
                    a.oldValue,
                    a.newValue
                );
            };
            var meta = null;
            if (hasDefaultValue) {
                meta = PropMeta.createWithDefaultAndCallback(
                    defaultValue,
                    changeHandler
                );
            } else {
                meta = PropMeta.createWithCallback(changeHandler);
            }
            var dp_1 = depProp.registerAlt(currName, propType, t.$type, meta);
            setterFunc = function (v) {
                this.setValueAlt(dp_1, v);
            };
            if (propType.isEnumType) {
                getterFunc = function () {
                    return typeGetValue(this.getValueAlt(dp_1));
                };
            } else {
                getterFunc = function () {
                    return this.getValueAlt(dp_1);
                };
            }
            Object.defineProperty(t.prototype, aliasName, {
                set: setterFunc,
                get: getterFunc,
                configurable: true,
            });
            t[propertyAlias] = dp_1;
        }
    };
    //debugger;
    for (var i = 0; i < props.length; i++) {
        _loop_1();
    }
    return names;
}
