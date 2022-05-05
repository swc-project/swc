import "reflect-metadata";

const Test = (target) => {
    const metadata = Reflect.getMetadataKeys(target).reduce((metadata, key) => {
        const { [key]: values = [] } = metadata;

        const all = Reflect.getMetadata(key, target);
        const own = Reflect.getOwnMetadata(key, target);

        return {
            ...metadata,
            [key]: [{ all, own }, ...values],
        };
    }, {});

    console.dir(metadata, { depth: 5 });
};

export class Foo {}
