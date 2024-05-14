const notFound = (req, res, next) => {
    const error = new Error(`URL "${req.originalUrl}" Tidak ditemukan `);
    res.status(404).json({ message: `URL ${req.originalUrl} not found` });
};

// const errorHandler = (err, req, res, next) => {
//     // Mengecek status code
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     res.json({
//         message: err.message,
//         // Jika di development, tampilkan stack trace
//         stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//     });
// };

export {
    notFound,
    // errorHandler 
};