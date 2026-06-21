require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/User");

const {
  hashPassword,
} = require("../services/authService");

async function seedAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    const existingAdmin =
      await User.findOne({
        username: "admin",
      });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const password =
      await hashPassword("admin123");

    await User.create({
      fullName: "System Admin",
      username: "admin",
      password,
      role: "admin",
    });

    console.log(
      "Admin created successfully"
    );

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAdmin();