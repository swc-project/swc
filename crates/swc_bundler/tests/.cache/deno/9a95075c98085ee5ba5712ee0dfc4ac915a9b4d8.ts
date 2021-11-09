// Loaded from https://deno.land/x/dndb@0.2.4/src/mod.ts


import { resolve } from 'https://deno.land/std/path/mod.ts';
import { _find, _insert, _findOne, _update, _updateOne, _remove, _removeOne } from './methods/mod.js';
import { init } from './storage.ts';
import DataStoreOptions from './types/ds.options.ts'

class Datastore{
    public filename: string;
    constructor({ filename, autoload, timeStamp, onLoad = () => {} }: DataStoreOptions) {
        this.filename = filename ? resolve(Deno.cwd(), filename) : resolve(Deno.cwd(), "./database.json");
        if (autoload) this.loadDatabase().then(() => {
            onLoad()
        })        
    };

    /*
    * Loads the database on first load and ensures that path exists.
    *
    */
    async loadDatabase () {
        return init(this.filename)
    }

    // Find a document

    async find (query: {any: any}, projection: any = {}, cb: (x: any) => any) {
        if (cb && typeof cb == 'function') return cb(await _find(this.filename, query, projection));
        return _find(this.filename, query, projection)
    }

    // Find first matching document

    async findOne(query: {any: any}, projection: any = {}, cb: (x: any) => any) {
        projection = projection || {};
        if (cb && typeof cb == 'function') return cb(await _findOne(this.filename, query, projection));
        return _findOne(this.filename, query, projection)
    }

    // Inserts a document

    async insert (data: any, cb: (x: any) => any) {
        if (cb && typeof cb == 'function') await _insert(this.filename, data)
        return _insert(this.filename, data)
    }

    // Updates matching documents

    async update (query: {any: any}, operators: any, projection: any = {}, cb: (x: any) => any) {
        if (cb && typeof cb == "function") return cb(await _update(this.filename, query, operators));
        return _update(this.filename, query, operators)
    }

    async updateOne (query: {any: any}, operators: any, projection: any = {}, cb: (x: any) => any) {
        if (cb && typeof cb == "function") return cb(await _updateOne(this.filename, query, operators));
        return _updateOne(this.filename, query, operators)
    }

    // Removes matching document

    async remove(query: any, cb: (x: any) => any) {
        if (cb && typeof cb == "function") return cb(await _remove(this.filename, query));
        return _remove(this.filename, query)
    }

    async removeOne(query: any, cb: (x: any) => any) {
        if (cb && typeof cb == "function") return cb(await _removeOne(this.filename, query));
        return _removeOne(this.filename, query)
    }

} 

export { Datastore }

