import CareerlinkForm from "./form";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useCallback } from "react";

export default function CareerlinkFormTable({ authToken, onConnectionToggle }){
    let [ userData , setData ] = useState([]);
    let [ searchTerm, setSearchTerm ] = useState("");
    let [ connectionStates, setConnectionStates ] = useState({});

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
                        states[profile.id] = "connected";
                    } else {
                        states[profile.id] = "disconnected";
                    }
                });
                setConnectionStates(states);
            }
        } catch (err) {
            console.error("Error fetching profiles from backend", err);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles, authToken]);

    let updateTable = async (name, proff, details) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please Sign In in the sidebar before adding your profile.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/profiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, profession: proff, details })
            });

            if (response.ok) {
                fetchProfiles();
            } else {
                const errData = await response.json();
                alert(errData.error || "Failed to create profile. Ensure inputs are valid.");
            }
        } catch (err) {
            console.error("Error adding profile to backend", err);
            alert("Could not connect to backend to save profile.");
        }
    }

    const handleConnectClick = async (profileId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please Sign In in the sidebar to establish professional connections.");
            return;
        }

        const currentState = connectionStates[profileId] || "disconnected";
        if (currentState === "connecting") return;

        setConnectionStates(prev => ({ ...prev, [profileId]: "connecting" }));

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
                const isNowConnected = updatedProfile.connectedUsernames.includes(currentUsername);
                
                setConnectionStates(prev => ({ 
                    ...prev, 
                    [profileId]: isNowConnected ? "connected" : "disconnected" 
                }));
                
                fetchProfiles();
                if (onConnectionToggle) {
                    onConnectionToggle();
                }
            } else {
                setConnectionStates(prev => ({ ...prev, [profileId]: currentState }));
                alert("Failed to toggle connection. Session might be expired.");
            }
        } catch (err) {
            console.error("Connection toggle API error", err);
            setConnectionStates(prev => ({ ...prev, [profileId]: currentState }));
            alert("Could not toggle connection status on server.");
        }
    };

    const filteredUsers = userData.filter((profile) => {
        const query = searchTerm.toLowerCase();
        return profile.name.toLowerCase().includes(query) || profile.profession.toLowerCase().includes(query);
    });

    return(
        <>
            <CareerlinkForm addRowData={([name,proff,det])=>{updateTable(name,proff,det)}}/>
            
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
                                    const cState = connectionStates[userId] || "disconnected";
                                    
                                    let badgeClass = "badge-disconnected";
                                    let label = "Connect";
                                    if (cState === "connecting") {
                                        badgeClass = "badge-connecting";
                                        label = "Connecting...";
                                    } else if (cState === "connected") {
                                        badgeClass = "badge-connected";
                                        label = "Connected";
                                    }

                                    return (
                                    <tr key={userId}>
                                        <th> {userId} </th>
                                        <td className="fw-semibold"> {profile.name} </td>
                                        <td> <span className="badge bg-secondary opacity-75">{profile.profession}</span> </td>
                                        <td> {profile.details} </td>
                                        <td> 
                                            <span 
                                                className={`connection-badge ${badgeClass}`}
                                                onClick={() => handleConnectClick(userId)}
                                            >
                                                {label}
                                            </span>
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
        </>
    )
}


