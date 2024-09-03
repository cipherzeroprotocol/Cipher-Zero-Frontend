import { useRouter } from 'next/router';
import { serverConfig } from 'server';
import Head from 'next/head';
import Layout from 'components/layout.js';
import Link from 'next/link';

const Success = () => {
  const router = useRouter();
  const { guid } = router.query;

  if (!guid) {
    return (
      <Layout>
        <Head>
          <title>Error</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <main>
          <h1>Error</h1>
          <p>GUID is missing. Please check the link and try again.</p>
        </main>
      </Layout>
    );
  }

  const downloadUrl = `${serverConfig['uri']}/download/${guid}`;

  return (
    <>
      <Layout>
        <Head>
          <title>Share</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <main>
          <h2>Your Code</h2>
          <h1>{guid}</h1>
          <Link href={downloadUrl} passHref>
            <h2>
              <a>
                {downloadUrl}
              </a>
            </h2>
          </Link>
        </main>

      </Layout>

      <style jsx>{`
        h1 {
          font-size: 130px;
          color: #65ffcc;
          margin: 0;
        }
        h2 {
          font-size: 50px;
          margin-top: 15vh;
        }
        h2 a {
          border-bottom: 5px solid black;
          text-decoration: none;
          color: inherit;
        }
        h2 a:hover {
          border-bottom: 5px solid #65ffcc;
        }
        main {
          width: 80%;
          margin: 0 auto;
          margin-top: 15vh;
          text-align: center;
        }
        @media (max-width: 500px) {
          h1 {
            font-size: 110px;
          }
          h2 {
            font-size: 30px;
          }
          h2 a {
            line-height: 50px;
            word-wrap: break-word;
          }
        }
      `}</style>
    </>
  );
};

export default Success;
