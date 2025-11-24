package com.dashboardia.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = DniValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDni {
    String message() default "DNI no válido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}