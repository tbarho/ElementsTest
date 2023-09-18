'use client';

import { useCallback, useEffect, useState } from 'react';


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
  const [sdk, setSdk] = useState(null);
  const [json, setJson] = useState(null);

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
      // const brandName = 'paypal';

      function onError() {
        alert('error');
      }

      setNetworkStatus('Initializing Elements SDK...');
      const eSDK = new ElementsSDK(token, {
        baseURL,
        // brandName,
        onError,
      });

      setNetworkStatus('Setting SDK...');
      setSdk(eSDK);
      window.sdk = eSDK;
    }

    testElements();
  }, []);

  const onboardUser = useCallback(() => {
    console.log('click');
    if (!window.sdk) {
      return;
    }

    console.log('i have an sdk... trying')
    console.log(sdk);

    window.sdk.onboardUser({
      onCompleteOnboarding() {
        setNetworkStatus('On Boarding Completed.');
      }
    }, {}, {
      onClickClose() {
        sdk.closeSidePanel();
      }
    })
  }, [window.sdk])

  return (
    <main className="max-w-7xl p-20">
      <pre className="bg-zinc-900 text-zinc-300 p-4 rounded-lg">
        {networkStatus}
      </pre>
      {sdk ? (
        <button onClick={onboardUser} className="mt-12 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Onboard User</button>
      ) : null}
      {error && (
        <pre className="bg-red-900 text-red-300 p-4 rounded-lg mt-10">{error}</pre>
      )}
    </main>
  );
}
