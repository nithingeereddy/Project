package com.automate.DataEx.Repository;
import com.automate.DataEx.Model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {
}
