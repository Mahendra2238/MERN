const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');   
const Razorpay = require('razorpay');
const Payment = require('./models/Payment'); // Assuming you have a Payment model defined in models/Payment.js

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
     useNewUrlParser: true,
      useUnifiedTopology: true 
    }).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create an order
app.post('/create-order', async (req, res) => {
    const { amount, currency, receipt } = req.body;

    const options = {
        amount: amount, // amount in the smallest currency unit
        currency: currency,
        receipt: `receipt_${Math.random()*1000}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send({error: error.message});
    }   
});

// Route to save payment details after success
app.post('/save-payment', async (req, res) => {
    const{ razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, currency } = req.body;

    try{
        const payment = new Payment({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            amount,
            currency,
            status: 'success'
        });
        await payment.save();
        res.json({message: "Payment saved successfully"});
    } catch (error) {
        res.status(500).json({error: 'Error saving payment'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




