import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Category = db.define(
  "categories",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false, // Kita tidak butuh createdAt/updatedAt untuk kategori
  }
);

export default Category;