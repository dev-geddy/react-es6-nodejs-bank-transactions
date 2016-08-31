import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import AppStore from '../stores/AppStore'
import AppDispatcher from '../dispatchers/AppDispatcher'
import D3Chart from './D3/D3Chart'
import Categories from './Summary/Categories'
import {Link} from 'react-router'

class Summary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalInAmount: 0,
      totalOutAmount: 0,
      categories: {}
    }
  }

  _onStoreChange() {
    this.setState({
      ...AppStore.state
    })
  }

  requestData() {
    AppDispatcher.dispatch({
      actionType: 'GET_TRANSACTIONS'
    })
  }

  componentWillMount() {
    this._changeListener = this._onStoreChange.bind(this)
    this._resizeListener = this.remeasureWidth.bind(this)

    AppStore.addChangeListener(this._changeListener)
    this.state = AppStore.state
    this.requestData()

    window.addEventListener('resize', this._resizeListener)
  }

  remeasureWidth() {
    if (!this.refs.contentWrapper) { return null }

    let contentWidth = ReactDOM.findDOMNode(this.refs.contentWrapper).offsetWidth
    this.setState({
      chartWidth: contentWidth - (15 * 2)
    })
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._changeListener)
    window.removeEventListener('resize', this._resizeListener)
  }

  componentDidMount() {
    this.remeasureWidth()
  }

  transactionsCategories(transactions) {
    let categories = {
      travel: [],
      clothing: [],
      commuting: [],
      food: [],
      housing: [],
      connectivity: [],
      personal: [],
      out: [],
      cash: [],
      online: [],
      other: [],
      serviceFees: [],
      bankPayments: []
    }

    if (typeof transactions !== 'object') {
      return categories
    }

    try {
      transactions.map((transaction)=> {
        let description = transaction.description
        if (transaction.amount > 0) {
          return false
        }
        if (new RegExp(/(RYANAIR)/i).test(description)) {
          categories.travel.push(transaction)
        } else if (new RegExp(/(NATIONAL EXPRESS)/i).test(description)) {
          categories.travel.push(transaction)
        } else if (new RegExp(/(P \& O FERRIES)/i).test(description)) {
          categories.travel.push(transaction)
        } else if (new RegExp(/(Visa Rate)/i).test(description)) {
          categories.travel.push(transaction)
        } else if (new RegExp(/^(BP )/i).test(description)) {
          categories.travel.push(transaction)
        } else if (new RegExp(/(INT\'L)/i).test(description)) {
          categories.travel.push(transaction)
        } else if (new RegExp(/(BT GROUP)/i).test(description)) {
          categories.connectivity.push(transaction)
        } else if (new RegExp(/(SPORTSDIRECT)/i).test(description)) {
          categories.clothing.push(transaction)
        } else if (new RegExp(/(MATALAN)/i).test(description)) {
          categories.clothing.push(transaction)
        } else if (new RegExp(/(NEXT)/i).test(description)) {
          categories.clothing.push(transaction)
        } else if (new RegExp(/(Deichmann)/i).test(description)) {
          categories.clothing.push(transaction)
        } else if (new RegExp(/(Revolut)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/^(IZ)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/^(WAHACA)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/^(NERO EXPRESS)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(WASABI)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(PORTLAND CAFE)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(BIG FERNAND)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(ICCO)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(BENITO\'S HAT)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(GREEN MAN)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(THE CROWN)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(ABOKADO)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(YE OLDE COCK TAVER)/i).test(description)) {
          categories.personal.push(transaction)
        } else if (new RegExp(/(LONDON \& SOUTH)/i).test(description)) {
          categories.commuting.push(transaction)
        } else if (new RegExp(/(SOUTHERN RAIL)/i).test(description)) {
          categories.commuting.push(transaction)
        } else if (new RegExp(/(LONDON \& SOUTH)/i).test(description)) {
          categories.commuting.push(transaction)
        } else if (new RegExp(/(LUL TICKET MACHINE)/i).test(description)) {
          categories.commuting.push(transaction)
        } else if (new RegExp(/(TESCO)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(GREGGS)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(LIDL UK)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(MARKS \& SPENCER)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(SAINSBURY)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(POUNDLAND)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(POUNDSTRETCHER)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(CO\-OP)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(M\&S SIMPLY FOOD)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(BOOTS)/i).test(description)) {
          categories.food.push(transaction)
        } else if (new RegExp(/(BAR)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(PRET A MANGER)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(MCDONALDS)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(BURGER KING)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(UPPER CRUST)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(COSTA COFFEE)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(COSTA COF)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(WILLIAMSONS TAVERN)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(BYRON)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(STARBUCKS)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(MUSEUM)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(ODEON CINEMAS)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(HONEST BURGERS)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(BELLA ITALIA)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(CAFFE NERO)/i).test(description)) {
          categories.out.push(transaction)
        } else if (new RegExp(/(CASH)/i).test(description)) {
          categories.cash.push(transaction)
        } else if (transaction.amount === -1250) {
          categories.housing.push(transaction)
        } else if (new RegExp(/(LB LEWISHAM)/i).test(description)) {
          categories.housing.push(transaction)
        } else if (new RegExp(/(E.ON ENERGY)/i).test(description)) {
          categories.housing.push(transaction)
        } else if (new RegExp(/(EVANS CYCLES)/i).test(description)) {
          categories.online.push(transaction)
        } else if (new RegExp(/(CURRYS ONLINE)/i).test(description)) {
          categories.online.push(transaction)
        } else if (new RegExp(/(CURRYS)/i).test(description)) {
          categories.online.push(transaction)
        } else if ((transaction.type === ')))' || transaction.type === 'VIS') && parseFloat(transaction.amount) < 15) {
          categories.personal.push(transaction)
        } else if (transaction.type === 'DR') {
          categories.serviceFees.push(transaction)
        } else if (transaction.type === 'BP') {
          categories.bankPayments.push(transaction)
        } else {
          categories.other.push(transaction)
        }
        return true
      })
    } catch (e) {
      console.log("Error occured: " + e.message)
      return categories
    }
    return categories
  }

  render() {
    const {
      error,
      usingUploaded,
      transactions,
      chartWidth,
      isLoadingTransactions
      } = this.state

    const transactionsListLink = <Link to="transactions">Transactions</Link>

    return (
      <article className="page">
        <header>
          <h2>Transactions summary</h2>
          {usingUploaded ?
            <p>Using uploaded data from CSV. See {transactionsListLink} for detailed list.</p>:<p>Using sample data from API. See {transactionsListLink} for detailed list.</p>}
        </header>
        <section className="page-content" ref="contentWrapper">

          {error ? <div className="error">{error}</div> : null}

          <h3>Balance history over time</h3>
          <D3Chart data={transactions}
                   isLoading={isLoadingTransactions}
                   width={chartWidth || 930}
                   height={180} />

        </section>
        <header>
          <h2>Grouped expenses</h2>
        </header>
        <section className="page-content">
          <Categories categorisedData={this.transactionsCategories(transactions)} />
        </section>
      </article>
    )
  }
}

export default Summary
