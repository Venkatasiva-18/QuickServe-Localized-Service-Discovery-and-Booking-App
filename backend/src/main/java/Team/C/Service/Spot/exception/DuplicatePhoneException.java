package Team.C.Service.Spot.exception;

/**
 * Exception thrown when attempting to register with a phone number that already exists
 */
public class DuplicatePhoneException extends RuntimeException {

    public DuplicatePhoneException(String phone) {
        super(String.format("Phone number already registered: %s", phone));
    }
}

