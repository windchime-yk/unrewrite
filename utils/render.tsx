/** @jsx h */
import { h, render, resolve } from "../deps.ts";
import type {
  BodyProps,
  HeaderProps,
  HeadProps,
  InnerHTMLHelperParams,
  Meta,
  UnrewriteConfig,
} from "../model.ts";

const InnerHTMLHelper = ({ tagName, html }: InnerHTMLHelperParams) =>
  h(tagName, { dangerouslySetInnerHTML: { __html: html } });

export const detectStylePath = (config: UnrewriteConfig) =>
  config.overwriteCss
    ? resolve(Deno.cwd(), config.overwriteCss)
    : "./assets/style.css";

const titleTemplate = (
  { pageTitle, splitWord, siteName }: {
    pageTitle: string;
    splitWord: string;
    siteName: string;
  },
) => pageTitle ? `${pageTitle}${splitWord}${siteName}` : `${siteName}`;

const Head = ({ meta, config }: HeadProps) => {
  const title = titleTemplate({
    pageTitle: meta.title,
    splitWord: config.titleSplitWord,
    siteName: config.title,
  });

  return (
    <head>
      <meta charSet="UTF-8" />
      <title>{title}</title>
      <meta name="description" content={meta.description} />
      <link rel="shortcut icon" href={config.icon} type="image/x-icon" />
      <meta name="generator" content="UnRewrite" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:site_name" content={config.title} />
      <meta property="og:image" content={config.ogpImage} />
      <meta property="twitter:card" content="summary" />
      <meta
        property="twitter:site"
        content={config.twitterUserName && `@${config.twitterUserName}`}
      />
      <link rel="stylesheet" href="/style.css" />
    </head>
  );
};

const Header = ({ config }: HeaderProps) => (
  <header>
    <h1>{config.title}</h1>
  </header>
);

const Body = ({ config, content }: BodyProps) => (
  <body>
    <Header config={config} />
    <InnerHTMLHelper tagName="main" html={content} />
    <script src="/script.js" defer />
  </body>
);

const NotFoundContents = () => (
  <section>
    <h2>404 Not Found</h2>
    <p>このページにはコンテンツはありませんでした。TOPページに戻って探し直してください。</p>
    <a href="/">TOPページへ</a>
  </section>
);

export const generateNotFoundContents = (): string =>
  render(<NotFoundContents />);

export const renderHTML = (
  meta: Meta,
  config: UnrewriteConfig,
  content: string,
): string => `
  <!DOCTYPE html>
  ${
  render(
    <html>
      <Head meta={meta} config={config} />
      <Body config={config} content={content} />
    </html>,
  )
}
  `;
