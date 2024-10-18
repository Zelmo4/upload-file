const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)

    req.on('aborted', () => {
      // Delete file if upload is aborted
      const fullPath = path.join('uploads', fileName);
      console.log('Deleting incomplete file:', fullPath);
      fs.unlinkSync(fullPath);
    });
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB file size limit
  },
   fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        //allow
        cb(null, true)
    } else if(file.mimetype === 'image/jpeg') {
        //allow
        cb(null, true)
    }
     else {
        cb(new Error('not allow other files without image/png'), false)
    }
  }
});

const app = express();
app.use(cors());

const port = 3000;

app.post('/upload', (req, res) => {
  upload.single('test')(req, res, (err) => {
    if (err) {
      console.log('Upload error:', err.message);
      res.status(400).json({ message: err.message });
      return res.req.destroy()
    }
    res.json({ message: 'Upload successful' });
  });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
  })