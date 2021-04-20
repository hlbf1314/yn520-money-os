package com.yn520.money.enums;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/4/14 00:10
 * @Description:
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface SwaggerDisplayEnum {
    String valueName() default "value";

    String descName() default "desc";
}
