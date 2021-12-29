import { cac } from 'https://unpkg.com/cac/mod.ts';

const cli = cac();
cli.option('--type ', 'Choose a project type', {
    default: 'node',
});

const parsed = cli.parse();

console.log(parsed.options.type);
console.log(parsed.args);