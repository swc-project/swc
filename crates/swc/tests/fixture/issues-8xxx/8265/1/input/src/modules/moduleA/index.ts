import { moduleB } from "@modules/moduleB";

export const moduleA = () => {
  console.log("This is module A");
  moduleB();
};
