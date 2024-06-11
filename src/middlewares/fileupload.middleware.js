// 1. Import multer
import multer from "multer";

// 2.Configure storage with fileName and location
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString + file.originalname);
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

// const upload = multer({ storage: storage });

export  const upload = multer({ storage: storage });

