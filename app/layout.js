import './globals.css'

export const metadata = {
  title: 'DiRT - Dialed RAD Tool',
  description: 'Dial in your frame and components before you buy them',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
