async function main() {
    const addFunction = (await import('@/utils/add')).default // This doesn't work

    console.log('2 + 3 =', addFunction(2, 3))
}