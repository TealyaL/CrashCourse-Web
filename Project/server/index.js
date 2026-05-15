const express = require('express')
const upload = require("./middleware/multer")
const cloudinary = require("./utils/cloudinary");
const cors = require("cors")


const app = express()
const port = 3000
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// api upload hình ảnh lên cloudinary
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image file uploaded"
        })
    }

    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error uploading image"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Uploaded!",
            imageUrl: result.secure_url,
            data: result
        })
    });
})

app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});