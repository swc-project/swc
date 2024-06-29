type T<in A> = A;
type T<out A> = A;
type T<in out A> = A;

type T<in> = in;
type T<out> = out;
const out = 1;
