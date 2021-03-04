const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { login, notLogin } = require('./middlewares');
const Member = require('../models/member');

const router = express.Router();

//회원 가입 라우터
router.post('/join', notLogin, async(req, res, next) => {
    const { email, nickname, password } = req.body;
    try{
        const exMember = await Member.findOne({where: {email}});
        if(exMember){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);

        await Member.create({
            email, 
            nickname, 
            password: hash, 
        });
        return res.redirect('/');
    }catch(error){
        console.error(error);
        return next(error);
    }
});

//로그인 라우터
router.post('/login', notLogin, (req, res, next) => {
    passport.authenticate('local', (authError, member, info) => {
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!member){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.logIn(member, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            res.cookie('loginemail', member.email);
            res.cookie('memberId', member.id);
            return res.redirect('/main');
        });
    })(req, res, next); //미들웨어 내부의 미들웨어의 경우 (req, res, next) 필요
});

//로그아웃 라우터
router.get('/logout', login, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

//카카오 로그인
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    //카카오 로그인성공시 내부적으로 req.login 호출(직접 호출 불필요)
    //로그인 실패, 성공시 이동할 위치 지정
    failureRedirect: '/',   
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;