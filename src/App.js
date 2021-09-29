import React,{useState,useEffect,useRef} from 'react';
import {toDataUrl,asciiart} from './external/script';
import './App.css';
import './style.css';
import picture from './Earth_nasa.jpg';
import { ImDownload } from "react-icons/im";

//loading animation

let ctx2;
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
  const canvas = useRef(null)
  const canvas2 = useRef(null)
  let ratio;
  
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
       ascii = new asciiart(image,canvas.current,ctx);
      ascii.toAscii(canvas2.current,ctx2,val);
      setAsci(ascii.imageCell);
      ratio = ascii.img.width/ascii.img.height;
      const uri = canvas2.current.toDataURL();
      setDownload(uri);
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
  <div className='grid'>
    <div className='one'>
    <h1 className='logo'>GenArt.</h1>
    {load ?
     <h1>loading</h1>:
    <div className='container'>
        <canvas ref={canvas} className='canvas'/>
      </div>}
      {load? <h1>loading</h1>:
      <div className='container'>
      <div className='relative'>
          <canvas ref={canvas2}  className='canvas'>
          </canvas>
          <a href={download} download={`${title}.png`} className='btn2 TopLeftParent' type="button"><ImDownload/></a>
      </div>
      </div>}
      
      {load? <h1>loading</h1>:
      <div className='container overflowHidden'>
        <div style={{ lineHeight: `${val}px` }} className='inline'>
        {
          asci.map((p) => {
          if(p.y !== 0){
            if(p.x == 0){
            return <br/>
          }
          return(<p style={{color:`${p.color}`,fontSize:`${val}px`,letterSpacing:`${val*0.6}px`}}>{p.symbol}</p>)
          }
        })}
        </div>
      </div>}
      
    </div>

    <div className='menuBottom bar second'>
        <div className='fileContainer'>
          <input className='file' id='file' type='file'  accept="image/png, image/jpeg" onChange={change}/>
          <label className='fileLabel' for='file'>choose image</label>
          {title? <p className='title'>{title}</p>:''}
        </div>
      <div className='2'>
        <input step='2' className='' type="range" min="8" max="20" onChange={change2}/>
      </div>
      <div className='3'>
        <button className='btn' type="button" onClick={confirm}>set it</button>
      </div>
      
    </div>

  </div>
  )
}

export default App;
