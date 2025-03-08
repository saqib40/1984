const mongoose = require('mongoose');

const CharacteristicSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  description: { type: String },
  handle: { type: Number },
  properties: { type: [String] }, // e.g., ["read", "write"]
  value: { type: String }, // Hex string or null
});

const ServiceSchema = new mongoose.Schema({
  description: { type: String },
  uuid: { type: String, required: true },
  characteristics: [CharacteristicSchema],
});

const BleExtractionSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    required: true,
    default: 'BLE',
    enum: ['BLE'], // Restrict to BLE only
  },
  deviceId: { type: String, required: true }, // e.g., MAC address or UUID
  timestamp: { type: Date, default: Date.now },
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hash: { type: String, required: true }, // SHA-256 hash of file
  filePath: { type: String, required: true }, // Path to stored JSON file
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  mode: { type: String, enum: ['isolated', 'crowded'], required: true }, // Extraction context
  metadata: {
    name: { type: String }, // Device name (often null for BLE)
    rssi: { type: Number }, // Signal strength
    details: { type: String }, // Stringified CBPeripheral details
    manufacturerData: { type: Map, of: String }, // e.g., { "6": "010920..." }
    uuids: { type: [String], default: [] }, // Advertised service UUIDs
  },
  services: [ServiceSchema], // BLE services and characteristics
  error: { type: String }, // Optional error message if extraction failed
});

module.exports = mongoose.model('BleExtraction', BleExtractionSchema);