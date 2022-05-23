import { displayB } from '@print/b'

async function display() {
    const displayA = await import('@print/a').then(c => c.displayA)
    console.log(displayA())
    console.log(displayB())
}

display()