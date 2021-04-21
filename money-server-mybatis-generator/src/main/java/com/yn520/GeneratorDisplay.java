package com.yn520;

import org.mybatis.generator.api.MyBatisGenerator;
import org.mybatis.generator.config.Configuration;
import org.mybatis.generator.config.xml.ConfigurationParser;
import org.mybatis.generator.internal.DefaultShellCallback;

import java.io.File;
import java.util.ArrayList;
import java.util.List;


public class GeneratorDisplay {

    public void generator(String name) throws Exception {
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;
        //指定 逆向工程配置文件
        File configFile = new File(name);
        ConfigurationParser cp = new ConfigurationParser(warnings);
        Configuration config = cp.parseConfiguration(configFile);
        DefaultShellCallback callback = new DefaultShellCallback(overwrite);
        MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config,
                callback, warnings);
        myBatisGenerator.generate(null);
    }

    private static void moneyGenerator() throws Exception {
        GeneratorDisplay generatorSqlmap = new GeneratorDisplay();
        generatorSqlmap.generator("generator-money/incomeGeneratorConfig.xml");
        generatorSqlmap.generator("generator-money/balanceGeneratorConfig.xml");
        generatorSqlmap.generator("generator-money/cashGeneratorConfig.xml");
        generatorSqlmap.generator("generator-money/stockInfoGeneratorConfig.xml");
    }

    public static void main(String[] args) throws Exception {
        try {
            moneyGenerator();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
