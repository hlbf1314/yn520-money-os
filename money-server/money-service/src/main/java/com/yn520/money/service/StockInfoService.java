package com.yn520.money.service;

import com.yn520.money.pojo.StockInfo;

import java.util.List;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/20 21:59
 * @Description:
 */
public interface StockInfoService {
    public StockInfo getStockInfoByCode(String code);

    public StockInfo getStockInfoByName(String name);

    public List<StockInfo> getAllStocks();
}
