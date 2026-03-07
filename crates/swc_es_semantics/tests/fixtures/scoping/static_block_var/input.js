class C {
  static {
    var leak = 1;
    function local() {
      return leak;
    }
    local();
  }
}

leak;
