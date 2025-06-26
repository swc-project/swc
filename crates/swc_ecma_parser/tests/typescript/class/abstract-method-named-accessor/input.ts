abstract class AbstractTest<T, V = unknown> {
    abstract id: string;
    abstract header: string;

    abstract accessor(data: T): V;
  
    printId() {
      return this.id;
    }
}