// Correct
class Cls {
  get a() {
    return 1;
  }
  set a() {
    return;
  }

  get b(): string {
  }
  set b(v) {
  }

  private get c() {}
  private set c() {}

  accessor d: string;
  private accessor e: string;
  private static accessor f: string;
}

// Incorrect
class ClsBad {
  get a() {
    return;
  }
  set a(v) {
  }
}


/// Infer type from the function body of the getter
class GlobalSymbol1 {
  set [Symbol.toStringTag](v) {
  }
  get [Symbol.toStringTag]() {
    return "string";
  }
}

// Infer type from the parameter type of the setter
class GlobalSymbol2 {
  set [Symbol.toStringTag](v: number) {
  }
  get [Symbol.toStringTag]() {
    return GlobalSymbol2
  }
}

// Infer type from the parameter type of the setter
class GlobalSymbol3 {
  set [Symbol.toStringTag](v: number) {
  }
  get [Symbol.toStringTag](): string {
    return "string";
  }
}

// Cannot infer type from the function body of the getter
class GlobalSymbol4 {
  set [Symbol.toStringTag](v) {
  }
  get [Symbol.toStringTag]() {
    return GlobalSymbol4;
  }
}


