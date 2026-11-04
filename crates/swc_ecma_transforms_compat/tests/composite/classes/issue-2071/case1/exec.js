const sleep = (ms) =>
    new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    });

class Project {
    constructor(name) {
        this.name = name;
    }
}

Project.f = async function () {
    await sleep(100);
    console.log(this["a"]);
    return new this("a");
};

Project.f().then((project) => {
    console.log(project.name);
});
