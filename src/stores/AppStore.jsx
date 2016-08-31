import {EventEmitter} from 'events'
import Request from '../services/Request'
import AppDispatcher from '../dispatchers/AppDispatcher'

export class AppStore extends EventEmitter {

  constructor() {
    super()
    this.subscribe(() => this._registerToActions.bind(this))
    this.appState = {
      error: '',
      files: [],
      transactions: [],
      isLoadingTransactions: false,
      isUploadFinished: false,
      usingUploaded: false
    }
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = AppDispatcher.register(actionSubscribe())
  }

  get dispatchToken() {
    return this._dispatchToken
  }

  emitChange() {
    this.emit('CHANGE')
  }

  addChangeListener(callback) {
    this.on('CHANGE', callback)
  }

  removeChangeListener(callback) {
    this.removeListener('CHANGE', callback)
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case 'GET_TRANSACTIONS':
        this._getTransactions()
        break
      case 'UPLOAD_TRANSACTIONS_FILES':
        this._uploadTransactions(action.files)
        break
      case 'RESET_UPLOADED_DATA':
        this._resetUploadedData()
        break
      default:
        break
    }
  }

  _emitError(e) {
    this.appState = {
      ...this.appState,
      transactions: [],
      isLoadingTransactions: false,
      error: e.message
    }
    this.emitChange()
  }

  _resetUploadedData() {
    this.appState = {
      ...this.appState,
      error: '',
      files: [],
      transactions: [],
      isLoadingTransactions: false,
      isUploadFinished: false,
      usingUploaded: false
    }
    localStorage.removeItem('transactions')
    this.emitChange()
  }

  _getStoredTransactions() {
    return JSON.parse(localStorage.getItem('transactions'))
  }

  _getTransactions() {

    let storedTransactions = this._getStoredTransactions()
    if (storedTransactions && storedTransactions.length) {
      this.appState = {
        ...this.appState,
        error: '',
        usingUploaded: true,
        transactions: storedTransactions
      }
      this.emitChange()
      return
    }

    this.appState = {
      ...this.appState,
      error: '',
      isLoadingTransactions: true
    }
    this.emitChange()

    Request.callEndpoint({
      method: 'GET',
      url: 'http://localhost:3600/transactions',
      data: '',
      timeout: 5000
    }).then((res)=> {
      let apiData = res.data.data
      this.appState = {
        ...this.appState,
        error: '',
        usingUploaded: false,
        transactions: apiData,
        isLoadingTransactions: false
      }
      this.emitChange()
    }).catch(e => {
      this._emitError(e)
      throw e
    })
  }

  _uploadTransactions(files) {

    this.appState = {
      ...this.appState,
      error: '',
      usingUploaded: false,
      isLoadingTransactions: true,
      isUploadFinished: false,
    }
    this.emitChange()

    let data = new FormData()
    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'text/csv') {
          data.append('file', files[i])
        }
      }
    }

    Request.callEndpointUpload({
      method: 'POST',
      url: 'http://localhost:3600/transactions-upload',
      data: data
    }).then((res)=> {
      try {

        let apiData = res.data.data
        let apiMessage = res.data.message || ''
        let errorMessage = apiData ? '':'No transactions has been found.'

        // store transactions in localStorage (will be retained on page refresh just in case)
        localStorage.setItem('transactions', JSON.stringify(apiData))

        this.appState = {
          ...this.appState,
          error: apiMessage || errorMessage || '',
          files: [],
          transactions: apiData || [],
          isLoadingTransactions: false,
          isUploadFinished: true,
          usingUploaded: true
        }
      } catch (e) {
        this._emitError(e)
      }
      this.emitChange()
      setTimeout(()=>{
        this.appState = {
          ...this.appState,
          isUploadFinished: false
        }
        this.emitChange()
      },3000)
    }).catch(e => {
      this._emitError(e)
      throw e
    })
  }

  get state() {
    return this.appState
  }
}

export default new AppStore()