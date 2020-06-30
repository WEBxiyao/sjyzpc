<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="推文标题" prop="mid">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入素材标题"
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
      <el-form-item label="审核人员id" prop="auid">
        <el-input
          v-model="queryParams.auid"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(1)"

        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
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
        >导出</el-button> -->
      <!-- </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="pushnewsList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column label="推文标题" align="center" prop="title" />
      <el-table-column label="素材标题" align="center" prop="materialTitle"/>
      <el-table-column label="发布人" align="center" prop="createName" />
      <el-table-column label="推文状态" align="center" prop="status"  :formatter="statusFormat"/>
      <el-table-column label="推文对象" align="center" prop="auid" :formatter="aUidFormat" />
      <!-- <el-table-column label="审核人员" align="center" prop="auid" /> -->
      <!-- <el-table-column label="创建人员ID" align="center" prop="createId" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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

    <!-- 添加或修改推文对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="素材id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入素材id" />
        </el-form-item>
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="0:发布   1:启用  2:禁用">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可见用户id" prop="tUid">
          <el-input v-model="form.tUid" placeholder="请输入可见用户id" />
        </el-form-item>
        <el-form-item label="推送标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入推送标题" />
        </el-form-item>
        <el-form-item label="审核人员id" prop="auid">
          <el-input v-model="form.auid" placeholder="请输入审核人员id" />
        </el-form-item>
        <el-form-item label="创建人员ID" prop="createId">
          <el-input v-model="form.createId" placeholder="请输入创建人员ID" />
        </el-form-item>
        <el-form-item label="创建人员ID" prop="updateId">
          <el-input v-model="form.updateId" placeholder="请输入创建人员ID" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择素材 -->
    <el-dialog
      title="选择素材"
      :visible.sync="xzscDialogVisible"
      width="1120px"
      >
      <div class="material" v-loading="materialLoding">
        <div class="material-item" v-for="(item, index) in  materialList" :key="item.id" @click="clickMaterialItem(index)">
          <p>更新于 昨天10:00</p>
          <img :src="item.weixinimg" width="313" height="428" alt="img1">
          <p>{{item.title}}</p>
          <div class="material-mask" v-show="item.clickthis">
            <img :src="benefits" alt="" srcset="">
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="xzscDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toqueding">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新建推文弹窗 -->
    <el-dialog
      :title="xjtwDialogTitle"
      :visible.sync="xjtwDialogVisible"
      width="1000px"
      >
      <div class="material">
        <div class="material-item">
          <div v-if="comfirmMaterial.content">
            <p>更新于 昨天10:00</p>
            <img :src="comfirmMaterial.weixinimg" width="313" height="428" alt="img1">
            <p>{{comfirmMaterial.title}}</p>
          </div>
          <div class="yulanZoom" @click="handleAdd(2)">选择素材</div>
        </div>
        <!-- <div v-else class="material-kongbai">暂无素材</div> -->
      </div>
      <el-form :model="pushNewsparam" ref="queryForm2" :inline="true" label-width="80px" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="pushNewsparam.title"
            placeholder="请输入标题"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="推送对象" prop="auid">
          <el-select v-model="pushNewsparam.auid" placeholder="请选择" clearable size="small">
            <el-option label="小程序" value="1" />
            <el-option label="公众号" value="2" />
            <el-option label="小程序和公众号" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="推文类型" prop="auid">
          <el-select v-model="pushNewsparam.type" placeholder="请选择" clearable size="small">
            <el-option v-for="(item,index) in tweetsData" :key="index" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="xjtwDialogVisible = false">取 消</el-button>
        <el-button @click="previewShow = true">预 览</el-button>
        <el-button type="primary" @click="submitForm">提交审核</el-button>
      </span>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog title="预览" :visible.sync="previewShow" width="900px" append-to-body >
      <div class="content">
        <div class="ql-editor" v-html='comfirmMaterial.content'> </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="previewShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPushnews, getPushnews, delPushnews, addPushnews, updatePushnews, exportPushnews,addPushnews11,typesTweets } from "@/api/pushnews"
