const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = destination => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'votingSystem', destination);
    
    // Check if the directory exists, if not, create it recursively
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir); // use the created directory
  },
  filename: (req, file, cb) => {
    const accountAddress = req.accountAddress; // Ensure this is correctly set
    cb(null, accountAddress + path.extname(file.originalname));
  }
});

module.exports = {
  uploadCandidate: multer({ storage: storage('CandidateImages') }).single('file'),
  uploadVoter: multer({ storage: storage('VoterImages') }).single('file'),
};
