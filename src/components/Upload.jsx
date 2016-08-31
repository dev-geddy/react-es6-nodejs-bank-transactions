import React, { Component } from 'react'
import UploadArea from './Upload/UploadArea'

class Upload extends Component {
  render() {
    return (
      <article className="page">
        <header>
          <h2>Upload your CSV statement(s)</h2>
        </header>
        <div className="page-content with-columns">
          <div className="row">
            <div className="column small-12 medium-6 large-8">
              <h3>Requirements</h3>
              <p>Upload your statement(s) to see the visual balance graph and categorised summary.</p>
              <p>Expected CSV file structure:</p>
              <ul>
                <li>File should contain 5 comma (',') separated columns</li>
                <li>Column order is expected as follows:<br/>
                  <ul>
                    <li>Date ('dd/mm/YYYY')</li>
                    <li>Type (')))','DD','DR','BP','VIS','CR','ATM')</li>
                    <li>Description (plain text)</li>
                    <li>Amount (-£10.10, +£10.10)</li>
                    <li>Balance (+£1000.00, -£1000.00)</li>
                  </ul>
                </li>
                <li>Empty lines are allowed</li>
                <li>Unexpected rows will be ignored</li>
                <li>Multiple file upload allowed. All records will be merged into a single list excluding duplicates.
                  <ul>
                    <li>It is expected that files will be of the same format and from the same account, otherwise data will be corrupt.</li>
                  </ul>
                </li>
              </ul>
              <h3>Supported CSV Examples</h3>
              <pre>
                Date,Type,Merchant/Description,Debit/Credit,Balance<br/>
                14/03/2016,))),STARBUCKS         LONDON,-£10.33,+£23751.72
              </pre>
              <pre>
                Date,Merchant/Description,Debit/Credit<br/>
                14/03/2016,STARBUCKS         LONDON,-£10.33
              </pre>
              <pre>
                Date,Merchant/Description,Debit/Credit<br/>
                15 Mar 2016,GOOGLE *Strava Inc g.co/payhelp,-3.99
              </pre>
              <pre>
                Date,Merchant/Description,Debit/Credit<br/>
                2016-03-23,LUL TICKET MACHINE OXFORD CIRCUS,-50.00
              </pre>
            </div>
            <div className="column small-12 medium-6 large-4">
              <h3>File upload</h3>
              <UploadArea />
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default Upload
