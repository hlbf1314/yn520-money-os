package com.yn520.money.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author TimHuang
 * @date 2019/2/27 9:16
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer
{
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins(
						"http://www.yn520.com.cn","http://www.yn520.com.cn:3002", "https://www.yn520.com.cn",
						"http://money.yn520.com.cn", "https://money.yn520.com.cn",
						"http://student.yn520.com.cn", "https://student.yn520.com.cn",
						"http://sell.yn520.com.cn","https://sell.yn520.com.cn",
						"http://sell-admin.yn520.com.cn", "https://sell-admin.yn520.com.cn")
				.exposedHeaders("access-control-allow-headers",
						"access-control-allow-methods",
						"access-control-allow-origin",
						"access-control-max-age",
						"X-Frame-Options")
				.allowCredentials(true)
				//设置允许的方法
				.allowedMethods("*")
				.allowedHeaders("*")
				//跨域允许时间
				.maxAge(7200);
	}
}
