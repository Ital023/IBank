package io.github.ital023.IBank.exception;

import org.springframework.http.ProblemDetail;

public abstract class IBankException extends RuntimeException {
    public IBankException(String message) {
        super(message);
    }

    public IBankException(Throwable cause) {
        super(cause);
    }

    public ProblemDetail toProblemDetail() {
        var pd = ProblemDetail.forStatus(500);

        pd.setTitle("Ibank Internal Server Error");
        pd.setDetail("Contact Ibank support");

        return pd;
    }
}
