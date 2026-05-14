// ==============================================
// SCROLLCASH BACKEND SERVER — REAL PAYMENT SYSTEM
// ==============================================
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ YOUR GCASH/MAYA BUSINESS API DETAILS
const PAYMENT_GATEWAY = {
    url: "https://api.gcash.com/remit/send",
    key: "GCASH-BUSINESS-KEY-123456",
    secret: "GCASH-SECRET-KEY-789012"
};

// ✅ REAL SEND MONEY ENDPOINT
app.post('/api/send-payment', async (req, res) => {
    try {
        const { amount, method, account, userId } = req.body;

        // 🔹 STEP 1: SEND TO PAYMENT PROVIDER
        const paymentRes = await axios.post(PAYMENT_GATEWAY.url, {
            amount: amount,
            currency: "PHP",
            recipient: account,
            method: method,
            referenceId: "TXN_" + Date.now()
        }, {
            headers: {
                "Authorization": `Bearer ${PAYMENT_GATEWAY.key}`,
                "Content-Type": "application/json"
            }
        });

        if(paymentRes.data.status === "SUCCESS") {
            return res.json({
                success: true,
                txId: paymentRes.data.transactionId,
                message: "Money sent successfully!"
            });
        } else {
            return res.json({ success: false, message: paymentRes.data.message || "Payment failed" });
        }

    } catch (err) {
        console.error("Payment Error:", err.message);
        return res.status(500).json({ success: false, message: "Server error: " + err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ ScrollCash Server running at http://localhost:${PORT}`);
});
