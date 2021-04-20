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
@MapperScan(basePackages = "com.yn520.money.mapper.income", sqlSessionTemplateRef = "incomeSqlSessionTemplate")
public class IncomeReportSourceConfig {

    @Bean(name = "incomeDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.income")
    public DataSource incomeDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "incomeSqlSessionFactory")
    public SqlSessionFactory incomeSqlSessionFactory(@Qualifier("incomeDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/IncomeReportMapper.xml"));
        return bean.getObject();
    }

    @Bean(name = "incomeTransactionManager")
    public DataSourceTransactionManager incomeTransactionManager(@Qualifier("incomeDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "incomeSqlSessionTemplate")
    public SqlSessionTemplate incomeSqlSessionTemplate(@Qualifier("incomeSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
