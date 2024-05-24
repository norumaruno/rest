package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.AdminService;

@Controller
public class UsersController {

    private final AdminService adminService;

    @Autowired
    public UsersController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/user")
    public String getProfile(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        String username = userDetails.getUsername();
        User user = adminService.findByUsername(username);
        model.addAttribute("user", user);
        return "users/profile";
    }
}