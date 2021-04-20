package com.yn520.money.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/11 22:27
 * @Description:
 */
@Configuration
public class Config {
    @Bean
    public JavaMailSender javaMailSender() {
        return new JavaMailSenderImpl();
    }
}
