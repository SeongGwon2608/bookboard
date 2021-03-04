const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const Member = require('../models/member');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exMember = await Member.findOne({
                where: {snsId: profile.id, provider: 'kakao'},
            });
            if(exMember){
                done(null, exMember);
            }else{
                const newMember = await Member.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nickname: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newMember);
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}