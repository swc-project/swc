
    let v0 = (Array, Int8Array, ...Int32Array) => (NaN + Infinity) * Int32Array.length;
    console.log(v0(1, 2, 'hello', true, 7));
  