package com.yn520.money.controllers;

import com.mysql.jdbc.StringUtils;
import com.yn520.money.enums.ReportEnum;
import com.yn520.money.enums.ResultEnum;
import com.yn520.money.exceptions.MoneyException;
import com.yn520.money.service.ReportService;
import com.yn520.money.utils.RedisUtils;
import com.yn520.money.utils.ResultUtil;
import com.yn520.money.vo.ReportVO;
import com.yn520.money.vos.ResultVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/13 21:41
 * @Description:
 */
@Api(value = "报表接口", tags = {"获取报表接口"})
@RestController
@RequestMapping("report")
public class ReportController {
    @Autowired
    private ReportService reportService;


    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @ApiOperation(value = "获取上市公司单季报表", httpMethod = "GET", notes = "获取上市公司单季报表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "stockCode", value = "股票代号", paramType = "query"),
            @ApiImplicitParam(name = "type", value = "财报类型：100-利润表；110-负债表；120-现金流量表", paramType = "query"),
            @ApiImplicitParam(name = "year", value = "年份", paramType = "query"),
            @ApiImplicitParam(name = "season", value = "一个季度：1-Q1、2-Q2、3-Q3、4-Q4", paramType = "query")
    })
    @GetMapping("/season")
    public ResultVO getOneSeason(@RequestParam String stockCode, @RequestParam int type, @RequestParam int year, @RequestParam int season) {
        Object result = getOneSeaonStock(stockCode, type, year, season);
        if (result == null) {
            throw new MoneyException(ResultEnum.REPORT_NO_EXIT, new ReportVO(stockCode, type, year, season));
        }
        return ResultUtil.success(new ReportVO(stockCode, type, year, season, result));
    }

    @ApiOperation(value = "获取参与对比的多家上市公司的单季度报表", httpMethod = "GET", notes = "获取参与对比的多家上市公司的单季度报表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "stockCodeList", value = "参与对比的股票代号列表，数量大于等于1", paramType = "query"),
            @ApiImplicitParam(name = "type", value = "财报类型：100-利润表；110-负债表；120-现金流量表", paramType = "query"),
            @ApiImplicitParam(name = "year", value = "年份", paramType = "query"),
            @ApiImplicitParam(name = "season", value = "一个季度：1-Q1、2-Q2、3-Q3、4-Q4", paramType = "query")
    })
    @GetMapping("/pkSeason")
    public ResultVO getPKOneSeason(@RequestParam List<String> stockCodeList, @RequestParam int type, @RequestParam int year, @RequestParam int season) {
        List<ReportVO> result = new ArrayList<>();
        String stockCodeListStr = "";
        for (Iterator<String> it = stockCodeList.iterator(); it.hasNext(); ) {
            String stockCode = it.next();
            stockCodeListStr += stockCode + ",";
            if (StringUtils.isNullOrEmpty(stockCode)) {
                throw new MoneyException(ResultEnum.PARAMS_ERROR, new ReportVO(stockCode, type, year, season));
            }
            Object stockInfo = getOneSeaonStock(stockCode, type, year, season);
            if (stockInfo == null) {
                throw new MoneyException(ResultEnum.REPORT_NO_EXIT, new ReportVO(stockCode, type, year, season));
            }
            result.add(new ReportVO(stockCode, type, year, season, stockInfo));
        }
        return ResultUtil.success(new ReportVO(stockCodeListStr, type, year, season, result));
    }

    private Object getOneSeaonStock(String stockCode, int type, int year, int season) {
        String tableName = getTableName(stockCode, type);
        String key = redisKey(tableName, type, year, season);
        Object result = getResultFromRedis(key);
        if (result == null) {
            result = onSeasonFromDB(tableName, type, year, season);
            RedisUtils.setResultInRedis(this.stringRedisTemplate, key, result);
        }
        return result;
    }

    @ApiOperation(value = "获取一家上市公司的多个季度报表", httpMethod = "GET", notes = "获取一家上市公司的多个季度报表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "stockCode", value = "股票代号", paramType = "query"),
            @ApiImplicitParam(name = "type", value = "财报类型：100-利润表；110-负债表；120-现金流量表", paramType = "query"),
            @ApiImplicitParam(name = "count", value = "最近多少个季度，比喻4，代表最近4个季度", paramType = "query")
    })
    @GetMapping("/seasons")
    public ResultVO getSeasons(@RequestParam String stockCode, @RequestParam int type, @RequestParam int count) {
        List<Object> result = getSeasonList(stockCode, type, count);
        if (result == null) {
            throw new MoneyException(ResultEnum.REPORT_NO_EXIT, new ReportVO(stockCode, type, count));
        }
        return ResultUtil.success(new ReportVO(stockCode, type, count, result));
    }

    @ApiOperation(value = "获取参与对比的多家上市公司的多季度报表", httpMethod = "GET", notes = "获取参与对比的多家上市公司的多季度报表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "stockCodeList", value = "参与对比的股票代号列表，数量大于等于1", paramType = "query"),
            @ApiImplicitParam(name = "type", value = "财报类型：100-利润表；110-负债表；120-现金流量表", paramType = "query"),
            @ApiImplicitParam(name = "count", value = "最近多少个季度，比喻4，代表最近4个季度", paramType = "query")
    })
    @GetMapping("/pkSeasons")
    public ResultVO getPKSeasons(@RequestParam List<String> stockCodeList, @RequestParam int type, @RequestParam int count) {
        List<ReportVO> result = new ArrayList<>();
        String stockCodeListStr = "";
        for (Iterator<String> it = stockCodeList.iterator(); it.hasNext(); ) {
            String stockCode = it.next();
            stockCodeListStr += stockCode + ",";
            if (StringUtils.isNullOrEmpty(stockCode)) {
                throw new MoneyException(ResultEnum.PARAMS_ERROR, new ReportVO(stockCode, type, count));
            }
            List<Object> stockInfo = getSeasonList(stockCode, type, count);
            if (stockInfo == null) {
                throw new MoneyException(ResultEnum.REPORT_NO_EXIT, new ReportVO(stockCode, type, count));
            }
            result.add(new ReportVO(stockCode, type, count, stockInfo));
        }
        return ResultUtil.success(new ReportVO(stockCodeListStr, type, count, result));
    }

    private List<Object> getSeasonList(String stockCode, int type, int count) {
        String tableName = getTableName(stockCode, type);
        Object result = null;
        String key;
        if (count == 0) {
            key = redisKey(tableName, type);
            result = getResultFromRedis(key);
            if (result == null) {
                result = seasonAllFromDB(tableName, type);
                RedisUtils.setResultInRedis(this.stringRedisTemplate, key, result);
            }
        } else {
            key = redisKey(tableName, type, count);
            result = getResultFromRedis(key);
            if (result == null) {
                result = seasonsFromDB(tableName, type, count);
                RedisUtils.setResultInRedis(this.stringRedisTemplate, key, result);
            }
        }
        return (List<Object>) result;
    }

    private Object getResultFromRedis(String key) {
        Object result = RedisUtils.getRedisRecord(stringRedisTemplate, key);
//        String redisResultStr = stringRedisTemplate.opsForValue().get(key);
//        if (redisResultStr != null && !redisResultStr.isEmpty()) {
//            try {
//                result = new Gson().fromJson(redisResultStr, Object.class);
//            } catch (JsonSyntaxException e) {
//                e.printStackTrace();
//            }
//        }
        return result;
    }

    private String redisKey(Object... args) {
        String key = "";
        for (Object value : args) {
            if (!key.isEmpty()) key += '_';
            key += value.toString();
        }
        return key;
    }

    private String getTableName(String stockCode, int type) {
        return ReportEnum.getValueByCode(type) + "_" + stockCode;
    }

    private Object onSeasonFromDB(String tableName, int type, int year, int season) {
        Object result = null;
        String rDate = year + "-" + ReportEnum.getValueByCode(season);
        if (type == ReportEnum.TYPE_INCOME.type) {
            result = reportService.oneSeasonIncome(tableName, rDate);
        } else if (type == ReportEnum.TYPE_BALANCE.type) {
            result = reportService.oneSeasonBalance(tableName, rDate);
        } else if (type == ReportEnum.TYPE_CASH.type) {
            result = reportService.oneSeasonCash(tableName, rDate);
        }
        return result;
    }

    private Object seasonsFromDB(String tableName, int type, int count) {
        Object result = null;
        if (type == ReportEnum.TYPE_INCOME.type) {
            result = reportService.seasonsIncome(tableName, count);
        } else if (type == ReportEnum.TYPE_BALANCE.type) {
            result = reportService.seasonsBalance(tableName, count);
        } else if (type == ReportEnum.TYPE_CASH.type) {
            result = reportService.seasonsCash(tableName, count);
        }
        return result;
    }

    private Object seasonAllFromDB(String tableName, int type) {
        Object result = null;
        if (type == ReportEnum.TYPE_INCOME.type) {
            result = reportService.seasonAllIncome(tableName);
        } else if (type == ReportEnum.TYPE_BALANCE.type) {
            result = reportService.seasonAllBalance(tableName);
        } else if (type == ReportEnum.TYPE_CASH.type) {
            result = reportService.seasonAllCash(tableName);
        }
        return result;
    }
}
