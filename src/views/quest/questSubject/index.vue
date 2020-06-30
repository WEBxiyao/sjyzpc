<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型(0:多选  1:单选)" clearable size="small">
          <el-option label="单选" value="1" />
          <el-option label="多选" value="2" />
        </el-select>
      </el-form-item>
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
    </el-row>

    <el-table v-loading="loading" :data="subjectList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
      <el-table-column label="标题" align="center" prop="title" />
      <!-- <el-table-column label="调查问卷id" align="center" prop="questId" /> -->
      <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat"/>
  <!--    <el-table-column label="是否必填(0:否 1:是)" align="center" prop="isRequired" /> -->
      <el-table-column label="创建人" align="center" prop="username" />
      <!-- <el-table-column label="修改人" align="center" prop="updateId" /> -->
     <!-- <el-table-column label="是否删除(0:否  1:是)" align="center" prop="isDelete" /> -->
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
            icon="el-icon-edit"
            @click="handlePreview(scope.row)"

          >预览</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"

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

    <!-- 添加或修改问卷调查题目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title" class="wd300">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <!-- <el-form-item label="调查问卷id" prop="questId">
          <el-input v-model="form.questId" placeholder="请输入调查问卷id" />
        </el-form-item> -->
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="单选" value="1" />
            <el-option label="多选" value="0" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否必填">
          <el-select v-model="form.isRequired" placeholder="请选择类型(0:多选  1:单选)">
            <el-option label="必填" value="1" />
            <el-option label="非必填" value="0" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="创建人" prop="createId">
          <el-input v-model="form.createId" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="修改人" prop="updateId">
          <el-input v-model="form.updateId" placeholder="请输入修改人" />
        </el-form-item> -->
        <!-- <el-form-item label="是否删除(0:否  1:是)" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入是否删除(0:否  1:是)" />
        </el-form-item> -->
         <el-form-item label="编辑选项" >
          <el-form ref="form11" label-width="80px" class="maxh350">
            <el-form-item :label="'选项'+item.name"  v-for="(item,index) in option" :key="item.name" class="mb22">
               <el-input :rows="2" type="textarea" maxlength="100" v-model="item.countent" placeholder="请输入描述，小于100字" style="width:400px"/>
               <i class="el-icon-remove-outline fz25 red lh54 ml20px" @click="removeOption(index,item)"></i>
               <i v-if="item.isDelete == 0" class="el-icon-circle-check fz25 green lh54 ml20px" @click="checkOption(index)"></i>
               <i v-if="item.isDelete == 1" class="el-icon-success fz25 green lh54 ml20px"></i>
            </el-form-item>
          </el-form>
          <el-form-item class="cscenter  hi54 cp">
              <i @click="toAddOption" class="el-icon-circle-plus-outline fz40 lh54 colorh"></i>
          </el-form-item>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预览窗口 -->
    <el-dialog title="预览" :visible.sync="showPreview" width="800px" append-to-body>
      <div>
        <p>{{optionList.title}}</p>
        <el-checkbox-group v-model="checkList">
          <el-checkbox :disabled="true" :label="getABC(index)+item.countent" v-for="(item,index) in optionList.options" :key="index"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPreview = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSubject, getSubject, delSubject, addSubject, updateSubject, exportSubject } from "@/api/system/subject";
