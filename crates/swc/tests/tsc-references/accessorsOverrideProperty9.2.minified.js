//// [accessorsOverrideProperty9.ts]
class ApiItem {
    get members() {
        return [];
    }
}
function ApiItemContainerMixin(baseClass) {
    return class extends baseClass {
        get members() {
            return [];
        }
        constructor(...args){
            super(...args);
        }
    };
}
export class ApiEnum extends ApiItemContainerMixin(ApiItem) {
    get members() {
        return [];
    }
}
