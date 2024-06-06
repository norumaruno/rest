package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    User findByUsername(String username);

    List<User> findAll();

    void delete(String username);

    void save(User user);

    Optional<User> findById(Long id);

    void update(User user);
}
