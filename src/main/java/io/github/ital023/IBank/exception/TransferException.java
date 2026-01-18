package io.github.ital023.IBank.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class TransferException extends IBankException {

    private final String detail;

    public TransferException(String detail) {
        super(detail);
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        var pd = ProblemDetail.forStatus(HttpStatus.UNPROCESSABLE_ENTITY);

        pd.setDetail("Transfer not allowed");
        pd.setDetail(detail);

        return pd;
    }
}
