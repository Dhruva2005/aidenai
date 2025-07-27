package com.adenai.travelleavesystem.repository;

import com.adenai.travelleavesystem.model.TravelRequest;
import com.adenai.travelleavesystem.model.TravelRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TravelRequestRepository extends JpaRepository<TravelRequest, Long> {
    
    List<TravelRequest> findByEmployeeId(Long employeeId);
    
    List<TravelRequest> findByStatus(TravelRequestStatus status);
    
    @Query("SELECT tr FROM TravelRequest tr JOIN tr.employee e WHERE e.managerId = :managerId")
    List<TravelRequest> findByManagerId(@Param("managerId") Long managerId);
    
    @Query("SELECT tr FROM TravelRequest tr JOIN tr.employee e WHERE e.managerId = :managerId AND tr.status = :status")
    List<TravelRequest> findByManagerIdAndStatus(@Param("managerId") Long managerId, @Param("status") TravelRequestStatus status);
}
