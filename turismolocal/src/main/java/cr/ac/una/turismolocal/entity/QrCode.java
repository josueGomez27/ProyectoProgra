package cr.ac.una.turismolocal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "qr_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QrCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "town_id")
    private Town town;

    @Column(columnDefinition = "TEXT")
    private String qrValue;

    @Column(columnDefinition = "TEXT")
    private String qrImageUrl;

    private Boolean active;

    private LocalDateTime createdAt;
}