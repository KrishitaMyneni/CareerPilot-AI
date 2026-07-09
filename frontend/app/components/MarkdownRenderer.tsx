"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <article
      className="
        prose
        prose-lg
        max-w-none

        prose-headings:font-semibold
        prose-headings:text-gray-900

        prose-h1:text-3xl
        prose-h2:text-2xl
        prose-h3:text-xl

        prose-p:text-gray-600
        prose-strong:text-gray-900

        prose-ul:list-disc
        prose-ol:list-decimal
        prose-li:my-1
        prose-li:text-gray-600

        prose-a:text-emerald-600
        prose-a:no-underline
        hover:prose-a:underline

        prose-code:bg-gray-100
        prose-code:text-gray-900
        prose-code:px-1
        prose-code:rounded

        prose-pre:bg-gray-900
        prose-pre:text-gray-50

        prose-blockquote:border-emerald-500
        prose-blockquote:text-gray-600
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}