class A {
  private x: string;
  private m(): void {}

  private static x: string;
  private static m(): void {}
}

class NoIssueField {
  private: string;
}
class NoIssueMethod {
  private(): string {};
}
class NoIssueStaticField {
  static private: string;
}
class NoIssueStaticMethod {
  static private(): string {};
}
