package com.yn520.money.utils;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/11 22:08
 * @Description:
 */
public class RedisUtils {

    public static boolean setResultInRedis(StringRedisTemplate redisTemplate, String key, Object result) {
        try {
            String jsonObject = new Gson().toJson(result);
            redisTemplate.opsForValue().set(key, jsonObject);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static <T> T getRedisRecord(StringRedisTemplate redisTemplate, String key, Class<T> classOfT) {
        String jsonStr = redisTemplate.opsForValue().get(key);
        T info = null;
        try {
            info = new Gson().fromJson(jsonStr, classOfT);
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
        }
        return info;
    }

    public static Object getRedisRecord(StringRedisTemplate redisTemplate, String key) {
        return getRedisRecord(redisTemplate, key, Object.class);
    }
}
