package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.AdminService;
import ru.kata.spring.boot_security.demo.service.RegistrationService;

@Controller
public class AuthController {

    private final AdminService adminService;
    private final RegistrationService registrationService;

    @Autowired
    public AuthController(AdminService adminService, RegistrationService registrationService) {
        this.adminService = adminService;
        this.registrationService = registrationService;
    }

    @GetMapping("/")
    public String homePage() {

        return "home";
    }

    @GetMapping("/registration")
    public String registrationPage(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", adminService.getRoles());


        return "auth/registration";
    }

    @PostMapping("/registration")
    public String registration(@ModelAttribute("user") User user, Model model) {
        System.out.println("method");
        if (adminService.isValidUsername(user)) {
            registrationService.register(user);

            return "redirect:/home";
        }

        model.addAttribute("error", "Invalid username");

        return "auth/registration";
    }
}
