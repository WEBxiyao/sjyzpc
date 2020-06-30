<template>
  <div class="app-container page">
    <div style="width:1000px; background-color:#fff;margin: 0 auto; padding:30px 0;padding-bottom:200px;">
      <div class="textInput">
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="标题" prop="noticeTitle">  
              <el-input
                v-model="queryParams.title"
                placeholder="请输入素材父标题"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="素材分类" prop="type">
              <el-select v-model="queryParams.type" placeholder="请选择素材分类" clearable size="small">
                <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.dictLabel" :value="item.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布类型" prop="publishType">
              <el-select v-model="queryParams.publishType" placeholder="请选择发布类型" clearable size="small">
                <el-option v-for="(item, index) in publishTypeOptions" :key="index" :label="item.dictLabel" :value="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="fmzy-text">封面和摘要</div>
          <div class="fmAndZy">
            <div class="fmAndZy-uploader">
              <el-upload
              class="avatar-uploader"
              :action="uploadImgUrl"
              name="file"
              :headers="headers"
              :show-file-list="false"
              :on-success="quillImgSuccess"
              :on-error="uploadError"
              :before-upload="quillImgBefore"
              accept='.jpg,.jpeg,.png,.gif'
            >
              <img v-if="queryParams.weixinimg" :src="queryParams.weixinimg" class="avatar" style="width:360px">
              <i v-else class="el-icon-plus avatar-uploader-icon fengmian">选择封面{{queryParams.weixinimg}}</i>
            </el-upload>
            </div>
            <div>
              <el-input
                style="width:400px"
                type="textarea"
                :rows="8"
                maxlength="300"
                show-word-limit
                placeholder="文章摘要，帮助读者快速了解内容。"
                v-model="queryParams.memo">
              </el-input>
            </div>
          </div>
          <div class="yuanchuang">
            <!-- <div class="yuanchuang-link">
              <el-checkbox v-model="checked" class="">原文链接</el-checkbox>
              <el-input
                style="300px"
                v-show="checked"
                v-model="queryParams.noticeTitle"
                placeholder="请输入原文链接"
                clearable
                size="small"
              />
            </div> -->
            <div class="yuanchuang-title">推文对象</div>
            <el-tree show-checkbox :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
      </div>
      <div class="yuanchuang-title" style="margin-left:100px">推文</div>
      <div class="fuwenben">
        <div class="content">
          <div class="ql-editor" v-html="queryParams.content"></div>
        </div>
        <!-- <Editor v-model="queryParams.content" /> -->
      </div>
      
      

      <div class="button-footer">
        <el-button class="save">预览</el-button>
        <el-button type="primary" class="save" @click="save">保存</el-button>
        <el-button type="primary" class="save">提交审核</el-button>
      </div>
    </div>
    
    

  </div>
</template>

