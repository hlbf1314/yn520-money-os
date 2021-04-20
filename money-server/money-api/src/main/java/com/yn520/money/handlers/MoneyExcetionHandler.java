package com.yn520.money.handlers;

import com.yn520.money.enums.ResultEnum;
import com.yn520.money.exceptions.MoneyException;
import com.yn520.money.utils.ResultUtil;
import com.yn520.money.vos.ResultVO;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @author TimHuang
 * @date 2018/12/26 9:11
 */
@RestControllerAdvice
public class MoneyExcetionHandler extends RuntimeException {

    @ExceptionHandler(value = MoneyException.class)
    @ResponseBody
    public ResultVO handler(MoneyException e) {
        Object data = e.getData();
        if (data == null) {
            return ResultUtil.success(e.getCode(), e.getMessage());
        } else {
            return ResultUtil.success(e.getCode(), e.getMessage(), data);
        }
    }

    @ExceptionHandler(value = MissingServletRequestParameterException.class)
    @ResponseBody
    public ResultVO handler(MissingServletRequestParameterException e) {
        String paramName = e.getParameterName();
        String paramType = e.getParameterType();
        String errMsg = ResultEnum.PARAMS_ERROR.getMsg() + ":参数名={" + paramName + "}";
        return ResultUtil.success(ResultEnum.PARAMS_ERROR.getCode(), errMsg);
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public ResultVO handler(Exception e) {
//        String errMsg = ResultEnum.PARAMS_ERROR.getMsg();
        return ResultUtil.success(ResultEnum.PARAMS_ERROR.getCode(), e.getMessage());
    }


}
