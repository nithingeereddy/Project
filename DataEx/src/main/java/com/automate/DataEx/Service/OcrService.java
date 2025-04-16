package com.automate.DataEx.Service;
import com.automate.DataEx.Model.*;
import com.automate.DataEx.Repository.ReviewRepository;
import net.sourceforge.tess4j.Tesseract;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import com.automate.DataEx.Repository.CustomerDataRepository;
import org.springframework.stereotype.Service;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.io.BufferedReader;
import java.io.InputStreamReader;


@Service
    public class OcrService {
        private Tesseract tesseract;
        private final CustomerDataRepository customerDataRepository;
        private final ReviewRepository reviewRepository;

        public OcrService(CustomerDataRepository customerDataRepository,ReviewRepository reviewRepository) {
            this.tesseract = new Tesseract();
            tesseract.setDatapath("C:/Program Files/Tesseract-OCR/tessdata");
            this.customerDataRepository=customerDataRepository;
            this.reviewRepository=reviewRepository;
        }

//    private void runPythonScript() {
//        try {
//            String command = "python C:/Users/nithi/Downloads/webScrapping.py/" ;  // Change the path to your Python script
//
//            ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
//            processBuilder.redirectErrorStream(true);
//
//            Process process = processBuilder.start();
//            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//            String line;
//            while ((line = reader.readLine()) != null) {
//                System.out.println(line);
//            }
//
//            int exitCode = process.waitFor();
//            if (exitCode == 0) {
//                System.out.println("Python script executed successfully.");
//            } else {
//                System.err.println("Error executing Python script.");
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

        public List<String> processPdfFolder(String folderPath) {
            List<String> extractedTexts = new ArrayList<>();
            File folder = new File(folderPath);
            File[] files = folder.listFiles((dir, name) -> name.endsWith(".pdf"));  // Only select PDF files
            //runPythonScript();

            List<String> filePaths = getFileList(folderPath);
            List<CustomerData> cd=new ArrayList<>();

            if (files != null) {
                try {
                    for (File file : files) {
                        List<BufferedImage> images = convertPdfToImages(file);
                        for (BufferedImage image : images) {
                            String text = performOcr(image);
                            String receiptNumber = extractReceiptNumber(text);
                            String customerName = extractCustomerName(text);
                            String date = extractDate(text);
                            String location = extractLocation(text);
                            String tax = extractTax(text);
                            String totalAmount = extractTotalAmount(text);
                            String productName=extractProductName(text);
                            extractedTexts.add(text);
                            Optional<Reviews> matchedReview = findMatchingReview(productName);
                            CustomerData customerData=null;

                            if (matchedReview.isPresent()) {
                                Reviews review = matchedReview.get();
                                System.out.println(receiptNumber + " " + customerName + " " + date + " " + location + " " + tax + " " + totalAmount);
                                customerData = new CustomerData(
                                        receiptNumber, customerName, date, location, productName, tax, totalAmount,
                                        review.getRating(), review.getReviewCount(),
                                       review.getSentimentalAnalysis()
                                );


                                customerDataRepository.save(customerData);
                            }
                            else {
                                customerData = new CustomerData(receiptNumber, customerName, date, location,productName, tax, totalAmount, 0.0, 0,0.0);
                                customerDataRepository.save(customerData);
                            }

                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            System.out.println("I am below if");

            return extractedTexts;
        }

    private Double parseSentimentScore(String sentimentStr) {
        if (sentimentStr == null) return 0.0;
        Matcher matcher = Pattern.compile("\\(([-+]?[0-9]*\\.?[0-9]+)\\)").matcher(sentimentStr);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }
        return 0.0;
    }

    public static String extractProductName(String text) {
        String[] lines = text.split("\n");
        boolean isProductSection = false;
        StringBuilder productNameBuilder = new StringBuilder();

        for (String line : lines) {
            line = line.trim();

            if (line.toLowerCase().contains("description")) {
                isProductSection = true;
                continue;
            }

            if (line.toLowerCase().contains("subtotal") || line.toLowerCase().contains("state sales tax")) {
                break;
            }
            if (isProductSection && !line.isEmpty()) {
                String cleanedLine = line.replaceAll("\\s*\\$?\\d+[,.\\d]*$", "").trim();

                cleanedLine = cleanedLine.replaceAll("[^a-zA-Z0-9\\s]", "");

                if (!cleanedLine.isEmpty()) {
                    productNameBuilder.append(cleanedLine).append(", ");
                }
            }
        }

        String result = productNameBuilder.toString().trim();

        if (result.endsWith(",")) {
            result = result.substring(0, result.length() - 1);
        }

        return result.isEmpty() ? "Unknown" : result;
    }


    public static List<String> getFileList(String folderPath) {
            final List<String> filePaths = new ArrayList<>();
            try {
                Files.walkFileTree(Paths.get(folderPath), new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                        filePaths.add(file.toString());
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
                        System.err.println(exc);
                        return FileVisitResult.CONTINUE;
                    }
                });
            } catch (IOException e) {
                e.printStackTrace();
            }
            return filePaths;
        }
        public static String extractReceiptNumber(String text) {
            Pattern pattern = Pattern.compile("Invoice # (\\d+)");
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                return matcher.group(1);
            }
            return "Not Found";
        }

    private Optional<Reviews> findMatchingReview(String productName) {
        if (productName == null || productName.isEmpty()) return Optional.empty();

        String regex = Arrays.stream(productName.toLowerCase().split("\\s+"))
                .map(Pattern::quote)
                .collect(Collectors.joining("|")); // e.g., "iphone|15|pro"

        Pattern pattern = Pattern.compile(regex);

        for (Reviews review : reviewRepository.findAll()) {
            if (review.getTitle() == null) continue;

            String reviewTitle = review.getTitle().toLowerCase();
            Matcher matcher = pattern.matcher(reviewTitle);
            int matchCount = 0;
            while (matcher.find()) matchCount++;

            if (matchCount >= 1) return Optional.of(review);
        }

        return Optional.empty();
    }




    public Map<String, Double> getAverageSalesByWeek() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        List<CustomerData> dataList = customerDataRepository.findAll();

        return dataList.stream()
                .filter(data -> data.getDate() != null && !data.getDate().isEmpty())
                .collect(Collectors.groupingBy(
                        data -> LocalDate.parse(data.getDate(), formatter).with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toString(),
                        Collectors.averagingDouble(data -> Double.parseDouble(data.getTotal().replace("$", "")))
                ));
    }

    public Map<String, Double> getAverageSalesByMonth() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        List<CustomerData> dataList = customerDataRepository.findAll();

        return dataList.stream()
                .filter(data -> data.getDate() != null && !data.getDate().isEmpty())
                .collect(Collectors.groupingBy(
                        data -> LocalDate.parse(data.getDate(), formatter).withDayOfMonth(1).toString(),
                        Collectors.averagingDouble(data -> Double.parseDouble(data.getTotal().replace("$", "")))
                ));
    }

    public static String extractCustomerName(String receiptText) {
        Pattern pattern = Pattern.compile("\\d{6}\\s([A-Za-z\\s]+)\\sInvoice\\sDate");
        Matcher matcher = pattern.matcher(receiptText);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "";
    }



    public static String extractTotalAmount(String receiptText) {
            String temp="";

                int n=receiptText.indexOf("$");
                int f=0;
                for(int i=n;i<receiptText.length();i++) {
                    if(receiptText.charAt(i) !='\n') {
                        f=i;
                    }
                }

                temp=receiptText.substring(n,f);
            return  temp;
        }
    public static String extractLocation(String receiptText) {
        String lines[] = receiptText.split("\n");
        String location = "";
        boolean foundInvoiceDate = false;
        for (String line : lines) {
            if (line.contains("Invoice Date")) {
                foundInvoiceDate = true;
            }
            if (foundInvoiceDate) {
                if (line.contains("DESCRIPTION")) {
                    break;
                }
                location = line.trim();
            }
        }
        return location;
    }


    public static String extractTax(String text) {
            String lines[]=text.split("\n");
            String temp="";
            for(String line:lines) {
                if(line.contains("State sales tax 6.5%")) {
                    temp=line;
                }
            }
            String words[]=temp.split("\\s");
            return words[words.length-1];
        }

        public static String extractDate(String text) {
            String lines[]=text.split("\n");
            String temp="";
            for(String line:lines) {
                if(line.contains("Invoice Date ")) {
                    temp=line;
                }
            }
            String words[]=temp.split("\\s");
            return words[words.length-1];
        }

        private List<BufferedImage> convertPdfToImages(File pdfFile) throws IOException {
            List<BufferedImage> images = new ArrayList<>();
            PDDocument document = PDDocument.load(pdfFile);
            PDFRenderer pdfRenderer = new PDFRenderer(document);

            int numPages = document.getNumberOfPages();
            for (int pageIndex = 0; pageIndex < numPages; pageIndex++) {
                BufferedImage image = pdfRenderer.renderImageWithDPI(pageIndex, 300);  // Render at 300 DPI
                images.add(image);
            }

            document.close();
            return images;
        }

        private String performOcr(BufferedImage image) {
            try {
                return tesseract.doOCR(image);
            } catch (Exception e) {
                System.err.println("Error during OCR: " + e.getMessage());
                e.printStackTrace();
            }
            return "";
        }
    }
