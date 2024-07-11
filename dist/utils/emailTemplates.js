export const contactMailTamplate = (
  customerName,
  customerEmail,
  customerMobile,
  customerQuery
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .content {
            margin: 20px 0;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.6;
            color: #555;
        }
        .content .label {
            font-weight: bold;
            color: #333;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            color: #aaa;
            font-size: 12px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Contact Query</h1>
        </div>
        <div class="content">
            <p><span class="label">Name:</span> ${customerName}</p>
            <p><span class="label">Mobile:</span> ${customerMobile}</p>
            <p><span class="label">Email:</span> ${customerEmail}</p>
            <p><span class="label">Query:</span> ${customerQuery}</p>
        </div>
        <div class="footer">
            <p>Thank you for reaching out to us.</p>
        </div>
    </div>
</body>
</html>
`;
};
