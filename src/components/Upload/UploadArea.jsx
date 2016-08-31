import React, { Component } from 'react'
import { Link } from 'react-router'
import ReactDropZone from 'react-dropzone'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatchers/AppDispatcher'
import Loader from '../UI/Loader'

class UploadArea extends Component {

  static defaultState = {
    files: [],
    isLoading: false
  }

  constructor(props) {
    super(props)
    this.state = UploadArea.defaultState
  }
  requestData() {
    AppDispatcher.dispatch({
      actionType: 'GET_TRANSACTIONS'
    })
  }

  componentWillMount() {
    this._changeListener = this._onStoreChange.bind(this)
    AppStore.addChangeListener(this._changeListener)
    this.requestData()
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._changeListener)
  }

  _onStoreChange() {
    this.setState({
      ...AppStore.state
    })
  }

  onDrop(files) {
    let allFiles = [...this.state.files, ...files]
    let uniqueFiles = []
    allFiles.map((file) => {
      if (!uniqueFiles.find((searchFile) => {
          return searchFile.name === file.name
        })) {
        uniqueFiles.push(file)
      }
    })

    this.setState({
      files: uniqueFiles
    })
  }

  onClickAdd(e) {
    this.refs.dropZone.open()
  }

  doUpload(files) {
    AppDispatcher.dispatch({
      actionType: 'UPLOAD_TRANSACTIONS_FILES',
      files: files
    })
  }

  onClickResetFiles(e) {
    this.setState({...UploadArea.defaultState})
  }
  onClickProcessFiles(e) {
    this.doUpload(this.state.files)
  }

  canPreviewImage(fileType) {
    if (fileType === 'image/jpeg') return true
    if (fileType === 'image/png') return true
    if (fileType === 'text/csv') return false
    return false
  }

  onClickRemoveFromQueue(index, e) {
    e.preventDefault()
    let files = this.state.files
    files.splice(index, 1) // remove one
    this.setState({files: files})
  }

  renderFilesList(files) {
    return files.map((file, index)=> {
      return (
        <li key={index}>
          File: {file.name}<br />
          {this.canPreviewImage(file.type) && <div className="upload-preview"><img src={file.preview}/></div>}
          <small>
            Size: {file.size}, Type: {file.type}
          </small>
          <a onClick={this.onClickRemoveFromQueue.bind(this, index)}><i className="material-icons">clear</i></a>
        </li>
      )
    })
  }

  onClearUploadedData(e) {
    e.preventDefault()
    AppDispatcher.dispatch({
      actionType: 'RESET_UPLOADED_DATA'
    })
  }

  render() {
    const {
      files,
      error,
      transactions,
      usingUploaded,
      isLoadingTransactions,
      isUploadFinished
      } = this.state

    return (
      <div className="upload-area">
        {usingUploaded && !error && <div>
          <p>Uploaded data is now available in <Link to="/summary">Summary</Link> and contains <strong>{transactions && transactions.length}</strong> <Link to="/transactions">transactions</Link>,.</p>
          <div className="form-footer">
            <button className="cta-button grey" onClick={this.onClearUploadedData.bind(this)}>Clear uploaded data</button>
          </div>
        </div>}

        {error ? <div className="error">{error}</div> : null}

        {isLoadingTransactions && <Loader message="Uploading files" />}

        {isUploadFinished ? <p><i className="material-icons">cloud_done</i><br/>Files have been uploaded!</p>:<div>
          {!files.length && <div className="upload-step step-1">
            <ReactDropZone ref="dropZone" onDrop={this.onDrop.bind(this)} style={{}} className="upload-drop-area">
              <p><i className="material-icons">cloud_upload</i></p>
              <p>Drag and drop one or multiple files.</p>
            </ReactDropZone>
            <div className="form-footer">
              <button className="cta-button" onClick={this.onClickAdd.bind(this)}>Add file(s)</button>
            </div>
          </div>}
          {files.length > 0 && <div className="upload-step step-2">
            <p>Files to be uploaded:</p>
            <ul className="files-queue">
              {this.renderFilesList(files)}
            </ul>
            <div className="form-footer">
              <p>Only valid CSV files will be processed.</p>
              <button className="cta-button space-after"
                      onClick={this.onClickProcessFiles.bind(this)}>Process files</button>
              <button className="cta-button grey"
                      onClick={this.onClickResetFiles.bind(this)}>Cancel</button>
            </div>
          </div>}
        </div>}
      </div>
    )
  }
}

export default UploadArea
