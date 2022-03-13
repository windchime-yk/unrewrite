import { getFileList, resolve, statusCode } from "./deps.ts";
import type { Handler, StatusCodeNumber } from "./deps.ts";
import { userConfig } from "./utils/config.ts";
import { getFrontData, novelDataList } from "./utils/getData.ts";
import { mergeConfig } from "./utils/config.ts";
import {
  detectStylePath,
  generateNotFoundContents,
  renderHTML,
} from "./utils/render.tsx";
import type { MimeType } from "./model.ts";

const responseInit = (
  contentType: MimeType,
  status: StatusCodeNumber = 200,
): ResponseInit => ({
  headers: { "content-type": contentType },
  status,
});

/**
 * UnRewriteのハンドラー関数。
 * std/httpのserveモジュールに受け渡しすることで利用可能。
 * @param req リクエスト
 */
export const handler: Handler = async (req) => {
  const { pathname } = new URL(req.url);
  const mergedConfig = mergeConfig(userConfig);

  if (pathname.startsWith("/style.css")) {
    const styleFile = await Deno.readFile(detectStylePath(mergedConfig));
    return new Response(styleFile, responseInit("text/css"));
  }

  if (pathname.startsWith("/script.js")) {
    const scriptFile = await Deno.readFile("./assets/script.js");
    return new Response(scriptFile, responseInit("text/javascript"));
  }

  const imagePathUrlPattern = new URLPattern({ pathname: "/images/:path" });
  const imagePathUrlPathname =
    imagePathUrlPattern.exec(req.url)?.pathname.groups.path;
  const imagePathArray = imagePathUrlPathname?.split(".") ?? [];
  const imageDir = resolve(Deno.cwd(), mergedConfig.baseDir ?? "", "images");
  const imageList = await getFileList(imageDir);

  for (const image of imageList) {
    if (imagePathUrlPattern.test(req.url) && req.url.includes(image.name)) {
      const imageFile = await Deno.readFile(
        resolve(imageDir, imagePathUrlPathname ?? ""),
      );

      if (imagePathArray[1] === "jpg" || imagePathArray[1] === "jpeg") {
        return new Response(imageFile, responseInit("image/jpeg"));
      }
      if (imagePathArray[1] === "png") {
        return new Response(imageFile, responseInit("image/png"));
      }
      if (imagePathArray[1] === "svg") {
        return new Response(imageFile, responseInit("image/svg+xml"));
      }
    }
  }

  if (pathname === "/") {
    return new Response(
      renderHTML(
        (await getFrontData()).meta,
        mergedConfig,
        (await getFrontData()).content,
      ),
      responseInit("text/html"),
    );
  }

  for (const novelData of novelDataList) {
    if (
      pathname.includes(novelData!.path)
    ) {
      return new Response(
        renderHTML(
          novelData!.meta,
          mergedConfig,
          novelData!.content,
        ),
        responseInit("text/html"),
      );
    }
  }

  return new Response(
    renderHTML(
      {
        title: "404 Not Found",
        description: "このURLにコンテンツはありません",
      },
      mergedConfig,
      generateNotFoundContents(),
    ),
    responseInit("text/html", statusCode.notFound),
  );
};
