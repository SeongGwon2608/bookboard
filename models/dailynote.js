//사용자 정보를 저장하는 모델
const Sequelize = require('sequelize');

module.exports = class DailyNote extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            writer : { 
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            content : {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'DailyNote',
            tableName: 'dailyNotes',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    
    static associate(db){}
};