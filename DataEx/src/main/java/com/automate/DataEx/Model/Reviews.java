package com.automate.DataEx.Model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "reviews")
public class Reviews {
    @Id
    private Long id;
    private String title;
    private String price;
    private Double rating;
    private Integer reviewCount;
    private Double sentimentalAnalysis;
}
