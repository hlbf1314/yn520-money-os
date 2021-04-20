create table `user_info`(
    `uid` integer (64) not null auto_increment ,
    `user_name` varchar (64) not null,
    `password` varchar (32) not null,
    `phone` varchar (32),
    `email` varchar (32) not null,
    `level` integer (8),
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    primary key (`uid`),
    key `idx_uid` (`uid`)
) comment '用户信息'