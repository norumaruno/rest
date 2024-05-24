package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.AdminService;
import ru.kata.spring.boot_security.demo.service.RegistrationService;

@Controller
@RequestMapping("/admin")
public class AdminsController {


    private final RegistrationService registrationService;
    private final AdminService adminService;

    public AdminsController(RegistrationService registrationService, AdminService adminService) {
        this.registrationService = registrationService;
        this.adminService = adminService;
    }

    @GetMapping()
    public String admin() {
        return "/admin/admin";
    }

    @GetMapping("/users")
    public String getAllUsers(Model model) {
        model.addAttribute("users", adminService.findAll());

        return "/admin/users";
    }

    @GetMapping("/profile")
    public String getProfile(@RequestParam(name = "username") String username, Model model) {
        model.addAttribute("user", adminService.findByUsername(username));

        return "admin/profile";
    }

    @GetMapping("/create")
    public String newUser(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", adminService.getRoles());

        return "/admin/create";
    }

    @PostMapping("/users")
    public String saveUser(@ModelAttribute("user") User user, Model model) {
        if (adminService.isValidUsername(user)) {
            registrationService.register(user);

            return "redirect:/admin/users";
        }

        model.addAttribute("error", "Invalid username");

        return "/admin/create";
    }

    @GetMapping("/edit")
    public String editUser(@RequestParam(name = "username") String username, Model model) {
        model.addAttribute("user", adminService.findByUsername(username));
        model.addAttribute("roles", adminService.getRoles());

        return "/admin/edit";
    }

    @PatchMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user, Model model) {
        if (user.getUsername().isEmpty()) {
            model.addAttribute("error", "Invalid username");

            return "/admin/edit";
        }

        registrationService.register(user);

        return "redirect:/admin/profile?username=" + user.getUsername();
    }

    @DeleteMapping("/delete")
    public String deleteUser(@RequestParam(name = "username") String username) {
        adminService.delete(username);

        return "redirect:/admin/users";
    }
}
