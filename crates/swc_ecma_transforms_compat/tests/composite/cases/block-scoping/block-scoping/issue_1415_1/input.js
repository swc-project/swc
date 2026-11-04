
    export function test(items) {
        const infoMap = new WeakMap();
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            let info;
            switch (item.type) {
            case 'branch1':
                info = item.method1();
                break;
            case 'branch2':
                info = item.method2();
                break;
            case 'branch3':
                info = item.method3(
                Object.fromEntries(
                    item.subItems.map((t) => [item.alias ?? t.name, getInfo(t)])
                )
                );
                break;
            default:
                throw new Error('boom');
            }
            infoMap.set(item, info); // important
        }

        function getInfo(item) {
            if (!infoMap.has(item)) {
            throw new Error('no info yet');
            }
            return infoMap.get(item);
        }
    }
    