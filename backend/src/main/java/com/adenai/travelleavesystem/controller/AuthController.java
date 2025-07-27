package com.adenai.travelleavesystem.controller;

import com.adenai.travelleavesystem.dto.JwtResponse;
import com.adenai.travelleavesystem.dto.LoginRequest;
import com.adenai.travelleavesystem.dto.SignupRequest;
import com.adenai.travelleavesystem.dto.UserResponse;
import com.adenai.travelleavesystem.model.Role;
import com.adenai.travelleavesystem.model.User;
import com.adenai.travelleavesystem.repository.UserRepository;
import com.adenai.travelleavesystem.security.UserPrincipal;
import com.adenai.travelleavesystem.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // First check if user exists
            if (!userRepository.findByEmail(loginRequest.getEmail()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                error.put("message", "No user found with the provided email address");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getEmail(),
                    userDetails.getFirstName(),
                    userDetails.getLastName(),
                    userDetails.getRole()));

        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            error.put("message", "Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (AuthenticationException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // Public signup endpoint for initial setup (when no managers exist)
    @PostMapping("/signup/public")
    public ResponseEntity<?> registerPublicUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            logger.info("Public registration attempt for email: {}", signupRequest.getEmail());
            
            // Check if any managers exist - if yes, require authenticated signup
            long managerCount = userRepository.countByRole(Role.MANAGER);
            if (managerCount > 0) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Public registration disabled");
                error.put("message", "Please contact your manager for account creation");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            // Validate required fields
            if (signupRequest.getFirstName() == null || signupRequest.getFirstName().trim().isEmpty()) {
                return createErrorResponse("Validation failed", "First name is required", HttpStatus.BAD_REQUEST);
            }

            if (signupRequest.getLastName() == null || signupRequest.getLastName().trim().isEmpty()) {
                return createErrorResponse("Validation failed", "Last name is required", HttpStatus.BAD_REQUEST);
            }

            if (signupRequest.getEmail() == null || signupRequest.getEmail().trim().isEmpty()) {
                return createErrorResponse("Validation failed", "Email is required", HttpStatus.BAD_REQUEST);
            }

            if (signupRequest.getPassword() == null || signupRequest.getPassword().trim().isEmpty()) {
                return createErrorResponse("Validation failed", "Password is required", HttpStatus.BAD_REQUEST);
            }

            // Check if email already exists
            if (userRepository.findByEmail(signupRequest.getEmail().trim().toLowerCase()).isPresent()) {
                return createErrorResponse("Email already exists", "A user with this email address already exists", HttpStatus.BAD_REQUEST);
            }

            // Create new manager user
            User user = new User();
            user.setFirstName(signupRequest.getFirstName().trim());
            user.setLastName(signupRequest.getLastName().trim());
            user.setEmail(signupRequest.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            user.setRole(Role.MANAGER); // Public signup only creates managers
            user.setLeavesLeft(30); // Default leaves

            logger.info("Attempting to save manager user: {}", user.getEmail());
            User savedUser = userRepository.save(user);
            logger.info("Successfully saved manager with ID: {}", savedUser.getId());

            UserResponse userResponse = new UserResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getLeavesLeft()
            );

            return ResponseEntity.ok(userResponse);

        } catch (Exception e) {
            logger.error("Public registration failed for email: {}", signupRequest.getEmail(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed");
            error.put("message", "An error occurred during user registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    private ResponseEntity<?> createErrorResponse(String error, String message, HttpStatus status) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        return ResponseEntity.status(status).body(errorResponse);
    }
}
