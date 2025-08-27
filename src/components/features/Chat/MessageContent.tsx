import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageContentProps {
  content: string;
  enableMarkdown?: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ 
  content, 
  enableMarkdown = true 
}) => {
  // Simple text content if markdown is disabled
  if (!enableMarkdown) {
    return <div className="text-gray-300 break-words">{content}</div>;
  }

  // Enhanced message content with markdown support
  return (
    <div className="text-gray-300 break-words prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        components={{
          // Customize markdown elements for Discord-like styling
          p: ({ children }) => <p className="my-1">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
          code: ({ children }) => (
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-gray-100">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto my-2 border-l-4 border-gray-600">
              <code className="text-gray-200 text-sm font-mono">{children}</code>
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-3 ml-2 text-gray-400 italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside my-1 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside my-1 space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              {children}
            </a>
          ),
          h1: ({ children }) => <h1 className="text-xl font-bold text-white my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-white my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-white my-1">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-bold text-white my-1">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-bold text-white my-1">{children}</h5>,
          h6: ({ children }) => <h6 className="text-sm font-bold text-white my-1">{children}</h6>,
          hr: () => <hr className="border-gray-600 my-3" />,
          table: ({ children }) => (
            <table className="min-w-full border-collapse border border-gray-600 my-2">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-white font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-600 px-2 py-1 text-gray-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
