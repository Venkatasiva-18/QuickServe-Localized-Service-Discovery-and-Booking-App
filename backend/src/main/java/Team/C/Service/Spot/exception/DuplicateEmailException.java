package Team.C.Service.Spot.exception;

/**
 * Exception thrown when attempting to register with an email that already exists
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super(String.format("Email already registered: %s", email));
    }
}

