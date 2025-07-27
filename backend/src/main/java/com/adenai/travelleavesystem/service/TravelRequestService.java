package com.adenai.travelleavesystem.service;

import com.adenai.travelleavesystem.dto.TravelRequestDto;
import com.adenai.travelleavesystem.dto.TravelRequestResponse;
import com.adenai.travelleavesystem.model.TravelRequest;
import com.adenai.travelleavesystem.model.TravelRequestStatus;
import com.adenai.travelleavesystem.model.User;
import com.adenai.travelleavesystem.repository.TravelRequestRepository;
import com.adenai.travelleavesystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TravelRequestService {

    @Autowired
    private TravelRequestRepository travelRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public TravelRequestResponse createTravelRequest(TravelRequestDto requestDto, Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        TravelRequest travelRequest = new TravelRequest();
        travelRequest.setEmployee(employee);
        travelRequest.setFromDate(requestDto.getFromDate());
        travelRequest.setToDate(requestDto.getToDate());
        travelRequest.setFromLocation(requestDto.getFromLocation());
        travelRequest.setDestination(requestDto.getDestination());
        travelRequest.setModeOfTransport(requestDto.getModeOfTransport());
        travelRequest.setPurposeOfTravel(requestDto.getPurposeOfTravel());
        travelRequest.calculateDaysRequested();

        // Check if employee has enough leaves
        if (employee.getLeavesLeft() < travelRequest.getDaysRequested()) {
            throw new RuntimeException("Insufficient leave balance. Available: " + employee.getLeavesLeft() + 
                                     ", Required: " + travelRequest.getDaysRequested());
        }

        TravelRequest savedRequest = travelRequestRepository.save(travelRequest);
        return convertToResponse(savedRequest);
    }

    public List<TravelRequestResponse> getEmployeeRequests(Long employeeId) {
        List<TravelRequest> requests = travelRequestRepository.findByEmployeeId(employeeId);
        return requests.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<TravelRequestResponse> getAllRequests() {
        List<TravelRequest> requests = travelRequestRepository.findAll();
        return requests.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<TravelRequestResponse> getRequestsByStatus(TravelRequestStatus status) {
        List<TravelRequest> requests = travelRequestRepository.findByStatus(status);
        return requests.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<TravelRequestResponse> getManagerRequests(Long managerId) {
        List<TravelRequest> requests = travelRequestRepository.findByManagerId(managerId);
        return requests.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<TravelRequestResponse> getManagerRequestsByStatus(Long managerId, TravelRequestStatus status) {
        List<TravelRequest> requests = travelRequestRepository.findByManagerIdAndStatus(managerId, status);
        return requests.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public Optional<TravelRequestResponse> getRequestById(Long id) {
        return travelRequestRepository.findById(id)
                .map(this::convertToResponse);
    }

    @Transactional
    public TravelRequestResponse approveRequest(Long requestId, Long managerId) {
        TravelRequest request = travelRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Travel request not found"));

        if (request.getStatus() != TravelRequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }

        // Update request status
        request.setStatus(TravelRequestStatus.APPROVED);
        request.setApprovedBy(managerId);
        request.setApprovedAt(LocalDateTime.now());

        // Deduct leaves from employee
        User employee = request.getEmployee();
        employee.setLeavesLeft(employee.getLeavesLeft() - request.getDaysRequested());
        userRepository.save(employee);

        TravelRequest savedRequest = travelRequestRepository.save(request);
        return convertToResponse(savedRequest);
    }

    @Transactional
    public TravelRequestResponse rejectRequest(Long requestId, Long managerId, String rejectionReason) {
        TravelRequest request = travelRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Travel request not found"));

        if (request.getStatus() != TravelRequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }

        // Update request status
        request.setStatus(TravelRequestStatus.REJECTED);
        request.setApprovedBy(managerId);
        request.setApprovedAt(LocalDateTime.now());
        request.setRejectionReason(rejectionReason);

        TravelRequest savedRequest = travelRequestRepository.save(request);
        return convertToResponse(savedRequest);
    }

    private TravelRequestResponse convertToResponse(TravelRequest request) {
        TravelRequestResponse response = new TravelRequestResponse();
        response.setId(request.getId());
        response.setEmployeeFirstName(request.getEmployee().getFirstName());
        response.setEmployeeLastName(request.getEmployee().getLastName());
        response.setFromDate(request.getFromDate());
        response.setToDate(request.getToDate());
        response.setFromLocation(request.getFromLocation());
        response.setDestination(request.getDestination());
        response.setModeOfTransport(request.getModeOfTransport());
        response.setPurposeOfTravel(request.getPurposeOfTravel());
        response.setStatus(request.getStatus());
        response.setDaysRequested(request.getDaysRequested());
        response.setEmployeeLeavesLeft(request.getEmployee().getLeavesLeft());
        response.setCreatedAt(request.getCreatedAt());
        response.setApprovedAt(request.getApprovedAt());
        response.setRejectionReason(request.getRejectionReason());

        // Set manager information if available
        if (request.getEmployee().getManagerId() != null) {
            userRepository.findById(request.getEmployee().getManagerId()).ifPresent(manager -> {
                response.setManagerFirstName(manager.getFirstName());
                response.setManagerUsername(manager.getEmail());
            });
        }

        return response;
    }
}
