const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Uploads a buffer to Cloudinary using stream.
 * @param {Buffer} buffer - File buffer from multer
 * @param {Object} options - Cloudinary upload options (folder, etc.)
 * @returns {Promise} - Cloudinary result object
 */
const uploadFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { uploadFromBuffer };
