
    var src = {};

    var counter = 0;
    
    for ({ ...src.y } of [{ x: 1, y: 2 }]) {
        expect(src.y.x).toEqual(1);
        expect(src.y.y).toEqual(2);

        counter += 1;
    }
    
    expect(counter).toEqual(1);
