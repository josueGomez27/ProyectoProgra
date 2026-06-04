package cr.ac.una.turismolocal.controller;

import cr.ac.una.turismolocal.entity.Role;
import cr.ac.una.turismolocal.entity.User;
import cr.ac.una.turismolocal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {

        System.out.println("ENTRO A /api/users/me");

        if (principal == null) {
            return Map.of("authenticated", false);
        }

        String email = principal.getAttribute("email");

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {

            user = User.builder()
                    .googleId(principal.getName())
                    .name(principal.getAttribute("name"))
                    .email(email)
                    .pictureUrl(principal.getAttribute("picture"))
                    .role(Role.USER)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(user);
        }

        return Map.of(
                "authenticated", true,
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "picture", user.getPictureUrl(),
                "role", user.getRole(),
                "active", user.getActive()
        );
    }
}