package com.timbercld.ws.order.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.timbercld.core.entity.BasicEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 订单详情类
 * */

@Data
@EqualsAndHashCode(callSuper=false)
@TableName("order_main")
public class OrderMainEntity extends BasicEntity {

//    @TableId
    private int quantity;
    private double amount;
    private Long productId;
    private Long buyerId;
    private Long sellerId;
    private String address;
    private String phoneNum;
    private String recvName;
}
