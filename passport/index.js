const passport = require('passport');
const local = require('./local');
const kakao = require('./kakao');
const Member = require('../models/member');

module.exports = () => {
    passport.serializeUser((member, done) => {
        done(null, member.id);
    });

    passport.deserializeUser((id, done) => {
        Member.findOne({
            where: { id },
            include: [{
                model: Member,
                attributes: ['id', 'nickname'],
                as: 'Followers',
            }, {
                model: Member,
                attributes: ['id', 'nickname'],
                as: 'Followings',
            }],
        })
        .then(member => done(null, member))
        .catch(err => done(err));
    });

    local();
    kakao();
};