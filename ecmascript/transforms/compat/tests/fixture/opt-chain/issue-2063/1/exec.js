const myVar = {
    target: {
        value: "ABC"
    }
}

expect(myVar.target.value.toLowerCase?.()).toEqual("abc")