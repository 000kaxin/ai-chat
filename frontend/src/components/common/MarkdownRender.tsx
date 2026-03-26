import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRenderProps {
  content: string
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ content }) => {
  return (
    <div className="markdown-body prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, className, children, ...props }) {
            return (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm" {...props}>
                {children}
              </code>
            )
          },
          pre({ node, children, ...props }) {
            return (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-x-auto my-2" {...props}>
                {children}
              </pre>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRender
