const express = require('express');

const { DailyNote } = require('../models');
const { login } = require('./middlewares');

const router = express.Router();

router.post('/', login, async(req, res, next) => {
    try{
        const daily = await DailyNote.create({
            writer: req.body.writer,
            content: req.body.content,
        });
        res.redirect('/main');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;