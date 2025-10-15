import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { z } from "zod";

type Props = {
  externalApiUrl: string;
  rawUserInput?: string;
};

const CommentSchema = z.object({
  id: z.number(),
  author: z.string().max(100),
  content: z.string().max(5000),
});

export const EscapingAndAttributeSafetyTest: React.FC<Props> = ({
  externalApiUrl,
  rawUserInput = "<img src=x onerror=alert('XSS')>",
}) => {
  const [apiData, setApiData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const resp = await fetch(externalApiUrl);
        if (!resp.ok) throw new Error("fetch failed");
        const json = await resp.json();
        setApiData(json);
      } catch (err: any) {
        setError(String(err));
      }
    }
    load();
  }, [externalApiUrl]);

  const sanitizedFromInput = DOMPurify.sanitize(rawUserInput);

  const validatedComment = (() => {
    const maybeComment = {
      id: 1,
      author: "Alice",
      content: "<b>Hi</b> from API",
    };

    const parsed = CommentSchema.safeParse(maybeComment);
    if (!parsed.success) return null;
    return parsed.data;
  })();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Escaping & Attribute Safety Test</h2>

      <section>
        <h3>Safe: Auto-escaped text rendering</h3>
        <p>
          Rendered as text (auto-escaped): {rawUserInput}
        </p>
      </section>

      <section>
        <h3>Safe: Sanitized HTML with DOMPurify</h3>
        <div
          data-testid="sanitized-html"
          dangerouslySetInnerHTML={{ __html: sanitizedFromInput }}
        />
      </section>

      <section>
        <h3>Safe: Normalized link href (attribute safety)</h3>
        {(() => {
          const unsafeHref = "javascript:alert('XSS')";
          const isAllowed = /^https?:\/\//i.test(unsafeHref) || /^mailto:/i.test(unsafeHref);
          const safeHref = isAllowed ? unsafeHref : "about:blank";
          return (
            <a href={safeHref} rel="noopener noreferrer" target="_blank">
              External link (normalized)
            </a>
          );
        })()}
      </section>

      <section>
        <h3>Safe: Schema-validated API data rendered as text</h3>
        {error && <div>Error: {error}</div>}
        {!apiData && !error && <div>Loading API data...</div>}
        {apiData && (
          <div>
            <div>API title: {String(apiData.title ?? "n/a")}</div>
            <div>API description: {String(apiData.description ?? "n/a")}</div>
          </div>
        )}
        {validatedComment && (
          <div>
            <div>Author: {validatedComment.author}</div>
            <div>Content (escaped): {validatedComment.content}</div>
          </div>
        )}
      </section>

      <section data-testid="inert-violations" style={{ opacity: 0.95 }}>
        <h3>Inert examples your scanner should flag</h3>

        {false && (
          <div dangerouslySetInnerHTML={{ __html: rawUserInput }} />
        )}

        {false && (() => {
          const el = document.createElement("div");
          el.innerHTML = (rawUserInput as unknown) as string; 
          return null;
        })()}

        {false && (
          <a
            href={(rawUserInput as unknown) as string}
          >
            Dangerous link (inert)
          </a>
        )}
      </section>

      <footer style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        Notes:
        <ul>
          <li>React auto-escapes string interpolations like <code>{`{value}`}</code>.</li>
          <li>Use schema validation, attribute normalization, and DOMPurify for safe HTML rendering.</li>
          <li>
            The inert blocks above are intentionally present so static detectors can find the insecure
            patterns without executing them.
          </li>
        </ul>
      </footer>
    </div>
  );
};
