
import { displayB } from './inner/b'
import { displayC } from '@print/c'
import { merge } from 'lodash'

async function display() {
    const displayA = await import('./inner/a').then(c => c.displayA)
    console.log(displayA())
    console.log(displayB())
    console.log(displayC())
    const foo = merge({}, { a: 22 })
}

display()