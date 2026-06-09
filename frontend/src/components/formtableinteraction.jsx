import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useCallback } from "react";

export default function CareerlinkFormTable({ authToken, onFollowToggle }){
    let [ userData , setData ] = useState([]);
    let [ searchTerm, setSearchTerm ] = useState("");
    let [ followStates, setFollowStates ] = useState({});

    const fetchProfiles = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/api/profiles");
            if (response.ok) {
                const data = await response.json();
                setData(data);
                
                const currentUsername = localStorage.getItem("username");
                const states = {};
                data.forEach(profile => {
                    if (currentUsername && profile.connectedUsernames.includes(currentUsername)) {
                        states[profile.id] = "followed";
                    } else {
                        states[profile.id] = "unfollowed";
                    }
                });
                setFollowStates(states);
            }
        } catch (err) {
            console.error("Error fetching profiles from backend", err);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles, authToken]);


    const handleConnectClick = async (profileId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please Sign In in the sidebar to follow professionals.");
            return;
        }

        const currentState = followStates[profileId] || "unfollowed";
        if (currentState === "following-loading") return;

        setFollowStates(prev => ({ ...prev, [profileId]: "following-loading" }));

        try {
            const response = await fetch(`http://localhost:8080/api/profiles/${profileId}/connect`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                const currentUsername = localStorage.getItem("username");
                const isNowFollowing = updatedProfile.connectedUsernames.includes(currentUsername);
                
                setFollowStates(prev => ({ 
                    ...prev, 
                    [profileId]: isNowFollowing ? "followed" : "unfollowed" 
                }));
                
                fetchProfiles();
                if (onFollowToggle) {
                    onFollowToggle();
                }
            } else {
                setFollowStates(prev => ({ ...prev, [profileId]: currentState }));
                alert("Failed to toggle follow. Session might be expired.");
            }
        } catch (err) {
            console.error("Follow toggle API error", err);
            setFollowStates(prev => ({ ...prev, [profileId]: currentState }));
            alert("Could not toggle follow status on server.");
        }
    };

    const filteredUsers = userData.filter((profile) => {
        const query = searchTerm.toLowerCase();
        return profile.name.toLowerCase().includes(query) || profile.profession.toLowerCase().includes(query);
    });

    return(
        <Container className="my-5">
                <div className="glass-panel p-4">
                    <h3 className="mb-4 text-start fw-bold" style={{ color: "var(--accent-cyan)", letterSpacing: "0.05em" }}>Talent Profiles</h3>
                    
                    <div className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Search profiles by name or profession..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="custom-input w-100"
                        />
                    </div>

                    <div className="table-responsive">
                        <Table responsive hover className="custom-table mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Profession</th>
                              <th>Details</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((profile) => {
                                    const userId = profile.id;
                                    const cState = followStates[userId] || "unfollowed";
                                    
                                    let badgeClass = "badge-disconnected";
                                    let label = "Follow";
                                    if (cState === "following-loading") {
                                        badgeClass = "badge-connecting";
                                        label = "Following...";
                                    } else if (cState === "followed") {
                                        badgeClass = "badge-connected";
                                        label = "Unfollow";
                                    }

                                    const currentUsername = localStorage.getItem("username");
                                    const isSelf = currentUsername && profile.name.toLowerCase() === currentUsername.toLowerCase();

                                    return (
                                    <tr key={userId}>
                                        <th> {userId} </th>
                                        <td className="fw-semibold"> {profile.name} </td>
                                        <td> <span className="badge bg-secondary opacity-75">{profile.profession}</span> </td>
                                        <td> {profile.details} </td>
                                        <td> 
                                            {isSelf ? (
                                                <span className="connection-badge badge-connected" style={{ cursor: "default", opacity: 0.7 }}>
                                                    You
                                                </span>
                                            ) : (
                                                <span 
                                                    className={`connection-badge ${badgeClass}`}
                                                    onClick={() => handleConnectClick(userId)}
                                                >
                                                    {label}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-muted py-4">No profiles found in database. Sign in and register yours!</td>
                                </tr>
                            )}
                          </tbody>
                        </Table>
                    </div>
                </div>
        </Container>
    )
}


