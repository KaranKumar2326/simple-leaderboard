import * as XLSX from 'xlsx';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwLdAQOZc9raTNckS0fkPXh2sJE-BXIRKdw8G3SpBuucQJjJ383tQIM8YTTlw6qpmb5Ng/exec';

async function main() {
  console.log('Reading Tuition_Championship_Data.xlsx...');
  const wb = XLSX.readFile('Tuition_Championship_Data.xlsx');

  const sheetsPayload = wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName];
    // Convert worksheet to 2D array of values
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    console.log(`Sheet "${sheetName}": ${data.length} rows`);
    return {
      name: sheetName,
      data,
    };
  });

  const payload = {
    sheets: sheetsPayload,
  };

  console.log(`Sending payload to Web App (${JSON.stringify(payload).length} bytes)...`);

  const response = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    redirect: 'follow', // Google Apps Script redirects on POST
  });

  const text = await response.text();
  console.log('Response status:', response.status);
  console.log('Response body:', text);
}

main().catch((err) => {
  console.error('Error pushing data:', err);
});
