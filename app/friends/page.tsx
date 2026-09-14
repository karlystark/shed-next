'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProfileCard from '../components/profileCard/profileCard';
import './friends.css';

const FRIEND_ROW_CLASSES = ['friend-row-0', 'friend-row-1', 'friend-row-2'];

interface Friend {
  _id: string;
  username: string;
}

interface FriendRequestSummary {
  _id: string;
  from?: { username: string };
  to?: { username: string };
}

interface DirectoryUser {
  _id: string;
  username: string;
  color?: string;
  icon?: string;
}

export default function FriendsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incoming, setIncoming] = useState<FriendRequestSummary[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequestSummary[]>([]);
  const [directory, setDirectory] = useState<DirectoryUser[]>([]);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  async function loadAll() {
    const [friendsRes, requestsRes, usersRes] = await Promise.all([
      fetch('/api/friends'),
      fetch('/api/friend-requests'),
      fetch('/api/users'),
    ]);
    setFriends(await friendsRes.json());
    const { incoming, outgoing } = await requestsRes.json();
    setIncoming(incoming);
    setOutgoing(outgoing);
    setDirectory(await usersRes.json());
  }

  useEffect(() => {
    if (status === 'authenticated') {
      loadAll();
    }
  }, [status]);

  async function sendFriendRequest(username: string) {
    setError('');
    setMessage('');

    const response = await fetch('/api/friend-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: username }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Something went wrong.');
      return;
    }

    setMessage(data.status === 'accepted' ? `You and ${username} are now friends!` : 'Friend request sent.');
    loadAll();
  }

  async function handleAddFriend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendFriendRequest(newFriendUsername);
    setNewFriendUsername('');
  }

  async function acceptRequest(id: string) {
    await fetch(`/api/friend-requests/${id}`, { method: 'POST' });
    loadAll();
  }

  async function declineRequest(id: string) {
    await fetch(`/api/friend-requests/${id}`, { method: 'DELETE' });
    loadAll();
  }

  async function unfriend(username: string) {
    await fetch(`/api/friends/${username}`, { method: 'DELETE' });
    loadAll();
  }

  function relationshipTo(username: string) {
    if (friends.some((friend) => friend.username === username)) {
      return { type: 'friend' as const };
    }
    const incomingMatch = incoming.find((req) => req.from?.username === username);
    if (incomingMatch) {
      return { type: 'incoming' as const, requestId: incomingMatch._id };
    }
    const outgoingMatch = outgoing.find((req) => req.to?.username === username);
    if (outgoingMatch) {
      return { type: 'outgoing' as const };
    }
    return { type: 'stranger' as const };
  }

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="Friends min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-center text-5xl font-extrabold text-gray-900 mb-8">Friends</h1>

        <form onSubmit={handleAddFriend} className="bg-[var(--light-bg)] p-6 rounded-xl shadow-2xl flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Add a friend by username</label>
            <input id="username" value={newFriendUsername} onChange={(e) => setNewFriendUsername(e.target.value)} type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm" placeholder="username" />
          </div>
          <button type="submit" className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-950 hover:bg-yellow-800">
            Send request
          </button>
        </form>
        {error && <p className="text-red-800 text-sm font-medium">{error}</p>}
        {message && <p className="text-emerald-900 text-sm font-medium">{message}</p>}

        <div className="bg-[var(--light-bg)] p-6 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-1">Find friends</h2>
          <p className="text-sm text-gray-600 mb-4">everyone on shed &mdash; select a card to send a friend request</p>
          {directory.length === 0 && <p>no other users yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {directory.map((user) => {
              const relationship = relationshipTo(user.username);
              return (
                <ProfileCard
                  key={user._id}
                  username={user.username}
                  color={user.color}
                  icon={user.icon}
                  action={
                    relationship.type === 'friend' ? (
                      <span className="text-sm font-semibold text-[#f4f2ed]">✓ friends</span>
                    ) : relationship.type === 'outgoing' ? (
                      <span className="text-sm font-semibold text-[#f4f2ed]">pending</span>
                    ) : relationship.type === 'incoming' ? (
                      <button
                        type="button"
                        onClick={() => acceptRequest(relationship.requestId)}
                        className="text-sm font-bold underline text-[#f4f2ed]"
                      >
                        accept
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => sendFriendRequest(user.username)}
                        className="text-sm font-bold underline text-[#f4f2ed]"
                      >
                        add friend
                      </button>
                    )
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="bg-[var(--light-bg)] p-6 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Requests</h2>
          {incoming.length === 0 && outgoing.length === 0 && <p>no pending requests.</p>}
          {incoming.map((req) => (
            <div key={req._id} className="flex justify-between items-center py-2">
              <span><Link href={`/users/${req.from?.username}`} className="nav-link">{req.from?.username}</Link> wants to be friends</span>
              <div className="flex gap-4">
                <button type="button" onClick={() => acceptRequest(req._id)} className="nav-link">accept</button>
                <button type="button" onClick={() => declineRequest(req._id)} className="nav-link">decline</button>
              </div>
            </div>
          ))}
          {outgoing.map((req) => (
            <div key={req._id} className="flex justify-between items-center py-2">
              <span>request sent to <Link href={`/users/${req.to?.username}`} className="nav-link">{req.to?.username}</Link></span>
              <button type="button" onClick={() => declineRequest(req._id)} className="nav-link">cancel</button>
            </div>
          ))}
        </div>

        <div className="bg-[var(--light-bg)] p-6 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Your friends</h2>
          {friends.length === 0 && <p>no friends yet — send a request above to get started.</p>}
          {friends.map((friend, idx) => (
            <div key={friend._id} className={`friend-row ${FRIEND_ROW_CLASSES[idx % FRIEND_ROW_CLASSES.length]}`}>
              <Link href={`/users/${friend.username}`}>{friend.username}</Link>
              <button type="button" onClick={() => unfriend(friend.username)}>unfriend</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
