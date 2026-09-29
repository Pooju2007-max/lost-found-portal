const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 5000;


app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadDir = path.join(__dirname, "uploads");

// Create uploads folder automatically if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads folder created");
}

// Make uploaded images accessible
app.use(
  "/uploads",
  express.static(uploadDir)
);

mongoose
  .connect("mongodb://127.0.0.1:27017/lost_found_portal")
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Backend running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    contact: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Item = mongoose.model(
  "Item",
  itemSchema
);

app.get("/", (req, res) => {
  res.json({
    message: "Lost & Found Backend is running!"
  });
});
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({
      createdAt: -1
    });

    res.status(200).json(items);

  } catch (error) {

    console.error(
      "Error getting items:",
      error
    );

    res.status(500).json({
      message: "Error getting items",
      error: error.message
    });
  }
});

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );

    cb(null, uniqueName);
  }

});

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed"),
      false
    );
  }

};

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

app.post(
  "/api/items",
  upload.single("image"),

  async (req, res) => {

    try {

      console.log("Request body:", req.body);
      console.log("Uploaded file:", req.file);

      // Check required fields
      if (
        !req.body.type ||
        !req.body.name ||
        !req.body.description ||
        !req.body.location ||
        !req.body.contact
      ) {

        return res.status(400).json({
          message:
            "Please fill in all required fields"
        });

      }


      // Create new item
      const item = new Item({

        type: req.body.type,

        name: req.body.name,

        description: req.body.description,

        location: req.body.location,

        contact: req.body.contact,

        image: req.file
          ? `/uploads/${req.file.filename}`
          : ""
      });


      // Save item
      const savedItem = await item.save();


      console.log(
        "Item saved successfully:",
        savedItem
      );


      res.status(201).json(savedItem);

    } catch (error) {

      console.error(
        "Error saving item:",
        error
      );

      res.status(500).json({
        message: "Error saving item",
        error: error.message
      });

    }

  }
);

app.delete(
  "/api/items/:id",
  async (req, res) => {

    try {

      const deletedItem =
        await Item.findByIdAndDelete(
          req.params.id
        );


      if (!deletedItem) {

        return res.status(404).json({
          message: "Item not found"
        });

      }


      // Delete associated image
      if (deletedItem.image) {

        const imagePath =
          path.join(
            __dirname,
            deletedItem.image
              .replace("/uploads/", "uploads/")
          );


        if (fs.existsSync(imagePath)) {

          fs.unlinkSync(imagePath);

          console.log(
            "Image deleted:",
            imagePath
          );

        }

      }


      res.status(200).json({
        message:
          "Item deleted successfully"
      });

    } catch (error) {

      console.error(
        "Error deleting item:",
        error
      );

      res.status(500).json({
        message: "Error deleting item",
        error: error.message
      });

    }

  }
);




app.use(
  (error, req, res, next) => {

    if (
      error instanceof multer.MulterError
    ) {

      console.error(
        "Multer error:",
        error
      );

      if (
        error.code === "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({
          message:
            "Image size must be less than 5 MB"
        });

      }

      return res.status(400).json({
        message: error.message
      });

    }


    if (
      error &&
      error.message ===
        "Only image files are allowed"
    ) {

      return res.status(400).json({
        message:
          "Only image files are allowed"
      });

    }


    next(error);

  }
);