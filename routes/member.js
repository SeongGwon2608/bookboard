//다른 사용자 팔로잉
const express = require('express');

const { login } = require('./middlewares');
const Member = require('../models/member');

const router = express.Router();

router.post('/:id/follow', login, async (req, res, next) => {
    try {
        // const member = await Member.findOne({where: { id: req.member.id}});
        loginemail = req.cookies['loginemail'];
        Member.findOne({ where: { email: loginemail } }).then(async(member) => {
            if (member) {
                await member.addFollowing(parseInt(req.params.id, 10));
                res.send('success');
            } else {
                res.status(404).send('no member');
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;