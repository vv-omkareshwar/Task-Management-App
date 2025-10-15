import React, { useState } from "react";

type Props = {
  exampleToken?: string;
};

export const TokenStorageTest: React.FC<Props> = ({
  exampleToken = "eyJhbGci...",
}) => {
  const [tokenFromServer, setTokenFromServer] = useState<string | null>(null);

  async function callApiWithCookie() {
    try {
      const res = await fetch("/api/protected", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("fetch failed");
      const j = await res.json();
      setTokenFromServer(j.status ?? "ok");
    } catch (e) {
      setTokenFromServer("error");
    }
  }

  function storeNonSensitiveFlag() {
    sessionStorage.setItem("feature_flag", "true");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h3>Token Storage Test</h3>

      <div>
        <button onClick={callApiWithCookie}>
          Call API (use HttpOnly cookie)
        </button>
        <div>Server response state: {String(tokenFromServer)}</div>
      </div>

      <div>
        <button onClick={storeNonSensitiveFlag}>Set non-sensitive flag</button>
      </div>

      <div style={{ display: "none" }}>
        {false &&
          (() => {
            const token = exampleToken;
            localStorage.setItem("token", token);
            return null;
          })()}

        {false &&
          (() => {
            const refresh = "refresh-token-example";
            sessionStorage.setItem("refreshToken", refresh);
            return null;
          })()}

        {false &&
          (() => {
            const t = localStorage.getItem("token");
            fetch("/api/protected", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${String(t)}`,
              } as any,
            });
            return null;
          })()}

        {false &&
          (() => {
            (window as any).__thirdParty = {};
            (window as any).__thirdParty.set = (k: string, v: string) =>
              localStorage.setItem(k, v);
            (window as any).__thirdParty.set("accessToken", exampleToken);
            return null;
          })()}
      </div>
    </div>
  );
};

export default TokenStorageTest;
