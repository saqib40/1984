const crypto = require('crypto');
const fs = require('fs');

const hashFile = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(new Error(`Failed to read file: ${err.message}`)));
    } catch (err) {
      reject(new Error(`Hashing failed: ${err.message}`));
    }
  });
};

module.exports = hashFile;