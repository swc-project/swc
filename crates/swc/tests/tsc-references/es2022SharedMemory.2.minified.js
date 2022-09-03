//// [es2022SharedMemory.ts]
const sab = new SharedArrayBuffer(1024 * Int32Array.BYTES_PER_ELEMENT), int32 = new Int32Array(sab), waitValue = Atomics.wait(int32, 0, 0), { async , value  } = Atomics.waitAsync(int32, 0, BigInt(0)), main = async ()=>{
    async && await value;
};
main();
