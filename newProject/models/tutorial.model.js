module.exports = (sequelize, Sequelize) => {
    const Tutorial = sequelize.define("patients", {
      ward: {
        type: Sequelize.STRING
      },
      hnId: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING
      },
      bed: {
        type: Sequelize.STRING
      },
      codebox: {
        type: Sequelize.STRING
      },
    
      
      
    },
    
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        
      }
    );
  
    return Tutorial;
  };