const {
  createCompanyAdmin,
  findCompanyAdminByEmail,
} = require("../models/companyAdminModel");

const { hashPassword } = require("../utils/password");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

// Company Admin Create
const register = async (req, res) => {
  try {
    const {
      company_id,
      full_name,
      email,
      password,
      mobile,
    } = req.body;

    // Validation
    if (
      !company_id ||
      !full_name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Duplicate Email Check
    const exists = await findCompanyAdminByEmail(email);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Save
    const admin = await createCompanyAdmin(
      company_id,
      full_name,
      email,
      hashedPassword,
      mobile
    );

    res.status(201).json({
      success: true,
      message: "Company Admin Created Successfully",
      data: admin,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

    // Company admin login
const loginCompanyAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        const admin = await findCompanyAdminByEmail(email);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            });
        }

        const isMatch = await comparePassword(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            });
        }

        const token = generateToken({
            id: admin.id,
            companyId: admin.company_id,
            role: "COMPANY_ADMIN"
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful.",
            token,
            admin: {
    id: admin.id,
    full_name: admin.full_name,
    email: admin.email,
    companyId: admin.company_id,
    role: "COMPANY_ADMIN"
}
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });

    }
};

module.exports = {
  register,
   loginCompanyAdmin,
};