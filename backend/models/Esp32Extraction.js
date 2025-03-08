const mongoose = require('mongoose');

const Esp32ExtractionSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    required: true,
    default: 'ESP32',
    enum: ['ESP32'], // Restrict to ESP32 only
  },
  deviceId: { type: String, required: true }, // e.g., serial port or custom ID
  timestamp: { type: Date, default: Date.now },
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hash: { type: String, required: true }, // SHA-256 hash of file
  filePath: { type: String, required: true }, // Path to stored .bin file
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  metadata: {
    serialPort: { type: String, required: true }, // e.g., "COM3" or "/dev/ttyUSB0"
    flashSize: { type: Number }, // Size of flash memory in bytes (optional)
    fileType: { type: String, default: 'binary' }, // e.g., "binary", "firmware"
  },
  error: { type: String }, // Optional error message if extraction failed
});

module.exports = mongoose.model('Esp32Extraction', Esp32ExtractionSchema);