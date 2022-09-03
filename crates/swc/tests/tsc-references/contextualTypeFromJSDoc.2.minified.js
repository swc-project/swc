//// [index.js]
const arr = [
    [
        'a',
        {
            x: 1
        }
    ],
    [
        'b',
        {
            y: 2
        }
    ]
];
function f() {
    return [
        [
            'a',
            {
                x: 1
            }
        ],
        [
            'b',
            {
                y: 2
            }
        ]
    ];
}
class C {
    set x(value) {}
    get x() {
        return [
            [
                'a',
                {
                    x: 1
                }
            ],
            [
                'b',
                {
                    y: 2
                }
            ]
        ];
    }
}
