package com.adenai.travelleavesystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "travel_requests")
public class TravelRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private User employee;

    @NotNull
    @Column(name = "from_date")
    private LocalDate fromDate;

    @NotNull
    @Column(name = "to_date")
    private LocalDate toDate;

    @NotBlank
    @Column(name = "from_location")
    private String fromLocation;

    @NotBlank
    private String destination;

    @NotBlank
    @Column(name = "mode_of_transport")
    private String modeOfTransport;

    @NotBlank
    @Column(name = "purpose_of_travel", columnDefinition = "TEXT")
    private String purposeOfTravel;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TravelRequestStatus status = TravelRequestStatus.PENDING;

    @Column(name = "days_requested")
    private Integer daysRequested;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public TravelRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Calculate days requested automatically
    public void calculateDaysRequested() {
        if (fromDate != null && toDate != null) {
            this.daysRequested = (int) ChronoUnit.DAYS.between(fromDate, toDate) + 1;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
        calculateDaysRequested();
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
        calculateDaysRequested();
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

    public TravelRequestStatus getStatus() {
        return status;
    }

    public void setStatus(TravelRequestStatus status) {
        this.status = status;
    }

    public Integer getDaysRequested() {
        return daysRequested;
    }

    public void setDaysRequested(Integer daysRequested) {
        this.daysRequested = daysRequested;
    }

    public Long getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(Long approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
