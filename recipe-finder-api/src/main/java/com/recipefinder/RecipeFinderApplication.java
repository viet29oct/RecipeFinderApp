package com.recipefinder;

import com.recipefinder.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class RecipeFinderApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecipeFinderApplication.class, args);
    }
}
