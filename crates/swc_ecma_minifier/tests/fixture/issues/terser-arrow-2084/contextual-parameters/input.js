function* generator() {
    return function (yield) {
        return ++yield;
    };
}

async function asynchronous() {
    return function (await) {
        return ++await;
    };
}

function* generatorDefault() {
    return function (value = yield) {
        return value;
    };
}

async function asynchronousDefault() {
    return function (value = await) {
        return value;
    };
}

const asyncArrow = async () => function (await) {
    return ++await;
};

function* generatorArrowBody() {
    return () => function (yield) {
        return ++yield;
    };
}

async function asyncArrowBody() {
    return () => function (await) {
        return ++await;
    };
}

class StaticContext {
    static {
        let fn = function (value) {
            return value;
        };
        console.log(fn(0));
    }
}

const asyncArrowParameter = async (fn = function (await) {
    return await;
}) => fn;

console.log(generator().next().value(0));
asynchronous().then(function (fn) {
    console.log(fn(0));
});
asyncArrow().then(function (fn) {
    console.log(fn(0));
});
console.log(generatorArrowBody().next().value()(0));
asyncArrowBody().then(function (fn) {
    console.log(fn()(0));
});
asyncArrowParameter().then(function (fn) {
    console.log(fn(0));
});
