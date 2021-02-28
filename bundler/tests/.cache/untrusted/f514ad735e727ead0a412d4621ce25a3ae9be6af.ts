// Loaded from https://raw.githubusercontent.com/denyncrawford/safe-filter/master/dist/index.js


function getAttribute(obj, key) {
    var parts = key.split('.');
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var k = parts_1[_i];
        if (obj !== null && typeof obj === 'object' && k in obj) {
            obj = obj[k];
        }
        else {
            obj = undefined;
            break;
        }
    }
    return obj;
}

function exists(a, shouldExist) {
    var doesExist = a !== null && a !== undefined;
    return shouldExist ? doesExist : !doesExist;
}

function isEqual(a, b) {
    return a === b;
}

function greaterThan(a, b) {
    return a > b;
}

function greaterThanOrEqual(a, b) {
    return a >= b;
}

function lessThan(a, b) {
    return a < b;
}

function lessThanOrEqual(a, b) {
    return a <= b;
}

function testExpression(expr, value) {
    if (typeof expr !== 'object' || expr instanceof Date) {
        if (Array.isArray(value)) {
            return value.some(function (v) { return isEqual(v, expr); });
        }
        else {
            return isEqual(expr, value);
        }
    }
    if (expr && expr.$elemMatch) {
        if (!Array.isArray(value)) {
            return false;
        }
        if (!value.some(function (v) { return matches(expr.$elemMatch, v); })) {
            return false;
        }
    }
    else if (Array.isArray(value)) {
        var _loop_1 = function (key) {
            var _a;
            // @ts-ignore
            var partialExpr = (_a = {}, _a[key] = expr[key], _a);
            var isTrue = value.some(function (v) { return matches(partialExpr, v); });
            if (!isTrue) {
                return { value: false };
            }
        };
        // I don't understand why they designed the language this way, but I guess we'll do it the same way.
        // https://docs.mongodb.com/manual/tutorial/query-array-of-documents/#combination-of-elements-satisfies-the-criteria
        for (var key in expr) {
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return true;
    }
    if ('$eq' in expr && !isEqual(value, expr.$eq)) {
        return false;
    }
    if ('$ne' in expr && isEqual(value, expr.$ne)) {
        return false;
    }
    if (typeof expr.$exists === 'boolean' && !exists(value, expr.$exists)) {
        return false;
    }
    if ('$not' in expr) {
        if (typeof expr.$not !== 'object' || expr.$not === null) {
            throw new Error('$not needs a regex or a document');
        }
        if (testExpression(expr.$not, value)) {
            return false;
        }
    }
    if (expr.$gt !== undefined && !greaterThan(value, expr.$gt)) {
        return false;
    }
    if (expr.$lt !== undefined && !lessThan(value, expr.$lt)) {
        return false;
    }
    if (expr.$lte !== undefined && !lessThanOrEqual(value, expr.$lte)) {
        return false;
    }
    if (expr.$gte !== undefined && !greaterThanOrEqual(value, expr.$gte)) {
        return false;
    }
    if (expr.$in && !expr.$in.includes(value)) {
        return false;
    }
    if (expr.$nin && expr.$nin.includes(value)) {
        return false;
    }
    if (expr.$regex && !(new RegExp(expr.$regex)).test(value)) {
        return false;
    }
    return true;
}
function matches(expression, record, extractor) {
    if (extractor === void 0) { extractor = getAttribute; }
    if (typeof expression !== 'object' || expression instanceof Date) {
        return isEqual(expression, record);
    }
    if (expression.$and && expression.$or) {
        throw new Error('Indeterminate behavior. "$and" and "$or" operators cannot be present at the same level.');
    }
    if (Array.isArray(expression.$and)) {
        return expression.$and.every(function (exp) { return matches(exp, record, extractor); });
    }
    else if (Array.isArray(expression.$or)) {
        return expression.$or.some(function (exp) { return matches(exp, record, extractor); });
    }
    else if (expression.$not) {
        if (typeof expression.$not !== 'object') {
            throw new Error('$not needs a regex or a document');
        }
        return !matches(expression.$not, record, extractor);
    }
    else if (!Array.isArray(record) && typeof record === 'object') {
        var expr = expression;
        // Implicit AND operation if multiple root level keys provided
        for (var key in expression) {
            var value = extractor(record, key);
            if (!testExpression(expr[key], value)) {
                return false;
            }
        }
        return true;
    }
    else {
        return testExpression(expression, record);
    }
}

export { exists, getAttribute, greaterThan, greaterThanOrEqual, isEqual, lessThan, lessThanOrEqual, matches, testExpression };
