import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

import { oasPathParamsToColonParams } from "./oasPathParamsToColonParams.ts";

Deno.test({
  name: `"oasPathParamsToColonParams" should not change url without parameters`,
  fn() {
    assertEquals(
      oasPathParamsToColonParams(`/api/gate`),
      `/api/gate`,
    );
  },
});

Deno.test(
  {
    name:
      `"oasPathParamsToColonParams" should convert OpenAPI path parameter into colon parameter`,
    fn() {
      assertEquals(
        oasPathParamsToColonParams(`/api/gate/{applicationSlug}`),
        `/api/gate/:applicationSlug`,
      );
    },
  },
);

Deno.test({
  name:
    `"oasPathParamsToColonParams" should handle path parameter in middle of the path`,
  fn() {
    assertEquals(
      oasPathParamsToColonParams(
        `/api/gate/{applicationSlug}/login`,
      ),
      `/api/gate/:applicationSlug/login`,
    );
  },
});

Deno.test({
  name:
    `"oasPathParamsToColonParams" should handle more than one parameter in path`,
  fn() {
    assertEquals(
      oasPathParamsToColonParams(
        `/my/contract/billing/{billingId}/spreadingOptions/{monthsCount}`,
      ),
      `/my/contract/billing/:billingId/spreadingOptions/:monthsCount`,
    );
  },
});
