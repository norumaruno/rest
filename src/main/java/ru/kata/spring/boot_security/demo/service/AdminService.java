package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface AdminService extends UserDetailsService {
    User findByUsername(String username);

    List<User> findAll();

    void delete(String username);

    List<Role> getRoles();

    void save(User user);
}
