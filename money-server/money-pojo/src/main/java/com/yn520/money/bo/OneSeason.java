package com.yn520.money.bo;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/4/13 23:50
 * @Description:
 */
@Data
@ApiModel
public class OneSeason {
    private String stockCode;
    private int type;
    private int season;
}
