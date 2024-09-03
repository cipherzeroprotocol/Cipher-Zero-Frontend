import type { NextPage } from "next";
import Head from "next/head";
//import HomeView from "../views/HomeView";
import React from "react";
import HomeView from "../views/HomeView";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>BitThetaSecure</title>
                <meta name="description" content="Welcome to BitThetaSecure, your gateway to secure blockchain solutions." />
            </Head>
            <HomeView galleryApiUrl={""} featuredApiUrl={""} />
        </>
    );
};

export default Home;
