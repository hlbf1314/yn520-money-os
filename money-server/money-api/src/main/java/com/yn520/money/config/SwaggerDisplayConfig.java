package com.yn520.money.config;

import com.fasterxml.classmate.ResolvedType;
import com.google.common.base.Optional;
import com.yn520.money.enums.SwaggerDisplayEnum;
import io.swagger.annotations.ApiModelProperty;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import springfox.documentation.builders.ModelPropertyBuilder;
import springfox.documentation.schema.Annotations;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.schema.ModelPropertyBuilderPlugin;
import springfox.documentation.spi.schema.contexts.ModelPropertyContext;
import springfox.documentation.swagger.schema.ApiModelProperties;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/4/14 00:18
 * @Description:
 */
@Component
@Primary
@Slf4j
public class SwaggerDisplayConfig implements ModelPropertyBuilderPlugin {
    /**
     * 是否允许swagger
     */
//    @Value("${swagger.enable:true}")
//    private Boolean enableSwagger;

    @Override
    public void apply(ModelPropertyContext context) {
        //如果不支持swagger的话，直接返回
//        if (!enableSwagger) {
//            return;
//        }

        //获取当前字段的类型
        final Class fieldType = context.getBeanPropertyDefinition().get().getField().getRawType();


        //为枚举字段设置注释
        descForEnumFields(context, fieldType);
    }

    /**
     * 为枚举字段设置注释
     */
    private void descForEnumFields(ModelPropertyContext context, Class fieldType) {
        Optional<ApiModelProperty> annotation = Optional.absent();

        if (context.getAnnotatedElement().isPresent()) {
            annotation = annotation
                    .or(ApiModelProperties.findApiModePropertyAnnotation(context.getAnnotatedElement().get()));
        }
        if (context.getBeanPropertyDefinition().isPresent()) {
            annotation = annotation.or(Annotations.findPropertyAnnotation(
                    context.getBeanPropertyDefinition().get(),
                    ApiModelProperty.class));
        }

        //没有@ApiModelProperty 或者 notes 属性没有值，直接返回
        if (!annotation.isPresent() || StringUtils.isBlank((annotation.get()).notes())) {
            return;
        }

        //@ApiModelProperties中的notes指定的class类型
        Class rawPrimaryType;
        try {
            rawPrimaryType = Class.forName((annotation.get()).notes());
        } catch (ClassNotFoundException e) {
            //如果指定的类型无法转化，直接忽略
            return;
        }

        //如果对应的class是一个@SwaggerDisplayEnum修饰的枚举类，获取其中的枚举值
        Object[] subItemRecords = null;
        SwaggerDisplayEnum swaggerDisplayEnum = AnnotationUtils
                .findAnnotation(rawPrimaryType, SwaggerDisplayEnum.class);
        if (null != swaggerDisplayEnum && Enum.class.isAssignableFrom(rawPrimaryType)) {
            subItemRecords = rawPrimaryType.getEnumConstants();
        }
        if (null == subItemRecords) {
            return;
        }


        final List<String> displayValues = Arrays.stream(subItemRecords).filter(Objects::nonNull).map(item -> {
            return item.toString() ;
        }).filter(Objects::nonNull).collect(Collectors.toList());

        String joinText = " (" + String.join("; ", displayValues) + ")";
        try {
            Field mField = ModelPropertyBuilder.class.getDeclaredField("description");
            mField.setAccessible(true);
            joinText = mField.get(context.getBuilder()) + joinText;
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        final ResolvedType resolvedType = context.getResolver().resolve(fieldType);
        context.getBuilder().description(joinText).type(resolvedType);
    }



    @Override
    public boolean supports(DocumentationType documentationType) {
        return true;
    }

}
