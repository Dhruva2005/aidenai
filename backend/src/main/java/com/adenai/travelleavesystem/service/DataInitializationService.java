package com.adenai.travelleavesystem.service;

import com.adenai.travelleavesystem.model.Role;
import com.adenai.travelleavesystem.model.User;
import com.adenai.travelleavesystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// @Service
public class DataInitializationService { // implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // @Override
    // @Transactional
    public void run(String... args) throws Exception {
        try {
            // Create sample users if they don't exist
            if (userRepository.count() == 0) {
                // Create Manager
                User manager = new User();
                manager.setFirstName("John");
                manager.setLastName("Manager");
                manager.setEmail("manager@gmail.com");
                manager.setPassword(passwordEncoder.encode("password123"));
                manager.setRole(Role.MANAGER);
                manager.setLeavesLeft(25);
                User savedManager = userRepository.save(manager);

                // Create Employee 1
                User employee1 = new User();
                employee1.setFirstName("Alice");
                employee1.setLastName("Johnson");
                employee1.setEmail("alice@gmail.com");
                employee1.setPassword(passwordEncoder.encode("password123"));
                employee1.setRole(Role.EMPLOYEE);
                employee1.setLeavesLeft(30);
                employee1.setManagerId(savedManager.getId());
                userRepository.save(employee1);

                // Create Employee 2
                User employee2 = new User();
                employee2.setFirstName("Bob");
                employee2.setLastName("Smith");
                employee2.setEmail("bob@gmail.com");
                employee2.setPassword(passwordEncoder.encode("password123"));
                employee2.setRole(Role.EMPLOYEE);
                employee2.setLeavesLeft(28);
                employee2.setManagerId(savedManager.getId());
                userRepository.save(employee2);

                System.out.println("Demo users created successfully!");
                System.out.println("Manager: manager@gmail.com / password123");
                System.out.println("Employee 1: alice@gmail.com / password123");
                System.out.println("Employee 2: bob@gmail.com / password123");
            }
        } catch (Exception e) {
            System.err.println("Error initializing demo data: " + e.getMessage());
            e.printStackTrace();
            // Don't throw the exception to prevent application startup failure
        }
    }
}
