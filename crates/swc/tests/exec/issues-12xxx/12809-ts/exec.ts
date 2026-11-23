const log: string[] = [];

function check() {
  const result = JSON.stringify(log);
  console.log(result);
  if (result !== '["ns 42","top 1 42"]') {
    throw new Error(`unexpected disposal log: ${result}`);
  }
}

using res = {
  [Symbol.dispose]() {
    log.push(`top ${red} ${N.v}`);
    check();
  },
};

export enum Color {
  Red = 1,
}
export const red = Color.Red;
export declare const ambient: number;

export namespace N {
  using inner = {
    [Symbol.dispose]() {
      log.push(`ns ${v}`);
    },
  };
  export const v = 42;
}
