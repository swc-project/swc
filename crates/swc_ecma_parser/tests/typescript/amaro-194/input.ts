class Wrapper<Fn extends (...args: any[]) => any> {
  #inner: Fn;

  constructor(inner: Fn) {
    this.#inner = inner;
  }

  wrap(x: unknown): ReturnType<Fn> {
    return this.#inner(x);
  }
}

async function main(): Promise<void> {
  // The error happens here:
  const promiseWrapper = new Wrapper<<T>(x: T) => Promise<T>>(Promise.resolve.bind(Promise));
  
  const strPromise: Promise<string> = promiseWrapper.wrap("Hello, World!") as any;
  const str = await strPromise;
  console.log(str);
}

main();
