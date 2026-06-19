const db = require("../config/db");

// Create Super Admin
const createSuperAdmin = async (
  full_name,
  email,
  password,
  mobile,
  role
) => {
  const query = `
    INSERT INTO super_admins
    (full_name, email, password, mobile, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      full_name,
      email,
      mobile,
      role,
      is_active,
      created_at
  `;

  const values = [
    full_name,
    email,
    password,
    mobile,
    role
  ];

  const result = await db.query(query, values);

  return result.rows[0];
};

// Find By Email
const findByEmail = async (email) => {

  const result = await db.query(
    `SELECT * FROM super_admins
     WHERE email=$1`,
    [email]
  );

  return result.rows[0];
};

module.exports = {
  createSuperAdmin,
  findByEmail,
};