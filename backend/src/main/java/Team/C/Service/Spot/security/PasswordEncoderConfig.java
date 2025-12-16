package Team.C.Service.Spot.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Security Configuration for Password Encoding
 * Uses BCrypt algorithm for secure password hashing
 *
 * @author Service-Spot Team
 * @version 1.0
 */
@Configuration
public class PasswordEncoderConfig {

    /**
     * BCrypt Password Encoder Bean
     * Strength: 10 (default, provides good balance between security and performance)
     *
     * @return PasswordEncoder instance for encoding and verifying passwords
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

