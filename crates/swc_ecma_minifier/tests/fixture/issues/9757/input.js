export default function A() {
    console?.log?.(123);
    console?.log?.apply(console, arguments);
    console?.a.b?.c(console, arguments);
    console?.any();
    console?.warn();
}
