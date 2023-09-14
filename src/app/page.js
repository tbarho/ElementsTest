'use client';

import { useEffect, useState } from 'react';


// fetch token from local api/jwt route
async function getToken() {
  const res = await fetch('/api/jwt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sellerId: 1234,
    }),
  });

  const token = await res.json();

  return token;
}

export default function Home() {
  const [networkStatus, _setNetworkStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  function setNetworkStatus(status) {
    _setNetworkStatus((networkStatus) => `${networkStatus}\n${status}`);
  }

  useEffect(() => {
    async function testElements() {
      setNetworkStatus('Loading Elements SDK...');
      const { ElementsSDK } = await import('https://cdn.shipengine.com/0.mjs')
      
      setNetworkStatus('Fetching token...');
      const token = await getToken();
      const baseURL = 'https://elements-staging.shipengine.com';
      const brandName = 'Ink.Works - Development - Product';

      function onError() {
        alert('error');
      }

      setNetworkStatus('Initializing Elements SDK...');
      const eSDK = new ElementsSDK(token, {
        baseURL,
        brandName,
        onError,
      });

      setNetworkStatus('Initializing Elements Client...');
      const eClient = eSDK.getClient(token, {
        baseURL,
        getToken,
      });

      setNetworkStatus('Fetching carriers...');

      try {
        const carriers = await eClient.carriers.list();
        console.log({ carriers });
      } catch (e) {
        
        setError('Something went wrong.  Check the console for more details.');
      }
    }

    testElements();
  }, []);

  return (
    <main className="max-w-7xl p-20">
      <pre className="bg-zinc-900 text-zinc-300 p-4 rounded-lg">
        {networkStatus}
      </pre>
      {error && (
        <pre className="bg-red-900 text-red-300 p-4 rounded-lg mt-10">{error}</pre>
      )}
    </main>
  );
}
