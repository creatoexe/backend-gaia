import { readdirSync } from "fs";
import { join, basename as _basename } from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);
const env = process.env.NODE_ENV || "development";

import config from "../config/config.json" assert { type: "json" };
const envConfig = config[env];

const db = {};

let sequelize;
if (envConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[envConfig.use_env_variable], envConfig);
} else {
  sequelize = new Sequelize(envConfig.database, envConfig.username, envConfig.password, envConfig);
}

const files = readdirSync(__dirname).filter(file => {
  return (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.slice(-3) === ".js" &&
    file.indexOf(".test.js") === -1
  );
});

for (const file of files) {
  const { default: modelDefiner } = await import(join(__dirname, file));
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;