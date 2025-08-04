const multer = require('multer');
const storage = multer.diskStorage({
    deetination: function (req, file, cb){
        cb(null, '../storage')
    },
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.filename + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage});
module.exports = upload