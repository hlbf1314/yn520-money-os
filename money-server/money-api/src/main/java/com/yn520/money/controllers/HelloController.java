package com.yn520.money.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/5 23:53
 * @Description:
 */
@ApiIgnore
@RestController
public class HelloController {
    @GetMapping("/hello")
    public Object hello() {
        return say_01_Hello002();
    }

    private String say_01_Hello002() {
        return "hello,,";
    }
}
