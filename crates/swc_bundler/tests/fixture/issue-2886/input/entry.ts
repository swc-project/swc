import { Test as Other, TestEnum } from "./q.ts";

export namespace Test {
  export enum TestEnum {
    A = 1,
  }
}

let other;
{
  enum TestEnum {
    A = 4,
  }
  other = TestEnum;
}
let otherFinal;
{
  enum TestEnum {
    A = 5,
  }
  otherFinal = TestEnum;
}

export { Other, TestEnum, other, otherFinal };
