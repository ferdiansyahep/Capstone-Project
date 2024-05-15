import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Kelas from "./kelasModel.js";

const { DataTypes } = Sequelize;

const Siswa = db.define("siswa", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    nis: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100],
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    gender: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['L', 'P']],
        }
    },
    kelas: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true,
        }
    },
    nama_ortu: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    freezeTableName: true,
})

// Menambahkan relasi antara Siswa dan Kelas
Siswa.belongsTo(Kelas, { foreignKey: 'kelas', targetKey: 'nama_kelas' });
Kelas.hasMany(Siswa, { foreignKey: 'kelas', targetKey: 'nama_kelas' });


export default Siswa;