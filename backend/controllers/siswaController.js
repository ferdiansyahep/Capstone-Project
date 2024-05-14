import Siswa from "../models/siswaModel.js";
import argon2 from "argon2";
import generateToken from "../config/generateToken.js";

const createSiswa = async (req, res) => {
    const { nis, nama, password, gender, kelas, tempat_lahir, tanggal_lahir, nama_ortu, alamat } = req.body;

    try {
        // Periksa apakah NIS sudah terdaftar sebelumnya
        const existingSiswa = await Siswa.findOne({ where: { nis: nis } });
        if (existingSiswa) {
            return res.status(400).json({ message: 'NIS sudah terdaftar. Silahkan gunakan NIS lain.' });
        }

        const hashedPassword = await argon2.hash(password);
        const newSiswa = await Siswa.create({
            nis: nis,
            nama: nama,
            gender: gender,
            password: hashedPassword,
            kelas: kelas,
            tempat_lahir: tempat_lahir,
            tanggal_lahir: tanggal_lahir,
            nama_ortu: nama_ortu,
            alamat: alamat,
        });
        const token = generateToken(newSiswa.id);
        res.status(201).json({ newSiswa, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginSiswa = async (req, res) => {
    const { nis, password } = req.body;

    try {
        const siswa = await Siswa.findOne({ where: { nis: nis } });
        if (siswa && await argon2.verify(siswa.password, password)) {
            const token = generateToken(siswa.id);
            res.json({ message: "Login successful", token });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllSiswa = async (req, res) => {
    try {
        const siswa = await Siswa.findAll();
        res.json(siswa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSiswaById = async (req, res) => {
    try {
        const siswa = await Siswa.findByPk(req.params.id);
        if (siswa) {
            res.json(siswa);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSiswa = async (req, res) => {
    const { nis, nama, password, kelas, tempat_lahir, tanggal_lahir, nama_ortu, alamat } = req.body;

    try {
        const siswa = await Siswa.findByPk(req.params.id);
        if (siswa) {
            siswa.nis = nis || siswa.nis;
            siswa.nama = nama || siswa.nama;
            siswa.password = password ? await argon2.hash(password) : siswa.password;
            siswa.kelas = kelas || siswa.kelas;
            siswa.tempat_lahir = tempat_lahir || siswa.tempat_lahir;
            siswa.tanggal_lahir = tanggal_lahir || siswa.tanggal_lahir;
            siswa.nama_ortu = nama_ortu || siswa.nama_ortu;
            siswa.alamat = alamat || siswa.alamat;

            await siswa.save();
            res.json({ message: "Student updated", siswa });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSiswa = async (req, res) => {
    try {
        const siswa = await Siswa.findByPk(req.params.id);
        if (siswa) {
            await siswa.destroy();
            res.status(200).json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createSiswa, loginSiswa, getAllSiswa, getSiswaById, updateSiswa, deleteSiswa };