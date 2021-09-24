import React,{useState,useEffect,useRef} from 'react';
import {toDataUrl,asciiart} from './external/script';
import './App.css';
import './style.css';


let ctx2;
let ascii;


function App() {
  const [image, setImage] = useState(null)
  const [val, setVal] = useState(10)
  const [i, setI] = useState(null)
  const [title, setTitle] = useState(null)
  const [f, setF] = useState(10)
  const [url, setUrl] = useState('https://pbs.twimg.com/profile_images/1339044437754859525/zoTo5ZCm_400x400.jpg')
  const [asci, setAsci] = useState([])
  const canvas = useRef(null)
  const canvas2 = useRef(null)
  let ratio;
  
  useEffect(() => {
    console.log(url)
    const mImage = new Image();
    toDataUrl(url,function(dataUrl){ mImage.src= dataUrl})
    mImage.onload = () => setImage(mImage)
    console.log(url)
  },[url])

  useEffect(() => {
    if(image && canvas) {
      const ctx = canvas.current.getContext("2d")
       ctx2 = canvas2.current.getContext("2d")
       ascii = new asciiart(image,canvas.current,ctx);
      ascii.toAscii(canvas2.current,ctx2,val);
      setAsci(ascii.imageCell);
      ratio = ascii.img.width/ascii.img.height;
      console.log(ratio)
    }
  }, [image,val])

  

function change(e){
  const reader = new FileReader()
  if(e.target.files[0]==null){

  }else{
    setTitle(e.target.files[0].name)
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = ()=>{
    setI(reader.result);
    }
  }
}
function change2(e){
  setF(e.target.value)
}
function confirm(){
  setUrl(i);
  console.log(i)
  setVal(parseInt(f))
}



  return (
  <div>
    <div className='fixed bar 1'>
      <div className='fileContainer'>
        <input className='file' id='file' type='file' onChange={change}/>
        <label className='fileLabel' for='file'>choose image</label>
        {title? <p className='title'>{title}</p>:''}
        
      </div>
      <div className='2'>
        <input step='2' className='' type="range" min="7" max="20" onChange={change2}/>
      </div>
      <div className='3'>
        <button className='btn' type="button" onClick={confirm}>Click Me!</button>
      </div>
      
    </div>
  
    <div>
      <div className='container'>
        <canvas ref={canvas} className='canvas'/>
      </div>
      <div className='container'>
        <canvas ref={canvas2}  className='canvas'/>
      </div>
      <div className='container overflowHidden'>
        <div style={{ lineHeight: `${val}px` }} className='inline'>
        {asci.map((p) => {
          if(p.y !== 0){
            if(p.x == 0){
            return <br/>
          }
          return(<p style={{color:`${p.color}`,fontSize:`${val}px`,letterSpacing:`${val*0.6}px`}}>{p.symbol}</p>)
          }
        })}
        </div>
      </div>
    </div>

  </div>
  )
}

export default App;
