import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';

const sentimentColor = (label) => {
  switch (label.toLowerCase()) {
    case 'positive': return 'bg-green-100 text-green-700';
    case 'neutral': return 'bg-yellow-100 text-yellow-700';
    case 'negative': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const TopReviews = () => {
  const [reviewData, setReviewData] = useState({});
  const [openProduct, setOpenProduct] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/reviews/top-comments')
      .then((res) => setReviewData(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  const toggleDropdown = (product) => {
    setOpenProduct(prev => prev === product ? null : product);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Top Product Review Comments</h1>

      {Object.entries(reviewData).map(([product, comments]) => (
        <div key={product} className="mb-3 border rounded-lg shadow transition-all duration-300">
          <button
            className="w-full flex justify-between items-center px-4 py-3 bg-blue-100 hover:bg-blue-200 text-left text-blue-900 font-medium text-lg rounded-t-lg focus:outline-none"
            onClick={() => toggleDropdown(product)}
          >
            {product}
            {openProduct === product ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openProduct === product && (
            <div className="bg-white p-4 space-y-4 rounded-b-lg transition-all duration-300">
              {comments.map((comment, idx) => (
                <div key={idx} className="border rounded-md p-4 bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${sentimentColor(comment.sentimentLabel)}`}>
                      {comment.sentimentLabel.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">Score: {comment.sentimentScore.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed italic">“{comment.comment}”</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TopReviews;
