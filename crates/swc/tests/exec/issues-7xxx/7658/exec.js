class CancelError extends Error {
    constructor(message) {
        super(message);
        this.name = "CancelError";
    }
    get isCancelled() {
        return true;
    }
}
class CancelablePromise {
    #isResolved;
    #isRejected;
    #isCancelled;
    #cancelHandlers;
    #promise;
    #resolve;
    #reject;
    constructor(executor) {
        this.#isResolved = false;
        this.#isRejected = false;
        this.#isCancelled = false;
        this.#cancelHandlers = [];
        this.#promise = new Promise((resolve, reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
            const onResolve = (value) => {
                if (this.#isResolved || this.#isRejected || this.#isCancelled) {
                    return;
                }
                this.#isResolved = true;
                this.#resolve?.(value);
            };
            const onReject = (reason) => {
                if (this.#isResolved || this.#isRejected || this.#isCancelled) {
                    return;
                }
                this.#isRejected = true;
                this.#reject?.(reason);
            };
            const onCancel = (cancelHandler) => {
                if (this.#isResolved || this.#isRejected || this.#isCancelled) {
                    return;
                }
                this.#cancelHandlers.push(cancelHandler);
            };
            Object.defineProperty(onCancel, "isResolved", {
                get: () => this.#isResolved
            });
            Object.defineProperty(onCancel, "isRejected", {
                get: () => this.#isRejected
            });
            Object.defineProperty(onCancel, "isCancelled", {
                get: () => this.#isCancelled
            });
            return executor(onResolve, onReject, onCancel);
        });
    }
    get [Symbol.toStringTag]() {
        return "Cancellable Promise";
    }
    then(onFulfilled, onRejected) {
        return this.#promise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
        return this.#promise.catch(onRejected);
    }
    finally(onFinally) {
        return this.#promise.finally(onFinally);
    }
    cancel() {
        if (this.#isResolved || this.#isRejected || this.#isCancelled) {
            return;
        }
        this.#isCancelled = true;
        if (this.#cancelHandlers.length) {
            try {
                for (const cancelHandler of this.#cancelHandlers) {
                    cancelHandler();
                }
            } catch (error) {
                console.warn("Cancellation threw an error", error);
                return;
            }
        }
        this.#cancelHandlers.length = 0;
        this.#reject?.(new CancelError("Request aborted"));
    }
    get isCancelled() {
        return this.#isCancelled;
    }
}
const MAIN = async () => {
    console.log("Running test");
    const p = new CancelablePromise((r) => {
        setTimeout(r, 1000, 42);
    });
    await p;
    console.log("Promise value is", await p);
};
MAIN();
