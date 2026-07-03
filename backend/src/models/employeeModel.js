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

const getAllEmployees = async (companyId) => {

    const query = `
       SELECT
    id,
    employee_code,
    full_name,
    mobile,
    email,
    department,
    designation,
    joining_date,
    salary
FROM employees
WHERE company_id = $1
AND status = 'ACTIVE'
ORDER BY id DESC;
    `;

    const result = await db.query(query, [companyId]);

    return result.rows;
};

const getNextEmployeeCode = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(employee_code, 'EMP', '') AS INTEGER)
        ) AS last_number
        FROM employees
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber = (result.rows[0].last_number || 0) + 1;

    return `EMP${String(nextNumber).padStart(5, "0")}`;
};
const getEmployeeById = async (id, companyId) => {

    const query = `
        SELECT *
        FROM employees
        WHERE id = $1
        AND company_id = $2
        AND status = 'ACTIVE';
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};

const updateEmployee = async (id, companyId, employeeData) => {

    const {
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
        UPDATE employees
        SET
            employee_code = $1,
            full_name = $2,
            mobile = $3,
            email = $4,
            gender = $5,
            dob = $6,
            joining_date = $7,
            department = $8,
            designation = $9,
            salary = $10,
            address = $11,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        AND company_id = $13
        AND status = 'ACTIVE'
        RETURNING *;
    `;

    const values = [
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
        address,
        id,
        companyId
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

const deleteEmployee = async (id, companyId) => {

    const query = `
        UPDATE employees
SET
    status = 'INACTIVE',
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
AND company_id = $2
RETURNING *;
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getNextEmployeeCode,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
    
};