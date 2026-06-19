const db = require("../config/db");

const createEmployee = async (employeeData) => {
    const {
        companyId,
        employeeCode,
        fullName,
        mobile,
        email,
        gender,
        dob,
        joiningDate,
        department,
        designation,
        salary,
        address
    } = employeeData;

    const query = `
        INSERT INTO employees (
            company_id,
            employee_code,
            full_name,
            mobile,
            email,
            gender,
            dob,
            joining_date,
            department,
            designation,
            salary,
            address
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        employeeCode,
        fullName,
        mobile,
        email,
        gender,
        dob,
        joiningDate,
        department,
        designation,
        salary,
        address
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

module.exports = {
    createEmployee
};