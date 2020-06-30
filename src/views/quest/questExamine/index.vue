<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="题目" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入题目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="createId">
        <el-input
          v-model="queryParams.createId"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"

        >新增</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" :data="checkList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="问卷标题" align="center" prop="title" />
      <el-table-column label="问卷描述" align="center" prop="content" />
      <el-table-column label="创建人" align="center" prop="username" />
      <!-- <el-table-column label="修改人" align="center" prop="updateId" /> -->
      <!-- <el-table-column label="是否删除(0:否  1:是)" align="center" prop="isDelete" :formatter="isDeleteFormat"/> -->
      <el-table-column label="创建日期" align="center" prop="createTime" width="180">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="结束日期" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
        {{scope.row.isThrough==='YES'?'已审核':'未审核'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
          v-if="scope.row.isThrough!=='YES'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleExamine(scope.row)"

          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handlePreview(scope.row)"

          >预览</el-button>
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
    <!-- 添加或修改审核对话框 -->
   <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
     <el-form ref="form" :model="form" :rules="rules" label-width="80px">
       <el-form-item label="是否通过">
         <el-select v-model="form.isThrough" placeholder="请选择发布类型">
           <el-option
             label="通过"
             value="1"
           ></el-option>
           <el-option
             label="驳回"
             value="2"
           ></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="备注" prop="publisher">
         <el-input
           type="textarea"
           rows="4"
           placeholder="请输入备注"
           v-model="form.reason"
           maxlength="300"
           show-word-limit
         >
         </el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="submitForm">确 定</el-button>
       <el-button @click="cancel">取 消</el-button>
     </div>
   </el-dialog>
   <!-- 预览 -->
   <el-dialog  title="预览" :visible.sync="previewShow" width="900px">
     <div class="yulan">
         <div style="padding: 30px;" v-for="(item,index) in listdlog" :key="index">
           <p>{{item.title}}</p>
             <el-checkbox style="margin-bottom: 20px;"  :label="itema.countent" v-for="(itema,indexa) in item.options" :key="indexa"></el-checkbox>
         </div>
     </div>
     <div slot="footer" class="dialog-footer">
       <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
       <el-button @click="previewShow = false">关 闭</el-button>
     </div>
   </el-dialog>
  </div>
</template>

<script>
import { listCheck, getCheck, delCheck, addCheck, updateCheck, exportCheck,previewCheck } from "@/api/system/check";
export default {
  name: "Check",
  data() {
    return {
      isAudit: 1,
      commentId:0,
      listdlog:[{
        title:'第一个题目',
        options:[
          {
            name:'这个是第一个选项',
            checked: false
          },
          {
            name:'这个是第一个选项',
            checked: false
          },
          {
            name:'这个是第一个选项',
            checked: false
          },
          {
            name:'这个是第一个选项',
            checked: false
          },
          {
            name:'这个是第一个选项',
            checked: false
          },
          {
            name:'这个是第一个选项',
            checked: false
          }
        ]
      },
      {
        title:'第二个题目',
        options:[
          {
            name:'这个是第一个选项',
            checked: false
          },
          {
            name:'这个是第一个选项',
            checked: false
          }
        ]
      },
      {
        title:'第三个题目',
        options:[
          {
            name:'这个是第一个选项',
            checked: false
          },
          {
            name:'这个是第一个选项',
            checked: false
          }
        ]
      }
      ],
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
      // 审核表格数据
      checkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      previewShow:false,
      previewhtml:"没有数据",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        questId: undefined,
        isThrough: undefined,
        reason: undefined,
        createId: undefined,
        updateId: undefined,
        isDelete: undefined,
        orderByColumn:'id',
        isAsc:'desc'
      },
      // 表单参数
      form: {
        isThrough:'1',
        reason:''
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    statusFormat(row, column){
      switch (row.status) {
        case 0:
          return "发布"
          break;
        case 1:
          return "启用"
          break;
        case 2:
          return "禁用"
          break;
        default:
          return ""
          break;
      }
    },
    /** 查询审核列表 */
    getList() {
      this.loading = true;
      listCheck(this.queryParams).then(response => {
        console.log(response,"------------列表---------------")
        this.checkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        questId: undefined,
        isThrough: undefined,
        reason: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined,
        isDelete: undefined
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
      this.title = "添加审核";
    },
    /** 提交按钮 */
    submitForm() {
      let obj={
        ...this.form
      }
     obj.id=this.commentId
     obj.isThrough=obj.isThrough==1?'YES':'NO'
      updateCheck(obj).then(res=>{
        console.log(res,"------ffffffff-----")
        if(res.code === 200){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
           this.getList();
          this.open = false
          this.form = {
            isThrough:'1',
            reason:''
          }
        }else{
          this.$message.error('操作失败');
        }

      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有审核数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCheck(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //审核
    handleExamine(row){
      console.log(row.id,"-----mmm----")
      this.open = true
      this.commentId = row.id
    },
    // 预览
    handlePreview(row){
      previewCheck(row.questId).then(res=>{
        console.log(res,"------预览----------------")
        this.listdlog=res.data.subjectVos
      })
      this.previewShow = true
    },
  }
};
</script>
<style scoped>
  .yulan{
    width: 100%;
    height:600px;
    overflow-y: auto;
  }
</style>
