package com.automate.DataEx.Controller;

import com.automate.DataEx.Model.CustomerData;
import com.automate.DataEx.Repository.CustomerDataRepository;
import com.automate.DataEx.Service.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
public class OcrController {

    private final OcrService ocrService;
    private final CustomerDataRepository customerDataRepository;

    @GetMapping("/process-folder")
    public List<String> processFilesInFolder(@RequestParam String folderPath) {
        return ocrService.processPdfFolder(folderPath);
    }


    @GetMapping("/get-all-data")
    public List<CustomerData> getAllCustomerData() {
        try {
            return customerDataRepository.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    @Transactional
    @DeleteMapping("/deleteAll")
    public ResponseEntity<?> deleteAll(){
        try{
            customerDataRepository.deleteAll();
            return ResponseEntity.ok().build();
        }
        catch(Exception e){
            System.err.println(e);
            return ResponseEntity.internalServerError().build();
        }

    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCustomerData(@PathVariable Long id) {
        try {
            if (customerDataRepository.existsById(id)) {
                customerDataRepository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomerData> updateCustomerData(@PathVariable Long id, @RequestBody CustomerData customerData) {
        try {
            if (customerDataRepository.existsById(id)) {
                customerData.setId(id);
                CustomerData updatedData = customerDataRepository.save(customerData);
                return ResponseEntity.ok(updatedData);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
