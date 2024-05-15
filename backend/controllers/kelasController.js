import Kelas from "../models/kelasModel.js";

const createKelas = async (req, res) => {
    const { nama_kelas } = req.body;

    try {
        // Periksa apakah kelas sudah terdaftar sebelumnya
        const existingKelas = await Kelas.findOne({ where: { nama_kelas: nama_kelas } });
        if (existingKelas) {
            return res.status(400).json({ message: 'Kelas sudah terdaftar.' });
        }

        // Buat kelas baru
        const newKelas = await Kelas.create({ nama_kelas: nama_kelas });

        res.status(201).json({ message: "Kelas created", newKelas });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllKelas = async (req, res) => {
    try {
        const kelas = await Kelas.findAll();
        res.json(kelas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getKelasById = async (req, res) => {
    try {
        const kelas = await Kelas.findByPk(req.params.id);
        if (kelas) {
            res.json(kelas);
        } else {
            res.status(404).json({ message: 'Kelas not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateKelas = async (req, res) => {
    const { nama_kelas } = req.body;

    try {
        const kelas = await Kelas.findByPk(req.params.id);
        if (kelas) {
            kelas.nama_kelas = nama_kelas || kelas.nama_kelas;

            await kelas.save();
            res.json({ message: "Kelas updated", kelas });
        } else {
            res.status(404).json({ message: 'Kelas not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteKelas = async (req, res) => {
    try {
        const kelas = await Kelas.findByPk(req.params.id);
        if (kelas) {
            await kelas.destroy();
            res.status(200).json({ message: 'Kelas removed' });
        } else {
            res.status(404).json({ message: 'Kelas not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createKelas, getAllKelas, getKelasById, updateKelas, deleteKelas };
