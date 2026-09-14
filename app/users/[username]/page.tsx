'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ResourceCard from '../../components/resourceCard/resourceCard';
import '../../resources/resources.css';

interface Resource {
  _id: string;
  title: string;
  description?: string;
  quantity: number;
  category: string;
  owner: { username: string };
}

interface FriendRequestSummary {
  _id: string;
  from?: { username: string };
  to?: { username: string };
}

type Relationship = 'loading' | 'self' | 'friend' | 'outgoing-pending' | 'incoming-pending' | 'stranger' | 'logged-out';

export default function ShedPage() {
  const params = useParams();
  const username = params.username as string;
  const { data: session, status: sessionStatus } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [relationship, setRelationship] = useState<Relationship>('loading');
  const [incomingRequestId, setIncomingRequestId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (sessionStatus === 'unauthenticated') {
      setRelationship('logged-out');
      return;
    }

    if (session?.user.username === username) {
      setRelationship('self');
      loadResources();
      return;
    }

    async function determineRelationship() {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch('/api/friends'),
        fetch('/api/friend-requests'),
      ]);
      const friends = await friendsRes.json();
      const { incoming, outgoing } = await requestsRes.json();

      if (friends.some((friend: { username: string }) => friend.username === username)) {
        setRelationship('friend');
        loadResources();
        return;
      }

      const incomingMatch = incoming.find((req: FriendRequestSummary) => req.from?.username === username);
      if (incomingMatch) {
        setIncomingRequestId(incomingMatch._id);
        setRelationship('incoming-pending');
        return;
      }

      const outgoingMatch = outgoing.find((req: FriendRequestSummary) => req.to?.username === username);
      if (outgoingMatch) {
        setRelationship('outgoing-pending');
        return;
      }

      setRelationship('stranger');
    }

    determineRelationship();
  }, [sessionStatus, session, username]);

  async function loadResources() {
    const response = await fetch(`/api/resources?owner=${encodeURIComponent(username)}`);
    if (response.ok) {
      setResources(await response.json());
    }
  }

  async function sendFriendRequest() {
    setActionError('');
    const response = await fetch('/api/friend-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: username }),
    });
    const data = await response.json();
    if (!response.ok) {
      setActionError(data.error || 'Something went wrong.');
      return;
    }
    if (data.status === 'accepted') {
      setRelationship('friend');
      loadResources();
    } else {
      setRelationship('outgoing-pending');
    }
  }

  async function acceptFriendRequest() {
    if (!incomingRequestId) return;
    setActionError('');
    const response = await fetch(`/api/friend-requests/${incomingRequestId}`, { method: 'POST' });
    if (response.ok) {
      setRelationship('friend');
      loadResources();
    } else {
      const data = await response.json();
      setActionError(data.error || 'Something went wrong.');
    }
  }

  function handleDelete(id: string) {
    fetch(`/api/resources/${id}`, { method: 'DELETE' }).then(() => {
      setResources((prev) => prev.filter((resource) => resource._id !== id));
    });
  }

  return (
    <div className="ResourceList">
      <div className="ResourceList-banner">
        <h1 className="ResourceList-banner-title">{username}&apos;s shed</h1>
      </div>
      <div className="ResourceList-body">
        <div className="ResourceList-content">
          {relationship === 'logged-out' && (
            <p>log in to view sheds. <Link href="/login" className="nav-link inline">log in</Link></p>
          )}

          {relationship === 'stranger' && (
            <div>
              <p className="mb-4">you&apos;re not friends with {username} yet.</p>
              <button type="button" onClick={sendFriendRequest} className="nav-link">send friend request</button>
              {actionError && <p className="text-red-800 text-sm mt-2">{actionError}</p>}
            </div>
          )}

          {relationship === 'outgoing-pending' && (
            <p>friend request sent — waiting on {username} to accept.</p>
          )}

          {relationship === 'incoming-pending' && (
            <div>
              <p className="mb-4">{username} sent you a friend request.</p>
              <button type="button" onClick={acceptFriendRequest} className="nav-link">accept</button>
              {actionError && <p className="text-red-800 text-sm mt-2">{actionError}</p>}
            </div>
          )}

          {(relationship === 'self' || relationship === 'friend') && (
            <>
              {relationship === 'self' && (
                <div className="ResourceList-header">
                  <Link href="/resources/new" className="add-resource-btn">+ add a resource</Link>
                </div>
              )}
              <div className="ResourceList-list">
                {resources.length === 0 && <p>nothing in this shed quite yet.</p>}
                {resources.map((resource) =>
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    isOwner={relationship === 'self'}
                    onDelete={handleDelete}
                  />)}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center py-8">
        <Link href="/resources" className="add-resource-btn">&larr; back to resource list</Link>
      </div>
    </div>
  );
}
