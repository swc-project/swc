function computed() {
    return function (target) {
        console.log(target)
    }
}

class User {
    @computed()
    get fullName() {
        return 'foo'
    }
}