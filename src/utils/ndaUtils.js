export const generateNDATemplate = (
  name,
  date,
  signature = null,
  format = "text"
) => {
  if (format === "text") {
    return `
MUTUAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into on ${date} by and between:

${name} ("Participant")  
AND  
KETI AI ("Company")

1. Purpose  
The purpose of this Agreement is to protect confidential information shared between the Participant and the Company.

2. Confidential Information  
"Confidential Information" includes any proprietary information, technical data, trade secrets, or know-how.

3. Term  
This Agreement shall remain in effect from the date of execution.

4. Non-Disclosure  
The Participant agrees to:  
- Keep all Confidential Information strictly confidential  
- Not use Confidential Information except as authorized  
- Not disclose Confidential Information to third parties  

Signed by: ${name}  
Date: ${date}  
${signature ? "[Signature Attached]" : ""}
    `;
  }

  // HTML version (for downloads)
  return `
<!DOCTYPE html>
<html>
<head>
    <title>NDA Document</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .signature-section { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; }
        .signature-image { max-width: 200px; margin-top: 10px; }
    </style>
</head>
<body>
    <h2>MUTUAL NON-DISCLOSURE AGREEMENT</h2>
    <p>This Non-Disclosure Agreement (the "Agreement") is entered into on ${date} by and between:</p>
    <p><strong>${name}</strong> ("Participant")<br>AND<br><strong>CHIL HYGIENE CENTER</strong> ("Company")</p>
    <h3>1. Purpose</h3>
    <p>The purpose of this Agreement is to protect confidential information shared between the Participant and the Company.</p>
    <h3>2. Confidential Information</h3>
    <p>"Confidential Information" includes any proprietary information, technical data, trade secrets, or know-how.</p>
    <h3>3. Term</h3>
    <p>This Agreement shall remain in effect from the date of execution.</p>
    <h3>4. Non-Disclosure</h3>
    <p>The Participant agrees to:</p>
    <ul>
        <li>Keep all Confidential Information strictly confidential</li>
        <li>Not use Confidential Information except as authorized</li>
        <li>Not disclose Confidential Information to third parties</li>
    </ul>
    <div class="signature-section">
        <p><strong>Signed by:</strong> ${name}<br><strong>Date:</strong> ${date}</p>
        ${
          signature
            ? `<img src="${signature}" class="signature-image" alt="Signature"/>`
            : ""
        }
    </div>
</body>
</html>`;
};
