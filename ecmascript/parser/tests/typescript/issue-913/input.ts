import { Rhum } from "../../deps.ts";
import members from "../../members.ts";
import { Drash } from "../../../mod.ts";

Rhum.testPlan("decorators/middleware_test.ts", () => {
    Rhum.testSuite("ResourceWithMiddlewareBeforeClass", () => {
        Rhum.testCase("header not specified", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMiddlewareBeforeClass],
            });
            const request = members.mockRequest("/users/1");
            const response = await server.handleHttpRequest(request);
            members.assertResponseJsonEquals(
                members.responseBody(response),
                "'header' not specified.",
            );
        });
        Rhum.testCase("valid", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMiddlewareBeforeClass],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            members.assertResponseJsonEquals(
                members.responseBody(response),
                { name: "Thor" },
            );
        });
    });

    Rhum.testSuite("ResourceWithMultipleMiddlewareBeforeClass", () => {
        Rhum.testCase("correct header, custom response and value", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMultipleMiddlewareBeforeClass],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            members.assertResponseJsonEquals(
                members.responseBody(response),
                { name: "Thor" },
            );
            Rhum.asserts.assertEquals(response.headers!.get("MYCUSTOM"), "hey");
        });
    });

    Rhum.testSuite("ResourceWithMultipleMiddlewareAfterClass", () => {
        Rhum.testCase("response is html, custom header and value", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMultipleMiddlewareAfterClass],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            Rhum.asserts.assertEquals(members.responseBody(response), "<h1>hey</h1>");
            Rhum.asserts.assertEquals(
                response.headers!.get("Content-Type"),
                "text/html",
            );
            Rhum.asserts.assertEquals(response.headers!.get("MYCUSTOM"), "hey");
        });
    });

    Rhum.testSuite("ResourceWithMiddlewareClass", () => {
        Rhum.testCase("custom header and swap to html", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMiddlewareClass],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            Rhum.asserts.assertEquals(members.responseBody(response), "<h1>hey</h1>");
            Rhum.asserts.assertEquals(
                response.headers!.get("Content-Type"),
                "text/html",
            );
            Rhum.asserts.assertEquals(response.headers!.get("MYCUSTOM"), "hey");
        });
    });

    Rhum.testSuite("ResourceWithMiddlewareBeforeMethod", () => {
        Rhum.testCase("custom header", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMiddlewareBeforeMethod],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            members.assertResponseJsonEquals(
                members.responseBody(response),
                { name: "Thor" },
            );
        });
    });

    Rhum.testSuite("ResourceWithMultipleMiddlewareBeforeMethod", () => {
        Rhum.testCase("custom header", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMultipleMiddlewareBeforeMethod],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            members.assertResponseJsonEquals(
                members.responseBody(response),
                { name: "Thor" },
            );
            Rhum.asserts.assertEquals(response.headers!.get("MYCUSTOM"), "hey");
        });
    });

    Rhum.testSuite("ResourceWithMiddlewareAfterMethod", () => {
        Rhum.testCase("swap to html", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMiddlewareAfterMethod],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            Rhum.asserts.assertEquals(members.responseBody(response), "<h1>hey</h1>");
            Rhum.asserts.assertEquals(
                response.headers!.get("Content-Type"),
                "text/html",
            );
        });
    });

    Rhum.testSuite("ResourceWithMultipleMiddlewareAfterMethod", () => {
        Rhum.testCase("custom header and swap to html", async () => {
            const server = new Drash.Http.Server({
                resources: [ResourceWithMultipleMiddlewareAfterMethod],
            });
            const request = members.mockRequest("/users/1", "get", {
                headers: {
                    csrf_token: "all your base",
                },
            });
            const response = await server.handleHttpRequest(request);
            Rhum.asserts.assertEquals(members.responseBody(response), "<h1>hey</h1>");
            Rhum.asserts.assertEquals(
                response.headers!.get("Content-Type"),
                "text/html",
            );
            Rhum.asserts.assertEquals(response.headers!.get("MYCUSTOM"), "hey");
        });
    });
});

Rhum.run();

////////////////////////////////////////////////////////////////////////////////
// FILE MARKER - DATA //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

interface IUser {
    name: string;
}

function CustomHeader(
    request: Drash.Http.Request,
    response: Drash.Http.Response,
) {
    if (request.getHeaderParam("csrf_token") == null) {
        throw new Drash.Exceptions.HttpMiddlewareException(
            400,
            "'header' not specified.",
        );
    }
}
function SwapResponseToHtml(
    request: Drash.Http.Request,
    response: Drash.Http.Response,
) {
    response.headers.set("Content-Type", "text/html");
    response.body = "<h1>hey</h1>";
}
function ResponseCustomHeaderAdded(
    request: Drash.Http.Request,
    response: Drash.Http.Response,
) {
    response.headers.set("MYCUSTOM", "hey");
}

@Drash.Http.Middleware({ before_request: [CustomHeader] })
class ResourceWithMiddlewareBeforeClass extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    public GET() {
        const param = this.request.getPathParam("id");
        if (param) {
            this.response.body = this.users.get(
                parseInt(param),
            );
        }
        return this.response;
    }
}

@Drash.Http.Middleware(
    { before_request: [ResponseCustomHeaderAdded, CustomHeader] },
)
class ResourceWithMultipleMiddlewareBeforeClass extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    public GET() {
        const param = this.request.getPathParam("id");
        if (param) {
            this.response.body = this.users.get(
                parseInt(param),
            );
        }
        return this.response;
    }
}

@Drash.Http.Middleware(
    { after_request: [SwapResponseToHtml, ResponseCustomHeaderAdded] },
)
class ResourceWithMultipleMiddlewareAfterClass extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    public GET() {
        return this.response;
    }
}

@Drash.Http.Middleware(
    {
        before_request: [SwapResponseToHtml],
        after_request: [ResponseCustomHeaderAdded],
    },
)
class ResourceWithMiddlewareClass extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    public GET() {
        return this.response;
    }
}

class ResourceWithMiddlewareBeforeMethod extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    @Drash.Http.Middleware({ before_request: [CustomHeader] })
    public GET() {
        const param = this.request.getPathParam("id");
        if (param) {
            this.response.body = this.users.get(
                parseInt(param),
            );
        }
        return this.response;
    }
}

class ResourceWithMiddlewareAfterMethod extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    @Drash.Http.Middleware({ after_request: [SwapResponseToHtml] })
    public GET() {
        return this.response;
    }
}

class ResourceWithMultipleMiddlewareBeforeMethod extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    @Drash.Http.Middleware(
        { before_request: [ResponseCustomHeaderAdded, CustomHeader] },
    )
    public GET() {
        const param = this.request.getPathParam("id");
        if (param) {
            this.response.body = this.users.get(
                parseInt(param),
            );
        }
        return this.response;
    }
}

class ResourceWithMultipleMiddlewareAfterMethod extends Drash.Http.Resource {
    static paths = ["/users/:id", "/users/:id/"];
    public users = new Map<number, IUser>([
        [1, { name: "Thor" }],
        [2, { name: "Hulk" }],
    ]);
    @Drash.Http.Middleware(
        { after_request: [SwapResponseToHtml, ResponseCustomHeaderAdded] },
    )
    public GET() {
        return this.response;
    }
}