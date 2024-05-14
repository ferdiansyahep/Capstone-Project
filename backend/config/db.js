import {Sequelize} from 'sequelize';

const db = new Sequelize('capstone', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

db.authenticate()
  .then(() => {
    console.log('Koneksi ke database berhasil.');
  })
  .catch(err => {
    console.error('Gagal terhubung ke database:', err);
    process.exit(1);
  });

export default db;