const fs = require('fs');

const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 200 >> stream
BT
/F1 12 Tf
72 720 Td
(Software Engineer Resume - John Doe) Tj
0 -20 Td
(Email: alex.chen@example.com Phone: 415-555-0199 San Francisco, CA) Tj
0 -20 Td
(Skills: Python, React, TypeScript, Docker, SQL, Machine Learning, Git, Node.js) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000495 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
568
%%EOF`;

fs.writeFileSync('sample_test_resume.pdf', pdfContent);

async function testExtract() {
  const fileBuffer = fs.readFileSync('sample_test_resume.pdf');
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  const form = new FormData();
  form.append('resume', blob, 'sample_test_resume.pdf');

  const targetUrl = process.env.VITE_BACKEND_URL ? `${process.env.VITE_BACKEND_URL}/extract-skills` : 'http://localhost:8000/extract-skills';
  console.log(`Sending resume to ${targetUrl}...`);
  const res = await fetch(targetUrl, {
    method: 'POST',
    body: form,
    headers: {
      'Origin': 'http://localhost:8085'
    }
  });

  console.log('Response status:', res.status);
  console.log('CORS headers:', {
    'access-control-allow-origin': res.headers.get('access-control-allow-origin'),
    'access-control-allow-methods': res.headers.get('access-control-allow-methods')
  });

  const data = await res.json();
  console.log('Extracted data:', JSON.stringify(data, null, 2));
}

testExtract().catch(console.error);
