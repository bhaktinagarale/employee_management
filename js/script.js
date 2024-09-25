let employees = []; // Holds employee data

    document.getElementById('addEmployeeBtn').addEventListener('click', () => {
        document.getElementById('form-container').style.display = 'block';
        document.getElementById('form-title').innerText = 'Add Employee';
        document.getElementById('employeeForm').reset();
    });

    // Function to load employee data
    function loadEmployees() {
        // Fetch from the backend API (to be implemented later)
        fetch('/api/employees')
            .then(response => response.json())
            .then(data => {
                employees = data;
                displayEmployees();
            });
    }

    // Function to display employees in the table
    function displayEmployees() {
        const tableBody = document.querySelector('#employeeTable tbody');
        tableBody.innerHTML = ''; // Clear previous data

        const departmentFilter = document.getElementById('departmentFilter').value;

        employees
            .filter(emp => !departmentFilter || emp.department === departmentFilter)
            .forEach(emp => {
                const row = `<tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.department}</td>
                    <td>${emp.joiningDate}</td>
                    <td>${emp.salary}</td>
                    <td>${emp.email}</td>
                    <td>
                        <button onclick="editEmployee(${emp.id})">Edit</button>
                        <button onclick="deleteEmployee(${emp.id})">Delete</button>
                    </td>
                </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
    }

    // Function to delete an employee
    function deleteEmployee(id) {
        fetch(`/api/employees/${id}`, { method: 'DELETE' })
            .then(() => {
                employees = employees.filter(emp => emp.id !== id);
                displayEmployees();
            });
    }

    // Function to edit an employee
    function editEmployee(id) {
        const employee = employees.find(emp => emp.id === id);
        document.getElementById('form-container').style.display = 'block';
        document.getElementById('form-title').innerText = 'Edit Employee';
        document.getElementById('empId').value = employee.id;
        document.getElementById('empName').value = employee.name;
        document.getElementById('department').value = employee.department;
        document.getElementById('joiningDate').value = employee.joiningDate;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('email').value = employee.email;
    }

    // Save employee (add or edit)
    document.getElementById('employeeForm').addEventListener('submit', event => {
        event.preventDefault();

        const id = document.getElementById('empId').value;
        const name = document.getElementById('empName').value;
        const department = document.getElementById('department').value;
        const joiningDate = document.getElementById('joiningDate').value;
        const salary = document.getElementById('salary').value;
        const email = document.getElementById('email').value;

        const employeeData = { id, name, department, joiningDate, salary, email };

        if (document.getElementById('form-title').innerText === 'Add Employee') {
            // Add new employee
            fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            }).then(() => {
                employees.push(employeeData);
                displayEmployees();
                document.getElementById('form-container').style.display = 'none';
            });
        } else {
            // Update existing employee
            fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            }).then(() => {
                const index = employees.findIndex(emp => emp.id === id);
                employees[index] = employeeData;
                displayEmployees();
                document.getElementById('form-container').style.display = 'none';
            });
        }
    });

    // Filter employees by department
    document.getElementById('departmentFilter').addEventListener('change', displayEmployees);

    // Load employees initially
    loadEmployees();