import img1 from "@/assets/image/profile.jpg"
import benefits from "@/assets/image/benefits.png"
import { listMaterial, getMaterial, delMaterial, addMaterial, updateMaterial, exportMaterial } from "@/api/material";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "Pushnews",
  data() {
    return {
      rowid:"",
      tweetsData:[],
      pushNewsparam:{},
      xjtwDialogTitle:"",
      previewShow: false,
      comfirmMaterial:{},
      xjtwDialogVisible: false,
      materialLoding: false,
      // maskshow: false,
      hightIndex: "",
      clickthis: false,
      img1:img1,
      benefits:benefits,
      materialList: [],
      xzscDialogVisible:false,//选择素材
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
        auid: undefined,
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
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        auid: [
          { required: true, message: "推送对象不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getMateralList();
    this.getTypesTweets()
  },
  methods: {
    getTypesTweets(){
      typesTweets().then(res=>{
        console.log(res,"---m----")
        this.tweetsData=res.data
      })
    },
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
          this.materialList.push(...response.rows)
          this.materialList.forEach(el => {
            el.clickthis = false
            el.maskshow = false
          });
          // this.materialLoding = false
          // this.total = response.total;
          // this.loading = false;
        }
      });
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
    toqueding(){
      let that = this
      // let row = this.materialList[that.hightIndex]
      // this.$store.dispatch('material/setMaterialData', row)
      // this.$router.push({ path: "/pushnews/richText"});
      this.comfirmMaterial = this.materialList[that.hightIndex]
      this.xzscDialogVisible = false
      this.xjtwDialogVisible = true
    },
    clickMaterialItem(index){
      // console.log(item)
      let that = this
      this.materialList.forEach(el => {
        el.clickthis = false
        // el.maskshow = false
      });
      // if(type && type === 2){
      //   console.log("222222222")
        this.hightIndex = index
      //   item.clickthis = true
      //   item.maskshow == true
      // }
      // if(!item.maskshow){
      //   console.log("111111111")
      //   item.clickthis = !item.clickthis
      // }
      // console.log(this.hightIndex)
      // // if(that.hightIndex) {
        this.materialList[that.hightIndex].clickthis = true
      // // }
      this.$forceUpdate();
      // console.log("item",item)
    },
    /** 查询推文列表 */
    getList() {
      this.loading = true;
      listPushnews(this.queryParams).then(response => {
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
        auid: undefined,
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
    handleAdd(type) {
      // this.reset();
      this.xzscDialogVisible = true
      // this.getMateralList()
      // this.materialLoding = true
      if(type === 1){
        this.xjtwDialogTitle = "新建推文"
      }else{
        this.xjtwDialogTitle = "修改推文"
      }
      // this.$router.push({ path: "richText"});

      // this.open = true;
      // this.title = "添加推文";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.xjtwDialogTitle = "修改推文"
      console.log(row)
      console.log(this.materialList)
      this.comfirmMaterial = []
      this.hightIndex = "",
      this.materialList.forEach(el => {
        if(el.id == row.mid){
          this.comfirmMaterial = el
        }
      });
      this.xjtwDialogVisible = true
      this.pushNewsparam = row
      // this.reset();
      // const id = row.id || this.ids
      // getPushnews(id).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改推文";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["queryForm2"].validate(valid => {
        console.log(valid)
        if (valid) {
      console.log("comfirmMaterial",this.comfirmMaterial)
      console.log("pushNewsparam",this.pushNewsparam)
      this.pushNewsparam.auid = new Number(this.pushNewsparam.auid)
      if(this.comfirmMaterial.id){
        this.pushNewsparam.mid = this.comfirmMaterial.id
      }
      this.pushNewsparam.status = 0
          // return
          if (this.pushNewsparam.id) {
            updatePushnews(this.pushNewsparam).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.xjtwDialogVisible = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPushnews(this.pushNewsparam).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.xjtwDialogVisible = false;
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
      this.$confirm('是否确认删除推文', "警告", {
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
.material{
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  // border: 1px solid #e7e7eb;
  &-item{
    cursor: pointer;
    position: relative;
    border: 1px solid #e7e7eb;
    padding: 14px;
    margin-right: 10px;
    margin-bottom: 10px;
    height: 327px;
    width: 328px;
    &:nth-child(3n){
      margin-right: 0;
    }
    .yulanZoom{
      text-align: center;
      position: absolute;
      background-color: rgba($color: #000000, $alpha: .6);
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      color: #fff;
      line-height:320px ;
      opacity: 0;
      font-size: 20px;
      &:hover{
        opacity: 1;
      }
    }
    img{
      width: 300px;
      height: 166px;
    }
    p{
      font-size: 16px;
      color: #9a9a9a;
      padding-bottom: 14px;
      border-bottom: 1px solid #e7e7eb;
      width: 300px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:nth-last-child(1){
        color: #353535;
        border: 0;
        padding:0;
      }
    }

  }
  &-kongbai{
    height: 327px;
    border: 1px solid #e7e7eb;
    width: 328px;
    text-align: center;
    line-height: 327px;
  }
  &-mask{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    text-align: center;
    background-color: rgba($color: #000000, $alpha: 0.6);
    img{
      width: 68px;
      height: 68px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -34px;
      margin-left: -34px;
    }
  }
}
</style>
