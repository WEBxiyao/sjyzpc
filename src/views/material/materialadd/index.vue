<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="素材分类" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择素材分类" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="附件id" prop="fileIds">
        <el-input
          v-model="queryParams.fileIds"
          placeholder="请输入附件id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.publishTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发布类型" prop="publishType">
        <el-select v-model="queryParams.publishType" placeholder="请选择发布类型" clearable size="small">
          <el-option
            v-for="dict in publishTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" prop="publishStatus">
        <el-select v-model="queryParams.publishStatus" placeholder="请选择发布状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人" prop="publisher">
        <el-input
          v-model="queryParams.publisher"
          placeholder="请输入发布人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="点赞数" prop="goodNum">
        <el-input
          v-model="queryParams.goodNum"
          placeholder="请输入点赞数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收藏数" prop="colNum">
        <el-input
          v-model="queryParams.colNum"
          placeholder="请输入收藏数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input
          v-model="queryParams.memo"
          placeholder="请输入备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createId">
        <el-input
          v-model="queryParams.createId"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人" prop="updateId">
        <el-input
          v-model="queryParams.updateId"
          placeholder="请输入修改人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除(0:否  1:是)" prop="isDelete">
        <el-input
          v-model="queryParams.isDelete"
          placeholder="请输入是否删除(0:否  1:是)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始日期" prop="startTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"

        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['views:material:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['views:material:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['views:material:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="materialList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="素材封面" width="260" align="center" prop="fileIds" >
        <template slot-scope="scope">
          <img style="width:230px; height:100px" :src="scope.row.weixinimg">
        </template>
      </el-table-column>
      <el-table-column label="素材分类" align="center" prop="type" :formatter="typeFormat"/>
      <el-table-column label="录入时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="发布类型" align="center" prop="publishType" :formatter="publishTypeFormat" /> -->
      <el-table-column label="发布状态" align="center" prop="publishStatus" :formatter="publishStatusFormat"  />
      <!-- <el-table-column label="发布人" align="center" prop="publisher" /> -->
      <!-- <el-table-column label="点赞数" align="center" prop="goodNum">
        <template slot-scope="scope">
          {{scope.row.goodNum}}人点赞
        </template>
      </el-table-column>
      <el-table-column label="收藏数" align="center" prop="colNum">
        <template slot-scope="scope">
          {{scope.row.colNum}}人点赞
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="memo" /> -->
      <!-- <el-table-column label="创建人" align="center" prop="createId" />
      <el-table-column label="修改人" align="center" prop="updateId" />
      <el-table-column label="是否删除(0:否  1:是)" align="center" prop="isDelete" /> -->
      <!-- <el-table-column label="开始日期" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"

          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            style="color:red !important;"

          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改素材内容对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="素材分类">
          <el-select v-model="form.type" placeholder="请选择素材分类">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="附件id" prop="fileIds">
          <el-input v-model="form.fileIds" placeholder="请输入附件id" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.publishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布类型">
          <el-select v-model="form.publishType" placeholder="请选择发布类型">
            <el-option
              v-for="dict in publishTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-radio-group v-model="form.publishStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布人" prop="publisher">
          <el-input v-model="form.publisher" placeholder="请输入发布人" />
        </el-form-item>
        <el-form-item label="点赞数" prop="goodNum">
          <el-input v-model="form.goodNum" placeholder="请输入点赞数" />
        </el-form-item>
        <el-form-item label="收藏数" prop="colNum">
          <el-input v-model="form.colNum" placeholder="请输入收藏数" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="创建人" prop="createId">
          <el-input v-model="form.createId" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="修改人" prop="updateId">
          <el-input v-model="form.updateId" placeholder="请输入修改人" />
        </el-form-item>
        <el-form-item label="是否删除(0:否  1:是)" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入是否删除(0:否  1:是)" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listMaterial, getMaterial, delMaterial, addMaterial, updateMaterial, exportMaterial } from "@/api/material";

export default {
  name: "Material",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 素材内容表格数据
      materialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 素材分类字典
      typeOptions: [],
      // 发布类型字典
      publishTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        title: undefined,
        content: undefined,
        fileIds: undefined,
        publishTime: undefined,
        publishType: undefined,
        publishStatus: undefined,
        publisher: undefined,
        goodNum: undefined,
        colNum: undefined,
        memo: undefined,
        createId: undefined,
        updateId: undefined,
        isDelete: undefined,
        startTime: undefined,
        endTime: undefined,
        orderByColumn:'id',
        isAsc:'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("material_class").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("release_type").then(response => {
      this.publishTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询素材内容列表 */
    getList() {
      this.loading = true;
      listMaterial(this.queryParams).then(response => {
        console.log("response",response)
        this.materialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 素材分类字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 发布类型字典翻译
    publishTypeFormat(row, column) {
      return this.selectDictLabel(this.publishTypeOptions, row.publishType);
    },
    publishStatusFormat(row, column){
      switch (row.publishStatus) {
        case 1:
          return "待发布"
          break;
        case 2:
          return "审核中"
          break;
        case 3:
          return "已发布"
          break;
        default:
          return ""
          break;
      }
    },
    typeFormat(row, column){
      console.log(row,"-----",this.typeOptions)
      let val = ""
      this.typeOptions.forEach(el => {
        if(el.dictValue === row.type){
          val = el.dictLabel
        }
      });
      if(val){
        return val
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        type: undefined,
        title: undefined,
        content: undefined,
        fileIds: undefined,
        publishTime: undefined,
        publishType: undefined,
        publishStatus: "0",
        publisher: undefined,
        goodNum: undefined,
        colNum: undefined,
        memo: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined,
        isDelete: undefined,
        startTime: undefined,
        endTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.$store.dispatch('material/setMaterialData', {})
      this.$router.push({
        path: "/material/materialEdit",query: {
        addType:"1"
      }});
      // this.open = true;
      // this.title = "添加素材内容";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      // const id = row.id || this.ids
      // getMaterial(id).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改素材内容";
      // });
      console.log(row)
      this.$store.dispatch('material/setMaterialData', row)
      this.$router.push({
        path: "/material/materialEdit",query: {
        addType:"2"
      }});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMaterial(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMaterial(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除素材内容?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMaterial(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有素材内容数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMaterial(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
