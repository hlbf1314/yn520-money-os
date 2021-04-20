package com.yn520.money.service.impl;

import com.yn520.money.mapper.balance.BalanceReportMapper;
import com.yn520.money.mapper.cash.CashReportMapper;
import com.yn520.money.mapper.income.IncomeReportMapper;
import com.yn520.money.pojo.Balance000001;
import com.yn520.money.pojo.Cash000001;
import com.yn520.money.pojo.Income000001;
import com.yn520.money.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/18 22:58
 * @Description:
 */
@Service
public class ReportServiceImpl implements ReportService {
    @Autowired
    private IncomeReportMapper incomeReportMapper;

    @Autowired
    private BalanceReportMapper balanceReportMapper;

    @Autowired
    private CashReportMapper cashReportMapper;

    @Override
    public Income000001 oneSeasonIncome(String tableName, String rDate) {
        return incomeReportMapper.oneSeason(tableName, rDate);
    }

    @Override
    public Balance000001 oneSeasonBalance(String tableName, String rDate) {
        return balanceReportMapper.oneSeason(tableName, rDate);
    }

    @Override
    public Cash000001 oneSeasonCash(String tableName, String rDate) {
        return cashReportMapper.oneSeason(tableName, rDate);
    }

    @Override
    public List<Income000001> seasonAllIncome(String tableName) {
        return incomeReportMapper.seasonAll(tableName);
    }

    @Override
    public List<Balance000001> seasonAllBalance(String tableName) {
        return balanceReportMapper.seasonAll(tableName);
    }

    @Override
    public List<Cash000001> seasonAllCash(String tableName) {
        return cashReportMapper.seasonAll(tableName);
    }

    @Override
    public List<Income000001> seasonsIncome(String tableName, int count) {
        return incomeReportMapper.seasons(tableName, count);
    }

    @Override
    public List<Balance000001> seasonsBalance(String tableName, int count) {
        return balanceReportMapper.seasons(tableName, count);
    }

    @Override
    public List<Cash000001> seasonsCash(String tableName, int count) {
        return cashReportMapper.seasons(tableName, count);
    }
}
