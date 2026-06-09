package com.codecrew.careerlink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Profession is required")
    @Column(nullable = false)
    private String profession;

    @NotBlank(message = "Details are required")
    @Column(nullable = false)
    private String details;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profile_connections", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "username")
    private Set<String> connectedUsernames = new HashSet<>();

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] resumeData;

    private String resumeFilename;

    public UserProfile() {}

    public UserProfile(String name, String profession, String details) {
        this.name = name;
        this.profession = profession;
        this.details = details;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Set<String> getConnectedUsernames() {
        return connectedUsernames;
    }

    public void setConnectedUsernames(Set<String> connectedUsernames) {
        this.connectedUsernames = connectedUsernames;
    }

    public byte[] getResumeData() {
        return resumeData;
    }

    public void setResumeData(byte[] resumeData) {
        this.resumeData = resumeData;
    }

    public String getResumeFilename() {
        return resumeFilename;
    }

    public void setResumeFilename(String resumeFilename) {
        this.resumeFilename = resumeFilename;
    }
}
