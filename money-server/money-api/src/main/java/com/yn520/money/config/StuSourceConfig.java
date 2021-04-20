package com.yn520.money.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import tk.mybatis.spring.annotation.MapperScan;

import javax.sql.DataSource;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/18 21:29
 * @Description:
 */
@Configuration
@MapperScan(basePackages = "com.yn520.money.mapper.stu", sqlSessionTemplateRef = "studentSqlSessionTemplate")
public class StuSourceConfig {

    @Bean(name = "studentDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.student")
    @Primary
    public DataSource studentDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "studentSqlSessionFactory")
    @Primary
    public SqlSessionFactory studentSqlSessionFactory(@Qualifier("studentDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/StuMapper.xml"));
        return bean.getObject();
    }

    @Bean(name = "studentTransactionManager")
    @Primary
    public DataSourceTransactionManager studentTransactionManager(@Qualifier("studentDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "studentSqlSessionTemplate")
    @Primary
    public SqlSessionTemplate studentSqlSessionTemplate(@Qualifier("studentSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
