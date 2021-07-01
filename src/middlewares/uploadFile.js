const multer = require('multer')

exports.uploadFile = (imageFile, videoFile) => {

    // init multer diskstorage
    // Menentukan destination file upload
    // Menentukan nama file (rename agar tidak ada file yang sama / ganda /double)

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads") //Lokasi penyimpanan file
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""))
        }
    })

    // Function untuk filter file berdasarkan type
    const fileFilter = function (req, file, cb) {
        if (file.fieldname === imageFile) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|git|GIF)$/)) {
                req.fileValidationError = {
                    message: "Only image files are allowed!"
                }
                return cb(new Error("Only image files are allowed!"), false)
            }
        }

        if (file.fieldname === videoFile) {
            if (!file.originalname.match(/\.(mp4|mkv)$/)) {
                req.fileValidationError = {
                    message: "Only video files are allowed!"
                }
                return cb(new Error("Only video files are allowed!"), false)
            }
        }
        cb(null, true)
    }

    const sizeInMb = 10
    const maxSize = sizeInMb * 1000 * 1000 //10Mb

    // Eksekusi upload multer dan menentukan disk storage, validation dan maxSize file
    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize
        }
    }).fields([
        {
            name: imageFile,
            maxCount: 1
        },
        {
            name: videoFile,
            maxCount: 1
        }
    ]) //Menentukan jumlah file

    return (req, res, next) => {
        upload(req, res, function (err) {
            // Pesan error jika validasi gagal
            if (req.fileValidationError) {
                return res.status(400).send(req.fileValidationError)
            }

            // Jika file upload tidak ada
            if (!req.files && !err) {
                return res.status(400).send({
                    message: "Please select files to upload"
                })
            }

            if (err) {
                // Jika size melebihi batas
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).send({
                        message: "Max file sized 10Mb"
                    })
                }
                return res.status(400).send(err)
            }

            return next()
        })
    }
}