import { useState, useEffect } from 'react';
import { getPendingReviews, approveReview } from '../services/api';

function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  // Fetch pending reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingReviews();
      setReviews(data.data || []);
    } catch (err) {
      setError('Failed to fetch reviews. Make sure the backend is running on port 3000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    if (!confirm('Are you sure you want to approve this review and post it to GitHub?')) {
      return;
    }

    try {
      setApprovingId(reviewId);
      const result = await approveReview(reviewId);
      
      if (result.success) {
        // Show success message
        alert('Review approved successfully!' + 
          (result.github.commentPosted 
            ? '\nComment posted to GitHub.' 
            : '\nNote: Could not post to GitHub. Check your GITHUB_TOKEN in .env')
        );
        
        // Remove approved review from the list
        setReviews(reviews.filter(review => review.id !== reviewId));
      }
    } catch (err) {
      alert('Failed to approve review: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 Instructor Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Review and approve student pull requests
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Card */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold text-blue-600">{reviews.length}</p>
            </div>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Reviews</h3>
            <p className="text-gray-500">All reviews have been processed. Great job! 🎉</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          PENDING
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Branch: <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{review.branchName}</code>
                      </h3>
                      <a
                        href={review.prLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        View Pull Request on GitHub
                      </a>
                    </div>
                  </div>

                  {/* AI Generated Feedback Box */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <h4 className="text-lg font-semibold text-purple-900">
                          🤖 AI Generated Feedback
                        </h4>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                          {review.feedbackContent}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleApprove(review.id)}
                      disabled={approvingId === review.id}
                      className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
                        approvingId === review.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {approvingId === review.id ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Approving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve & Post to GitHub
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
