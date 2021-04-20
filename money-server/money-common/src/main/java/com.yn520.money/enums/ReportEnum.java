package com.yn520.money.enums;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/13 23:04
 * @Description:
 */
public enum ReportEnum {
    TYPE_INCOME(100, "income"),
    TYPE_BALANCE(110, "balance"),
    TYPE_CASH(120, "cash"),
    SEASON_SPRING(1, "03-31"),
    SEASON_SUMMER(2, "06-30"),
    SEASON_AUTUMN(3, "09-30"),
    SEASON_WINTER(4, "12-31"),
    SEASON_YEAR(5, "4"),
    SEASON_TWO_YEAR(6, "8"),
    SEASON_MULTIPLE(0, "0");

    public final int type;
    public final String value;

    ReportEnum(int type1, String value1) {
        this.type = type1;
        this.value = value1;
    }

    public static String getValueByCode(int code) {
        for (ReportEnum pe : ReportEnum.values()) {
            if (code == pe.type) return pe.value;
        }
        return "";
    }

}
