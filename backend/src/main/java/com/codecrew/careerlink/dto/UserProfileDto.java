package com.codecrew.careerlink.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public class UserProfileDto {
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Profession cannot be blank")
    private String profession;

    @NotBlank(message = "Details cannot be blank")
    private String details;

    private Set<String> connectedUsernames;

    public UserProfileDto() {}

    public UserProfileDto(Long id, String name, String profession, String details, Set<String> connectedUsernames) {
        this.id = id;
        this.name = name;
        this.profession = profession;
        this.details = details;
        this.connectedUsernames = connectedUsernames;
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
}
