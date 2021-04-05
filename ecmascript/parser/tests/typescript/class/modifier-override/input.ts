class MyClass1 extends BaseClass {
  override show() {}
  override public show() {}
  public override show() {}
  override size = 5;
  override readonly size = 5;
  readonly override size = 5;
  readonly abstract override size = 5;
  readonly override abstract size = 5;
  abstract override readonly size = 5;
  abstract readonly override size = 5;
  private abstract readonly override size = 5;
}
