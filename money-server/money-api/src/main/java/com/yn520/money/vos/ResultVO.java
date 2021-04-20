package com.yn520.money.vos;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;

@ApiModel(value = "返回数据结构", description = "返回给客户端的数据结构")
@Data
public class ResultVO  implements Serializable
{
    private static final long serialVersionUID = -2111005146966367748L;

    @ApiModelProperty(value = "返回代码", notes = "com.yn520.money.enums.ResultEnum")
    private int code;
    @ApiModelProperty(value = "提示信息")
    private String message;
    @ApiModelProperty(value = "返回数据主体")
    private Object data;

    public ResultVO()
    {
    }

    public ResultVO(Integer code, String msg)
    {
        this.code = code;
        this.message = msg;
    }

    public ResultVO(Integer code, String msg, Object data)
    {
        this.code = code;
        this.message = msg;
        this.data = data;
    }
}
