package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repository.RolesRepository;
import ru.kata.spring.boot_security.demo.repository.UsersRepository;

import java.util.HashSet;

@Component
public class DataLoader implements CommandLineRunner {
    private final UsersRepository usersRepository;
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(UsersRepository usersRepository, RolesRepository rolesRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        rolesRepository.save(new Role("ROLE_USER"));
        rolesRepository.save(new Role("ROLE_ADMIN"));

        User admin = new User("admin", passwordEncoder.encode("admin"), "adminic", "adminov", "admin@gmail.com", 30);
        admin.setRoles(new HashSet<>(rolesRepository.findAll()));

        User user = new User("user", passwordEncoder.encode("user"), "useric", "userov", "user@gmail.com", 25);
        user.addRole(rolesRepository.findByName("ROLE_USER"));

        usersRepository.save(admin);
        usersRepository.save(user);
    }
}
