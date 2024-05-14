import Admin from "../models/adminModel.js";
import argon2 from "argon2";
import generateToken from "../config/generateToken.js";

const createAdmin = async (req, res) => {
    const { username, nama, password } = req.body;

    try {
        // Periksa apakah Username sudah terdaftar sebelumnya
        const existingAdmin = await Admin.findOne({ where: { username: username } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username sudah terdaftar. Silakan gunakan Username lain.' });
        }

        const hashedPassword = await argon2.hash(password);
        const newAdmin = await Admin.create({
            username: username,
            nama: nama,
            password: hashedPassword,
        });
        const token = generateToken(newAdmin.id);
        res.status(201).json({ newAdmin, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { username: username } });
        if (admin && await argon2.verify(admin.password, password)) {
            const token = generateToken(admin.id);
            res.json({ message: "Login successful", token });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAdmin = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (admin) {
            admin.username = req.body.username || admin.username;
            admin.password = req.body.password ? await argon2.hash(req.body.password) : admin.password;

            await admin.save();
            res.json({ message: "Admin updated", admin });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (admin) {
            await admin.destroy();
            console.log('Admin removed');
            res.status(200).json({ message: 'Admin removed' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createAdmin, getAllAdmin, getAdminById, updateAdmin, deleteAdmin, loginAdmin };