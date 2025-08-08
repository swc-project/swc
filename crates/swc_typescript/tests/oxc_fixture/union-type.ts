export class Foo {
  constructor(
    public one?: () => void,
    protected two?: () => void,
    private three?: () => void,
  ) {}
}
