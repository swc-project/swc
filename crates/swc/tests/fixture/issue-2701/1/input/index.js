const x = {
    // i am some comment1
    async hello() {
      console.log("Hello")
    },
    // i am some comment2
    async "hello"(){
      console.log("Hello")
    },
    // i am some comment3
    async 1(){
      console.log("Hello")
    },
    // i am some comment4
    async [Date.now()](){
      console.log("Hello")
    },
    // i am some comment5
    async 1n() {
      console.log("Hello")
    }
};