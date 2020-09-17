var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

const departments = ["Sales", "Engineering", "Finance", "Legal"];
const roles = ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"];
const managers = ["John Doe", "Ashley Rodriguez", "Malia Brown", "Sarah Lourd", "Kevin Tupik"];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3300,
    user: "root",
    password: "root",
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Connected as id: ", connection.threadId);
    menu();
});

function menu() {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "Menu",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add employee",
                "Add role",
                "Add department",
            ]
        })
        .then(function (answer) {
            console.log(answer.optionsList)
            switch (answer.optionsList) {
                case "View all employees":
                    viewAllEmployees();
                    break;

                case "View all departments":
                    viewAllDepartments();
                    break;

                case "View all roles":
                    viewAllRoles();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Add department":
                    addDepartment();
                    break;

            }
        });
}

function viewAllEmployees() {
    var query = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name), role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager `
    query += "FROM employee LEFT JOIN role ON employee.role_id = role.id ";
    query += "LEFT JOIN department ON department.id = role.department_id ";
    query += "LEFT JOIN employee AS manager ON manager.id = employee.manager_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        menu();
    })
}

function viewAllDepartments() {
    var query = `SELECT department.id, department.name FROM department`
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        begin()
    })
}

function viewAllRoles() {
    var query = `SELECT role.id, role.title, role.salary, department.name as department FROM role 
    LEFT JOIN department ON role.department_id = department.id`
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        begin()
    })
}

function addEmployee() {
    inquirer.prompt([{
        name: "first",
        type: "input",
        message: "First Name"
    },
    {
        name: "last",
        type: "input",
        message: "Last Name"
    },
    {
        name: "role",
        type: "list",
        message: "Role",
        choices: roles
    },
    {
        name: "manager",
        type: "list",
        message: "Manager",
        choices: managers
    }
    ]).then(function (answer) {
        if (answer.role === "Sales Lead") {
            var roleid = "5"
        } else if (answer.role === "Salesperson") {
            var roleid = "6"
        } else if (answer.role === "Lead Engineer") {
            var roleid = "7"
        } else if (answer.role === "Software Engineer") {
            var roleid = "8"
        } else if (answer.role === "Accountant") {
            var roleid = "9"
        } else if (answer.role === "Legal Team Lead") {
            var roleid = "10"
        } else if (answer.role === "Lawyer") {
            var roleid = "11"
        };
        if (answer.manager === "John Doe") {
            var managerid = "1"
        } else if (answer.manager === "Ashley Rodriguez") {
            var managerid = "3"
        } else if (answer.manager === "Sarah Lourd") {
            var managerid = "6"
        } else if (answer.manager === "Mike Chan") {
            var managerid = "2"
        }

        then(function (answer) {
            switch (answer.role) {
                case answer.role === "Sales Lead":
                var roleid = "5";
                    break;
                
                    case answer.role === "Salesperson": 
                var roleid = "6";
                    break;

                    case answer.role === "Lead Engineer":
                        var roleid = "7";
                        break;

                   case answer.role === "Software Engineer":
                        var roleid = "8"
                        break;

                    case answer.role === "Accountant":
                        var roleid = "9";
                        break;
                    case answer.role === "Legal Team Lead":
                        var roleid = "10"
                    } else if (answer.role === "Lawyer") {
                        var roleid = "11"
                    };
                    if (answer.manager === "John Doe") {
                        var managerid = "1"
                    } else if (answer.manager === "Ashley Rodriguez") {
                        var managerid = "3"
                    } else if (answer.manager === "Sarah Lourd") {
                        var managerid = "6"
                    } else if (answer.manager === "Mike Chan") {
                        var managerid = "2"
            }
        connection.query(
            `INSERT INTO employee SET ?`, {
            first_name: answer.first,
            last_name: answer.last,
            role_id: roleid,
            manager_id: managerid,
        },
            function (err) {
                if (err) throw err;
                console.log("Employee Added");
                viewAllEmployees();
            }
        )
    })
}

function addRole() {
    inquirer.prompt([{
        name: "role",
        type: "input",
        message: "Role"
    }, {
        name: "dept",
        type: "list",
        message: "Department",
        choices: departments
    }, {
        name: "salary",
        type: "input",
        message: "Salary",
    }])
        .then(function (answer) {
            if (answer.dept === "Sales") {
                var depID = "1"
            } else if (answer.dept === "Engineering") {
                var depID = "2"
            } else if (answer.dept === "Finance") {
                var depID = "3"
            } else if (answer.dept === "Legal") {
                var depID = "4"
            }
            connection.query(
                `INSERT INTO role SET ?`, {
                title: answer.role,
                salary: answer.salary,
                department_id: depID
            },
                function (err) {
                    if (err) throw err;
                    console.log("Role Created Successfully!");
                    viewAllRoles();
                }
            );

        })
}

function addDepartment() {
    inquirer.prompt([{
        name: "adddepartment",
        type: "input",
        message: "Department"
    }])
        .then(function (answer) {
            connection.query(
                `INSERT INTO department SET ?`, {
                name: answer.adddepartment,
            },
                function (err) {
                    if (err) throw err;
                    console.log("Department Created Successfully!");
                    viewAllDepartments()
                }
            )
        })
}