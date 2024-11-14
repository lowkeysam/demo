// components/SelfHostedDashboard.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { config } from '@/lib/sfconfig';

interface Request {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'bug';
  status: string;
  votes: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
  tags?: string[];
}

interface DashboardData {
  project: {
    id: string;
    name: string;
  };
  requests: Request[];
}

interface SelfHostedDashboardProps {
  baseUrl: string;
  apiKey: string;
  projectId: string; 
}

export default function SelfHostedDashboard({ 
    baseUrl = config.squashfeatureBaseUrl,
    apiKey = config.squashfeatureApiKey,
    projectId = config.squashfeatureProjectId
  }: SelfHostedDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'feature' | 'bug'>('all');
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDashboard();
    // Load voted items from localStorage
    const savedVotes = localStorage.getItem(`votes-${projectId}`); 
    if (savedVotes) {
      setVotedItems(new Set(JSON.parse(savedVotes)));
    }
  }, [projectId]); 

  const fetchDashboard = async () => {
    try {
      setError(null);
      const origin = window.location.origin;
      
      const response = await fetch(
        `${baseUrl}/api/projects/self-hosted/dashboard`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
            'X-Project-Id': projectId,
            'Origin': origin
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }
  
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };


  const handleVote = async (requestId: string) => {
    if (votedItems.has(requestId)) return;
  
    try {
      const origin = window.location.origin;
      const response = await fetch(
        `${baseUrl}/api/projects/self-hosted/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
            'X-Project-Id': projectId,
            'Origin': origin
          },
          body: JSON.stringify({ requestId })
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }
  
      const result = await response.json();
  
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          requests: prev.requests.map(request =>
            request.id === requestId
              ? { ...request, votes: result.votes }
              : request
          )
        } : null);
  
        const newVotes = new Set(votedItems);
        newVotes.add(requestId);
        setVotedItems(newVotes);
        localStorage.setItem(
          `votes-${projectId}`,
          JSON.stringify([...newVotes])
        );
      }
    } catch (error) {
      console.error('Error voting:', error);
      setError(error instanceof Error ? error.message : 'Failed to vote');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data found
      </div>
    );
  }

  const filteredRequests = data.requests.filter(request =>
    activeTab === 'all' || request.type === activeTab
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{data.project.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            All ({data.requests.length})
          </button>
          <button
            onClick={() => setActiveTab('feature')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'feature'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Features ({data.requests.filter(r => r.type === 'feature').length})
          </button>
          <button
            onClick={() => setActiveTab('bug')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'bug'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Bugs ({data.requests.filter(r => r.type === 'bug').length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map(request => (
          <div
            key={request.id}
            className="border rounded-lg p-4 bg-card shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    request.type === 'feature'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {request.type}
                </span>
                <h3 className="mt-2 text-lg font-medium">{request.title}</h3>
                <p className="mt-1 text-muted-foreground">{request.description}</p>
              </div>
              <button
                onClick={() => handleVote(request.id)}
                disabled={votedItems.has(request.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  votedItems.has(request.id)
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{request.votes}</span>
              </button>
            </div>
            {request.createdAt && (
              <div className="mt-2 text-sm text-muted-foreground">
                {new Date(request.createdAt.seconds * 1000).toLocaleDateString()}
              </div>
            )}
            {request.tags && request.tags.length > 0 && (
              <div className="mt-2 flex gap-1">
                {request.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full text-xs bg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No feedback found
          </div>
        )}
      </div>
    </div>
  );
}