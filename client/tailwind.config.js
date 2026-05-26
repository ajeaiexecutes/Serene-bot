/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#17CA8C',
          green: '#63B660',
          mint: '#06D386',
          send: '#00C278',
          'send-light': '#00E58D',
          'card-tint': '#CEF6DC',
          'toolkit-border': '#8DDBBD',
          'input-border': '#B4DBFF',
        },
        text: {
          placeholder: '#8E8E8E',
          muted: '#555555',
          light: '#BBBBBB',
        }
      },
      opacity: {
        '15': '0.15',
        '25': '0.25',
        '30': '0.30',
        '35': '0.35',
      },
      borderRadius: {
        blob1: '3505px',
        blob2: '2846px',
        card: '29px',
        checkin: '18px',
        pill: '52px',
        send: '67px',
      },
      fontFamily: {
        sf: ['-apple-system', 'SF UI Display', 'Helvetica Neue', 'sans-serif'],
        hv: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 40px rgba(0,0,0,0.06)',
        checkin: '0 4px 32px rgba(0,0,0,0.07)',
        send: '0 4px 16px rgba(0,197,120,0.4)',
      },
      blur: {
        blob: '80px',
      },
    },
  },
  plugins: [],
}