package com.automate.DataEx.Model;

public class ReviewCommentDTO {
    private String comment;
    private Double sentimentScore;
    private String sentimentLabel;

    public ReviewCommentDTO(String comment, Double sentimentScore, String sentimentLabel) {
        this.comment = comment;
        this.sentimentScore = sentimentScore;
        this.sentimentLabel = sentimentLabel;
    }

    // Getters and setters
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public String getSentimentLabel() {
        return sentimentLabel;
    }

    public void setSentimentLabel(String sentimentLabel) {
        this.sentimentLabel = sentimentLabel;
    }
}
