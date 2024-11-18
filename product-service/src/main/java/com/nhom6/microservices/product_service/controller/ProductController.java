package com.nhom6.microservices.product_service.controller;

import com.nhom6.microservices.product_service.dto.ProductRequest;
import com.nhom6.microservices.product_service.dto.ProductRespone;
import com.nhom6.microservices.product_service.model.Product;
import com.nhom6.microservices.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    // Create a product
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductRespone createProduct(@RequestBody ProductRequest productRequest) {
        return productService.createProduct(productRequest);
    }
    // Get all product
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductRespone> getProduct() {
        return productService.getAllProducts();
    }
    // Get one product
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductRespone getProduct(@PathVariable String id) {
        return productService.getProductById(id);
    }
    // Get product by type
    @GetMapping("/type/{type}")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductRespone> getProductByType(@PathVariable String type) {
        return productService.getProductByType(type);
    }
    // Update one product
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductRespone updateProduct(@PathVariable String id, @RequestBody ProductRequest productRequest){
        return productService.updateProduct(id, productRequest);
    }

    //  Delete all product
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAllProducts() {
        productService.deleteAllProducts();
    }
    // Delete one product
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id){
        productService.deleteProduct(id);
    }
}
