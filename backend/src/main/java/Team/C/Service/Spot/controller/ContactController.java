package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Contact;
import Team.C.Service.Spot.services.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {
    
    private final ContactService contactService;
    
    @GetMapping
    public ResponseEntity<List<Contact>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMessageById(@PathVariable Long id) {
        return contactService.getMessageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/unresolved")
    public ResponseEntity<List<Contact>> getUnresolvedMessages() {
        return ResponseEntity.ok(contactService.getUnresolvedMessages());
    }
    
    @GetMapping("/resolved")
    public ResponseEntity<List<Contact>> getResolvedMessages() {
        return ResponseEntity.ok(contactService.getResolvedMessages());
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Contact>> getMessagesByEmail(@PathVariable String email) {
        return ResponseEntity.ok(contactService.getMessagesByEmail(email));
    }
    
    @PostMapping
    public ResponseEntity<Contact> createMessage(@RequestBody Contact contact) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.createMessage(contact));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMessage(@PathVariable Long id, @RequestBody Contact contact) {
        Contact updated = contactService.updateMessage(id, contact);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolveMessage(@PathVariable Long id) {
        Contact resolved = contactService.resolveMessage(id);
        if (resolved != null) {
            return ResponseEntity.ok(resolved);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        if (contactService.deleteMessage(id)) {
            return ResponseEntity.ok("Message deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
