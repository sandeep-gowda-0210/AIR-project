const express = require('express');
const multer = require('multer');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authenticateUser = require('../middleware/authMiddleware');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx|txt/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname.toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only .pdf, .doc, .docx, and .txt files are allowed'), false);
    }
  },
});

// Protect all document routes
router.use(authenticateUser);

// Routes
router.post('/upload', upload.single('file'), documentController.uploadFile);
router.post('/create-folder', documentController.createFolder);
router.get('/list', documentController.listFiles);
router.get('/list-root', documentController.listRootFiles);  // 🆕 List all root files of user
router.patch('/rename/:id', documentController.renameFileOrFolder); // 🆕 Rename
router.delete('/delete/:id', documentController.deleteFileOrFolder);
router.get('/preview/:id', documentController.previewFile);

// Error handling middleware for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;


/*
const express = require('express');
const multer = require('multer');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authenticateUser = require('../middleware/authMiddleware');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx|txt/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname.toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only .pdf, .doc, .docx, and .txt files are allowed'), false);
    }
  },
});

// Protect all document routes
router.use(authenticateUser);

// Routes
router.post('/upload', upload.single('file'), documentController.uploadFile);
router.post('/create-folder', documentController.createFolder);
router.get('/list', documentController.listFiles);
router.get('/list-root', documentController.listRootFiles);  // 🆕 List all root files of user
router.patch('/rename/:id', documentController.renameFileOrFolder); // 🆕 Rename
router.delete('/delete/:id', documentController.deleteFileOrFolder);
router.get('/preview/:id', documentController.previewFile);

module.exports = router;
*/
