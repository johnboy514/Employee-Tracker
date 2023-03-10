INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Lead Engineer", 145000, 2),
    ("Legal Team Lead", 275000, 4),
    ("Accountant", 140000, 3),
    ("Sales Lead", 115000, 1),
    ("Salesperson", 75000, 1),
    ("Software Engineer", 130000, 2),
    ("Lawyer", 210000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES 
    ("Susie", "Little", null, 1),
    ("Jambo", "Jerrey", null, 2),
    ("Aba","Cadabra",null,3),
    ("Riff", "Raff", 3, 4),
    ("Angelina", "Joley", 4, 5),
    ("Big", "Robby", 1, 6),
    ("Billy", "Lee-Jones", 2, 7);