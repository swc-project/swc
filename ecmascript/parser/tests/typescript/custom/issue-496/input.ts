export class SomethingWithId {
  variant: any;

  constructor(variant: any) {
    this.variant = variant;
  }

  get id() {
    return this.variant.id;
  }
}