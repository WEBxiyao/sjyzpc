<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="用户id" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="0:发布   1:启用  2:禁用" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择0:发布   1:启用  2:禁用" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="可见用户id" prop="tUid">
        <el-input
          v-model="queryParams.tUid"
          placeholder="请输入可见用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推送标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入推送标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核人员id" prop="aUid">
        <el-input
          v-model="queryParams.aUid"
          placeholder="请输入审核人员id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人员ID" prop="createId">
        <el-input
          v-model="queryParams.createId"
          placeholder="请输入创建人员ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人员ID" prop="updateId">
        <el-input
          v-model="queryParams.updateId"
          placeholder="请输入创建人员ID"
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
          v-hasPermi="['system:pushnews:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:pushnews:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:pushnews:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:pushnews:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" :data="pushnewsList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column label="素材标题" align="center" prop="materialTitle"/>
      <el-table-column label="发布人" align="center" prop="createName" />
      <el-table-column label="推文分类" align="center" prop="typeDesc" />
      <el-table-column label="推文状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">未审核</span>
          <span v-else-if="scope.row.status==1">已发布</span>
          <span v-else-if="scope.row.status==2">已驳回</span>
          <span v-else-if="scope.row.status==3">已撤销</span>
        </template>
       </el-table-column>
      <el-table-column label="推文对象" align="center" prop="auid" :formatter="aUidFormat" />
      <el-table-column label="推送标题" align="center" prop="title" />
      <!-- <el-table-column label="审核人员" align="center" prop="aUid" /> -->
      <!-- <el-table-column label="创建人员ID" align="center" prop="createId" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="handleExamine(scope.row)"

          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handlePreview(scope.row)"

          >预览</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handlePush(scope.row)"
            v-hasPermi="['system:pushnews:remove']"
          >推送</el-button> -->
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

    <!-- 添加或修改推文对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="是否通过">
          <el-select v-model="form.publishStatus" placeholder="请选择发布类型">
            <el-option
              label="通过"
              value="1"
            ></el-option>
            <el-option
              label="驳回"
              value="2"
            ></el-option>
            <el-option
              label="撤销"
              value="3"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="publisher">
          <el-input
            type="textarea"
            rows="4"
            placeholder="请输入备注"
            v-model="form.publisher"
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
    <!-- 推送对话框 -->
    <el-dialog :title="title" :visible.sync="push" width="500px" append-to-body>
        <span>推送至：</span>
        <el-checkbox-group v-model="checkList">
            <el-checkbox label="微信公众号"></el-checkbox>
            <el-checkbox label="微信小程序"></el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog title="预览" :visible.sync="previewShow" width="900px" append-to-body >
    <!-- 这个地方是标题 -->
    <div style="display: flex; align-items: center;">
     <p><span style="font-weight: bold;">标题：</span>{{rowObj.title}}</p>
     <p style="margin-left: 20px;"><span style="font-weight: bold;">素材分类：</span>{{xcfl}}</p>
    </div>
    <!-- 这个地方是发布类型 -->
    <div><span style="font-weight: bold;">发布类型：</span>{{fblx}}</div>
    <!-- 这个是封面摘要 -->
    <div style="display: flex; flex-direction: column;">
      <h3>封面和摘要</h3>
      <div style="display: flex; justify-content: space-between;">
        <div>
          <el-image
            style="width: 360px; height: 177px;border: 1px solid #eee;"
            :src="rowObj.weixinimg"
            fit="cover">
    </el-image>
    </div>
        <div style="width: 360px; height: 177px;overflow-y: auto; border: 1px solid #eee;padding: 20px;">
          {{rowObj.memo}}
        </div>
      </div>
    </div>
    <!-- 这个地方是推文对象 -->
    <div>
      <h3>推文对象</h3>
      <p>组织机构一</p>
    </div>
    <div class="content">
      <div class="ql-editor"  v-html='previewhtml'> </div>
    </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="previewShow = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPushnews, getPushnews, delPushnews, addPushnews, updatePushnews, exportPushnews, exportaudit  } from "@/api/pushnews";
