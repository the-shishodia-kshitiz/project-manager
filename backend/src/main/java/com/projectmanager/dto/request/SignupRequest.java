package com.projectmanager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$", message = "Min 8 chars, 1 uppercase, 1 digit")
    private String password;
}
