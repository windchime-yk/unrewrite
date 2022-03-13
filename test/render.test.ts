import { assertEquals } from "../deps.ts";
import { renderHTML } from "../utils/render.tsx";
import { allSettedConfig } from "./common/util.ts";

Deno.test("renderHTML", () => {
  const render = renderHTML(
    {
      title: "Test",
      description: "Test Page",
    },
    allSettedConfig,
    "テスト",
  );

  assertEquals<string>(
    render,
    `
  <!DOCTYPE html>
  <html><head><meta charSet="UTF-8" /><title>Test | UnRewrite</title><meta name="description" content="Test Page" /><link rel="shortcut icon" href="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f995.png" type="image/x-icon" /><meta name="generator" content="UnRewrite" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta property="og:type" content="website" /><meta property="og:title" content="Test | UnRewrite" /><meta property="og:description" content="Test Page" /><meta property="og:site_name" content="UnRewrite" /><meta property="og:image" content="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f995.png" /><meta property="twitter:card" content="summary" /><meta property="twitter:site" content="@windchime_yk" /><link rel="stylesheet" href="/style.css" /></head><body><header><h1>UnRewrite</h1></header><main>テスト</main><script src="/script.js" defer></script></body></html>
  `,
  );
});
