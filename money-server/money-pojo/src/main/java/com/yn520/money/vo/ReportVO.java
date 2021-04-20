package com.yn520.money.vo;

import lombok.Data;

/**
 * @author TimHuang
 * @date 2020-11-20 09:56
 * @tel 15807663767
 */
@Data
public class ReportVO {
    private String stockCode;
    private int type;

    /**
     * 查询多条数据时，需要传递count
     */
    private int count;

    /**
     * 请求单条数据时，需要传递year\season
     */
    private int year;
    private int season;
    private Object report;

    /******************************* 查询单季度数据时 ************************/
    public ReportVO(String stockCode, int type, int year, int season) {
        this.stockCode = stockCode;
        this.type = type;
        this.year = year;
        this.season = season;
    }

    public ReportVO(String stockCode, int type, int year, int season, Object report) {
        this.stockCode = stockCode;
        this.type = type;
        this.year = year;
        this.season = season;
        this.report = report;
    }

    /******************************* 查询多条数据时 ************************/
    public ReportVO(String stockCode, int type, int count) {
        this.stockCode = stockCode;
        this.type = type;
        this.count = count;
    }

    public ReportVO(String stockCode, int type, int count, Object report) {
        this.stockCode = stockCode;
        this.type = type;
        this.count = count;
        this.report = report;
    }

    /******************************* 查询全部数据时 ************************/
    public ReportVO(String stockCode, int type) {
        this.stockCode = stockCode;
        this.type = type;
    }

    public ReportVO(String stockCode, int type, Object report) {
        this.stockCode = stockCode;
        this.type = type;
        this.report = report;
    }
}
