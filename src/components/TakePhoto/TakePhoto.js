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
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          mediaType: Camera.MediaType.PICTURE,
          encodingType: Camera.EncodingType.JPEG,
          cameraDirection: Camera.Direction.BACK,
          correctOrientation: true,
          targetWidth: 320,
          targetHeight: 400,
      };
      
      navigator.camera.getPicture(this.ftw, this.wtf, opts);
    } else {
      document.getElementById('photo').click();
      document.getElementById('photo').onchange = () => {

        // let input = this.files[0];
        // console.log(input);
        // this.postData(`/upload-image`, {files: [input]});
        var form = document.getElementById('photo-form');
        var data = new FormData();
        var req = new XMLHttpRequest();

        let uploadedFile = document.getElementById('photo').files[0];
        let extension = uploadedFile.name.split('.').pop();
        let filename = Date.now() + localStorage.getItem('id') + '.' + extension;

        data.append('filename', filename);
        data.append('photo', uploadedFile);
        req.open("POST", "http://" + process.env.REACT_APP_API_URL + '/uploadimage', true);
        req.send(data);
        this.ftw("http://" + process.env.REACT_APP_API_URL + "/images/" + filename);
      };
    }
  }

  ftw = (imgURI) => {
    // imgURI = "http://" + process.env.REACT_APP_API_URL + "/images/frog.jpg";
      /*globals createNewFileEntry*/

      // window.resolveLocalFileSystemURL(imgURI, function success(fileEntry) {

      //     // Do something with the FileEntry object, like write to it, upload it, etc.
      //     // writeFile(fileEntry, imgUri);
      //     console.log("got file: " + fileEntry.fullPath);
      //     // displayFileData(fileEntry.nativeURL, "Native URL");

      // }, function () {
      //   // If don't get the FileEntry (which may happen when testing
      //   // on some emulators), copy to a new FileEntry.
      //     createNewFileEntry(imgURI);
      // });
      // // uncomment this for desktop debugging
      // // imgURI = 'R0lGODlhCgAKAKEDANwrGdwsGt0vHv///yH+IkNyZWF0ZWQgYnkgQ2FmZXppbmhvIHdpdGggVGhlIEdJTVAAIfkEAQoAAwAsAAAAAAoACgAAAhKcjweJsDyCg3ImBwTD0G4IDgUAOw==';
      this.props.sendPhoto(imgURI);            
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
 