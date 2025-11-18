// main.ts
var _computedKey;
_computedKey = Symbol.dispose;
export class Disposable {
    [_computedKey]() {
        console.log('dispose');
    }
}
using _disposable = new Disposable()
console.log('ok');
