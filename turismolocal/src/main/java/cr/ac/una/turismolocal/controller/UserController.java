package cr.ac.una.turismolocal.controller;

import cr.ac.una.turismolocal.entity.Role;
import cr.ac.una.turismolocal.entity.User;
import cr.ac.una.turismolocal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email).orElse(null);
    }

    @GetMapping("/google/{googleId}")
    public User getUserByGoogleId(@PathVariable String googleId) {
        return userService.getUserByGoogleId(googleId).orElse(null);
    }

    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {

        if (principal == null) {
            return null;
        }

        Map<String, Object> attributes = principal.getAttributes();

        String googleId = attributes.get("sub").toString();
        String name = attributes.get("name").toString();
        String email = attributes.get("email").toString();
        String pictureUrl = attributes.get("picture").toString();

        User user = userService.getUserByEmail(email).orElse(null);

        if (user == null) {

            user = User.builder()
                    .googleId(googleId)
                    .name(name)
                    .email(email)
                    .pictureUrl(pictureUrl)
                    .role(Role.USER)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

        } else {

            user.setGoogleId(googleId);
            user.setName(name);
            user.setPictureUrl(pictureUrl);
            user.setUpdatedAt(LocalDateTime.now());

        }

        return userService.saveUser(user);
    }

    @PostMapping
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}