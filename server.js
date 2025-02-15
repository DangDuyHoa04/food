const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Kết nối tới MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://api:api123@cluster0.c217b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // Tăng thời gian chờ kết nối lên 10 giây
})
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Tạo schema và model cho "food" collection
const foodSchema = new mongoose.Schema({
  evaluate_id: Number,
  food_id: Number,
  food_name: String,
  food_image: String,
  food_price: Number,
  food_quantity: Number
});

const Food = mongoose.model('Food', foodSchema);

// Route để hiển thị danh sách tất cả các sản phẩm
app.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để hiển thị chi tiết một sản phẩm
app.get('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để thêm một sản phẩm mới
app.post('/foods', async (req, res) => {
  const food = new Food({
    evaluate_id: req.body.evaluate_id,
    food_id: req.body.food_id,
    food_name: req.body.food_name,
    food_image: req.body.food_image,
    food_price: req.body.food_price,
    food_quantity: req.body.food_quantity
  });

  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route để sửa một sản phẩm
app.patch('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    if (req.body.evaluate_id != null) food.evaluate_id = req.body.evaluate_id;
    if (req.body.food_id != null) food.food_id = req.body.food_id;
    if (req.body.food_name != null) food.food_name = req.body.food_name;
    if (req.body.food_image != null) food.food_image = req.body.food_image;
    if (req.body.food_price != null) food.food_price = req.body.food_price;
    if (req.body.food_quantity != null) food.food_quantity = req.body.food_quantity;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route để xóa một sản phẩm
app.delete('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    await food.remove();
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo một route đơn giản
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Bắt đầu server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
