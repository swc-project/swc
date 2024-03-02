const decorate = (target: unknown, context: DecoratorContext) => {
  console.log("decorated");
};

export class Color {
  constructor(hex: string);
  constructor(r: number, g: number, b: number, a?: number);
  constructor(r: string | number, g?: number, b?: number, a = 1) {}

  @decorate get rgba() {
    return [0, 0, 0, 1];
  }
}
