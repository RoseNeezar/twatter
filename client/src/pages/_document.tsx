// @ts-nocheck
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta property="og:site_name" content="chat" />
          <meta property="twitter:card" content="summary" />
          <meta property="og:type" content="website" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-dark-main">
          <Main suppresHydrationWarning />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
