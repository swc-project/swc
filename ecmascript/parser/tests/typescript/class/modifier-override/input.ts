class MyClass1 extends BaseClass {
  override() {}
  override show() {}
  public override show() {}
  override size = 5;
  override readonly size = 5;
  override readonly abstract size = 5;
  abstract override readonly size = 5;
  private abstract override readonly size = 5;
}
