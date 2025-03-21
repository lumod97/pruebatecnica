package com.sintad.technicaltest.Exceptions;

public class InvalidArticleDataException extends RuntimeException {

    public InvalidArticleDataException(String message) {
        super(message);
    }
}