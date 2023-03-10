const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "AlphaBeta77",
    database: "employee_DB"
  });


connection.connect(function(err) {
    if (err) throw err
    console.log("Connected")
    startPrompt();
});


function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "View All Employees?", 
              "View All Employee's By Roles?",
              "View all Emplyees By Deparments", 
              "Update Employee",
              "Add Employee?",
              "Add Role?",
              "Add Department?",
              "End"
            ]
    }
]).then(function(data) {
        const { choice } = data;
          if (choice === "View All Employees?") {
              viewAllEmployees();
            }

          if (choice === "View All Employee's By Roles?") {
              viewAllRoles();
          }

          if (choice === "View all Emplyees By Deparments") {
              viewAllDepartments();
          }

          if (choice === "Add Employee?") {
                addEmployee();
          }

          if (choice === "Update Employee") {
                updateEmployee();
          }

          if (choice === "Add Role?") {
                addRole();
          }

          if (choice === "Add Department?") {
                addDepartment();
          }

          if (choice === "End") { 
                connection.end();
          }
    })
}


function viewAllEmployees() {
    connection.query(`SELECT employee.first_name,
                      employee.last_name,
                      role.title,
                      role.salary,
                      department.name,
                      CONCAT(e.first_name, ' ' ,e.last_name) 
                      AS Manager 
                      FROM employee 
                      INNER JOIN 
                      role on role.id = employee.role_id 
                      INNER JOIN 
                      department on department.id = role.department_id 
                      left join employee e on employee.manager_id = e.id;`, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
}


function viewAllRoles() {
  connection.query(`SELECT employee.first_name, 
                      employee.last_name, 
                      role.title 
                      AS 
                      Title 
                      FROM employee 
                      JOIN role 
                      ON employee.role_id = role.id;`, 
  function(err, res) {
  if (err) throw err
  console.table(res)
  startPrompt()
  })
}


function viewAllDepartments() {
  connection.query(`SELECT employee.first_name, 
                      employee.last_name, 
                      department.name 
                      AS 
                      Department 
                      FROM employee 
                      JOIN role 
                      ON employee.role_id = role.id 
                      JOIN department 
                      ON role.department_id = department.id 
                      ORDER 
                      BY employee.id;`, 
  function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
  })
}


var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}


var managersArr = [];
function selectManager() {
  connection.query(`SELECT first_name, 
                      last_name 
                      FROM employee 
                      WHERE manager_id 
                      IS NULL`, 
  function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}


function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter their first name "
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter their last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (data) {
      var roleId = selectRole().indexOf(data.role) + 1
      var managerId = selectManager().indexOf(data.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: data.firstName,
          last_name: data.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(data)
          startPrompt()
      })

  })
}


  function updateEmployee() {
    connection.query(`SELECT employee.last_name, 
                      role.title 
                      FROM employee 
                      JOIN role 
                      ON employee.role_id = role.id;`, 
    function(err, res) {
      if (err) throw err
      console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(data) {
        var roleId = selectRole().indexOf(data.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: data.lastName
          
        }, 
        {
          role_id: roleId
          
        }, 
        function(err){
            if (err) throw err
            console.table(data)
            startPrompt()
        })
  
    });
  });

  }


function addRole() { 
  connection.query(`SELECT role.title 
                      AS 
                      Title, 
                      role.salary 
                      AS 
                      Salary 
                      FROM role`,   
function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )

    });
  });
  }


function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
  }
