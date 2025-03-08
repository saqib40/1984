const axios = require('axios');
const BleExtraction = require('../models/BleExtraction'); // Updated model
const hashFile = require('../utils/hashFile');
const fs = require('fs');
require('dotenv').config();

scanBLE = async (req, res) => {
  const { isolated = false } = req.body;

  try {
    const response = await axios.post(`${process.env.FLASK_API_URL}/ble/scan`, { isolated });
    const devices = response.data.devices;
    if (!devices || devices.length === 0) {
      return res.status(400).json({ error: 'No BLE devices found' });
    }

    const extractions = [];
    for (const device of devices) {
      const filePath = `./extractions/ble_data_${device.address}_${Date.now()}.json`;
      const dataString = JSON.stringify(device);
      fs.writeFileSync(filePath, dataString);
      const hash = hashFile(filePath);

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
      await extraction.save();
      extractions.push({ ...device, hash, filePath });
    }

    res.json({ devices: extractions });
  } catch (error) {
    console.error('BLE scan error:', error.message);
    res.status(500).json({ error: error.response?.data?.error || 'BLE scan failed' });
  }
};

getBLE = async(req,res) => {

}

module.exports = {getBLE, scanBLE};