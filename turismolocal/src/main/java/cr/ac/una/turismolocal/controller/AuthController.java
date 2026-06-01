package cr.ac.una.turismolocal.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {

        if (principal == null) {
            return Map.of("authenticated", false);
        }

        return Map.of(
                "authenticated", true,
                "name", principal.getAttribute("name"),
                "email", principal.getAttribute("email"),
                "picture", principal.getAttribute("picture")
        );
    }
}