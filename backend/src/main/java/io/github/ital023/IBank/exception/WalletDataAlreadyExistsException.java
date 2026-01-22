package io.github.ital023.IBank.exception;

import org.springframework.http.ProblemDetail;

public class WalletDataAlreadyExistsException extends IBankException {

    private final String detail;

    public WalletDataAlreadyExistsException(String detail) {
        super(detail);
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        var pd = ProblemDetail.forStatus(422);
        pd.setTitle("Wallet data already exists");
        pd.setDetail(detail);
        return pd;
    }
}
