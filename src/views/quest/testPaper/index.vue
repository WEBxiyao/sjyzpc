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

    <el-table v-loading="loading" :data="questList" @selection-change="handleSelectionChange">
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
      {{scope.row.isDelete==='YES'?'已审核':'未审核'}}
      </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <div v-if="scope.row.isDelete!=='YES'">
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

          >删除</el-button>
          </div>
          <el-button
          v-if="scope.row.isDelete==='YES'"
            size="mini"
            type="text"
            icon="el-icon-pie-chart"
            @click="statistical(scope.row)"
          >统计</el-button>
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

    <!-- 添加或修改问卷调查基础对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题目" prop="title">
          <el-input v-model="form.title" placeholder="请输入题目" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
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
        <el-form-item label="0:发布   1:启用  2:禁用">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
   <!-- 统计 -->
   <el-dialog
     :title="questTitle"
     :visible.sync="statisticalDialog"
     width="70%">
      <el-table
        :data="tableData"
        height="400"
        border
        style="width: 100%">
        <el-table-column
          prop="title"
          label="题目"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="选项"
          >
          <template slot-scope="scope">
            <span :class="scope.row.optionList.length-1>index? 'bili':'bilia'" v-for="(item,index) in scope.row.optionList" :key="index">{{item.content}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="比例"
          width="80">
          <template slot-scope="scope">
            <span :class="scope.row.optionList.length-1>index? 'bili':'bilia'" v-for="(item,index) in scope.row.optionList" :key="index">{{item.scale | fnName}}</span>
          </template>
        </el-table-column>
      </el-table>
      <h3>参与人数：{{count}}人</h3>
      <!-- 统计图容器 -->
      <!-- <div ref="myChart"
      style="width:95%;height: 270px;"></div> -->
     <span slot="footer" class="dialog-footer">
       <el-button @click="statisticalDialog = false">取 消</el-button>
       <el-button type="primary" @click="statisticalDialog = false">确 定</el-button>
     </span>
   </el-dialog>
  </div>
</template>

<script>
import { listQuest, getQuest, delQuest, addQuest, updateQuest, exportQuest,getStatistical } from "@/api/system/quest";
import echarts from "echarts"
export default {
  name: "Quest",
  data() {
    return {
      statisticalDialog:false,
      questTitle:'统计',
      count:0,
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
      // 问卷调查基础表格数据
      questList: [],
      rowSpanArr:[],
      position: 0,
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        content: undefined,
        createId: undefined,
        updateId: undefined,
        isDelete: undefined,
        startTime: undefined,
        endTime: undefined,
        status: undefined,
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

  },
filters: {
  fnName(value){
    return `${value*100}%`;
  }
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
    //统计
    statistical(row){
      getStatistical(row.id).then(res=>{
        console.log(res,"----统计-----")
        this.questTitle=res.data.questTitle
        this.tableData=res.data.subjectList
        this.count=res.data.count

      })
      this.statisticalDialog=true

        // this.getRowSpan()
    },

    // 获取合并的数组
        getRowSpan() {
          this.rowSpanArr = [];
          this.tableData.forEach((item, index) => {
            if (index == 0) {
              this.rowSpanArr.push(1);
              this.position = 0;
            } else {
              if (this.tableData[index].date == this.tableData[index - 1].date) {
                this.rowSpanArr[this.position] += 1; //项目名称相同，合并到同一个数组中
                this.rowSpanArr.push(0);
                this.tableData[index].date = this.tableData[index - 1].date;
              } else {
                this.rowSpanArr.push(1);
                this.position = index;
              }
            }
          });
          console.log( this.rowSpanArr,"---bbbb----bb---")
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          // 只合并区域位置
          if (columnIndex === 0) {
            const _row = this.rowSpanArr[rowIndex];
            console.log( _row,"---9------")
            return {
              rowspan: _row, //行
              colspan: 1 //列
            };
          }
        },
    // drawLine() {
    // 	// 初始化echarts实例
    // 	let myChart = echarts.init(this.$refs.myChart)
    // 	// 配置参数
    // 	myChart.setOption({
    // 		 title: {},
    // 		tooltip : {
    // 			trigger: 'axis',
    // 			axisPointer: {
    // 				type: 'cross',
    // 				label: {
    // 					backgroundColor: '#6a7985'
    // 				}
    // 			}
    // 		},
    // 		legend: {
    // 			data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
    // 		},
    // 		toolbox: {
    // 			feature: {
    // 				saveAsImage: {}
    // 			}
    // 		},
    // 		grid: {
    // 			left: '3%',
    // 			right: '4%',
    // 			bottom: '3%',
    // 			containLabel: true
    // 		},
    // 		xAxis : [
    // 			{
    // 				type : 'category',
    // 				boundaryGap : false,
    // 				data : ['周一','周二','周三','周四','周五','周六','周日']
    // 			}
    // 		],
    // 		yAxis : [
    // 			{
    // 				type : 'value'
    // 			}
    // 		],
    // 		series : [
    // 			{
    // 				name:'邮件营销',
    // 				type:'line',
    // 				stack: '总量',
    // 				areaStyle: {},
    // 				data:[120, 132, 101, 134, 90, 230, 210]
    // 			},
    // 			{
    // 				name:'联盟广告',
    // 				type:'line',
    // 				stack: '总量',
    // 				areaStyle: {},
    // 				data:[220, 182, 191, 234, 290, 330, 310]
    // 			},
    // 			{
    // 				name:'视频广告',
    // 				type:'line',
    // 				stack: '总量',
    // 				areaStyle: {},
    // 				data:[150, 232, 201, 154, 190, 330, 410]
    // 			},
    // 			{
    // 				name:'直接访问',
    // 				type:'line',
    // 				stack: '总量',
    // 				areaStyle: {normal: {}},
    // 				data:[320, 332, 301, 334, 390, 330, 320]
    // 			},
    // 			{
    // 				name:'搜索引擎',
    // 				type:'line',
    // 				stack: '总量',
    // 				label: {
    // 					normal: {
    // 						show: true,
    // 						position: 'top'
    // 					}
    // 				},
    // 				areaStyle: {normal: {}},
    // 				data:[820, 932, 901, 934, 1290, 1330, 1320]
    // 			}
    // 		]
    // 	})
    // },
    /** 查询问卷调查基础列表 */
    getList() {
      this.loading = true;
      listQuest(this.queryParams).then(response => {
        this.questList = response.rows;
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
        content: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined,
        isDelete: undefined,
        startTime: undefined,
        endTime: undefined,
        status: "0"
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
      this.$router.push({
        path: "/quest/paperEdit",query: {
        paperId:"",
        addType:"1"
      }});
      // this.reset();
      // this.open = true;
      // this.title = "添加问卷调查基础";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({
        path: "/quest/paperEdit",query: {
        paperId: row.id,
        addType:"2"
      }});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateQuest(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addQuest(this.form).then(response => {
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
      if(!row.id) return this.msgError("id不能为空");
      this.$confirm('是否确认删除问卷调查基础编号为"' + row.id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          delQuest(row.id);
          this.getList();
          this.msgSuccess("删除成功");
          return
        }).catch(function() {
          this.msgError("删除失败");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有问卷调查基础数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportQuest(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .bili{
    display: flex;
    width: 100%;
    border-bottom: 1px solid #EEEEEE;
    padding: 10px;
  }
  .bilia{
    display: flex;
    width: 100%;
    padding: 10px;
  }
  .el-table .cell{
    padding: 0;
  }
</style>
