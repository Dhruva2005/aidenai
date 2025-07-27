package com.adenai.travelleavesystem.dto;

import com.adenai.travelleavesystem.model.Role;

public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Integer leavesLeft;

    // Constructors
    public UserResponse() {}

    public UserResponse(Long id, String firstName, String lastName, String email, Role role, Integer leavesLeft) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.leavesLeft = leavesLeft;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Integer getLeavesLeft() {
        return leavesLeft;
    }

    public void setLeavesLeft(Integer leavesLeft) {
        this.leavesLeft = leavesLeft;
    }
}
