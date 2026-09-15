enum E { A }
class C {
    declare mutable = "test";
    declare readonly annotated: string = "test";
    declare readonly binary = 1 + 2;
    declare readonly call = String(1);
    declare readonly object = {};
    declare readonly positive = +1;
    declare readonly parenthesized = (1);
    declare readonly template = `${1}`;
    declare readonly computed = E["A" + ""];
}
