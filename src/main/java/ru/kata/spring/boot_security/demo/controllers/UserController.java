package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
public class UserController {

    private final UserService userService;
    private final RoleService rolesService;

    @Autowired
    public UserController(UserService userService, RoleService rolesService) {
        this.userService = userService;
        this.rolesService = rolesService;
    }

    @GetMapping("/admin")
    public String admin(Model model, Authentication auth) {
        User currentUser = userService.findByUsername(auth.getName());
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("newUser", new User());
        model.addAttribute("allRoles", rolesService.getRoles());
        model.addAttribute("allUsers", userService.findAll());

        return "/admin/admin";
    }

    @PostMapping("/create")
    public String newUser(@ModelAttribute User user) {
        userService.save(user);

        return "redirect:/admin";
    }

    @PatchMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user) {
        userService.save(user);

        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String deleteUser(@RequestParam(name = "username") String username) {
        userService.delete(username);

        return "redirect:/admin";
    }

    @GetMapping("/user")
    public String getProfile(@ModelAttribute("user") User user, Authentication auth, Model model) {
        User currentUser = userService.findByUsername(auth.getName());
        model.addAttribute("currentUser", currentUser);

        return "/users/profile";
    }
}
