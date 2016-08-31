import React, {Component} from 'react'
import MoneyAmount from './../UI/MoneyAmount'

class Summary extends Component {

  static categories = [
    {name: 'Travel', alias: 'travel', icon: 'info', amount: 0, transactions: []},
    {name: 'Clothing', alias: 'clothing', icon: 'info', amount: 0, transactions: []},
    {name: 'Commuting', alias: 'commuting', icon: 'info', amount: 0, transactions: []},
    {name: 'Food', alias: 'food', icon: 'info', amount: 0, transactions: []},
    {name: 'Housing', alias: 'housing', icon: 'info', amount: 0, transactions: []},
    {name: 'Connectivity', alias: 'connectivity', icon: 'info', amount: 0, transactions: []},
    {name: 'Personal', alias: 'personal', icon: 'info', amount: 0, transactions: []},
    {name: 'Out', alias: 'out', icon: 'info', amount: 0, transactions: []},
    {name: 'Cash', alias: 'cash', icon: 'info', amount: 0, transactions: []},
    {name: 'Online', alias: 'online', icon: 'info', amount: 0, transactions: []},
    {name: 'Other', alias: 'other', icon: 'info', amount: 0, transactions: []},
    {name: 'ServiceFees', alias: 'serviceFees', icon: 'info', amount: 0, transactions: []},
    {name: 'BankPayments', alias: 'bankPayments', icon: 'info', amount: 0, transactions: []}
  ]

  constructor(props) {
    super(props)
    this.state = {
      reAnimate: false
    }
  }

  reAnimate(fwd, e) {
    e.stopPropagation()
    this.setState({reAnimate: fwd})
  }

  renderCategoriesWithAmounts(categories, reAnimate) {
    const catCount = Summary.categories.length
    const turnStep = 2
    let turnAngle = -catCount
    const reflectiveValue = (val) => {
      let newVal = (val < 0 ? catCount * turnStep + val : catCount * turnStep - val)
      return reAnimate ? newVal : 0
    }
    const theAngle = (val) => {
      return reAnimate ? val : 0
    }
    return Summary.categories.map((category, index)=> {
      let transformation = {
        position: 'relative',
        transform: 'perspective(200px) translate3d(' + reflectiveValue(turnAngle) + 'px, 0, 0) rotateZ(' + theAngle(turnAngle) + 'deg)',
        transformOrigin: '-20% 0',
        zIndex: index
      }
      turnAngle = turnAngle + turnStep
      return (
        <li key={index} className={'cat cat-' + index + (reAnimate ? ' animating':' not-animating')}
            style={transformation}>
          <div className="row">
            <div className="column small-8 name-col">
              <i className="material-icons">{category.icon}</i>
              {category.name}
            </div>
            <div className="column small-4 amount-col">
              <MoneyAmount amount={this.categoriesAmounts(categories[category.alias]) || category.amount} />
            </div>
          </div>
        </li>
      )
    })
  }

  categoriesAmounts(transactions) {
    let totalAmount = 0
    if (transactions) {
      transactions.map((transaction)=> {
        totalAmount = totalAmount + parseFloat(transaction.amount)
      })
    }
    return -parseFloat(totalAmount).toFixed(2)
  }

  render() {
    const { categorisedData } = this.props
    const { reAnimate } = this.state
    return (
      <ul className="summary-categories" onMouseEnter={this.reAnimate.bind(this, true)} onMouseLeave={this.reAnimate.bind(this, false)}>
        {this.renderCategoriesWithAmounts(categorisedData, reAnimate)}
      </ul>
    )
  }
}

export default Summary
