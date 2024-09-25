class Disposable {
    disposed = false;

    [Symbol.dispose]() {
        this.disposed = true
    }
}

const disposables = [new Disposable()]

for (using _ of disposables) {/* ... */ }

if (disposables[0].disposed) {
    console.log("✅ dispose ok")
} else {
    console.error("💥 failed to dispose")
}

class AsyncDisposable {
    disposed = false;

    [Symbol.asyncDispose]() {
        this.disposed = true
    }
}

const asyncDisposables = [new AsyncDisposable()]

for (await using _ of asyncDisposables) {/* ... */ }

expect(asyncDisposables[0].disposed).toBe(true);