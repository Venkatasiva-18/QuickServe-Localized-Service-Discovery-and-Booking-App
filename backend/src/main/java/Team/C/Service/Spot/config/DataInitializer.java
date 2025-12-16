package Team.C.Service.Spot.config;

import Team.C.Service.Spot.model.Admin;
import Team.C.Service.Spot.repositery.AdminRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final AdminRepo adminRepo;

    @Value("${app.admin.email:admin@servicespot.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.admin.name:System Admin}")
    private String adminName;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            log.info("=================================================");
            log.info("Starting Data Initialization...");
            log.info("=================================================");

            // Create default admin if not exists
            Optional<Admin> existingAdmin = adminRepo.findByEmail(adminEmail);

            if (existingAdmin.isEmpty()) {
                Admin admin = Admin.builder()
                        .name(adminName)
                        .email(adminEmail)
                        .password(adminPassword)
                        .role("ADMIN")
                        .build();

                adminRepo.save(admin);

                log.info("✅ Default Admin Created Successfully!");
                log.info("=================================================");
                log.info("📧 Admin Email: {}", adminEmail);
                log.info("🔑 Admin Password: {}", adminPassword);
                log.info("=================================================");
                log.info("⚠️  IMPORTANT: Please change the default password after first login!");
                log.info("=================================================");
            } else {
                log.info("✅ Admin already exists in database");
                log.info("=================================================");
                log.info("📧 Admin Email: {}", adminEmail);
                log.info("🔑 Admin Password: {}", adminPassword);
                log.info("=================================================");
            }

            log.info("✅ Database initialization completed successfully!");
            log.info("=================================================");
            log.info("📊 Database Name: servicespot");
            log.info("🌐 Backend URL: http://localhost:8080");
            log.info("🔗 Admin Login API: http://localhost:8080/api/admin/login");
            log.info("🔗 Customer Register API: http://localhost:8080/api/customer/register");
            log.info("🔗 Provider Register API: http://localhost:8080/api/provider/register");
            log.info("=================================================");
        };
    }
}

