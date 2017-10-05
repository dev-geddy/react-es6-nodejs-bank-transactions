var fs = require('fs')
var csv = require('csv')
var formidable = require('formidable')
var path = require('path')
var moment = require('moment')
var _ = require('lodash')
var SAMPLE_SRC_FILE_PATH = __dirname + '/../../api-data-src/dc-midata.csv'

function formatDate(date) {
  // output must be YYYY-MM-DD

  // workaround: replace string month names to digits
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  for (var i=0; i< months.length; i++) {
    var monthNum = i + 1
    date = date.replace(months[i], monthNum<10 ? '0'+(monthNum) : (monthNum))
  }


  if (moment(date, 'DD/MM/YYYY').isValid()) {
    console.log("Parsing as: DD/MM/YYYY")
    return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')

  } else if (moment(date, 'YYYY-MM-DD').isValid()) {
    console.log("Parsing as: YYYY-MM-DD")
    return moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')

  } else if (moment(date, 'DD-MM-YYYY').isValid()) {
    console.log("Parsing as: DD-MM-YYYY")
    return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')

  } else if (moment(date, 'DD MM YYYY').isValid()) {
    console.log("Parsing as: DD MM YYYY")
    return moment(date, 'DD MM YYYY').format('YYYY-MM-DD')

  } else if (moment(date, 'DD MMM YYYY').isValid()) {
    console.log("Parsing as: DD MMM YYYY")
    return moment(date, 'DD MMM YYYY').format('YYYY-MM-DD')

  } else {
    console.log("Could not parse date. Falling back to: 2100-01-01")
    return '2100-01-01'
  }
}

function transformData(data) {
  var transformedData = []
  var balance = 10000.00 // starts from fictional balance
  for (var i = 0; i < data.length; i++) {
    balance = balance + parseFloat(data[i][2])
    var newEntry = {
      date: formatDate(data[i][0]),
      type: 'N/A',
      description: data[i][1],
      amount: parseFloat(data[i][2]),
      balance: balance
    }
    transformedData.push(newEntry)
  }
  return transformedData
}
function transformMiData(data) {

  // identify format and column count, if unrecognised - return error

  var transformedData = []
  for (var i = 0; i < data.length; i++) {
    var newEntry = {
      date: formatDate(data[i][0]),
      type: data[i][1],
      description: data[i][2],
      amount: parseFloat(data[i][3].replace('£', '')),
      balance: parseFloat(data[i][4].replace('£', ''))
    }
    transformedData.push(newEntry)
  }
  return transformedData
}

function isNotIncome(type) {
  if (
    type === 'DD' ||
    type === 'FPO' ||
    type === 'DEB'
  ) {
    return true
  }
  return false
}

function transformBusinessData(data) {

  // identify format and column count, if unrecognised - return error

  var transformedData = []
  for (var i = 0; i < data.length; i++) {
    // console.log('Amount: ', data[i][5],' | ', data[i][6], ' | ', parseFloat(data[i][5]))
    var newEntry = {
      date: formatDate(data[i][0]),
      type: data[i][1],
      description: data[i][4],
      amount: isNotIncome(data[i][1]) ? - parseFloat(''+data[i][5]) : parseFloat(''+data[i][6]),
      balance: parseFloat(data[i][7].replace('£', ''))
    }
    transformedData.push(newEntry)
  }
  return transformedData
}

function formatSourceData(data) {
  if (data.length && data[0].length === 8) {
    // hsbc yearly statement of account
    console.log("Will parse BUSINESS transactions (8 columns)")
    return transformBusinessData(data)
  } else if (data.length && data[0].length === 5) {
    // hsbc yearly statement of account
    console.log("Will parse YEARLY transactions (5 columns)")
    return transformMiData(data)
  } else if (data.length && data[0].length === 3) {
    // hsbc ongoing month statement
    console.log("Will parse MONTHLY statement (3 columns)")
    return transformData(data)
  } else {
    console.log("Unrecognised CSV" + data[0].length)
    return []
  }
}

