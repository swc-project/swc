//// [recursiveTypeReferences1.ts]
import "@swc/helpers/_/_sliced_to_array";
import "@swc/helpers/_/_to_consumable_array";
flat([
    1,
    [
        2,
        [
            3
        ]
    ]
]), flat([
    [
        [
            0
        ]
    ]
]), flat([
    [
        [
            [
                [
                    [
                        [
                            [
                                [
                                    [
                                        [
                                            4
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]
]), flat([
    1,
    'a',
    [
        2
    ]
]), flat([
    1,
    [
        2,
        'a'
    ]
]), flat([
    1,
    [
        'a'
    ]
]), flat1([
    1,
    [
        2,
        [
            3
        ]
    ]
]), flat1([
    [
        [
            0
        ]
    ]
]), flat1([
    1,
    'a',
    [
        2
    ]
]), flat1([
    1,
    [
        2,
        'a'
    ]
]), flat1([
    1,
    [
        'a'
    ]
]), flat2([
    1,
    [
        2,
        [
            3
        ]
    ]
]), flat2([
    [
        [
            0
        ]
    ]
]), flat2([
    1,
    'a',
    [
        2
    ]
]), flat2([
    1,
    [
        2,
        'a'
    ]
]), flat2([
    1,
    [
        'a'
    ]
]), foo1(ra1), foo2(ra2);
