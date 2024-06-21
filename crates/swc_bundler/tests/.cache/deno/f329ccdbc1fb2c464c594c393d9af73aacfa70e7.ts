// Loaded from https://deno.land/x/aleph@v0.2.28/util.ts


const symbolFor = typeof Symbol === 'function' && Symbol.for
const REACT_FORWARD_REF_TYPE = symbolFor ? Symbol.for('react.forward_ref') : 0xead0
const REACT_MEMO_TYPE = symbolFor ? Symbol.for('react.memo') : 0xead3

export const hashShort = 9
export const reHttp = /^https?:\/\//i
export const reModuleExt = /\.(js|jsx|mjs|ts|tsx)$/i
export const reStyleModuleExt = /\.(css|less)$/i
export const reMDExt = /\.(md|markdown)$/i
export const reLocaleID = /^[a-z]{2}(-[a-zA-Z0-9]+)?$/
export const reHashJs = new RegExp(`\\.[0-9a-fx]{${hashShort}}\\.js$`, 'i')

export const KB = 1024
export const MB = KB ** 2
export const GB = KB ** 3
export const TB = KB ** 4
export const PB = KB ** 5

export default {
    isNumber(a: any): a is number {
        return typeof a === 'number' && !Number.isNaN(a)
    },
    isUNumber(a: any): a is number {
        return this.isNumber(a) && a >= 0
    },
    isInt(a: any): a is number {
        return this.isNumber(a) && Number.isInteger(a)
    },
    isUInt(a: any): a is number {
        return this.isInt(a) && a >= 0
    },
    isString(a: any): a is string {
        return typeof a === 'string'
    },
    isNEString(a: any): a is string {
        return typeof a === 'string' && a.length > 0
    },
    isArray(a: any): a is Array<any> {
        return Array.isArray(a)
    },
    isNEArray(a: any): a is Array<any> {
        return Array.isArray(a) && a.length > 0
    },
    isPlainObject(a: any): a is Record<string, any> {
        return typeof a === 'object' && a !== null && !this.isArray(a) && Object.getPrototypeOf(a) == Object.prototype
    },
    isFunction(a: any): a is Function {
        return typeof a === 'function'
    },
    isLikelyReactComponent(type: any): Boolean {
        switch (typeof type) {
            case 'function':
                if (type.prototype != null) {
                    if (type.prototype.isReactComponent) {
                        return true
                    }
                    const ownNames = Object.getOwnPropertyNames(type.prototype);
                    if (ownNames.length > 1 || ownNames[0] !== 'constructor') {
                        return false
                    }
                }
                const name = type.name || type.displayName
                return typeof name === 'string' && /^[A-Z]/.test(name)
            case 'object':
                if (type != null) {
                    switch (type.$$typeof) {
                        case REACT_FORWARD_REF_TYPE:
                        case REACT_MEMO_TYPE:
                            return true
                        default:
                            return false
                    }
                }
                return false
            default:
                return false
        }
    },
    isHttpUrl(url: string) {
        try {
            const { protocol } = new URL(url)
            return protocol === 'https:' || protocol === 'http:'
        } catch (error) {
            return false
        }
    },
    trimPrefix(s: string, prefix: string): string {
        if (prefix !== '' && s.startsWith(prefix)) {
            return s.slice(prefix.length)
        }
        return s
    },
    trimSuffix(s: string, suffix: string): string {
        if (suffix !== '' && s.endsWith(suffix)) {
            return s.slice(0, -suffix.length)
        }
        return s
    },
    ensureExt(s: string, ext: string): string {
        if (s.endsWith(ext)) {
            return s
        }
        return s + ext
    },
    splitBy(s: string, searchString: string): [string, string] {
        const i = s.indexOf(searchString)
        if (i >= 0) {
            return [s.slice(0, i), s.slice(i + 1)]
        }
        return [s, '']
    },
    bytesString(bytes: number) {
        if (bytes < KB) {
            return bytes.toString() + 'B'
        }
        if (bytes < MB) {
            return Math.ceil(bytes / KB) + 'KB'
        }
        if (bytes < GB) {
            return (bytes / MB).toFixed(1).replace(/\.0$/, '') + 'MB'
        }
        if (bytes < TB) {
            return (bytes / GB).toFixed(1).replace(/\.0$/, '') + 'GB'
        }
        if (bytes < PB) {
            return (bytes / TB).toFixed(1).replace(/\.0$/, '') + 'TB'
        }
        return (bytes / PB).toFixed(1).replace(/\.0$/, '') + 'PB'
    },
    splitPath(path: string): string[] {
        return path
            .split(/[\/\\]/g)
            .map(p => p.trim())
            .filter(p => p !== '' && p !== '.')
            .reduce((path, p) => {
                if (p === '..') {
                    path.pop()
                } else {
                    path.push(p)
                }
                return path
            }, [] as Array<string>)
    },
    cleanPath(path: string): string {
        return '/' + this.splitPath(path).join('/')
    },
    debounce<T extends Function>(callback: T, delay: number): T {
        let timer: number | null = null
        return ((...args: any[]) => {
            if (timer != null) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                timer = null
                callback(...args)
            }, delay)
        }) as any
    },
    debounceX(id: string, callback: () => void, delay: number) {
        const self = this as any
        const timers: Map<string, number> = self.__debounce_timers || (self.__debounce_timers = new Map())
        if (timers.has(id)) {
            clearTimeout(timers.get(id)!)
        }
        timers.set(id, setTimeout(() => {
            timers.delete(id)
            callback()
        }, delay))
    }
}
