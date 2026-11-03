class A extends B {
            foo = 'foo'
            b = this.a;

            declare1
            declare2!: string

            constructor(private readonly a: string, readonly c, private d: number = 1) {
                super()
                this.foo.subscribe()
            }
          }
