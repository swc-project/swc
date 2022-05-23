function isUndefined() {}
function f() {
    var viewValue = this.$$lastCommittedViewValue;
    var modelValue = viewValue;
    return isUndefined(modelValue) ? modelValue : null;
}
