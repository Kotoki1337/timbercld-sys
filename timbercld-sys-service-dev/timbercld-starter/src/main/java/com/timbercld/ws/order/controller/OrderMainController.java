package com.timbercld.ws.order.controller;

import com.timbercld.core.page.PageData;
import com.timbercld.core.utils.ConvertUtils;
import com.timbercld.core.utils.Result;
import com.timbercld.core.validator.AssertUtils;
import com.timbercld.ws.demo.dto.ProductDTO;
import com.timbercld.ws.logger.aspect.LogOperation;
import com.timbercld.ws.order.dto.OrderMainDTO;
import com.timbercld.ws.order.entity.OrderMainEntity;
import com.timbercld.ws.order.service.OrderMainService;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.Map;

@RestController
@RequestMapping("order/main")
public class OrderMainController {

    @Autowired
    private OrderMainService orderMainService;

    @PostMapping
    public Result save(@RequestBody OrderMainDTO orderMainDTO) {
        this.orderMainService.save(orderMainDTO);

        return new Result();
    }

    @DeleteMapping("{id}")
    public Result delete(@PathVariable("id") Long id) {
        //效验数据
        AssertUtils.isNull(id, "id");

        orderMainService.deleteById(id);

        return new Result();
    }

    @PutMapping
    public Result update(@RequestBody OrderMainDTO orderMainDTO) {
        this.orderMainService.updateById(ConvertUtils.sourceToTarget(orderMainDTO, OrderMainEntity.class));
        return new Result();
    }

    @GetMapping("{id}")
    public Result<OrderMainDTO> get(@PathVariable("id") Long id) {
        OrderMainDTO data = orderMainService.get(id);

        return new Result<OrderMainDTO>().ok(data);
    }

    @GetMapping("page")
    public Result<PageData<OrderMainDTO>> page(@ApiIgnore @RequestParam Map<String, Object> params) {
        PageData<OrderMainDTO> page = orderMainService.page(params);

        return new Result<PageData<OrderMainDTO>>().ok(page);
    }
}
