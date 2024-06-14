create table authority_token
(
    id          bigint       not null comment 'id'
        primary key,
    user_id     bigint       not null comment '用户id',
    token       varchar(100) not null comment '用户token',
    expire_date datetime     null comment '过期时间',
    update_date datetime     null comment '更新时间',
    create_date datetime     null comment '创建时间',
    constraint uk_token
        unique (token),
    constraint uk_user_id
        unique (user_id)
)
    comment '系统用户Token' row_format = DYNAMIC;

create table demo_product
(
    creator_id   bigint                  null,
    updater_id   bigint                  null,
    create_date  datetime                null,
    update_date  datetime                null,
    pic          varchar(255)            null,
    price        decimal(10, 2)          not null,
    product_name varchar(255) default '' not null,
    id           bigint                  not null
        primary key,
    status       tinyint      default 0  not null,
    marks        text                    null
)
    row_format = DYNAMIC;

create table logger_error
(
    id             bigint       not null comment 'id'
        primary key,
    request_url    varchar(200) null comment '请求URI',
    request_method varchar(20)  null comment '请求方式',
    request_params text         null comment '请求参数',
    user_agent     varchar(500) null comment '用户代理',
    ip             varchar(32)  null comment '操作IP',
    error_info     text         null comment '异常信息',
    creator_id     bigint       null comment '创建者',
    create_date    datetime     null comment '创建时间'
)
    comment '异常日志' row_format = DYNAMIC;

create index idx_create_date
    on logger_error (create_date);

create table logger_login
(
    id           bigint           not null comment 'id'
        primary key,
    operation    tinyint unsigned null comment '用户操作   0：用户登录   1：用户退出',
    status       tinyint unsigned not null comment '状态  0：失败    1：成功    2：账号已锁定',
    user_agent   varchar(500)     null comment '用户代理',
    ip           varchar(32)      null comment '操作IP',
    creator_name varchar(50)      null comment '用户名',
    creator_id   bigint           null comment '创建者',
    create_date  datetime         null comment '创建时间'
)
    comment '登录日志' row_format = DYNAMIC;

create index idx_create_date
    on logger_login (create_date);

create index idx_status
    on logger_login (status);

create table logger_operation
(
    id             bigint           not null comment 'id'
        primary key,
    operation      varchar(50)      null comment '用户操作',
    request_url    varchar(200)     null comment '请求URI',
    request_method varchar(20)      null comment '请求方式',
    request_params text             null comment '请求参数',
    request_time   int unsigned     not null comment '请求时长(毫秒)',
    user_agent     varchar(500)     null comment '用户代理',
    ip             varchar(32)      null comment '操作IP',
    status         tinyint unsigned not null comment '状态  0：失败   1：成功',
    creator_name   varchar(50)      null comment '用户名',
    creator_id     bigint           null comment '创建者',
    create_date    datetime         null comment '创建时间'
)
    comment '操作日志' row_format = DYNAMIC;

create index idx_create_date
    on logger_operation (create_date);

create table order_main
(
    id          bigint       default 0  not null
        primary key,
    quantity    int          default 0  null comment '商品数量',
    amount      double       default 0  null comment '商品金额',
    product_id  bigint       default 0  null,
    buyer_id    bigint       default 0  null comment '买家 ID',
    seller_id   bigint       default 0  null comment '卖家 ID',
    address     varchar(128) default '' null,
    phone_num   varchar(32)  default '' null,
    recv_name   varchar(16)  default '' null,
    update_date datetime                null,
    updater_id  bigint                  null,
    create_date datetime                null,
    creator_id  bigint                  null
)
    comment '订单详情表';

