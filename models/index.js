//각 모델을 시퀄라이즈 객체에 연결
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Member = require('./member');
const Post = require('./post');
const Hashtag = require('./hashtag');
const DailyNote = require('./dailynote');

const db = {};
const sequelize = new Sequelize(config.database, config.membername, config.password, config, );

db.sequelize = sequelize;
db.Member = Member;
db.Post = Post;
db.Hashtag = Hashtag;
db.DailyNote = DailyNote;

Member.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
DailyNote.init(sequelize);

Member.associate(db);
Post.associate(db);
Hashtag.associate(db);
DailyNote.associate(db);

module.exports = db;
