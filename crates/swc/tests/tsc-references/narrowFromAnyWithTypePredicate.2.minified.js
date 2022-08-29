//// [narrowFromAnyWithTypePredicate.ts]
isFunction(x) && (x(), x(1, 2, 3), x("hello!"), x.prop), isObject(x) && (x.method(), x()), isAnything(x) && (x.method(), x()), isError(x) && (x.message, x.mesage), isDate(x) && (x.getDate(), x.getHuors());
