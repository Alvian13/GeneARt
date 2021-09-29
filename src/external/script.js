export function toDataUrl(src,callback){
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = src ;
  let dataUrl;
  console.log(image)
  image.onload = function(){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    //this.crossOrigin = 'anonymous';
    console.log(this)
    ctx.drawImage(this,0,0);
    dataUrl = canvas.toDataURL('image/jpeg');
    //return dataUrl;
    callback(dataUrl)
  }
}

export class cell{
  constructor(x,y,symbol,color){
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }
  draw(ctx,size){
    const color = this.color
    ctx.fillStyle = color;
    ctx.font = `${size}px monospace`;
    ctx.fillText(this.symbol, this.x, this.y);
  }
}

export class asciiart{
  imageCell;
  constructor(img,canvas,ctx){
    
    this.img = img;
    this.canvas = canvas
    this.ctx = ctx
    this.imageCell = []
    this.resizeImage(this.img,this.canvas);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    //this.img.crossOrigin = 'Anonymous';
    
    this.pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
  }
  resizeImage(img, canvas){
    if(window.innerHeight > window.innerWidth){
      canvas.width = window.innerWidth*0.8;
      if(img.height>img.width){
        canvas.height = window.innerHeight*0.6;
        canvas.width = (img.width/img.height)*(canvas.height);
        //ctx.drawImage(img,0,0,canvas.width,canvas.height);
      }else{
        canvas.height = (img.height/img.width)*canvas.width;
        //ctx.drawImage(img,0,0,canvas.width,canvas.height);
      }
    }else{
      canvas.width = window.innerWidth*0.4;
      if(img.height>img.width){
        canvas.height = window.innerHeight*0.8;
        canvas.width = (img.width/img.height)*(canvas.height);
        //ctx.drawImage(img,0,0,canvas.width,canvas.height);
      }else{
        canvas.height = (img.height/img.width)*canvas.width;
        //ctx.drawImage(img,0,0,canvas.width,canvas.height);
      }
    }
  }
  convertToSymbol(gray){
    if(gray>250) return '@';
    else if(gray<250 && gray>220) return '#';
    else if(gray<220 && gray>190) return 'a';
    else if(gray<190 && gray>160) return 'n';
    else if(gray<160 && gray>130) return '&';
    else if(gray<130 && gray>100) return '^';
    else if(gray<100 && gray>70) return '*';
    else if(gray<70 ) return '.';
    else return '.';
  }
  scanImage(res){
    for(let y=0; y<this.pixels.height; y+=res){
      for(let x=0; x<this.pixels.width; x+=res){
        const i =((y*this.pixels.width)+x)*4
        //if(this.pixels.data[i+3]>128){
          const red = this.pixels.data[i];
          const green = this.pixels.data[i+1]
          const blue = this.pixels.data[i+2]
          const gray = (red+green+blue)/3;
          const color = `rgb(${red},${green},${blue})`;
          const symbol = this.convertToSymbol(gray);
          this.imageCell.push(new cell(x,y,symbol,color))
        //}
      }
    }
  }
  makeGray(canvas,ctx,res){
    //let pixel = this.pixels.data;
    this.resizeImage(this.img,canvas);
    ctx.drawImage(this.img,0,0,canvas.width,canvas.height);
    for(let y=0; y<this.pixels.height; y+=res){
      for(let x=0; x<this.pixels.width; x+=res){
        const i =((y*this.pixels.width)+x)*4
        const gray = (this.pixels.data[i]+this.pixels.data[i+1]+this.pixels.data[i+2])/3;
        this.pixels.data[i] = gray;
        this.pixels.data[i+1] = gray;
        this.pixels.data[i+2] = gray;
      }
    }
    ctx.putImageData(this.pixels,0,0);
  }

   toAscii(canvas,ctx,size){
    this.scanImage(size);
    this.resizeImage(this.img,canvas);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    for(let i=0; i<this.imageCell.length; i++){
      this.imageCell[i].draw(ctx,size);
    }
  }

}