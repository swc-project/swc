import { OnResolveArgs, PartialMessage, Plugin, PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

export const styleLoader = (): Plugin => {
    return {
        name: 'style-loader',
        setup(build: PluginBuild) {
            build.onLoad({ filter: /.*/, namespace: 'less' }, async (args) => {

            });
        },
    };
};