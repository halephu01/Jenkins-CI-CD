package com.nhom6.microservices.identity_service.service;

import com.nhom6.microservices.identity_service.dto.request.AuthenticationRequest;
import com.nhom6.microservices.identity_service.dto.request.IntrospectRequest;
import com.nhom6.microservices.identity_service.dto.request.LogoutRequest;
import com.nhom6.microservices.identity_service.dto.request.RefreshRequest;
import com.nhom6.microservices.identity_service.dto.respone.AuthenticationRespone;
import com.nhom6.microservices.identity_service.dto.respone.IntrospectResponse;
import com.nhom6.microservices.identity_service.entity.InvalidatedToken;
import com.nhom6.microservices.identity_service.entity.User;
import com.nhom6.microservices.identity_service.exception.AppException;
import com.nhom6.microservices.identity_service.exception.ErrorCode;
import com.nhom6.microservices.identity_service.repository.InvalidatedTokenRepository;
import com.nhom6.microservices.identity_service.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;


    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;


    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESH_DURATION;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();

        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }


        return  IntrospectResponse.builder()
                .valid(isValid)
                .build();

    }


    public AuthenticationRespone authenticated(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername()).
                orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated  = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if(!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = generateToken(user);
        var role = user.getRoles();
        return AuthenticationRespone.builder()
                .token(token)
                .isAuthenticated(true)
                .role(role)
                .build();

    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {

        try {
            var signToken = verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime  = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        }
        catch (AppException e) {
            log.info("Token already expired");
        }

    }

    public AuthenticationRespone RefreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken(), true);

        var jit = signJWT.getJWTClaimsSet().getJWTID();
        var expiryTime  = signJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);

        var username = signJWT.getJWTClaimsSet().getSubject();

        var user = userRepository.findByUsername(username).orElseThrow(()->new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user);

        return AuthenticationRespone.builder()
                .token(token)
                .isAuthenticated(true)
                .build();

    }

    private  SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {


        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);


        Date expirationTime =(isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESH_DURATION,ChronoUnit.HOURS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);
        if(!(verified && expirationTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if(invalidatedTokenRepository
                .existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }


    private String generateToken(User user) {


        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);


        JWTClaimsSet jwtClaimsSet  =  new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("amiby.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create JWT object", e);
            throw new RuntimeException(e);
        }
    }
    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())){
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())){}
                role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });
        }


        return stringJoiner.toString();
    }
}
