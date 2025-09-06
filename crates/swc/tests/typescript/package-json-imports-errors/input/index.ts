import {} from "#foo.ts"; // Ok
import {} from "#internal/foo.ts"; // Error
import {} from "pkg/foo.ts"; // Ok
