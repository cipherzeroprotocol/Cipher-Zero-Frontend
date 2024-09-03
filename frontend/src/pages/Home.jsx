import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import NotificationComponent from '../components/NotificationComponent'; // Assuming this is where your notification component is located

const Home = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000); // Hide notification after 5 seconds
  };

  return (
    <>
      <Head>
        <title>Home - BitThetaSecure</title>
        <meta name="description" content="Welcome to BitThetaSecure, your gateway to secure and decentralized file management." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="home-container">
        <header className="header">
          <h1>Welcome to BitThetaSecure</h1>
          <p>Your secure platform for decentralized file management and communication.</p>
          <button onClick={handleShowNotification}>Show Notification</button>
        </header>

        <nav className="navigation">
          <ul>
            <li><Link href="/encryption"><a>Encryption</a></Link></li>
            <li><Link href="/gallery"><a>Gallery</a></Link></li>
            <li><Link href="/upload"><a>Upload</a></Link></li>
            <li><Link href="/share"><a>Share</a></Link></li>
          </ul>
        </nav>

        {showNotification && <NotificationComponent />}

        <style jsx>{`
          .home-container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .header {
            margin-bottom: 30px;
          }
          h1 {
            font-size: 2.5rem;
            color: #0070f3;
          }
          p {
            font-size: 1.2rem;
            color: #333;
          }
          button {
            padding: 10px 20px;
            background-color: #0070f3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #005bb5;
          }
          .navigation ul {
            list-style: none;
            padding: 0;
          }
          .navigation li {
            margin: 10px 0;
          }
          .navigation a {
            text-decoration: none;
            color: #0070f3;
            font-size: 1.2rem;
          }
          .navigation a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </>
  );
};

export default Home;
