import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjl9z3ijik1iDIerHvVacRg50mLuvo4Yw",
  authDomain: "file-upload-hhexio.firebaseapp.com",
  projectId: "file-upload-hhexio",
  storageBucket: "file-upload-hhexio.appspot.com",
  messagingSenderId: "80406195088",
  appId: "1:80406195088:web:53e5e180e8c3141f09e115"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    console.log('Files: ', files)
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', 
        snapshot => {
          const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
          const block = blocks[index].querySelector('.preview-info-progress')
          block.textContent = percentage
          block.style.width = percentage
        },
        error => {
          console.log(error)
        },
        () => {
          task.snapshot.ref.getDownloadURL().then(url => {
            console.log('Download URL', url)
          })
        }
      )
    });
  }
})