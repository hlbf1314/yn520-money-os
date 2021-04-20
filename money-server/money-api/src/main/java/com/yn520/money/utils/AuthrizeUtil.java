package com.yn520.money.utils;

import com.yn520.money.constant.ConnectConst;
import com.yn520.money.constant.CookieConstant;
import com.yn520.money.constant.TokenConstant;
import com.yn520.money.exceptions.UserAuthorizeExceptioin;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * @author TimHuang
 * @date 2019/3/19 9:52
 */
@Slf4j
public class AuthrizeUtil {
    public static void verfity(StringRedisTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String cookieName = CookieUtil.get(request, CookieConstant.TOKEN);
        if (StringUtils.isEmpty(cookieName)) {
            log.warn("没有cookie , 登陆过期：", request.getRemoteHost());
            throw new UserAuthorizeExceptioin();
        }

        String uuid = getUidByCookieName(template, cookieName);
        if (StringUtils.isEmpty(uuid)) {
            log.warn("redis没有记录 , 登陆过期：", request.getRemoteHost());
            throw new UserAuthorizeExceptioin();
        }
    }

    public static boolean isMyUid(StringRedisTemplate template, HttpServletRequest request, String uid) {
        String myUid = getMyUid(template, request);
        return myUid.equals(uid);
    }

    public static String getMyUid(StringRedisTemplate template, HttpServletRequest request) {
        String cookieName = CookieUtil.get(request, CookieConstant.TOKEN);
        return getUidByCookieName(template, cookieName);
    }

    public static boolean verfityCookieName(StringRedisTemplate template, String cookieName) {
        if (StringUtils.isEmpty(cookieName)) {
            log.warn("verfityCookieName : 没有cookie , 登陆过期：");
            return false;
        }

        String uuid = getUidByCookieName(template, cookieName);
        if (StringUtils.isEmpty(uuid)) {
            log.warn("verfityCookieName : redis没有记录 , 登陆过期：");
            return false;
        }
        return true;
    }

    public static String getUidByCookieName(StringRedisTemplate template, String cookieName) {
        String key = String.format(TokenConstant.TOKEN_PREFIX, cookieName);
        String uuid = template.opsForValue().get(key);
        return uuid;
    }

    public static String getConnectId(StringRedisTemplate template, String connectId) {
        if (StringUtils.isEmpty(connectId)) return "";
        String key = String.format(ConnectConst.CONNECT_PREFIX, connectId);
        String uuid = template.opsForValue().get(key);
        return uuid;
    }

}
