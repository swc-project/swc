const sleep = (ms) =>
    new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    });

class Project {
    constructor(name) {
        this.name = name;
    }
    static async g() {
        await sleep(100);
        console.log(this["a"]);
        return new this("a");
    }
}

Project.g().then((project) => {
    console.log(project.name);
});
