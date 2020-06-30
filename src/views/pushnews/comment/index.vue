<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="推文id" prop="formId">
        <el-input
          v-model="queryParams.formId"
          placeholder="请输入推文id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label=" 评论的ID" prop="materialId">
        <el-input
          v-model="queryParams.materialId"
          placeholder="请输入 评论的ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="评论类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择评论类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="评论内容" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入评论内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论人员ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入评论人员ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
    <!--  <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:comment:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:comment:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:comment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:comment:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="commentList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="推文标题" align="center" prop="tweetTitle" />
      <el-table-column label=" 评论的类容" align="center" prop="content" />
      <el-table-column label="状态" align="center">
      <template slot-scope="scope">
        <span>{{scope.row.isAudit==1?'通过':(scope.row.isAudit==2?'未通过':'未审核')}}</span>
      </template>
      </el-table-column>
      <el-table-column label="评论类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.type==1?'回复':'评论'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" align="center" prop="content" />
      <el-table-column label="评论人身份证号" align="center" prop="codeNo" />
      <el-table-column label="评论人" align="center" prop="username" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
          v-if="scope.row.isAudit !== 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleExamine(scope.row)"


          >审核</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:comment:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改评论对话框 -->
    <el-dialog title="审批" :visible.sync="open" width="500px" append-to-body>
        <span>是否通过</span>
        <el-select v-model="isAudit" placeholder="请选择">
          <el-option label="通过" value="通过" />
          <el-option label="驳回" value="驳回" />
        </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listComment, getComment, delComment, addComment, updateComment, exportComment } from "@/api/system/comment";

export default {
  name: "Comment",
  data() {
    return {
      isAudit: 1,
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
      // 评论表格数据
      commentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        formId: undefined,
        materialId: undefined,
        type: undefined,
        content: undefined,
        userId: undefined,
        orderByColumn:'id',
        isAsc:'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "评论类型不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    isAuditFormat({isAudit}, column){
      switch (isAudit) {
        case 0:
          return "未审核"
          break;
        case 1:
          return "通过"
          break;
        case 2:
          return "未通过"
          break;
        default:
          return ""
          break;
      }
    },
    //审核
    handleExamine(row){
      let message=''
      if(row.isAudit==1){
        message="通过"
      }else if(row.isAudit==0){
        message="未审核"
      }else{
        message="驳回"
      }
      this.open = true
      this.isAudit =message
      this.commentId = row.id
    },
    /** 查询评论列表 */
    getList() {
      this.loading = true;
      listComment(this.queryParams).then(response => {
        this.commentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        formId: undefined,
        materialId: undefined,
        type: undefined,
        content: undefined,
        createTime: undefined,
        userId: undefined
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
      this.open = true;
      this.title = "添加评论";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getComment(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改评论";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      let isAudit=this.isAudit==='通过'?1:2
      let obj = {
        id: this.commentId,
        isAudit: isAudit
      }
      updateComment(obj).then(response => {
        this.open = false
        this.getList()
      });
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //     if (this.form.id != undefined) {
      //       updateComment(this.form).then(response => {
      //         if (response.code === 200) {
      //           this.msgSuccess("修改成功");
      //           this.open = false;
      //           this.getList();
      //         } else {
      //           this.msgError(response.msg);
      //         }
      //       });
      //     } else {
      //       addComment(this.form).then(response => {
      //         if (response.code === 200) {
      //           this.msgSuccess("新增成功");
      //           this.open = false;
      //           this.getList();
      //         } else {
      //           this.msgError(response.msg);
      //         }
      //       });
      //     }
      //   }
      // });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除评论编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delComment(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有评论数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportComment(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
