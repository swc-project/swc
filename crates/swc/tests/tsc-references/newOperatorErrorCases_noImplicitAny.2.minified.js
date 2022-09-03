//// [newOperatorErrorCases_noImplicitAny.ts]
function fnNumber() {
    return 90;
}
function fnVoid() {}
function functionVoidNoThis() {}
new fnNumber(), new fnVoid(), new functionVoidNoThis();
