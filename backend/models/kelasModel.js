import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Kelas = db.define("kelas", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    nama_kelas: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    jumlah_laki_laki: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    jumlah_perempuan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    total_siswa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    freezeTableName: true,
});

// Tambahkan hook beforeCreate, beforeUpdate, dan beforeDestroy untuk mengupdate total_siswa
Kelas.beforeCreate(async (kelas) => {
    kelas.total_siswa = kelas.jumlah_laki_laki + kelas.jumlah_perempuan;
});

Kelas.beforeUpdate(async (kelas) => {
    kelas.total_siswa = kelas.jumlah_laki_laki + kelas.jumlah_perempuan;
});

Kelas.beforeDestroy(async (kelas) => {
    // Menghapus data kelas, kita perlu mengurangi total siswa di kelas tersebut
    const totalSiswa = kelas.jumlah_laki_laki + kelas.jumlah_perempuan;
    if (totalSiswa > 0) {
        kelas.total_siswa = totalSiswa - 1; // Mengurangi 1 karena akan dihapus
    } else {
        kelas.total_siswa = 0;
    }
});

export default Kelas;
