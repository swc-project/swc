import { customRender } from "./customRender";

// override render method
export { customRender as render };

// re-ordering the export wildcard from case 1 should make no difference to output

// re-export everything
export * from "@testing-library/react";
