const express = require('express');
const { login, notLogin } = require('./middlewares');
const { Post, Member, Hashtag, DailyNote } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.member = req.member;
    res.locals.followerCount = req.member ? req.member.Followers.length : 0;
    res.locals.followingCount = req.member ? req.member.Followings.length : 0;;
    res.locals.followerIdList = req.member ? req.member.Followings.map(f => f.id) : [];
    next();
});

//자신의 프로필은 로그인 상태에서만 확인 가능
router.get('/profile', login, (req, res) => {
    loginemail = req.cookies['loginemail'];
    Member.findOne({ where: { email: loginemail } }).then((member) => {
        res.render('profile', {
            title: '내정보',
            members: member,
        });
    });
    // res.render('profile', { title: '내정보' });
});

//로그인 되지 않은 상태에서만 가입 가능
router.get('/join', notLogin, (req, res) => {
    res.render('join', { title: '회원가입' });
});

router.get('/main', login, async (req, res) => {
    try {
        //main 화면에 띄울 데이터 가져오기
        const posts = await Post.findAll({
            include: {
                model: Member, attributes: ['id', 'nickname'],
            },
            order: [['createdAt', 'DESC']],
        });
        loginemail = req.cookies['loginemail'];
        Member.findOne({ where: { email: loginemail } }).then((member) => {
            res.render('main', {
                title: '포스트 보기',
                members: member,
                twits: posts,
            });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/myboard', login, async (req, res) => {
    try {
        //main 화면에 띄울 데이터 가져오기
        memberid = req.cookies['memberId'];
        const posts = await Post.findAll({where: { memberId: memberid },
            include: {
                model: Member, attributes: ['id', 'nickname'],
            },
            order: [['createdAt', 'DESC']],
        });
        loginemail = req.cookies['loginemail'];
        Member.findOne({ where: { email: loginemail } }).then((member) => {
            res.render('main', {
                title: '포스트 보기',
                members: member,
                twits: posts,
            });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//post 생성
router.get('/post', login, async (req, res) => {
    res.render('post', {
        title: '서평 작성',
    });
});

//작업일지 작성(관리자 전용 기능)
router.get('/dailynote', login, async (req, res) => {
    const dailys = await DailyNote.findAll({
        order: [['createdAt', 'DESC']],
    })
    res.render('dailynote', {
        title: '작업일지',
        days: dailys,
    });
});

router.get('/', async (req, res, next) => {
    res.render('index', {
        title: 'BookBoard',
    });
});

//해시태그로 조회하는 Get 라우터
router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/main');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: Member }] });
        }
        return res.render('main', {
            title: `${query} | BookBoard`,
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

module.exports = router;