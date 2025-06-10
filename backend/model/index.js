import User from "./User.js";
import Event from "./Event.js";
import Registration from "./Registration.js";
import Category from "./Category.js"; // <-- Impor baru
import EventCategory from "./EventCategory.js"; // <-- Impor baru

// Relasi 1: User (Organizer) memiliki banyak Event
User.hasMany(Event, { foreignKey: "organizerId" });
Event.belongsTo(User, { as: "organizer", foreignKey: "organizerId" });

// Relasi 2: User dan Event (Registrasi)
User.belongsToMany(Event, { through: Registration, as: 'registeredEvents' });
Event.belongsToMany(User, { through: Registration, as: 'participants' });

// --- RELASI BARU: Event dan Category ---
Event.belongsToMany(Category, { through: EventCategory, as: 'categories' });
Category.belongsToMany(Event, { through: EventCategory, as: 'events' });


// Ekspor semua model
export { User, Event, Registration, Category, EventCategory };