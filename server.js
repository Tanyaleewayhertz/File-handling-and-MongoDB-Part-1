const express=require("express");
const upload=require("./upload");
const fs=require("fs");
const path = require("path");


const app=express();
const PORT=3000;

app.use(express.json()); 

app.get("/",(req,res)=>{
   res.send("Welcome to file upload api");
});
app.put("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Invalid file type or size!" });
    }

    res.status(200).json({ 
        message: "File uploaded successfully!", 
        fileId: req.file.filename  // ✅ File ka unique ID return karega
    });
});
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}
app.delete("/delete-file/:fileId", (req, res) => {
    const filePath = `uploads/${req.params.fileId}`;//url se file id nikalna

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found!" });
    }

    fs.unlink(filePath, (err) => {   //unlink se upload folder se file delete hota hai
        if (err) {
            return res.status(500).json({ message: "Error deleting file!" });
        }
        res.status(200).json({ message: "File deleted successfully!" });
    });
});


app.post("/rename-file", (req, res) => {
    const { fileId, newName } = req.body;

    if (!fileId || !newName) {
        return res.status(400).json({ message: "File ID and new name are required!" });
    }

    const oldPath = path.join(__dirname, "uploads", fileId);
    const newPath = path.join(__dirname, "uploads", newName);

    console.log("Old Path:", oldPath);  // Debugging ke liye
    console.log("New Path:", newPath);  // Debugging ke liye

    if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ message: "File not found!" });
    }

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error("Rename Error:", err);  // Error logging
            return res.status(500).json({ message: "Error renaming file!" });
        }
        res.status(200).json({ message: "File renamed successfully!", newFileName: newName });
    });
});



app.listen(PORT,() =>{
 console.log(`Server is running on https://localhost:${PORT}`)
});
