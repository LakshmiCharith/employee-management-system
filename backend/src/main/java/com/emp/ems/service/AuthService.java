package com.emp.ems.service;

import com.emp.ems.dto.ForgotPasswordRequest;
import com.emp.ems.dto.JwtResponse;
import com.emp.ems.dto.LoginRequest;
import com.emp.ems.dto.ResetPasswordRequest;

import com.emp.ems.dto.SignupRequestDTO;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    void registerUser(SignupRequestDTO signupRequest);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    JwtResponse getCurrentUser(String username);
}
