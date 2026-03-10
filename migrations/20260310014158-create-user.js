export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {

    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },

    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false
    },

    rol: {
      type: Sequelize.STRING,
      allowNull: false
    },

    activo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }

  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}