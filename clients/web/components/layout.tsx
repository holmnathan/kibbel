import type { ReactNode } from "react";
import Head from "next/head";
import { NavBar } from "@kibbel/components";

type TProps = {
  children?: ReactNode;
};

const Layout = ({ children }: TProps) => {
  return (
    <>
      <Head>
        <title>Kibbel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main>{children}</main>
    </>
  );
};

export { Layout };
