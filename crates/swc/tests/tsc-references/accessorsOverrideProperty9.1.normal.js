//// [accessorsOverrideProperty9.ts]
// #41347, based on microsoft/rushstack
// Mixin utilities
// Base class
class ApiItem {
    get members() {
        return [];
    }
}
// Normal subclass
class ApiEnumMember extends ApiItem {
}
function ApiItemContainerMixin(baseClass) {
    class MixedClass extends baseClass {
        get members() {
            return [];
        }
        constructor(...args){
            super(...args);
        }
    }
    return MixedClass;
}
// Subclass inheriting from mixin
export class ApiEnum extends ApiItemContainerMixin(ApiItem) {
    // This worked prior to TypeScript 4.0:
    get members() {
        return [];
    }
}
