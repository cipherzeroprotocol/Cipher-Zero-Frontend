import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// Optional configuration for the alert provider
const alertOptions = {
  position: positions.BOTTOM_LEFT, // Position of the alert
  timeout: 5000, // Duration for which the alert is visible
  offset: "10px", // Distance from the edge of the screen
  transition: transitions.SCALE, // Transition effect for the alert
};

const Mint: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Mint NFT!</title>
        <meta name="description" content="NFT" />
      </Head>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        {/* You can place your page content here */}
        <h1>Mint Your NFT</h1>
        {/* More content */}
      </AlertProvider>
    </div>
  );
};

export default Mint;
