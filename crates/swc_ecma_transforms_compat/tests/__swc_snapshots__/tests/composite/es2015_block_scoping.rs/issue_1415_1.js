export function test(items) {
    var _loop = function(i) {
        var item = items[i];
        var info = void 0;
        switch(item.type){
            case 'branch1':
                info = item.method1();
                break;
            case 'branch2':
                info = item.method2();
                break;
            case 'branch3':
                info = item.method3(Object.fromEntries(item.subItems.map((t)=>[
                        item.alias ?? t.name,
                        getInfo(t)
                    ])));
                break;
            default:
                throw new Error('boom');
        }
        infoMap.set(item, info); // important
    };
    var infoMap = new WeakMap();
    for(var i = 0; i < items.length; i += 1)_loop(i);
    function getInfo(item) {
        if (!infoMap.has(item)) {
            throw new Error('no info yet');
        }
        return infoMap.get(item);
    }
}
