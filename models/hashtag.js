//태그명 저장(태그 검색 기능 사용예정)
const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            tag: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    //Post모델과 Hashtag모델의 관계(N:M)
    static associate(db){
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag'});
    }
};