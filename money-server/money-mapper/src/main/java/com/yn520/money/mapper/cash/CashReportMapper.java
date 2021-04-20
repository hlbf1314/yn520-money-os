package com.yn520.money.mapper.cash;

import com.yn520.money.pojo.Cash000001;

import java.util.List;

public interface CashReportMapper {
    public Cash000001 oneSeason(String tableName, String rDate);

    public List<Cash000001> seasons(String tableName, int count);

    public List<Cash000001> seasonAll(String tableName);
}
