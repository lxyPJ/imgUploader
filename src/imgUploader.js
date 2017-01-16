+function(window){
    var imgUploader = function(files){
        var self = this;
        self.fileQuantity = files.length;
        self.eventList = [];
        self.eventFn = {
            'start':null,
            'progress':null,
            'finish':null
        };
        self.initEventProgress = 0;
        self.on = function(eventName,cb){ //订阅流程控制函数
            self.eventList.push(eventName);
            self.eventFn[eventName] = cb;
            window.setTimeout(function(){
                self.initEventProgress += 1;
                if(self.eventList.length == self.initEventProgress){
                    self.handle(self,files);
                }
            },0);
        };
        self.getCanvasImg = function(){
            return imgUploader.canvasImg;
        };
        self.getDataUrl = function(){
            return imgUploader.dataUrl;
        };
        self.getBlob = function(){
            return imgUploader.blob;
        };
        self.getFormData = function(formEle){
            var formdata = new FormData(formEle);
            var blobList = self.getBlob();
            for(var i=0; i<blobList.length; i++){
                formdata.append('file-' + i,blobList[i]);
            }
            return formdata;
        };
        self.upload = function(cb){
            self.handle(self,files,cb);
        };
    };
    imgUploader.img = [];
    imgUploader.canvasImg = [];
    imgUploader.blob = [];
    imgUploader.dataUrl = [];
    imgUploader.prototype.handle = function(self,files,cb){
        self.eventFn['start'] && self.eventFn['start']();
        if(files.length == 0){
            self.eventFn['finish'] && self.eventFn['finish']();
            return;
        }
        for(var i=0; i<files.length; i++){
            self.imgHandle(self,i,files[i],self.getImgQuality(files[i]),cb);
        }
    }
    imgUploader.prototype.getImgQuality = function(file){
        var quality = 0.1;
        if (file.size > 2000 * 1024) {
            quality = quality * 1.5;
        }else if(file.size <= 2000 * 1024 && file.size > 1000 * 1024) {
            quality = quality * 2;
        }else if(file.size <= 1000 * 1024 && file.size > 500 * 1024) {
            quality = quality * 3;
        }else if(file.size <= 500 * 1024 && file.size > 200 * 1024) {
            quality = quality * 5;
        }else if(file.size <= 200 * 1024 && file.size > 50 * 1024) {
            quality = quality * 7;
        }else {
            quality = quality * 10;
        }
        return quality;
    };
    imgUploader.prototype.imgHandle = function(self,i,file,quality,cb){ //预览图片并设置要上传至服务器的文件数据
        var imgReader = new FileReader();
        imgReader.onload = function(){
            var url = this.result;
            var img = self.canvasCompress(self,i,url,quality,cb);
            self.eventFn['progress'] && self.eventFn['progress'](img);
        };
        imgReader.readAsDataURL(file);
    };
    imgUploader.prototype.canvasCompress = function(self,n,url,quality,cb){
        var img = new Image();
        var canvas = document.createElement('canvas');
        img.src = url;
        img.onload = function(){
            var w = img.naturalWidth,
                h = img.naturalHeight;
            var data = url;
            if(!!canvas || !!canvas.getContext){
                var ctx = canvas.getContext('2d');
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img,0,0,w,h,0,0,w,h);
                if(quality < 1){
                    data = canvas.toDataURL("image/jpeg",quality);
                }
                imgUploader.dataUrl.push(data);
                data = data.split(',')[1];
                data = window.atob(data);   
                var ia = new Uint8Array(data.length);   
                for (var i = 0; i < data.length; i++) {   
                    ia[i] = data.charCodeAt(i);   
                };   
                //canvas.toDataURL 返回的默认格式就是 image/png   
                var blob = new Blob([ia], {   
                    type: "image/jpeg"  
                });
                imgUploader.blob.push(blob);
                imgUploader.canvasImg.push(canvas);
            }else{
                console.log('该浏览器不支持canvas');
                imgUploader.dataUrl.push(data);
            }
            imgUploader.img.push(img);
            if((n+1) == self.fileQuantity){
                self.eventFn['finish'] && self.eventFn['finish']();
                cb && cb(imgUploader.img);
            }
        };
        return img;
    };
    typeof(module) !== 'undefined' && module.exports ? module.exports = imgUploader : window.imgUploader = imgUploader;
}(window);