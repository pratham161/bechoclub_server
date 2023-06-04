const base = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp";

const generateOtp = async()=>{
    const request = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6Z`,
      },
      body: JSON.stringify({
        "id_number": "725984803276"
      }),
    });
 
   const response = await request.json();
   console.log(response);
}