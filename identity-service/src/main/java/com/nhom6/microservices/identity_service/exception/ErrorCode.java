package com.nhom6.microservices.identity_service.exception;


import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY_EXCEPTION(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "Username đã tồn tại", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username phải có ít nhất 3 ký tự", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password phải có ít nhất 8 ký tự", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    ;

    int Code;
    String Message;
    HttpStatusCode httpStatusCode;
    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.Code = code;
        this.Message = message;
        this.httpStatusCode = httpStatusCode;
    }

}
