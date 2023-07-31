import logo from './logo.svg';
import defimg from './empty.jpg';
import React from "react";
import './App.css';
import { useState, useRef } from 'react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import  axios  from 'axios';
import { Button } from '@material-ui/core';
import { ClipLoader,  BeatLoader, DotLoader, PulseLoader, PropagateLoader,ScaleLoader} from "react-spinners";
import { Divider } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function App() {

  const [url, setUrl] = useState(defimg);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [displayImage, setDisplayImage] = useState(false);
  const [auth, setAuth] = useState(false);
  const inputRef = useRef(null);
  //-----------------------Uploaded Image preview-----------------------
  const getuploaderimg = (e) => {

    console.log(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]))
    setSelectedFile(e.target.files[0])
    console.log("selected file :", selectedFile)
  }

  // ------------ Function to convert base64 to ArrayBuffer---------------
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // -----------------------Flask API call-------------------------------------------
  const uploadimage = () => {
    var result = document.getElementById('result')
    if (selectedFile != null) {
      
      
      setDisplayImage(false)
      setIsLoading(true);
      //data to pass
      var formData = new FormData();
      console.log("selected file when upload", selectedFile)
      formData.append("file", selectedFile);
      axios.post('http://3154-35-193-17-12.ngrok-free.app', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(response => {
      console.log(response);
      var result = document.getElementById('result')
      if (response.data["file_data"] != ""){
        const blob = new Blob([base64ToArrayBuffer(response.data["file_data"])], { type: "image/png" });
        const fileURL = URL.createObjectURL(blob);
        console.log(blob)
        setIsLoading(false);
        setImageUrl(fileURL);
        setDisplayImage(true);
       
        if (response.data["additional_data"]["auth"] == 1) {
          setAuth(true)
          result.style.color = "green"
          result.textContent = "You are Authorized !"
        }
        else {
          setAuth(false)
          result.style.color = "red"
          result.textContent = "You are not Authorized !"
        }
      } else {
        setAuth(false)
        setIsLoading(false);
        result.style.color = "red"
        result.textContent = response.data["additional_data"]["auth"]
      }
    })
      .catch((error) => {
        setIsLoading(false); 
        console.log(error) 
      });
  }
    else {
      result.style.color = "red"
      result.textContent = "Please select an image !"
    }
  }
  const deleteimg = () => {
    console.log("clocked !!!!!!")
    document.getElementById('hh').value =null
    //inputRef.value = null;
    setSelectedFile(null)
    setUrl(defimg)
    setImageUrl("")
    setDisplayImage(false)
    //setAuth(false)
    console.log(selectedFile)
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <div style={{
          backgroundColor: 'white', width: "70%", height: "70%", borderRadius:'5px'
        }}>
          <h4 style={{ color: "black" }}>Upload your QR code image</h4>
          <Button><FontAwesomeIcon icon={faTrash} onClick={deleteimg} /></Button>
          <div style={{
            display: "flex", justifyContent: 'center', alignItems: 'stretch', alignContent: "center"
          }}>
            <div style={{
              width: "50%", height: "70%", display: "flex", borderRight :"4px",
              justifyContent: 'center', alignItems: 'center', flexDirection: 'column', alignContent: "space-around", height: "50%"
            }}>
              <img src={url} style={{ width: "70%", height: "70%" }} id="img"></img>
              <OutlinedInput fullWidth type='file' onChange={getuploaderimg} id='hh'
                style={{ border: "none" }}>
              </OutlinedInput>
              <Button onClick={uploadimage} variant="contained" color='primary' size="large" fullWidth
                style={{ border: "none" ,padding:"15px"}}
              >Upload</Button>
            </div>
            <Divider orientation="vertical" variant="fullWidth" flexItem />

            <div style={{
              width: "50%", height: "70%", display: "flex", borderRight: "4px",
              justifyContent: 'center', alignItems: 'center', flexDirection: 'column', alignContent: "space-around", height: "50%"
            }}>
              <h5 style={{ color: "black" }}>Result</h5>
              {displayImage ? <img src={imageUrl} style={{ width: "50%", height: "50%" }} id="img"></img> : null}
              <h6 fullwidth="true" type='text' id="result"></h6>
              {auth ? <Button variant="contained" color='green' size="large">Go to home page</Button> : null}
              <ScaleLoader color='grey' loading={isLoading}
                size={10} aria-label="Loading Spinner"
                data-testid="loader" margin={3} />
            </div>
          </div>
        </div> 
      </header>
    </div>
  );
}

export default App;
