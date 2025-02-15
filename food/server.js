const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Kết nối tới MongoDB
const mongoURI = 'mongodb+srv://api:api123@cluster0.c217b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Tạo schema và model cho "food" collection
const foodSchema = new mongoose.Schema({
  name: String,
  calories: Number,
});

const Food = mongoose.model('Food', foodSchema);

// Kiểm tra xem "food" collection đã tồn tại hay chưa, nếu chưa thì tạo mới
Food.createCollection()
  .then(() => console.log('"food" collection is ready'))
  .catch(err => console.error('Error creating "food" collection:', err));

// Tạo một route đơn giản
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Bắt đầu server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

