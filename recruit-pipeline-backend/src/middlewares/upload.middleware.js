const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads/' folder exists for temporary storage
const uploadDir = path.resolve('uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for resumes
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const mimetypes = /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
        
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed!'));
        }
    }
});

module.exports = upload;
