### realdaily

#### Install
* 安装node.js环境
* npm install -g realdaily
  
#### Usage
* (Optional) 按老套路在.zshrc或.bash_profile中添加别名
  * alias rb="realdaily --author username"
* 其他参数说明
  * --since 开始时间，格式 2020-01-02
  * --until 截止时间，格式 2020-01-03

#### Release Notes
* 1.3.0
    修正一些merge commit会产生index on author的冗余log

* 1.2.0
    删除日报中的 commit 连接
  