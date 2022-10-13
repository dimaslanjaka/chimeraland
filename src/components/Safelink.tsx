import CryptoJS from 'crypto-js'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  adsArticle,
  adsArticle1,
  adsAuto,
  adsFeedTextOnly,
  adsMultiplex
} from './adsense/myads'
import { ReactSEOMetaTags } from './react-seo-meta-tags/ReactSEOMetaTags'
import './Safelink.scss'

export function Safelink() {
  const [val, setVal] = useState('')
  useEffect(() => {
    document.getElementById('m-sidebar')?.remove()
    document.getElementById('m-contents')?.setAttribute('class', 'col-md-12')
    setVal(() => localStorage.getItem('forms') || '')
  })

  const handleChange = function (value: string) {
    setVal(() => value)
    localStorage.setItem('forms', value)
    const url = new URL(location.origin + location.pathname)
    const encodedWord = CryptoJS.enc.Utf8.parse(value)
    url.search = 'url=' + CryptoJS.enc.Base64.stringify(encodedWord)
    document.getElementById('ures').innerText = url.toString()
  }

  return (
    <section className="container-fluid">
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{
          title: 'Review Loan And Insurances',
          description: 'All of reviews loans and insurances',
          author: { name: 'L3n4r0x', email: 'dimaslanjaka@gmail.com' }
        }}
      />
      <div className="row">
        <div className="col-lg-6 col-12">
          <div className="mb-3">
            <label htmlFor="urlC" className="form-label">
              Safelink loans converter
            </label>
            <textarea
              onInput={(el) => handleChange(el.target['value'])}
              onChange={(el) => handleChange(el.target.value)}
              name="UC"
              className="form-control"
              id="urlC"
              placeholder="https://google.com"
              rows={3}>
              {val.length > 0 && val}
            </textarea>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <label htmlFor="ures">Result</label>
          <pre id="ures"></pre>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-12 mb-2 ads-side-left">
          {adsArticle('left')}
        </div>
        <div className="col-lg-4 col-12 mb-2">
          <div className="d-grid gap-2">
            <button className="btn btn-outline-primary" type="button">
              Click 2x
            </button>
          </div>
          <div style={{ height: '100%' }}>{adsAuto('after-btn')}</div>
        </div>
        <div className="col-lg-4 col-12 mb-2 ads-side-right">
          {adsArticle1('right')}
        </div>
      </div>

      <div className="row">
        <h5>Which Loans Are Easiest To Approve?</h5>

        <p>
          The easiest loans to approve are probably payday loans, auto title
          loans, pawn loans, and personal installment loans. These are all
          short-term cash solutions for bad credit troubled borrowers. Many of
          these options are designed to help borrowers who need cash quickly
          when they need it.
        </p>

        <p>
          <b>Personal Installment Loans</b> - These are unsecured personal loans
          for borrowers with less than perfect credit scores. You can usually
          make more money with an installment loan than with other quick cash
          options like a payday loan. In addition, installment payments extend
          the repayment period. Borrowers usually take months to years to repay
          the loan and interest.
        </p>

        <p>
          Payday Loans – These are also unsecured loans, but they offer a
          smaller amount and take less time to pay off the loan and interest.
          Usually the borrower has to repay these loans within his two weeks or
          by the next payday. High interest rates and short repayment terms can
          make it difficult to repay on time. Even if you need the money right
          now, think twice before taking out such a loan.
        </p>

        <p>
          Car Title Loan - This is a secured loan. In other words, you need
          collateral to get a loan. Security becomes ownership of your vehicle.
          This means that the lender can legally seize and sell your car if you
          cannot repay the loan on time. This makes these loans very risky if
          your car is essential to your daily life.
        </p>

        <p>
          Pawnshop Loans – These are also secured loans. However, the security
          in this case can be anything of value that you own and that the lender
          accepts. It could be jewelry, electronics, music equipment, or other
          valuables. The lender will provide cash based on the items value and
          will get the item back once you return the loan and interest. But if
          you cant pay it back, they can keep your item and sell it.
        </p>
      </div>

      <div className="ads-side-k">{adsMultiplex('insurance-top')}</div>
      <div className="d-grid gap-2">
        <button
          className="btn btn-outline-primary"
          type="button"
          id="click-to-open">
          Click to open url
        </button>
      </div>
      <div className="ads-side-bottom">
        {adsFeedTextOnly('insurance-bottom')}
      </div>
    </section>
  )
}
