package com.automate.DataEx.Repository;
import com.automate.DataEx.Model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerDataRepository extends JpaRepository<CustomerData,Long>{
}
