import multer from 'multer';
import path from 'path';

// Storage config for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // folder to store images
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

// Allow all image MIME types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'));
  }
};

const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
});

export default uploadImage;
