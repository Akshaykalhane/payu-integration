import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Status() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div>
      {status === "success" && <p>✅ Payment Successful!</p>}
      {status === "fail" && <p>❌ Payment Failed!</p>}
      {!status && <p>ℹ️ No status provided.</p>}
    </div>
  );
}
