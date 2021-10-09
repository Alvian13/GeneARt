import React,{useState,useEffect,useRef} from 'react';
import {toDataUrl,asciiart} from './external/script';
import './App.css';
import './style.css';
import picture from './Earth_nasa.jpg';
import { ImDownload } from "react-icons/im";

//loading animation



let ctx2;
let ctx3;
let ascii;


function App() {
  const [image, setImage] = useState(null)
  const [val, setVal] = useState(10)
  const [i, setI] = useState(null)
  const [title, setTitle] = useState(null)
  const [f, setF] = useState(10)
  const [url, setUrl] = useState(picture)
  const [asci, setAsci] = useState([])
  const [load,setLoad] = useState(false)
  const [download,setDownload] = useState()
  const [download2,setDownload2] = useState()
  const canvas = useRef(null)
  const canvas2 = useRef(null)
  const canvas3 = useRef(null)
  let ratio;
  
  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=b442862a-23e3-4920-8839-dae0b6263735";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  
  useEffect(() => {
    setLoad(true);
    const mImage = new Image();
    toDataUrl(url,function(dataUrl){ mImage.src= dataUrl})
    mImage.onload = () => setImage(mImage)
    setLoad(false);
  },[url])

  useEffect(() => {
    if(image && canvas) {
      setLoad(true);
      const ctx = canvas.current.getContext("2d")
       ctx2 = canvas2.current.getContext("2d")
       ctx3 = canvas3.current.getContext("2d")
       ascii = new asciiart(image,canvas.current,ctx);
      ascii.toAscii(canvas2.current,ctx2,val);
      ascii.toRect(canvas3.current,ctx3,val);
      setAsci(ascii.imageCell);
      ratio = ascii.img.width/ascii.img.height;
      const uri = canvas2.current.toDataURL();
      const uri2 = canvas3.current.toDataURL();
      setDownload(uri);
      setDownload2(uri2)
      setLoad(false);
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
  console.log(canvas2.current)
  setVal(parseInt(f))
}




  return (
  <div >
     <h1 className='logo'>GenArt.</h1>
    <div className='flex'>
    {load ?
     <h1>loading</h1>:
    <div className='container'>
        <canvas ref={canvas} className='canvas'/>
      </div>}

      <div className='ads'>
        <div  id="amzn-assoc-ad-b442862a-23e3-4920-8839-dae0b6263735"></div>
      </div>
    
      <div className='barBox'>
        <div className='fileContainer'>
          <input className='file' id='file' type='file'  accept="image/png, image/jpeg" onChange={change}/>
          <label className='fileLabel' for='file'>choose image</label>
          {title? <p className='title'>{title}</p>:''}
        </div>
      <div className='2'>
        <input step='2' className='' type="range" min="5" max="30" onChange={change2}/>
      </div>
      <div className='3'>
        <button className='btn' type="button" onClick={confirm}>set it</button>
      </div>
      
    </div>

      {load? <h1>loading</h1>:
      <div className='container'>
      <div className='relative'>
          <canvas ref={canvas2}  className='canvas'>
          </canvas>
          <a href={download} download={`${title}ascii.png`} className='btn2 TopLeftParent' type="button"><ImDownload/></a>
      </div>
      </div>}
      
      {load? <h1>loading</h1>:
      <div className='container'>
      <div className='relative'>
          <canvas ref={canvas3}  className='canvas'>
          </canvas>
          <a href={download2} download={`${title}grid.png`} className='btn2 TopLeftParent' type="button"><ImDownload/></a>
      </div>
      </div>}
    
      
    </div>

  </div>
  )
}

export default App;
