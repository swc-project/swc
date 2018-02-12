import { WorkspaceFolder, Disposable, Event, EventEmitter } from "vscode";
import { relative } from "path";
import * as fs from "fs";

export function isDescendant(parent: string, descendant: string): boolean {

    return !relative(parent, descendant).startsWith('..')
}


export async function rename(oldPath: string, newPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (!!err) {
                return reject(err)
            }

            return resolve()
        })
    })
}

export async function exists(path: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        fs.stat(path, ((err, stats) => {
            if (!!err) {
                return resolve(false)
            }

            return resolve(true)
        }))
    })
}

export async function readFile(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (!!err) {
                return reject(err)
            }
            return resolve(data)
        });
    })
}

function decorate(
    decorator: (fn: Function, key: string) => Function,
): Function {
    return (target: any, key: string, descriptor: any) => {
        let fnKey: string | null = null;
        let fn: Function | null = null;

        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
        } else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }

        if (!fn || !fnKey) {
            throw new Error('not supported');
        }

        const decorated = decorator(fn, key);
        if (!decorated || typeof decorated !== 'function' || decorated.toString() === 'null') {
            throw new Error(`util.decorate: ${decorator} returned invalid value for input (${fn}, ${key})`)
        }
        descriptor[fnKey] = decorated;
        if (!descriptor[fnKey]) {
            throw new Error(`util.decorate: failed to set value`)
        }
    };
}

export function profile(name: string): Function {
    return decorate(function (fn: Function, key: string): Function {
        return function timeTracked(...args: any[]): any {
            const start = clock();
            let res: any = fn.apply(this, args);

            if (res instanceof Promise) {
                return res.then((result) => {
                    const ms = clock(start);
                    // console.log(`[perf] ${name}: `, ms, 'ms');
                    return result;
                })
            } else {
                const ms = clock(start);
                // console.log(`[perf] ${name}: `, ms, 'ms');
                return res
            }
        };
    });
}


export function clock(start: [number, number]): number;
export function clock(): [number, number];
export function clock(start?: [number, number] | undefined): number | [number, number] {
    if (!start) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0] * 1000) + (end[1] / 1000000));
}


export abstract class Factory<T> {
    private readonly _factory_disposable: Disposable;
    /**
     * 
     * @param deps Dependencies.
     * @param _onChange 
     */
    protected constructor(
        deps: Factory<any>[],
        private readonly _onChange: EventEmitter<WorkspaceFolder> = new EventEmitter(),
    ) {
        const disposables: Disposable[] = [];
        for (const dep of deps) {
            dep.onChange(this.notifyChange, this, disposables);
        }

        this._factory_disposable = Disposable.from(...disposables);
    }

    public get onChange(): Event<WorkspaceFolder> {
        return this._onChange.event
    }

    protected notifyChange(ws: WorkspaceFolder) {
        this._onChange.fire(ws)
    }

    public abstract get(ws: WorkspaceFolder): Promise<T>;
    public dispose(): any {
        this._factory_disposable.dispose();
        this._onChange.dispose()
    }
}

export abstract class CachingFactory<T> extends Factory<T>{
    private _cached: WeakMap<WorkspaceFolder, T>;

    protected constructor(deps: Factory<any>[], ) {
        super(deps);
        this._cached = new WeakMap()
    }


    protected notifyChange(ws: WorkspaceFolder): void {
        super.notifyChange(ws);
        this._cached.delete(ws);
    }

    async get(ws: WorkspaceFolder): Promise<T> {
        let cached = this._cached.get(ws);
        if (cached !== undefined) {
            return cached
        }
        cached = await this.get_uncached(ws);
        this._cached.set(ws, cached)
        return cached;
    }

    protected abstract get_uncached(ws: WorkspaceFolder): Promise<T>;

}