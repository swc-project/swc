class C extends B {
  constructor(override: Date)
  constructor(override v: number)
  constructor(public override v: string)
  constructor(override readonly v: boolean)
  constructor(arg: any) {
    super()
  }
}