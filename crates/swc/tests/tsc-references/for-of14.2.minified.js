//// [for-of14.ts]
var v;
class StringIterator {
    next() {
        return "";
    }
}
for (v of new StringIterator);
