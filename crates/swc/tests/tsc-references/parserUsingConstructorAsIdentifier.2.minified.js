//// [parserUsingConstructorAsIdentifier.ts]
function define(constructor, instanceMembers, staticMembers) {
    return constructor = constructor || function() {}, PluginUtilities.Utilities.markSupportedForProcessing(constructor), instanceMembers && initializeProperties(constructor.prototype, instanceMembers), staticMembers && initializeProperties(constructor, staticMembers), constructor;
}
function derive(baseClass, constructor, instanceMembers, staticMembers) {
    if (!baseClass) return define(constructor, instanceMembers, staticMembers);
    constructor = constructor || function() {};
    var basePrototype = baseClass.prototype;
    return constructor.prototype = Object.create(basePrototype), PluginUtilities.Utilities.markSupportedForProcessing(constructor), Object.defineProperty(constructor.prototype, "constructor", {
        value: constructor,
        writable: !0,
        configurable: !0,
        enumerable: !0
    }), instanceMembers && initializeProperties(constructor.prototype, instanceMembers), staticMembers && initializeProperties(constructor, staticMembers), constructor;
}
function mix(constructor) {
    var i, len;
    for(i = 1, constructor = constructor || function() {}, len = arguments.length; i < len; i++)initializeProperties(constructor.prototype, arguments[i]);
    return constructor;
}
