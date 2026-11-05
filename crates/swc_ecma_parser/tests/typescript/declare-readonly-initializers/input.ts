namespace N {
    export enum E { A }
}

class C {
    declare readonly text = "test";
    declare readonly number = 1;
    declare readonly negative = -1;
    declare readonly boolean = true;
    declare readonly bigint = 1n;
    declare readonly negativeBigint = -1n;
    declare readonly template = `text`;
    declare readonly member = N.E.A;
    declare readonly computed = N.E["A"];
    declare static readonly value = false;
}
