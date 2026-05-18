package com.backend.attendance.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.List;
import java.util.ArrayList;

@Converter
public class DoubleListConverter implements AttributeConverter<List<Double>, String> {
    @Override
    public String convertToDatabaseColumn(List<Double> list) {
        if (list == null) return null;
        return list.stream().map(String::valueOf).collect(Collectors.joining(","));
    }
    @Override
    public List<Double> convertToEntityAttribute(String s) {
        if (s == null || s.isEmpty()) return new ArrayList<>();
        return Arrays.stream(s.split(",")).map(Double::valueOf).collect(Collectors.toList());
    }
}
