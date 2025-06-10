import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Event = db.define(
  "events",
  {
    nama_acara: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tanggal_acara: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url_poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Foreign key 'organizerId' akan dibuat otomatis oleh asosiasi
  },
  {
    timestamps: true,
  }
);

export default Event;