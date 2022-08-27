//// [overrideInterfaceProperty.ts]
class Sizz extends Mup {
    // ok, because Mup is an interface
    get size() {
        return 0;
    }
}
class Kasizz extends Mup {
    size = -1;
}
