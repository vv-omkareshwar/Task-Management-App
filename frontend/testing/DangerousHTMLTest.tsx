// File: DangerousHTMLTest.tsx
import React from "react";
import DOMPurify from "dompurify";

interface Props {
  userInput: string;
  safeHtml: string;
}

export const DangerousHTMLTest: React.FC<Props> = ({ userInput, safeHtml }) => {
  const staticHtml = "<p>Welcome to the secure area!</p>";

  const sanitizedHtml = DOMPurify.sanitize(userInput);
  const potentiallyUnsafeHtml = userInput;

  return (
    <div className="grid gap-4">
      <section dangerouslySetInnerHTML={{ __html: staticHtml }} />
      <section dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

      <section data-testid="unsafe-block">
        {false && (
          <div dangerouslySetInnerHTML={{ __html: potentiallyUnsafeHtml }} />
        )}
      </section>
    </div>
  );
};
