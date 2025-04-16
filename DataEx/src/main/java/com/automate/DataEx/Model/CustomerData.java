package com.automate.DataEx.Model;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String receiptNo;
    private String name;
    private String date;
    private String location;
    private String productName;
    private String tax;
    private String total;
    private Double rating;
    private Integer reviewCount;
    private Double sentimentalAnalysis;

    public CustomerData(String receiptNo, String name, String date, String location, String productName,
                        String tax, String total, Double rating, Integer reviewCount, Double sentimentalAnalysis) {
        this.receiptNo = receiptNo;
        this.name = name;
        this.date = date;
        this.location = location;
        this.productName = productName;
        this.tax = tax;
        this.total = total;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.sentimentalAnalysis = sentimentalAnalysis;
    }
}
