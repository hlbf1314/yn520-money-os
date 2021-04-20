package com.yn520.money.pojo;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "all_stock_info")
public class StockInfo {
    @Id
    private String symbol;

    @Column(name = "ts_code")
    private String tsCode;

    private String name;

    private String area;

    private String industry;

    @Column(name = "list_date")
    private String listDate;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    /**
     * @return symbol
     */
    public String getSymbol() {
        return symbol;
    }

    /**
     * @param symbol
     */
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    /**
     * @return ts_code
     */
    public String getTsCode() {
        return tsCode;
    }

    /**
     * @param tsCode
     */
    public void setTsCode(String tsCode) {
        this.tsCode = tsCode;
    }

    /**
     * @return name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return area
     */
    public String getArea() {
        return area;
    }

    /**
     * @param area
     */
    public void setArea(String area) {
        this.area = area;
    }

    /**
     * @return industry
     */
    public String getIndustry() {
        return industry;
    }

    /**
     * @param industry
     */
    public void setIndustry(String industry) {
        this.industry = industry;
    }

    /**
     * @return list_date
     */
    public String getListDate() {
        return listDate;
    }

    /**
     * @param listDate
     */
    public void setListDate(String listDate) {
        this.listDate = listDate;
    }

    /**
     * @return start_date
     */
    public String getStartDate() {
        return startDate;
    }

    /**
     * @param startDate
     */
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    /**
     * @return end_date
     */
    public String getEndDate() {
        return endDate;
    }

    /**
     * @param endDate
     */
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}