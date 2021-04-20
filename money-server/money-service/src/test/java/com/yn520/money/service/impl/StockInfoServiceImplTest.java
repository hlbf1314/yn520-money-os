package com.yn520.money.service.impl;

import com.yn520.money.pojo.StockInfo;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

class StockInfoServiceImplTest {

    @Autowired
    StockInfoServiceImpl stockInfoService;

    @Test
    void getAllStocks() {
        List<StockInfo> list = stockInfoService.getAllStocks();
    }

    @Test
    void getStockInfoByName() {
    }

    @Test
    void getStockInfoByCode() {
    }
}