package com.yn520.money.mapper.balance;

import com.yn520.money.pojo.Balance000001;

import java.util.List;

public interface BalanceReportMapper {
    public Balance000001 oneSeason(String tableName, String rDate);

    public List<Balance000001> seasons(String tableName, int count);

    public List<Balance000001> seasonAll(String tableName);

}
