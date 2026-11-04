import { A } from 'mod';

const foo = <
  T extends ((A: any) => void),
  >(
    arg: T,
) => arg;

console.log(A);