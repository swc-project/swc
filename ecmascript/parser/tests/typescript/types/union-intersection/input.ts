let union: number | null | undefined;
let intersection: number & string;
let precedence1: number | string & boolean;
let precedence2: number & string | boolean;
type LeadingUnion =
    | string
    | number;
type LeadingIntersection =
    & number
    & string;