<script>
import { exporttMaterial,materialedit } from "@/api/material";
import Editor from '@/components/Editor';
import { getToken } from '@/utils/auth'
import axios from 'axios'
export default {
  components: {
    Editor
  },
  data() {
    return {
      saveType:"",
      uploadImgUrl: "http://localhost/system/material/uploadImg", // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      publishTypeOptions:[],
      typeOptions:[],
      queryParams:{},
      data: [{
        label: '组织机构1',
        children: [{
          label: '办公室1',
          children: [{
            label: '人员1'
          }]
        }]
      }, {
        label: '组织机构2',
        children: [{
          label: '办公室1',
          children: [{
            label: '人员1'
          }]
        }, {
          label: '办公室2',
          children: [{
            label: '人员1'
          }]
        }]
      }, {  
        label: '组织机构3',
        children: [{
          label: '办公室1',
          children: [{
            label: '人员1'
          }]
        }, {
          label: '办公室2',
          children: [{
            label: '人员1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      farterinpru:"",
      linktext:"这是链接",
      checked:false,
      form:{
        noticeContent:""
      },
      textarea:"",
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  created() {
    if(this.$route.query.addType){
      this.saveType = this.$route.query.addType
    }
    let data = this.$store.getters.materialData
    if(data){
      this.queryParams = data
    }
    this.getDicts("material_class").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("release_type").then(response => {
      this.publishTypeOptions = response.data;
    });
  },
  methods: {
    // 富文本图片上传前
    quillImgBefore(file) {
      // console.log(file)
      let fileType = file.type;
			if(fileType === 'image/jpeg' || fileType === 'image/png'){
				return true;
			}else {
				this.$message.error('请插入图片类型文件(jpg/jpeg/png)');
				return false;
			}
    },

    quillImgSuccess(res, file) {
      this.queryParams.weixinimg = file.response.data;
      this.$forceUpdate();
    },
    // 富文本图片上传失败
    uploadError() {
      // console.log("失败")
      // loading动画消失
      this.$message.error("图片插入失败");
    },
    handleNodeClick(){

    },
    beforeAvatarUpload(file){
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      }
    },
    //保存
    save(){
      console.log(this.queryParams)
      let aaa = {
        type:1,//
        title:"式咖啡机萨科",//
        content:"<h1>111111</h1>",//
        fileIds:"",
        publishTime:"",//
        publishType:"",
        publishStatus:"",
        publisher:"",
        memo:"",
        img:"",
        weixinimg:"",
        contentSourceUrl:"",
        mediaId:"",
        aUid:""
      }
      console.log(this.queryParams)
      this.queryParams.aa = ""
      if(this.saveType == 1){
        axios({
            method:'post',
            url:'http://localhost/system/material/add',
            data:this.queryParams,
            headers:{
              'Authorization':'Bearer ' + getToken(),
              'Content-Type':'application/json;charset=utf-8'
            }
        }).then(res =>{          //这里使用了ES6的语法
            if(res.status === 200 && res.data.code === 200){
              this.$router.push({ path: "/material/materialadd"});
            }
        })
      }else{
        axios({
            method:'post',
            url:'http://localhost/system/material/edit',
            data:this.queryParams,
            headers:{
              'Authorization':'Bearer ' + getToken(),
              'Content-Type':'application/json;charset=utf-8'
            }
        }).then(res =>{          //这里使用了ES6的语法
            if(res.status === 200 && res.data.code === 200){
              this.$router.push({ path: "/material/materialadd"});
            }
        })
      }
    },
    handleRemove(file) {
        console.log(file);
      },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container{
  padding: 0;
}
.page{
  background-color: #f5f5f5;
}
.yuanchuang{
  margin: 0 auto;
  width: 800px;
  &-title{
    font-size: 16px;
    font-weight: 600;
    margin: 15px 0;
  }
  &-link{
    margin: 15px 0;
    display: flex;
    span{
      margin-left: 20px;
      font-size: 14px;
      color: #409EFF;
    }
  }
}
.fengmian{
  font-size: 16px !important;
  color: #409EFF !important;
}
.button-footer{
  border-top: 1px solid #f5f5f5;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  margin: 0 auto;
  width: 1000px;
  padding: 20px 100px;
  .save{
    float: right;
    margin-left: 10px;
  }
}
.ql-editor {
    overflow-x: hidden;
}
.fuwenben{
  margin: 0 auto;
  width: 830px;
  // height: 800px;
}
.content{
  border: 1px solid #909399;
  color: black;
  height: 1000px;
  img{
    max-width: 800px;
  }
}
.fmzy-text{
  width: 800px;
  margin: 0 auto;
  font-weight:600;
  margin-bottom: 20px;
}
.fmAndZy{
  width: 800px;
  margin: 0 auto;
  display: flex;
  &-uploader{
    width: 50%;
  }
}
.avatar-uploader-icon{
  width:360px !important;
  border: 1px dashed #d9d9d9;

}
.avatar-uploader{ 
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.elinput{
  width: 300px;
}
.textInput{
  width: 800px;
  margin:0 auto;
  padding: 10px;
  p{
    height: 36px;
    line-height: 36px;
    margin: 0;
    padding: 0;
    font-weight: 600;
  }
}
.el-form-item__label{
  color: #000000 !important;
}
</style>