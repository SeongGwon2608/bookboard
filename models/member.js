//사용자 정보를 저장하는 모델
const Sequelize = require('sequelize');

module.exports = class Member extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email: { 
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nickname: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            //SNS로그인시에 저장
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Member',
            tableName: 'members',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    
    static associate(db){
        //Member 모델과 Post 모델 관계(1:N - hasMany)
        db.Member.hasMany(db.Post);

        //같은 모델간의 관계(N:M)
        db.Member.belongsToMany(db.Member, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',      //같은 테이블간의 관계에서는 모델명, 컬럼명을 따로 정해야함
        });
        db.Member.belongsToMany(db.Member, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
};