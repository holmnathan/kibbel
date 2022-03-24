// Import NPM Packages
import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useEffect } from "react";

// Import Local Modules
import "@kibbel/styles/globals.css";
import { client } from "@kibbel/library/apollo";
import { Layout } from "@kibbel/components";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
  }, []);

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
