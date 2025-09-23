import React, { useState } from "react";

const ExpertInviteAccept = () => {
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Get token from URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("http://localhost:8000/api/accounts/invite/expert/accept/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Account created! You can now log in.");
    } else {
      setMessage(data.error || "Something went wrong.");
    }
    setLoading(false);
  };

  if (!token) {
    return <div>Invalid or missing invite token.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Accept Expert Invite</h2>
      <input
        type="password"
        placeholder="Choose a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      /><br />
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Accept Invite"}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default ExpertInviteAccept;
