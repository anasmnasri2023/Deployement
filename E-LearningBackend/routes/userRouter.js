var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const uploadfile = require("../middlewares/uploadFile");
const path = require("path");

// --- Routes GET ---
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getTeachers", userController.getTeachers);         // ✅ liste des teachers
router.get("/getOrderUsersByAge", userController.getOrderUsersByAge);
router.get("/searchUsersByUsername", userController.searchUsersByName);
router.get("/getUserByAgeBetweenXAndY", userController.getUserByAgeBetweenXAndY);
router.get("/getUserByAge/:age", userController.getUserByAge);
router.get("/getUserById/:id", userController.getUserById);

// --- Télécharger un CV ---
router.get("/downloadCV/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads/cvs', filename);
    if (!require('fs').existsSync(filepath)) {
      return res.status(404).json({ message: "CV non trouvé" });
    }
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({ message: "Erreur lors du téléchargement du CV" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Routes POST ---
router.post("/addUserWithRole", userController.addUserWithRole);
router.post("/addStudent", userController.addStudent);
router.post("/addTeacher", userController.addTeacher);
router.post("/addAdmin", userController.addAdmin);
router.post(
  "/addStudentWithFile",
  uploadfile.single("image_User"),
  userController.addStudentWithFile
);

// --- Routes DELETE ---
router.delete("/DeleteUserById/:id", userController.DeleteUserById);

module.exports = router;