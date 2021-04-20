package com.yn520.money.mapper.income;

import com.yn520.money.pojo.Income000001;

import java.util.List;

public interface IncomeReportMapper {
    public Income000001 oneSeason(String tableName, String rDate);

    public List<Income000001> seasons(String tableName, int count);

    public List<Income000001> seasonAll(String tableName);
}
