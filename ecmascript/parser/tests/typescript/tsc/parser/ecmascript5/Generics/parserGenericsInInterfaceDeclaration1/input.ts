interface I<T> {
   v: A<T>;
   f1<T>(): T;
   f2?<T>(): T;
   <T>(): void;
   new <T>(): void;
}