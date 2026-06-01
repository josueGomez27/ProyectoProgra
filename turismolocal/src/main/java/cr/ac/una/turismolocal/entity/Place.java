package cr.ac.una.turismolocal.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "places")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference(value = "town-places")
    @ManyToOne
    @JoinColumn(name = "town_id")
    private Town town;

    @JsonBackReference(value = "category-places")
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String address;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @JsonManagedReference(value = "place-images")
    @OneToMany(mappedBy = "place")
    private List<PlaceImage> images;
}