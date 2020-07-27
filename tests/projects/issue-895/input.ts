import { queryString } from './url'

export function setup(url: string, obj: any) {
    const _queryString = queryString(obj)
    const _url = url + '?' + _queryString
    return _url
}