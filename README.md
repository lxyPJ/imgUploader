# imgUploader.js

HTML5多图片上传插件

## 特性

- 支持多图片上传;
- 支持图片压缩(根据上传图片的大小合理选择压缩质量)
- 提供文件读取的精确流程控制接口

## 使用方法

#### 使用读取文件流程控制函数

```
<form id="imgFile" name="imgFile">
    <input name="image" type="file" multiple id="upload" class="upload-input" />
</form>

<script type="text/javascript">
	document.getElementById('upload').addEventListener('change',function(){
        var uploader = new imgUploader(this.files);
        /* 开始读取文件 */
        uploader.on('start',function(){
            //你的代码
        });
        /* 每读取完一张图片 */
        uploader.on('progress',function(img){
            //img为当前读取到的图片，是一个img标签
        });
        /* 文件读取结束 */
        uploader.on('finish',function(){
            //uploader.getDataUrl() 改方法可以获取压缩后的图片base64字符串列表
            var dataUrlList = uploader.getDataUrl();
        });
    },false);
</script>
```

#### 使用upload(cb)回调函数

```
<form id="imgFile" name="imgFile">
    <input name="image" type="file" multiple id="upload" class="upload-input" />
</form>

<script type="text/javascript">
	document.getElementById('upload').addEventListener('change',function(){
		var uploader = new imgUploader(this.files);
		uploader.upload(function(){
		    //uploader.getDataUrl() 改方法可以获取压缩后的图片base64字符串列表
		    var dataUrlList = uploader.getDataUrl();
		});
	});
</script>
```

