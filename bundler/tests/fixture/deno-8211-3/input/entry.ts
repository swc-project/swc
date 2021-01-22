import { luxon } from './deps.ts';

const date = new Date();
const dt = luxon.DateTime.fromJSDate(date);
console.log(dt.toISO());