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
}

// Incorrect
class ClsBad {
  get a() {
    return;
  }
  set a(v) {
  }
}
