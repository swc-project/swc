// Loaded from https://deno.land/x/aleph@v0.2.28/head.ts


import React, { Children, createElement, isValidElement, PropsWithChildren, ReactElement, ReactNode, useContext, useEffect } from 'https://esm.sh/react'
import { RendererContext } from './context.ts'
import util from './util.ts'

export const serverStyles: Map<string, { css: string, asLink: boolean }> = new Map()

export default function Head(props: PropsWithChildren<{}>) {
    const renderer = useContext(RendererContext)

    if (window.Deno) {
        parse(props.children).forEach(({ type, props }, key) => renderer.cache.headElements.set(key, { type, props }))
    }

    useEffect(() => {
        const doc = (window as any).document
        const nodes = parse(props.children)
        const insertedEls: Array<Object> = []

        if (nodes.size > 0) {
            let charset = doc.querySelector('meta[charset]')
            if (!charset) {
                charset = doc.createElement('meta')
                charset.setAttribute('charset', 'utf-8')
                doc.head.prepend(charset)
            }

            const anchor = doc.createElement('meta')
            if (charset.nextElementSibling) {
                doc.head.insertBefore(anchor, charset.nextElementSibling)
            } else {
                doc.head.appendChild(anchor)
            }

            nodes.forEach(({ type, props }) => {
                if (type === 'script') {
                    return
                }
                const el = doc.createElement(type)
                Object.keys(props).forEach(key => {
                    const value = props[key]
                    if (key === 'children') {
                        if (util.isNEString(value)) {
                            el.innerText = value
                        } else if (util.isNEArray(value)) {
                            el.innerText = value.join('')
                        }
                    } else {
                        el.setAttribute(key, String(value || ''))
                    }
                })
                doc.head.insertBefore(el, anchor)
                insertedEls.push(el)
            })
            doc.head.removeChild(anchor)
        }

        return () => {
            insertedEls.forEach(el => doc.head.removeChild(el))
        }
    }, [props.children])

    return null
}

export function Scripts(props: PropsWithChildren<{}>) {
    const renderer = useContext(RendererContext)

    if (window.Deno) {
        parse(props.children).forEach(({ type, props }, key) => {
            if (type === 'script') {
                renderer.cache.scriptsElements.set(key, { type, props })
            }
        })
    }

    // todo: insert page scripts in browser

    return null
}

interface SEOProps {
    title?: string
    description?: string
    keywords?: string | string[]
    url?: string
    image?: string
    twitter?: {
        card?: 'summary' | 'summary_large_image' | 'app' | 'player'
        site?: string
        creator?: string
    }
}

export function SEO(props: SEOProps) {
    const { title, description, keywords, url, image, twitter } = props
    return createElement(
        Head,
        undefined,
        title && createElement('title', undefined, title),
        description && createElement('meta', { name: 'description', content: description }),
        keywords && createElement('meta', { name: 'keywords', content: util.isArray(keywords) ? keywords.join(',') : keywords }),
        title && createElement('meta', { name: 'og:title', content: title }),
        description && createElement('meta', { name: 'og:description', content: description }),
        title && createElement('meta', { name: 'twitter:title', content: title }),
        description && createElement('meta', { name: 'twitter:description', content: description }),
        url && createElement('meta', { name: 'og:url', content: url }),
        image && createElement('meta', { name: 'og:image', content: image }),
        image && createElement('meta', { name: 'twitter:image', content: image }),
        image && createElement('meta', { name: 'twitter:card', content: twitter?.card || 'summary_large_image' }),
        twitter?.site && createElement('meta', { name: 'twitter:site', content: twitter.site }),
        twitter?.creator && createElement('meta', { name: 'twitter:creator', content: twitter.creator }),
    )
}

interface ViewportProps {
    width?: number | 'device-width'
    height?: number | 'device-height'
    initialScale?: number
    minimumScale?: number
    maximumScale?: number
    userScalable?: 'yes' | 'no'
    targetDensitydpi?: number | 'device-dpi' | 'low-dpi' | 'medium-dpi' | 'high-dpi'
}

export function Viewport(props: ViewportProps) {
    const content = Object.entries(props)
        .map(([key, value]) => {
            key = key.replace(/[A-Z]/g, c => '-' + c.toLowerCase())
            return `${key}=${value}`
        })
        .join(',')
    return createElement(
        Head,
        undefined,
        content && createElement('meta', { name: 'viewport', content })
    )
}

export function applyCSS(id: string, css: string, asLink: boolean = false) {
    if (window.Deno) {
        serverStyles.set(id, { css, asLink })
    } else {
        const { document } = (window as any)
        const styleEl = document.createElement(asLink ? 'link' : 'style')
        const prevStyleEls = Array.from(document.head.children).filter((el: any) => el.getAttribute('data-module-id') === id)
        if (asLink) {
            styleEl.rel = 'stylesheet'
            styleEl.href = css
        } else {
            styleEl.type = 'text/css'
            styleEl.appendChild(document.createTextNode(css))
        }
        styleEl.setAttribute('data-module-id', id)
        document.head.appendChild(styleEl)
        if (prevStyleEls.length > 0) {
            if (asLink) {
                styleEl.addEventListener('load', () => {
                    prevStyleEls.forEach(el => document.head.removeChild(el))
                })
            } else {
                setTimeout(() => {
                    prevStyleEls.forEach(el => document.head.removeChild(el))
                }, 0)
            }
        }
    }
}

function parse(node: ReactNode, els: Map<string, { type: string, props: Record<string, any> }> = new Map()) {
    Children.forEach(node, child => {
        if (!isValidElement(child)) {
            return
        }

        const { type, props } = child
        switch (type) {
            case React.Fragment:
                parse(props.children, els)
                break
            case SEO:
            case Viewport:
                parse((type(props) as ReactElement).props.children, els)
                break
            case 'base':
            case 'title':
            case 'meta':
            case 'link':
            case 'style':
            case 'script':
            case 'no-script':
                {
                    let key = type
                    if (type === 'meta') {
                        const propKeys = Object.keys(props).map(k => k.toLowerCase())
                        if (propKeys.includes('charset')) {
                            return // ignore charset, always use utf-8
                        }
                        if (propKeys.includes('name')) {
                            key += `[name=${JSON.stringify(props['name'])}]`
                        } else if (propKeys.includes('property')) {
                            key += `[property=${JSON.stringify(props['property'])}]`
                        } else if (propKeys.includes('http-equiv')) {
                            key += `[http-equiv=${JSON.stringify(props['http-equiv'])}]`
                        } else {
                            key += Object.keys(props).filter(k => !(/^content|children$/i.test(k))).map(k => `[${k.toLowerCase()}=${JSON.stringify(props[k])}]`).join('')
                        }
                    } else if (type !== 'title') {
                        key += '-' + (els.size + 1)
                    }
                    // remove the children prop of base/meta/link
                    if (['base', 'meta', 'link'].includes(type) && 'children' in props) {
                        const { children, ...rest } = props
                        els.set(key, { type, props: rest })
                    } else {
                        els.set(key, { type, props })
                    }
                }
                break
        }
    })

    return els
}

