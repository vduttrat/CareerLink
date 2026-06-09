import { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import profileicon from "./profileicon.png";

export default function Following({ authToken, updateTrigger }) {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    const fetchFollowing = useCallback(async () => {
        const token = localStorage.getItem("token");
        const currentUsername = localStorage.getItem("username");

        if (!token || !currentUsername) {
            setFollowing([]);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/profiles", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const allProfiles = await response.json();

                const myFollowing = allProfiles.filter(profile =>
                    profile.connectedUsernames && profile.connectedUsernames.includes(currentUsername)
                );
                setFollowing(myFollowing);
            }
        } catch (err) {
            console.error("Failed to fetch following", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFollowing();
    }, [fetchFollowing, authToken, updateTrigger]);

    const handleDownloadResume = async (profileId, profileName) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please sign in to download resumes.");
            return;
        }

        setDownloadingId(profileId);

        try {
            const response = await fetch(`http://localhost:8080/api/profiles/${profileId}/resume`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;

                
                const disposition = response.headers.get("Content-Disposition");
                let filename = `${profileName}_resume.pdf`;
                if (disposition) {
                    const match = disposition.match(/filename="?([^"]+)"?/);
                    if (match) filename = match[1];
                }

                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const errData = await response.json();
                alert(errData.error || "Failed to download resume.");
            }
        } catch (err) {
            console.error("Resume download error", err);
            alert("Could not download resume. Please try again.");
        } finally {
            setDownloadingId(null);
        }
    };

    const isLoggedIn = !!authToken;

    return (
        <Container>
            <div className="glass-panel p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h3 className="mb-0 fw-bold" style={{ color: "var(--accent-cyan)", letterSpacing: "0.05em" }}>
                        Following
                    </h3>
                    <span className="badge" style={{
                        background: "linear-gradient(135deg, rgba(0,242,254,0.2), rgba(79,172,254,0.2))",
                        color: "var(--accent-cyan)",
                        fontSize: "0.85rem",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid rgba(0,242,254,0.3)"
                    }}>
                        {following.length} following
                    </span>
                </div>

                {!isLoggedIn ? (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">Sign in to see who you're following</p>
                    </div>
                ) : loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-3">Loading...</p>
                    </div>
                ) : following.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">Not following anyone yet</p>
                        <p className="text-muted small">Visit the Profiles section and follow professionals to see them here.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {following.map((profile) => (
                            <div key={profile.id} className="col-12 col-sm-6 col-lg-4">
                                <div className="connection-card h-100">
                                    <div className="text-center mb-3">
                                        <img
                                            src={profileicon}
                                            alt={`${profile.name}'s avatar`}
                                            className="rounded-circle"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                padding: "4px",
                                                backgroundColor: "rgba(255,255,255,0.08)",
                                                border: "2px solid rgba(0,242,254,0.3)",
                                                boxShadow: "0 0 20px rgba(0,242,254,0.15)"
                                            }}
                                        />
                                    </div>
                                    <h5 className="fw-bold text-light text-center mb-1">{profile.name}</h5>
                                    <p className="text-center mb-2">
                                        <span className="badge bg-secondary opacity-75">{profile.profession}</span>
                                    </p>
                                    <p className="text-muted small text-center mb-3" style={{ lineHeight: "1.5" }}>
                                        {profile.details}
                                    </p>
                                    <div className="text-center mt-auto">
                                        <span className="connection-badge badge-connected mb-2 d-inline-block">
                                            Following
                                        </span>
                                        {profile.hasResume && (
                                            <button
                                                className="btn btn-sm w-100 mt-2"
                                                onClick={() => handleDownloadResume(profile.id, profile.name)}
                                                disabled={downloadingId === profile.id}
                                                style={{
                                                    background: "linear-gradient(135deg, rgba(0,242,254,0.15), rgba(79,172,254,0.15))",
                                                    color: "var(--accent-cyan)",
                                                    border: "1px solid rgba(0,242,254,0.3)",
                                                    borderRadius: "8px",
                                                    padding: "8px 16px",
                                                    fontSize: "0.85rem",
                                                    fontWeight: "600",
                                                    transition: "all 0.3s ease",
                                                    cursor: downloadingId === profile.id ? "wait" : "pointer"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = "linear-gradient(135deg, rgba(0,242,254,0.3), rgba(79,172,254,0.3))";
                                                    e.target.style.boxShadow = "0 0 15px rgba(0,242,254,0.2)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = "linear-gradient(135deg, rgba(0,242,254,0.15), rgba(79,172,254,0.15))";
                                                    e.target.style.boxShadow = "none";
                                                }}
                                            >
                                                {downloadingId === profile.id ? "Downloading..." : "Download Resume"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
}
