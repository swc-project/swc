import swc from '..'
try {
    swc.minifySync('\u001a\u0000', {
        mangle: true,
        module: true
    })
} finally {
    console.log('this should be printed no matter what, but is not')
}