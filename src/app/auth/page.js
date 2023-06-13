'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react'

export default function Auth() {
    const router = useRouter();
    const { status } = useSession({
      required: true,
      onUnauthenticated() {
       signIn("spotify")
      },
    })

    if (status === 'authenticated') {
        router.push('/main');
    }
}
