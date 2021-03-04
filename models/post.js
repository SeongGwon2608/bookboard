//게시글 내용 및 이미지 경로 저장
const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            bookName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            publisher: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            genre: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            ISBN: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Post.belongsTo(db.Member);
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
    }
};