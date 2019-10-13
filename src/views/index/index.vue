<template>
    <div class="main">
        <div class="content">
            <el-container style="height: 100%; border: 1px solid #eee">
                <el-aside width="25%" style="background-color: rgb(238, 241, 246)">
                    <div class="chat-user">
                        <el-image :src="headUrl" class="chat-img-big"></el-image>
                        <div v-if="isInputChatName" style="width: auto;position: relative;top: 15px;" @dblclick="isInputChatName = false">{{chatName || '请输入聊天名'}}</div>
                        <el-input  v-if="!isInputChatName" @blur="confirmName" v-model="chatName" style="width: auto;position: relative;top: 10px;" size="mini"></el-input>
                        <el-button class="el-icon-s-fold" style="background-color: rgb(238, 241, 246);border: 0px;padding: 0px;"></el-button>
                    </div>
                    <el-divider class="chat-line"></el-divider>
                    <div class="chat-group-list">
                        <div v-for="item in chatGroupList" :class="{chat_check:!item.isCheck,chat_checked:item.isCheck}" @click="checkChat(item)">
                            <div class="chat-group-item">
                                <el-image :src="item.url" class="chat-img-mini"></el-image>
                                <div class="chat-group-item-data">
                                    <div  class="chat-group-item-data-main">
                                        <p>{{item.chatName || 'hanpi'}}</p>
                                        <p>{{item.date}}</p>
                                    </div>
                                    <p>{{item.content}}</p>
                                </div>
                            </div>
                            <el-divider class="chat-line"></el-divider>
                        </div>
                    </div>
                </el-aside>

                <el-container>
                    <el-header style="text-align: center; font-size: 12px">
                        <span>在线聊天中</span>
                    </el-header>
                    <el-main>
                        <div class="chat-content infinite-list"  v-infinite-scroll="load" infinite-scroll-disabled="disabled" style="overflow:auto">
                            <div v-for="item in chatInfoList" :class="{chat_info_left:!item.self,chat_info_right:item.self}">
                                <p>{{item.sendUser}}：{{item.createTime | formateDate}}</p>
                                <div :class="{chat_info_left_main:!item.self,chat_info_right_main:item.self}">
                                    <el-image :src="item.url" class="chat-img-big"></el-image>
                                    <p class="chat_info_left_main_p">{{item.sendMsg}}</p>
                                </div>
                            </div>
                            <p v-if="noMore"></p>
                        </div>
                        <div>
                            <el-input type="textarea" v-model="chatInfo"></el-input>
                            <el-button type="primary" style="float: right" @click="sendChat">发送</el-button>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>

</template>

<script>
    import { list } from '../../api/chatRecord'
    import { currentTime, parseTime } from '../../utils/index'
    export default {
        name: "index",
        data() {
            const imageUrl = require('../../assets/timg.jpg')
            return {
                uid:'',
                isCheck:false,
                chatName:'',
                headUrl: imageUrl,
                isInputChatName:true,
                chatGroupList:[{
                    url: imageUrl,
                    chatName:'阳光幼儿园中班交流群',
                    content:'我们已经是好友啦，一起来聊天吧',
                    date:currentTime(),
                    isCheck:true,
                }],
                chatInfo:'',
                chatInfoList:[],
                websocket: {},
                search:{
                    pageNo:1,
                    pageSize:10,
                    uid:''
                }
            }
        },
        filters:{
          formateDate(time,cFormat){
              let date = time || new Date()
              let format = cFormat || '{h}:{i}:{s}'
              return parseTime(date,format)
          }
        },
        created() {
            this.uid =  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            this.search.uid = this.uid
            console.log('进入首页----')
            this.getDataList()
        },
        mounted:function(){
            this.initWebSocket();
        },
        computed:{
            noMore () {
                return this.chatInfoList.length >= 20
            },
            disabled () {
                return this.noMore
            }
        },
        destroyed() {
            //页面销毁时关闭
            this.websocket.onclose =  this.websocketClose();
        },
        methods:{
            getDataList(){
                let param = this.search
                list(param).then(res =>{
                    this.chatInfoList = res.data
                    this.chatInfoList.forEach( item => {
                        item.url = this.headUrl
                    })
                })
            },
            confirmName(){
              this.isInputChatName = !this.isInputChatName
            },
            checkChat(item){
                this.chatGroupList.forEach( i=>{
                    i.isCheck = false
                })
                item.isCheck = !item.isCheck
            },
            sendChat(){
                if (this.chatInfo == ''){
                    this.$message.error('还没打字呢');
                }
                this.websocketOpen()
                this.chatInfo = ''
                this.getDataList()
            },
            initWebSocket(){ //初始化
                const uri = "wss://3083.work/socket/messageSocket/"+this.uid;
                this.websocket = new WebSocket(uri);
                var that = this.websocket;
                that.onopen = this.websocketOpen;
                that.onerror = this.websocketError;
                that.onmessage = this.websocketReceiveMessage;
                that.onclose = this.websocketClose;
            },
            websocketOpen() { //发送
                if (this.chatInfo == ''){
                    return
                }
                let param = {
                    msg:this.chatInfo,
                    user:this.chatName || '热心网友'
                }
                console.log(JSON.stringify(param))
                this.websocket.send(JSON.stringify(param).toString());
                console.log("WebSocket连接成功");
            },
            websocketError(e) { //错误
                console.log("WebSocket连接发生错误");
            },
            websocketReceiveMessage(e){ //数据接收
                //处理逻辑
                console.log(e)
               this.getDataList()
            },
            websocketClose(e){ //关闭
                console.log("connection closed (" + e + ")");
            },
            load () {
                // this.chatInfoList.push({
                //     imageUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                //     author:'nmsl',
                //     date:'2019-01-01 19:21:22',
                //     content:'nn',
                //     isSelf:true
                // })
            }
        }
    }
</script>

<style scoped>
    .main{
        background: #D4D6E2;
    }
    @media screen and (min-width: 1200px){
        .content {
            width: 1200px;
            margin: 0px auto;
        }
    }
    @media screen and (max-width: 1200px){
        .content {
            margin: 10px;
        }
    }
    .chat-img-big{
        width: 50px;
        height: 50px;
        border-radius: 50px;
    }
    .chat-img-mini{
        width: 50px;
        height: 40px;
        border-radius: 40px;
    }
    .chat-user{
        margin: 10px;
        display: flex;
        justify-content: space-between;
    }
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    .el-aside {
        color: #333;
    }
    .chat-line{
        padding: 0px;
        margin: 0px;
    }
    .chat-group-item{
        display: flex;
        justify-content:left;
        padding: 10px;
    }
    .chat-group-item-data{
        width: 100%;
        font-size: 12px;
        text-align: left;
        margin-left: 10px;
    }
    .chat-group-item-data p{
        margin-top: 2px;
    }
    .chat-group-item-data-main{
        display: flex;
        justify-content:space-between;
    }
    .chat_info_left,.chat_info_right{
        height: 100px;
    }
    .chat_info_left_main{
        display: flex;
        justify-content: left;
    }
    .chat_info_right_main{
        float:right;
        display: flex;
        flex-direction: row-reverse;
        justify-content: right;
    }
    .chat_info_left_main , .chat_info_right_main{
        margin: 0px 10px;
    }
    .chat_check{
        background: #EEF1F6;
    }
    .chat_checked{
        background: #B3C0D1;
    }
    .chat-content{
        height: 750px;
        background: #EEEEEE;
    }
    .chat_info_left_main_p{
        background: #fff;
        margin: 5px 10px ;
    }

</style>
