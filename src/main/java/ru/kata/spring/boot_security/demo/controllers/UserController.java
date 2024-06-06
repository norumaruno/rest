package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final RoleService rolesService;

    @Autowired
    public UserController(UserService userService, RoleService rolesService) {
        this.userService = userService;
        this.rolesService = rolesService;
    }

    @GetMapping("/admin/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/admin/roles")
    public List<Role> getAllRoles() {
        return rolesService.getRoles();
    }

    @PostMapping("/admin/users")
    public User newUser(@RequestBody User user) {
        userService.save(user);

        return user;
    }

    @PatchMapping("/admin/users")
    public User updateUser(@RequestBody User user) {
        userService.update(user);

        return user;
    }

    @DeleteMapping("/admin/users")
    public void deleteUser(@RequestParam(name = "username") String username) {
        userService.delete(username);

        System.out.println("user " + username + " deleted");
    }

    @GetMapping("/user")
    public User getUser(Authentication auth) {
        return userService.findByUsername(auth.getName());
    }
}
