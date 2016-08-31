import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import AppStore from '../stores/AppStore'
import AppDispatcher from '../dispatchers/AppDispatcher'
import {Link} from 'react-router'
import MoneyAmount from './UI/MoneyAmount'

class Transactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalInAmount: 0,
      totalOutAmount: 0,
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

    AppStore.addChangeListener(this._changeListener)
    this.state = AppStore.state
    this.requestData()

    window.addEventListener('resize', this._resizeListener)
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._changeListener)
  }

  _renderTransactionsRows(transactions) {
    return transactions.map((transaction, index)=> {
      return (<tr key={index}>
        <td className="date-column">{transaction.date}</td>
        <td>{transaction.type}</td>
        <td>{transaction.description}</td>
        <td className={'amount' + (transaction.amount > 0 ? ' green':'red')}>
          <MoneyAmount amount={transaction.amount} />
        </td>
        <td>
          <MoneyAmount amount={transaction.balance} />
        </td>
      </tr>)
    })
  }

  render() {
    const {
      error,
      usingUploaded,
      transactions,
      chartWidth,
      isLoadingTransactions
      } = this.state

    const summaryLink = <Link to="summary">Upload</Link>

    return (
      <article className="page">
        <header>
          <h2>Transactions list</h2>
          {usingUploaded ?
            <p>Using uploaded data from CSV. You can clear uploaded data in {summaryLink} section.</p>:<p>Using sample data from API. {summaryLink} your data.</p>}
        </header>
        <section className="page-content">

          {error ? <div className="error">{error}</div> : null}

          <p>There are <strong>{transactions.length}</strong> transaction{transactions.length > 1 && 's'} on the list.</p>

          <div className="transactions-container">
            <table>
              <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
              </tr>
              </thead>
              <tbody>
              {this._renderTransactionsRows(transactions)}
              </tbody>
            </table>
          </div>
          <p>End of transactions list. You can see <Link to="summary">summary</Link>, <Link to="/">upload</Link> and <Link to="/">clear</Link> your data.</p>
        </section>
      </article>
    )
  }
}

export default Transactions
