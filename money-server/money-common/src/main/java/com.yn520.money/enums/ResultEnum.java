package com.yn520.money.enums;

import lombok.Getter;

/**
 * @author TimHuang
 * @date 2018/12/11 9:17
 */
@SwaggerDisplayEnum()
@Getter
public enum ResultEnum {
    OK(0, "成功"),
    OPERATE_FAIL(-2, "操作失败"),
    PARAMS_ERROR(-1, "参数错误"),
    REPORT_NO_EXIT(10000, "报表不存在"),
    STOCK_NO_EXIT(20000, "股票不存在");
    private Integer code;
    private String msg;

    ResultEnum(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    @Override
    public String toString() {
        return String.valueOf(code) + ":" + msg;
    }
}
