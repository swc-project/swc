import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function scanUser(groups) {
    return _async_to_generator(function*() {
        yield Promise.all(groups.map(({ users })=>_async_to_generator(function*() {
                for (const user of users){
                    console.log("user", user);
                    yield new Promise((resolve)=>setTimeout(resolve, 30));
                }
            })()));
    })();
}
scanUser([
    {
        users: [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        users: [
            11,
            12,
            13,
            14,
            15
        ]
    }
]);
