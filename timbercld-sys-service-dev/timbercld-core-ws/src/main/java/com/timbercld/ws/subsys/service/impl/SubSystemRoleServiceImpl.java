/**
 * Copyright (C) 2022-2023 Timber Chain Cloud (TimberCLD). All Rights Reserved.
 *
 * @author TimberCLD
 * @email account@timbercld.com
 * @site https://www.timbercld.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
* Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.timbercld.ws.subsys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.timbercld.core.constant.Constant;
import com.timbercld.core.page.PageData;
import com.timbercld.core.service.impl.BasicServiceImpl;
import com.timbercld.core.utils.ConvertUtils;
import com.timbercld.ws.subsys.service.SubSystemRoleService;
import com.timbercld.ws.system.dao.SystemRoleDAO;
import com.timbercld.ws.system.dto.SystemRoleDTO;
import com.timbercld.ws.system.entity.SystemRoleEntity;
import com.timbercld.ws.system.service.SystemRoleUserService;
import com.timbercld.ws.system.service.SystemRoleMenuService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 子系统角色
 * 
 *
 */
@Service
public class SubSystemRoleServiceImpl extends BasicServiceImpl<SystemRoleDAO, SystemRoleEntity> implements SubSystemRoleService {
	@Autowired
	private SystemRoleMenuService systemRoleMenuService;
	@Autowired
	private SystemRoleUserService systemRoleUserService;

	@Override
	public PageData<SystemRoleDTO> page(Map<String, Object> params) {
		IPage<SystemRoleEntity> page = basicDao.selectPage(
			getPage(params, Constant.CREATE_DATE, false),
			getWrapper(params)
		);

		return getPageData(page, SystemRoleDTO.class);
	}

	@Override
	public List<SystemRoleDTO> list(Map<String, Object> params) {
		List<SystemRoleEntity> entityList = basicDao.selectList(getWrapper(params));

		return ConvertUtils.sourceToTarget(entityList, SystemRoleDTO.class);
	}

	private QueryWrapper<SystemRoleEntity> getWrapper(Map<String, Object> params){
		String name = (String) params.get("name");

		QueryWrapper<SystemRoleEntity> wrapper = new QueryWrapper<>();
		wrapper.like(StringUtils.isNoneBlank(name), "name", name);
		wrapper.isNull("sub_system_id");

		return wrapper;
	}

	@Override
	public SystemRoleDTO get(Long id) {
		SystemRoleEntity entity = basicDao.selectById(id);

		return ConvertUtils.sourceToTarget(entity, SystemRoleDTO.class);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void save(SystemRoleDTO dto) {
		SystemRoleEntity entity = ConvertUtils.sourceToTarget(dto, SystemRoleEntity.class);

		basicDao.insertSubSystemRole(entity);

		systemRoleMenuService.saveOrUpdate(entity.getId(), dto.getMenuIdList());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void update(SystemRoleDTO dto) {
		SystemRoleEntity entity = ConvertUtils.sourceToTarget(dto, SystemRoleEntity.class);

		updateById(entity);

		systemRoleMenuService.saveOrUpdate(entity.getId(), dto.getMenuIdList());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void delete(Long[] ids) {

		basicDao.deleteBatchIds(Arrays.asList(ids));

		systemRoleUserService.deleteByRoleIds(ids);

		systemRoleMenuService.deleteByRoleIds(ids);
	}

}