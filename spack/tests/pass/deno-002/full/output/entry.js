// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/* Resolves after the given number of milliseconds. */ export function delay(ms) {
    return new Promise((res)=>setTimeout(()=>{
            res();
        }, ms)
    );
}
function deferred1() {
    let methods;
    const promise = new Promise((resolve, reject)=>{
    });
    return Object.assign(promise, methods);
}
var tmp = Symbol.asyncIterator;
/** The MuxAsyncIterator class multiplexes multiple async iterators into a
 * single stream. It currently makes an assumption:
 * - The final result (the value returned and not yielded from the iterator)
 *   does not matter; if there is any, it is discarded.
 */ export class MuxAsyncIterator {
    add(iterator) {
        ++this.iteratorCount;
        this.callIteratorNext(iterator);
    }
    async callIteratorNext(iterator) {
        try {
            const { value , done  } = await iterator.next();
            if (done) --this.iteratorCount;
            else this.yields.push({
                iterator,
                value
            });
        } catch (e) {
            this.throws.push(e);
        }
        this.signal.resolve();
    }
    async *iterate() {
        while(this.iteratorCount > 0){
            // Sleep until any of the wrapped iterators yields.
            await this.signal;
            // Note that while we're looping over `yields`, new items may be added.
            for(let i = 0; i < this.yields.length; i++){
                const { iterator , value  } = this.yields[i];
                yield value;
                this.callIteratorNext(iterator);
            }
            if (this.throws.length) {
                for (const e of this.throws)throw e;
                this.throws.length = 0;
            }
            // Clear the `yields` list and reset the `signal` promise.
            this.yields.length = 0;
            this.signal = deferred1();
        }
    }
    [tmp]() {
        return this.iterate();
    }
    constructor(){
        this.iteratorCount = 0;
        this.yields = [];
        this.throws = [];
        this.signal = deferred1();
    }
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/**
 * pooledMap transforms values from an (async) iterable into another async
 * iterable. The transforms are done concurrently, with a max concurrency
 * defined by the poolLimit.
 * 
 * @param poolLimit The maximum count of items being processed concurrently. 
 * @param array The input array for mapping.
 * @param iteratorFn The function to call for every item of the array.
 */ export function pooledMap(poolLimit, array, iteratorFn) {
    // Create the async iterable that is returned from this function.
    const res = new TransformStream({
        async transform (p, controller) {
            controller.enqueue(await p);
        }
    });
    // Start processing items from the iterator
    (async ()=>{
        const writer = res.writable.getWriter();
        const executing = [];
        for await (const item of array){
            const p = Promise.resolve().then(()=>iteratorFn(item)
            );
            writer.write(p);
            const e = p.then(()=>executing.splice(executing.indexOf(e), 1)
            );
            executing.push(e);
            if (executing.length >= poolLimit) await Promise.race(executing);
        }
        // Wait until all ongoing events have processed, then close the writer.
        await Promise.all(executing);
        writer.close();
    })();
    return res.readable.getIterator();
}
export { deferred1 as deferred };
