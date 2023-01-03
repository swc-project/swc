import { Plugin, PluginBuild } from 'esbuild';

export const styleLoader = (): Plugin => {
    return {
        setup(build: PluginBuild) {
            build.onLoad(async (args) => {

            });
        },
    };
};