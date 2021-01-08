import { setUrlParseFn } from './deps';

if (!setUrlParseFn) {
    throw new Error('bundle is invalid')
}