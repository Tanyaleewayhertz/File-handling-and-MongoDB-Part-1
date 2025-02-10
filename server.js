const express=require("express");
const upload=require("./upload");
const fs=require("fs");
const path = require("path");


const app=express();
const PORT=3000;

app.use(express.json()); 
app.set("view engine","ejs");
app.set("views",path.resolve("/views"));
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


app.post("/rename-file", express.json(), (req, res) => {  //json body se file id and file name nikaklna
    const { fileId, newName } = req.body;
    const oldPath = `uploads/${fileId}`;
    const newPath = `uploads/${newName}`;

    if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ message: "File not found!" }); // agr file nhi  mili toh error throw krega
    }

    fs.rename(oldPath, newPath, (err) => {   //file ko rename krega
        if (err) {
            return res.status(500).json({ message: "Error renaming file!" });
        }
        res.status(200).json({ message: "File renamed successfully!" });
    });

});


app.listen(PORT,() =>{
 console.log(`Server is running on https://localhost:${PORT}`)
});
