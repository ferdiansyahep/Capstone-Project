import Guru from "../models/guruModel.js";
import argon2 from "argon2";
import generateToken from "../config/generateToken.js";

const createGuru = async (req, res) => {
    const { nip, nama, password } = req.body;

    try {
        // Periksa apakah NIP sudah terdaftar sebelumnya
        const existingGuru = await Guru.findOne({ where: { nip: nip } });
        if (existingGuru) {
            return res.status(400).json({ message: 'NIP sudah terdaftar. Silakan gunakan NIP lain.' });
        }

        const hashedPassword = await argon2.hash(password);
        const newGuru = await Guru.create({
            nip: nip,
            nama: nama,
            password: hashedPassword,
        });
        const token = generateToken(newGuru.id);
        res.status(201).json({ newGuru, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginGuru = async (req, res) => {
    const { nip, password } = req.body;

    try {
        const guru = await Guru.findOne({ where: { nip: nip } });
        if (guru && await argon2.verify(guru.password, password)) {
            const token = generateToken(guru.id);
            res.json({ message: "Login successful", token });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllGuru = async (req, res) => {
    try {
        const guru = await Guru.findAll();
        res.json(guru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGuruById = async (req, res) => {
    try {
        const guru = await Guru.findByPk(req.params.id);
        if (guru) {
            res.json(guru);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGuru = async (req, res) => {
    const { nip, nama, password } = req.body;

    try {
        const guru = await Guru.findByPk(req.params.id);
        if (guru) {
            guru.nip = nip || guru.nip;
            guru.nama = nama || guru.nama
            guru.password = password ? await argon2.hash(req.body.password) : guru.password;

            await guru.save();
            res.json({ message: "Teacher updated", guru });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGuru = async (req, res) => {
    try {
        const guru = await Guru.findByPk(req.params.id);
        if (guru) {
            await guru.destroy();
            console.log('Teacher removed');
            res.status(200).json({ message: 'Teacher removed' });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createGuru, loginGuru, getAllGuru, getGuruById, updateGuru, deleteGuru };