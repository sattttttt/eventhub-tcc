import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "users", // Nama tabel di database
  {
    // Definisi kolom
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Opsi tambahan
    timestamps: true, // Otomatis membuat kolom createdAt dan updatedAt
  }
);

export default User;