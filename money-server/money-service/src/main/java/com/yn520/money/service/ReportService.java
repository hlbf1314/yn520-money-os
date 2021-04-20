package com.yn520.money.service;

import com.yn520.money.pojo.Balance000001;
import com.yn520.money.pojo.Cash000001;
import com.yn520.money.pojo.Income000001;

import java.util.List;

public interface ReportService {

    /***************  单季度   *******************/
    public Income000001 oneSeasonIncome(String tableName, String rDate);

    public Balance000001 oneSeasonBalance(String tableName, String rDate);

    public Cash000001 oneSeasonCash(String tableName, String rDate);


    /***************  多个季度   *******************/
    public List<Income000001> seasonsIncome(String tableName, int count);

    public List<Balance000001> seasonsBalance(String tableName, int count);

    public List<Cash000001> seasonsCash(String tableName, int count);

    /*****************  全部季度 *******************/
    public List<Income000001> seasonAllIncome(String tableName);

    public List<Balance000001> seasonAllBalance(String tableName);

    public List<Cash000001> seasonAllCash(String tableName);
}
