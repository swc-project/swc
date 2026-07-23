/* eslint-disable @typescript-eslint/no-unused-vars */
import { expectTypeOf } from 'vitest'
import { hc } from './client'
import { Context } from './context'
import { createMiddleware } from './helper/factory'
import { Hono } from './hono'
import { poweredBy } from './middleware/powered-by'
import type {
  AddParam,
  Env,
  ExtractSchema,
  Handler,
  InputToDataByTarget,
  MergePath,
  MergeSchemaPath,
  MiddlewareHandler,
  ParamKeyToRecord,
  ParamKeys,
  RemoveQuestion,
  ResponseFormat,
  ToSchema,
  TypedResponse,
} from './types'
import type { ContentfulStatusCode, StatusCode } from './utils/http-status'
import type { Equal, Expect } from './utils/types'
import { validator } from './validator'

describe('Env', () => {
  test('Env', () => {
    type E = {
      Variables: {
        foo: string
      }
      Bindings: {
        FLAG: boolean
      }
    }
    const app = new Hono<E>()
    app.use('*', poweredBy())
    app.get('/', (c) => {
      const foo = c.get('foo')
      expectTypeOf(foo).toEqualTypeOf<string>()
      const FLAG = c.env.FLAG
      expectTypeOf(FLAG).toEqualTypeOf<boolean>()
      return c.text('foo')
    })
  })
})

