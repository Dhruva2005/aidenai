package com.adenai.travelleavesystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TravelRequestDto {
    @NotNull
    private LocalDate fromDate;

    @NotNull
    private LocalDate toDate;

    @NotBlank
    private String fromLocation;

    @NotBlank
    private String destination;

    @NotBlank
    private String modeOfTransport;

    @NotBlank
    private String purposeOfTravel;

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public String getFromLocation() {
        return fromLocation;
    }

    public void setFromLocation(String fromLocation) {
        this.fromLocation = fromLocation;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getModeOfTransport() {
        return modeOfTransport;
    }

    public void setModeOfTransport(String modeOfTransport) {
        this.modeOfTransport = modeOfTransport;
    }

    public String getPurposeOfTravel() {
        return purposeOfTravel;
    }

    public void setPurposeOfTravel(String purposeOfTravel) {
        this.purposeOfTravel = purposeOfTravel;
    }
}
