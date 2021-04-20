package com.yn520.money.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import tk.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/18 21:29
 * @Description:
 */
@Configuration
@MapperScan(basePackages = "com.yn520.money.mapper.teacher", sqlSessionTemplateRef  = "teacherSqlSessionTemplate")
public class TeacherSourceConfig {

    @Bean(name = "teacherDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.teacher")
    
    public DataSource teacherDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "teacherSqlSessionFactory")
    
    public SqlSessionFactory teacherSqlSessionFactory(@Qualifier("teacherDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/TeacherMapper.xml"));
        return bean.getObject();
    }

    @Bean(name = "teacherTransactionManager")
    
    public DataSourceTransactionManager teacherTransactionManager(@Qualifier("teacherDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "teacherSqlSessionTemplate")
    
    public SqlSessionTemplate teacherSqlSessionTemplate(@Qualifier("teacherSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
