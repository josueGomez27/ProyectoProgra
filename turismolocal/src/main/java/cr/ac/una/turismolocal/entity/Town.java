package cr.ac.una.turismolocal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "towns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Town {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String province;

    private String canton;

    private String district;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String qrCodeUrl;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "town")
    private List<Place> places;

    @JsonManagedReference(value = "town-qrcodes")
    @OneToMany(mappedBy = "town")
    private List<QrCode> qrCodes;
}