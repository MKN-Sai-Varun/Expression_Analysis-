import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', CounterSchema, 'counters');

export default Counter;
