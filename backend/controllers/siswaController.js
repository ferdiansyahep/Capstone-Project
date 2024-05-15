import Siswa from "../models/siswaModel.js";
import argon2 from "argon2";
import generateToken from "../config/generateToken.js";
import Kelas from "../models/kelasModel.js";

const createSiswa = async (req, res) => {
    try {
        // Periksa apakah NIS sudah terdaftar sebelumnya
        const existingSiswa = await Siswa.findOne({ where: { nis: req.body.nis } });
        if (existingSiswa) {
            return res.status(400).json({ message: 'NIS sudah terdaftar. Silahkan gunakan NIS lain.' });
        }

        // Temukan ID kelas berdasarkan nama kelas
        const kelasData = await Kelas.findOne({ where: { nama_kelas: req.body.kelas } });
        if (!kelasData) {
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        const hashedPassword = await argon2.hash(req.body.password);
        const newSiswa = await Siswa.create({
            nis: req.body.nis,
            nama: req.body.nama,
            gender: req.body.gender,
            password: hashedPassword,
            kelas: req.body.kelas,
            tempat_lahir: req.body.tempat_lahir,
            tanggal_lahir: req.body.tanggal_lahir,
            nama_ortu: req.body.nama_ortu,
            alamat: req.body.alamat,
        });

        // Update jumlah siswa di kelas yang sesuai
        if (req.body.gender === 'L') {
            kelasData.jumlah_laki_laki += 1;
        } else if (req.body.gender === 'P') {
            kelasData.jumlah_perempuan += 1;
        }
        await kelasData.save();

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
    const {
        nama,
        gender,
        kelas: newKelas,
        tempat_lahir,
        tanggal_lahir,
        nama_ortu,
        alamat
    } = req.body;

    try {
        const siswa = await Siswa.findByPk(req.params.id);
        if (!siswa) {
            return res.status(404).json({ message: 'Siswa tidak ditemukan' });
        }

        // Memperbarui kelas
        if (newKelas && newKelas !== siswa.kelas) {
            // Memperbarui kelas siswa sebelumnya
            const previousClassData = await Kelas.findOne({ where: { nama_kelas: siswa.kelas } });
            if (previousClassData) {
                if (siswa.gender === 'L') {
                    previousClassData.jumlah_laki_laki -= 1;
                } else if (siswa.gender === 'P') {
                    previousClassData.jumlah_perempuan -= 1;
                }
                previousClassData.total_siswa -= 1;
                await previousClassData.save();
            }

            // Memperbarui kelas baru siswa
            const newClassData = await Kelas.findOne({ where: { nama_kelas: newKelas } });
            if (newClassData) {
                if (siswa.gender === 'L') {
                    newClassData.jumlah_laki_laki += 1;
                } else if (siswa.gender === 'P') {
                    newClassData.jumlah_perempuan += 1;
                }
                newClassData.total_siswa += 1;
                await newClassData.save();
            }

            siswa.kelas = newKelas;
        }

        // Memperbarui jenis kelamin
        if (gender) {
            // Periksa perubahan jenis kelamin dan perbarui kelas yang sesuai
            if (gender !== siswa.gender) {
                const previousClass = siswa.kelas;
                const previousGender = siswa.gender;

                if (previousGender === 'L') {
                    const previousClassData = await Kelas.findOne({ where: { nama_kelas: previousClass } });
                    if (previousClassData) {
                        previousClassData.jumlah_laki_laki -= 1;
                        await previousClassData.save();
                    }
                } else if (previousGender === 'P') {
                    const previousClassData = await Kelas.findOne({ where: { nama_kelas: previousClass } });
                    if (previousClassData) {
                        previousClassData.jumlah_perempuan -= 1;
                        await previousClassData.save();
                    }
                }

                if (gender === 'L') {
                    const newClassData = await Kelas.findOne({ where: { nama_kelas: newKelas } });
                    if (newClassData) {
                        newClassData.jumlah_laki_laki += 1;
                        await newClassData.save();
                    }
                } else if (gender === 'P') {
                    const newClassData = await Kelas.findOne({ where: { nama_kelas: newKelas } });
                    if (newClassData) {
                        newClassData.jumlah_perempuan += 1;
                        await newClassData.save();
                    }
                }
            }

            siswa.gender = gender;
        }

        // Perbarui kolom lainnya
        siswa.nama = nama || siswa.nama;
        siswa.tempat_lahir = tempat_lahir || siswa.tempat_lahir;
        siswa.tanggal_lahir = tanggal_lahir || siswa.tanggal_lahir;
        siswa.nama_ortu = nama_ortu || siswa.nama_ortu;
        siswa.alamat = alamat || siswa.alamat;
        await siswa.save();

        res.json({ message: "Siswa diperbarui", siswa });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSiswa = async (req, res) => {
    try {
        const siswa = await Siswa.findByPk(req.params.id);
        if (siswa) {
            const kelasSiswa = await Kelas.findOne({ where: { nama_kelas: siswa.kelas } });

            if (kelasSiswa) {
                if (siswa.gender === 'L' && kelasSiswa.jumlah_laki_laki > 0) {
                    kelasSiswa.jumlah_laki_laki -= 1;

                } else if (siswa.gender === 'P' && kelasSiswa.jumlah_perempuan > 0) {
                    kelasSiswa.jumlah_perempuan -= 1;

                }
                kelasSiswa.jumlah_laki_laki = Math.max(0, kelasSiswa.jumlah_laki_laki);
                kelasSiswa.jumlah_perempuan = Math.max(0, kelasSiswa.jumlah_perempuan);

                await kelasSiswa.save();
            }

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