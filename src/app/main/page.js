'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react'

export default function Main() {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [topSong, setSongList] = useState([]);
  const [topArtist, setArtistList] = useState([]);
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  useEffect(() => {
    grabProfile();
    grabTopTrack();
    grabTopArtist();
  }, []);

  const grabProfile = async () => {
    const tempProfile = await fetch('/api/getProfile');
    let {items} = await tempProfile.json();
    setProfile(profile => ({
        ...profile,
        ...items
      }));
  };

  const grabTopTrack = async () => {
    const track = await fetch('/api/getTopTracks');
    let {items} = await track.json();
    setSongList(items)
  };

  const grabTopArtist = async () => {
    const artist = await fetch('/api/getTopArtists');
    let {items} = await artist.json();
    setArtistList(items)
  };

  if(status === 'authenticated') {
    if (!profile.country) {
        // Render a loading state while the profile data is being fetched
        return (
            <main className="hero min-h-screen bg-lime-50">
                <div className="hero-content flex-col lg:flex-row">
                    <div className="max-w-md text-black">
                        <h1 className="text-5xl font-bold ">Loading</h1>            
                    </div>
                </div>
            </main>  
        )
      }
    
    
    return (
      <main className="flex flex-col justify-center hero min-h-screen bg-lime-50 text-black">
        <div className="flex-col lg:flex-row hero-content">
        <div className='text-center p-4'>
          <h1>
            Welcome,<span className="font-bold">{' '}
            {status === 'authenticated'
              ? data.user?.name || 'friend'
              : 'stranger'}</span>
            !
          </h1>
          <img src={profile.images[0].url} />
        </div>

        <div className='text-center p-4'>
            <h1>Your email associated with Spotify is:  <span className="font-bold">{profile.email}</span></h1>
            <h1>Your Spotify Origin Country is:  <span className="font-bold">{profile.country}</span></h1>
            <h1>You have  <span className="font-bold">{profile.followers.total} </span>followers!</h1>
            <h1>You are using a  <span className="font-bold">{profile.product} </span>account.</h1>
        </div>

        {topSong.map((item) => (
            <div key={item.id}>
              <h1>Your most listened to song in the 
                last 6 months is: 
                <span className="font-bold"> {item.name}</span> by 
                <span className="font-bold"> {item.artists[0].name}</span>
                </h1>
                <img src={item.album.images[1].url} />
            </div>
          ))}

        {topArtist.map((item) => (
            <div key={item.id}>
              <h1>Your most listened to artist in the last 6 months is: 
                <span className="font-bold"> {item.name}</span> 
                </h1>
                <img src={item.images[1].url} />
            </div>
            
          ))}
          </div>
          <div className='pt-4'>
            <button onClick={() => signOut()} className="btn btn-success">Sign Out</button>
        </div>
      </main>
    )
  }
  else {
    return ( 
        <main className="hero min-h-screen bg-lime-50">
            <div className="hero-content flex-col lg:flex-row">
                <div className="max-w-md text-black">
                    <h1 className="text-5xl font-bold ">404 Unauthorized</h1>            
            </div>
            </div>
        </main>  
    )
  }
}
