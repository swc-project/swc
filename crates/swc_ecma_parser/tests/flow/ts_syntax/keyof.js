type T = keyof O; // OK

const keyof = 1; // OK - in value context

type S = keyof; // ERROR
