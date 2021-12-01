


export function foo() {
    define(["require"], function (r) {
        console.log('foo');
        r("lodash")

        'should be removed';
        console.log('should be removed');
    })
}