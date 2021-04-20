package com.yn520.money.utils;

import org.springframework.util.StringUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author TimHuang
 * @date 2019/3/19 9:19
 */
public class CookieUtil
{
	public static void set(HttpServletResponse response, String name, String uuid, Integer maxAge)
	{
		Cookie cookie = new Cookie(name, uuid);
		cookie.setMaxAge(maxAge);
		cookie.setPath("/");
		response.addCookie(cookie);
	}

	public static String get(HttpServletRequest request, String name)
	{
		Cookie[] cookies = request.getCookies();
		if (cookies == null) return null;
		for (Cookie cookie : cookies)
		{
			if (name.equals(cookie.getName()) && StringUtils.isEmpty(cookie.getValue()) == false)
			{
				return cookie.getValue();
			}
		}
		return null;
	}

}
