import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main>
      <h1>404 - Not Found</h1>
      <iframe
        src="https://giphy.com/embed/l3q2ufk4HuocUWMta"
        width="480"
        height="270"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  )
}
