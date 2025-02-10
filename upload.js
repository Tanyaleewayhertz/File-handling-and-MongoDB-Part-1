const multer=require("multer"); //multer ko import kkra hua hai
const path=require("path") // file ka extension janne ke liye

const storage = multer.diskStorage({
    destination: function (req, file, cb) {  // destination mtlb hmari file kha sore hogi 
        cb(null, "uploads/"); // Files uploads folder me save hongi or yha cb callback function hai
    },
    filename: function (req, file, cb) { // ye function filename bnane mei help karta hai
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);//ye isliye kia taki ek unique naam de ske file ko
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name generate hoga
    },
});
//File Type & Size Validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"]; //kon kon se file uploads kar sakte hai
    if (!allowedTypes.includes(file.mimetype)) {  
        return cb(new Error("Only JPEG and PNG files are allowed!"), false);
    }
    cb(null, true);
};

const upload=multer({storage: storage, // Ye ek multer ka middleware bnega
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
    fileFilter: fileFilter,
})
module.exports = upload;