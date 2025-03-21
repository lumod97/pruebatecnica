package com.sintad.technicaltest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TechnicaltestApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechnicaltestApplication.class, args);
	}

}
