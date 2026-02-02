const multer = require('multer');
const path = require('path');

// Memory storage keeps files as Buffers, which is better for small files and Cloudinary streaming
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for resumes
    fileFilter: (req, file, cb) => {
        console.log(`📂 Upload Middleware: checking file ${file.originalname} (${file.mimetype})`);
        const filetypes = /pdf|doc|docx/;
        const mimetypes = /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
        
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (extname && mimetype) {
            console.log("✅ File accepted by filter");
            return cb(null, true);
        } else {
            console.error("❌ File rejected by filter");
            cb(new Error('Only PDF and Word documents are allowed!'));
        }
    }
});

module.exports = upload;
