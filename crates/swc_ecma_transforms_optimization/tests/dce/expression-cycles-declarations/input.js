var varA = function () {
    varB();
};
var varB = function () {
    varA();
};

let letA = function () {
    letB();
};
let letB = function () {
    letA();
};

const constA = () => {
    constB();
};
const constB = () => {
    constA();
};

let LetClass = class {
    method() {
        return LetFactory();
    }
};
let LetFactory = function () {
    return new LetClass();
};

const ConstClass = class {
    method() {
        return ConstFactory();
    }
};
const ConstFactory = () => new ConstClass();

var usedFunctionA = function () {
    usedFunctionB();
};
var usedFunctionB = function () {
    usedFunctionA();
};
use(usedFunctionA);

var usedClass = class {
    method(value) {
        return usedClassFactory(value);
    }
};
async function usedClassFactory() {
    return new usedClass();
}
use(usedClass);

var namedFunction = function localFunctionName() {
    localFunctionName();
};
var localFunctionName = function () {
    namedFunction();
};
use(namedFunction);

var namedClass = class LocalClassName {
    method() {
        return new LocalClassName();
    }
};
var LocalClassName = class {
    method() {
        return new namedClass();
    }
};
use(namedClass);

var heritageClass = class extends heritageBase {
    method() {
        return heritageFactory();
    }
};
var heritageBase = class {};
function heritageFactory() {
    return new heritageClass();
}

var effectfulClass = class {
    static value = effect();

    method() {
        return effectfulFactory();
    }
};
function effectfulFactory() {
    return new effectfulClass();
}

let tdzLetA = tdzLetB;
let tdzLetB = tdzLetA;

const tdzConstA = tdzConstB;
const tdzConstB = tdzConstA;
