const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.KEY
require("dotenv").config();
const path = require("path");
const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

//Set up storage location and file naming convention
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Set up multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: imageFilter }).single("file");


module.exports = {
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: { email: "User not found." } });
      }
      const correctPassword = await bcrypt.compare(req.body.password, user.password);
      if (!correctPassword) {
        return res.status(400).json({ error: { password: "Wrong password." } });
      }
  
      const authToken = jwt.sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      }, key, { expiresIn: "1d" });
      res.json({ msg: "success!", user: user, token: authToken });
    } catch (error) {
      console.error("Login error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: { token: "Token expired. Please log in again." } });
      } else {
        return res.status(500).json({ error: { server: "Internal server error." } });
      }
    }
  },
  register: async (req, res) => {
    try {
        await User.validate(req.body); 
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (req.body.password !== req.body.confirmPassword) {
          return res.status(400).json({ message: 'Password must match confirm password' });
        }
        
        const user = await User.create(req.body);
        res.json({ msg: "success!", user: user });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
},

  logout: (req, res) => {
    res.clearCookie("authToken");
    res.sendStatus(200);
  },


  uploadProfilePicture: (req, res) => {
    const userId = req.params.id;
    upload(req, res, (err) => {
      if (err) {
        if (err.message === "Only images are allowed") {
          return res.status(400).json({ error: "Only images are allowed" });
        }
        return res.status(400).json({ error: "Invalid file upload" });
      }
      if (!req.file || !req.file.filename) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      User.findByIdAndUpdate(
        userId,
        { profilePic: req.file.filename },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(200).json({
            message: "Profile picture uploaded successfully",
            updatedUser,
          });
        })
        .catch((err) => res.status(400).json(err));
    });
  },

  // The populate method in Mongoose is used to replace the specified paths in a document with documents from other collections
  getuser: (req, res) => {
    const userId = req.params.id;
    User.findOne({ _id: userId })
      .populate('activities')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
      })
      .catch((err) => res.status(400).json(err));
  },

  //? Read All

  getAllUsers: (req, res) => {
    User.find()
      .populate('activities')
      .then((allUsers) => {
        const usersWithActivities = allUsers.filter(user => user.activities.length > 0);
        res.json(usersWithActivities);
      })
      .catch(err => {
        res.status(500).json({ message: "An error occurred while fetching users", error: err });
      });
    }
  }

