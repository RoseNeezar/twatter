import React from "react";
import Head from "next/head";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>???</title>
      </Head>
      <div className="flex items-center justify-center h-screen bg-dark-main">
        <p className="text-xl text-dark-txt">
          Hmm...this page doesn’t exist. Try searching for something else.
        </p>
      </div>
    </>
  );
};

export default NotFound;
