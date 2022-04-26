import * as swcHelpers from "@swc/helpers";
function scanUser(groups) {
    return _scanUser.apply(this, arguments);
}
function _scanUser() {
    _scanUser = swcHelpers.asyncToGenerator(function*(groups) {
        yield Promise.all(groups.map(function() {
            var _ref = swcHelpers.asyncToGenerator(function*({ users  }) {
                for (const user of users){
                    console.log('user', user);
                    yield new Promise((resolve)=>setTimeout(resolve, 30)
                    );
                }
            });
            return function(_) {
                return _ref.apply(this, arguments);
            };
        }()));
    });
    return _scanUser.apply(this, arguments);
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
    }, 
]);
