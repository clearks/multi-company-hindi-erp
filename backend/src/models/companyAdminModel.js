const db = require("../config/db");

// Create Company Admin
const createCompanyAdmin = async (
  company_id,
  full_name,
  email,
  password,
  mobile,
  role = "COMPANY_ADMIN"
) => {
  const result = await db.query(
    `
    INSERT INTO company_admins
    (company_id, full_name, email, password, mobile, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      company_id,
      full_name,
      email,
      mobile,
      role,
      is_active,
      created_at
    `,
    [
      company_id,
      full_name,
      email,
      password,
      mobile,
      role,
    ]
  );

  return result.rows[0];
};

// Find Company Admin By Email
const findCompanyAdminByEmail = async (email) => {
  const result = await db.query(
    `
    SELECT *
    FROM company_admins
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};

module.exports = {
  createCompanyAdmin,
  findCompanyAdminByEmail,
};