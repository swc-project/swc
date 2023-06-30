/*#__NO_SIDE_EFFECTS__*/
function fnA(args) {
    // ...
    const a = console.log('AAA')
    console.log(a)
}

const fnB = /*#__NO_SIDE_EFFECTS__*/ (args) => {
    // ...
    const b = console.log('BBB')
    console.log(b)
}

/*#__NO_SIDE_EFFECTS__*/
const fnC = (args) => {
    // ...

    const c = console.log('CCC')
    console.log(c)
}


/**
 * Some jsdocs
 *
 * @__NO_SIDE_EFFECTS__
 */
const fnD = (args) => {
    // ...
    const d = console.log('DDD')
    console.log(d)
}


fnA()
fnA()
fnA()
fnA()
fnA()
fnA()
fnA()
fnA()
fnA()
fnA()

fnB()
fnB()
fnB()
fnB()
fnB()
fnB()
fnB()
fnB()
fnB()
fnB()

fnC()
fnC()
fnC()
fnC()
fnC()
fnC()
fnC()
fnC()
fnC()
fnC()

fnD()
fnD()
fnD()
fnD()
fnD()
fnD()
fnD()
fnD()
fnD()
fnD()