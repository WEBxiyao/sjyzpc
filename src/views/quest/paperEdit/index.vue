<template>
  <div class="app-container">
    <!-- 添加或修改问卷调查题目对话框 -->
    <div class="wd1000 pad30 bgh pagess" style="overflow-y:auto">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="标题" prop="title" class="wd300">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="描述" prop="describe" class="wd300">
            <el-input v-model="form.dic" placeholder="请输入描述" />
          </el-form-item>
        </el-form>
        <div class=" pad30 disflex fdCloumn">
          <div v-for="(item,index) in optionList" :key="index" class="mb22 pad30 bgff">
              <p>{{item.title}}</p>
              <el-checkbox-group v-model="item.checkList" class="mb22">
                <el-checkbox :label="'选项'+getABC(index)+'.'+item1.countent" v-for="(item1,index) in item.options" :key="index"></el-checkbox>
              </el-checkbox-group>
              <div class="el-icon-delete cscenter color6 pt20 bordert cp" @click="delquest(item)">删除</div>
          </div>
          <div @click="toAddquest" class="lh54 bor1 cscenter bgff">添加题目</div>
           <!-- 占位符 -->
        <div style="height:80px;"></div>
        </div>
        <div slot="footer" class="dialog-footer cscenter weizi">
            <el-button type="primary" @click="submitclick">确 定</el-button>
            <el-button @click="close">取 消</el-button>
        </div>
    </div>

    <!-- 选择表格 -->
    <el-dialog title="选择题目" :visible.sync="open" width="800px" append-to-body>
        <el-table v-loading="loading" :data="subjectList" @selection-change="handleSelectionChange" height="500">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat"/>
        <el-table-column label="是否必填(0:否 1:是)" align="center" prop="isRequired" />
        <el-table-column label="创建人" align="center" prop="createId" />
        <el-table-column label="修改人" align="center" prop="updateId" />
        <el-table-column label="是否删除(0:否  1:是)" align="center" prop="isDelete" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handlePreview(scope.row)"
                    v-hasPermi="['system:subject:edit']"
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
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="open = false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
 import { listQuest, getQuest, delQuest, addQuest, updateQuest, exportQuest } from "@/api/system/quest";
import { listSubject, getSubject, delSubject, addSubject, updateSubject, exportSubject, unionQuestID, getQuestInfo } from "@/api/system/subject";
import { getSubjectInfo, listOption, getOption, delOption, addOption, updateOption, exportOption } from "@/api/system/subject";

export default {
  name: "Subject",
  data() {
    return {
      loading:false,
      paperId:"",
      addType:1,
        ids:[],
        // multipleSelection:[],
        quest:[],
        total:0,
        open:false,
        subjectList:[],
        queryParams:{},
        optionList:[],
        form: {
            title:"",
            dic:""
        },
        // 表单校验
        rules: {
        }
    };
  },
  created() {
    console.log(this.$route.query.addType,"kkkkkkk",this.$route.query.paperId)
    if(!this.$route.query.addType){
      this.$message({
          message: '参数错误',
          type: 'warning'
        });
       this.$router.go(-1)
       return
    }
    this.addType=this.$route.query.addType
    if(this.$route.query.addType==2){
      //这个地方是修改
      if(this.$route.query.paperId){
          this.paperId = this.$route.query.paperId
          this.getquestData()
          return
      }
      this.$message({
          message: '参数错误',
          type: 'warning'
        });
       this.$router.go(-1)
    }else{
       //这个地方是新增
    }
  },
  methods: {
    close(){
      console.log("llll")
      this.$router.push({
       path: "/quest/testPaper"
        
      })
    },
    //删除问题
    delquest({id}){
      console.log("-----这个地方删除问题------")
      this.optionList.forEach((el,index) => {
        if(id === el.id){
          this.optionList.splice(index)
        }
      });
    },
    //确定保存问卷
    submitclick(){
      console.log(this.form,"----1--------")
      this.form.subids = []
      this.optionList.forEach(el => {
        this.form.subids.push(el.id)
      });
      console.log(this.form)
      if(this.addType==1){
        console.log("新增")
          unionQuestID(this.form).then(response => {
            console.log(response)
            if(response.code === 200){
              this.msgSuccess("新增成功");
              this.$router.push({path: "/quest/testPaper"})
            }
          })
      }else{
        this.form.id=this.paperId
        console.log("修改",this.form,this.paperId)
        updateQuest(this.form).then(res=>{
          console.log(res,"----修改成功--------")
          if(res.code === 200){
              this.msgSuccess("修改成功");
              this.$router.push({path: "/quest/testPaper"})
            }
        }).catch(err=>{
          console.log(err,"修改失败")
        })
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
    handleSelectionChange(val){
        console.log(val)
        // this.optionList = val
        this.ids = val.map(item => item.id)
        // this.$forceUpdate();
    },
    getquestData(){
      getQuestInfo({id:this.paperId}).then(response => {
        console.log(response,"lllll")
        if(response.code === 200){
          this.form = response.data
          // this.optionList.checkList = []
          this.optionList = response.data.subjectVos
          this.optionList.forEach(el => {
            el.checkList = []
          });
          // console.log(this.optionList)
        }
      })
    },
    submitForm(){
        this.ids.forEach(el => {
          getSubjectInfo({id:el}).then(response => {
            console.log(response)
            response.data.checkList = []
            this.optionList.push(response.data)
          })
        });
        console.log(this.optionList)
        this.open = false
    },
    /** 查询问卷调查题目列表 */
    getList() {
      this.loading = true;
      listSubject(this.queryParams).then(response => {
        this.subjectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    toAddquest(){
        this.open = true
        this.getList()
    }
  }
};
</script>
<style lang="scss" scoped>
.pad30{
    padding: 30px;
}
  .mg20{
    margin: 20px;
  }
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
  .color6{
    color:#606266;
  }
  .bgff{
    background-color: #fff;
  }
  .bgh{
    background: rgb(244, 244, 245);
  }
  .lh54{
    line-height: 54px;
    cursor: pointer;
  }
  .mb22{
    margin-bottom: 22px;
  }
  .pt20{
    padding-top: 20px;
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
  //垂直水平居中
  .cscenter{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .weizi{
     position:fixed;
    bottom:20px;
    width:940px;
  }
  .fdCloumn{
      flex-direction: column;
  }
  .hi54{
    height: 54px;
  }
  .bor1{
    border:1px solid #DCDFE6;
    border-radius: 4px;
  }
  .bordert{
    border-top:1px solid #DCDFE6;
  }
  .cp{
    cursor: pointer;
  }
  .maxh350{
    max-height: 650px;
    overflow: auto;
  }
  .el-checkbox{
    display: block;
  }
  .wd1000{
      width: 1000px;
      margin: 0 auto;
  }
  .pagess{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
.disflex{
  display: flex;
}
.mg0auto{
  margin: 0 auto;
}
</style>
