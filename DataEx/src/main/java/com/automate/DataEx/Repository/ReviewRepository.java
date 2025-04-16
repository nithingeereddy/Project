package com.automate.DataEx.Repository;
import java.util.*;
import com.automate.DataEx.Model.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Reviews, Long> {
    List<Reviews> findAll();
}
