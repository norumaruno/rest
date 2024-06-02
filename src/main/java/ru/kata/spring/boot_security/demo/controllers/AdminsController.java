package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.AdminService;

@Controller
@RequestMapping("/admin")
public class AdminsController {

    private final AdminService adminService;

    @Autowired
    public AdminsController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping()
    public String admin(Model model, Authentication auth) {
        User currentUser = adminService.findByUsername(auth.getName());
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("newUser", new User());
        model.addAttribute("allRoles", adminService.getRoles());
        model.addAttribute("allUsers", adminService.findAll());
        return "/admin/admin";
    }

    @PostMapping("/create")
    public String newUser(@ModelAttribute User user) {
        adminService.save(user);

        return "redirect:/admin";
    }

    @PatchMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user) {
        adminService.save(user);

        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String deleteUser(@RequestParam(name = "username") String username) {
        adminService.delete(username);

        return "redirect:/admin";
    }
}
