module.exports = (sequelize, Sequelize) => {
    const Drug = sequelize.define("drug", {
      packId: {
        type: Sequelize.STRING
      },
      packName: {
        type: Sequelize.STRING
      },
      packUnit: {
        type: Sequelize.STRING
      },
      packMeal: {
        type: Sequelize.STRING
      },
      typeMeal: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      hnId: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      
    },
    
      {
        tableName: 'drug',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  
    return Drug;
  };