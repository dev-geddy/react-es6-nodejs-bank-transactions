import React from 'react'

const MoneyAmount = (props) => {
  let formattedAmount = parseFloat(props.amount).toFixed(2)
  return (
    <span className="money-amount">£{formattedAmount}</span>
  )
}

export default MoneyAmount