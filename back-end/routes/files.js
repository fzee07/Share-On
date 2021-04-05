const router = require('express').Router();
const multer = require('multer');
const path = require('path');


let storage = multer.diskStorage({
    destination: (req, file, callBack) => callBack(null, 'uploads/'),
    filename: (req, file, callBack) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        callBack(null, uniqueName);
    }
})


let upload = multer({
    storage, //storage:storage
    limit: { fileSize: 1000000 * 100 }

}).single('myfile');



router.post('/', (req, res) => {
    //Validate requests
    if (!req.file) {
        return res.json({ error: 'All fields are required.' });
    }

    //Store files
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send({ error: err.message })
        }

        //Store into Database

    })




    //Response -> Link
});


module.exports = router;