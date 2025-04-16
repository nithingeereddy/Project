package com.automate.DataEx.Model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_comments")
public class ReviewComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_title")
    private String productTitle;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "sentiment_score")
    private Double sentimentScore;

    @Column(name = "sentiment_label")
    private String sentimentLabel;

    public ReviewComment(){

    }

    public ReviewComment(LocalDateTime createdAt, String sentimentLabel, Double sentimentScore, String comment, String productTitle) {
        this.createdAt = createdAt;
        this.sentimentLabel = sentimentLabel;
        this.sentimentScore = sentimentScore;
        this.comment = comment;
        this.productTitle = productTitle;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getSentimentLabel() {
        return sentimentLabel;
    }

    public void setSentimentLabel(String sentimentLabel) {
        this.sentimentLabel = sentimentLabel;
    }

    public Double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
