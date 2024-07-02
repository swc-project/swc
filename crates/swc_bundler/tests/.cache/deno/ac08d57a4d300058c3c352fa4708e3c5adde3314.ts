// Loaded from https://deno.land/x/aleph@v0.2.28/context.ts


import { createContext } from 'https://esm.sh/react'
import type { RouterURL } from './types.ts'

export const RouterContext = createContext<RouterURL>({
    locale: 'en',
    pagePath: '/',
    pathname: '/',
    params: {},
    query: new URLSearchParams(),
})
RouterContext.displayName = 'RouterContext'

interface RendererCache {
    headElements: Map<string, { type: string, props: Record<string, any> }>
    scriptsElements: Map<string, { type: string, props: Record<string, any> }>
}

export const RendererContext = createContext<{ cache: RendererCache }>({
    cache: {
        headElements: new Map(),
        scriptsElements: new Map()
    }
})
