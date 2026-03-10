export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("clientes", {

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
      allowNull: false
    },

    telefono: {
      type: Sequelize.STRING
    },

    empresa: {
      type: Sequelize.STRING
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }

  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("clientes");
}