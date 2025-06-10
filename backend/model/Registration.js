import db from "../config/database.js";

// Ini adalah model perantara untuk relasi Many-to-Many
const Registration = db.define("registrations", {
  // Model ini tidak perlu kolom tambahan selain foreign key
  // yang akan dibuat otomatis oleh Sequelize
});

export default Registration;