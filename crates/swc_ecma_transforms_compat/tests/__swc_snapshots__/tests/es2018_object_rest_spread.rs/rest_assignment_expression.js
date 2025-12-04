({ a1 } = c1);
({ a2 } = c2), b2 = _object_without_properties(c2, [
    "a2"
]), c2;
console.log(({ a3 } = c3, b3 = _object_without_properties(c3, [
    "a3"
]), c3));
