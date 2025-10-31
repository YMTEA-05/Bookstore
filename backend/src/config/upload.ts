import multer from 'multer';
import path from 'path';

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files to the 'uploads' directory in the backend root
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename: timestamp + original name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check for file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|gif/;
  // src/config/upload.ts
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

export default upload;