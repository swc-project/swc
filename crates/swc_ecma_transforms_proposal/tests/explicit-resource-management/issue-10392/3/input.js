console.log(1);
export default class {
  static {
    console.log(2);
  }
}

class C {
  [Symbol.dispose]() {
    console.log("dispose");
  }

  static {
    console.log(3);
  }
}

console.log(4);

using _ = new C();
