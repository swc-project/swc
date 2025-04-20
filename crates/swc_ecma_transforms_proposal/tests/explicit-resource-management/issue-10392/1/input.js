export class C {
  [Symbol.dispose]() {
    console.log("dispose");
  }
}

using _ = new C();