function sanitizeSrcData(data) {
  var lines = data.split('\n')
  var lineRegexpPattern1 = new RegExp(/^\d+\/\d+\/\d{4}/i)
  var lineRegexpPattern2 = new RegExp(/^\d{4}\-\d{2}\-\d{2}/i) // 2016-09-08,GOOGLE *Strava Inc g.co/payhelp,-3.99
  var lineRegexpPattern3 = new RegExp(/^\d+\s[a-z]+\s\d{4}/i) //15 Jun 2016,GOOGLE *Strava Inc g.co/payhelp,-3.99
  var cleanLines = []
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].match(lineRegexpPattern1) || lines[i].match(lineRegexpPattern2) || lines[i].match(lineRegexpPattern3)) {
      cleanLines.push(lines[i])
    }
  }
  var cleanData = cleanLines.join('\n')
  return cleanData
}

function getDefaultTransactions(srcFile, res) {
  var dataFile = srcFile || SAMPLE_SRC_FILE_PATH
  console.log("===== GET DEFAULT TRANSACTIONS =====")
  fs.readFile(dataFile || SAMPLE_SRC_FILE_PATH, 'utf8', function (err, fileContent) {
    try {
      var cleanData = sanitizeSrcData(fileContent)
      csv.parse(cleanData, function (err, data) {
        res.json({data: formatSourceData(data), message: err || ''})
      })
    } catch (e) {
      res.json({message: e, data: {}})
    }
  })
}

function getTransactionsWithCallback(srcFile, callback) {
  console.log("===== GET TRANSACTIONS FROM UPLOADED FILE =====")
  var dataFile = srcFile || SAMPLE_SRC_FILE_PATH
  fs.readFile(dataFile, 'utf8', function (err, fileContent) {
    try {
      // clear file from server side right after read
      setTimeout(function () {
        fs.unlink(dataFile)
      }, 1000)
      var cleanData = sanitizeSrcData(fileContent)
      csv.parse(cleanData, function (err, data) {
        callback(formatSourceData(data))
      })
    } catch (e) {
      console.log("Error while parsing CSV.")
      var emptyArray = []
      callback(emptyArray)
      throw e
    }
  })
}

function processUpload(req, res) {
  console.log("====== GOT FORM DATA ======")
  var uploadedFilesList = []
  var timeout = setTimeout(function () {
    res.json({message: 'Processing Timeout. Files too big or misformated.', data: []})
  }, 10000)

  // create an incoming form object
  var form = new formidable.IncomingForm()

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true
  form.encoding = 'utf-8'

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/../uploads')

  form.parse(req, function (err, fields, files) {
    console.log("PARSING request.")
  })

  // every time a file has been uploaded successfully
  form.on('file', function (field, file) {
    console.log("GOT NEW FILE: ", file.name)
    var uploadedFileLocation = path.join(form.uploadDir, file.name)
    fs.rename(file.path, uploadedFileLocation)
    uploadedFilesList.push(uploadedFileLocation)
  })

  // log any errors that occur
  form.on('error', function (err) {
    console.log('An error has occured: \n' + err)
    res.json({message: 'Error occured: ' + err, data: {}})
  })

  // once all the files have been uploaded, send a response to the client
  form.on('end', function () {
    var collectedData = []
    var expectedCount = uploadedFilesList.length


    var collectData = function (data) {
      collectedData.push(data)
      if (collectedData.length === expectedCount) {
        console.log("MERGING DATA...")
        clearTimeout(timeout)

        var resultData = []

        for (var i = 0; i < collectedData.length; i++) {
          Array.prototype.push.apply(resultData, collectedData[i])
        }
        resultData.reverse() // oldest to latest


        res.json({data: removeDuplicatesAndOrder(resultData)})
        console.log("DONE.")
      }
    }

    for (var i = 0; i < uploadedFilesList.length; i++) {
      console.log("Parsing file " + i)
      getTransactionsWithCallback(uploadedFilesList[i], collectData)
    }
  })
}

function removeDuplicatesAndOrder(objects) {
  console.log("Checking for duplicates and ordering by date.")
  var uniqueObjects = _.uniqWith(objects, _.isEqual)
  return _.sortBy(uniqueObjects, 'date', 'asc');
}

module.exports = {
  getDefaultTransactions: getDefaultTransactions,
  processUpload: processUpload
}
