async function fetchResource() {
    let data = [
        "John",
        ,
        25,
        "Developer",
        "California"
    ];
    await new Promise((resolve)=>setTimeout(resolve, 500));
    return data;
}
function func1() {
    return new Promise(async (resolve, reject)=>{
        let resource = await fetchResource();
        const [firstName, middleName = "N/A", age, ...rest] = resource;
        const result = function() {
            if (firstName) {
                return {
                    firstName,
                    middleName,
                    age,
                    occupation: rest[0],
                    location: rest[1]
                };
            } else {
                return {
                    error: "Failed to fetch resource"
                };
            }
        }();
        resolve(result);
    });
}
async function main() {
    const res = await func1();
    console.log(res);
}
main();
