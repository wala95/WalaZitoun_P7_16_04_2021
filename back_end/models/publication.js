'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Publication.belongsTo(models.User, {
        foreignKey : {
          name: 'utilisateur_id',
          allowNull: false
        }
      }, { onDelete: 'CASCADE' });
      models.Publication.hasMany(models.Commentaire, {
        foreignKey: 'publication_id'
      }, { onDelete: 'CASCADE' })
    }
  };
  Publication.init({
    utilisateur_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};