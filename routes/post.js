const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, Member } = require('../models');
const { login } = require('./middlewares');

const router = express.Router();

try{
    fs.readdirSync('uploads');
}catch(error){
    console.error('uploads 폴더가 없어 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'uploads/');
        },
        filename(req, file, cb){
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});

router.post('/img', upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
    console.log(req.body.url);
});

const upload2 = multer();
router.post('/', login, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            bookName: req.body.bookName,
            author: req.body.author,
            publisher: req.body.publisher,
            genre: req.body.genre,
            ISBN: req.body.ISBN,
            content: req.body.content,
            img: req.body.url,
            MemberId: req.cookies.memberId,
        });
        res.redirect('/main');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;