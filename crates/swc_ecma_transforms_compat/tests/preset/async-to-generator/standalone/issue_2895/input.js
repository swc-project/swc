
export class Quirk {
  async doStuff() {
    const args = arguments;
    console.log(args);
    return { foo: null, ...args[0] };
  }
}
