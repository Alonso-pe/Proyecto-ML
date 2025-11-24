package com.dashboardia.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LogOutRequest {
    @NotNull
    private Long userId;
}
