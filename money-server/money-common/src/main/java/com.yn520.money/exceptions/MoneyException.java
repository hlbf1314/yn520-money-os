package com.yn520.money.exceptions;

import com.yn520.money.enums.ResultEnum;
import lombok.Getter;

/**
 * @author TimHuang
 * @date 2018/12/11 9:20
 */
@Getter
public class MoneyException extends RuntimeException {
    private Integer code;
    private Object data;

    /**
     * Constructs a new runtime exception with {@code null} as its
     * detail message.  The cause is not initialized, and may subsequently be
     * initialized by a call to {@link #initCause}.
     */
    public MoneyException(ResultEnum resultEnum) {
        super(resultEnum.getMsg());

        this.code = resultEnum.getCode();
    }

    public MoneyException(ResultEnum resultEnum, Object data) {
        super(resultEnum.getMsg());
        this.data = data;
        this.code = resultEnum.getCode();
    }


    public MoneyException(ResultEnum resultEnum, String message) {
        super(resultEnum.getMsg() + " ：" + message);
        this.code = resultEnum.getCode();
    }

    public MoneyException(ResultEnum resultEnum, String message, Object data) {
        super(resultEnum.getMsg() + " ：" + message);
        this.data = data;
        this.code = resultEnum.getCode();
    }

    public MoneyException(int code, String message) {
        super(message);
        this.code = code;
    }
}