create table qrtz_calendars
(
    SCHED_NAME    varchar(120) not null,
    CALENDAR_NAME varchar(200) not null,
    CALENDAR      blob         not null,
    primary key (SCHED_NAME, CALENDAR_NAME)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table qrtz_fired_triggers
(
    SCHED_NAME        varchar(120) not null,
    ENTRY_ID          varchar(95)  not null,
    TRIGGER_NAME      varchar(200) not null,
    TRIGGER_GROUP     varchar(200) not null,
    INSTANCE_NAME     varchar(200) not null,
    FIRED_TIME        bigint       not null,
    SCHED_TIME        bigint       not null,
    PRIORITY          int          not null,
    STATE             varchar(16)  not null,
    JOB_NAME          varchar(200) null,
    JOB_GROUP         varchar(200) null,
    IS_NONCONCURRENT  varchar(1)   null,
    REQUESTS_RECOVERY varchar(1)   null,
    primary key (SCHED_NAME, ENTRY_ID)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create index IDX_QRTZ_FT_INST_JOB_REQ_RCVRY
    on qrtz_fired_triggers (SCHED_NAME, INSTANCE_NAME, REQUESTS_RECOVERY);

create index IDX_QRTZ_FT_JG
    on qrtz_fired_triggers (SCHED_NAME, JOB_GROUP);

create index IDX_QRTZ_FT_J_G
    on qrtz_fired_triggers (SCHED_NAME, JOB_NAME, JOB_GROUP);

create index IDX_QRTZ_FT_TG
    on qrtz_fired_triggers (SCHED_NAME, TRIGGER_GROUP);

create index IDX_QRTZ_FT_TRIG_INST_NAME
    on qrtz_fired_triggers (SCHED_NAME, INSTANCE_NAME);

create index IDX_QRTZ_FT_T_G
    on qrtz_fired_triggers (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP);

create table qrtz_job_details
(
    SCHED_NAME        varchar(120) not null,
    JOB_NAME          varchar(200) not null,
    JOB_GROUP         varchar(200) not null,
    DESCRIPTION       varchar(250) null,
    JOB_CLASS_NAME    varchar(250) not null,
    IS_DURABLE        varchar(1)   not null,
    IS_NONCONCURRENT  varchar(1)   not null,
    IS_UPDATE_DATA    varchar(1)   not null,
    REQUESTS_RECOVERY varchar(1)   not null,
    JOB_DATA          blob         null,
    primary key (SCHED_NAME, JOB_NAME, JOB_GROUP)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create index IDX_QRTZ_J_GRP
    on qrtz_job_details (SCHED_NAME, JOB_GROUP);

create index IDX_QRTZ_J_REQ_RECOVERY
    on qrtz_job_details (SCHED_NAME, REQUESTS_RECOVERY);

create table qrtz_locks
(
    SCHED_NAME varchar(120) not null,
    LOCK_NAME  varchar(40)  not null,
    primary key (SCHED_NAME, LOCK_NAME)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table qrtz_paused_trigger_grps
(
    SCHED_NAME    varchar(120) not null,
    TRIGGER_GROUP varchar(200) not null,
    primary key (SCHED_NAME, TRIGGER_GROUP)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table qrtz_scheduler_state
(
    SCHED_NAME        varchar(120) not null,
    INSTANCE_NAME     varchar(200) not null,
    LAST_CHECKIN_TIME bigint       not null,
    CHECKIN_INTERVAL  bigint       not null,
    primary key (SCHED_NAME, INSTANCE_NAME)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table qrtz_triggers
(
    SCHED_NAME     varchar(120) not null,
    TRIGGER_NAME   varchar(200) not null,
    TRIGGER_GROUP  varchar(200) not null,
    JOB_NAME       varchar(200) not null,
    JOB_GROUP      varchar(200) not null,
    DESCRIPTION    varchar(250) null,
    NEXT_FIRE_TIME bigint       null,
    PREV_FIRE_TIME bigint       null,
    PRIORITY       int          null,
    TRIGGER_STATE  varchar(16)  not null,
    TRIGGER_TYPE   varchar(8)   not null,
    START_TIME     bigint       not null,
    END_TIME       bigint       null,
    CALENDAR_NAME  varchar(200) null,
    MISFIRE_INSTR  smallint     null,
    JOB_DATA       blob         null,
    primary key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP),
    constraint QRTZ_TRIGGERS_ibfk_1
        foreign key (SCHED_NAME, JOB_NAME, JOB_GROUP) references qrtz_job_details (SCHED_NAME, JOB_NAME, JOB_GROUP)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table qrtz_blob_triggers
(
    SCHED_NAME    varchar(120) not null,
    TRIGGER_NAME  varchar(200) not null,
    TRIGGER_GROUP varchar(200) not null,
    BLOB_DATA     blob         null,
    primary key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP),
    constraint QRTZ_BLOB_TRIGGERS_ibfk_1
        foreign key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP) references qrtz_triggers (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create index SCHED_NAME
    on qrtz_blob_triggers (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP);

create table qrtz_cron_triggers
(
    SCHED_NAME      varchar(120) not null,
    TRIGGER_NAME    varchar(200) not null,
    TRIGGER_GROUP   varchar(200) not null,
    CRON_EXPRESSION varchar(120) not null,
    TIME_ZONE_ID    varchar(80)  null,
    primary key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP),
    constraint QRTZ_CRON_TRIGGERS_ibfk_1
        foreign key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP) references qrtz_triggers (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table qrtz_simple_triggers
(
    SCHED_NAME      varchar(120) not null,
    TRIGGER_NAME    varchar(200) not null,
    TRIGGER_GROUP   varchar(200) not null,
    REPEAT_COUNT    bigint       not null,
    REPEAT_INTERVAL bigint       not null,
    TIMES_TRIGGERED bigint       not null,
    primary key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP),
    constraint QRTZ_SIMPLE_TRIGGERS_ibfk_1
        foreign key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP) references qrtz_triggers (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table qrtz_simprop_triggers
(
    SCHED_NAME    varchar(120)   not null,
    TRIGGER_NAME  varchar(200)   not null,
    TRIGGER_GROUP varchar(200)   not null,
    STR_PROP_1    varchar(512)   null,
    STR_PROP_2    varchar(512)   null,
    STR_PROP_3    varchar(512)   null,
    INT_PROP_1    int            null,
    INT_PROP_2    int            null,
    LONG_PROP_1   bigint         null,
    LONG_PROP_2   bigint         null,
    DEC_PROP_1    decimal(13, 4) null,
    DEC_PROP_2    decimal(13, 4) null,
    BOOL_PROP_1   varchar(1)     null,
    BOOL_PROP_2   varchar(1)     null,
    primary key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP),
    constraint QRTZ_SIMPROP_TRIGGERS_ibfk_1
        foreign key (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP) references qrtz_triggers (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create index IDX_QRTZ_T_C
    on qrtz_triggers (SCHED_NAME, CALENDAR_NAME);

create index IDX_QRTZ_T_G
    on qrtz_triggers (SCHED_NAME, TRIGGER_GROUP);

create index IDX_QRTZ_T_J
    on qrtz_triggers (SCHED_NAME, JOB_NAME, JOB_GROUP);

create index IDX_QRTZ_T_JG
    on qrtz_triggers (SCHED_NAME, JOB_GROUP);

create index IDX_QRTZ_T_NEXT_FIRE_TIME
    on qrtz_triggers (SCHED_NAME, NEXT_FIRE_TIME);

create index IDX_QRTZ_T_NFT_MISFIRE
    on qrtz_triggers (SCHED_NAME, MISFIRE_INSTR, NEXT_FIRE_TIME);

create index IDX_QRTZ_T_NFT_ST
    on qrtz_triggers (SCHED_NAME, TRIGGER_STATE, NEXT_FIRE_TIME);

create index IDX_QRTZ_T_NFT_ST_MISFIRE
    on qrtz_triggers (SCHED_NAME, MISFIRE_INSTR, NEXT_FIRE_TIME, TRIGGER_STATE);

create index IDX_QRTZ_T_NFT_ST_MISFIRE_GRP
    on qrtz_triggers (SCHED_NAME, MISFIRE_INSTR, NEXT_FIRE_TIME, TRIGGER_GROUP, TRIGGER_STATE);

create index IDX_QRTZ_T_N_G_STATE
    on qrtz_triggers (SCHED_NAME, TRIGGER_GROUP, TRIGGER_STATE);

create index IDX_QRTZ_T_N_STATE
    on qrtz_triggers (SCHED_NAME, TRIGGER_NAME, TRIGGER_GROUP, TRIGGER_STATE);

create index IDX_QRTZ_T_STATE
    on qrtz_triggers (SCHED_NAME, TRIGGER_STATE);

create table scheduler
(
    id              bigint           not null comment 'id'
        primary key,
    bean_name       varchar(200)     null comment 'spring bean名称',
    params          varchar(2000)    null comment '参数',
    cron_expression varchar(100)     null comment 'cron表达式',
    status          tinyint unsigned null comment '任务状态  0：暂停  1：正常',
    comment         varchar(255)     null comment '备注',
    creator_id      bigint           null comment '创建者',
    create_date     datetime         null comment '创建时间',
    updater_id      bigint           null comment '更新者',
    update_date     datetime         null comment '更新时间'
)
    comment '定时任务' row_format = DYNAMIC;

create index idx_create_date
    on scheduler (create_date);

create table scheduler_log
(
    id           bigint           not null comment 'id'
        primary key,
    scheduler_id bigint           not null comment '任务id',
    bean_name    varchar(200)     null comment 'spring bean名称',
    params       varchar(2000)    null comment '参数',
    status       tinyint unsigned not null comment '任务状态    0：失败    1：成功',
    error        varchar(2000)    null comment '失败信息',
    times        int              not null comment '耗时(单位：毫秒)',
    create_date  datetime         null comment '创建时间'
)
    comment '定时任务日志' row_format = DYNAMIC;

create index idx_create_date
    on scheduler_log (create_date);

create index idx_job_id
    on scheduler_log (scheduler_id);

create table sub_system
(
    id              bigint           not null comment 'id'
        primary key,
    sub_system_id   bigint           null comment '租户编码',
    sub_system_name varchar(50)      null comment '租户名称',
    status          tinyint unsigned null comment '状态  0：停用    1：正常',
    comment         varchar(200)     null comment '备注',
    user_id         bigint unsigned  null comment '登录账号ID',
    username        varchar(50)      null comment '登录账号',
    del_flag        tinyint unsigned null comment '删除标识 0：未删除    1：删除',
    sub_system      tinyint unsigned null comment '系统租户   0：否   1：是',
    creator_id      bigint           null comment '创建者',
    create_date     datetime         null comment '创建时间',
    updater_id      bigint           null comment '更新者',
    update_date     datetime         null comment '更新时间',
    constraint uk_tenant_code
        unique (sub_system_id)
)
    comment '租户管理' charset = utf8mb3
                       row_format = DYNAMIC;

create index idx_create_date
    on sub_system (create_date);

create table system_dept
(
    id            bigint       not null comment 'id'
        primary key,
    pid           bigint       null comment '上级ID',
    pids          varchar(500) null comment '所有上级ID，用逗号分开',
    name          varchar(50)  null comment '部门名称',
    `order`       int unsigned null comment '排序',
    sub_system_id bigint       null comment '租户编码',
    creator_id    bigint       null comment '创建者',
    create_date   datetime     null comment '创建时间',
    updater_id    bigint       null comment '更新者',
    update_date   datetime     null comment '更新时间'
)
    comment '部门管理' row_format = DYNAMIC;

create index idx_pid
    on system_dept (pid);

create index idx_sort
    on system_dept (`order`);

create table system_language
(
    table_name  varchar(32)  not null comment '表名',
    table_id    bigint       not null comment '表主键',
    field_name  varchar(32)  not null comment '字段名',
    field_value varchar(200) not null comment '字段值',
    language    varchar(10)  not null comment '语言',
    primary key (table_name, table_id, field_name, language)
)
    comment '国际化' row_format = DYNAMIC;

create index idx_table_id
    on system_language (table_id);

create table system_menu
(
    id          bigint           not null comment 'id'
        primary key,
    pid         bigint           null comment '上级ID，一级菜单为0',
    url         varchar(200)     null comment '菜单URL',
    permissions varchar(500)     null comment '授权(多个用逗号分隔，如：sys:user:list,sys:user:save)',
    type        tinyint unsigned null comment '类型   0：菜单   1：按钮',
    icon        varchar(50)      null comment '菜单图标',
    `order`     int              null comment '排序',
    creator_id  bigint           null comment '创建者',
    create_date datetime         null comment '创建时间',
    updater_id  bigint           null comment '更新者',
    update_date datetime         null comment '更新时间'
)
    comment '菜单管理' row_format = DYNAMIC;

create index idx_pid
    on system_menu (pid);

create index idx_sort
    on system_menu (`order`);

create table system_params
(
    id          bigint                     not null comment 'id'
        primary key,
    param_code  varchar(32)                null comment '参数编码',
    param_value varchar(2000)              null comment '参数值',
    param_type  tinyint unsigned default 1 null comment '类型   0：系统参数   1：非系统参数',
    comment     varchar(200)               null comment '备注',
    creator_id  bigint                     null comment '创建者',
    create_date datetime                   null comment '创建时间',
    updater_id  bigint                     null comment '更新者',
    update_date datetime                   null comment '更新时间',
    constraint uk_param_code
        unique (param_code)
)
    comment '参数管理' row_format = DYNAMIC;

create index idx_create_date
    on system_params (create_date);

create table system_region
(
    id          bigint       not null comment 'id'
        primary key,
    pid         bigint       null comment '上级ID，一级为0',
    name        varchar(100) null comment '名称',
    tree_level  tinyint      null comment '层级',
    leaf        tinyint      null comment '是否叶子节点  0：否   1：是',
    `order`     bigint       null comment '排序',
    creator_id  bigint       null comment '创建者',
    create_date datetime     null comment '创建时间',
    updater_id  bigint       null comment '更新者',
    update_date datetime     null comment '更新时间'
)
    comment '行政区域' row_format = DYNAMIC;

create table system_role
(
    id            bigint       not null comment 'id'
        primary key,
    name          varchar(50)  null comment '角色名称',
    comment       varchar(100) null comment '备注',
    dept_id       bigint       null comment '部门ID',
    sub_system_id bigint       null comment '租户编码',
    creator_id    bigint       null comment '创建者',
    create_date   datetime     null comment '创建时间',
    updater_id    bigint       null comment '更新者',
    update_date   datetime     null comment '更新时间'
)
    comment '角色管理' row_format = DYNAMIC;

create index idx_dept_id
    on system_role (dept_id);

create table system_role_data_scope
(
    update_date datetime null,
    updater_id  bigint   not null,
    id          bigint   not null comment 'id',
    role_id     bigint   null comment '角色ID',
    dept_id     bigint   null comment '部门ID',
    creator_id  bigint   null comment '创建者',
    create_date datetime null comment '创建时间',
    primary key (id, updater_id)
)
    comment '角色数据权限' row_format = DYNAMIC;

create index idx_role_id
    on system_role_data_scope (role_id);

create table system_role_menu
(
    update_date datetime null,
    updater_id  bigint   null,
    id          bigint   not null comment 'id'
        primary key,
    role_id     bigint   null comment '角色ID',
    menu_id     bigint   null comment '菜单ID',
    creator_id  bigint   null comment '创建者',
    create_date datetime null comment '创建时间'
)
    comment '角色菜单关系' row_format = DYNAMIC;

create index idx_menu_id
    on system_role_menu (menu_id);

create index idx_role_id
    on system_role_menu (role_id);

create table system_role_user
(
    updater_id  bigint   not null,
    update_date datetime null,
    id          bigint   not null comment 'id',
    role_id     bigint   null comment '角色ID',
    user_id     bigint   null comment '用户ID',
    creator_id  bigint   null comment '创建者',
    create_date datetime null comment '创建时间',
    primary key (id, updater_id)
)
    comment '角色用户关系' row_format = DYNAMIC;

create index idx_role_id
    on system_role_user (role_id);

create index idx_user_id
    on system_role_user (user_id);

create table system_user
(
    type             tinyint default 0    not null comment '0 后端 1前端',
    id               varchar(20)          not null comment 'id'
        primary key,
    username         varchar(50)          not null comment '用户名',
    password         varchar(100)         null comment '密码',
    real_name        varchar(50)          null comment '姓名',
    head_url         varchar(200)         null comment '头像',
    gender           tinyint unsigned     null comment '性别   0：男   1：女    2：保密',
    email            varchar(100)         null comment '邮箱',
    mobile           varchar(100)         null comment '手机号',
    dept_id          bigint               null comment '部门ID',
    super_admin      tinyint unsigned     null comment '超级管理员   0：否   1：是',
    super_sub_system tinyint unsigned     null comment '租户管理员   0：否   1：是',
    status           tinyint              null comment '状态  0：停用   1：正常',
    sub_system_id    bigint  default 1001 null comment '租户编码',
    creator_id       bigint               null comment '创建者',
    create_date      datetime             null comment '创建时间',
    updater_id       bigint               null comment '更新者',
    update_date      datetime             null comment '更新时间',
    constraint uk_username
        unique (username)
)
    comment '系统用户' row_format = DYNAMIC;

create index idx_create_date
    on system_user (create_date);