import { getSubjectInfo, listOption, getOption, delOption, addOption, updateOption, exportOption } from "@/api/system/subject";
export default {
  name: "Subject",
  data() {
    return {
      optionList:[],
      checkList:[],
      showPreview:false,
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
      // 问卷调查题目表格数据
      subjectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        questId: undefined,
        type: undefined,
        isRequired: undefined,
        createId: undefined,
        updateId: undefined,
        orderByColumn:'id',
        isAsc:'desc'
        // isDelete: 0
      },
      // 表单参数
      option:[
          {
            name:"A",
            countent:"",
            isDelete:0
          },
          {
            name:"B",
            countent:"",
            isDelete:0
          },
          {
            name:"C",
            countent:"",
            isDelete:0
          },
        ],
      form: {
        option:[
          {
            name:"A",
            countent:"",
            isDelete:0
          },
          {
            name:"B",
            countent:"",
            isDelete:0
          },
          {
            name:"C",
            countent:"",
            isDelete:0
          },
        ]
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
    //预览
    handlePreview(row){
      this.showPreview = true
      getSubjectInfo({id:row.id}).then(response => {
        console.log(response)
        this.optionList = response.data
      })
    },
    //删除选项
    removeOption(index,item){
      console.log(item)
      this.option.splice(index,1)
      this.option.forEach((el,i) => {
        el.name = this.getABC(i)
      })
          this.$forceUpdate();
    },
    checkOption(index){
      this.option.forEach(el => {
        el.isDelete = 0
      });
      this.option[index].isDelete = 1
      this.$forceUpdate();
    },
    toAddOption(){
      let length = this.option.length
      let obj = {
              name: this.getABC(length),
              countent:"",
              isDelete:"0"
            }
      this.option.push(obj)
      console.log(this.option)
      this.$forceUpdate()
    },
    getABC(index){
      switch (index) {
        case 0:
          return "A"
          break;
        case 1:
          return "B"
          break;
        case 2:
          return "C"
          break;
        case 3:
          return "D"
          break;
        case 4:
          return "E"
          break;
        case 5:
          return "F"
          break;
        case 6:
          return "G"
          break;
        case 7:
          return "H"
          break;
        case 8:
          return "I"
          break;
        default:
          return false
          break;
      }
    },
    typeFormat({type}, column){
      switch (type) {
        case "0":
          return "多选"
          break;
        case "1":
          return "单选"
          break;
        default:
          return ""
          break;
      }
    },
    /** 查询问卷调查题目列表 */
    getList() {
      this.loading = true;
      listSubject(this.queryParams).then(response => {
        console.log(response)
        this.subjectList = response.rows;
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
        title: undefined,
        questId: undefined,
        type: undefined,
        isRequired: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined,
        // isDelete: undefined,

      };
     this.option=[
          {
            name:"A",
            countent:"",
            isDelete:0
          },
          {
            name:"B",
            countent:"",
            isDelete:0
          },
          {
            name:"C",
            countent:"",
            isDelete:0
          },
        ]
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
      this.title = "添加问卷调查题目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      const id = row.id || this.ids
      getSubject(id).then(response => {
        getSubjectInfo({id:row.id}).then(res => {
          this.form = response.data;
          this.option = res.data.options
          this.option.forEach((el,index) => {
            el.name = this.getABC(index)
          });
          this.open = true;
          this.title = "修改问卷调查题目"
        })

      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSubject(this.form).then(response => {
              if (response.code === 200) {
                this.option.forEach((el,i) => {
                  console.log(el)
                  el.subjectId = this.form.id
                  if(el.id){
                    updateOption(el).then(res => {
                      if (res.code === 200) {
                        if(i === this.option.length-1){
                          this.msgSuccess("新增成功");
                          this.open = false;
                          this.getList();
                        }
                      }
                    })
                  }else{
                    addOption(el).then(res => {
                      if (res.code === 200) {
                        if(i === this.option.length-1){
                          this.msgSuccess("新增成功");
                          this.open = false;
                          this.getList();
                        }
                      }
                    })
                  }
                });
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSubject(this.form).then(response => {
              if (response.code === 200) {
                this.option.forEach((el,i) => {
                  el.subjectId = response.data.id
                  addOption(el).then(res => {
                    if (res.code === 200) {
                      if(i === this.option.length-1){
                        this.msgSuccess("新增成功");
                        this.open = false;
                        this.getList();
                      }
                    }
                  })
                });
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
      this.$confirm('是否确认删除问卷调查题目', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSubject(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有问卷调查题目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSubject(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style lang="scss" scoped>
  .fz25{
    font-size: 25px;
  }
  .red{
    color: red;
  }
  .green{
    color: #67C23A;
  }
  .colorh{
    color: #DCDFE6;
  }

  .lh54{
    line-height: 54px;
    cursor: pointer;
  }
  .mb22{
    margin-bottom: 22px;
  }
  .ml20px{
    margin-left: 20px;
  }
  .wd300{
    width: 300px;
  }
  .wd500{
    width: 500px;
  }
  .fz40{
    font-size: 40px;
  }
  //水平居中
  .cscenter{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .hi54{
    height: 54px;
  }
  .bor1{
    border:1px solid #DCDFE6;
    border-radius: 4px;
  }
  .cp{
    cursor: pointer;
  }
  .maxh350{
    max-height: 350px;
    overflow: auto;
  }
  .el-checkbox{
    display: block;
  }
  // .lh36
</style>
