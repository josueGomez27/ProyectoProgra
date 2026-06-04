package cr.ac.una.turismolocal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "places")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "town_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "places"})
    private Town town;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "places"})
    private Category category;

    @JsonProperty("name")
    @Column(nullable = false)
    private String name;

    @JsonProperty("description")
    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonProperty("address")
    private String address;

    @JsonProperty("imageUrl")
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @JsonProperty("latitude")
    private Double latitude;

    @JsonProperty("longitude")
    private Double longitude;

    @JsonProperty("active")
    private Boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonManagedReference(value = "place-images")
    @OneToMany(mappedBy = "place")
    private List<PlaceImage> images;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.active == null) this.active = true;
    }
}