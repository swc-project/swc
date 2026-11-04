
class Scope {
  static units(defs) {
    return defs;
  }

  static module = ((...defs) => this.units(defs));
  instance = ((...defs) => this.units(defs));

  units(defs) {
    return defs;
  }
}
