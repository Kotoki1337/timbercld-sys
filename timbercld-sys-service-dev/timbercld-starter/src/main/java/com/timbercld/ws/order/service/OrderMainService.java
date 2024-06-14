package com.timbercld.ws.order.service;

import com.timbercld.core.page.PageData;
import com.timbercld.core.service.BasicService;
import com.timbercld.ws.order.dto.OrderMainDTO;
import com.timbercld.ws.order.entity.OrderMainEntity;

import java.util.Map;

public interface OrderMainService extends BasicService<OrderMainEntity> {

    void save(OrderMainDTO orderMainDTO);

    OrderMainDTO get(Long id);

    PageData<OrderMainDTO> page(Map<String, Object> params);
}
