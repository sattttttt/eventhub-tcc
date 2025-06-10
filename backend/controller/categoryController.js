import { Category } from '../model/index.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kategori", error: error.message });
    }
}