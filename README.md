### realdaily

#### Install
* 安装node.js环境
* npm install -g realdaily
  
#### Usage
* (Optional) 按老套路在.zshrc或.bash_profile中添加别名
  * alias rb="realdaily --author username"
* 参数说明
  * -a(或--author) 指定作者，必需参数
  * -d(或--date) rb时间，默认为当前日期，格式为MMdd, yyMMdd, yyyyMMdd, MM-dd, yy-MM-dd, yyyy-MM-dd，如0321,200321,或20200321,03-21,20-03-21,2020-03-21，均表示2020年3月21日

#### Release Notes
* 1.3.2  
  删除since, until参数，使用-d 或--date 指定日期，格式为格式为MMdd, yyMMdd, yyyyMMdd, MM-dd, yy-MM-dd, yyyy-MM-dd
* 1.3.0  
  修正一些merge commit会产生index on author的冗余log

* 1.2.0  
  删除日报中的 commit 连接
  