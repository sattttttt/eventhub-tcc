import db from "../config/database.js";

const EventCategory = db.define("event_categories", {
  // Model ini tidak perlu kolom tambahan selain foreign key
  // yang akan dibuat otomatis oleh Sequelize
});

export default EventCategory;