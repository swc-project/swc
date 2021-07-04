// Copied from https://github.com/Brooooooklyn/swc-node/blob/master/bench/index.ts


import fs from 'fs'
import os from 'os'
import path from 'path'

import * as swc from '../../';
import * as babel from '@babel/parser'
import Benchmark, { Suite } from 'benchmark'


const cpuCount = os.cpus().length - 1

const SOURCE_PATH = path.join(__dirname, '../../node_modules/rxjs/internal/Observable.js')
const SOURCE_CODE = fs.readFileSync(SOURCE_PATH, 'utf-8')

export async function run() {
    const asyncSuite = new Suite(`Async parser benchmark`)
    const parallelSuite = new Suite(`Parallel parser benchmark`)


    console.log(`Running single thread benchmarks`);
    await runSync();

    console.log(`Running async benchmarks`);
    await runAsync(1, asyncSuite, 'async');

    console.log(`Running parallel benchmarks`);
    await runAsync(cpuCount, parallelSuite, 'parallel');
}


async function runSync() {
    let defer: () => void
    const task = new Promise<void>((resolve) => {
        defer = resolve
    })


    const suite = new Suite(`Synchronous parser benchmark`)

    suite
        .add(`swc`, () => {
            return swc.babelifySync(SOURCE_PATH, SOURCE_CODE, {
                syntax: 'ecmascript'
            });
        });


    suite
        .add(`babel (preset-env)`, () => {
            babel.parse(SOURCE_CODE, {
            })
        })
        .on('cycle', function (event: Benchmark.Event) {
            console.info(String(event.target))
        })
        .on('complete', async function (this: Benchmark.Target & Benchmark.Suite) {
            console.info(
                `${this.name} bench suite: Fastest is ${this.filter('fastest').map((s: Benchmark.Target) => s.name).toString()
                }`,
            )
            defer()
        })
        .run();

    await task;
}

async function runAsync(parallel: number, suite: Suite, name: string) {
    let defer: () => void
    const task = new Promise<void>((resolve) => {
        defer = resolve
    })
    suite
        .add({
            name: `swc`,
            fn: (deferred: any) => {
                Promise.all(
                    Array.from({ length: parallel }).map(() => {
                        return swc.babelify(SOURCE_PATH, SOURCE_CODE, {
                            syntax: 'ecmascript'
                        })
                    }),
                )
                    .then(() => {
                        deferred.resolve()
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            },
            defer: true,
            async: true,
            queued: true,
        });


    suite
        .on('cycle', function (event: Benchmark.Event) {
            event.target.hz = event.target!.hz! * parallel
            console.info(String(event.target))
        })
        .on('complete', async function (this: Benchmark.Target & Benchmark.Suite) {
            console.info(
                `${this.name} bench suite: Fastest is ${this.filter('fastest').map((t: Benchmark.Target) => t.name).toString()
                }`,
            )
            defer()
        });

    suite.run()

    await task
}

run()