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
@MapperScan(basePackages = "com.yn520.money.mapper.stockinfo", sqlSessionTemplateRef = "stockinfoSqlSessionTemplate")
public class StockInfoSourceConfig {

    @Bean(name = "stockinfoDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.stockinfo")
    public DataSource stockinfoDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "stockinfoSqlSessionFactory")
    public SqlSessionFactory stockinfoSqlSessionFactory(@Qualifier("stockinfoDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/AllStockInfoMapper.xml"));
        return bean.getObject();
    }

    @Bean(name = "stockinfoTransactionManager")
    public DataSourceTransactionManager stockinfoTransactionManager(@Qualifier("stockinfoDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "stockinfoSqlSessionTemplate")
    public SqlSessionTemplate stockinfoSqlSessionTemplate(@Qualifier("stockinfoSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