import { listMaterial, getMaterial, delMaterial, addMaterial, updateMaterial, exportMaterial } from "@/api/material";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "Pushnews",
  data() {
    return {
      rowObj:{},
      previewhtml:"",
      previewShow:false,
      //弹窗需要调的值
      ExamineData:{},
      checkList: [],
      push: false,
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
      // 推文表格数据
      pushnewsList: [],
      // 素材分类字典
      typeOptions: [],
      // 发布类型字典
      publishTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mid: undefined,
        uid: undefined,
        status: undefined,
        tUid: undefined,
        title: undefined,
        aUid: undefined,
        createId: undefined,
        updateId: undefined,
        orderByColumn:'id',
        isAsc:'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mid: [
          { required: true, message: "素材id不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        tUid: [
          { required: true, message: "可见用户id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getMateralList()
    this.getList();
    this.getDicts("material_class").then(response => {
      console.log("-------1-------",response.data)
      this.typeOptions = response.data;
    });
    this.getDicts("release_type").then(response => {
      console.log("-------2-------",response.data)
      this.publishTypeOptions = response.data;
    });
  },
  computed: {
    // 发布类型
    fblx() {
      console.log(this.publishTypeOptions,)
      if(this.publishTypeOptions.length>0){
        let index=this.publishTypeOptions.findIndex(v=>v.dictValue==this.rowObj.publishType)
        if(index!==-1){
          return this.publishTypeOptions[index].dictLabel;
        }
      }
       return ''
    },
    // 素材分类
    xcfl(){
      if(this.typeOptions.length>0){
        let index=this.typeOptions.findIndex(v=>v.dictValue==this.rowObj.type)
        if(index!==-1){
          return this.typeOptions[index].dictLabel;
        }
      }
       return ''
    }
  },
  methods: {
    //获取素材表格数据
    getMateralList() {
      // this.loading = true;
      let selectParams = {
        pageNum: 1,
        pageSize: 10
      }
      listMaterial(selectParams).then(response => {
        this.materialList = []
        if(response && response.code === 200){
          this.materialList = response.rows;
        }
      });
    },
    handlePreview(row){
      this.previewShow = true
      this.previewhtml = ""
      console.log(this.materialList,"-------uuuu-----")
      this.materialList.forEach(el => {
        if(el.id === row.mid){
          this.previewhtml = el.content
          this.rowObj=el
        }
      });
    },
    //审核
    handleExamine(row){
      console.log("row",row)
      this.open = true
      this.ExamineData = {
        tid:row.id
      }
    },
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
    aUidFormat({auid}, column){
      switch (auid) {
        case 0:
          return "小程序"
          break;
        case 1:
          return "公众号"
          break;
        case 2:
          return "小程序和公众号"
          break;
        default:
          return ""
          break;
      }
    },
    //推送按钮
    handlePush(data){
        this.push = true
    },
    /** 查询推文列表 */
    getList() {
      this.loading = true;
      listPushnews(this.queryParams).then(response => {
        console.log(response.rows,"--mm---")
        this.pushnewsList = response.rows;
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
        mid: undefined,
        uid: undefined,
        status: "0",
        tUid: undefined,
        title: undefined,
        createTime: undefined,
        aUid: undefined,
        createId: undefined,
        updateId: undefined,
        updateTime: undefined
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
      this.title = "添加推文";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPushnews(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改推文";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      // console.log(this.form)
      this.ExamineData.memo = this.form.publisher
      this.ExamineData.status = this.form.publishStatus

      if(this.ExamineData){
        exportaudit(this.ExamineData).then(res=>{
          // console.log(res)
          if(res.code === 200){
            this.getList()
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }else{
            this.$message.error('操作失败');
          }
            this.open = false
            this.form = {}
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除推文编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPushnews(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有推文数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPushnews(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style lang="scss" scoped>
.content{
  border: 1px solid #909399;
  color: black;
  height: 600px;
  overflow-y: auto;
  img{
    max-width: 800px;
  }
}
</style>
