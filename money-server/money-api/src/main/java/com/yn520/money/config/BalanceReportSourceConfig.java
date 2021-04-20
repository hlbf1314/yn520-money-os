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
@MapperScan(basePackages = "com.yn520.money.mapper.balance", sqlSessionTemplateRef = "balanceSqlSessionTemplate")
public class BalanceReportSourceConfig {

    @Bean(name = "balanceDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.balance")
    public DataSource balanceDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "balanceSqlSessionFactory")
    public SqlSessionFactory balanceSqlSessionFactory(@Qualifier("balanceDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/BalanceReportMapper.xml"));
        return bean.getObject();
    }

    @Bean(name = "balanceTransactionManager")
    public DataSourceTransactionManager balanceTransactionManager(@Qualifier("balanceDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "balanceSqlSessionTemplate")
    public SqlSessionTemplate balanceSqlSessionTemplate(@Qualifier("balanceSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
