package com.yn520.money.service.impl;

import com.yn520.money.mapper.stockinfo.AllStockInfoMapper;
import com.yn520.money.pojo.StockInfo;
import com.yn520.money.service.StockInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/20 22:01
 * @Description:
 */
@Service
public class StockInfoServiceImpl implements StockInfoService {
    @Autowired
    private AllStockInfoMapper stockInfoMapper;

    @Override
    public List<StockInfo> getAllStocks() {
        return stockInfoMapper.selectAll();
    }

    @Override
    public StockInfo getStockInfoByName(String name) {
        StockInfo info = new StockInfo();
        info.setName(name);
        return stockInfoMapper.selectOne(info);
    }

    @Override
    public StockInfo getStockInfoByCode(String code) {
        StockInfo info = new StockInfo();
        info.setSymbol(code);
        return stockInfoMapper.selectOne(info);
    }
}