describe('HandlerInterface', () => {
  type Env = {}

  type Payload = { foo: string; bar: boolean }

  describe('no path pattern', () => {
    const app = new Hono<Env>()
    const middleware: MiddlewareHandler<
      Env,
      '/',
      {
        in: { json: Payload }
        out: { json: Payload }
      }
    > = async (_c, next) => {
      await next()
    }
    test('Context', () => {
      const route = app.get(middleware, (c) => {
        type Expected = Context<
          Env,
          '/',
          {
            in: { json: Payload }
            out: { json: Payload }
          }
        >
        expectTypeOf(c).toEqualTypeOf<Expected>()
        return c.json({
          message: 'Hello!',
        })
      })
      app.get(middleware, (c) => {
        const data = c.req.valid('json')
        expectTypeOf(data).toEqualTypeOf<Payload>()
        return c.json({
          message: 'Hello!',
        })
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/': {
          $get: {
            input: {
              json: Payload
            }
            output: {
              message: string
            }
            outputFormat: 'json'
            status: ContentfulStatusCode
          }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })

  describe('path pattern', () => {
    const app = new Hono<Env>()
    const middleware: MiddlewareHandler<
      Env,
      '/foo',
      { in: { json: Payload }; out: { json: Payload } },
      never
    > = async (_c, next) => {
      await next()
    }

    test('Context and AppType', () => {
      const route = app.get('/foo', middleware, (c) => {
        type Expected = Context<Env, '/foo', { in: { json: Payload }; out: { json: Payload } }>
        expectTypeOf(c).toEqualTypeOf<Expected>()
        return c.json({
          message: 'Hello!',
        })
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/foo': {
          $get: {
            input: {
              json: {
                foo: string
                bar: boolean
              }
            }
            output: {
              message: string
            }
            outputFormat: 'json'
            status: ContentfulStatusCode
          }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })

  describe('With path parameters', () => {
    const app = new Hono<Env>()
    const middleware: MiddlewareHandler<Env, '/post/:id', {}, never> = async (_c, next) => {
      await next()
    }
    it('Should have the `param` type', () => {
      const route = app.get('/post/:id', middleware, (c) => {
        return c.text('foo')
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/post/:id': {
          $get: {
            input: {
              param: {
                id: string
              }
            }
            output: 'foo'
            outputFormat: 'text'
            status: ContentfulStatusCode
          }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })

  describe('Without path', () => {
    const app = new Hono<Env>().basePath('/foo/:foo')

    it('With basePath and path params', () => {
      const route = app.get(async (c) => {
        const foo = c.req.param('foo')
        expect(typeof foo).toBe('string')
        return c.text(foo)
      })
      type Actual = ExtractSchema<typeof route>

      type Expected = {
        '/foo/:foo': {
          $get: {
            input: {
              param: {
                foo: string
              }
            }
            output: string
            outputFormat: 'text'
            status: ContentfulStatusCode
          }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })

    it('Chained', () => {
      const route = app.post('/books/:id').get((c) => {
        const id = c.req.param('id')
        return c.text(id)
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/foo/:foo/books/:id': {
          $get: {
            input: {
              param: {
                id: string
              } & {
                foo: string
              }
            }
            output: string
            outputFormat: 'text'
            status: ContentfulStatusCode
          }
        }
      } & {
        '/foo/:foo/books/:id': {
          $post: {
            input: {
              param: {
                id: string
              } & {
                foo: string
              }
            }
            output: {}
            outputFormat: ResponseFormat
            status: StatusCode
          }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })
})

describe('OnHandlerInterface', () => {
  const app = new Hono()
  test('Context', () => {
    const middleware: MiddlewareHandler<
      Env,
      '/purge',
      { in: { form: { id: string } }; out: { form: { id: number } } }
    > = async (_c, next) => {
      await next()
    }
    const route = app.on('PURGE', '/purge', middleware, (c) => {
      const data = c.req.valid('form')
      expectTypeOf(data).toEqualTypeOf<{ id: number }>()
      return c.json({
        success: true,
      })
    })
    type Actual = ExtractSchema<typeof route>
    type Expected = {
      '/purge': {
        $purge: {
          input: {
            form: {
              id: string
            }
          }
          output: {
            success: true
          }
          outputFormat: 'json'
          status: ContentfulStatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('app.on(method, path[], middleware, handler) should not throw a type error', () => {
    const middleware: MiddlewareHandler<{ Variables: { foo: string } }> = async () => {}
    app.on('GET', ['/a', '/b'], middleware, (c) => {
      expectTypeOf(c.var.foo).toEqualTypeOf<string>()
      return c.json({})
    })
  })
})

describe('TypedResponse', () => {
  test('unknown', () => {
    type Actual = TypedResponse
    type Expected = {
      _data: unknown
      _status: StatusCode
      _format: ResponseFormat
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('text auto infer', () => {
    type Actual = TypedResponse<string>
    type Expected = {
      _data: string
      _status: StatusCode
      _format: 'text'
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('json auto infer', () => {
    type Actual = TypedResponse<{ ok: true }>
    type Expected = {
      _data: { ok: true }
      _status: StatusCode
      _format: 'json'
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('Schema', () => {
  test('Schema', () => {
    type AppType = Hono<
      Env,
      ToSchema<
        'post',
        '/api/posts/:id',
        {
          in: {
            json: {
              id: number
              title: string
            }
          }
        },
        TypedResponse<
          {
            message: string
            success: boolean
          },
          StatusCode,
          'json'
        >
      >
    >

    type Actual = ExtractSchema<AppType>
    type Expected = {
      '/api/posts/:id': {
        $post: {
          input: {
            json: {
              id: number
              title: string
            }
          } & {
            param: {
              id: string
            }
          }
          output: {
            message: string
            success: boolean
          }
          outputFormat: 'json'
          status: StatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('Support c.json(undefined)', () => {
  it('Should return a correct type', () => {
    const app = new Hono().get('/this/is/a/test', async (c) => {
      return c.json(undefined)
    })
    type Actual = ExtractSchema<typeof app>
    type Expected = {
      '/this/is/a/test': {
        $get: {
          input: {}
          output: never
          outputFormat: 'json'
          status: ContentfulStatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('Test types of Handler', () => {
  type E = {
    Variables: {
      foo: number
    }
  }

  const url = 'http://localhost/'

  test('Env', async () => {
    const app = new Hono<E>()
    const handler: Handler<E> = (c) => {
      const foo = c.get('foo')
      expectTypeOf(foo).toEqualTypeOf<number>()
      const id = c.req.param('id')
      expectTypeOf(id).toEqualTypeOf<string>()
      return c.text('Hi')
    }
    app.get('/', handler)
    const res = await app.request(url)
    expect(res.status).toBe(200)
  })

  test('Env, Path', async () => {
    const app = new Hono<E>()
    const handler: Handler<E, '/'> = (c) => {
      const foo = c.get('foo')
      expectTypeOf(foo).toEqualTypeOf<number>()
      return c.text('Hi')
    }
    app.get('/', handler)

    const res = await app.request(url)
    expect(res.status).toBe(200)
  })

  type User = {
    name: string
    age: number
  }

  test('Env, Path, Type', async () => {
    const app = new Hono<E>()
    const handler: Handler<E, '/', { in: { json: User }; out: { json: User } }> = (c) => {
      const foo = c.get('foo')
      expectTypeOf(foo).toEqualTypeOf<number>()
      const { name } = c.req.valid('json')
      expectTypeOf(name).toEqualTypeOf<string>()
      return c.text('Hi')
    }
  })
})

describe('`json()`', () => {
  const app = new Hono<{ Variables: { foo: string } }>()
  app.get('/post/:id', (c) => {
    c.req.param('id')
    const id = c.req.param('id')
    return c.text('foo')
  })

  test('json', () => {
    const route = app.get('/hello', (c) => {
      return c.json({
        message: 'Hello!',
      })
    })
    type Actual = ExtractSchema<typeof route>
    type Expected = {
      '/hello': {
        $get: {
          input: {}
          output: {
            message: string
          }
          outputFormat: 'json'
          status: ContentfulStatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('json with specific status code', () => {
    const route = app.get('/hello', (c) => {
      return c.json(
        {
          message: 'Hello!',
        },
        200
      )
    })
    type Actual = ExtractSchema<typeof route>
    type Expected = {
      '/hello': {
        $get: {
          input: {}
          output: {
            message: string
          }
          outputFormat: 'json'
          status: 200
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('Path parameters', () => {
  test('ParamKeys', () => {
    type Actual = ParamKeys<'/posts/:postId/comment/:commentId'>
    type Expected = 'postId' | 'commentId'
    type verify = Expect<Equal<Expected, Actual>>
  })

  describe('ParamKeyToRecord', () => {
    test('With ?', () => {
      type Actual = ParamKeyToRecord<'/animal/type?'>
      type Expected = { [K in '/animal/type']: string | undefined }
      type verify = Expect<Equal<Expected, Actual>>
    })
    test('Without ?', () => {
      type Actual = ParamKeyToRecord<'/animal/type'>
      type Expected = { [K in '/animal/type']: string }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })

  describe('Path parameters in app', () => {
    test('Optional parameters - /api/:a/:b?', () => {
      const app = new Hono()
      const routes = app.get('/api/:a/:b?', (c) => {
        const a = c.req.param('a')
        const b = c.req.param('b')
        expectTypeOf(a).toEqualTypeOf<string>()
        expectTypeOf(b).toEqualTypeOf<string | undefined>()
        return c.json({ a, b })
      })
      type T = ExtractSchema<typeof routes>
      type Output = T['/api/:a/:b?']['$get']['output']
      type Expected = {
        a: string
        b: string | undefined
      }
      type verify = Expect<Equal<Expected, Output>>
    })
  })
})

describe('For HonoRequest', () => {
  type Input = {
    json: {
      id: number
      title: string
    }
    query: {
      page: string
    }
  }

  test('InputToDataByType with value', () => {
    type Actual = InputToDataByTarget<Input, 'json'>
    type Expected = {
      id: number
      title: string
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('InputToDataByType without value', () => {
    type Actual = InputToDataByTarget<Input, 'form'>
    type verify = Expect<Equal<never, Actual>>
  })

  test('RemoveQuestion', () => {
    type Actual = RemoveQuestion<'/animal/type?'>
    type verify = Expect<Equal<'/animal/type', Actual>>
  })
})

describe('AddParam', () => {
  it('Should add params to input correctly', () => {
    type Actual = AddParam<
      {
        param: {
          id: string
        }
      } & {
        query: {
          page: string
        }
      },
      '/:id'
    >
    type Expected = {
      query: {
        page: string
      }
    } & {
      param: {
        id: string
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('ToSchema', () => {
  it('Should convert parameters to schema correctly', () => {
    type Actual = ToSchema<
      'get',
      '/:id',
      { in: { param: { id: string }; query: { page: string } } },
      TypedResponse<{}>
    >
    type Expected = {
      '/:id': {
        $get: {
          input: {
            param: {
              id: string
            }
            query: {
              page: string
            }
          }
          output: {}
          outputFormat: 'json'
          status: StatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('MergePath', () => {
  it('Should merge paths correctly', () => {
    type path1 = MergePath<'/api', '/book'>
    type verify1 = Expect<Equal<'/api/book', path1>>
    type path2 = MergePath<'/api/', '/book'>
    type verify2 = Expect<Equal<'/api/book', path2>>
    type path3 = MergePath<'/api/', '/'>
    type verify3 = Expect<Equal<'/api/', path3>>
    type path4 = MergePath<'/api', '/'>
    type verify4 = Expect<Equal<'/api', path4>>
    type path5 = MergePath<'/', ''>
    type verify5 = Expect<Equal<'/', path5>>
    type path6 = MergePath<'', '/'>
    type verify6 = Expect<Equal<'/', path6>>
    type path7 = MergePath<'/', '/'>
    type verify7 = Expect<Equal<'/', path7>>
    type path8 = MergePath<'', ''>
    type verify8 = Expect<Equal<'/', path8>>
  })
})

describe('MergeSchemaPath', () => {
  it('Should merge schema and sub path correctly', () => {
    type Sub = ToSchema<
      'post',
      '/posts',
      {
        in: {
          json: {
            id: number
            title: string
          }
        }
      },
      TypedResponse<{
        message: string
      }>
    > &
      ToSchema<
        'get',
        '/posts',
        {},
        TypedResponse<{
          ok: boolean
        }>
      >

    type Actual = MergeSchemaPath<Sub, '/api'>

    type Expected = {
      '/api/posts': {
        $post: {
          input: {
            json: {
              id: number
              title: string
            }
          }
          output: {
            message: string
          }
          outputFormat: 'json'
          status: StatusCode
        }
        $get: {
          input: {}
          output: {
            ok: boolean
          }
          outputFormat: 'json'
          status: StatusCode
        }
      }
    }

    type verify = Expect<Equal<Expected, Actual>>
  })

  it('Should merge schema which has params and sub path does not have params', () => {
    type Actual = MergeSchemaPath<
      {
        '/': {
          $get: {
            input: {
              param: {
                id: string
              }
              query: {
                page: string
              }
            }
            output: {}
            outputFormat: 'json'
            status: StatusCode
          }
        }
      },
      '/something'
    >
    type Expected = {
      '/something': {
        $get: {
          input: {
            param: {
              id: string
            }
            query: {
              page: string
            }
          }
          output: {}
          outputFormat: 'json'
          status: StatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  type GetKey<T> = T extends Record<infer K, unknown> ? K : never

  it('Should remove a slash - `/` + `/`', () => {
    type Sub = ToSchema<'get', '/', {}, TypedResponse<{}>>
    type Actual = MergeSchemaPath<Sub, '/'>
    type verify = Expect<Equal<'/', GetKey<Actual>>>
  })

  it('Should remove a slash - `/tags` + `/`', () => {
    type Sub = ToSchema<'get', '/tags', {}, TypedResponse<{}>>
    type Actual = MergeSchemaPath<Sub, '/'>
    type verify = Expect<Equal<'/tags', GetKey<Actual>>>
  })

  it('Should remove a slash - `/` + `/tags`', () => {
    type Sub = ToSchema<'get', '/', {}, TypedResponse<{}>>
    type Actual = MergeSchemaPath<Sub, '/tags'>
    type verify = Expect<Equal<'/tags', GetKey<Actual>>>
  })

  test('MergeSchemaPath - SubPath has path params', () => {
    type Actual = MergeSchemaPath<ToSchema<'get', '/', {}, TypedResponse>, '/a/:b'>
    type Expected = {
      '/a/:b': {
        $get: {
          input: {
            param: {
              b: string
            }
          }
          output: {}
          outputFormat: ResponseFormat
          status: StatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('MergeSchemaPath - Path and SubPath have path params', () => {
    type Actual = MergeSchemaPath<ToSchema<'get', '/c/:d', {}, TypedResponse<{}>>, '/a/:b'>
    type Expected = {
      '/a/:b/c/:d': {
        $get: {
          input: {
            param: {
              d: string
            } & {
              b: string
            }
          }
          output: {}
          outputFormat: 'json'
          status: StatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('MergeSchemaPath - Path and SubPath have regexp path params', () => {
    type Actual = MergeSchemaPath<ToSchema<'get', '/c/:d{.+}', {}, TypedResponse<{}>>, '/a/:b{.+}'>
    type Expected = {
      '/a/:b{.+}/c/:d{.+}': {
        $get: {
          input: {
            param: {
              d: string
            } & {
              b: string
            }
          }
          output: {}
          outputFormat: 'json'
          status: StatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('MergeSchemaPath - Method has Endpoints as Union', () => {
    type Actual = MergeSchemaPath<
      {
        '/': {
          $get:
            | {
                input: {}
                output: {
                  error: string
                }
                outputFormat: 'json'
                status: 404
              }
            | {
                input: {}
                output: {
                  success: boolean
                }
                outputFormat: 'json'
                status: 200
              }
        }
      },
      '/api/hello'
    >
    type Expected = {
      '/api/hello': {
        $get:
          | {
              input: {}
              output: {
                error: string
              }
              outputFormat: 'json'
              status: 404
            }
          | {
              input: {}
              output: {
                success: boolean
              }
              outputFormat: 'json'
              status: 200
            }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('Different types using json()', () => {
  describe('no path pattern', () => {
    const app = new Hono()

    test('Three different types', () => {
      const route = app.get((c) => {
        const flag = false
        if (flag) {
          return c.json({
            ng: true,
          })
        }
        if (!flag) {
          return c.json({
            ok: true,
          })
        }
        return c.json({
          default: true,
        })
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/': {
          $get:
            | {
                input: {}
                output: {
                  ng: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
            | {
                input: {}
                output: {
                  ok: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
            | {
                input: {}
                output: {
                  default: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('Three different types and status codes', () => {
      const route = app.get((c) => {
        const flag = false
        if (flag) {
          return c.json(
            {
              ng: true,
            },
            400
          )
        }
        if (!flag) {
          return c.json(
            {
              ok: true,
            },
            200
          )
        }
        return c.json({
          default: true,
        })
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/': {
          $get:
            | {
                input: {}
                output: {
                  ng: true
                }
                outputFormat: 'json'
                status: 400
              }
            | {
                input: {}
                output: {
                  ok: true
                }
                outputFormat: 'json'
                status: 200
              }
            | {
                input: {}
                output: {
                  default: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })

  describe('path pattern', () => {
    const app = new Hono()

    test('Three different types', () => {
      const route = app.get('/foo', (c) => {
        const flag = false
        if (flag) {
          return c.json({
            ng: true,
          })
        }
        if (!flag) {
          return c.json({
            ok: true,
          })
        }
        return c.json({
          default: true,
        })
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/foo': {
          $get:
            | {
                input: {}
                output: {
                  ng: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
            | {
                input: {}
                output: {
                  ok: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
            | {
                input: {}
                output: {
                  default: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('Three different types and status codes', () => {
      const route = app.get('/foo', (c) => {
        const flag = false
        if (flag) {
          return c.json(
            {
              ng: true,
            },
            400
          )
        }
        if (!flag) {
          return c.json(
            {
              ok: true,
            },
            200
          )
        }
        return c.json({
          default: true,
        })
      })
      type Actual = ExtractSchema<typeof route>
      type Expected = {
        '/foo': {
          $get:
            | {
                input: {}
                output: {
                  ng: true
                }
                outputFormat: 'json'
                status: 400
              }
            | {
                input: {}
                output: {
                  ok: true
                }
                outputFormat: 'json'
                status: 200
              }
            | {
                input: {}
                output: {
                  default: true
                }
                outputFormat: 'json'
                status: ContentfulStatusCode
              }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })
})

describe('json() in an async handler', () => {
  const app = new Hono()

  test('json', () => {
    const route = app.get(async (c) => {
      return c.json({
        ok: true,
      })
    })
    type Actual = ExtractSchema<typeof route>
    type Expected = {
      '/': {
        $get: {
          input: {}
          output: {
            ok: true
          }
          outputFormat: 'json'
          status: ContentfulStatusCode
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })

  test('json with specific status code', () => {
    const route = app.get(async (c) => {
      return c.json(
        {
          ok: true,
        },
        200
      )
    })
    type Actual = ExtractSchema<typeof route>
    type Expected = {
      '/': {
        $get: {
          input: {}
          output: {
            ok: true
          }
          outputFormat: 'json'
          status: 200
        }
      }
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

/**
 * Other tests for `c.var` are written in `hono.test.ts`.
 * This tests are only for types.
 */
describe('c.var with chaining - test only types', () => {
  const mw1 = createMiddleware<
    { Variables: { foo1: string } },
    string,
    { out: { query: { bar1: number } } }
  >(async () => {})
  const mw2 = createMiddleware<
    { Variables: { foo2: string } },
    string,
    { out: { query: { bar2: number } } }
  >(async () => {})
  const mw3 = createMiddleware<
    { Variables: { foo3: string } },
    string,
    { out: { query: { bar3: number } } }
  >(async () => {})
  const mw4 = createMiddleware<
    { Variables: { foo4: string } },
    string,
    { out: { query: { bar4: number } } }
  >(async () => {})
  const mw5 = createMiddleware<
    { Variables: { foo5: string } },
    string,
    { out: { query: { bar5: number } } }
  >(async () => {})
  const mw6 = createMiddleware<
    { Variables: { foo6: string } },
    string,
    { out: { query: { bar6: number } } }
  >(async () => {})
  const mw7 = createMiddleware<
    { Variables: { foo7: string } },
    string,
    { out: { query: { bar7: number } } }
  >(async () => {})
  const mw8 = createMiddleware<
    { Variables: { foo8: string } },
    string,
    { out: { query: { bar8: number } } }
  >(async () => {})
  const mw9 = createMiddleware<
    { Variables: { foo9: string } },
    string,
    { out: { query: { bar9: number } } }
  >(async () => {})
  const mw10 = createMiddleware<
    { Variables: { foo10: string } },
    string,
    { out: { query: { bar10: number } } }
  >(async () => {})

  it('Should not throw type errors', () => {
    // app.get(handler...)

    new Hono().get(mw1).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3, mw4).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3, mw4, mw5).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3, mw4, mw5, mw6).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3, mw4, mw5, mw6, mw7).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3, mw4, mw5, mw6, mw7, mw8).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo8).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3, mw4, mw5, mw6, mw7, mw8, mw9).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo8).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo9).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(mw1, mw2, mw3, mw4, mw5, mw6, mw7, mw8, mw9, mw10).get('/', (c) => {
      expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo8).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo9).toEqualTypeOf<string>()
      expectTypeOf(c.var.foo10).toEqualTypeOf<string>()
      return c.json(0)
    })

    new Hono().get(
      mw1,
      mw2,
      mw3,
      mw4,
      mw5,
      mw6,
      mw7,
      mw8,
      async (c) => {
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo8).toEqualTypeOf<string>()
      },
      (c) => c.json(0)
    )

    new Hono().get(mw1, mw2, mw3, mw4, mw5, mw6, mw7, mw8, mw9, (c) => {
      expectTypeOf(c.req.valid('query')).toMatchTypeOf<{
        bar1: number
        bar2: number
        bar3: number
        bar4: number
        bar5: number
        bar6: number
        bar7: number
        bar8: number
        bar9: number
      }>()

      return c.json(0)
    })

    new Hono().get(
      '/',
      mw1,
      mw2,
      mw3,
      mw4,
      mw5,
      mw6,
      mw7,
      mw8,
      async (c) => {
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo8).toEqualTypeOf<string>()
      },
      (c) => c.json(0)
    )

    new Hono().get('/', mw1, mw2, mw3, mw4, mw5, mw6, mw7, mw8, mw9, (c) => {
      expectTypeOf(c.req.valid('query')).toMatchTypeOf<{
        bar1: number
        bar2: number
        bar3: number
        bar4: number
        bar5: number
        bar6: number
        bar7: number
        bar8: number
        bar9: number
      }>()

      return c.json(0)
    })

    type Env = {
      Variables: {
        init: number
      }
    }

    new Hono<Env>()
      .get('/', mw1, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        return c.json(0)
      })
    new Hono<Env>()
      .get('/', mw1, mw2, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        return c.json(0)
      })
    new Hono<Env>()
      .get('/', mw1, mw2, mw3, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo3')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        // @ts-expect-error foo3 is not typed
        c.get('foo3')
        // @ts-expect-error foo3 is not typed
        c.var.foo3
        return c.json(0)
      })
    new Hono<Env>()
      .get('/', mw1, mw2, mw3, mw4, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo3')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo4')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        // @ts-expect-error foo3 is not typed
        c.get('foo3')
        // @ts-expect-error foo3 is not typed
        c.var.foo3
        // @ts-expect-error foo4 is not typed
        c.get('foo4')
        // @ts-expect-error foo4 is not typed
        c.var.foo4
        return c.json(0)
      })

    new Hono<Env>()
      .get('/', mw1, mw2, mw3, mw4, mw5, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo3')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo4')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo5')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        // @ts-expect-error foo3 is not typed
        c.get('foo3')
        // @ts-expect-error foo3 is not typed
        c.var.foo3
        // @ts-expect-error foo4 is not typed
        c.get('foo4')
        // @ts-expect-error foo4 is not typed
        c.var.foo4
        // @ts-expect-error foo5 is not typed
        c.get('foo5')
        // @ts-expect-error foo5 is not typed
        c.var.foo5
        return c.json(0)
      })
    new Hono<Env>()
      .get('/', mw1, mw2, mw3, mw4, mw5, mw6, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo3')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo4')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo5')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo6')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        // @ts-expect-error foo3 is not typed
        c.get('foo3')
        // @ts-expect-error foo3 is not typed
        c.var.foo3
        // @ts-expect-error foo4 is not typed
        c.get('foo4')
        // @ts-expect-error foo4 is not typed
        c.var.foo4
        // @ts-expect-error foo5 is not typed
        c.get('foo5')
        // @ts-expect-error foo5 is not typed
        c.var.foo5
        // @ts-expect-error foo6 is not typed
        c.get('foo6')
        // @ts-expect-error foo6 is not typed
        c.var.foo6
        return c.json(0)
      })
    new Hono<Env>()
      .get('/', mw1, mw2, mw3, mw4, mw5, mw6, mw7, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo3')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo4')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo5')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo6')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo7')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        // @ts-expect-error foo3 is not typed
        c.get('foo3')
        // @ts-expect-error foo3 is not typed
        c.var.foo3
        // @ts-expect-error foo4 is not typed
        c.get('foo4')
        // @ts-expect-error foo4 is not typed
        c.var.foo4
        // @ts-expect-error foo5 is not typed
        c.get('foo5')
        // @ts-expect-error foo5 is not typed
        c.var.foo5
        // @ts-expect-error foo6 is not typed
        c.get('foo6')
        // @ts-expect-error foo6 is not typed
        c.var.foo6
        // @ts-expect-error foo7 is not typed
        c.get('foo7')
        // @ts-expect-error foo7 is not typed
        c.var.foo7
        return c.json(0)
      })
    new Hono<Env>()
      .get('/', mw1, mw2, mw3, mw4, mw5, mw6, mw7, mw8, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo3')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo4')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo5')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo6')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo7')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo8')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo8).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        // @ts-expect-error foo3 is not typed
        c.get('foo3')
        // @ts-expect-error foo3 is not typed
        c.var.foo3
        // @ts-expect-error foo4 is not typed
        c.get('foo4')
        // @ts-expect-error foo4 is not typed
        c.var.foo4
        // @ts-expect-error foo5 is not typed
        c.get('foo5')
        // @ts-expect-error foo5 is not typed
        c.var.foo5
        // @ts-expect-error foo6 is not typed
        c.get('foo6')
        // @ts-expect-error foo6 is not typed
        c.var.foo6
        // @ts-expect-error foo7 is not typed
        c.get('foo7')
        // @ts-expect-error foo7 is not typed
        c.var.foo7
        // @ts-expect-error foo8 is not typed
        c.get('foo8')
        // @ts-expect-error foo8 is not typed
        c.var.foo8
        return c.json(0)
      })

    new Hono<Env>()
      .get('/', mw1, mw2, mw3, mw4, mw5, mw6, mw7, mw8, mw9, (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo1).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo2).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo3')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo3).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo4')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo4).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo5')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo5).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo6')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo6).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo7')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo7).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo8')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo8).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo9')).toEqualTypeOf<string>()
        expectTypeOf(c.var.foo9).toEqualTypeOf<string>()
        return c.json(0)
      })
      .get('/', (c) => {
        expectTypeOf(c.get('init')).toEqualTypeOf<number>()
        expectTypeOf(c.var.init).toEqualTypeOf<number>()
        // @ts-expect-error foo1 is not typed
        c.get('foo1')
        // @ts-expect-error foo1 is not typed
        c.var.foo1
        // @ts-expect-error foo2 is not typed
        c.get('foo2')
        // @ts-expect-error foo2 is not typed
        c.var.foo2
        // @ts-expect-error foo3 is not typed
        c.get('foo3')
        // @ts-expect-error foo3 is not typed
        c.var.foo3
        // @ts-expect-error foo4 is not typed
        c.get('foo4')
        // @ts-expect-error foo4 is not typed
        c.var.foo4
        // @ts-expect-error foo5 is not typed
        c.get('foo5')
        // @ts-expect-error foo5 is not typed
        c.var.foo5
        // @ts-expect-error foo6 is not typed
        c.get('foo6')
        // @ts-expect-error foo6 is not typed
        c.var.foo6
        // @ts-expect-error foo7 is not typed
        c.get('foo7')
        // @ts-expect-error foo7 is not typed
        c.var.foo7
        // @ts-expect-error foo8 is not typed
        c.get('foo8')
        // @ts-expect-error foo8 is not typed
        c.var.foo8
        // @ts-expect-error foo9 is not typed
        c.get('foo9')
        // @ts-expect-error foo9 is not typed
        c.var.foo9
        return c.json(0)
      })
  })
})

/**
 *
 * Declaring a ContextVariableMap for testing.
 */
declare module './context' {
  interface ContextVariableMap {
    payload: string
  }
}

describe('ContextVariableMap type tests', () => {
  it('Should not throw type errors with c.var', () => {
    new Hono().get((c) => {
      expectTypeOf(c.get('payload')).toEqualTypeOf<string>()
      return c.json(0)
    })
    new Hono().get((c) => {
      expectTypeOf(c.var.payload).toEqualTypeOf<string>()
      return c.json(0)
    })
  })

  it('Should override ContextVariableMap with env variables', () => {
    const middleware = createMiddleware<{
      Variables: {
        payload: number
      }
    }>(async (c, next) => {
      c.set('payload', 123)
      await next()
    })

    new Hono().get(middleware, (c) => {
      expectTypeOf(c.get('payload')).toEqualTypeOf<number>()
      return c.json(0)
    })
  })

  it('Should use ContextVariableMap when c is Context<any>', () => {
    const c = new Context(new Request('http://localhost'))
    expectTypeOf(c.get('payload')).toEqualTypeOf<string>()
    expectTypeOf(c.var.payload).toEqualTypeOf<string>()
    // @ts-expect-error the value of payload should be string
    expectTypeOf(c.set('payload', 123))
  })
})

/**
 * It's challenge to test all cases. This is a minimal pattern.
 */
describe('Env types with chained routes - test only types', () => {
  const app = new Hono<{ Variables: { testVar: string } }>()
  it('Should not throw a type error', () => {
    app
      .post(
        '/',
        validator('json', (v) => v),
        async (c) => {
          expectTypeOf(c.get('testVar')).toEqualTypeOf<string>()
          return c.json({ success: true })
        }
      )
      .patch(
        '/',
        validator('json', (v) => v),
        async (c) => {
          expectTypeOf(c.get('testVar')).toEqualTypeOf<string>()
          return c.json({ success: true })
        }
      )
  })
})

/**
 * Ref: https://github.com/honojs/hono/issues/3027
 */
describe('Env types with validator as first middleware - test only types', () => {
  const app = new Hono<{ Variables: { testVar: string } }>()
  it('Should not throw a type error', () => {
    const testApp = app.get(
      validator('json', () => {
        return {
          cd: 'bar',
        }
      }),
      async (c) => {
        const foo = c.req.valid('json') // Error here
        return c.json(1)
      }
    )

    const dummyMiddleware1 = createMiddleware(async (c, next) => {
      await next()
    })
    // Multiple levels of middleware
    const testApp2 = app.post(
      validator('json', () => {
        return {
          cd: 'bar',
        }
      }),
      dummyMiddleware1,
      createMiddleware(async (c, next) => {
        await next()
      }),
      async (c) => {
        const foo = c.req.valid('json') // Error here also
        return c.json(1)
      }
    )
  })
})

describe('Env types with `use` middleware - test only types', () => {
  const app = new Hono()

  const mw1 = createMiddleware<{ Variables: { foo1: string } }>(async () => {})
  const mw2 = createMiddleware<{ Variables: { foo2: string } }>(async () => {})

  it('Should not throw a type error', () => {
    app
      .use(mw1)
      .use(mw2)
      .get('/', (c) => {
        expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
        expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
        return c.json({ success: true })
      })
    app.use(mw1, mw2).get('/', (c) => {
      expectTypeOf(c.get('foo1')).toEqualTypeOf<string>()
      expectTypeOf(c.get('foo2')).toEqualTypeOf<string>()
      return c.json({ success: true })
    })
  })
})

describe('Env types and a path type with `app.use(path, handler...)` - test only types', () => {
  it('Should not throw a type error', () => {
    type Env = {
      Variables: {
        foo: string
      }
    }

    // app.use(path, handler)
    new Hono<Env>()
      .use('/:id', async (c, next) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        await next()
      })
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x2)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x3)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x4)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x5)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x6)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x7)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x8)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x9)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })

    // app.use(path, handler x10)
    new Hono<Env>()
      .use(
        '/:id',
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        },
        async (c, next) => {
          expectTypeOf(c.var.foo).toEqualTypeOf<string>()
          expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
          await next()
        }
      )
      .get((c) => {
        expectTypeOf(c.var.foo).toEqualTypeOf<string>()
        expectTypeOf(c.req.param('id')).toEqualTypeOf<string>()
        return c.json(0)
      })
  })
})

// https://github.com/honojs/hono/issues/3122
describe('Returning type from `app.use(path, mw)`', () => {
  const mw = createMiddleware(async (c, next) => {
    await next()
  })
  it('Should not mark `*` as never', () => {
    const app = new Hono().use('*', mw)
    type Actual = ExtractSchema<typeof app>
    type Expected = {
      '*': {}
    }
    type verify = Expect<Equal<Expected, Actual>>
  })
})

describe('generic typed variables', () => {
  const okHelper = (c: Context) => {
    return <TData>(data: TData) => c.json({ data })
  }
  type Variables = {
    ok: ReturnType<typeof okHelper>
  }
  const app = new Hono<{ Variables: Variables }>()

  it('Should set and get variables with correct types', async () => {
    const route = app
      .use('*', async (c, next) => {
        c.set('ok', okHelper(c))
        await next()
      })
      .get('/', (c) => {
        const ok = c.get('ok')
        return ok('Hello')
      })
    type Actual = ExtractSchema<typeof route>['/']['$get']['output']
    type Expected = { data: string }
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })
})

describe('status code', () => {
  const app = new Hono()

  it('should only allow to return .json() with contentful status codes', async () => {
    const route = app.get('/', async (c) => c.json({}))
    type Actual = ExtractSchema<typeof route>['/']['$get']['status']
    expectTypeOf<Actual>().toEqualTypeOf<ContentfulStatusCode>()
  })

  it('should only allow to return .body(null) with all status codes', async () => {
    const route = app.get('/', async (c) => c.body(null))
    type Actual = ExtractSchema<typeof route>['/']['$get']['status']
    expectTypeOf<Actual>().toEqualTypeOf<StatusCode>()
  })

  it('should only allow to return .text() with contentful status codes', async () => {
    const route = app.get('/', async (c) => c.text('whatever'))
    type Actual = ExtractSchema<typeof route>['/']['$get']['status']
    expectTypeOf<Actual>().toEqualTypeOf<ContentfulStatusCode>()
  })

  it('should throw type error when .json({}) is used with contentless status codes', async () => {
    // @ts-expect-error 204 is not contentful status code
    app.get('/', async (c) => c.json({}, 204))
    app.get('/', async (c) =>
      c.json(
        {},
        // @ts-expect-error 204 is not contentful status code
        {
          status: 204,
        }
      )
    )
  })

  it('should throw type error when .body(content) is used with contentless status codes', async () => {
    // @ts-expect-error 204 is not contentful status code
    app.get('/', async (c) => c.body('content', 204))
    // @ts-expect-error 204 is not contentful status code
    app.get('/', async (c) => c.body('content', { status: 204 }))
  })

  it('should throw type error when .text(content) is used with contentless status codes', async () => {
    // @ts-expect-error 204 is not contentful status code
    app.get('/', async (c) => c.text('content', 204))
    // @ts-expect-error 204 is not contentful status code
    app.get('/', async (c) => c.text('content', { status: 204 }))
  })

  it('should throw type error when .html(content) is used with contentless status codes', async () => {
    // @ts-expect-error 204 is not contentful status code
    app.get('/', async (c) => c.html('<h1>title</h1>', 204))
    // @ts-expect-error 204 is not contentful status code
    app.get('/', async (c) => c.html('<h1>title</h1>', { status: 204 }))
  })

  it('.body() not override other responses in hono client', async () => {
    const router = app.get('/', async (c) => {
      if (c.req.header('Content-Type') === 'application/json') {
        return c.text('Hello', 200)
      }

      if (c.req.header('Content-Type') === 'application/x-www-form-urlencoded') {
        return c.body('Hello', 201)
      }

      return c.body(null, 204)
    })

    type Actual = ExtractSchema<typeof router>['/']['$get']['status']
    expectTypeOf<Actual>().toEqualTypeOf<204 | 201 | 200>()
  })
})

describe('RPC supports Middleware responses', () => {
  describe('Merge responses from multiple handlers, path pattern', () => {
    test('merge responses from 1 middleware', async () => {
      const middleware = createMiddleware(async (c) => c.json({ '400': true }, 400))

      const app = new Hono().get('/test', middleware, (c) => c.json({ '200': true }, 200))
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
    })

    test('merge responses from 2 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))

      const app = new Hono().get('/test', middleware1, middleware2, (c) =>
        c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
    })

    test('merge responses from 3 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))

      const app = new Hono().get('/test', middleware1, middleware2, middleware3, (c) =>
        c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
    })

    test('merge responses from 4 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))

      const app = new Hono().get('/test', middleware1, middleware2, middleware3, middleware4, (c) =>
        c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
    })

    test('merge responses from 5 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))

      const app = new Hono().get(
        '/test',
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
    })

    test('merge responses from 6 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))

      const app = new Hono().get(
        '/test',
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
    })

    test('merge responses from 7 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))
      const middleware7 = createMiddleware(async (c) => c.json({ '202': true }, 202))

      const app = new Hono().get(
        '/test',
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        middleware7,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
      if (res.status === 202) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 202: true }>()
      }
    })

    test('merge responses from 8 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))
      const middleware7 = createMiddleware(async (c) => c.json({ '202': true }, 202))
      const middleware8 = createMiddleware(async (c) => c.json({ '203': true }, 203))

      const app = new Hono().get(
        '/test',
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        middleware7,
        middleware8,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
      if (res.status === 202) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 202: true }>()
      }
      if (res.status === 203) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 203: true }>()
      }
    })

    test('merge responses from 9 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))
      const middleware7 = createMiddleware(async (c) => c.json({ '202': true }, 202))
      const middleware8 = createMiddleware(async (c) => c.json({ '203': true }, 203))
      const middleware9 = createMiddleware(async (c) => c.json({ '301': true }, 301))

      const app = new Hono().get(
        '/test',
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        middleware7,
        middleware8,
        middleware9,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.test.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
      if (res.status === 202) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 202: true }>()
      }
      if (res.status === 203) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 203: true }>()
      }
      if (res.status === 301) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 301: true }>()
      }
    })
  })

  describe('Merge responses from multiple handlers, no path pattern', () => {
    test('merge responses from 1 middleware', async () => {
      const middleware = createMiddleware(async (c) => c.json({ '400': true }, 400))

      const app = new Hono().get(middleware, (c) => c.json({ '200': true }, 200))
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
    })

    test('merge responses from 2 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))

      const app = new Hono().get(middleware1, middleware2, (c) => c.json({ '200': true }, 200))
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
    })

    test('merge responses from 3 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))

      const app = new Hono().get(middleware1, middleware2, middleware3, (c) =>
        c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
    })

    test('merge responses from 4 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))

      const app = new Hono().get(middleware1, middleware2, middleware3, middleware4, (c) =>
        c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
    })

    test('merge responses from 5 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))

      const app = new Hono().get(
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
    })

    test('merge responses from 6 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))

      const app = new Hono().get(
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
    })

    test('merge responses from 7 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))
      const middleware7 = createMiddleware(async (c) => c.json({ '202': true }, 202))

      const app = new Hono().get(
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        middleware7,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
      if (res.status === 202) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 202: true }>()
      }
    })

    test('merge responses from 8 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))
      const middleware7 = createMiddleware(async (c) => c.json({ '202': true }, 202))
      const middleware8 = createMiddleware(async (c) => c.json({ '203': true }, 203))

      const app = new Hono().get(
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        middleware7,
        middleware8,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
      if (res.status === 202) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 202: true }>()
      }
      if (res.status === 203) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 203: true }>()
      }
    })

    test('merge responses from 9 middlewares', async () => {
      const middleware1 = createMiddleware(async (c) => c.json({ '400': true }, 400))
      const middleware2 = createMiddleware(async (c) => c.json({ '401': true }, 401))
      const middleware3 = createMiddleware(async (c) => c.json({ '403': true }, 403))
      const middleware4 = createMiddleware(async (c) => c.json({ '404': true }, 404))
      const middleware5 = createMiddleware(async (c) => c.json({ '300': true }, 300))
      const middleware6 = createMiddleware(async (c) => c.json({ '201': true }, 201))
      const middleware7 = createMiddleware(async (c) => c.json({ '202': true }, 202))
      const middleware8 = createMiddleware(async (c) => c.json({ '203': true }, 203))
      const middleware9 = createMiddleware(async (c) => c.json({ '301': true }, 301))

      const app = new Hono().get(
        middleware1,
        middleware2,
        middleware3,
        middleware4,
        middleware5,
        middleware6,
        middleware7,
        middleware8,
        middleware9,
        (c) => c.json({ '200': true }, 200)
      )
      const client = hc<typeof app>('http://localhost', { fetch: app.request })
      const res = await client.index.$get()

      if (res.status === 200) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 200: true }>()
      }
      if (res.status === 400) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 400: true }>()
      }
      if (res.status === 401) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 401: true }>()
      }
      if (res.status === 403) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 403: true }>()
      }
      if (res.status === 404) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 404: true }>()
      }
      if (res.status === 300) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 300: true }>()
      }
      if (res.status === 201) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 201: true }>()
      }
      if (res.status === 202) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 202: true }>()
      }
      if (res.status === 203) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 203: true }>()
      }
      if (res.status === 301) {
        expectTypeOf(await res.json()).toEqualTypeOf<{ 301: true }>()
      }
    })
  })

  describe('Infers types with multiple middlewares but none returning response', () => {
    const middleware = createMiddleware(async () => {})
    const handler = (c: Context) => c.json({ ok: true }, 200)
    type Expected = {
      '/': {
        $get: {
          input: {}
          output: {
            ok: true
          }
          outputFormat: 'json'
          status: 200
        }
      }
    }

    test('infer the correct response type with 1 middleware and 1 handler', () => {
      const routes = new Hono().get('/', middleware, handler)
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 1 middleware and 2 handler', () => {
      const routes = new Hono().get('/', middleware, handler, handler)
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 2 middleware and 1 handler', () => {
      const routes = new Hono().get('/', middleware, middleware, handler)
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 3 middleware and 1 handler', () => {
      const routes = new Hono().get('/', middleware, middleware, middleware, handler)
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 4 middleware and 1 handler', () => {
      const routes = new Hono().get('/', middleware, middleware, middleware, middleware, handler)
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 5 middleware and 1 handler', () => {
      const routes = new Hono().get(
        '/',
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        handler
      )
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 6 middleware and 1 handler', () => {
      const routes = new Hono().get(
        '/',
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        handler
      )
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 7 middleware and 1 handler', () => {
      const routes = new Hono().get(
        '/',
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        handler
      )
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 8 middleware and 1 handler', () => {
      const routes = new Hono().get(
        '/',
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        handler
      )
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 9 middleware and 1 handler', () => {
      const routes = new Hono().get(
        '/',
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        middleware,
        handler
      )
      type Actual = ExtractSchema<typeof routes>
      type verify = Expect<Equal<Expected, Actual>>
    })
  })

  describe('Infers types with multiple middlewares but only some returning response', () => {
    const handler = (c: Context) => c.json({ ok: true }, 200)

    test('infer the correct response type with 2 middleware, only one returning response', () => {
      const middleware1 = async (c: Context) => {
        if (Math.random() > 0.5) {
          return c.json(
            {
              q: true,
            },
            200
          )
        }
      }
      const middleware2 = async () => {}

      const routes = new Hono().get('/', middleware1, middleware2, handler)
      type Actual = ExtractSchema<typeof routes>
      type Expected = {
        '/': {
          $get:
            | {
                input: {}
                output: {
                  ok: true
                }
                outputFormat: 'json'
                status: 200
              }
            | {
                input: {}
                output: {
                  q: true
                }
                outputFormat: 'json'
                status: 200
              }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })

    test('infer the correct response type with 3 middleware, 2 returning response', () => {
      const middleware1 = async (c: Context) => {
        if (Math.random() > 0.5) {
          return c.json(
            {
              q1: true,
            },
            200
          )
        }
      }
      const middleware2 = async (c: Context) => {
        if (Math.random() > 0.5) {
          return c.json(
            {
              q2: true,
            },
            200
          )
        }
      }
      const middleware3 = async () => {}

      const routes = new Hono().get('/', middleware1, middleware2, middleware3, handler)
      type Actual = ExtractSchema<typeof routes>
      type Expected = {
        '/': {
          $get:
            | {
                input: {}
                output: {
                  ok: true
                }
                outputFormat: 'json'
                status: 200
              }
            | {
                input: {}
                output: {
                  q1: true
                }
                outputFormat: 'json'
                status: 200
              }
            | {
                input: {}
                output: {
                  q2: true
                }
                outputFormat: 'json'
                status: 200
              }
        }
      }
      type verify = Expect<Equal<Expected, Actual>>
    })
  })
})
