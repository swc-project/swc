

 // before
import { bind } from 'some';

class A {
  @bind
  public get foo() {
    return 1;
  }

  @bind
  public bar() {
    return 1;
  }
}
