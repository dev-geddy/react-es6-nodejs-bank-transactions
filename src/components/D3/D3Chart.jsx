import React from 'react'
import Loader from '../UI/Loader'
// import { Chart } from 'react-d3-core'
import { LineChart } from 'react-d3-basic' //, AreaChart

export default class D3Chart extends React.Component {

  _transformData(transactions) {
    let newData = []
    transactions.map((transaction)=> {
      let newRecord = {
        amount: parseFloat(transaction.amount),
        balance: parseFloat(transaction.balance),
        date: transaction.date
      }
      return newData.push(newRecord)
    })

    return newData
  }

  render() {
    let chartSeries = [
      {
        field: 'balance',
        name: 'Balance',
        area: true,
        color: '#008ae6',
        tickFormat: ''
      }
    ]

    let x = function (entry) {
      // d3 is globally accessible
      // eslint-disable-next-line
      let _dateParser = d3.time.format("%Y-%m-%d").parse
      return _dateParser(entry.date)
    }
    let xScale = 'time'
    let y = (entry) => {
      return +entry
    }

    let margins = {
      top: 0,
      right: 0,
      bottom: 20,
      left: 50
    }

    const data = this.props.data

    return (
      <div>
        {this.props.isLoading ? <Loader text="Loading chart data..." /> : <div>
          {data ? <LineChart
            width={this.props.width || 440}
            height={this.props.height || 300}
            data={this._transformData(data)}
            chartSeries={chartSeries}
            margins={margins}
            x={x}
            y={y}
            xScale={xScale}
          /> : <p>Unexpected data format...</p>}
        </div>}
      </div>
    )
  }

}