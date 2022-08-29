//// [newOperatorErrorCases_noImplicitAny.ts]
function fnNumber() {
    return 90;
}
new fnNumber(); // Error
function fnVoid() {}
new fnVoid(); // Error
function functionVoidNoThis() {}
new functionVoidNoThis(); // Error
