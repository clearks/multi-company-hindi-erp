const {
  comparePassword,
} = require("../utils/password");

const {
  generateToken,
} = require("../utils/jwt");

const {
  createSuperAdmin,
  findByEmail,
} = require("../models/superAdminModel");

const {
  hashPassword,
} = require("../utils/password");

// Register
const register = async (req, res) => {

  try {

const {
  full_name,
  email,
  password,
  mobile,
  role,
} = req.body;

    // Email Exists?

    const exists = await findByEmail(email);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash Password

    const hashedPassword =
      await hashPassword(password);

    // Save

    const admin =
  await createSuperAdmin(
    full_name,
    email,
    hashedPassword,
    mobile,
    role || "SUPER_ADMIN"
  );

    res.status(201).json({
      success: true,
      message:
        "Super Admin Created Successfully",
      data: admin,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const admin = await findByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await comparePassword(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = generateToken({
  id: admin.id,
  email: admin.email,
  role: admin.role,
});

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
  id: admin.id,
  full_name: admin.full_name,
  email: admin.email,
  role: admin.role,
},
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

const profile = async (req, res) => {

  res.json({
    success: true,
    user: req.user,
  });

};

module.exports = {
  register,
  login,
  profile,
};