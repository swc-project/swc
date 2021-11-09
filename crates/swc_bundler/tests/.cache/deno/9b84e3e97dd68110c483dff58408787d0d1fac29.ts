// Loaded from https://deno.land/x/tinyhttp@0.1.18/app.ts


// deno-lint-ignore-file
import { Router, serve, Server, rg, pushMiddleware } from './deps.ts'
import { NextFunction, RHandler as Handler, Middleware, UseMethodParams } from './types.ts'
import { onErrorHandler, ErrorHandler } from './onError.ts'
import { setImmediate } from 'https://deno.land/std@0.101.0/node/timers.ts'
import type { Request } from './request.ts'
import type { Response } from './response.ts'
import { getURLParams, getPathname } from './utils/parseUrl.ts'
import { extendMiddleware } from './extend.ts'
import * as path from 'https://deno.land/std@0.101.0/path/mod.ts'

const lead = (x: string) => (x.charCodeAt(0) === 47 ? x : '/' + x)

const mount = (fn: any) => (fn instanceof App ? fn.attach : fn)

declare global {
  namespace tinyhttp {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    interface Request {}
    interface Response {}
    interface Application {}
  }
}

export const renderTemplate =
  <O = any, Res extends Response = Response>(res: Res, app: App) =>
  (file: string, data?: Record<string, any>, options?: TemplateEngineOptions<O>): Response => {
    app.render(
      file,
      data,
      (err: unknown, html: unknown) => {
        if (err) throw err

        res.send(html)
      },
      options
    )

    return res
  }

/**
 * Execute handler with passed `req` and `res`. Catches errors and resolves async handlers.
 * @param h
 */
export const applyHandler =
  <Req, Res>(h: Handler<Req, Res>) =>
  async (req: Req, res: Res, next: NextFunction) => {
    try {
      if (h.constructor.name === 'AsyncFunction') {
        await h(req, res, next)
      } else h(req, res, next)
    } catch (e) {
      next(e)
    }
  }

/**
 * tinyhttp App has a few settings for toggling features
 */
export type AppSettings = Partial<
  Record<'networkExtensions' | 'bindAppToReqRes' | 'enableReqRoute', boolean> &
    Record<'subdomainOffset', number> &
    Record<'xPoweredBy', string | boolean>
>
/**
 * Function that processes the template
 */
export type TemplateFunc<O> = (
  path: string,
  locals: Record<string, any>,
  opts: TemplateEngineOptions<O>,
  cb: (err: Error | null, html: unknown) => void
) => void

export type TemplateEngineOptions<O = any> = Partial<{
  cache: boolean
  ext: string
  renderOptions: Partial<O>
  viewsFolder: string
  _locals: Record<string, any>
}>

export const getRouteFromApp = ({ middleware }: App, h: Handler) =>
  middleware.find(({ handler }) => typeof handler === 'function' && handler.name === h.name)

export type AppConstructor<Req, Res> = Partial<{
  noMatchHandler: Handler<Req>
  onError: ErrorHandler
  settings: AppSettings
  applyExtensions: (req: Req, res: Res, next: NextFunction) => void
}>

/**
 * `App` class - the starting point of tinyhttp app.
 *
 * With the `App` you can:
 * * use routing methods and `.use(...)`
 * * set no match (404) and error (500) handlers
 * * configure template engines
 * * store data in locals
 * * listen the http server on a specified port
 *
 * In case you use TypeScript, you can pass custom Request and Response interfaces as generic parameters.
 *
 * Example:
 *
 * ```ts
 * interface CoolReq extends Request {
 *  genericsAreDope: boolean
 * }
 *
 * const app = App<any, CoolReq, Response>()
 * ```
 */
export class App<
    RenderOptions = any,
    Req extends Request = Request,
    Res extends Response<RenderOptions> = Response<RenderOptions>
  >
  extends Router<App, Req, Res>
  implements tinyhttp.Application
{
  middleware: Middleware<Req>[] = []
  locals: Record<string, string> = {}
  noMatchHandler: Handler
  onError: ErrorHandler
  settings: AppSettings & Record<string, any>
  engines: Record<string, TemplateFunc<RenderOptions>> = {}
  applyExtensions?: (req: Req, res: Res, next: NextFunction) => void
  attach: (req: Req) => void

  mountpath = '/'

  apps: Record<string, App> = {}

  constructor(options: AppConstructor<Req, Res> = {}) {
    super()
    this.onError = options?.onError || onErrorHandler
    this.noMatchHandler = options?.noMatchHandler || this.onError.bind(null, { code: 404 })
    this.settings = options.settings || { xPoweredBy: true }
    this.applyExtensions = options?.applyExtensions
    this.attach = (req) => setImmediate(this.handler.bind(this, req, undefined), req)
    // this.#eventHandler = options.eventHandler
  }

  set(setting: string, value: any) {
    this.settings[setting] = value
    return this
  }

  enable(setting: string) {
    this.settings[setting] = true
    return this
  }

  disable(setting: string) {
    this.settings[setting] = false
    return this
  }

  /**
   * Register a template engine with extension
   */
  engine(ext: string, fn: TemplateFunc<RenderOptions>) {
    this.engines[ext] = fn

    return this
  }

  /**
   * Render a template
   * @param file What to render
   * @param data data that is passed to a template
   * @param options Template engine options
   * @param cb Callback that consumes error and html
   */
  render(
    file: string,
    data: Record<string, any> = {},
    cb: (err: unknown, html: unknown) => void,
    options: TemplateEngineOptions<RenderOptions> = {}
  ) {
    options.viewsFolder = options.viewsFolder || `${Deno.cwd()}/views`
    options.ext = options.ext || file.slice(file.lastIndexOf('.') + 1) || 'ejs'

    options._locals = options._locals || {}

    let locals = { ...data, ...this.locals }

    if (options._locals) locals = { ...locals, ...options._locals }

    if (!file.endsWith(`.${options.ext}`)) file = `${file}.${options.ext}`

    const dest = options.viewsFolder ? path.join(options.viewsFolder, file) : file

    this.engines[options.ext](dest, locals, options.renderOptions || {}, cb)

    return this
  }

  route(path: string): App {
    const app = new App()

    this.use(path, app)

    return app
  }

  use(...args: UseMethodParams<Req, Res, App>) {
    const base = args[0]

    const fns = args.slice(1).flat()

    if (base instanceof App) {
      // Set App parent to current App
      // @ts-ignore
      base.parent = this

      // Mount on root
      base.mountpath = '/'

      this.apps['/'] = base
    }

    const path = typeof base === 'string' ? base : '/'

    let regex: any

    for (const fn of fns) {
      if (fn instanceof App) {
        regex = rg(path, true)

        fn.mountpath = path

        this.apps[path] = fn

        // @ts-ignore
        fn.parent = this
      }
    }

    if (base === '/') {
      for (const fn of fns) super.use(base, mount(fn as Handler))
    } else if (typeof base === 'function' || base instanceof App) {
      super.use('/', [base, ...fns].map(mount))
    } else if (Array.isArray(base)) {
      super.use('/', [...base, ...fns].map(mount))
    } else {
      const handlerPaths = []
      const handlerFunctions = []
      for (const fn of fns) {
        if (fn instanceof App && fn.middleware?.length) {
          for (const mw of fn.middleware) {
            handlerPaths.push(lead(base as string) + lead(mw.path!))
            handlerFunctions.push(fn)
          }
        } else {
          handlerPaths.push('')
          handlerFunctions.push(fn)
        }
      }
      pushMiddleware(this.middleware)({
        path: base as string,
        regex,
        type: 'mw',
        handler: mount(handlerFunctions[0] as Handler),
        handlers: handlerFunctions.slice(1).map(mount),
        fullPaths: handlerPaths
      })
    }

    return this // chainable
  }
  find(url: string) {
    return this.middleware.filter((m) => {
      m.regex = m.regex || (rg(m.path, m.type === 'mw') as { keys: string[]; pattern: RegExp })

      let fullPathRegex: { keys: string[] | boolean; pattern: RegExp } | null

      m.fullPath && typeof m.fullPath === 'string'
        ? (fullPathRegex = rg(m.fullPath, m.type === 'mw'))
        : (fullPathRegex = null)

      return (
        m.regex.pattern.test(url) && (m.type === 'mw' && fullPathRegex?.keys ? fullPathRegex.pattern.test(url) : true)
      )
    })
  }
  /**
   * Extends Req / Res objects, pushes 404 and 500 handlers, dispatches middleware
   * @param req Req object
   */
  handler(req: Req, next?: NextFunction) {
    let res = {
      headers: new Headers({})
    }
    /* Set X-Powered-By header */
    const { xPoweredBy } = this.settings
    if (xPoweredBy) res.headers.set('X-Powered-By', typeof xPoweredBy === 'string' ? xPoweredBy : 'tinyhttp')

    const exts = this.applyExtensions || extendMiddleware<RenderOptions>(this as any)

    req.originalUrl = req.url || req.originalUrl

    const pathname = getPathname(req.originalUrl)

    const matched = this.find(pathname)

    const mw: Middleware[] = [
      {
        handler: exts,
        type: 'mw',
        path: '/'
      },
      ...matched.filter((x) => req.method === 'HEAD' || (x.method ? x.method === req.method : true))
    ]

    if (matched[0] != null) {
      mw.push({
        type: 'mw',
        handler: (req, res, next) => {
          if (req.method === 'HEAD') {
            res.statusCode = 204
            return res.end('')
          }
          next()
        },
        path: '/'
      })
    }

    mw.push({
      handler: this.noMatchHandler,
      type: 'mw',
      path: '/'
    })

    const handle = (mw: Middleware<Req, Res>) => async (req: Req, res: Res, next: NextFunction) => {
      const { path = '/', handler, type, regex } = mw

      const params = regex ? getURLParams(regex, pathname) : {}

      if (type === 'route') req.params = params

      if (path.includes(':')) {
        const first = Object.values(params)[0]
        const url = req.url.slice(req.url.indexOf(first) + first?.length)
        req.url = lead(url)
      } else {
        req.url = lead(req.url.substring(path.length))
      }

      if (!req.path) req.path = getPathname(req.url)

      if (this.settings?.enableReqRoute) req.route = getRouteFromApp(this as any, handler)

      if (type === 'route') req.params = getURLParams(regex!, pathname)
      await applyHandler<Req, Res>(handler as unknown as Handler<Req, Res>)(req, res, next)
    }

    let idx = 0

    next = next || ((err: any) => (err ? this.onError(err, req) : loop()))

    const loop = () => idx < mw.length && handle(mw[idx++])(req, res as unknown as Res, next as NextFunction)

    loop()

    return res as Res
  }

  /**
   * Creates HTTP server and dispatches middleware
   * @param port server listening port
   * @param Server callback after server starts listening
   * @param host server listening host
   */
  async listen(port: number, cb?: () => void, hostname = '0.0.0.0'): Promise<Server> {
    const server = serve({ port, hostname })

    cb?.()

    for await (const req of server) {
      this.attach(req as any)
    }
    return server
  }
}
