package com.automate.DataEx.Controller;

import com.automate.DataEx.Model.ReviewComment;
import com.automate.DataEx.Model.ReviewCommentDTO;
import com.automate.DataEx.Repository.ReviewCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
//@CrossOrigin(origins = "*")
public class ReviewCommentController {

    @Autowired
    private ReviewCommentRepository reviewCommentRepository;


    @GetMapping("/top-comments")
    public Map<String, List<ReviewCommentDTO>> getTop3CommentsPerProduct() {
        List<ReviewComment> allComments = reviewCommentRepository.findAll();

        // Group by product and sort by score
        Map<String, List<ReviewCommentDTO>> topCommentsPerProduct = allComments.stream()
                .collect(Collectors.groupingBy(
                        ReviewComment::getProductTitle,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.stream()
                                        .sorted(Comparator.comparingDouble(ReviewComment::getSentimentScore).reversed())
                                        .limit(3)
                                        .map(c -> new ReviewCommentDTO(c.getComment(), c.getSentimentScore(), c.getSentimentLabel()))
                                        .collect(Collectors.toList())
                        )
                ));

        return topCommentsPerProduct;
    }

}
