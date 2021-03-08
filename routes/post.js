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

router.post('/search', login, async (req, res, next) => {
    try {
        //입력받은 유저 닉네임 저장
        const searchid = req.body.searchID;

        //유저 닉네임을 가지고 해당 멤버 검색
        const searchmember = await Member.findOne({where: {nickname : searchid}});
        //console.log(searchmember.email);

        //210306 01:23 여기까지 일단 함
        //검색을 다른 페이지로 빼서 해야할거 같음
        //검색시 전송하는 데이터가 덮어씌워 버려서 member.id 값이 변경되어버림
        const posts = await Post.findAll({where: {memberId: searchmember.id}});
        res.render('search', {
            title: '검색 결과',
            members: searchmember,
            twits: posts,
        });
        //res.redirect('/main');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;