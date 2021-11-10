class C extends B {
  constructor(override public v: string)
  constructor(readonly override v: boolean)
  constructor(arg: any) {
    super()
  }
}
