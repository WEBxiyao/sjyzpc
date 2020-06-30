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
              :multiple="true"
              name="file"
              :headers="headers"
              :show-file-list="false"
              :on-success="quillImgSuccess"
              :on-error="uploadError"
              :before-upload="quillImgBefore"
              accept='.jpg,.jpeg,.png,.gif'
              :with-credentials="true"
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
        <Editor v-model="queryParams.content" />
      </div>



      <div class="button-footer">
       <!-- <el-button class="save">预览</el-button> -->
        <el-button type="primary" class="save" @click="save(1)">保存</el-button>
        <el-button type="primary" class="save" @click="save(2)">提交审核</el-button>
      </div>
    </div>



  </div>
</template>

<script>
import { exporttMaterial,materialedit,newsMaterialAdd,exportUpload} from "@/api/material";
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
      media_Id:"",
      uploadImgUrl: "/system/material/uploadCoverImg", // 上传的图片服务器地址
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
    this.getDicts("release_type").then(response => {
      console.log("--------rrr---------",response)
      this.publishTypeOptions = response.data;
      if(data){
        let index=this.publishTypeOptions.findIndex(v=>v.dictValue==data.publishType)
        if(index==-1) return
        data.publishType=this.publishTypeOptions[index].dictLabel
        this.queryParams = data
      }
    });
    if(this.$route.query.addType){
      this.saveType = this.$route.query.addType
    }
    let data = this.$store.getters.materialData
    this.getDicts("material_class").then(response => {
      this.typeOptions = response.data;
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
      console.log(res,file,"---mmmm-----")
      if(res.code===200){
        this.queryParams.weixinimg = res.data.url;
        this.media_Id=res.data.mediaId
        this.$forceUpdate();
      }else{
        this.$message.error(res.msg);
      }


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
    save(type){
      console.log(this.queryParams)
      console.log(this.queryParams)
       console.log(this.queryParams,"-------fffffff------------")
       let obj={
         ...this.queryParams,
         publishStatus:type,
         img:this.media_Id
       }
      if(this.saveType == 1){
        newsMaterialAdd(obj).then(res=>{
         if(res.code===200){
           this.$router.push({ path: "/material/materialadd"})
         }
        })
      }else{
        materialedit(obj).then(res=>{
          if(res.code===200){
            this.$router.push({ path: "/material/materialadd"})
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
.fuwenben{
  margin: 0 auto;
  width: 800px;
}
.fmzy-text{
  width: 800px;
  margin: 0 auto;
  font-weight:600;
  // margin-top: 100px;
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
// .fmAndZy-uploader{
//   width: 146px;
//   height: 146px;
//   overflow: hidden;
// }
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
