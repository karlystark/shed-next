"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ResourceCard from "../components/resourceCard/resourceCard";
import Filter from "../components/filter/filter";
import "./resources.css";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  quantity: number;
  category: string;
  owner: { username: string };
}

interface Friend {
  _id: string;
  username: string;
}

function Resources() {
  const { data: session, status } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      setLoading(false);
      setUnauthorized(true);
      return;
    }

    async function loadResources() {
      const [resourcesRes, friendsRes] = await Promise.all([
        fetch('/api/resources'),
        fetch('/api/friends'),
      ]);

      if (resourcesRes.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      const resourcesData = await resourcesRes.json();
      const friendsData = await friendsRes.json();
      setResources(resourcesData);
      setFilteredResources(resourcesData);
      setFriends(friendsData);
      setLoading(false);
    }
    loadResources();
  }, [status]);

  function filterSheds(username: string) {
    const filtered = resources.filter((resource) => resource.owner.username === username);
    setFilteredResources(filtered);
  }

  function filterResources(category: string) {
    const filtered = resources.filter((resource) => resource.category === category);
    setFilteredResources(filtered);
  }

  function resetFilter() {
    setFilteredResources(resources);
  }

  function handleDelete(id: string) {
    fetch(`/api/resources/${id}`, { method: 'DELETE' }).then(() => {
      const updated = resources.filter((resource) => resource._id !== id);
      setResources(updated);
      setFilteredResources((prev) => prev.filter((resource) => resource._id !== id));
    });
  }

  function handleExport() {
    const today = new Date().toLocaleDateString();
    const lines = filteredResources.map((resource) => {
      const description = resource.description ? ` — ${resource.description}` : '';
      return `${resource.title} (qty ${resource.quantity}, ${resource.category})${description} — ${resource.owner.username}'s shed`;
    });
    const content = `Shed resource list\nExported ${today}\n\n${lines.join('\n')}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shed-resources-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ResourceList">
      <div className="ResourceList-banner">
        <h1 className="ResourceList-banner-title"> shared resources </h1>
      </div>
      <div className="ResourceList-body">
        {unauthorized ? (
          <p>log in to see your network&apos;s resources.</p>
        ) : (
          <>
            <Filter
              filterResources={filterResources}
              filterSheds={filterSheds}
              resetFilter={resetFilter}
              friends={friends.map((friend) => friend.username)}
            />
            <div className="ResourceList-content">
              <div className="ResourceList-header">
                <Link href="/resources/new" className="add-resource-btn">+ add a resource</Link>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={filteredResources.length === 0}
                  className="add-resource-btn"
                >
                  export list
                </button>
              </div>
              <div className="ResourceList-list">
                {loading && <p>loading resources...</p>}
                {!loading && filteredResources.length === 0 && <p>no resources yet. add friends to see their shared resources.</p>}
                {filteredResources.map((resource) =>
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    isOwner={session?.user.username === resource.owner.username}
                    onDelete={handleDelete}
                  />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Resources;
