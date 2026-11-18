export class Disposable {
    [Symbol.dispose]() {
        console.log('dispose')
    }
}

using _disposable = new Disposable()

console.log('ok')
