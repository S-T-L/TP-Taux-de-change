const BASE_URL = 'https://v6.exchangerate-api.com/v6'

const ALLOWED_CURRENCIES = ['XPF', 'EUR', 'USD', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF', 'FJD', 'SGD', 'THB', 'VUV']

exports.handler = function (event) {
  const base = (event.queryStringParameters?.base || 'XPF').toUpperCase()
  const apiKey = process.env.EXCHANGE_API_KEY

  if (!ALLOWED_CURRENCIES.includes(base)) {
    return Promise.resolve({
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: 'error', 'error-type': 'unsupported-code' })
    })
  }

  if (!apiKey) {
    return Promise.resolve({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: 'error', 'error-type': 'missing-key' })
    })
  }

  const url = `${BASE_URL}/${apiKey}/latest/${base}`

  return fetch(url)
    .then(function (response) {
      return response.json().then(function (data) {
        return {
          statusCode: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS'
          },
          body: JSON.stringify(data)
        }
      })
    })
    .catch(function (err) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: 'error', 'error-type': 'proxy-error', message: err.message })
      }
    })
}
