import { join } from 'path'

/// use this code instead of above code, this works as expected
///  import * as path from 'path' 
/// use path.join in the below code

export async function getPackage() {
    const pkg = await import(join(process.cwd(), 'package.json'))
    return (pkg.default || pkg)
}

(async function () {
    const pkg = await getPackage()

    console.log(pkg)
})()