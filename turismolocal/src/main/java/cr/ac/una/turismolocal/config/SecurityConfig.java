package cr.ac.una.turismolocal.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/error").permitAll()
                        .requestMatchers("/api/users/me").authenticated()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("http://localhost:5173/places", true)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("http://localhost:5173/")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                );

        return http.build();
    }
}