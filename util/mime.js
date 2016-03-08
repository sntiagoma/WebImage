var Mime = function(mime){
    this.mime = mime;
    this.mimeImages = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "image/bmp",
        "image/svg+xml",
        "image/x-icon"
    ];
};
Mime.prototype.isImage = function(){
    return !(this.mimeImages.indexOf(this.mime)==(-1))
};

module.exports = Mime;