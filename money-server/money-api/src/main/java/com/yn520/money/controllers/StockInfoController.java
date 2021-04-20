package com.yn520.money.controllers;

import com.yn520.money.enums.ResultEnum;
import com.yn520.money.exceptions.MoneyException;
import com.yn520.money.pojo.StockInfo;
import com.yn520.money.service.StockInfoService;
import com.yn520.money.utils.RedisUtils;
import com.yn520.money.utils.ResultUtil;
import com.yn520.money.vos.ResultVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/20 21:47
 * @Description:
 */
@Api(value = "获取上市公司信息", tags = {"获取上市公司详细信息"})
@RestController
@RequestMapping("/stock")
@Slf4j
public class StockInfoController {
    @Autowired
    private StockInfoService stockInfoService;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @ApiImplicitParam(value = "股票代号", name = "code", paramType = "query", example = "000001")
    @ApiOperation(value = "通过股票代号获取上市公司详细信息", httpMethod = "GET", notes = "例如：000001")
    @GetMapping("/getStockByCode")
    public ResultVO getStockInfoByCode(@RequestParam String code) {
        StockInfo info = stockInfoService.getStockInfoByCode(code);
        if (info == null) {
            throw new MoneyException(ResultEnum.STOCK_NO_EXIT, code);
        }
        return ResultUtil.success(info);
    }

    @ApiOperation(value = "通过股票名字获取上市公司详细信息", httpMethod = "GET", notes = "例如：平安银行")
    @ApiImplicitParam(value = "股票名字（平安银行、中国银行）", name = "name", paramType = "query")
    @GetMapping("/getStockByName")
    public ResultVO getStockInfoByName(@RequestParam String name) {
        StockInfo info = stockInfoService.getStockInfoByName(name);
        if (info == null) {
            throw new MoneyException(ResultEnum.STOCK_NO_EXIT, name);
        }
        return ResultUtil.success(info);
    }

    @ApiOperation(value = "获取所有上市公司详细信息", httpMethod = "GET", notes = "此接口废弃，太大用时太长")
    @GetMapping("/all")
    public ResultVO getAllStocks() {
        String key = "all_stocks";
        log.info("req all stocks.");
        List<StockInfo> list = null;//(List<StockInfo>) RedisUtils.getRedisRecord(this.stringRedisTemplate, key);
        if (list == null) {
            list = stockInfoService.getAllStocks();
        }
        log.info("req all stocks success.");
        if (list == null) {
            throw new MoneyException(ResultEnum.OPERATE_FAIL);
        } else {
//            RedisUtils.setResultInRedis(this.stringRedisTemplate, key, list);
        }

        return ResultUtil.success(list);
    }


}
