import type { NextPage } from "next";
import Head from "next/head";
//import { GalleryView } from "../views";
import React from "react";
import GalleryView from "../views/GalleryView";

// Define the props interface if needed. Replace `any` with a more specific type.
interface GalleryProps {
  // Define any specific props if required
}

const Gallery: NextPage<GalleryProps> = (props: GalleryProps) => {
  return (
    <>
      <Head>
        <title>File Transfer</title>
        <meta name="description" content="File Transfer Gallery" />
      </Head>
      <main>
        <GalleryView apiUrl={""} />
      </main>
    </>
  );
};

export default Gallery;
