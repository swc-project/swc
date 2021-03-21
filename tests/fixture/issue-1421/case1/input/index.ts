import 'reflect-metadata';

const COL_KEY = Symbol('col');

const column = () => {
    return (object: any, key: string) => {
        Reflect.defineMetadata(COL_KEY, 'value', object, key);
    };
};

class User {
    @column() currency!: 'usd' | 'eur' | 'yen';
}