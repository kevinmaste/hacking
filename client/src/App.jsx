import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
//import {response} from "express";

function App() {
    const [count, setCount] = useState(0)
    const [dataForm,setDateForm]=useState(null)
    const [fileCreated,setFileCreated]=useState(undefined)
    const [result,setResult]=useState(null)
    const [boolean,setBoolean] = useState(false)
    const STATIC_NUMBER =0

    useEffect(()=>{
        getInfos()
    },[STATIC_NUMBER])

    useEffect(()=>{
        if (fileCreated){
            gettingInformationFromTheInfos()
        }
    },[fileCreated])


    const getInfos =async ()=>{
        const response =await  axios.get("http://localhost:8000/api/info")
        setFileCreated(response.status)
    }

    const gettingInformationFromTheInfos = ()=>{

       axios.get("http://localhost:8000/api/read")
            .then(response=> {
                //console.log('data is :',response.data)
                const dataA = response.data
                //console.log('new data is :',dataA)
                //setDateForm(response.data)
                //setBoolean(true)

                axios.post(`http://localhost:8000/api/send/`,{dataA})
                    .then(response=>setResult(response.data?.message))
                    .catch(e=>console.log('error :',e))


            })
            .catch(e=>console.log('error is',e))
    }


    return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
          {result && <p hidden={true}>${result}</p>}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
