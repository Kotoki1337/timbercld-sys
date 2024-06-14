package com.timbercld.ws.order.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * 订单详情类
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class OrderMainDTO {

    private Long id;
    private int quantity;
    private double amount;
    private Long productId;
    private Long buyerId;
    private Long sellerId;
    private String address;
    private String phoneNum;
    private String recvName;
    private Long creatorId;
    private Date createDate;
    private Date updateDate;
    private Long updaterId;
}
