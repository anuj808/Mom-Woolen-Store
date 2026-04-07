export const sendOtpSms = async (phone, otp) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('\n┌─────────────────────────────┐');
    console.log(`│  📱 OTP for +91 ${phone}  │`);
    console.log(`│  🔑 Code: ${otp}              │`);
    console.log('└─────────────────────────────┘\n');
    return;
  }

  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      route: 'otp',
      variables_values: otp,
      numbers: phone,
    }),
  });

  const data = await response.json();
  if (!data.return) throw new Error(data.message || 'SMS delivery failed.');
};