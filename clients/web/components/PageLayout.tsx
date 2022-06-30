import { NavBar } from "@kibbel/components";
import Head from "next/head";
import type { ReactNode } from "react";

type TProps = {
  children?: ReactNode;
};

export const PageLayout = ({ children }: TProps) => {
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
