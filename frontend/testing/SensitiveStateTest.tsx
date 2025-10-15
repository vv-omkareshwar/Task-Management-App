import React, { useState } from "react";

type Props = {
  exampleSecret?: string;
};

export const SensitiveStateTest: React.FC<Props> = ({
  exampleSecret = "sk_test_XXXXXXXXXXXXXXXX",
}) => {
  const [status, setStatus] = useState<string | null>(null);

  function handleLoginResponseTransient(token: string) {
    const transientToken = token;
    void (async () => {
      try {
        await fetch("/api/do-something", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${transientToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "ok" }),
        });
        setStatus("done");
      } catch {
        setStatus("error");
      } finally {
      }
    })();
  }

  function simulateLogin() {
    handleLoginResponseTransient(exampleSecret);
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h3>Sensitive State Test</h3>
      <div>
        <button onClick={simulateLogin}>
          Simulate login (transient handling)
        </button>
        <div>Status: {String(status)}</div>
      </div>

      <div style={{ display: "none" }}>
        {false &&
          (() => {
            const [password, setPassword] = useState("");
            setPassword("p@ssw0rd");
            return null;
          })()}

        {false &&
          (() => {
            const [authToken, setAuthToken] = useState<string | null>(null);
            setAuthToken(exampleSecret);
            return null;
          })()}

        {false &&
          (() => {
            localStorage.setItem("user_email", "victim@example.com");
            return null;
          })()}

        {false &&
          (() => {
            (window as any).APP_SECRET = exampleSecret;
            return null;
          })()}

        {false &&
          (() => {
            const sensitive = { ssn: "111-22-3333", card: "4111111111111111" };
            console.log("sensitive", sensitive);
            return null;
          })()}
      </div>
    </div>
  );
};

export default SensitiveStateTest;
