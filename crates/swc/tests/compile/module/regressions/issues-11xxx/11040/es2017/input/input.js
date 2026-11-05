let aa, rest;
const src = {
  get aa() {
    console.log('getter aa (deleting zz)');
    delete this.zz;
    return 1;
  },
  yy: 2,
  zz: 3
};

({ aa, ...rest } = src);
console.log('rest keys:', Object.keys(rest));