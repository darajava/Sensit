import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Loading from '../Loading/Loading';
import Toast from '../Toast/Toast';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import { decode } from '../../utils/utils';

class TakePhoto extends React.Component {

  constructor() {
    super();

    this.state = {
      
    };
  }

  componentDidMount() {
    let app = {
        
    };

    this.init();

  }

  init = () => {
    // uncomment this for desktop debugging
    // document.getElementById('btn').addEventListener('click', app.ftw);
    document.getElementById('btn').addEventListener('click', this.takephoto);
  }

  takephoto = () => {
    /*globals Camera*/
    if (typeof Camera !== 'undefined') {
      let opts = {
          quality: 80,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          mediaType: Camera.MediaType.PICTURE,
          encodingType: Camera.EncodingType.JPEG,
          cameraDirection: Camera.Direction.BACK,
          correctOrientation: true, // Fixes orientation quirks
          targetWidth: 320,
          targetHeight: 400,
      };
      
      navigator.camera.getPicture(this.ftw, this.wtf, opts);
    } else {
      document.getElementById('photo').click();
      document.getElementById('photo').onchange = () => {
        this.uploadPhoto();
      };
    }
  }

  ftw = (imageURI) => {

    /*globals FileUploadOptions*/
    /*globals FileTransfer*/

    var options = new FileUploadOptions();

    options.fileKey     = "photo";
    options.fileName    = imageURI.substr(imageURI.lastIndexOf("/")+1);
    options.mimeType    = "image/jpeg";
    options.httpMethod  = "POST";
    options.chunkedMode = false;

    let extension = options.fileName.split('.').pop();
    let filename = Date.now() + '-' + localStorage.getItem('id') + '.' + extension;

    options.params = {
      filename,
    };

    var fileTransfer = new FileTransfer();

    fileTransfer.upload(imageURI, ("http://" + process.env.REACT_APP_API_URL + "/uploadimage"), uploadComplete, uploadError, options);

    let uploadComplete = (result) => {
      console.log("Code = " + result.responseCode);
      console.log("Response = " + result.response);
      console.log("Sent = " + result.bytesSent);
    }

    let uploadError = (error) => {
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
    }
    
    this.props.sendPhoto("http://" + process.env.REACT_APP_API_URL + "/images/" + filename);
  }

  uploadPhoto = () => {
    // let input = this.files[0];
    // console.log(input);
    // this.postData(`/upload-image`, {files: [input]});
    var form = document.getElementById('photo-form');
    var data = new FormData();
    var req = new XMLHttpRequest();

    let uploadedFile = document.getElementById('photo').files[0];
    let extension = uploadedFile.name.split('.').pop();
    let filename = Date.now() + '-' + localStorage.getItem('id') + '.' + extension;

    data.append('filename', filename);
    data.append('photo', uploadedFile);
    req.open("POST", "http://" + process.env.REACT_APP_API_URL + '/uploadimage', true);
    req.send(data);
    
    this.props.sendPhoto("http://" + process.env.REACT_APP_API_URL + "/images/" + filename);
  }

  render() {

    return (
      <div>
        <div>
            <span id="btn">
              <Glyphicon glyph="camera" />
            </span>
            <form encType="multipart/form-data" styleName="hide" action={"http://" + process.env.REACT_APP_API_URL + '/uploadimage'} method="post" id='photo-form'>
              <input type="file"
                id="photo"
                name="photo"
                accept="image/*" />
            </form>
        </div>
      </div>
    );
  }
}

export default CSSModules(TakePhoto, styles, {allowMultiple: true});
 