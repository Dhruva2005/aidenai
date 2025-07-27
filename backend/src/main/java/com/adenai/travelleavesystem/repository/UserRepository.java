package com.adenai.travelleavesystem.repository;

import com.adenai.travelleavesystem.model.User;
import com.adenai.travelleavesystem.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Long countByRole(Role role);
}
