const axios = require('axios');
const BleExtraction = require('../models/BleExtraction');
const hashFile = require('../utils/hashFile');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const scanBLE = async (req, res) => {
  const { isolated = false, timeout = 60000 } = req.body; // Default timeout 60s if not provided

  try {
    const flaskUrl = `${process.env.FLASK_API_URL}/ble/scan`;
    console.log(`Requesting BLE scan from: ${flaskUrl} with timeout: ${timeout}ms, isolated: ${isolated}`);

    const extractionDir = path.join(__dirname, '../extractions');
    if (!fs.existsSync(extractionDir)) {
      fs.mkdirSync(extractionDir, { recursive: true });
    }

    const response = await axios.post(
      flaskUrl,
      { isolated, timeout }, // Pass timeout to Flask
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout, // Enforce timeout at axios level
      }
    );

    const devices = response.data.devices;
    if (!devices || devices.length === 0) {
      return res.status(400).json({ error: 'No BLE devices found' });
    }

    const extractions = [];
    for (const device of devices) {
      // Check if deviceId already exists in the database
      const existingDevice = await BleExtraction.findOne({ deviceId: device.address });
      if (existingDevice) {
        console.log(`Skipping duplicate device: ${device.address}`);
        extractions.push({ ...existingDevice.toObject(), hash: existingDevice.hash, filePath: existingDevice.filePath });
        continue;
      }

      const filePath = path.join(extractionDir, `ble_data_${device.address}_${Date.now()}.json`);
      const dataString = JSON.stringify(device);
      fs.writeFileSync(filePath, dataString);
      const hash = await hashFile(filePath);

      const extraction = new BleExtraction({
        deviceId: device.address,
        operatorId: req.user.id,
        hash,
        filePath,
        status: device.error ? 'failed' : 'completed',
        mode: isolated ? 'isolated' : 'crowded',
        metadata: {
          name: device.name,
          rssi: device.rssi,
          details: device.details,
          manufacturerData: device.metadata?.manufacturer_data,
          uuids: device.metadata?.uuids || [],
        },
        services: device.services || [],
        error: device.error || null,
      });

      try {
        await extraction.save();
        extractions.push({ ...device, hash, filePath });
      } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
          console.log(`Duplicate deviceId detected and skipped: ${device.address}`);
          const existing = await BleExtraction.findOne({ deviceId: device.address });
          extractions.push({ ...existing.toObject(), hash: existing.hash, filePath: existing.filePath });
        } else {
          throw error; // Re-throw other errors
        }
      }
    }

    res.status(200).json({ devices: extractions });
  } catch (error) {
    console.error('BLE scan error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      stack: error.stack,
    });
    res.status(500).json({
      error: error.response?.data?.error || error.message || 'BLE scan failed',
      details: error.code || error.message,
      status: error.response?.status,
    });
  }
};

const getBLE = async (req, res) => {
  try {
    const extractions = await BleExtraction.find({ operatorId: req.user.id })
      .populate('operatorId', 'email')
      .sort({ timestamp: -1 });
    if (!extractions || extractions.length === 0) {
      return res.status(404).json({ error: 'No BLE extractions found for this user' });
    }
    res.status(200).json({ extractions });
  } catch (error) {
    console.error('Get BLE error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve BLE extractions', details: error.message });
  }
};

module.exports = {scanBLE, getBLE};