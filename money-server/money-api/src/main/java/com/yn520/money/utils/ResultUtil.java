package com.yn520.money.utils;

import com.yn520.money.enums.ResultEnum;
import com.yn520.money.vos.ResultVO;

/**
 * @author TimHuang
 * @date 2018/12/6 23:20
 */
public class ResultUtil {
    public final static Integer SUCCESS_CODE = ResultEnum.OK.getCode();

    public static ResultVO success() {
        return new ResultVO(SUCCESS_CODE, "成功！");
    }

    public static ResultVO success(Integer code, String msg) {
        return new ResultVO(code, msg);
    }

    public static ResultVO success(String msg) {
        return success(msg, null);
    }

    public static ResultVO success(Integer code, String msg, Object data) {
        return new ResultVO(code, msg, data);
    }

    public static ResultVO success(String msg, Object data) {
        return success(SUCCESS_CODE, msg, data);
    }

    public static ResultVO success(Object data) {
        return success("成功！", data);
    }

    public static ResultVO success(ResultEnum resultEnum) {
        return success(resultEnum, null);
    }

    public static ResultVO success(ResultEnum resultEnum, Object data) {
        return success(resultEnum.getCode(), resultEnum.getMsg(), data);
    }

}
