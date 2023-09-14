//// [for-of27.ts]
let prop;
class StringIterator {
}
prop = Symbol.iterator;
for (var v of new StringIterator){}
