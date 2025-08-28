const http = require('http')

const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				Poppins: ["Poppins", "system-ui"],
				Playfari: ["serif", "system-ui"],
				Handwrite: ["Playwrite CU", "cursive"],
			},
			colors: {
				overlay: "rgb(0 0 0 / 0.5)",
				specialBg: "#FFF0E9",
			},
		},
	},
	plugins: [],
};`

const postData = JSON.stringify({
  config: config,
  options: {},
})

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/convert',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
}

const req = http.request(options, res => {
  let data = ''

  res.on('data', chunk => {
    data += chunk
  })

  res.on('end', () => {
    console.log('Status:', res.statusCode)
    console.log('Response:', data)

    try {
      const parsed = JSON.parse(data)
      if (parsed.error) {
        console.log('ERROR:', parsed.error)
        if (parsed.details) {
          console.log('DETAILS:', parsed.details)
        }
      } else {
        console.log('SUCCESS: CSS generated')
        console.log('Full CSS Output:')
        console.log(parsed.css)
      }
    } catch (e) {
      console.log('Failed to parse response:', e.message)
    }
  })
})

req.on('error', e => {
  console.error('Request error:', e.message)
})

req.write(postData)
req.end()
