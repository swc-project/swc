// some complex cases of assignment compat of generic signatures.

interface I2<T> {
    p: T
}

var x: <T extends I2<T>>(z: T) => void
var y: <T extends I2<I2<T>>>(z: T) => void

// These both do not make sense as we would eventually be comparing I2<T> to I2<I2<T>>, and they are self referencing anyway
x = y 
y = x 
