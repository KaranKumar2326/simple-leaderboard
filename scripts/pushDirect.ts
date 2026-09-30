import { DEMO_STUDENTS, DEMO_TESTS, DEMO_TEST_RESULTS, DEMO_PRIZES } from '../src/services/demoData.ts';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwLdAQOZc9raTNckS0fkPXh2sJE-BXIRKdw8G3SpBuucQJjJ383tQIM8YTTlw6qpmb5Ng/exec';

function objectArrayTo2D(arr: Record<string, any>[]): any[][] {
  if (arr.length === 0) return [];
  const headers = Object.keys(arr[0]);
  const rows = arr.map((item) => headers.map((key) => item[key]));
  return [headers, ...rows];
}

async function main() {
  console.log('Preparing data for Google Sheet...');

  const sheetsPayload = [
    {
      name: 'STUDENTS',
      data: objectArrayTo2D(DEMO_STUDENTS),
    },
    {
      name: 'TESTS',
      data: objectArrayTo2D(DEMO_TESTS),
    },
    {
      name: 'TEST_RESULTS',
      data: objectArrayTo2D(DEMO_TEST_RESULTS),
    },
    {
      name: 'PRIZES',
      data: objectArrayTo2D(DEMO_PRIZES),
    },
  ];

  sheetsPayload.forEach((s) => {
    console.log(`Sheet "${s.name}": ${s.data.length} rows`);
  });

  const payload = {
    sheets: sheetsPayload,
  };

  const jsonString = JSON.stringify(payload);
  console.log(`Sending payload to Web App (${jsonString.length} bytes)...`);

  const response = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain', // Use text/plain to avoid CORS preflight / redirect body loss in Google Apps Script
    },
    body: jsonString,
    redirect: 'follow',
  });

  const text = await response.text();
  console.log('Response status:', response.status);
  console.log('Response body:', text);
}

main().catch((err) => {
  console.error('Error pushing data:', err);
});
