package com.timbercld.ws.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.timbercld.core.constant.Constant;
import com.timbercld.core.page.PageData;
import com.timbercld.core.service.impl.BasicServiceImpl;
import com.timbercld.core.utils.ConvertUtils;
import com.timbercld.ws.order.dao.OrderMainDAO;
import com.timbercld.ws.order.dto.OrderMainDTO;
import com.timbercld.ws.order.entity.OrderMainEntity;
import com.timbercld.ws.order.service.OrderMainService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class OrderMainServiceImpl extends BasicServiceImpl<OrderMainDAO, OrderMainEntity> implements OrderMainService {

//    @Autowired
//    private ProductDAO productDAO;

    @Override
    public void save(OrderMainDTO orderMainDTO) {
        this.basicDao.insert(ConvertUtils.sourceToTarget(orderMainDTO, OrderMainEntity.class));
    }

    @Override
    public OrderMainDTO get(Long id) {
        return ConvertUtils.sourceToTarget(basicDao.selectById(id), OrderMainDTO.class);
    }

    @Override
    public PageData<OrderMainDTO> page(Map<String, Object> params) {
        IPage<OrderMainEntity> page = basicDao.selectPage(
                getPage(params, Constant.UPDATE_DATE, false),
                getWrapper(params)
        );
        return getPageData(page, OrderMainDTO.class);
    }

    private QueryWrapper<OrderMainEntity> getWrapper(Map<String, Object> params){
        QueryWrapper<OrderMainEntity> wrapper = new QueryWrapper<>();
        String address = (String) params.get("address");
        wrapper.like(StringUtils.isNoneBlank(address),"address",address);
        return wrapper;
    }
}
