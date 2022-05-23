function isUndefined() {}
function f() {
    var modelValue = this.$$lastCommittedViewValue;
    return isUndefined(modelValue) ? modelValue : null;
}
