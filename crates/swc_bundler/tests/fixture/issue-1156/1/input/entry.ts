import { d, D } from "./q.ts";

class A {
  private s: D = d();

  a() {
    this.s.resolve();
  }

  b() {
    this.s = d();
  }
}

new A();