// components/FeedbackWidget.tsx
'use client'

import React, { useState } from 'react';
import { MessageSquarePlus, X, CheckCircle } from 'lucide-react';
import { config } from '@/lib/sfconfig';

interface FeedbackWidgetProps {
  baseUrl?: string;
  apiKey?: string;
  projectId?: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ 
  baseUrl = config.squashfeatureBaseUrl,
  apiKey = config.squashfeatureApiKey,
  projectId = config.squashfeatureProjectId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'feature' | 'bug'>('feature');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setError(null);
    setType('feature');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const origin = window.location.origin;
      
      const response = await fetch(`${baseUrl}/api/projects/self-hosted/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'X-Project-Id': projectId,
          'Origin': origin
        },
        body: JSON.stringify({
          type,
          title,
          description,
          metadata: {
            source: 'widget',
            origin
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      resetForm();
      setShowSuccess(true);
      
      // Hide success message and close widget after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all"
        aria-label="Open feedback form"
      >
        <MessageSquarePlus className="w-6 h-6" />
      </button>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed bottom-4 right-4 w-96 bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h2 className="text-xl font-semibold text-white">Thank You!</h2>
          <p className="text-zinc-300">
            {type === 'feature' 
              ? "Your feature request has been received. We appreciate your ideas for making our product better!"
              : "Thanks for reporting this bug. Your feedback helps us improve the experience for everyone!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-zinc-900 rounded-lg shadow-xl border border-zinc-700">
      <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Share Feedback</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label="Close feedback form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('feature')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              type === 'feature'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Feature Request
          </button>
          <button
            type="button"
            onClick={() => setType('bug')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              type === 'bug'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Bug Report
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            placeholder="Brief description of your feedback"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            rows={3}
            placeholder="Provide more details here"
            required
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackWidget;