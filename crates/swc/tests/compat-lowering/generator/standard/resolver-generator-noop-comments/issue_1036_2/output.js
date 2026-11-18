const x = function() {
    return _ts_generator(this, function(_state) {
        return [
            2,
            Promise.all([
                [
                    1
                ],
                [
                    2
                ],
                [
                    3
                ]
            ].map(function([a]) {
                return _ts_generator(this, function(_state) {
                    Promise.resolve().then(()=>a * 2);
                    return [
                        2
                    ];
                });
            }))
        ];
    });
};
