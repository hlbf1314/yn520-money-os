package com.yn520.money.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
@MapperScan(basePackages = "com.yn520.money.mapper.cash", sqlSessionTemplateRef = "cashSqlSessionTemplate")
public class CashReportSourceConfig {

    @Bean(name = "cashDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.cash")
    public DataSource cashDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "cashSqlSessionFactory")
    public SqlSessionFactory cashSqlSessionFactory(@Qualifier("cashDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/CashReportMapper.xml"));
        return bean.getObject();
    }

    @Bean(name = "cashTransactionManager")
    public DataSourceTransactionManager cashTransactionManager(@Qualifier("cashDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "cashSqlSessionTemplate")
    public SqlSessionTemplate cashSqlSessionTemplate(@Qualifier("cashSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
