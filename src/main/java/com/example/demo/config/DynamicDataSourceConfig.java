package com.example.demo.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DynamicDataSourceConfig {

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:root}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Attempt connecting to configured MySQL if url is present and not localhost
        if (configuredUrl != null && configuredUrl.startsWith("jdbc:mysql://")) {
            try {
                DriverManager.setLoginTimeout(3);
                try (Connection conn = DriverManager.getConnection(configuredUrl, username, password)) {
                    System.out.println("✅ Successfully connected to MySQL Database: " + configuredUrl);
                    HikariConfig config = new HikariConfig();
                    config.setJdbcUrl(configuredUrl);
                    config.setUsername(username);
                    config.setPassword(password);
                    config.setDriverClassName("com.mysql.cj.jdbc.Driver");
                    return new HikariDataSource(config);
                }
            } catch (Exception e) {
                System.err.println("⚠️ MySQL Database is not reachable: " + e.getMessage());
                System.err.println("⚡ Starting resilient embedded Database so server stays 100% ONLINE!");
            }
        }

        // Resilient Fallback DataSource (H2 in MySQL compatibility mode)
        HikariConfig h2Config = new HikariConfig();
        h2Config.setJdbcUrl("jdbc:h2:file:./data/ni_arogiyam;DB_CLOSE_DELAY=-1;MODE=MySQL;NON_KEYWORDS=USER,VALUE");
        h2Config.setUsername("sa");
        h2Config.setPassword("");
        h2Config.setDriverClassName("org.h2.Driver");
        return new HikariDataSource(h2Config);
    }
}
