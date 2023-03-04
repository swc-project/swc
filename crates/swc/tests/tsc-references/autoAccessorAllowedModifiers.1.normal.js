//// [autoAccessorAllowedModifiers.ts]
class C1 {
    accessor a;
    accessor b;
    accessor c;
    accessor d;
    accessor e;
    static accessor f;
    static accessor g;
    static accessor h;
    static accessor i;
    accessor #j;
    accessor "k";
    accessor 108;
    accessor ["m"];
    accessor n;
}
class C2 extends C1 {
    accessor e;
    static accessor i;
}
