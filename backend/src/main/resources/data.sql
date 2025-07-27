-- Create demo users for ADENAI Travel Leave System

INSERT INTO users (first_name, last_name, email, password, role, leaves_left, manager_id) VALUES
('John', 'Manager', 'manager@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'MANAGER', 25, NULL),
('Alice', 'Johnson', 'alice@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'EMPLOYEE', 30, 1),
('Bob', 'Smith', 'bob@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'EMPLOYEE', 28, 1);

-- Password for all users is 'password123' (bcrypt encoded)
