const mongoose = require('mongoose');

const ExtractionSchema = new mongoose.Schema({
  deviceType: { // e.g., 'ESP32', or 'BLE'
    type: String,
    required: true,
    enum: ["ESP32", "BLE"]
},
  deviceId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hash: { type: String, required: true },
  filePath: { type: String, required: true },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Extraction', ExtractionSchema);