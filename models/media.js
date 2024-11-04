module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
    //   field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
    //   field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'media',
    underscored: true, // Use snake_case for automatically generated columns
    timestamps: true // Automatically add createdAt and updatedAt columns
  });

  return Media;
}