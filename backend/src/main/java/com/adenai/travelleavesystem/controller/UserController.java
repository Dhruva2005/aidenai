package com.adenai.travelleavesystem.controller;


import com.adenai.travelleavesystem.repository.UserRepository;
import com.adenai.travelleavesystem.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}/leaves")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Integer>> getUserLeaves(@PathVariable Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Users can only see their own leaves, or managers can see any user's leaves
        if (!userPrincipal.getId().equals(id) && !userPrincipal.getRole().equals("MANAGER")) {
            return ResponseEntity.status(403).build();
        }

        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(Map.of("leavesLeft", user.getLeavesLeft())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .map(user -> {
                    Map<String, Object> userInfo = Map.of(
                        "id", user.getId(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "leavesLeft", user.getLeavesLeft()
                    );
                    return ResponseEntity.ok(userInfo);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
