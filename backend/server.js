const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const Grid = require('gridfs-stream');
const methodOverride = require('method-override')
const crypto = require('crypto');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware from video
app.use(bodyParser.json());
//app.use(methodOverride('_method'));
//app.set('view engine', 'ejs');

//Init gfs from video
let gfs;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");

    //gfs = Grid(connection.db, mongoose.mongo);
    //gfs.collection('uploads');
});

//Create storage engine from video
const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

const upload = multer({ storage });

//app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  //res.redirect('/');
//});

//app.get('/image/:filename', (req, res) => {
//    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
//      if (!file || file.length === 0) {
//        return res.status(404).json({
//          err: 'No file exists'
//        });
//      }
  
//      try {
        // Read output to browser
//        const readstream = gfs.createReadStream(file.filename);
//        readstream.pipe(res);
//      } catch {
//        res.status(404).json({
//          err: 'Didnt work'
//        });
//      }
//    });
//  });

const recordingsRouter = require('./routes/recordings');
const usersRouter = require('./routes/users');
const webRouter = require('./routes/web');

app.use('/recordings', recordingsRouter);
app.use('/', webRouter);
app.use('/api/users', usersRouter);


app.listen(port, () => {
    console.log('Server is running on port: ${port}')
});
