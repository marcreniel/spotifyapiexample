import './globals.css'
import { headers } from 'next/headers'
import AuthContext from './AuthContext'


export const metadata = {
  title: 'Spotify Data Display',
  description: 'Demonstration purposes only',
}

async function getSession(cookie) {
  const response = await fetch(`https://spotifyapiexample.vercel.app/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({children}) {
  const session = await getSession(headers().get('cookie') ?? '');
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head/>
      <body>
        <AuthContext session={session}>
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
