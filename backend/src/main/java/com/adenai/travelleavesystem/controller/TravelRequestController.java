package com.adenai.travelleavesystem.controller;

import com.adenai.travelleavesystem.dto.RejectRequest;
import com.adenai.travelleavesystem.dto.TravelRequestDto;
import com.adenai.travelleavesystem.dto.TravelRequestResponse;
import com.adenai.travelleavesystem.model.TravelRequestStatus;
import com.adenai.travelleavesystem.security.UserPrincipal;
import com.adenai.travelleavesystem.service.TravelRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/travel")
public class TravelRequestController {

    @Autowired
    private TravelRequestService travelRequestService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER')")
    public ResponseEntity<TravelRequestResponse> createTravelRequest(
            @Valid @RequestBody TravelRequestDto requestDto,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        TravelRequestResponse response = travelRequestService.createTravelRequest(requestDto, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/myrequests")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER')")
    public ResponseEntity<List<TravelRequestResponse>> getMyRequests(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<TravelRequestResponse> requests = travelRequestService.getEmployeeRequests(userPrincipal.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<TravelRequestResponse>> getAllRequests(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        List<TravelRequestResponse> requests;
        if (status != null) {
            TravelRequestStatus requestStatus = TravelRequestStatus.valueOf(status.toUpperCase());
            requests = travelRequestService.getManagerRequestsByStatus(userPrincipal.getId(), requestStatus);
        } else {
            requests = travelRequestService.getManagerRequests(userPrincipal.getId());
        }
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER')")
    public ResponseEntity<TravelRequestResponse> getRequestById(@PathVariable Long id) {
        return travelRequestService.getRequestById(id)
                .map(request -> ResponseEntity.ok(request))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TravelRequestResponse> approveRequest(
            @PathVariable Long id,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        try {
            TravelRequestResponse response = travelRequestService.approveRequest(id, userPrincipal.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TravelRequestResponse> rejectRequest(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequest rejectRequest,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        try {
            TravelRequestResponse response = travelRequestService.rejectRequest(id, userPrincipal.getId(), rejectRequest.getReason());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
