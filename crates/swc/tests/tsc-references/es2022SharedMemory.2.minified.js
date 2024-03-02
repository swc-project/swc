//// [es2022SharedMemory.ts]
const sab = new SharedArrayBuffer(1024 * Int32Array.BYTES_PER_ELEMENT), int32 = new Int32Array(sab), sab64 = new SharedArrayBuffer(1024 * BigInt64Array.BYTES_PER_ELEMENT), int64 = new BigInt64Array(sab64);
Atomics.wait(int32, 0, 0);
const { async, value } = Atomics.waitAsync(int32, 0, 0), { async: async64, value: value64 } = Atomics.waitAsync(int64, 0, BigInt(0));
(async ()=>{
    async && await value, async64 && await value64;
})();
